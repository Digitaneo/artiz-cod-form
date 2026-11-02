import { ShopifyService } from "./shopify.service.js";
import { OrdersRepository } from "../repositories/orders.repository.js";
import { CustomerService } from "./customer.service.js";
import { AnalyticsService } from "./analytics.service.js";

export class OrderService {
  constructor(env) {
    this.env = env;
    this.shopifyService = new ShopifyService(env);
    this.ordersRepo = new OrdersRepository(env);
    this.customerService = new CustomerService(env);
    this.analyticsService = new AnalyticsService(env);
  }

  async getShopCountry(shop) {
    try {
      const res = await this.shopifyService.adminRequest(shop, "{ shop { billingAddress { country countryCodeV2 } } }");
      return res.data?.shop?.billingAddress?.country || "Morocco";
    } catch {
      return "Morocco";
    }
  }

  async createPublicCODOrder(shop, customer, items, shippingPrice = 0, note = "", options = {}) {
    const nameParts = customer.name.trim().split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const lineItems = items.map(item => {
      const lineItem = {
        variantId: String(item.variantId).includes("gid://")
          ? item.variantId
          : `gid://shopify/ProductVariant/${item.variantId}`,
        quantity: Number(item.quantity || 1)
      };

      const unitDiscount = Number(item.unitDiscount || 0);
      const originalPrice = Number(item.originalPrice || 0);
      const price = Number(item.price || 0);

      // Apply line-level discount if present
      if (unitDiscount > 0) {
        lineItem.appliedDiscount = {
          title: item.discountTitle || "تخفيض السلة (خصم)",
          value: unitDiscount,
          valueType: "FIXED_AMOUNT"
        };
      } else if (originalPrice > price && price > 0) {
        const diff = Number((originalPrice - price).toFixed(2));
        if (diff > 0) {
          lineItem.appliedDiscount = {
            title: item.discountTitle || "تخفيض السلة (خصم)",
            value: diff,
            valueType: "FIXED_AMOUNT"
          };
        }
      } else if (price > 0) {
        lineItem.originalUnitPrice = String(price.toFixed(2));
      }

      // Preserve per-item line properties (e.g. BixGrow _bg_aff, _bg_click_id, GoAffPro, custom options)
      const isInternalFlag = (k, v) => {
        if (!k) return true;
        const ks = String(k).toLowerCase().trim();
        const vs = String(v !== undefined && v !== null ? v : "").toLowerCase().trim();
        if (ks.startsWith("bg_flag_") || ks.includes("_flag_") || ks.includes("flag_app")) return true;
        if (ks === "bgaffilite_id" || ks.startsWith("bgaffilite") || ks === "bgaffiliate_id" || ks.startsWith("bg_affilite") || ks.startsWith("bgaff")) return true;
        if (vs === "called" || vs === "true" || vs === "false" || vs === "") return true;
        return false;
      };

      const itemCustomAttrs = [];
      if (item.properties && typeof item.properties === "object") {
        if (Array.isArray(item.properties)) {
          for (const prop of item.properties) {
            if (prop && (prop.key || prop.name) && prop.value !== undefined && prop.value !== null) {
              const pk = String(prop.key || prop.name);
              const pv = String(prop.value);
              if (!isInternalFlag(pk, pv)) {
                itemCustomAttrs.push({ key: pk, value: pv });
              }
            }
          }
        } else {
          for (const [k, v] of Object.entries(item.properties)) {
            if (v !== undefined && v !== null && String(v).trim() !== "" && !isInternalFlag(k, v)) {
              itemCustomAttrs.push({
                key: String(k),
                value: String(v)
              });
            }
          }
        }
      } else if (Array.isArray(item.customAttributes)) {
        for (const attr of item.customAttributes) {
          if (attr && attr.key && attr.value !== undefined && attr.value !== null && !isInternalFlag(attr.key, attr.value)) {
            itemCustomAttrs.push({ key: String(attr.key), value: String(attr.value) });
          }
        }
      }

      // If affiliate tracking is present globally and item does not have it, attach clean tracking
      if (options.affiliate && typeof options.affiliate === "object") {
        for (const [affKey, affVal] of Object.entries(options.affiliate)) {
          if (affVal && !isInternalFlag(affKey, affVal) && !itemCustomAttrs.some(a => a.key === affKey)) {
            itemCustomAttrs.push({ key: String(affKey), value: String(affVal) });
          }
        }
      }

      if (itemCustomAttrs.length > 0) {
        lineItem.customAttributes = itemCustomAttrs;
      }

      return lineItem;
    });

    const cleanCustomerNote = (note || customer.note || "").trim();

    // Clean Tags: strictly include configured Order Tag (default: "Artiz-Form") and Payment Method (e.g. "Cash on Delivery")
    const tags = [];
    const mainOrderTag = (options.orderTag && typeof options.orderTag === "string" && options.orderTag.trim())
      ? options.orderTag.trim()
      : "Artiz-Form";
    tags.push(mainOrderTag);

    if (Array.isArray(options.tags) && options.tags.length > 0) {
      for (const t of options.tags) {
        if (
          t &&
          t !== "Artiz COD OS" &&
          t !== "Artiz Quick Order" &&
          t !== "Pending Confirmation" &&
          !tags.includes(t)
        ) {
          tags.push(t);
        }
      }
    } else {
      if (!tags.includes("Cash on Delivery")) {
        tags.push("Cash on Delivery");
      }
    }

    const customAttributes = Array.isArray(options.customAttributes) ? [...options.customAttributes] : [];

    // Capture clean Affiliate tracking data for note_attributes (BixGrow, GoAffPro, UpPromote, etc.)
    if (options.affiliate && typeof options.affiliate === "object") {
      const isInternalFlag = (k, v) => {
        if (!k) return true;
        const ks = String(k).toLowerCase().trim();
        const vs = String(v !== undefined && v !== null ? v : "").toLowerCase().trim();
        if (ks.startsWith("bg_flag_") || ks.includes("_flag_") || ks.includes("flag_app")) return true;
        if (ks === "bgaffilite_id" || ks.startsWith("bgaffilite") || ks === "bgaffiliate_id" || ks.startsWith("bg_affilite") || ks.startsWith("bgaff")) return true;
        if (vs === "called" || vs === "true" || vs === "false" || vs === "") return true;
        return false;
      };
      for (const [key, value] of Object.entries(options.affiliate)) {
        if (value && !isInternalFlag(key, value) && !customAttributes.some(a => a.key === key)) {
          customAttributes.push({ key: String(key), value: String(value) });
        }
      }
    }

    if (options.discountCode) {
      customAttributes.push({ key: "discount_code", value: String(options.discountCode) });
    }

    const shopCountry = await this.getShopCountry(shop);
    const targetCountry = customer.country || shopCountry || "Morocco";
    const defaultCity = customer.city || (
      targetCountry.toLowerCase() === "iraq" ? "بغداد" :
      targetCountry.toLowerCase() === "algeria" ? "الجزائر" :
      targetCountry.toLowerCase() === "saudi arabia" ? "الرياض" :
      "الدار البيضاء"
    );

    // Format phone to clean E.164 standard (no spaces) so Shopify creates customer and contact info
    const cleanPhoneDigits = String(customer.phone || "").trim().replace(/[\s\-\(\)]/g, "");
    let formattedPhone = cleanPhoneDigits;
    if (!formattedPhone.startsWith("+")) {
      if (formattedPhone.startsWith("00")) {
        formattedPhone = "+" + formattedPhone.slice(2);
      } else {
        const countryPrefixes = {
          "morocco": "+212",
          "saudi arabia": "+966",
          "united arab emirates": "+971",
          "iraq": "+964",
          "egypt": "+20",
          "kuwait": "+965",
          "qatar": "+974",
          "oman": "+968",
          "bahrain": "+973",
          "algeria": "+213",
          "tunisia": "+216"
        };
        const prefix = countryPrefixes[targetCountry.toLowerCase()] || "+212";
        formattedPhone = formattedPhone.startsWith("0")
          ? `${prefix}${formattedPhone.slice(1)}`
          : `${prefix}${formattedPhone}`;
      }
    }

    // Lookup existing customer ID by phone if not passed directly
    let existingCustomerId = customer.id ? Number(customer.id) : null;
    if (!existingCustomerId) {
      try {
        const searchRes = await this.shopifyService.restRequest(
          shop,
          `customers/search.json?query=${encodeURIComponent("phone:" + formattedPhone)}`,
          "GET"
        );
        if (searchRes?.customers && searchRes.customers.length > 0) {
          existingCustomerId = searchRes.customers[0].id;
        }
      } catch (searchErr) {
        console.warn("Customer phone search warning:", searchErr?.message);
      }
    }

    // Sanitize address1 to ensure city is not repeated inside address1
    let cleanAddress = String(customer.address || "").trim();
    if (defaultCity && cleanAddress) {
      const cityRegexStart = new RegExp(`^${defaultCity}[\\s،,-]+`, "i");
      const cityRegexEnd = new RegExp(`[\\s،,-]+${defaultCity}$`, "i");
      const stripped = cleanAddress.replace(cityRegexStart, "").replace(cityRegexEnd, "").trim();
      if (stripped.length >= 2) {
        cleanAddress = stripped;
      }
    }

    // Ensure customer has phone on profile if missing (without appending duplicate address records)
    if (existingCustomerId && formattedPhone) {
      try {
        await this.shopifyService.restRequest(
          shop,
          `customers/${existingCustomerId}.json`,
          "PUT",
          {
            customer: {
              id: existingCustomerId,
              phone: formattedPhone
            }
          }
        );
      } catch (updateCustErr) {
        console.warn("Customer profile phone sync warning:", updateCustErr?.message);
      }
    }

    // Method 1: DraftOrder Instant Completion (Primary: Enables Shopify Admin Order Editing, Customer Profile Link & Addresses)
    try {
      const draftOrderMutation = `
        mutation createCODOrder($input: DraftOrderInput!) {
          draftOrderCreate(input: $input) {
            draftOrder { id name }
            userErrors { field message }
          }
        }
      `;

      const draftOrderInput = {
        lineItems,
        note: cleanCustomerNote || undefined,
        tags,
        customAttributes,
        shippingAddress: {
          firstName,
          lastName,
          phone: formattedPhone,
          address1: cleanAddress,
          city: defaultCity,
          province: customer.region || customer.province || undefined,
          country: targetCountry
        },
        billingAddress: {
          firstName,
          lastName,
          phone: formattedPhone,
          address1: cleanAddress,
          city: defaultCity,
          province: customer.region || customer.province || undefined,
          country: targetCountry
        },
        phone: formattedPhone,
        email: customer.email || undefined,
        shippingLine: {
          title: options.shippingTitle || "توصيل سريع لجميع المدن",
          price: Number(shippingPrice || 0)
        }
      };

      if (existingCustomerId) {
        draftOrderInput.purchasingEntity = {
          customerId: `gid://shopify/Customer/${existingCustomerId}`
        };
      }

      if (options.discountAmount && Number(options.discountAmount) > 0) {
        draftOrderInput.appliedDiscount = {
          title: options.discountCode || "COD Discount",
          value: Number(options.discountAmount),
          valueType: "FIXED_AMOUNT"
        };
      } else if (options.discountPercent && Number(options.discountPercent) > 0) {
        draftOrderInput.appliedDiscount = {
          title: options.discountCode || "COD Discount",
          value: Number(options.discountPercent),
          valueType: "PERCENTAGE"
        };
      }

      const draftData = await this.shopifyService.adminRequest(shop, draftOrderMutation, { input: draftOrderInput });

      if (draftData.data?.draftOrderCreate?.userErrors?.length > 0) {
        const errs = draftData.data.draftOrderCreate.userErrors.map(e => e.message).join(", ");
        throw new Error(`Shopify Draft Order Error: ${errs}`);
      }

      const draftOrderId = draftData.data.draftOrderCreate.draftOrder.id;

      const isPaidOrder = options.paymentPending === false;
      const paymentPendingVal = !isPaidOrder;

      const completeMutation = `
        mutation completeOrder($id: ID!, $paymentPending: Boolean!) {
          draftOrderComplete(id: $id, paymentPending: $paymentPending) {
            draftOrder {
              order {
                id
                name
                totalPriceSet { shopMoney { amount currencyCode } }
              }
            }
            userErrors { field message }
          }
        }
      `;

      const completeData = await this.shopifyService.adminRequest(shop, completeMutation, {
        id: draftOrderId,
        paymentPending: paymentPendingVal
      });

      if (completeData.data?.draftOrderComplete?.userErrors?.length > 0) {
        const errs = completeData.data.draftOrderComplete.userErrors.map(e => e.message).join(", ");
        throw new Error(`Shopify Complete Order Error: ${errs}`);
      }

      const createdOrder = completeData.data.draftOrderComplete.draftOrder.order;
      const numericOrderId = createdOrder.id.split("/").pop();
      const orderTotal = Number(createdOrder.totalPriceSet?.shopMoney?.amount || 0);
      const currency = createdOrder.totalPriceSet?.shopMoney?.currencyCode || "USD";

      // Fetch order details for order_status_url
      let thankYouUrl = `/pages/thank-you?order_id=${numericOrderId}&shop=${shop}`;
      try {
        const orderDetails = await this.shopifyService.restRequest(shop, `orders/${numericOrderId}.json`, "GET");
        if (orderDetails?.order?.order_status_url) {
          thankYouUrl = orderDetails.order.order_status_url;
        }
      } catch (_) {}

      const codOrderRecord = {
        orderId: `gid://shopify/Order/${numericOrderId}`,
        orderNumber: createdOrder.name,
        customer: {
          name: `${firstName} ${lastName}`.trim(),
          phone: formattedPhone,
          city: customer.city,
          province: customer.region || customer.province || "",
          address: customer.address
        },
        total: orderTotal,
        currency,
        paymentMethod: options.paymentMethod || (isPaidOrder ? "PAID_ONLINE" : "COD"),
        codStage: isPaidOrder ? "PAID" : "NEW",
        callStatus: isPaidOrder ? "CONFIRMED" : "PENDING",
        createdAt: new Date().toISOString()
      };

      await this.ordersRepo.saveCODOrder(shop, numericOrderId, codOrderRecord);
      await this.customerService.recordOrderForCustomer(shop, formattedPhone, codOrderRecord);
      await this.analyticsService.recordNewOrder(shop, orderTotal);

      return {
        orderId: numericOrderId,
        orderNumber: createdOrder.name,
        total: `${orderTotal} ${currency}`,
        thankYouUrl
      };
    } catch (draftErr) {
      console.warn("Draft order creation failed, falling back to direct REST order:", draftErr?.message);
    }

    // Method 2: Fallback to Direct REST Order Creation
    try {
      const restOrderPayload = {
        order: {
          processed_at: new Date().toISOString(),
          phone: formattedPhone,
          email: customer.email || undefined,
          line_items: items.map(item => {
            const rawId = String(item.variantId).replace("gid://shopify/ProductVariant/", "");
            const restItem = {
              variant_id: Number(rawId),
              quantity: Number(item.quantity || 1)
            };
            if (item.price !== undefined && item.price !== null) {
              restItem.price = String(Number(item.price).toFixed(2));
            }
            if (item.properties && typeof item.properties === "object") {
              if (Array.isArray(item.properties)) {
                restItem.properties = item.properties.map(p => ({
                  name: String(p.name || p.key),
                  value: String(p.value)
                }));
              } else {
                restItem.properties = Object.entries(item.properties).map(([name, value]) => ({
                  name: String(name),
                  value: String(value)
                }));
              }
            }
            return restItem;
          }),
          customer: existingCustomerId ? { id: existingCustomerId } : {
            first_name: firstName,
            last_name: lastName,
            phone: formattedPhone,
            email: customer.email || undefined,
            verified_email: false,
            send_email_welcome: false
          },
          billing_address: {
            first_name: firstName,
            last_name: lastName,
            phone: formattedPhone,
            address1: cleanAddress,
            city: defaultCity,
            province: customer.region || customer.province || undefined,
            country: targetCountry
          },
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            phone: formattedPhone,
            address1: cleanAddress,
            city: defaultCity,
            province: customer.region || customer.province || undefined,
            country: targetCountry
          },
          financial_status: options.paymentPending === false ? "paid" : "pending",
          tags: tags.join(", "),
          note: cleanCustomerNote || undefined,
          note_attributes: customAttributes.map(a => ({ name: String(a.key), value: String(a.value) })),
          shipping_lines: [
            {
              title: options.shippingTitle || "توصيل سريع لجميع المدن",
              price: String(Number(shippingPrice || 0).toFixed(2))
            }
          ]
        }
      };

      if (options.discountCode) {
        restOrderPayload.order.discount_codes = [
          {
            code: options.discountCode,
            amount: String(options.discountAmount || 0),
            type: "percentage"
          }
        ];
      }

      if (options.clientDetails) {
        restOrderPayload.order.client_details = {
          browser_ip: options.clientDetails.browser_ip || undefined,
          user_agent: options.clientDetails.user_agent || undefined
        };
      }

      const restRes = await this.shopifyService.restRequest(shop, "orders.json", "POST", restOrderPayload);
      if (restRes?.order) {
        const order = restRes.order;
        const numericOrderId = String(order.id);
        const orderTotal = Number(order.total_price || 0);

        const codOrderRecord = {
          orderId: `gid://shopify/Order/${numericOrderId}`,
          orderNumber: order.name,
          customer: {
            name: `${firstName} ${lastName}`.trim(),
            phone: formattedPhone,
            city: customer.city,
            address: customer.address
          },
          total: orderTotal,
          currency: order.currency,
          codStage: "NEW",
          callStatus: "PENDING",
          createdAt: new Date().toISOString()
        };

        await this.ordersRepo.saveCODOrder(shop, numericOrderId, codOrderRecord);
        await this.customerService.recordOrderForCustomer(shop, formattedPhone, codOrderRecord);
        await this.analyticsService.recordNewOrder(shop, orderTotal);

        return {
          orderId: numericOrderId,
          orderNumber: order.name,
          total: `${orderTotal} ${order.currency}`,
          thankYouUrl: order.order_status_url || `/pages/thank-you?order_id=${numericOrderId}&shop=${shop}`
        };
      }
    } catch (restErr) {
      throw new Error(`Order Creation Failed: ${restErr?.message}`);
    }
  }

  async getPublicOrderDetails(shop, orderId) {
    const fullOrderId = String(orderId).includes("gid://")
      ? orderId
      : `gid://shopify/Order/${orderId}`;

    const query = `
      query getOrderDetails($id: ID!) {
        order(id: $id) {
          id
          name
          createdAt
          totalPriceSet { shopMoney { amount currencyCode } }
          shippingAddress { name phone city address1 }
          lineItems(first: 20) {
            edges {
              node {
                title
                quantity
                originalUnitPriceSet { shopMoney { amount currencyCode } }
              }
            }
          }
        }
      }
    `;

    const data = await this.shopifyService.adminRequest(shop, query, { id: fullOrderId });

    if (!data.data?.order) {
      throw new Error("Order not found");
    }

    const order = data.data.order;
    const items = order.lineItems.edges.map(e => ({
      title: e.node.title,
      quantity: e.node.quantity,
      price: `${e.node.originalUnitPriceSet?.shopMoney?.amount} ${e.node.originalUnitPriceSet?.shopMoney?.currencyCode}`
    }));

    return {
      id: order.id,
      orderNumber: order.name,
      date: order.createdAt,
      total: `${order.totalPriceSet?.shopMoney?.amount} ${order.totalPriceSet?.shopMoney?.currencyCode}`,
      shippingAddress: order.shippingAddress,
      items
    };
  }

  async createPublicPaidOrder(shop, customer, items, shippingPrice = 0, note = "", options = {}) {
    const paymentMethodTitle = options.paymentMethod ? options.paymentMethod.toUpperCase() : "ELECTRONIC";
    return await this.createPublicCODOrder(shop, customer, items, shippingPrice, note, {
      ...options,
      paymentPending: false,
      tags: [
        paymentMethodTitle,
        "Paid Online",
        options.gatewayReferenceId ? `Ref:${options.gatewayReferenceId}` : ""
      ].filter(Boolean)
    });
  }
}
