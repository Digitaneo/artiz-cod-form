// Artiz Quick Order - Production Multi-Page Embedded Admin Dashboard
// Architecture: Separate Pages with Vertical Polaris Sidebar Navigation + App Bridge Navigation
// Multi-Tenant Isolation per store (Digitaneo / Mohamed Belcaid)
import { adminRequest } from "../shopify.js";
import { CapiDispatcher } from "../services/tracking/capi-dispatcher.js";

function renderPublicLandingHtml(env) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Artiz Quick Order Engine - Digitaneo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(22, 30, 49, 0.85);
      --border: rgba(255, 255, 255, 0.1);
      --accent: #10b981;
      --accent-glow: rgba(16, 185, 129, 0.25);
      --text: #f3f4f6;
      --text-sub: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 10%, #172554, var(--bg) 60%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .container {
      width: 100%;
      max-width: 680px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px var(--accent-glow);
      backdrop-filter: blur(16px);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--accent);
      border-radius: 50px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent);
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #ffffff;
      line-height: 1.3;
    }
    .description {
      color: var(--text-sub);
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .login-box {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 22px;
      margin-bottom: 26px;
      text-align: left;
    }
    .login-box label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 8px;
    }
    .input-group {
      display: flex;
      gap: 8px;
    }
    input[type="text"] {
      flex: 1;
      padding: 12px 14px;
      border-radius: 10px;
      background: #0b1120;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-family: inherit;
      font-size: 14px;
      outline: none;
    }
    input[type="text"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent-glow);
    }
    button {
      padding: 12px 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      border-radius: 10px;
      font-family: inherit;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-bottom: 26px;
    }
    .feature-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-sub);
    }
    .footer {
      font-size: 12px;
      color: #6b7280;
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .footer a {
      color: #9ca3af;
      text-decoration: none;
    }
    .footer a:hover {
      color: var(--accent);
    }
    @media (max-width: 540px) {
      .input-group { flex-direction: column; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="badge-dot"></span>
      <span>Cloud API Engine Online & Healthy</span>
    </div>
    <h1>Artiz Quick Order Engine</h1>
    <p class="description">
      Next-generation Cash on Delivery & Express Checkout OS for Shopify. Engineered for high conversion rates and strict multi-tenant isolation.
    </p>

    <div class="login-box">
      <label for="shop-domain">Connect or Manage Your Shopify Store:</label>
      <div class="input-group">
        <input type="text" id="shop-domain" placeholder="your-store.myshopify.com" />
        <button onclick="handleLogin()">Open Store</button>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-item">🛡️ Isolated Tenancy</div>
      <div class="feature-item">⚡ Edge Speed</div>
      <div class="feature-item">🔒 Zero-Trust API</div>
      <div class="feature-item">🚚 Dynamic Shipping</div>
    </div>

    <div class="footer">
      <span>Organization: <strong>Digitaneo</strong></span>
      <span>•</span>
      <span>Lead: <strong>Mohamed Belcaid</strong></span>
      <span>•</span>
      <a href="https://digitaneo.com" target="_blank">digitaneo.com</a>
    </div>
  </div>

  <script>
    function handleLogin() {
      var input = document.getElementById('shop-domain').value.trim();
      if (!input) {
        alert('Please enter your store domain (e.g. mystore.myshopify.com)');
        return;
      }
      if (!input.includes('.')) {
        input = input + '.myshopify.com';
      }
      input = input.replace(/^https?:\\/\\//, '').replace(/\\/$/, '');
      window.location.href = '/install?shop=' + encodeURIComponent(input);
    }
    document.getElementById('shop-domain').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') handleLogin();
    });
  </script>
</body>
</html>`;
}

export async function dashboardEmbeddedRoute(request, env) {
  const url = new URL(request.url);
  const rawShop = url.searchParams.get("shop");

  if (!rawShop) {
    return new Response(renderPublicLandingHtml(env), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  const shop = rawShop.replace(/^https?:\/\//, "").replace(/\/$/, "").trim();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*(?:\.myshopify\.com|\.myshopify\.io)$/.test(shop)) {
    return new Response("Invalid shop domain format. Expected: your-store.myshopify.com", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const apiKey = env.SHOPIFY_API_KEY || "";
  const installUrl = `${env.APP_URL || "https://aladdin-quick-order.digitaneo.workers.dev"}/install?shop=${shop}`;
  const themeEditorUrl = `https://${shop}/admin/themes/current/editor?context=apps`;
  const waylDomain = env.WAYL_CUSTOM_DOMAIN || "";

  // Read initial requested page from path or query string (default: overview)
  let requestedPage = url.searchParams.get("page");
  if (!requestedPage && url.pathname && url.pathname !== "/") {
    requestedPage = url.pathname.replace(/^\//, "");
  }
  const ALLOWED_PAGES = ["overview", "abandoned-orders", "abandoned-checkouts", "form-builder", "shipping", "payment-methods", "fraud-prevention", "sales-booster", "integrations", "tracking", "settings"];
  let initialPage = ALLOWED_PAGES.includes(requestedPage) ? requestedPage : "overview";
  if (initialPage === "abandoned-checkouts") initialPage = "abandoned-orders";
  if (initialPage === "tracking") initialPage = "integrations";

  const trackingConfig = await CapiDispatcher.getStoreTrackingConfig(env, shop);

  function formatCompactNumber(val) {
    const num = Number(val) || 0;
    const abs = Math.abs(num);
    if (abs >= 1_000_000_000) {
      const formatted = (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "");
      return formatted + "B";
    }
    if (abs >= 1_000_000) {
      const formatted = (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "");
      return formatted + "M";
    }
    if (abs >= 1_000) {
      const formatted = (num / 1_000).toFixed(2).replace(/\.?0+$/, "");
      return formatted + "K";
    }
    return num % 1 === 0 ? num.toLocaleString("en-US") : num.toFixed(2);
  }

  function renderOrdersRows(orders, defaultActionLabel = "View ↗") {
    if (!orders || orders.length === 0) return "";
    return orders.map(o => `
      <tr class="dash-order-row">
        <td>
          <span class="dash-order-name">${o.name}</span>
          <span class="dash-order-date">${o.dateFormatted}</span>
        </td>
        <td>
          <div class="dash-customer-name">${o.customer}</div>
          <div class="dash-customer-phone">${o.phone}</div>
        </td>
        <td>
          <span class="dash-order-price">${o.totalFormatted}</span>
        </td>
        <td>
          <span class="dash-badge ${o.paymentClass}">${o.paymentLabel}</span>
        </td>
        <td>
          <span class="dash-badge ${o.fulfillmentBadgeClass}">${o.fulfillmentBadgeLabel}</span>
        </td>
        <td>
          <a href="${o.adminUrl}" target="_top" class="dash-action-btn" onclick="event.stopPropagation()">
            ${o.isUnfulfilled ? "Fulfill ↗" : defaultActionLabel}
          </a>
        </td>
      </tr>
    `).join("");
  }

  let allOrders = [];
  let ordersList = [];
  let pendingOrders = [];
  let unfulfilledOrders = [];
  let inTransitOrders = [];
  let topProducts = [];
  let todayMetrics = {
    sales: 0,
    salesExact: "0",
    salesFormatted: "0",
    salesGrowth: "+0%",
    salesGrowthPositive: true,
    orders: 0,
    ordersGrowth: "+0%",
    ordersGrowthPositive: true,
    customers: 0,
    customersGrowth: "+0%",
    customersGrowthPositive: true,
    aov: "0.00",
    aovExact: "0.00",
    aovGrowth: "+0%",
    aovGrowthPositive: true
  };
  let fulfillmentBreakdown = {
    h24: { delivered: 0, pending: 0, total: 0, rate: "0.0" },
    h48: { delivered: 0, pending: 0, total: 0, rate: "0.0" }
  };
  let salesChartSvg = {
    pathD: "",
    areaD: "",
    points: [],
    dates: [],
    maxRev: 100
  };
  let stats = { orders: 0, revenue: "0", customers: 0, products: 0 };
  let needsAuth = false;

  // Default configuration
  let formConfig = {
    displayMode: "popup_modal",
    buttonText: "اشتري الآن - الدفع عند الاستلام",
    submitButtonText: "أطلب الآن",
    formTitle: "إتمام الطلب - الدفع عند الاستلام",
    buttonSubtext: "توصيل سريع والدفع عند الاستلام في المنزل",
    primaryColor: "#008060",
    secondaryColor: "#ffffff",
    enableDiscounts: true,
    enableAffiliateTracking: true,
    enableCartSummary: true,
    directBuyTrigger: true,
    cartDrawerTrigger: true,
    buttonMode: "replace",
    showAddToCartButton: true,
    requiredFields: {
      name: true,
      phone: true,
      email: false,
      city: false,
      address: true,
      note: false
    },
    addressMode: "standard",
    paymentMethods: {
      enabledMethods: ["cod"],
      defaultMethod: "cod",
      methods: {
        cod: { enabled: true, title: "الدفع عند الاستلام", subtitle: "💵 ادفع بكل أمان وقت استلام المنتج." },
        wayl: { enabled: false, title: "دفع إلكتروني - WAYL", subtitle: "دفع آمن — SSL & 3D Secure", customDomain: waylDomain }
      }
    },
    boosterConfig: {
      enableCountdown: true,
      countdownMinutes: 15,
      countdownText: "عرض حصري مؤقت! ينتهي العرض خلال:",
      enableStockCounter: true,
      stockCount: 5,
      stockText: "سارع بالطلب! متبقي فقط {stock} قطع في المخزن",
      enableTrustBadges: true
    },
    fraudConfig: {
      requireIraqiPhone: true,
      preventDuplicates: true,
      duplicateWindowSeconds: 60,
      blacklistPhones: ""
    }
  };

  let shopCurrency = "IQD";
  let shippingConfig = {
    general: {
      enabled: true,
      defaultTitle: "توصيل سريع لكافة المحافظات",
      defaultPrice: 0,
      freeShippingThreshold: 50000,
      enableFreeShipping: false
    },
    rates: []
  };

  if (env.SHOPIFY_CONFIG) {
    try {
      const raw = await env.SHOPIFY_CONFIG.get(shop);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings?.formConfig) {
          formConfig = { ...formConfig, ...parsed.settings.formConfig };
        } else if (parsed.settings) {
          formConfig = { ...formConfig, ...parsed.settings };
        }

        // Dedicated load for shipping rates from shipping_rates:${shop}
        const shippingRaw = await env.SHOPIFY_CONFIG.get(`shipping_rates:${shop}`);
        if (shippingRaw) {
          const parsedShip = JSON.parse(shippingRaw);
          if (parsedShip.general) {
            let defVal = Number(parsedShip.general.defaultPrice ?? parsedShip.general.defaultRate ?? 0);
            parsedShip.general.defaultPrice = defVal;
            parsedShip.general.defaultRate = defVal;
            shippingConfig.general = { ...shippingConfig.general, ...parsedShip.general };
          }
          if (Array.isArray(parsedShip.rates)) {
            shippingConfig.rates = parsedShip.rates.map(r => ({
              ...r,
              countryCode: r.countryCode || "MA",
              region: r.region || r.city || "",
              city: r.city || "",
              area: r.area || "",
              price: Number(r.price ?? r.cost ?? 0),
              cost: Number(r.cost ?? r.price ?? 0),
              customRates: r.customRates || ""
            }));
          }
        }

        // Fetch live stats & recent orders from Shopify GraphQL
        const activeToken = parsed.accessToken || parsed.access_token || parsed.settings?.accessToken;
        if (activeToken) {
          const query = `
            query getDashboardData {
              shop {
                currencyCode
                ianaTimezone
              }
              orders(first: 250, sortKey: CREATED_AT, reverse: true) {
                edges {
                  node {
                    id
                    name
                    createdAt
                    cancelledAt
                    cancelReason
                    tags
                    phone
                    shippingAddress {
                      phone
                      name
                      city
                      province
                    }
                    currentTotalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    displayFinancialStatus
                    displayFulfillmentStatus
                    paymentGatewayNames
                    customer {
                      firstName
                      lastName
                      phone
                      email
                    }
                    lineItems(first: 3) {
                      edges {
                        node {
                          title
                          quantity
                          originalUnitPriceSet {
                            shopMoney {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              unfulfilledOrders: orders(first: 50, query: "status:open fulfillment_status:unfulfilled", sortKey: CREATED_AT, reverse: true) {
                edges {
                  node {
                    id
                    name
                    createdAt
                    cancelledAt
                    cancelReason
                    tags
                    phone
                    shippingAddress {
                      phone
                      name
                      city
                      province
                    }
                    currentTotalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    displayFinancialStatus
                    displayFulfillmentStatus
                    paymentGatewayNames
                    customer {
                      firstName
                      lastName
                      phone
                      email
                    }
                    lineItems(first: 3) {
                      edges {
                        node {
                          title
                          quantity
                          originalUnitPriceSet {
                            shopMoney {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `;

          const data = await adminRequest(shop, query, {}, env).catch(err => {
            console.error("[Dashboard] GraphQL query error:", err);
            return null;
          });
          if (data?.data) {
            if (data.data.shop?.currencyCode) {
              shopCurrency = data.data.shop.currencyCode;
            }

            const storeTimeZone = data.data.shop?.ianaTimezone || "Asia/Baghdad";
            function getStoreDayDate(d) {
              try {
                return new Intl.DateTimeFormat("en-CA", {
                  timeZone: storeTimeZone,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                }).format(d); // "YYYY-MM-DD"
              } catch (_) {
                return new Date(d).toISOString().slice(0, 10);
              }
            }

            const rawEdges = data.data.orders?.edges || [];
            const rawUnfulfilledEdges = data.data.unfulfilledOrders?.edges || [];
            const now = new Date();
            const todayDateStr = getStoreDayDate(now);
            const yesterdayDateStr = getStoreDayDate(new Date(now.getTime() - (24 * 60 * 60 * 1000)));
            const thirtyDaysAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);

            // 1. Order Parser: Normalizes fields, financial/fulfillment statuses, and COD delivery state
            function parseOrderNode(o) {
              const numericId = o.id.split("/").pop();
              const createdDate = new Date(o.createdAt);
              const createdTs = createdDate.getTime();
              const amountNum = Number(o.currentTotalPriceSet?.shopMoney?.amount || 0);
              const cur = o.currentTotalPriceSet?.shopMoney?.currencyCode || shopCurrency;
              let custName = o.customer ? `${o.customer.firstName || ""} ${o.customer.lastName || ""}`.trim() : "";
              if (!custName && o.shippingAddress?.name) {
                custName = o.shippingAddress.name.trim();
              }
              if (!custName) {
                custName = "Customer";
              }
              const phone = o.phone || o.shippingAddress?.phone || o.customer?.phone || o.customer?.email || "N/A";
              const gateways = Array.isArray(o.paymentGatewayNames) ? o.paymentGatewayNames.join(", ").toLowerCase() : "";
              const isCod = gateways.includes("cash") || gateways.includes("cod") || gateways.includes("manual") || gateways === "";
              const finStatus = (o.displayFinancialStatus || "PENDING").toUpperCase();
              const fulStatus = (o.displayFulfillmentStatus || "UNFULFILLED").toUpperCase();
              const isCancelled = Boolean(o.cancelledAt || o.cancelReason || finStatus === "VOIDED" || finStatus === "REFUNDED");
              const tagsList = Array.isArray(o.tags) ? o.tags : (typeof o.tags === "string" ? o.tags.split(",").map(t => t.trim()) : []);

              // Accurate COD & Electronic Delivery Tracking:
              // - In COD: Order is delivered & completed when customer has received parcel and paid cash (finStatus === "PAID")
              // - In Prepaid: Order is completed when fulfilled and dispatched
              // - Or explicitly tagged with delivered ("delivered", "تم التوصيل", "تم التسليم", "livré")
              const isDelivered = !isCancelled && (
                (isCod && finStatus === "PAID") ||
                (!isCod && fulStatus === "FULFILLED") ||
                tagsList.some(t => {
                  const s = t.toLowerCase();
                  return s === "delivered" || s === "تم التوصيل" || s === "تم التسليم" || s === "livré";
                })
              );

              // Unfulfilled: Order requires warehouse packaging / courier shipping
              const isUnfulfilled = !isCancelled && (
                fulStatus === "UNFULFILLED" ||
                fulStatus === "PARTIALLY_FULFILLED" ||
                fulStatus === "PENDING_FULFILLMENT" ||
                fulStatus === "OPEN"
              );

              // Needs Confirmation: Tagged by merchant/app for phone/WhatsApp verification
              const needsConfirmation = !isCancelled && !isDelivered && tagsList.some(t => {
                const s = t.toLowerCase();
                return s.includes("pending") || s.includes("confirm") || s.includes("تأكيد") || s.includes("اتصال") || s.includes("غير مؤكد");
              });

              let fulfillmentBadgeLabel = "⏳ Unfulfilled";
              let fulfillmentBadgeClass = "badge-pending-ship";
              if (fulStatus === "PARTIALLY_FULFILLED") {
                fulfillmentBadgeLabel = "📦 Partially Fulfilled";
                fulfillmentBadgeClass = "badge-partial";
              } else if (needsConfirmation) {
                fulfillmentBadgeLabel = "📞 Needs Confirmation";
                fulfillmentBadgeClass = "badge-pending-confirm";
              } else if (isDelivered) {
                fulfillmentBadgeLabel = "✅ Delivered & Paid";
                fulfillmentBadgeClass = "badge-delivered";
              } else if (fulStatus === "FULFILLED") {
                fulfillmentBadgeLabel = "🚚 In Transit (COD)";
                fulfillmentBadgeClass = "badge-in-transit";
              }

              return {
                id: numericId,
                name: o.name,
                createdAt: o.createdAt,
                createdTs,
                dateFormatted: createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                customer: custName,
                phone,
                amount: amountNum,
                currency: cur,
                totalFormatted: `${amountNum.toLocaleString()} ${cur}`,
                financialStatus: finStatus,
                fulfillmentStatus: fulStatus,
                tags: tagsList,
                isCancelled,
                isCod,
                isDelivered,
                isUnfulfilled,
                needsConfirmation,
                fulfillmentBadgeLabel,
                fulfillmentBadgeClass,
                paymentLabel: isCod ? "💵 Cash on Delivery" : "💳 Electronic Payment",
                paymentClass: isCod ? "badge-cod" : "badge-electronic",
                adminUrl: `https://${shop}/admin/orders/${numericId}`,
                lineItems: (o.lineItems?.edges || []).map(li => ({
                  title: li.node.title,
                  quantity: Number(li.node.quantity || 1),
                  unitPrice: Number(li.node.originalUnitPriceSet?.shopMoney?.amount || 0)
                }))
              };
            }

            allOrders = rawEdges.map(e => parseOrderNode(e.node));

            // Merge unfulfilled orders from dedicated query and allOrders (ensuring no open unfulfilled order is ever lost)
            const unfulfilledMap = new Map();
            rawUnfulfilledEdges.forEach(e => {
              const o = parseOrderNode(e.node);
              if (!o.isCancelled) unfulfilledMap.set(o.id, o);
            });
            allOrders.forEach(o => {
              if (o.isUnfulfilled && !unfulfilledMap.has(o.id)) {
                unfulfilledMap.set(o.id, o);
              }
            });
            unfulfilledOrders = Array.from(unfulfilledMap.values()).sort((a, b) => b.createdTs - a.createdTs);

            // In-Transit COD orders (Fulfilled / Dispatched, but payment pending & not delivered)
            inTransitOrders = allOrders.filter(o => !o.isCancelled && !o.isDelivered && (o.fulfillmentStatus === "FULFILLED" || o.isCod));

            // Primary pendingOrders list for quick reference
            pendingOrders = unfulfilledOrders.length > 0 ? unfulfilledOrders : inTransitOrders;

            ordersList = allOrders;
            stats.orders = allOrders.length;
            const totalSum = allOrders.reduce((sum, o) => sum + o.amount, 0);
            stats.revenue = totalSum.toLocaleString();

            // Deduplicate unique customers accurately by phone digits (or customer name / ID)
            function getCustomerKey(o) {
              const rawPhone = (o.phone || "").replace(/\D/g, "");
              if (rawPhone.length >= 7) {
                return "p:" + rawPhone.slice(-9);
              }
              const cleanName = (o.customer || "").trim().toLowerCase();
              if (cleanName && cleanName !== "customer" && cleanName !== "عميل") {
                return "n:" + cleanName;
              }
              return "id:" + o.id;
            }

            // 2. Compute Today vs Yesterday (Timezone-Aware)
            const todayOrders = allOrders.filter(o => getStoreDayDate(new Date(o.createdTs)) === todayDateStr && !o.isCancelled);
            const todaySales = todayOrders.reduce((sum, o) => sum + o.amount, 0);
            const todayOrdersCount = todayOrders.length;
            const todayCustSet = new Set(todayOrders.map(o => getCustomerKey(o)));
            const todayCustCount = todayCustSet.size;

            const yesterdayOrders = allOrders.filter(o => getStoreDayDate(new Date(o.createdTs)) === yesterdayDateStr && !o.isCancelled);
            const yesterdaySales = yesterdayOrders.reduce((sum, o) => sum + o.amount, 0);
            const yesterdayOrdersCount = yesterdayOrders.length;
            const yesterdayCustSet = new Set(yesterdayOrders.map(o => getCustomerKey(o)));
            const yesterdayCustCount = yesterdayCustSet.size;

            function calcDiff(cur, prev) {
              if (prev === 0) return { text: cur > 0 ? "+100%" : "0%", isPos: true };
              const diff = Math.round(((cur - prev) / prev) * 100);
              return {
                text: diff >= 0 ? `+${diff}%` : `${diff}%`,
                isPos: diff >= 0
              };
            }

            const salesDiff = calcDiff(todaySales, yesterdaySales);
            const ordersDiff = calcDiff(todayOrdersCount, yesterdayOrdersCount);
            const custDiff = calcDiff(todayCustCount, yesterdayCustCount);

            // AOV (Average Order Value) - Calculated accurately vs yesterday
            const todayAovVal = todayOrdersCount > 0 ? (todaySales / todayOrdersCount) : 0;
            const yesterdayAovVal = yesterdayOrdersCount > 0 ? (yesterdaySales / yesterdayOrdersCount) : 0;
            const aovDiff = calcDiff(todayAovVal, yesterdayAovVal);

            todayMetrics = {
              sales: todaySales,
              salesExact: todaySales.toLocaleString("en-US"),
              salesFormatted: formatCompactNumber(todaySales),
              salesGrowth: salesDiff.text,
              salesGrowthPositive: salesDiff.isPos,
              orders: todayOrdersCount,
              ordersGrowth: ordersDiff.text,
              ordersGrowthPositive: ordersDiff.isPos,
              customers: todayCustCount,
              customersGrowth: custDiff.text,
              customersGrowthPositive: custDiff.isPos,
              aov: formatCompactNumber(todayAovVal),
              aovExact: Number(todayAovVal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              aovGrowth: aovDiff.text,
              aovGrowthPositive: aovDiff.isPos
            };

            // 3. Compute Accurate Fulfillment & Delivery Breakdown (24h, 48h)
            function calcFulfillment(hours) {
              const th = now.getTime() - (hours * 3600 * 1000);
              const sub = allOrders.filter(o => o.createdTs >= th && !o.isCancelled);
              const del = sub.filter(o => o.isDelivered).length;
              const pnd = sub.filter(o => !o.isDelivered).length;
              const tot = del + pnd;
              const r = tot > 0 ? ((del / tot) * 100).toFixed(1) : "0.0";
              return { delivered: del, pending: pnd, total: tot, rate: r };
            }
            fulfillmentBreakdown = {
              h24: calcFulfillment(24),
              h48: calcFulfillment(48)
            };

            // 5. Top Winning Products (Last 24 Hours & Non-Cancelled Orders)
            const pMap = new Map();
            const h24Threshold = now.getTime() - (24 * 3600 * 1000);
            const h24Orders = allOrders.filter(o => o.createdTs >= h24Threshold && !o.isCancelled);
            const sourceProductsOrders = h24Orders.length > 0 ? h24Orders : allOrders.filter(o => !o.isCancelled);
            sourceProductsOrders.forEach(o => {
              o.lineItems.forEach(item => {
                const t = item.title?.trim();
                if (!t) return;
                const ex = pMap.get(t) || { title: t, salesCount: 0, revenue: 0, unitPrice: item.unitPrice };
                ex.salesCount += item.quantity;
                ex.revenue += (item.quantity * (item.unitPrice || 0));
                if (!ex.unitPrice && item.unitPrice) ex.unitPrice = item.unitPrice;
                pMap.set(t, ex);
              });
            });
            topProducts = Array.from(pMap.values())
              .sort((a, b) => {
                if (b.salesCount !== a.salesCount) return b.salesCount - a.salesCount;
                return b.revenue - a.revenue;
              })
              .slice(0, 16);

            // 6. 7-Day Sales Daily Trend & Initial SVG Curve (Weekly, Timezone-Aware)
            const dailyPoints = [];
            for (let i = 6; i >= 0; i--) {
              const dayDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
              const dayDateStr = getStoreDayDate(dayDate);
              const [yyyy, mm, dd] = dayDateStr.split("-");
              const dayLabel = `${parseInt(dd, 10)}/${parseInt(mm, 10)}`;
              const fullDateISO = `${dd}-${mm}-${yyyy}`;

              const dayOrders = allOrders.filter(o => getStoreDayDate(new Date(o.createdTs)) === dayDateStr && !o.isCancelled);
              const daySum = dayOrders.reduce((sum, o) => sum + o.amount, 0);

              dailyPoints.push({
                date: dayLabel,
                fullDateISO,
                fullDate: `${dayLabel} (${dayOrders.length} orders)`,
                ordersCount: dayOrders.length,
                revenue: daySum,
                revenueFormatted: daySum.toLocaleString("en-US"),
                revenueCompact: formatCompactNumber(daySum)
              });
            }

            const maxDaily = Math.max(...dailyPoints.map(p => p.revenue), 50);
            const svgW = 600;
            const svgH = 190;
            const padX = 28;
            const padY = 25;
            const plotW = svgW - (padX * 2);
            const plotH = svgH - (padY * 2);

            const coords = dailyPoints.map((p, idx) => {
              const x = padX + (idx / (dailyPoints.length - 1)) * plotW;
              const y = (padY + plotH) - (p.revenue / maxDaily) * plotH;
              return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), ...p };
            });

            let lineD = `M ${coords[0].x} ${coords[0].y}`;
            for (let i = 0; i < coords.length - 1; i++) {
              const p0 = coords[i];
              const p1 = coords[i + 1];
              const mx = (p0.x + p1.x) / 2;
              lineD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
            }
            const areaD = `${lineD} L ${coords[coords.length - 1].x} ${padY + plotH} L ${coords[0].x} ${padY + plotH} Z`;

            salesChartSvg = {
              pathD: lineD,
              areaD: areaD,
              points: coords,
              maxRev: maxDaily
            };
          }
        } else {
          needsAuth = true;
        }
      } else {
        needsAuth = true;
      }
    } catch (e) {
      console.warn("Embedded dashboard data fetch error:", e);
    }
  }

  // Fallback 7 daily points if empty (ensures chart timeline & hover always work smoothly)
  if (!salesChartSvg.points || salesChartSvg.points.length === 0) {
    const nowFb = new Date();
    const todayStartFb = new Date(nowFb.getFullYear(), nowFb.getMonth(), nowFb.getDate()).getTime();
    const fallbackPoints = [];
    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(todayStartFb - (i * 24 * 60 * 60 * 1000));
      const dayLabel = `${dayDate.getDate()}/${dayDate.getMonth() + 1}`;
      const dd = String(dayDate.getDate()).padStart(2, "0");
      const mm = String(dayDate.getMonth() + 1).padStart(2, "0");
      const yyyy = dayDate.getFullYear();
      fallbackPoints.push({
        date: dayLabel,
        fullDateISO: `${dd}-${mm}-${yyyy}`,
        fullDate: dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        revenue: 0,
        revenueFormatted: "0",
        revenueCompact: "0"
      });
    }
    const svgW = 600;
    const svgH = 190;
    const padX = 28;
    const padY = 25;
    const plotW = svgW - (padX * 2);
    const plotH = svgH - (padY * 2);
    const coords = fallbackPoints.map((p, idx) => {
      const x = padX + (idx / (fallbackPoints.length - 1)) * plotW;
      const y = padY + plotH;
      return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), ...p };
    });
    let lineD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      lineD += ` L ${coords[i + 1].x} ${coords[i + 1].y}`;
    }
    salesChartSvg = {
      pathD: lineD,
      areaD: `${lineD} L ${coords[coords.length - 1].x} ${padY + plotH} L ${coords[0].x} ${padY + plotH} Z`,
      points: coords,
      maxRev: 100
    };
  }

  if (shippingConfig?.shopCurrency) {
    shopCurrency = shippingConfig.shopCurrency;
  }
  const currencySymbolMap = {
    IQD: "IQD",
    MAD: "MAD",
    DZD: "DZD",
    SAR: "SAR",
    AED: "AED",
    QAR: "QAR",
    KWD: "KWD",
    EGP: "EGP",
    USD: "$",
    EUR: "€"
  };
  const currencyDisplay = currencySymbolMap[shopCurrency] || shopCurrency;
  const storeDisplayTitle = (shop === "iuq7xa-0g.myshopify.com") ? "Aladdin Fitness" : shop;
  const storeDisplayDomain = (shop === "iuq7xa-0g.myshopify.com") ? "https://aladdinfitness.com" : `https://${shop}`;
  const isQuestionStr = (val) => !val || /^\?+$/.test(String(val).replace(/\s+/g, ''));
  const rawExitIntent = formConfig.boosterConfig?.exitIntent || {};
  const exitIntentCfg = {
    ...rawExitIntent,
    title: isQuestionStr(rawExitIntent.title) ? "لأنك غالي علينا" : rawExitIntent.title,
    subtitle: isQuestionStr(rawExitIntent.subtitle) ? "تهانينا! لقد حصلت للتو على خصم خاص لطلبك!" : rawExitIntent.subtitle,
    btnAccept: isQuestionStr(rawExitIntent.btnAccept) ? `قبول العرض وخصم ${rawExitIntent.discountBadge || "10%"}` : rawExitIntent.btnAccept,
    btnReject: isQuestionStr(rawExitIntent.btnReject) ? "لا، شكراً" : rawExitIntent.btnReject
  };

  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Artiz Quick Order - Management Console</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cairo:wght@500;700&display=swap" rel="stylesheet">

  <!-- Shopify App Bridge & Early Navigation -->
  <meta name="shopify-api-key" content="${apiKey}">
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  <script>
    function navigateTo(pageId, el, skipPush) {
      var links = document.querySelectorAll('.nav-link');
      for (var i = 0; i < links.length; i++) {
        links[i].classList.remove('active');
      }
      if (el) {
        el.classList.add('active');
      } else {
        var targetLink = document.querySelector('[data-page="' + pageId + '"]');
        if (targetLink) targetLink.classList.add('active');
      }

      var pages = document.querySelectorAll('.page-view');
      for (var j = 0; j < pages.length; j++) {
        pages[j].classList.remove('active');
      }

      var targetPage = document.getElementById('page-' + pageId);
      if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      var pageTitles = {
        'overview': 'Store Overview & Recent Activity',
        'abandoned-orders': 'Abandoned Orders',
        'form-builder': 'Form Builder',
        'shipping': 'Shipping Rates',
        'payment-methods': 'Payment Methods',
        'fraud-prevention': 'Fraud Shield',
        'sales-booster': 'Sales Booster',
        'integrations': 'Analytics & Tracking Pixels',
        'tracking': 'Analytics & Tracking Pixels',
        'settings': 'Settings'
      };
      var titleBar = document.querySelector('ui-title-bar');
      if (titleBar && pageTitles[pageId]) {
        titleBar.setAttribute('title', pageTitles[pageId]);
      }

      if (pageId === 'abandoned-orders') {
        if (typeof window.loadAbandonedOrders === 'function') {
          window.loadAbandonedOrders();
        }
      }

      if (!skipPush) {
        try {
          var targetPath = pageId === 'overview' ? '/' : '/' + pageId;
          var curUrl = new URL(window.location.href);
          if (curUrl.pathname !== targetPath) {
            curUrl.pathname = targetPath;
            window.history.pushState({ page: pageId }, '', curUrl.pathname + curUrl.search);
          }
        } catch (err) {
          console.warn('Navigation state sync:', err);
        }
      }
    }
  </script>
  <style>
    :root {
      --p-color-bg: #020a25;
      --p-color-surface: #ffffff;
      --p-color-border: #e1e3e5;
      --p-color-border-subdued: #ebebeb;
      --p-color-text: #202223;
      --p-color-text-subdued: #6d7175;
      --p-color-primary: #008060;
      --p-color-primary-hover: #006e52;
      --p-color-primary-light: #e4fbf1;
      --p-color-success-bg: #e4fbf1;
      --p-color-success-text: #0e6245;
      --p-color-warning-bg: #fff8e5;
      --p-color-warning-text: #8c5b00;
      --p-color-blue-bg: #edf7ff;
      --p-color-blue-text: #0b5cab;
      --radius-sm: 8px;
      --radius-md: 12px;
      --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-dropdown: 0 4px 16px rgba(0,0,0,0.08);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #020a25 !important;
      color: var(--p-color-text);
      line-height: 1.5;
      padding: 20px 24px 50px;
    }

    .container { max-width: 1380px; margin: 0 auto; }

    /* Top Bar Header */
    .top-bar {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; flex-wrap: wrap; gap: 14px;
      background: #14161a; padding: 12px 20px;
      border-radius: var(--radius-md); border: 1px solid #232730;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .app-brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon {
      width: 38px; height: 38px; background: linear-gradient(135deg, #10b981, #047857);
      border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 19px; font-weight: 800; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
    }
    .brand-info h1 { font-size: 17px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; }
    .store-badge {
      display: inline-flex; align-items: center; font-size: 11px; padding: 3px 9px; border-radius: 12px;
      background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 600;
    }

    .header-actions { display: flex; gap: 10px; align-items: center; }

    .btn-icon-refresh {
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; background: #1e222b; color: #94a3b8;
      border: 1px solid #2d3340; border-radius: 8px; cursor: pointer;
      transition: all 0.2s ease; padding: 0;
    }
    .btn-icon-refresh:hover {
      background: #282e3b; color: #f1f5f9; border-color: #3b4455;
      transform: translateY(-1px);
    }
    .btn-icon-refresh.rotating svg {
      animation: spinRefresh 0.8s linear infinite;
    }
    @keyframes spinRefresh {
      100% { transform: rotate(360deg); }
    }

    .btn-shopify-orders {
      display: inline-flex; align-items: center; gap: 6px;
      background: #008060; color: #ffffff; padding: 9px 16px;
      border-radius: 8px; font-size: 13px; font-weight: 700;
      text-decoration: none; border: 1px solid #00966d;
      transition: all 0.2s ease;
    }
    .btn-shopify-orders:hover {
      background: #006e52; transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 128, 96, 0.3);
      color: #ffffff;
    }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      background-color: var(--p-color-primary); color: #fff;
      text-decoration: none; padding: 8px 16px; border-radius: var(--radius-sm);
      font-size: 13px; font-weight: 700; cursor: pointer; border: none;
      transition: all 0.15s ease;
    }
    .btn:hover { background-color: var(--p-color-primary-hover); transform: translateY(-1px); }
    .btn-secondary {
      background-color: #fff; color: var(--p-color-text);
      border: 1px solid var(--p-color-border);
    }
    .btn-secondary:hover { background-color: #f1f2f3; }

    /* Auth Banner */
    .auth-banner {
      background: #fff8e5; border: 1px solid #fedb9b;
      padding: 14px 18px; border-radius: var(--radius-sm);
      margin-bottom: 20px; display: flex; justify-content: space-between;
      align-items: center; gap: 14px; flex-wrap: wrap;
    }
    .auth-banner-content { display: flex; align-items: center; gap: 10px; color: #664600; font-size: 14px; }
    .auth-banner-btn {
      background: #8c5b00; color: #fff; padding: 7px 14px;
      border-radius: 6px; font-size: 12px; font-weight: bold; text-decoration: none;
      white-space: nowrap;
    }

    /* ==================== FULL-WIDTH WORKSPACE ==================== */
    .app-layout {
      width: 100%;
    }

    .nav-section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--p-color-text-subdued);
      padding: 6px 12px 8px;
      border-bottom: 1px solid #f1f2f3;
      margin-bottom: 8px;
    }

    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 11px 14px;
      border-radius: var(--radius-sm);
      border: none;
      background: transparent;
      color: #303030;
      font-size: 13.5px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      text-decoration: none;
      transition: all 0.15s ease;
      position: relative;
      z-index: 51;
      pointer-events: auto !important;
      user-select: none;
    }

    .nav-link:hover {
      background: #f6f6f7;
      color: #000;
    }

    .nav-link.active {
      background: var(--p-color-primary-light);
      color: var(--p-color-primary);
      font-weight: 800;
      border-left: 4px solid var(--p-color-primary);
    }

    .nav-link-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-link-icon {
      font-size: 18px;
      width: 22px;
      text-align: center;
    }

    .nav-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      background: #edf7ff;
      color: #0b5cab;
    }
    .nav-link.active .nav-badge {
      background: #cbf5e4;
      color: #0e6245;
    }

    /* Main Dedicated Page View Area */
    .app-main {
      width: 100%;
      min-width: 0;
    }

    .page-view {
      display: none;
    }
    .page-view.active {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Dedicated Polaris Page Header */
    .page-header {
      background: var(--p-color-surface);
      border: 1px solid var(--p-color-border);
      border-radius: var(--radius-md);
      padding: 20px 24px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-card);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .page-header-text h2 {
      font-size: 21px;
      font-weight: 800;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .page-header-text p {
      font-size: 13px;
      color: var(--p-color-text-subdued);
      margin-top: 4px;
    }
    .page-breadcrumbs {
      font-size: 12px;
      color: var(--p-color-text-subdued);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .page-breadcrumbs a {
      color: var(--p-color-primary);
      text-decoration: none;
      cursor: pointer;
    }

    /* ================= MODERN DASHBOARD OVERVIEW (COBRA STYLE) ================= */
    .dash-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .dash-kpi-card {
      background: #14161a;
      border: 1px solid #232730;
      border-radius: 14px;
      padding: 15px 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .dash-kpi-card:hover {
      transform: translateY(-2px);
      border-color: #383e4c;
    }
    .dash-kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .dash-kpi-title {
      font-size: 13.5px;
      color: #9ba1a6;
      font-weight: 600;
    }
    .dash-kpi-icon-wrap {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .dash-kpi-icon-wrap.icon-green { background: rgba(16, 185, 129, 0.15); }
    .dash-kpi-icon-wrap.icon-amber { background: rgba(245, 158, 11, 0.15); }
    .dash-kpi-icon-wrap.icon-purple { background: rgba(139, 92, 246, 0.15); }
    .dash-kpi-icon-wrap.icon-gold { background: rgba(234, 179, 8, 0.15); }

    .dash-kpi-value {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .dash-kpi-cur {
      font-size: 14px;
      font-weight: 600;
      color: #9ba1a6;
      margin-right: 4px;
    }
    .dash-kpi-footer {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dash-trend-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .dash-trend-pill.trend-up {
      background: rgba(16, 185, 129, 0.18);
      color: #10b981;
    }
    .dash-trend-pill.trend-down {
      background: rgba(239, 68, 68, 0.18);
      color: #ef4444;
    }
    .dash-trend-label {
      font-size: 11.5px;
      color: #727883;
    }

    /* Row 2: Analytics Grid */
    .dash-analytics-row {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    @media (max-width: 1024px) {
      .dash-analytics-row { grid-template-columns: 1fr; }
    }

    .dash-card {
      background: #14161a;
      border: 1px solid #232730;
      border-radius: 14px;
      padding: 20px 22px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    }
    .dash-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .dash-card-title {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dash-badge-count {
      background: #f59e0b;
      color: #000;
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 10px;
      font-weight: 800;
    }
    .dash-card-subtitle {
      font-size: 12px;
      color: #727883;
      margin-top: 2px;
    }

    /* Period Toggle */
    .dash-period-toggle {
      display: flex;
      background: #1d2128;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid #2a2f3a;
    }
    .dash-period-btn {
      background: transparent;
      border: none;
      color: #8c939f;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .dash-period-btn:hover { color: #fff; }
    .dash-period-btn.active {
      background: #2a2f3a;
      color: #ffffff;
      font-weight: 700;
    }

    /* Donut Visual */
    .dash-donut-content {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .dash-donut-visual {
      position: relative;
      width: 145px;
      height: 145px;
      flex-shrink: 0;
      margin: 0 auto;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
    }
    .donut-center-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    }
    .donut-rate {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
    }
    .donut-rate-label {
      font-size: 11px;
      color: #10b981;
      font-weight: 700;
    }
    .donut-sub-count {
      font-size: 9.5px;
      color: #656d78;
      margin-top: 2px;
    }

    .dash-donut-breakdown {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 180px;
    }
    .donut-stat-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1a1d24;
      border: 1px solid #262b34;
      border-radius: 10px;
      padding: 10px 14px;
    }
    .donut-stat-icon { font-size: 18px; }
    .donut-stat-details { flex: 1; }
    .donut-stat-title { font-size: 13px; font-weight: 700; color: #ffffff; }
    .donut-stat-desc { font-size: 11px; color: #727883; }
    .donut-stat-numbers { text-align: right; }
    .donut-stat-count { font-size: 16px; font-weight: 800; color: #ffffff; display: block; }
    .donut-stat-pct { font-size: 11px; font-weight: 700; color: #10b981; }
    .stat-pending .donut-stat-pct { color: #f59e0b; }

    /* 30 Days Chart */
    .dash-chart-container {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    .dash-chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 10px;
      color: #5d6470;
      padding: 5px 0;
      text-align: right;
      min-width: 38px;
    }
    .dash-chart-svg-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .chart-svg {
      width: 100%;
      height: 180px;
      overflow: visible;
      display: block;
    }
    .chart-point {
      cursor: pointer;
      transition: r 0.15s ease;
    }
    .chart-point:hover {
      r: 6;
      fill: #f59e0b;
    }
    .dash-chart-x-axis {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #5d6470;
      margin-top: 8px;
      padding: 0 4px;
    }
    .dash-chart-badge {
      background: #1e222a;
      color: #f59e0b;
      font-size: 11.5px;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      border: 1px solid #2d333f;
    }
    .chart-tooltip-box {
      position: absolute;
      background: rgba(18, 20, 26, 0.96);
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 8px 12px;
      color: #cbd5e1;
      pointer-events: none;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 12px rgba(245, 158, 11, 0.25);
      z-index: 40;
      white-space: nowrap;
      transition: opacity 0.12s ease;
    }
    .chart-tooltip-date {
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 2px;
      font-weight: 600;
    }
    .chart-tooltip-sales {
      font-size: 13px;
      color: #ffffff;
      font-weight: 700;
    }
    .chart-tooltip-sales strong {
      color: #f59e0b;
    }

    /* 7-Day Weekly Chart Shimmer & Skeleton Pulse */
    .chart-skeleton-wrap {
      position: absolute;
      inset: 0 0 24px 0;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, rgba(18, 20, 26, 0.78) 85%);
      backdrop-filter: blur(2px);
      z-index: 15;
      pointer-events: none;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }
    .chart-skeleton-wrap.chart-loaded {
      opacity: 0;
      visibility: hidden;
    }
    .skeleton-shimmer-wave {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.14) 50%, transparent 100%);
      transform: translateX(-100%);
      animation: shimmerMove 1.6s infinite ease-in-out;
    }
    @keyframes shimmerMove {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .skeleton-label {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11.5px;
      color: #f59e0b;
      font-weight: 600;
      background: rgba(10, 14, 28, 0.9);
      border: 1px solid rgba(245, 158, 11, 0.35);
      padding: 6px 14px;
      border-radius: 20px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
      animation: pulseGlow 1.2s infinite ease-in-out;
    }
    @keyframes pulseGlow {
      0%, 100% { transform: scale(0.85); opacity: 0.5; }
      50% { transform: scale(1.3); opacity: 1; }
    }

    /* Row 3: Operations Stack (Full Width Vertical Stack) */
    .dash-operations-row {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
    }

    /* Actionable Orders Table */
    .dash-orders-scroll-area {
      max-height: 420px;
      overflow-y: auto;
      border-radius: 10px;
      border: 1px solid #232730;
    }
    .dash-orders-scroll-area::-webkit-scrollbar {
      width: 6px;
    }
    .dash-orders-scroll-area::-webkit-scrollbar-track {
      background: #14161a;
    }
    .dash-orders-scroll-area::-webkit-scrollbar-thumb {
      background: #2a2f3a;
      border-radius: 3px;
    }
    .dash-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    .dash-table th {
      background: #1a1d23;
      color: #8c939f;
      padding: 12px 16px;
      font-weight: 700;
      border-bottom: 1px solid #262a33;
      position: sticky;
      top: 0;
      z-index: 10;
      text-align: left;
    }
    .dash-table td {
      padding: 14px 16px;
      border-bottom: 1px solid #1f2229;
      color: #d1d5db;
      vertical-align: middle;
      text-align: left;
    }
    .dash-order-row {
      transition: background 0.15s ease;
    }
    .dash-order-row:hover,
    .dash-order-row:hover td {
      background: #020a25 !important;
    }
    .dash-order-name {
      font-weight: 800;
      color: #f59e0b;
      display: block;
    }
    .dash-order-date {
      font-size: 11px;
      color: #656d78;
    }
    .dash-customer-name {
      font-weight: 700;
      color: #ffffff;
    }
    .dash-customer-phone {
      font-size: 11.5px;
      color: #8c939f;
      direction: ltr;
      text-align: left;
    }
    .dash-order-price {
      font-weight: 800;
      color: #ffffff;
    }
    .dash-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .dash-badge.badge-cod {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    .dash-badge.badge-electronic {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }
    .dash-badge.badge-pending-ship {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }
    .dash-badge.badge-partial {
      background: rgba(249, 115, 22, 0.15);
      color: #f97316;
    }
    .dash-badge.badge-pending-confirm {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
    }
    .dash-badge.badge-in-transit {
      background: rgba(6, 182, 212, 0.15);
      color: #22d3ee;
    }
    .dash-badge.badge-delivered {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .dash-action-btn {
      display: inline-block;
      padding: 5px 12px;
      background: #232730;
      color: #ffffff;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 700;
      font-size: 12px;
      transition: all 0.15s ease;
    }
    .dash-action-btn:hover {
      background: #f59e0b;
      color: #000;
    }
    .dash-empty-orders {
      text-align: center;
      padding: 50px 20px;
      color: #8c939f;
    }
    .dash-empty-icon {
      font-size: 38px;
      margin-bottom: 8px;
    }
    .dash-empty-orders h4 {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 4px;
    }

    /* Top Products Grid (Full Width Responsive) */
    .dash-products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      width: 100%;
    }
    .dash-product-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1a1d24;
      border: 1px solid #262b34;
      border-radius: 12px;
      padding: 14px 16px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .dash-product-item:hover {
      transform: translateY(-2px);
      border-color: #383e4c;
    }
    .dash-product-rank {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      flex-shrink: 0;
      background: #2a2f3a;
      color: #cbd5e1;
    }
    .rank-1 { background: #f59e0b; color: #000; }
    .rank-2 { background: #94a3b8; color: #000; }
    .rank-3 { background: #d97706; color: #fff; }
    .dash-product-info { flex: 1; min-width: 0; }
    .dash-product-title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dash-product-sales {
      font-size: 11px;
      color: #8c939f;
      margin-top: 2px;
    }
    .dash-product-price {
      font-size: 13.5px;
      font-weight: 800;
      color: #f59e0b;
      white-space: nowrap;
    }
    .dash-link-btn {
      color: #f59e0b;
      text-decoration: none;
      font-size: 12.5px;
      font-weight: 700;
      transition: opacity 0.15s ease;
    }
    .dash-link-btn:hover { opacity: 0.8; }

    /* Legacy Stats Grid Fallback */
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px; margin-bottom: 20px;
    }
    .stat-card {
      background: var(--p-color-surface); border: 1px solid var(--p-color-border);
      border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-card);
    }
    .stat-title { font-size: 13px; color: var(--p-color-text-subdued); font-weight: 600; margin-bottom: 6px; }
    .stat-value { font-size: 26px; font-weight: 800; color: #1a1a1a; }
    .stat-badge {
      display: inline-block; font-size: 11px; padding: 2px 8px;
      border-radius: 12px; background: var(--p-color-success-bg); color: var(--p-color-success-text);
      margin-top: 6px; font-weight: 700;
    }

    /* Cards */
    .content-card {
      background: var(--p-color-surface); border: 1px solid var(--p-color-border);
      border-radius: var(--radius-md); padding: 24px; margin-bottom: 20px;
      box-shadow: var(--shadow-card);
    }
    .content-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; border-bottom: 1px solid var(--p-color-border);
      padding-bottom: 14px; flex-wrap: wrap; gap: 10px;
    }
    .content-header h3 { font-size: 17px; font-weight: 800; color: #1a1a1a; }

    /* Table */
    .table-responsive { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      background: #fafbfb; padding: 12px 14px; font-size: 12px;
      font-weight: 700; color: var(--p-color-text-subdued);
      border-bottom: 1px solid var(--p-color-border);
    }
    td {
      padding: 14px; font-size: 13px; border-bottom: 1px solid #f1f2f3;
      vertical-align: middle;
    }
    tr:hover td { background-color: #fafbfb; }
    .order-link { font-weight: 700; color: var(--p-color-primary); text-decoration: none; }
    .order-link:hover { text-decoration: underline; }

    /* Badges */
    .badge {
      display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
      border-radius: 14px; font-size: 11px; font-weight: 700;
    }
    .badge-paid { background: #e4fbf1; color: #0e6245; }
    .badge-pending { background: #fff8e5; color: #8c5b00; }
    .badge-unfulfilled { background: #edf7ff; color: #0b5cab; }
    .badge-fulfilled { background: #e4fbf1; color: #0e6245; }

    /* Form Inputs */
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #202223; }
    .form-input {
      width: 100%; padding: 10px 14px; border: 1px solid var(--p-color-border);
      border-radius: var(--radius-sm); font-size: 14px; font-family: inherit;
    }
    .form-input:focus { outline: none; border-color: var(--p-color-primary); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 900px) {
      .form-row { grid-template-columns: 1fr; }
    }

    .form-toggle {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 0; border-bottom: 1px solid #f1f2f3;
    }
    .form-toggle label { font-size: 14px; font-weight: 600; cursor: pointer; }
    .color-picker-row { display: flex; align-items: center; gap: 12px; }
    .color-input { width: 44px; height: 38px; border: none; border-radius: 6px; cursor: pointer; padding: 0; }

    /* Display Modes Selection Grid */
    .mode-cards-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px; margin: 14px 0 24px;
    }
    .mode-card {
      border: 2px solid var(--p-color-border); border-radius: var(--radius-sm);
      padding: 16px; cursor: pointer !important; transition: all 0.2s ease; background: #fafbfb;
      position: relative; z-index: 5; pointer-events: auto !important; user-select: none;
    }
    .mode-card * {
      pointer-events: none;
    }
    .mode-card:hover { border-color: #bcc0c4; background: #fff; transform: translateY(-1px); }
    .mode-card.active { border-color: var(--p-color-primary); background: #f0faf6; box-shadow: 0 0 0 1px var(--p-color-primary); }
    .mode-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
    .mode-desc { font-size: 12px; color: var(--p-color-text-subdued); line-height: 1.4; }

    /* Switches */
    .switch { position: relative; display: inline-block; width: 46px; height: 26px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
      background-color: #c9cccf; transition: .2s; border-radius: 26px;
    }
    .slider:before {
      position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px;
      background-color: white; transition: .2s; border-radius: 50%;
    }
    input:checked + .slider { background-color: var(--p-color-primary); }
    input:checked + .slider:before { transform: translateX(20px); }

    /* Shopify Contextual Save Bar (In-App Fallback) */
    .contextual-save-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #1a1a1a;
      color: #ffffff;
      padding: 12px 24px;
      z-index: 99999;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transform: translateY(-100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      visibility: hidden;
    }
    .contextual-save-bar.visible {
      transform: translateY(0);
      pointer-events: auto;
      visibility: visible;
    }
    .save-bar-inner {
      max-width: 1380px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .save-bar-message {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #f6f6f7;
    }
    .save-bar-indicator {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #ffd200;
      box-shadow: 0 0 8px rgba(255, 210, 0, 0.7);
      animation: pulseDot 1.4s infinite;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.3); }
    }
    .save-bar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-discard {
      background: transparent !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .btn-discard:hover {
      background: rgba(255, 255, 255, 0.12) !important;
    }
    .btn-primary-save {
      background: #008060 !important;
      color: #ffffff !important;
      border: 1px solid #006e52 !important;
      padding: 7px 18px;
      font-size: 13px;
      font-weight: 700;
      border-radius: var(--radius-sm);
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }
    .btn-primary-save:hover {
      background: #006e52 !important;
    }

    /* Modern Polaris Toast */
    .toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #202223;
      color: #ffffff;
      padding: 13px 24px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 100000;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s ease;
    }
    .toast.toast-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }
    .toast.toast-error {
      background: #d82c0d;
      color: #ffffff;
    }

    /* Modal Backdrop & Window */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
      z-index: 99999;
      display: none;
      pointer-events: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-backdrop.active {
      display: flex;
      pointer-events: auto;
      animation: fadeIn 0.2s ease-in-out;
    }
    .modal-window {
      background: #ffffff;
      border-radius: var(--radius-md);
      box-shadow: 0 16px 48px rgba(0,0,0,0.22);
      width: 100%;
      max-width: 860px;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--p-color-border);
    }
    .modal-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--p-color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafbfb;
    }
    .modal-header h3 {
      font-size: 17px;
      font-weight: 800;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .modal-close-btn {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--p-color-text-subdued);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-close-btn:hover {
      background: #e4e5e7;
      color: #000;
    }
    .modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--p-color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafbfb;
      flex-wrap: wrap;
      gap: 12px;
    }

    /* Country Tabs */
    .country-tab-bar {
      display: flex;
      gap: 8px;
      border-bottom: 2px solid #e1e3e5;
      margin-bottom: 20px;
    }
    .country-tab-btn {
      padding: 10px 18px;
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 700;
      color: var(--p-color-text-subdued);
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .country-tab-btn:hover {
      color: #1a1a1a;
    }
    .country-tab-btn.active {
      color: var(--p-color-primary);
      border-bottom-color: var(--p-color-primary);
    }

    /* Preset Template Cards */
    .preset-card {
      border: 1px solid var(--p-color-border);
      border-radius: var(--radius-sm);
      padding: 18px 20px;
      margin-bottom: 16px;
      background: #ffffff;
      transition: all 0.15s ease;
    }
    .preset-card:hover {
      border-color: #008060;
      box-shadow: 0 4px 12px rgba(0, 128, 96, 0.08);
    }
    .preset-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      gap: 14px;
      flex-wrap: wrap;
    }
    .preset-title {
      font-size: 15px;
      font-weight: 800;
      color: #202223;
    }
    .preset-desc {
      font-size: 13px;
      color: var(--p-color-text-subdued);
      margin-top: 4px;
      line-height: 1.4;
    }
    .preset-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      background: #edf7ff;
      color: #0b5cab;
    }
    .preset-preview {
      background: #f6f6f7;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 12px 0 14px;
      font-size: 12px;
      color: #4a4a4a;
      max-height: 120px;
      overflow-y: auto;
      font-family: monospace;
      line-height: 1.5;
    }

    /* Integrations Page */
    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }
    .integration-card {
      background: var(--p-color-surface);
      border: 1px solid var(--p-color-border);
      border-radius: var(--radius-md);
      padding: 22px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .integration-card:hover {
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .integration-top {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 14px;
    }
    .integration-icon {
      font-size: 32px;
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background: #f4f6f8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .integration-title {
      font-size: 16px;
      font-weight: 800;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .integration-desc {
      font-size: 13px;
      color: var(--p-color-text-subdued);
      line-height: 1.45;
      margin-bottom: 16px;
    }
    .integration-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid #f1f2f3;
    }
  </style>
</head>
<body>
  <!-- Shopify App Bridge Left Navigation Integration -->
  <ui-title-bar title="Store Overview & Recent Activity"></ui-title-bar>
  <ui-nav-menu>
    <a href="/" rel="home">📊 Store Overview & Recent Activity</a>
    <a href="/abandoned-orders">🛒 Abandoned Orders</a>
    <a href="/form-builder">🎨 Form Builder</a>
    <a href="/shipping">🚚 Shipping Rates</a>
    <a href="/payment-methods">💳 Payment Methods</a>
    <a href="/fraud-prevention">🛡️ Fraud Shield</a>
    <a href="/sales-booster">⚡ Sales Booster</a>
    <a href="/integrations">🔌 Integrations</a>
    <a href="/settings">⚙️ Settings</a>
  </ui-nav-menu>

  <!-- Fallback In-App Contextual Save Bar -->
  <div id="inapp-save-bar" class="contextual-save-bar">
    <div class="save-bar-inner">
      <div class="save-bar-message">
        <span class="save-bar-indicator"></span>
        <span>Unsaved changes</span>
      </div>
      <div class="save-bar-actions">
        <button type="button" class="btn btn-discard" onclick="discardChanges()">Discard</button>
        <button type="button" class="btn btn-primary-save" onclick="saveAllSettings(this)">Save</button>
      </div>
    </div>
  </div>

  <!-- Polaris Toast Container -->
  <div id="toast" class="toast"></div>

  <div class="container">
    <!-- Top Header (Unified Single Modern Header) -->
    <header class="top-bar">
      <div class="app-brand">
        <div class="brand-icon">⚡</div>
        <div class="brand-info">
          <h1>Artiz Quick Order <span class="store-badge">Connected: ${storeDisplayTitle}</span></h1>
        </div>
      </div>
      <div class="header-actions">
        <button type="button" onclick="this.classList.add('rotating'); window.location.reload();" class="btn-icon-refresh" title="Refresh Data" aria-label="Refresh Data">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
        <a href="https://${shop}/admin/orders" target="_top" class="btn-shopify-orders">
          📦 Orders in Shopify
        </a>
      </div>
    </header>

    ${needsAuth ? `
    <!-- Authorization Alert Banner -->
    <div class="auth-banner">
      <div class="auth-banner-content">
        <span style="font-size: 22px;">⚠️</span>
        <div>
          <strong>Shopify Admin API Connection Required</strong>
          <div style="font-size: 12px; opacity: 0.9;">To enable automatic order creation and live analytics, complete OAuth verification or supply an Admin API Access Token.</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <a href="${installUrl}" target="_top" class="auth-banner-btn">🔑 Authorize App (OAuth)</a>
        <input type="password" id="manual-access-token" placeholder="Or paste shpat_..." style="padding: 6px 10px; font-size: 12px; border-radius: 6px; border: 1px solid #fedb9b; width: 170px;">
        <button onclick="saveManualToken()" class="btn" style="padding: 6px 12px; font-size: 12px; background: #8c5b00;">Save Token</button>
      </div>
    </div>
    ` : ""}

    <!-- ==================== MAIN WORKSPACE ==================== -->
    <div class="app-layout">
      <!-- MAIN DEDICATED PAGE VIEWS -->
      <main class="app-main">

        <!-- ==================== PAGE 1: OVERVIEW & ORDERS (COBRA STYLE) ==================== -->
        <section id="page-overview" class="page-view ${initialPage === 'overview' ? 'active' : ''}">

          <!-- 1. The 4 Top Vital KPI Cards -->
          <div class="dash-kpi-grid">
            <!-- Card 1: Today Sales -->
            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Today's Sales</span>
                <div class="dash-kpi-icon-wrap icon-green">💰</div>
              </div>
              <div class="dash-kpi-value" title="${todayMetrics.salesExact || todayMetrics.salesFormatted} ${currencyDisplay}">
                ${todayMetrics.salesFormatted} <span class="dash-kpi-cur">${currencyDisplay}</span>
              </div>
              <div class="dash-kpi-footer">
                <span class="dash-trend-pill ${todayMetrics.salesGrowthPositive ? 'trend-up' : 'trend-down'}">
                  ${todayMetrics.salesGrowth}
                </span>
                <span class="dash-trend-label">vs yesterday</span>
              </div>
            </div>

            <!-- Card 2: Today Orders -->
            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Today's Orders</span>
                <div class="dash-kpi-icon-wrap icon-amber">🛍️</div>
              </div>
              <div class="dash-kpi-value">${todayMetrics.orders} <span class="dash-kpi-cur">orders</span></div>
              <div class="dash-kpi-footer">
                <span class="dash-trend-pill ${todayMetrics.ordersGrowthPositive ? 'trend-up' : 'trend-down'}">
                  ${todayMetrics.ordersGrowth}
                </span>
                <span class="dash-trend-label">vs yesterday</span>
              </div>
            </div>

            <!-- Card 3: Today Customers -->
            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Today's Customers</span>
                <div class="dash-kpi-icon-wrap icon-purple">👥</div>
              </div>
              <div class="dash-kpi-value">${todayMetrics.customers} <span class="dash-kpi-cur">customers</span></div>
              <div class="dash-kpi-footer">
                <span class="dash-trend-pill ${todayMetrics.customersGrowthPositive ? 'trend-up' : 'trend-down'}">
                  ${todayMetrics.customersGrowth}
                </span>
                <span class="dash-trend-label">vs yesterday</span>
              </div>
            </div>

            <!-- Card 4: AOV -->
            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Average Order Value</span>
                <div class="dash-kpi-icon-wrap icon-gold">📈</div>
              </div>
              <div class="dash-kpi-value" title="${todayMetrics.aovExact || todayMetrics.aov} ${currencyDisplay}">
                ${todayMetrics.aov} <span class="dash-kpi-cur">${currencyDisplay}</span>
              </div>
              <div class="dash-kpi-footer">
                <span class="dash-trend-pill ${todayMetrics.aovGrowthPositive ? 'trend-up' : 'trend-down'}">
                  ${todayMetrics.aovGrowth}
                </span>
                <span class="dash-trend-label">vs yesterday</span>
              </div>
            </div>
          </div>

          <!-- 2. Dual Visual Analytics Row (Donut Funnel & 30-Day Sales Curve) -->
          <div class="dash-analytics-row">
            <!-- Left: Order Statuses Donut Chart -->
            <div class="dash-card dash-card-donut">
              <div class="dash-card-header">
                <div>
                  <h3 class="dash-card-title">🎯 Order Status & Fulfillment</h3>
                  <p class="dash-card-subtitle" id="donut-subtitle">Delivery Status (Last 24H)</p>
                </div>
                <div class="dash-period-toggle">
                  <button type="button" class="dash-period-btn active" onclick="switchDonutPeriod('h24', this)">24 Hours</button>
                  <button type="button" class="dash-period-btn" onclick="switchDonutPeriod('h48', this)">48 Hours</button>
                </div>
              </div>

              <div class="dash-donut-content">
                <div class="dash-donut-visual">
                  <svg viewBox="0 0 160 160" class="donut-svg">
                    <circle cx="80" cy="80" r="62" fill="none" stroke="#262a33" stroke-width="15" />
                    <circle id="donut-delivered-arc" cx="80" cy="80" r="62" fill="none" stroke="#10b981" stroke-width="15"
                      stroke-dasharray="390" stroke-dashoffset="${390 - (390 * (Number(fulfillmentBreakdown.h24.rate) / 100))}"
                      stroke-linecap="round" transform="rotate(-90 80 80)" style="transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);" />
                  </svg>
                  <div class="donut-center-info">
                    <div class="donut-rate" id="donut-rate-text">${fulfillmentBreakdown.h24.rate}%</div>
                    <div class="donut-rate-label">Delivery Rate</div>
                    <div class="donut-sub-count" id="donut-orders-sub">${fulfillmentBreakdown.h24.total} orders (Last 24 Hours)</div>
                  </div>
                </div>

                <div class="dash-donut-breakdown">
                  <!-- Item Delivered -->
                  <div class="donut-stat-row stat-delivered">
                    <div class="donut-stat-icon">🎁</div>
                    <div class="donut-stat-details">
                      <div class="donut-stat-title">Delivered</div>
                      <div class="donut-stat-desc">Completed & Delivered</div>
                    </div>
                    <div class="donut-stat-numbers">
                      <span class="donut-stat-count" id="stat-delivered-count">${fulfillmentBreakdown.h24.delivered}</span>
                      <span class="donut-stat-pct" id="stat-delivered-pct">${fulfillmentBreakdown.h24.rate}%</span>
                    </div>
                  </div>

                  <!-- Item Pending -->
                  <div class="donut-stat-row stat-pending">
                    <div class="donut-stat-icon">⏳</div>
                    <div class="donut-stat-details">
                      <div class="donut-stat-title">Pending Delivery</div>
                      <div class="donut-stat-desc">Paid / Processing — In Transit</div>
                    </div>
                    <div class="donut-stat-numbers">
                      <span class="donut-stat-count" id="stat-pending-count">${fulfillmentBreakdown.h24.pending}</span>
                      <span class="donut-stat-pct" id="stat-pending-pct">${(100 - Number(fulfillmentBreakdown.h24.rate)).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: 7 Days Sales Area Chart -->
            <div class="dash-card dash-card-chart">
              <div class="dash-card-header">
                <div>
                  <h3 class="dash-card-title">📈 Sales — Last 7 Days</h3>
                  <p class="dash-card-subtitle">Daily revenue volume and checkout trend (Weekly)</p>
                </div>
                <div class="dash-chart-badge" id="dash-chart-badge">
                  <span id="chart-badge-text">Last 7 Days</span>
                </div>
              </div>

              <div class="dash-chart-container">
                <div class="dash-chart-y-axis" id="dash-chart-y-axis">
                  <span id="y-axis-4">${formatCompactNumber(salesChartSvg.maxRev)}</span>
                  <span id="y-axis-3">${formatCompactNumber(salesChartSvg.maxRev * 0.75)}</span>
                  <span id="y-axis-2">${formatCompactNumber(salesChartSvg.maxRev * 0.5)}</span>
                  <span id="y-axis-1">${formatCompactNumber(salesChartSvg.maxRev * 0.25)}</span>
                  <span>0</span>
                </div>
                
                <div class="dash-chart-svg-wrap">
                  <!-- Shimmer / Skeleton Loading Overlay (Fades out smoothly when weekly orders load) -->
                  <div class="chart-skeleton-wrap" id="chart-skeleton">
                    <div class="skeleton-shimmer-wave"></div>
                    <div class="skeleton-label">
                      <span class="pulse-dot"></span>
                      <span>Calculating full week's sales...</span>
                    </div>
                  </div>

                  <svg viewBox="0 0 600 190" class="chart-svg" id="sales-chart-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradientGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.38"/>
                        <stop offset="80%" stop-color="#f59e0b" stop-opacity="0.04"/>
                        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
                      </linearGradient>
                      <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#f59e0b" flood-opacity="0.5"/>
                      </filter>
                    </defs>

                    <!-- Horizontal Grid Lines -->
                    <line x1="20" y1="25" x2="580" y2="25" stroke="#262a33" stroke-dasharray="3 3"/>
                    <line x1="20" y1="67" x2="580" y2="67" stroke="#262a33" stroke-dasharray="3 3"/>
                    <line x1="20" y1="109" x2="580" y2="109" stroke="#262a33" stroke-dasharray="3 3"/>
                    <line x1="20" y1="151" x2="580" y2="151" stroke="#262a33" stroke-dasharray="3 3"/>

                    <!-- Shaded Area -->
                    <path id="chart-area-path" d="${salesChartSvg.areaD || ''}" fill="url(#chartGradientGold)" />

                    <!-- Glowing Line -->
                    <path id="chart-line-path" d="${salesChartSvg.pathD || ''}" fill="none" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowGold)" />

                    <!-- Interactive Vertical Guide Line -->
                    <line id="chart-guide-line" x1="0" y1="20" x2="0" y2="165" stroke="rgba(255, 255, 255, 0.45)" stroke-width="1.5" stroke-dasharray="3 3" style="display: none; pointer-events: none;" />

                    <!-- Active Glowing Highlight Dot -->
                    <circle id="chart-active-dot" cx="0" cy="0" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" style="display: none; pointer-events: none; filter: url(#glowGold);" />

                    <!-- All Day Markers Group -->
                    <g id="chart-points-group">
                      ${salesChartSvg.points.map(pt => `
                        <circle cx="${pt.x}" cy="${pt.y}" r="3.2" fill="#14161a" stroke="#f59e0b" stroke-width="1.8" class="chart-point" pointer-events="none"></circle>
                      `).join("")}
                    </g>

                    <!-- Transparent Hit Target Overlay -->
                    <rect id="chart-hit-rect" x="0" y="0" width="600" height="190" fill="transparent" style="cursor: crosshair;" />
                  </svg>

                  <!-- Floating Hover Tooltip Box -->
                  <div id="chart-hover-tooltip" class="chart-tooltip-box" style="display: none;">
                    <div class="chart-tooltip-date" id="tooltip-date">Date: --</div>
                    <div class="chart-tooltip-sales" id="tooltip-sales">Sales: <strong>0 ${currencyDisplay}</strong></div>
                  </div>

                  <!-- X-Axis Dates Spanning Full 7 Days -->
                  <div class="dash-chart-x-axis" id="dash-chart-x-axis">
                    ${salesChartSvg.points.map(p => `<span>${p.date}</span>`).join("")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Operations Stack: Actionable Orders First, Top Products Second (Full Width Stack) -->
          <div class="dash-operations-row">
            <!-- Orders & Delivery Operations Card -->
            <div class="dash-card dash-orders-card">
              <div class="dash-card-header">
                <div>
                  <h3 class="dash-card-title">
                    <span id="orders-card-title">📦 Orders & Delivery Operations</span>
                    <span class="dash-badge-count" id="orders-tab-count">${unfulfilledOrders.length > 0 ? unfulfilledOrders.length : inTransitOrders.length}</span>
                  </h3>
                  <p class="dash-card-subtitle" id="orders-tab-subtitle">
                    ${unfulfilledOrders.length > 0 ? "Orders requiring packaging and courier fulfillment" : "Dispatched COD orders awaiting delivery and cash collection"}
                  </p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                  <div class="dash-period-toggle" id="orders-filter-toggle">
                    <button type="button" class="dash-period-btn ${unfulfilledOrders.length > 0 ? 'active' : ''}" id="tab-btn-unfulfilled" onclick="switchOrdersTab('unfulfilled', this)">
                      Awaiting Fulfillment (${unfulfilledOrders.length})
                    </button>
                    <button type="button" class="dash-period-btn ${unfulfilledOrders.length === 0 ? 'active' : ''}" id="tab-btn-intransit" onclick="switchOrdersTab('intransit', this)">
                      In Transit / COD (${inTransitOrders.length})
                    </button>
                    <button type="button" class="dash-period-btn" id="tab-btn-all" onclick="switchOrdersTab('all', this)">
                      All Recent (${allOrders.length})
                    </button>
                  </div>
                  <a href="https://${shop}/admin/orders?fulfillment_status=unfulfilled" target="_top" class="dash-link-btn" id="orders-link-btn">
                    View in Shopify ↗
                  </a>
                </div>
              </div>

              <div class="dash-orders-scroll-area">
                <!-- Tab 1: Unfulfilled / Actionable Orders -->
                <div id="orders-table-unfulfilled" style="display: ${unfulfilledOrders.length > 0 ? 'block' : 'none'};">
                  ${unfulfilledOrders.length > 0 ? `
                  <table class="dash-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                        <th>Fulfillment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${renderOrdersRows(unfulfilledOrders, "Fulfill ↗")}
                    </tbody>
                  </table>
                  ` : `
                  <div class="dash-empty-orders">
                    <div class="dash-empty-icon">🎉</div>
                    <h4>All caught up! No orders awaiting fulfillment.</h4>
                    <p>All recent orders have been packaged and dispatched. Switch to <strong>In Transit / COD</strong> to track active deliveries.</p>
                  </div>
                  `}
                </div>

                <!-- Tab 2: In-Transit COD Orders -->
                <div id="orders-table-intransit" style="display: ${unfulfilledOrders.length === 0 ? 'block' : 'none'};">
                  ${inTransitOrders.length > 0 ? `
                  <table class="dash-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                        <th>Delivery Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${renderOrdersRows(inTransitOrders, "View Order ↗")}
                    </tbody>
                  </table>
                  ` : `
                  <div class="dash-empty-orders">
                    <div class="dash-empty-icon">🚚</div>
                    <h4>No orders in transit right now.</h4>
                    <p>When orders are dispatched with Cash on Delivery, they will appear here until cash is collected.</p>
                  </div>
                  `}
                </div>

                <!-- Tab 3: All Recent Orders -->
                <div id="orders-table-all" style="display: none;">
                  ${allOrders.length > 0 ? `
                  <table class="dash-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${renderOrdersRows(allOrders, "View Order ↗")}
                    </tbody>
                  </table>
                  ` : `
                  <div class="dash-empty-orders">
                    <div class="dash-empty-icon">🛍️</div>
                    <h4>No orders placed yet.</h4>
                    <p>Orders created via the store checkout will appear here.</p>
                  </div>
                  `}
                </div>
              </div>
            </div>

            <!-- Top Winning Products (Full Width Grid Underneath) -->
            <div class="dash-card dash-products-card">
              <div class="dash-card-header">
                <div>
                  <h3 class="dash-card-title">🔥 Top Winning Products</h3>
                  <p class="dash-card-subtitle">Best-selling products ordered through quick checkout — Last 24 Hours</p>
                </div>
                <a href="https://${shop}/admin/products" target="_top" class="dash-link-btn">
                  View Products ↗
                </a>
              </div>

              <div class="dash-products-grid">
                ${topProducts.length > 0 ? topProducts.map((p, idx) => `
                  <div class="dash-product-item">
                    <div class="dash-product-rank rank-${idx + 1}">${idx + 1}</div>
                    <div class="dash-product-info">
                      <div class="dash-product-title" title="${p.title}">${p.title}</div>
                      <div class="dash-product-sales">${p.salesCount} sales</div>
                    </div>
                    <div class="dash-product-price">
                      ${p.unitPrice ? `${p.unitPrice.toLocaleString()} ${currencyDisplay}` : `${p.salesCount} sales`}
                    </div>
                  </div>
                `).join("") : `
                  <div class="dash-empty-orders" style="grid-column: 1 / -1;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🛍️</div>
                    <p>Winning products will appear here once orders are placed in the last 24 hours.</p>
                  </div>
                `}
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE: ABANDONED ORDERS ==================== -->
        <section id="page-abandoned-orders" class="page-view ${initialPage === 'abandoned-orders' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Abandoned Orders</span>
              </div>
              <h2>🛒 Abandoned Orders Recovery</h2>
              <p>Follow up with customers who hesitated or faced an issue during online payment, or convert their cart to COD with 1 click.</p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <button type="button" id="ab-btn-bulk-delete" class="btn" style="background: #dc2626; color: #fff; font-size: 12px; padding: 8px 14px; display: none; align-items: center; gap: 6px;" onclick="deleteSelectedAbandoned()">🗑️ Delete Selected (<span id="ab-selected-count">0</span>)</button>
              <button type="button" class="btn" style="background: rgba(220, 38, 38, 0.15); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.35); font-size: 12px; padding: 8px 14px;" onclick="cleanupAbandoned24h(this)">🧹 Clean Older Than 24h</button>
              <button type="button" id="ab-btn-refresh" class="btn btn-save" onclick="loadAbandonedOrders(true)"><span id="ab-refresh-spinner" style="display: none; margin-right: 4px;">⏳</span> 🔄 Refresh</button>
            </div>
          </div>

          <!-- 4 Vital KPI Cards (Cobra Dark Style) -->
          <div class="dash-kpi-grid" style="margin-bottom: 24px;">
            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Total Abandoned</span>
                <div class="dash-kpi-icon-wrap icon-amber">🛒</div>
              </div>
              <div class="dash-kpi-value" id="ab-stat-total">0</div>
              <div class="dash-kpi-footer"><span class="dash-trend-label">Uncompleted payment attempts</span></div>
            </div>

            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Potential Lost Value</span>
                <div class="dash-kpi-icon-wrap icon-red">💰</div>
              </div>
              <div class="dash-kpi-value" id="ab-stat-value">0 <span class="dash-kpi-cur">${currencyDisplay}</span></div>
              <div class="dash-kpi-footer"><span class="dash-trend-label">Recoverable revenue</span></div>
            </div>

            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Today's Abandoned</span>
                <div class="dash-kpi-icon-wrap icon-blue">📅</div>
              </div>
              <div class="dash-kpi-value" id="ab-stat-today">0</div>
              <div class="dash-kpi-footer"><span class="dash-trend-label">Abandoned within 24h</span></div>
            </div>

            <div class="dash-kpi-card">
              <div class="dash-kpi-header">
                <span class="dash-kpi-title">Contacted Customers</span>
                <div class="dash-kpi-icon-wrap icon-green">💬</div>
              </div>
              <div class="dash-kpi-value" id="ab-stat-contacted">0</div>
              <div class="dash-kpi-footer"><span class="dash-trend-label">Via WhatsApp messages</span></div>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="content-card" style="padding: 16px 20px; margin-bottom: 20px;">
            <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 260px; position: relative;">
                <input type="text" id="ab-search-input" placeholder="Search by customer name, phone, city, or product..." oninput="onFilterAbandoned()" style="width: 100%; padding: 10px 14px; background: #0b1329; border: 1px solid #1e293b; border-radius: 8px; color: #fff; font-size: 13px;">
              </div>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn btn-period active" id="ab-filter-all" onclick="setAbandonedFilter('all', this)" style="padding: 8px 14px; font-size: 12px;">All Time</button>
                <button type="button" class="btn btn-period" id="ab-filter-today" onclick="setAbandonedFilter('today', this)" style="padding: 8px 14px; font-size: 12px;">Today</button>
                <button type="button" class="btn btn-period" id="ab-filter-week" onclick="setAbandonedFilter('week', this)" style="padding: 8px 14px; font-size: 12px;">Last 7 Days</button>
              </div>
            </div>
          </div>

          <!-- Table Card -->
          <div class="content-card" style="padding: 0; overflow: hidden;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;" id="ab-orders-table">
                <thead>
                  <tr style="background: rgba(15, 23, 42, 0.7); border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px;">
                    <th style="width: 40px; padding: 14px 16px; text-align: center;"><input type="checkbox" id="ab-select-all" onchange="toggleSelectAllAbandoned(this)" style="cursor: pointer; width: 16px; height: 16px; accent-color: #10b981;"></th>
                    <th style="padding: 14px 16px;">Cart ID</th>
                    <th style="padding: 14px 16px;">Customer</th>
                    <th style="padding: 14px 16px;">Products</th>
                    <th style="padding: 14px 16px;">Amount</th>
                    <th style="padding: 14px 16px;">Abandoned</th>
                    <th style="padding: 14px 16px;">Status</th>
                    <th style="padding: 14px 16px; text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody id="ab-orders-tbody">
                  <tr>
                    <td colspan="8" style="padding: 36px; text-align: center; color: #94a3b8;">
                      Loading abandoned checkouts...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- WhatsApp Templates Modal -->
          <div id="ab-wa-modal" style="display: none; position: fixed; inset: 0; z-index: 99999; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 20px;">
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; max-width: 580px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); overflow: hidden; color: #f1f5f9; display: flex; flex-direction: column;">
              <div style="padding: 16px 20px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; background: rgba(30, 41, 59, 0.5);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 22px;">💬</span>
                  <div>
                    <h3 style="font-size: 15px; font-weight: 700; color: #fff; margin: 0;" id="ab-wa-modal-title">WhatsApp Follow-Up</h3>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;" id="ab-wa-modal-sub">...</div>
                  </div>
                </div>
                <button type="button" onclick="closeAbandonedWhatsAppModal()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px;">✕</button>
              </div>
              
              <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
                <!-- Template Selector -->
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 6px;">Select Message Template:</label>
                  <select id="ab-wa-template-select" onchange="onAbandonedTemplateChange()" style="width: 100%; padding: 10px 12px; background: #0b1329; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 13px; outline: none;">
                    <option value="abandoned_recovery">🛒 Abandoned Cart Recovery (Help)</option>
                    <option value="abandoned_discount">🎁 Abandoned Cart Offer (Discount)</option>
                    <option value="confirmation">✅ Payment Confirmation</option>
                    <option value="credentials">🔑 Order / Subscription Delivery</option>
                    <option value="delay">⏳ Order Delay Notice</option>
                    <option value="follow_up">💬 Order Follow-Up</option>
                    <option value="review_request">⭐ Service Review Request</option>
                    <option value="custom">✏️ Custom Message</option>
                  </select>
                </div>

                <!-- Discount Options (Conditional) -->
                <div id="ab-wa-discount-wrap" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; background: rgba(30, 41, 59, 0.5); padding: 12px; border-radius: 8px; border: 1px solid #334155;">
                  <div>
                    <label style="display: block; font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Discount Code:</label>
                    <input type="text" id="ab-wa-discount-code" value="OFFER10" oninput="onAbandonedTemplateChange()" style="width: 100%; padding: 6px 10px; background: #0b1329; border: 1px solid #475569; border-radius: 6px; color: #f59e0b; font-weight: 700; font-size: 12px;">
                  </div>
                  <div>
                    <label style="display: block; font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Discount (%):</label>
                    <input type="number" id="ab-wa-discount-pct" value="10" min="1" max="100" oninput="onAbandonedTemplateChange()" style="width: 100%; padding: 6px 10px; background: #0b1329; border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 12px;">
                  </div>
                </div>

                <!-- Message Textarea Preview -->
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">Message Preview (Editable before sending):</label>
                    <span style="font-size: 11px; color: #64748b;" id="ab-wa-char-count">0 characters</span>
                  </div>
                  <textarea id="ab-wa-message-text" rows="8" style="width: 100%; padding: 12px; background: #0b1329; border: 1px solid #334155; border-radius: 8px; color: #e2e8f0; font-size: 13px; line-height: 1.5; resize: vertical; outline: none; font-family: inherit; direction: rtl;"></textarea>
                </div>
              </div>

              <!-- Modal Footer Actions -->
              <div style="padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-top: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <button type="button" onclick="closeAbandonedWhatsAppModal()" class="btn" style="background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 8px 14px; font-size: 12px; border-radius: 6px;">Cancel</button>
                
                <div style="display: flex; gap: 8px;">
                  <button type="button" onclick="sendAbandonedBotWhatsApp()" class="btn" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); padding: 8px 14px; font-size: 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;" title="Send via Automated Bot">
                    <span>🤖</span> Send via Bot
                  </button>

                  <button type="button" onclick="sendAbandonedManualWhatsApp()" class="btn" style="background: #25D366; color: #fff; font-weight: 700; padding: 8px 16px; font-size: 13px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                    <span>💬</span> Send via WhatsApp (Manual)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE 2: FORM BUILDER ==================== -->
        <section id="page-form-builder" class="page-view ${initialPage === 'form-builder' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Form Builder</span>
              </div>
              <h2>🎨 Form Builder & Checkout Customization</h2>
              <p>Configure form presentation, required fields, color styling, and call-to-action button copy</p>
            </div>
            <button class="btn btn-save" onclick="saveAllSettings(this)">💾 Save Form Settings</button>
          </div>

          <div class="content-card">
            <!-- ================= 1. Smart Button & Trigger Strategy ================= -->
            <div class="content-header" style="margin-bottom: 4px;">
              <h3 style="display: flex; align-items: center; gap: 8px;">1. Storefront Button Strategy & Action Controls</h3>
            </div>
            <p style="font-size: 12.5px; color: var(--p-color-text-subdued); margin-bottom: 16px;">
              Configure how product pages and drawers handle purchase buttons, with full control over Add to Cart visibility.
            </p>

            <!-- Option 1: Mode Selection Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-bottom: 16px;">
              <label style="display: flex; gap: 12px; padding: 14px 16px; border: 2px solid ${formConfig.buttonMode !== 'hijack' ? '#008060' : 'var(--p-color-border)'}; border-radius: var(--radius-sm); background: ${formConfig.buttonMode !== 'hijack' ? '#f0fdf4' : '#ffffff'}; cursor: pointer; transition: all 0.2s;" id="label-mode-replace">
                <input type="radio" name="cfg-buttonMode" id="cfg-buttonMode-replace" value="replace" ${formConfig.buttonMode !== 'hijack' ? 'checked' : ''} onchange="onButtonModeChange('replace')" style="margin-top: 3px;">
                <div>
                  <strong style="display: block; font-size: 13.5px; color: #1a1a1a;">Button Replacement (App Managed)</strong>
                  <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-top: 3px;">
                    Completely replace native theme buttons with high-converting Quick Order & Add to Cart action buttons.
                  </div>
                </div>
              </label>

              <label style="display: flex; gap: 12px; padding: 14px 16px; border: 2px solid ${formConfig.buttonMode === 'hijack' ? '#008060' : 'var(--p-color-border)'}; border-radius: var(--radius-sm); background: ${formConfig.buttonMode === 'hijack' ? '#f0fdf4' : '#ffffff'}; cursor: pointer; transition: all 0.2s;" id="label-mode-hijack">
                <input type="radio" name="cfg-buttonMode" id="cfg-buttonMode-hijack" value="hijack" ${formConfig.buttonMode === 'hijack' ? 'checked' : ''} onchange="onButtonModeChange('hijack')" style="margin-top: 3px;">
                <div>
                  <strong style="display: block; font-size: 13.5px; color: #1a1a1a;">Smart Native Hijack (100% Native Theme Look)</strong>
                  <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-top: 3px;">
                    Retain 100% of your native theme buttons, intercepting the 'Buy Now' click to open the Quick Order checkout form.
                  </div>
                </div>
              </label>
            </div>

            <!-- Sub-option: Show Add to Cart Button (Only in Replace Mode) -->
            <div id="box-show-add-to-cart" class="form-toggle" style="display: ${formConfig.buttonMode === 'hijack' ? 'none' : 'flex'}; margin-bottom: 16px; background: #fafbfb; padding: 12px 14px; border: 1px dashed var(--p-color-border); border-radius: var(--radius-sm);">
              <div>
                <label for="cfg-showAddToCartButton" style="font-weight: 600;">Show 'Add to Cart' button alongside the Quick Order button</label>
                <div style="font-size: 11.5px; color: var(--p-color-text-subdued); margin-top: 2px;">
                  Disabling this toggle hides the Add to Cart button and leaves only the primary direct order button to maximize immediate conversion.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-showAddToCartButton" ${formConfig.showAddToCartButton !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Placement Triggers -->
            <div style="margin-top: 14px; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #1a1a1a;">
              Storefront Placement Triggers:
            </div>

            <div class="form-toggle" style="margin-bottom: 8px;">
              <div>
                <label for="cfg-directBuyTrigger">Product Page & Quick Buy Drawers</label>
                <div style="font-size: 11.5px; color: var(--p-color-text-subdued);">Apply the button strategy on product pages and quick-view modal dialogs.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-directBuyTrigger" ${formConfig.directBuyTrigger !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-toggle">
              <div>
                <label for="cfg-cartDrawerTrigger">Slide Cart Drawer & Cart Page</label>
                <div style="font-size: 11.5px; color: var(--p-color-text-subdued);">Apply the button strategy in side slide-out cart drawers and the dedicated cart page.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-cartDrawerTrigger" ${formConfig.cartDrawerTrigger !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">2. Checkout Display Mode</h3>

            <div class="mode-cards-grid">
              <div class="mode-card ${formConfig.displayMode === 'popup_modal' ? 'active' : ''}" data-mode="popup_modal" onclick="selectMode('popup_modal', this)">
                <div class="mode-title">
                  <span>🪟 Popup Modal</span>
                  <span class="badge badge-paid">Highest Conversion</span>
                </div>
                <div class="mode-desc">A centered modal pops up with backdrop blur, immediately capturing shopper focus to complete the order.</div>
              </div>

              <div class="mode-card ${formConfig.displayMode === 'slide_drawer' ? 'active' : ''}" data-mode="slide_drawer" onclick="selectMode('slide_drawer', this)">
                <div class="mode-title">
                  <span>📑 Slide Drawer</span>
                  <span class="badge" style="background:#edf7ff;color:#0b5cab;">Smooth & Mobile</span>
                </div>
                <div class="mode-desc">Slides smoothly from the edge of the screen, providing a native mobile app feel.</div>
              </div>

              <div class="mode-card ${formConfig.displayMode === 'inline_form' ? 'active' : ''}" data-mode="inline_form" onclick="selectMode('inline_form', this)">
                <div class="mode-title">
                  <span>📦 Embedded Inline</span>
                  <span class="badge" style="background:#f1f2f3;color:#6d7175;">Classic</span>
                </div>
                <div class="mode-desc">Directly embedded inside the product page beneath add-to-cart buttons without modal popups.</div>
              </div>

              <div class="mode-card ${formConfig.displayMode === 'sticky_bar' ? 'active' : ''}" data-mode="sticky_bar" onclick="selectMode('sticky_bar', this)">
                <div class="mode-title">
                  <span>📱 Sticky Buy Bar</span>
                  <span class="badge" style="background:#fff8e5;color:#8c5b00;">Mobile Only</span>
                </div>
                <div class="mode-desc">Floats at the bottom of mobile screens while scrolling and expands the checkout form with a single tap.</div>
              </div>
            </div>
            <input type="hidden" id="cfg-displayMode" value="${formConfig.displayMode}">

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">3. Form Messaging & Button Copy</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Form Header Title:</label>
                <input type="text" id="cfg-formTitle" class="form-input" value="${formConfig.formTitle}">
              </div>
              <div class="form-group">
                <label>Product Page Buy Button Text:</label>
                <input type="text" id="cfg-buttonText" class="form-input" value="${formConfig.buttonText || 'اشتري الآن - الدفع عند الاستلام'}">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Modal Submit Button Text:</label>
                <input type="text" id="cfg-submitButtonText" class="form-input" value="${formConfig.submitButtonText || 'أطلب الآن'}">
              </div>
              <div class="form-group">
                <label>Add to Cart Button Text:</label>
                <input type="text" id="cfg-addToCartButtonText" class="form-input" value="${formConfig.addToCartButtonText || 'أضف إلى السلة'}">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Discount Badge Prefix (Customizable Tag):</label>
                <input type="text" id="cfg-discountBadgePrefix" class="form-input" value="${formConfig.discountBadgePrefix || 'خصم'}" placeholder="e.g. خصم or Discount or Save">
                <div style="font-size: 11.5px; color: var(--p-color-text-subdued); margin-top: 4px;">Prefix for the single discount badge displayed next to discounted prices.</div>
              </div>
              <div class="form-group">
                <label>Button Subtext / Guarantee Message:</label>
                <input type="text" id="cfg-buttonSubtext" class="form-input" value="${formConfig.buttonSubtext || 'توصيل سريع ومريح لباب المنزل'}">
              </div>
            </div>

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">4. Branding & Colors</h3>
            <p style="font-size: 12.5px; color: var(--p-color-text-subdued); margin-bottom: 16px;">
              Unified storefront color scheme. These root variables dynamically style your Primary (Buy Now / Quick Order) and Secondary (Add to Cart) action buttons and hover states.
            </p>

            <!-- Primary Button Color Scheme -->
            <div style="background: #fafbfb; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 14px;">
              <strong style="display: block; font-size: 13px; color: #1a1a1a; margin-bottom: 12px;">Primary Button Styling (Buy Now / Quick Order & Modal Submit)</strong>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
                <div class="form-group">
                  <label style="font-size: 12px;">Primary Brand / Background Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-primaryColor" class="color-input" value="${formConfig.primaryColor || '#020a25'}" oninput="document.getElementById('cfg-primaryColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-primaryColor-text" value="${formConfig.primaryColor || '#020a25'}" oninput="document.getElementById('cfg-primaryColor').value = this.value">
                  </div>
                </div>
                <div class="form-group">
                  <label style="font-size: 12px;">Button Hover Background Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-primaryHoverColor" class="color-input" value="${formConfig.primaryHoverColor || '#0a1845'}" oninput="document.getElementById('cfg-primaryHoverColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-primaryHoverColor-text" value="${formConfig.primaryHoverColor || '#0a1845'}" oninput="document.getElementById('cfg-primaryHoverColor').value = this.value">
                  </div>
                </div>
                <div class="form-group">
                  <label style="font-size: 12px;">Button Text & Icon Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-buttonTextColor" class="color-input" value="${formConfig.buttonTextColor || '#ffffff'}" oninput="document.getElementById('cfg-buttonTextColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-buttonTextColor-text" value="${formConfig.buttonTextColor || '#ffffff'}" oninput="document.getElementById('cfg-buttonTextColor').value = this.value">
                  </div>
                </div>
              </div>
            </div>

            <!-- Secondary Button Color Scheme -->
            <div style="background: #fafbfb; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 14px;">
              <strong style="display: block; font-size: 13px; color: #1a1a1a; margin-bottom: 12px;">Secondary Button Styling (Add to Cart Action)</strong>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
                <div class="form-group">
                  <label style="font-size: 12px;">Button Background Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-secondaryColor" class="color-input" value="${formConfig.secondaryColor || '#ffffff'}" oninput="document.getElementById('cfg-secondaryColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-secondaryColor-text" value="${formConfig.secondaryColor || '#ffffff'}" oninput="document.getElementById('cfg-secondaryColor').value = this.value">
                  </div>
                </div>
                <div class="form-group">
                  <label style="font-size: 12px;">Button Hover Background Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-secondaryHoverColor" class="color-input" value="${formConfig.secondaryHoverColor || '#f8fafc'}" oninput="document.getElementById('cfg-secondaryHoverColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-secondaryHoverColor-text" value="${formConfig.secondaryHoverColor || '#f8fafc'}" oninput="document.getElementById('cfg-secondaryHoverColor').value = this.value">
                  </div>
                </div>
                <div class="form-group">
                  <label style="font-size: 12px;">Button Text & Icon Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-secondaryTextColor" class="color-input" value="${formConfig.secondaryTextColor || '#1e293b'}" oninput="document.getElementById('cfg-secondaryTextColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-secondaryTextColor-text" value="${formConfig.secondaryTextColor || '#1e293b'}" oninput="document.getElementById('cfg-secondaryTextColor').value = this.value">
                  </div>
                </div>
                <div class="form-group">
                  <label style="font-size: 12px;">Button Border Color:</label>
                  <div class="color-picker-row">
                    <input type="color" id="cfg-secondaryBorderColor" class="color-input" value="${formConfig.secondaryBorderColor || '#cbd5e1'}" oninput="document.getElementById('cfg-secondaryBorderColor-text').value = this.value">
                    <input type="text" class="form-input" id="cfg-secondaryBorderColor-text" value="${formConfig.secondaryBorderColor || '#cbd5e1'}" oninput="document.getElementById('cfg-secondaryBorderColor').value = this.value">
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">5. Checkout Fields Configuration</h3>
            
            <!-- Full Name (Mandatory & Non-toggleable) -->
            <div class="form-toggle">
              <div>
                <label for="cfg-reqName" style="display:flex; align-items:center; gap:8px;">
                  Full Name Field (Full Name)
                  <span class="badge" style="background:#e4fbf1;color:#0e6245;font-weight:700;">Mandatory / Required</span>
                </label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Essential for customer shipping records and courier order fulfillment. Cannot be disabled.</div>
              </div>
              <label class="switch" style="opacity: 0.7; cursor: not-allowed;" title="Full Name is strictly required">
                <input type="checkbox" id="cfg-reqName" checked disabled>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Phone Number -->
            <div class="form-toggle">
              <div>
                <label for="cfg-reqPhone">Phone Number Field (Phone Number)</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Customer contact number for order confirmation and courier delivery dispatch.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-reqPhone" ${formConfig.requiredFields?.phone !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Email Address (Optional) -->
            <div class="form-toggle">
              <div>
                <label for="cfg-reqEmail">Email Address Field (Email Address)</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Optional email field for order confirmation emails and future remarketing.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-reqEmail" ${formConfig.requiredFields?.email ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Cascading Province & City Selector (Single clean toggle) -->
            <div class="form-toggle">
              <div>
                <label for="cfg-cascadingAddress">Cascading Province & City Selector (Dropdowns)</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">
                  Use cascading governorate and city dropdowns, or open manual address.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-cascadingAddress" ${formConfig.addressMode === "cascading" ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Detailed Street Address -->
            <div class="form-toggle">
              <div>
                <label for="cfg-reqAddress">Detailed Street Address (Address Details)</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">House/Building number, street, alley, and nearby landmark to assist the delivery driver.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-reqAddress" ${formConfig.requiredFields?.address !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <!-- Order Notes -->
            <div class="form-toggle">
              <div>
                <label for="cfg-reqNote">Order Notes Field (Customer Notes)</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Enables customer to add preferred delivery time or specific courier instructions.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-reqNote" ${formConfig.requiredFields?.note ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">6. Cart & Conversion Features</h3>
            
            <div class="form-toggle">
              <label for="cfg-enableDiscounts">Enable Discount & Coupon Code Field</label>
              <label class="switch">
                <input type="checkbox" id="cfg-enableDiscounts" ${formConfig.enableDiscounts !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-toggle">
              <label for="cfg-enableCartSummary">Live Cart Summary & Price Breakdown</label>
              <label class="switch">
                <input type="checkbox" id="cfg-enableCartSummary" ${formConfig.enableCartSummary !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-toggle">
              <div>
                <label for="cfg-enableAffiliateTracking" style="margin-bottom: 2px; display: block; font-weight: 600;">Capture Custom Line Properties & Affiliate Tracking</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Preserve all custom line properties (engraving, options, notes) and affiliate tracking (BixGrow, GoAffPro, UpPromote, etc.) directly on orders.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-enableAffiliateTracking" ${formConfig.enableAffiliateTracking !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE 3: SHIPPING MANAGER ==================== -->
        <section id="page-shipping" class="page-view ${initialPage === 'shipping' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Shipping Rates (${shopCurrency})</span>
              </div>
              <h2>🚚 Shipping Rates & Delivery Zones (${shopCurrency})</h2>
              <p>Configure regional delivery fees (${currencyDisplay}), country presets, and free shipping thresholds</p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
              <button type="button" class="btn btn-primary" onclick="openTemplatesModal()" style="background: linear-gradient(135deg, #008060, #006e52); font-weight: 700;">🌐 Templates & Presets</button>
              <button type="button" class="btn btn-secondary" onclick="addCustomShippingRow()">➕ Add Location</button>
              <button type="button" class="btn btn-secondary" onclick="exportRatesCsv()">⬇️ Export CSV</button>
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('import-rates-csv-file').click()">⬆️ Import CSV</button>
              <input type="file" id="import-rates-csv-file" style="display: none;" accept=".csv" onchange="importRatesCsv(event)">
            </div>
          </div>

          <div class="content-card">
            <div class="content-header">
              <h3>General Shipping Rules</h3>
            </div>

            <!-- General Shipping Settings -->
            <div class="form-row" style="margin-bottom: 20px;">
              <div class="form-group">
                <label>Default Shipping Method Title:</label>
                <input type="text" id="cfg-shippingDefaultTitle" class="form-input" value="${shippingConfig.general?.defaultTitle || 'توصيل سريع لكافة المحافظات'}">
              </div>
              <div class="form-group">
                <label>Default Shipping Rate (${currencyDisplay}):</label>
                <input type="number" id="cfg-shippingDefaultPrice" class="form-input" value="${shippingConfig.general?.defaultPrice ?? shippingConfig.general?.defaultRate ?? 0}">
              </div>
            </div>

            <div class="form-toggle" style="margin-bottom: 14px;">
              <div>
                <label for="cfg-enableFreeShipping">Enable Free Shipping Threshold</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Automatically grants free delivery when cart subtotal meets or exceeds the threshold.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-enableFreeShipping" ${(shippingConfig.general?.enableFreeShipping || shippingConfig.general?.freeShippingEnabled) ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label>Free Shipping Minimum Subtotal (${currencyDisplay}):</label>
              <input type="number" id="cfg-freeShippingThreshold" class="form-input" value="${shippingConfig.general?.freeShippingThreshold || 50000}">
            </div>

            <div class="content-header" style="margin-top: 26px;">
              <div>
                <h3>Regional Rates & Specific Locations</h3>
                <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-top: 4px;">
                  Supports Regions, Cities, and Home / Desk custom rates conforming to standard CSV/JSON format.
                </div>
              </div>
            </div>

            <!-- Rates Table -->
            <div class="table-responsive">
              <table id="shipping-rates-table">
                <thead>
                  <tr>
                    <th style="width: 10%;">Country</th>
                    <th style="width: 22%;">Region / State</th>
                    <th style="width: 18%;">City / Area</th>
                    <th style="width: 15%;">Flat Cost (${currencyDisplay})</th>
                    <th style="width: 18%;">Custom Rates (Home/Desk)</th>
                    <th style="width: 12%;">Delivery Time</th>
                    <th style="width: 5%; text-align: center;">Action</th>
                  </tr>
                </thead>
                <tbody id="shipping-rates-tbody">
                  ${shippingConfig.rates.length === 0 ? `
                    <tr id="shipping-empty-row">
                      <td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--p-color-text-subdued);">
                        <div style="font-size: 32px; margin-bottom: 8px;">🚚</div>
                        <div style="font-weight: 700; font-size: 15px; color: #202223; margin-bottom: 4px;">No regional rates configured yet</div>
                        <div style="font-size: 13px; max-width: 480px; margin: 0 auto 16px;">Click "Country Templates" to load ready presets for Morocco, Algeria, or Iraq, or add your custom locations manually.</div>
                        <button type="button" class="btn btn-primary" onclick="openTemplatesModal()">🌐 Browse Country Templates</button>
                      </td>
                    </tr>
                  ` : shippingConfig.rates.map((r, idx) => `
                    <tr data-city="${r.city || ''}" data-region="${r.region || ''}">
                      <td>
                        <input type="text" class="form-input shipping-country-input" value="${r.countryCode || 'MA'}" style="max-width: 60px; font-weight: bold; text-transform: uppercase;">
                      </td>
                      <td>
                        <input type="text" class="form-input shipping-region-input" value="${r.region || r.city || ''}" placeholder="Region / Governorate" style="width: 100%; font-weight: 600;">
                      </td>
                      <td>
                        <input type="text" class="form-input shipping-city-input" value="${r.city || ''}" placeholder="City (optional)" style="width: 100%;">
                      </td>
                      <td>
                        <input type="number" class="form-input shipping-rate-input" value="${r.cost !== undefined ? r.cost : (r.price ?? 0)}" style="max-width: 110px;">
                      </td>
                      <td>
                        <input type="text" class="form-input shipping-custom-rates-input" value="${r.customRates || ''}" placeholder="e.g. Home:25|Desk:18" style="width: 100%; font-size: 12px;">
                      </td>
                      <td>
                        <input type="text" class="form-input shipping-time-input" value="${r.time || '24-48 ساعة'}" style="max-width: 110px; font-size: 12px;">
                      </td>
                      <td style="text-align: center;">
                        <button type="button" class="btn btn-secondary" onclick="deleteShippingRow(this)" style="padding: 4px 8px; font-size: 12px; color: #d82c0d;" title="Delete this rate row">✕</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE 4: PAYMENT METHODS ==================== -->
        <section id="page-payment-methods" class="page-view ${initialPage === 'payment-methods' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Payment Methods</span>
              </div>
              <h2>💳 Payment Gateways & Options</h2>
              <p>Configure Cash on Delivery and online electronic payment methods like WAYL</p>
            </div>
            <button class="btn btn-save" onclick="saveAllSettings(this)">💾 Save Payment Settings</button>
          </div>

          <div class="content-card">
            <!-- COD -->
            <div style="padding: 18px; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); margin-bottom: 16px; background: #fafbfb;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 28px;">💵</span>
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <div style="font-size: 12px; color: var(--p-color-text-subdued);">Record order as Pending payment and dispatch order confirmation directly.</div>
                  </div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-pay-cod-enabled" ${formConfig.paymentMethods?.methods?.cod?.enabled !== false ? "checked" : ""}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-row">
                <input type="text" id="cfg-pay-cod-title" class="form-input" value="${formConfig.paymentMethods?.methods?.cod?.title || 'الدفع عند الاستلام'}" placeholder="Gateway Title">
                <input type="text" id="cfg-pay-cod-sub" class="form-input" value="${formConfig.paymentMethods?.methods?.cod?.subtitle || '💵 ادفع بكل أمان وقت استلام المنتج.'}" placeholder="Subtitle description">
              </div>
            </div>

            <!-- WAYL -->
            <div style="padding: 18px; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); margin-bottom: 16px; background: #fafbfb;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 28px;">💳</span>
                  <div>
                    <strong>Electronic Payment - WAYL</strong>
                    <div style="font-size: 12px; color: var(--p-color-text-subdued);">Secure credit card and electronic payment processing.</div>
                  </div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-pay-wayl-enabled" ${formConfig.paymentMethods?.methods?.wayl?.enabled !== false ? "checked" : ""}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-row">
                <input type="text" id="cfg-pay-wayl-title" class="form-input" value="${(formConfig.paymentMethods?.methods?.wayl?.title && !formConfig.paymentMethods.methods.wayl.title.includes('MasterCard') && !formConfig.paymentMethods.methods.wayl.title.includes('بوابة')) ? formConfig.paymentMethods.methods.wayl.title : 'دفع إلكتروني - WAYL'}" placeholder="Gateway Title">
                <input type="text" id="cfg-pay-wayl-sub" class="form-input" value="${(formConfig.paymentMethods?.methods?.wayl?.subtitle && formConfig.paymentMethods.methods.wayl.subtitle.includes('SSL')) ? formConfig.paymentMethods.methods.wayl.subtitle : 'دفع آمن — SSL & 3D Secure'}" placeholder="Subtitle description">
              </div>
            </div>

            <!-- Notice when all payment methods are disabled -->
            <div style="padding: 16px; border: 1.5px solid #fed7aa; border-radius: var(--radius-sm); margin-top: 14px; background: #fffbeb;">
              <label for="cfg-pay-no-methods-msg" style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px; color: #9a3412;">
                ⚠️ Disabled Store Notice (When all payment gateways are turned off):
              </label>
              <input type="text" id="cfg-pay-no-methods-msg" class="form-input" 
                value="${formConfig.paymentMethods?.noPaymentNotice || formConfig.noPaymentNotice || 'نعتذر، المتجر لا يستقبل طلبات جديدة حالياً. سيتم استئناف استقبال الطلبات قريباً.'}" 
                placeholder="Alert message shown to shoppers if all payment methods are disabled">
              <div style="font-size: 11px; color: #b45309; margin-top: 4px;">
                This message will display in place of checkout options when you disable all payment gateways.
              </div>
            </div>

          </div>
        </section>

        <!-- ==================== PAGE 5: FRAUD PREVENTION ==================== -->
        <section id="page-fraud-prevention" class="page-view ${initialPage === 'fraud-prevention' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Fraud Shield</span>
              </div>
              <h2>🛡️ Fraud Shield & Spam Protection</h2>
              <p>Block spam duplicate submissions, validate customer phone numbers, and enforce blacklists</p>
            </div>
            <button class="btn btn-save" onclick="saveAllSettings(this)">💾 Save Security Settings</button>
          </div>

          <div class="content-card">
            <div class="form-toggle">
              <div>
                <label for="cfg-fraud-iraqPhone">Smart Iraqi Phone Validation</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Verify that phone numbers start with (07) and contain exactly 11 digits to stop fake submissions.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-fraud-iraqPhone" ${formConfig.fraudConfig?.requireIraqiPhone !== false ? "checked" : ""}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-toggle">
              <div>
                <label for="cfg-fraud-preventDuplicates">Duplicate Order Rate Limiting (Spam Window)</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">Prevent multiple rapid clicks or repeated orders from the same customer within seconds.</div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="number" id="cfg-fraud-window" class="form-input" style="width: 100px; text-align: center;" value="${formConfig.fraudConfig?.duplicateWindowSeconds || 60}" placeholder="Seconds">
                <label class="switch">
                  <input type="checkbox" id="cfg-fraud-preventDuplicates" ${formConfig.fraudConfig?.preventDuplicates !== false ? "checked" : ""}>
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <div class="form-group" style="margin-top: 20px;">
              <label>Phone Numbers Blacklist:</label>
              <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-bottom: 6px;">Separate numbers with commas (e.g. 07701111111, 07802222222)</div>
              <textarea id="cfg-fraud-blacklist" class="form-input" rows="3" placeholder="Enter blocked customer phone numbers...">${formConfig.fraudConfig?.blacklistPhones || ''}</textarea>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE 6: SALES BOOSTER ==================== -->
        <section id="page-sales-booster" class="page-view ${initialPage === 'sales-booster' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Sales Booster</span>
              </div>
              <h2>🎁 Exit-Intent Abandonment Discount Popup</h2>
              <p>Recover abandoning shoppers: when a customer attempts to close the checkout form, display an exclusive discount offer to convert them instantly.</p>
            </div>
            <button class="btn btn-save" onclick="saveAllSettings(this)">💾 Save Booster Settings</button>
          </div>

          <div class="content-card" style="padding: 24px;">
            <!-- Main Toggle -->
            <div class="form-toggle" style="border-bottom: 1px solid var(--p-color-border-subdued); padding-bottom: 18px; margin-bottom: 20px;">
              <div>
                <span style="font-size: 15px; font-weight: 700; color: var(--p-color-text, #0f172a); display: block;">Enable Exit-Intent Discount Popup (تفعيل نافذة الخصم عند الإغلاق)</span>
                <div style="font-size: 12.5px; color: var(--p-color-text-subdued); margin-top: 2px;">
                  Triggers an interactive discount offer popup when a customer tries to close the checkout form without completing their order.
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span id="cfg-boost-exitIntent-status" style="font-size: 13px; font-weight: 700; color: ${exitIntentCfg.enabled ? '#10b981' : '#64748b'};">${exitIntentCfg.enabled ? 'ON' : 'OFF'}</span>
                <label class="switch">
                  <input type="checkbox" id="cfg-boost-exitIntent-enabled" ${exitIntentCfg.enabled ? "checked" : ""} onchange="var s = document.getElementById('cfg-boost-exitIntent-status'); if(s){ s.textContent = this.checked ? 'ON' : 'OFF'; s.style.color = this.checked ? '#10b981' : '#64748b'; }">
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <!-- Discount Code & Badge -->
            <div class="form-row">
              <div class="form-group">
                <label style="font-weight: 600;">Shopify Discount Coupon Code:</label>
                <input type="text" id="cfg-boost-exitIntent-coupon" class="form-input" style="font-family: monospace; font-weight: 700; text-transform: uppercase;" value="${exitIntentCfg.couponCode || ''}" placeholder="e.g. SPECIAL10 or SAVE10">
                <div style="font-size: 11.5px; color: var(--p-color-text-subdued); margin-top: 4px;">Standard discount code created in your Shopify Admin. Applied automatically upon customer acceptance.</div>
              </div>
              <div class="form-group">
                <label style="font-weight: 600;">Discount Badge Display Text:</label>
                <input type="text" id="cfg-boost-exitIntent-badge" class="form-input" style="font-weight: 700;" value="${exitIntentCfg.discountBadge || '10%'}" placeholder="e.g. 10% or 10% OFF or خصم 10%">
                <div style="font-size: 11.5px; color: var(--p-color-text-subdued); margin-top: 4px;">Prominent badge text displayed in the center star badge.</div>
              </div>
            </div>

            <!-- Minimum Order Value Trigger Condition -->
            <div class="form-group" style="margin-top: 14px; background: #f8fafc; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); padding: 14px 16px;">
              <label style="font-weight: 700; color: var(--p-color-text, #0f172a);">Minimum Cart / Order Total Condition (${currencyDisplay}):</label>
              <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
                <input type="number" id="cfg-boost-exitIntent-minTotal" class="form-input" style="max-width: 200px; font-weight: 700;" value="${exitIntentCfg.minOrderTotal || 0}" placeholder="0" min="0">
                <span style="font-size: 13px; font-weight: 600; color: var(--p-color-text-subdued);">${currencyDisplay}</span>
              </div>
              <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-top: 6px;">
                The popup will <strong>only appear</strong> if the customer's cart or order total is equal to or greater than this value (e.g. <code>90000</code>). Set to <code>0</code> to show for all order amounts.
              </div>
            </div>

            <!-- Modal Content Customization -->
            <h3 style="margin: 22px 0 14px; font-size: 14.5px; font-weight: 700; border-top: 1px solid var(--p-color-border-subdued); padding-top: 16px;">Popup Text & Call-To-Action Labels</h3>

            <div class="form-row">
              <div class="form-group">
                <label>Popup Title:</label>
                <input type="text" id="cfg-boost-exitIntent-title" class="form-input" value="${exitIntentCfg.title || 'Hold on!'}" placeholder="e.g. Hold on! or انتظر لحظة!">
              </div>
              <div class="form-group">
                <label>Popup Subtitle / Message:</label>
                <input type="text" id="cfg-boost-exitIntent-subtitle" class="form-input" value="${exitIntentCfg.subtitle || 'Congratulations! You have just unlocked a special discount!'}" placeholder="e.g. تهانينا! لقد حصلت على خصم فوري خاص">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Accept Discount Button Label:</label>
                <input type="text" id="cfg-boost-exitIntent-btnAccept" class="form-input" value="${exitIntentCfg.btnAccept || 'Complete order with discount'}" placeholder="e.g. Complete order with discount or أكمل الطلب مع الخصم">
              </div>
              <div class="form-group">
                <label>Reject / Dismiss Button Label:</label>
                <input type="text" id="cfg-boost-exitIntent-btnReject" class="form-input" value="${exitIntentCfg.btnReject || 'No thanks'}" placeholder="e.g. No thanks or لا، شكراً">
              </div>
            </div>

            <!-- Live Preview Card -->
            <div style="margin-top: 24px; background: #fafafa; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 24px 20px; text-align: center; max-width: 360px; margin-left: auto; margin-right: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">Visual Preview (As shown to customer)</div>
              <h4 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #0f172a;">Hold on!</h4>
              <p style="font-size: 12.5px; color: #475569; margin: 0 0 16px 0; line-height: 1.4;">Congratulations! You've just unlocked a special discount!</p>
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 88px; height: 88px; background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; font-size: 24px; font-weight: 900; border-radius: 50%; box-shadow: 0 6px 20px rgba(255, 75, 43, 0.4); margin-bottom: 18px; transform: rotate(-5deg);">
                10%
              </div>
              <div style="display: block; background: linear-gradient(90deg, #ff416c, #ff4b2b); color: #fff; font-size: 13.5px; font-weight: 700; padding: 12px 18px; border-radius: 8px; margin-bottom: 10px; cursor: pointer;">
                Complete order with 10% OFF
              </div>
              <div style="font-size: 12.5px; color: #64748b; cursor: pointer; text-decoration: underline;">No thanks</div>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE 7: SETTINGS ==================== -->
        <section id="page-settings" class="page-view ${initialPage === 'settings' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Settings</span>
              </div>
              <h2>⚙️ Store & App Settings</h2>
              <p>Configure store connection, Shopify API tokens, order tags, and system backup & restore</p>
            </div>
            <button class="btn btn-save" onclick="saveAllSettings(this)">💾 Save Settings</button>
          </div>

          <div class="content-card">
            <div class="content-header">
              <h3>1. Store Connection & Shopify Admin API</h3>
            </div>
            
            <div style="background: #e4fbf1; border: 1px solid #bbf2db; padding: 14px 18px; border-radius: var(--radius-sm); margin-bottom: 18px; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 24px;">🔒</span>
              <div>
                <strong style="color: #0e6245; font-size: 14px;">Shopify OAuth Authenticated & Encrypted</strong>
                <div style="font-size: 12px; color: #1e7054; margin-top: 2px;">
                  Your store access token is negotiated securely via Shopify OAuth 2.0.
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Connected Store Domain:</label>
                <input type="text" class="form-input" value="${shop}" readonly style="background: #f6f6f7; color: #5c5f62; cursor: not-allowed;">
              </div>
              <div class="form-group">
                <label>Active Currency:</label>
                <input type="text" class="form-input" value="${shopCurrency} (${currencyDisplay})" readonly style="background: #f6f6f7; color: #5c5f62; cursor: not-allowed;">
              </div>
            </div>

            <!-- Shopify Theme Customizer Direct Link -->
            <div style="margin-top: 14px; margin-bottom: 18px; padding: 14px 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div>
                <strong style="color: #1e293b; font-size: 13.5px;">🎨 Shopify Theme App Extension & Customizer</strong>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                  Open the official Shopify Theme Customizer to enable the Quick Order block on product pages.
                </div>
              </div>
              <a href="${themeEditorUrl}" target="_blank" class="btn btn-secondary" style="font-size: 12.5px; padding: 7px 14px; text-decoration: none;">
                🎨 Open Theme Customizer ↗
              </a>
            </div>

            <details style="margin-top: 6px; margin-bottom: 20px; border: 1px dashed var(--p-color-border); border-radius: var(--radius-sm); padding: 12px 16px; background: #fafbfb;">
              <summary style="cursor: pointer; font-size: 13px; font-weight: 700; color: var(--p-color-text-subdued);">⚙️ Advanced Developer Settings (Manual Access Token Override)</summary>
              <div style="margin-top: 14px;">
                <div class="form-group">
                  <label>Manual Admin Access Token (shpat_...):</label>
                  <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-bottom: 6px;">Only use this if you want to override the automatic OAuth connection with a custom private app token.</div>
                  <div style="display: flex; gap: 10px;">
                    <input type="password" id="settings-access-token" class="form-input" placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value="">
                    <button type="button" class="btn btn-secondary" onclick="saveAdminTokenFromSettings()">Save Token</button>
                  </div>
                </div>
              </div>
            </details>

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">2. Order Processing & Thank You Page</h3>

            <div class="form-row" style="margin-bottom: 16px;">
              <div class="form-group">
                <label>Order Tag for COD Orders:</label>
                <input type="text" id="cfg-orderTag" class="form-input" value="${formConfig.orderTag || 'Artiz-COD'}" placeholder="e.g. Artiz-COD">
                <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-top: 4px;">Automatically attached to orders created via the COD form.</div>
              </div>
            </div>

            <!-- Custom Thank You Page Toggle -->
            <div class="form-toggle" style="margin-bottom: 16px;">
              <div>
                <label for="cfg-enableCustomThankYou">Enable Custom Thank You Page / Redirect</label>
                <div style="font-size: 12px; color: var(--p-color-text-subdued);">
                  When enabled, customers are directed to your custom confirmation page or built-in thank-you view instead of Shopify's standard order confirmation.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" id="cfg-enableCustomThankYou" ${formConfig.enableCustomThankYou ? "checked" : ""} onchange="document.getElementById('thank-you-custom-box').style.display = this.checked ? 'block' : 'none'">
                <span class="slider"></span>
              </label>
            </div>

            <div id="thank-you-custom-box" style="display: ${formConfig.enableCustomThankYou ? 'block' : 'none'}; padding: 18px; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); background: #fafbfb; margin-bottom: 22px;">
              <div class="form-group">
                <label>Custom Thank You Page URL (Optional):</label>
                <input type="text" id="cfg-thankYouUrl" class="form-input" value="${formConfig.thankYouUrl || ''}" placeholder="e.g. /pages/thank-you (leave blank to use built-in confirmation)">
                <div style="font-size: 12px; color: var(--p-color-text-subdued); margin-top: 4px;">If left blank, customers stay on the built-in stylized confirmation page.</div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Confirmation Headline:</label>
                  <input type="text" id="cfg-thankYouTitle" class="form-input" value="${formConfig.thankYouTitle || '🎉 شكراً لك! تم استلام طلبك بنجاح'}" placeholder="Headline">
                </div>
                <div class="form-group">
                  <label>Confirmation Message / Instructions:</label>
                  <input type="text" id="cfg-thankYouMsg" class="form-input" value="${formConfig.thankYouMsg || 'سيتواصل معك فريق خدمة العملاء خلال 24 ساعة لتأكيد موعد التسليم.'}" placeholder="Message">
                </div>
              </div>
              <div class="form-toggle" style="margin-bottom: 12px;">
                <div>
                  <label for="cfg-thankYouWhatsappBtn">Enable WhatsApp Confirmation Button</label>
                  <div style="font-size: 12px; color: var(--p-color-text-subdued);">Displays a green WhatsApp button on confirmation so customer can chat directly with your support team.</div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-thankYouWhatsappBtn" ${formConfig.thankYouWhatsappBtn !== false ? "checked" : ""}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Support WhatsApp Phone Number (with country code):</label>
                <input type="text" id="cfg-thankYouWhatsappNumber" class="form-input" value="${formConfig.thankYouWhatsappNumber || ''}" placeholder="e.g. +212600000000 or +9647700000000">
              </div>
            </div>

            <h3 style="margin: 24px 0 14px; font-size: 16px; border-top: 1px solid var(--p-color-border); padding-top: 18px;">3. Backup & Configuration Management</h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 14px;">
              <!-- Export Card -->
              <div style="background: #fafbfb; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 36px; height: 36px; border-radius: 8px; background: #edf7ff; color: #0b5cab; display: flex; align-items: center; justify-content: center;">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    </div>
                    <strong style="font-size: 14px; color: #202223;">Export Configuration</strong>
                  </div>
                  <p style="font-size: 12.5px; color: var(--p-color-text-subdued); line-height: 1.45; margin-bottom: 16px;">
                    Download a complete JSON snapshot of all your form layouts, color styles, and shipping rules.
                  </p>
                </div>
                <button type="button" class="btn btn-secondary" onclick="exportFullConfiguration()" style="width: 100%; justify-content: center; font-weight: 700;">
                  Export Full Configuration (JSON)
                </button>
              </div>

              <!-- Import Card -->
              <div style="background: #fafbfb; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 36px; height: 36px; border-radius: 8px; background: #e4fbf1; color: #0e6245; display: flex; align-items: center; justify-content: center;">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9.293 4.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L7.707 8.707a1 1 0 01-1.414-1.414l3-3z" clip-rule="evenodd"/></svg>
                    </div>
                    <strong style="font-size: 14px; color: #202223;">Import & Restore</strong>
                  </div>
                  <p style="font-size: 12.5px; color: var(--p-color-text-subdued); line-height: 1.45; margin-bottom: 16px;">
                    Upload a previously exported configuration JSON file to restore all settings instantly.
                  </p>
                </div>
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('import-full-config-file').click()" style="width: 100%; justify-content: center; font-weight: 700;">
                  Import & Restore Configuration
                </button>
                <input type="file" id="import-full-config-file" style="display: none;" accept=".json" onchange="importFullConfiguration(event)">
              </div>

              <!-- Reset Defaults Card -->
              <div style="background: #fffdfd; border: 1px solid #ffd2cc; border-radius: var(--radius-sm); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="width: 36px; height: 36px; border-radius: 8px; background: #fff0ed; color: #d82c0d; display: flex; align-items: center; justify-content: center;">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                    </div>
                    <strong style="font-size: 14px; color: #d82c0d;">Reset to Defaults</strong>
                  </div>
                  <p style="font-size: 12.5px; color: var(--p-color-text-subdued); line-height: 1.45; margin-bottom: 16px;">
                    Reset all form options, styling themes, and field visibility rules to default factory values.
                  </p>
                </div>
                <button type="button" class="btn btn-secondary" onclick="resetFactoryDefaults()" style="width: 100%; justify-content: center; font-weight: 700; color: #d82c0d; border-color: #ffd2cc;">
                  Reset to Default Settings
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== PAGE 8: ANALYTICS & TRACKING PIXELS ==================== -->
        <section id="page-integrations" class="page-view ${initialPage === 'integrations' || initialPage === 'tracking' ? 'active' : ''}">
          <div class="page-header">
            <div class="page-header-text">
              <div class="page-breadcrumbs">
                <a onclick="navigateTo('overview')">Dashboard</a>
                <span>/</span>
                <span>Analytics & Tracking Pixels</span>
              </div>
              <h2>🎯 Analytics & Tracking Pixels</h2>
              <p>تتبع التحويلات المزدوج (المتصفح + السيرفر CAPI) لمنصات Google و Meta و TikTok و Snapchat مع إلغاء التكرار التلقائي وحماية سرعة المتجر</p>
            </div>
            <button class="btn btn-save" onclick="saveTrackingSettings(this)">💾 Save Tracking Settings</button>
          </div>

          <!-- Feature Highlight Banner -->
          <div style="background: #edf7ff; border: 1px solid #bde0fe; border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 26px;">⚡</span>
              <div>
                <strong style="color: #0b5cab; font-size: 13.5px;">⚡ Ultra-Fast Tracking with Zero Store Overhead</strong>
                <div style="font-size: 12px; color: #3b5998; margin-top: 2px;">
                  When any platform is disabled or left empty, no external scripts or trackers are loaded, preserving 100% of your store speed and performance.
                </div>
              </div>
            </div>
          </div>

          <!-- Tracking Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; margin-bottom: 30px;">
            
            <!-- 1. GOOGLE ECOSYSTEM -->
            <div class="content-card" style="margin-bottom: 0; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--p-color-border-subdued); padding-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="font-size: 26px; width: 44px; height: 44px; border-radius: 10px; background: rgba(234, 67, 53, 0.1); display: flex; align-items: center; justify-content: center;">🌐</div>
                  <div>
                    <h3 style="font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0;">منظومة Google</h3>
                    <div style="font-size: 11.5px; color: var(--p-color-text-subdued);">GTM + GA4 + Google Ads + Search Console</div>
                  </div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-track-google-enabled" ${trackingConfig.google?.enabled ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">Google Search Console Tag / Meta Content:</label>
                <input type="text" id="cfg-track-google-gscTag" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="google-site-verification=abc123xyz" value="${trackingConfig.google?.gscTag || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">Google Tag Manager (GTM ID):</label>
                <input type="text" id="cfg-track-google-gtmId" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="GTM-XXXXXXX" value="${trackingConfig.google?.gtmId || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">Google Analytics 4 (Measurement ID):</label>
                <input type="text" id="cfg-track-google-ga4Id" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="G-XXXXXXXXXX" value="${trackingConfig.google?.ga4Id || ''}">
              </div>

              <div class="form-row" style="margin-bottom: 0;">
                <div class="form-group">
                  <label style="font-size: 12px; font-weight: 600;">Google Ads Conversion ID:</label>
                  <input type="text" id="cfg-track-google-googleAdsId" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="AW-XXXXXXXXXX" value="${trackingConfig.google?.googleAdsId || ''}">
                </div>
                <div class="form-group">
                  <label style="font-size: 12px; font-weight: 600;">Purchase Conversion Label:</label>
                  <input type="text" id="cfg-track-google-googleAdsLabel" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="AbCdEfGhIjK" value="${trackingConfig.google?.googleAdsLabel || ''}">
                </div>
              </div>
            </div>

            <!-- 2. META (FACEBOOK & INSTAGRAM) -->
            <div class="content-card" style="margin-bottom: 0; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--p-color-border-subdued); padding-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="font-size: 26px; width: 44px; height: 44px; border-radius: 10px; background: rgba(24, 119, 242, 0.1); display: flex; align-items: center; justify-content: center;">🟦</div>
                  <div>
                    <h3 style="font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0;">منظومة Meta (Facebook & Instagram)</h3>
                    <div style="font-size: 11.5px; color: var(--p-color-text-subdued);">ربط مزدوج متزامن (المتصفح + CAPI السيرفر)</div>
                  </div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-track-meta-enabled" ${trackingConfig.meta?.enabled ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">Meta Pixel ID (Client-side):</label>
                <input type="text" id="cfg-track-meta-pixelId" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="مثال: 123456789012345" value="${trackingConfig.meta?.pixelId || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">Meta Conversions API (CAPI) Access Token:</label>
                <input type="password" id="cfg-track-meta-capiToken" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="EAAG... رمز وصول خادم Events Manager" value="${trackingConfig.meta?.capiToken || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 12px; font-weight: 600;">Meta Test Event Code (اختياري للاختبار):</label>
                <input type="text" id="cfg-track-meta-testCode" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="TEST12345" value="${trackingConfig.meta?.testEventCode || ''}">
              </div>
            </div>

            <!-- 3. TIKTOK -->
            <div class="content-card" style="margin-bottom: 0; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--p-color-border-subdued); padding-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="font-size: 26px; width: 44px; height: 44px; border-radius: 10px; background: rgba(0, 0, 0, 0.08); display: flex; align-items: center; justify-content: center;">🎵</div>
                  <div>
                    <h3 style="font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0;">منظومة TikTok</h3>
                    <div style="font-size: 11.5px; color: var(--p-color-text-subdued);">تتبع مزدوج (Pixel + Events API من السيرفر)</div>
                  </div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-track-tiktok-enabled" ${trackingConfig.tiktok?.enabled ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">TikTok Pixel ID (Client-side):</label>
                <input type="text" id="cfg-track-tiktok-pixelId" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="C1234567890ABCDEF" value="${trackingConfig.tiktok?.pixelId || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">TikTok Events API Access Token:</label>
                <input type="password" id="cfg-track-tiktok-eventsApiToken" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="رمز الوصول المستخرج من TikTok Ads Manager" value="${trackingConfig.tiktok?.eventsApiToken || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 12px; font-weight: 600;">TikTok Test Event Code (اختياري للاختبار):</label>
                <input type="text" id="cfg-track-tiktok-testCode" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="TEST_XXXXX" value="${trackingConfig.tiktok?.testEventCode || ''}">
              </div>
            </div>

            <!-- 4. SNAPCHAT -->
            <div class="content-card" style="margin-bottom: 0; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--p-color-border-subdued); padding-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="font-size: 26px; width: 44px; height: 44px; border-radius: 10px; background: rgba(255, 252, 0, 0.25); display: flex; align-items: center; justify-content: center;">👻</div>
                  <div>
                    <h3 style="font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0;">منظومة Snapchat</h3>
                    <div style="font-size: 11.5px; color: var(--p-color-text-subdued);">تتبع بيكسل سناب شات + تحويلات CAPI</div>
                  </div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="cfg-track-snapchat-enabled" ${trackingConfig.snapchat?.enabled ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-size: 12px; font-weight: 600;">Snapchat Pixel ID:</label>
                <input type="text" id="cfg-track-snapchat-pixelId" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value="${trackingConfig.snapchat?.pixelId || ''}">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 12px; font-weight: 600;">Snapchat Conversions API Token (اختياري):</label>
                <input type="password" id="cfg-track-snapchat-capiToken" class="form-input" style="font-size: 12.5px; font-family: monospace;" placeholder="رمز CAPI المستخرج من Snapchat Ads Manager" value="${trackingConfig.snapchat?.capiToken || ''}">
              </div>
            </div>

          </div>

          <!-- Section 2: Other Integrations -->
          <div style="margin-top: 24px; margin-bottom: 16px; padding: 12px 16px; background: #f8fafc; border: 1px solid var(--p-color-border); border-radius: var(--radius-sm);">
            <h3 style="font-size: 16px; font-weight: 800; color: var(--p-color-text, #0f172a); display: flex; align-items: center; gap: 8px; margin: 0 0 4px 0;">
              <span>🚀 Additional Tools & Integrations</span>
            </h3>
            <p style="font-size: 12.5px; color: var(--p-color-text-subdued, #64748b); margin: 0;">Cloud spreadsheet sync, local courier fulfillment, and automated notifications</p>
          </div>

          <div class="integrations-grid">
            <!-- 1. Google Sheets -->
            <div class="integration-card">
              <div>
                <div class="integration-top">
                  <div class="integration-icon">📊</div>
                  <div>
                    <div class="integration-title">
                      <span>Google Sheets Live Sync</span>
                      <span class="preset-badge" style="background: #e4fbf1; color: #0e6245;">Available</span>
                    </div>
                    <div style="font-size: 11px; color: var(--p-color-text-subdued); margin-top: 2px;">Real-time spreadsheet backup</div>
                  </div>
                </div>
                <div class="integration-desc">
                  Automatically streams every incoming COD order to your designated Google Sheet instantly.
                </div>
              </div>
              <div class="integration-actions">
                <button type="button" class="btn btn-primary" onclick="alert('Google Sheets integration setup guide will be available soon!')" style="font-size: 13px;">Configure Sheet</button>
              </div>
            </div>

            <!-- 2. WhatsApp Business -->
            <div class="integration-card">
              <div>
                <div class="integration-top">
                  <div class="integration-icon" style="background: #e8f8f0; color: #25d366;">💬</div>
                  <div>
                    <div class="integration-title">
                      <span>WhatsApp Order Automation</span>
                      <span class="preset-badge" style="background: #e4fbf1; color: #0e6245;">High Conversion</span>
                    </div>
                    <div style="font-size: 11px; color: var(--p-color-text-subdued); margin-top: 2px;">Automated address verification</div>
                  </div>
                </div>
                <div class="integration-desc">
                  Send instant automated WhatsApp messages with order confirmation buttons.
                </div>
              </div>
              <div class="integration-actions">
                <button type="button" class="btn btn-primary" onclick="navigateTo('settings'); showToast('Configure WhatsApp support number in Settings tab!');" style="font-size: 13px;">Setup WhatsApp</button>
              </div>
            </div>

            <!-- 3. Webhooks & Automation -->
            <div class="integration-card">
              <div>
                <div class="integration-top">
                  <div class="integration-icon" style="background: #fff8e5; color: #8c5b00;">⚡</div>
                  <div>
                    <div class="integration-title">
                      <span>Webhooks & Zapier / Make</span>
                      <span class="preset-badge" style="background: #fff8e5; color: #8c5b00;">Universal</span>
                    </div>
                    <div style="font-size: 11px; color: var(--p-color-text-subdued); margin-top: 2px;">Instant JSON event triggers</div>
                  </div>
                </div>
                <div class="integration-desc">
                  Send real-time JSON webhooks whenever an order is submitted or approved.
                </div>
              </div>
              <div class="integration-actions">
                <button type="button" class="btn btn-primary" onclick="alert('Webhooks dispatcher is active. Custom endpoint configurations will open here.')" style="font-size: 13px;">Manage Webhooks</button>
              </div>
            </div>

            <!-- 4. Shipping Carriers -->
            <div class="integration-card">
              <div>
                <div class="integration-top">
                  <div class="integration-icon" style="background: #f6f6f7; color: #202223;">🚚</div>
                  <div>
                    <div class="integration-title">
                      <span>Domestic Courier Logistics</span>
                      <span class="preset-badge" style="background: #edf7ff; color: #0b5cab;">Logistics API</span>
                    </div>
                    <div style="font-size: 11px; color: var(--p-color-text-subdued); margin-top: 2px;">Direct courier dispatch</div>
                  </div>
                </div>
                <div class="integration-desc">
                  Seamlessly push confirmed orders to domestic delivery networks in Iraq, Morocco, and Algeria.
                </div>
              </div>
              <div class="integration-actions">
                <button type="button" class="btn btn-secondary" onclick="navigateTo('shipping')" style="font-size: 13px;">Manage Rates ↗</button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>

  <div id="toast" class="toast">Settings updated successfully! ✅</div>

  <!-- Country Templates & Presets Modal -->
  <div id="shipping-templates-modal" class="modal-backdrop" onclick="if(event.target === this) closeTemplatesModal()">
    <div class="modal-window">
      <div class="modal-header">
        <h3>🌐 Country Templates & Presets</h3>
        <button type="button" class="modal-close-btn" onclick="closeTemplatesModal()" title="Close">✕</button>
      </div>

      <div class="modal-body">
        <div style="font-size: 13px; color: var(--p-color-text-subdued); margin-bottom: 16px;">
          Choose a pre-built regional shipping model to automatically populate your delivery rules. You can adjust prices and customize locations at any time.
        </div>

        <!-- Country Selection Tabs -->
        <div class="country-tab-bar">
          <button type="button" class="country-tab-btn active" id="tab-btn-MA" onclick="switchCountryTab('MA')">
            <span>🇲🇦 Morocco (MA)</span>
          </button>
          <button type="button" class="country-tab-btn" id="tab-btn-DZ" onclick="switchCountryTab('DZ')">
            <span>🇩🇿 Algeria (DZ)</span>
          </button>
          <button type="button" class="country-tab-btn" id="tab-btn-IQ" onclick="switchCountryTab('IQ')">
            <span>🇮🇶 Iraq (IQ)</span>
          </button>
        </div>

        <!-- TAB CONTENT: MOROCCO (MA) -->
        <div id="tab-content-MA" class="country-tab-pane">
          <!-- Model 1: 12 Regions Flat -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">1. جهات المغرب الـ 12 (سعر موحد لكل جهة)</div>
                <div class="preset-desc">تغطية شاملة للجهات الـ 12 في المغرب مع تسعير جهوي موحد</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('ma-regions-flat')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
MA,Casablanca-Settat,,,,15,
MA,Rabat-Salé-Kénitra,,,,20,
MA,Marrakech-Safi,,,,25,
MA,Tanger-Tétouan-Al Hoceïma,,,,25,
MA,Fès-Meknès,,,,25,
MA,Souss-Massa,,,,30,
MA,Béni Mellal-Khénifra,,,,30,
MA,L'Oriental,,,,35,
MA,Drâa-Tafilalet,,,,40,
MA,Guelmim-Oued Noun,,,,45,
MA,Laâyoune-Sakia El Hamra,,,,50,
MA,Dakhla-Oued Ed-Dahab,,,,55,</div>
          </div>

          <!-- Model 2: Casablanca-Settat + Cities -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">2. جهة الدار البيضاء - سطات مع مدنها التفصيلية</div>
                <div class="preset-desc">سعر موحد على مستوى الجهة العامة، مع تفصيل الأسعار الخاصة بمدن هذه الجهة (الدار البيضاء، المحمدية، النواصر، برشيد، سطات، الجديدة...)</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('ma-casablanca-cities')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
MA,Casablanca-Settat,,,,20,
MA,Casablanca-Settat,Casablanca,,,15,
MA,Casablanca-Settat,Mohammedia,,,20,
MA,Casablanca-Settat,Nouaceur,,,20,
MA,Casablanca-Settat,Médiouna,,,20,
MA,Casablanca-Settat,Berrechid,,,25,
MA,Casablanca-Settat,Settat,,,25,
MA,Casablanca-Settat,El Jadida,,,30,
MA,Casablanca-Settat,Benslimane,,,30,
MA,Casablanca-Settat,Sidi Bennour,,,35,</div>
          </div>

          <!-- Model 3: Regions with Home & Desk -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">3. جهات المغرب - خيارا التوصيل للمنزل وللمكتب (Home / Desk)</div>
                <div class="preset-desc">اعتماد حقل Custom_rates لتقديم خيارين لكل جهة (Home للمنزل و Desk لنقطة الاستلام)</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('ma-regions-custom-rates')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
MA,Casablanca-Settat,,,rate,,Home:20|Desk:15
MA,Rabat-Salé-Kénitra,,,rate,,Home:25|Desk:20
MA,Marrakech-Safi,,,rate,,Home:30|Desk:25
MA,Tanger-Tétouan-Al Hoceïma,,,rate,,Home:30|Desk:25
MA,Fès-Meknès,,,rate,,Home:30|Desk:25
MA,Souss-Massa,,,rate,,Home:35|Desk:30
MA,L'Oriental,,,rate,,Home:40|Desk:35
MA,Laâyoune-Sakia El Hamra,,,rate,,Home:50|Desk:45</div>
          </div>

          <!-- Model 4: Region + Cities + Home & Desk -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">4. جهة الدار البيضاء ومدنها - توصيل للمنزل وللمكتب</div>
                <div class="preset-desc">سعران افتراضيان للجهة ككل، ثم سعران مخصصان لكل مدينة تابعة لها (توصيل منزل / مكتب)</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('ma-casablanca-cities-custom')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
MA,Casablanca-Settat,,,rate,,Home:25|Desk:18
MA,Casablanca-Settat,Casablanca,,rate,,Home:18|Desk:12
MA,Casablanca-Settat,Mohammedia,,rate,,Home:20|Desk:15
MA,Casablanca-Settat,Nouaceur,,rate,,Home:22|Desk:16
MA,Casablanca-Settat,Berrechid,,rate,,Home:25|Desk:20
MA,Casablanca-Settat,Settat,,rate,,Home:28|Desk:22
MA,Casablanca-Settat,El Jadida,,rate,,Home:30|Desk:25
MA,Casablanca-Settat,Sidi Bennour,,rate,,Home:35|Desk:30</div>
          </div>
        </div>

        <!-- TAB CONTENT: ALGERIA (DZ) -->
        <div id="tab-content-DZ" class="country-tab-pane" style="display: none;">
          <!-- Model 1: General Wilayas -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">1. ولايات الجزائر العامة (سعر موحد لكل ولاية)</div>
                <div class="preset-desc">استهداف الولايات العامة بدون تحديد البلديات (الجزائر، البليدة، وهران، قسنطينة، سطيف...)</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('dz-wilayas-flat')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
DZ,Alger,,,,400,
DZ,Blida,,,,500,
DZ,Oran,,,,600,
DZ,Constantine,,,,600,
DZ,Sétif,,,,600,
DZ,Annaba,,,,650,
DZ,Tlemcen,,,,700,
DZ,Ouargla,,,,900,
DZ,Béchar,,,,1000,
DZ,Tamanrasset,,,,1400,</div>
          </div>

          <!-- Model 2: Wilayas with Home & Desk -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">2. ولايات الجزائر - خيارا التوصيل للمنزل وللمكتب (Home / Desk)</div>
                <div class="preset-desc">خيارات التوصيل للمنزل ومكتب التوصيل (Stop Desk) لشركات الشحن الجزائرية مثل ياليدي</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('dz-wilayas-custom-rates')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
DZ,Alger,,,rate,,Home:500|Desk:300
DZ,Blida,,,rate,,Home:600|Desk:350
DZ,Oran,,,rate,,Home:700|Desk:400
DZ,Constantine,,,rate,,Home:700|Desk:400
DZ,Sétif,,,rate,,Home:700|Desk:400
DZ,Annaba,,,rate,,Home:750|Desk:450
DZ,Ouargla,,,rate,,Home:950|Desk:600
DZ,Tamanrasset,,,rate,,Home:1400|Desk:900</div>
          </div>
        </div>

        <!-- TAB CONTENT: IRAQ (IQ) -->
        <div id="tab-content-IQ" class="country-tab-pane" style="display: none;">
          <!-- Model 1: Major Governorates -->
          <div class="preset-card">
            <div class="preset-card-header">
              <div>
                <div class="preset-title">1. محافظات العراق العامة (10 محافظات رئيسية)</div>
                <div class="preset-desc">أسعار التوصيل لكبرى المحافظات العراقية (بغداد، البصرة، أربيل، النجف، كربلاء...)</div>
              </div>
              <button type="button" class="btn btn-primary" onclick="applyShippingTemplate('iq-governorates-flat')">🚀 Apply Template</button>
            </div>
            <div class="preset-preview">
Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
IQ,Baghdad,,,,5000,
IQ,Basra,,,,6000,
IQ,Erbil,,,,6000,
IQ,Najaf,,,,6000,
IQ,Karbala,,,,6000,
IQ,Sulaymaniyah,,,,7000,
IQ,Nineveh,,,,7000,
IQ,Anbar,,,,7000,
IQ,Kirkuk,,,,6500,
IQ,Duhok,,,,8000,</div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div style="font-size: 12px; color: var(--p-color-text-subdued);">
          Format: <code>Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates</code>
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="exportRatesCsv()">⬇️ Export Current CSV</button>
          <button type="button" class="btn btn-secondary" onclick="closeTemplatesModal()">Close</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // navigateTo() is defined once in <head> (single source of navigation logic).

    // Handle Browser Back & Forward buttons and Shopify menu clicks
    window.addEventListener('popstate', function() {
      var pName = window.location.pathname || '';
      var path = pName.charAt(0) === '/' ? pName.slice(1) : pName;
      var pageId = path || 'overview';
      navigateTo(pageId, null, true);
    });

    // Sync title bar with the server-rendered initial page
    navigateTo('${initialPage}', null, true);

    function selectMode(modeId, el) {
      document.querySelectorAll('.mode-card').forEach(function(c) { c.classList.remove('active'); });
      if (el) {
        el.classList.add('active');
      } else {
        var card = document.querySelector('.mode-card[data-mode="' + modeId + '"]');
        if (card) card.classList.add('active');
      }
      var input = document.getElementById('cfg-displayMode');
      if (input) {
        input.value = modeId;
      }
      showSaveBar();
    }

    // ==================== DIRTY STATE & SAVE BAR SYSTEM ====================
    var hasUnsavedChanges = false;

    function showToast(msg, isError) {
      // 1. Native Shopify App Bridge Toast
      try {
        if (window.shopify && typeof window.shopify.toast?.show === 'function') {
          window.shopify.toast.show(msg, { duration: 3500, isError: Boolean(isError) });
        }
      } catch (err) {
        console.warn('App Bridge toast failed:', err);
      }

      // 2. In-App Polaris Floating Toast (Always visible regardless of iframe)
      var toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = msg;
        if (isError) {
          toast.classList.add('toast-error');
        } else {
          toast.classList.remove('toast-error');
        }
        toast.classList.add('toast-visible');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function() {
          toast.classList.remove('toast-visible');
        }, 3500);
      }
    }

    function showSaveBar() {
      hasUnsavedChanges = true;

      // 1. Shopify App Bridge native Save Bar (<ui-save-bar>)
      try {
        var sb = document.getElementById('shopify-save-bar');
        if (sb && typeof sb.show === 'function') {
          sb.show();
        } else if (window.shopify && window.shopify.saveBar && typeof window.shopify.saveBar.show === 'function') {
          window.shopify.saveBar.show('shopify-save-bar');
        }
      } catch (_) {}

      // 2. In-App Fallback Contextual Save Bar
      var inApp = document.getElementById('inapp-save-bar');
      if (inApp) inApp.classList.add('visible');
    }

    function hideSaveBar() {
      hasUnsavedChanges = false;

      // 1. Shopify App Bridge native Save Bar
      try {
        var sb = document.getElementById('shopify-save-bar');
        if (sb && typeof sb.hide === 'function') {
          sb.hide();
        } else if (window.shopify && window.shopify.saveBar && typeof window.shopify.saveBar.hide === 'function') {
          window.shopify.saveBar.hide('shopify-save-bar');
        }
      } catch (_) {}

      // 2. In-App Fallback Contextual Save Bar
      var inApp = document.getElementById('inapp-save-bar');
      if (inApp) inApp.classList.remove('visible');
    }

    function discardChanges() {
      hasUnsavedChanges = false;
      hideSaveBar();
      window.location.reload();
    }

    // Warn merchant when attempting to leave with unsaved changes
    window.addEventListener('beforeunload', function(e) {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    });

    function getTrackingPayload() {
      return {
        google: {
          enabled: document.getElementById('cfg-track-google-enabled') ? document.getElementById('cfg-track-google-enabled').checked : false,
          gscTag: document.getElementById('cfg-track-google-gscTag') ? document.getElementById('cfg-track-google-gscTag').value.trim() : '',
          gtmId: document.getElementById('cfg-track-google-gtmId') ? document.getElementById('cfg-track-google-gtmId').value.trim() : '',
          ga4Id: document.getElementById('cfg-track-google-ga4Id') ? document.getElementById('cfg-track-google-ga4Id').value.trim() : '',
          googleAdsId: document.getElementById('cfg-track-google-googleAdsId') ? document.getElementById('cfg-track-google-googleAdsId').value.trim() : '',
          googleAdsLabel: document.getElementById('cfg-track-google-googleAdsLabel') ? document.getElementById('cfg-track-google-googleAdsLabel').value.trim() : ''
        },
        meta: {
          enabled: document.getElementById('cfg-track-meta-enabled') ? document.getElementById('cfg-track-meta-enabled').checked : false,
          pixelId: document.getElementById('cfg-track-meta-pixelId') ? document.getElementById('cfg-track-meta-pixelId').value.trim() : '',
          capiToken: document.getElementById('cfg-track-meta-capiToken') ? document.getElementById('cfg-track-meta-capiToken').value.trim() : '',
          testEventCode: document.getElementById('cfg-track-meta-testCode') ? document.getElementById('cfg-track-meta-testCode').value.trim() : ''
        },
        tiktok: {
          enabled: document.getElementById('cfg-track-tiktok-enabled') ? document.getElementById('cfg-track-tiktok-enabled').checked : false,
          pixelId: document.getElementById('cfg-track-tiktok-pixelId') ? document.getElementById('cfg-track-tiktok-pixelId').value.trim() : '',
          eventsApiToken: document.getElementById('cfg-track-tiktok-eventsApiToken') ? document.getElementById('cfg-track-tiktok-eventsApiToken').value.trim() : '',
          testEventCode: document.getElementById('cfg-track-tiktok-testCode') ? document.getElementById('cfg-track-tiktok-testCode').value.trim() : ''
        },
        snapchat: {
          enabled: document.getElementById('cfg-track-snapchat-enabled') ? document.getElementById('cfg-track-snapchat-enabled').checked : false,
          pixelId: document.getElementById('cfg-track-snapchat-pixelId') ? document.getElementById('cfg-track-snapchat-pixelId').value.trim() : '',
          capiToken: document.getElementById('cfg-track-snapchat-capiToken') ? document.getElementById('cfg-track-snapchat-capiToken').value.trim() : ''
        }
      };
    }

    async function saveTrackingSettings(clickedBtn) {
      var origLabel = clickedBtn ? clickedBtn.innerHTML : '';
      if (clickedBtn) {
        clickedBtn.innerHTML = '⏳ Saving...';
        clickedBtn.disabled = true;
      }
      var payload = getTrackingPayload();
      try {
        var res = await fetch('/settings/tracking/save?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shop: '${shop}', tracking: payload })
        });
        var data = await res.json().catch(function() { return { ok: true }; });
        if (data && data.ok) {
          showToast('Tracking and Pixel settings saved successfully! ✅');
        } else {
          showToast('Error: ' + (data?.error || 'Failed to save tracking settings'), true);
        }
      } catch (err) {
        showToast('Connection error: ' + err.message, true);
      } finally {
        if (clickedBtn) {
          clickedBtn.innerHTML = '✅ Saved!';
          setTimeout(function() {
            clickedBtn.innerHTML = origLabel || '💾 Save Tracking Settings';
            clickedBtn.disabled = false;
          }, 1500);
        }
      }
    }

    async function saveAllSettings(clickedBtn) {
      var allSaveBtns = document.querySelectorAll('.btn-save, .btn-primary-save');
      var origLabels = [];
      allSaveBtns.forEach(function(b, idx) {
        origLabels[idx] = b.innerHTML;
        b.innerHTML = '⏳ Saving...';
        b.disabled = true;
        b.style.opacity = '0.7';
      });

      var isCascading = document.getElementById('cfg-cascadingAddress') ? document.getElementById('cfg-cascadingAddress').checked : false;
      var orderTag = document.getElementById('cfg-orderTag') ? document.getElementById('cfg-orderTag').value.trim() : 'Artiz-COD';
      var thankYouUrl = document.getElementById('cfg-thankYouUrl') ? document.getElementById('cfg-thankYouUrl').value.trim() : '';

      // 1. Form Configuration
      var formSettings = {
        addressMode: isCascading ? 'cascading' : 'standard',
        orderTag: orderTag,
        enableCustomThankYou: document.getElementById('cfg-enableCustomThankYou') ? document.getElementById('cfg-enableCustomThankYou').checked : false,
        thankYouUrl: thankYouUrl,
        thankYouTitle: document.getElementById('cfg-thankYouTitle') ? document.getElementById('cfg-thankYouTitle').value.trim() : '',
        thankYouMsg: document.getElementById('cfg-thankYouMsg') ? document.getElementById('cfg-thankYouMsg').value.trim() : '',
        thankYouWhatsappBtn: document.getElementById('cfg-thankYouWhatsappBtn') ? document.getElementById('cfg-thankYouWhatsappBtn').checked : true,
        thankYouWhatsappNumber: document.getElementById('cfg-thankYouWhatsappNumber') ? document.getElementById('cfg-thankYouWhatsappNumber').value.trim() : '',
        displayMode: document.getElementById('cfg-displayMode').value,
        formTitle: document.getElementById('cfg-formTitle').value,
        buttonText: document.getElementById('cfg-buttonText').value,
        submitButtonText: document.getElementById('cfg-submitButtonText').value,
        buttonSubtext: document.getElementById('cfg-buttonSubtext').value,
        primaryColor: document.getElementById('cfg-primaryColor') ? document.getElementById('cfg-primaryColor').value : '#020a25',
        primaryHoverColor: document.getElementById('cfg-primaryHoverColor') ? document.getElementById('cfg-primaryHoverColor').value : '#0a1845',
        buttonTextColor: document.getElementById('cfg-buttonTextColor') ? document.getElementById('cfg-buttonTextColor').value : '#ffffff',
        secondaryColor: document.getElementById('cfg-secondaryColor') ? document.getElementById('cfg-secondaryColor').value : '#ffffff',
        secondaryHoverColor: document.getElementById('cfg-secondaryHoverColor') ? document.getElementById('cfg-secondaryHoverColor').value : '#f8fafc',
        secondaryTextColor: document.getElementById('cfg-secondaryTextColor') ? document.getElementById('cfg-secondaryTextColor').value : '#1e293b',
        secondaryBorderColor: document.getElementById('cfg-secondaryBorderColor') ? document.getElementById('cfg-secondaryBorderColor').value : '#cbd5e1',
        discountBadgePrefix: document.getElementById('cfg-discountBadgePrefix') ? document.getElementById('cfg-discountBadgePrefix').value.trim() : 'خصم',
        addToCartButtonText: document.getElementById('cfg-addToCartButtonText') ? document.getElementById('cfg-addToCartButtonText').value.trim() : 'أضف إلى السلة',
        enableDiscounts: document.getElementById('cfg-enableDiscounts').checked,
        enableAffiliateTracking: document.getElementById('cfg-enableAffiliateTracking') ? document.getElementById('cfg-enableAffiliateTracking').checked : true,
        enableCartSummary: document.getElementById('cfg-enableCartSummary').checked,
        directBuyTrigger: document.getElementById('cfg-directBuyTrigger').checked,
        cartDrawerTrigger: document.getElementById('cfg-cartDrawerTrigger').checked,
        buttonMode: (document.getElementById('cfg-buttonMode-hijack') && document.getElementById('cfg-buttonMode-hijack').checked) ? 'hijack' : 'replace',
        showAddToCartButton: document.getElementById('cfg-showAddToCartButton') ? document.getElementById('cfg-showAddToCartButton').checked : true,
        requiredFields: {
          name: true, // Always mandatory
          phone: document.getElementById('cfg-reqPhone').checked,
          email: document.getElementById('cfg-reqEmail') ? document.getElementById('cfg-reqEmail').checked : false,
          city: isCascading,
          address: document.getElementById('cfg-reqAddress').checked,
          note: document.getElementById('cfg-reqNote').checked
        },
        paymentMethods: {
          enabledMethods: [
            document.getElementById('cfg-pay-cod-enabled').checked ? 'cod' : null,
            document.getElementById('cfg-pay-wayl-enabled').checked ? 'wayl' : null
          ].filter(Boolean),
          defaultMethod: document.getElementById('cfg-pay-cod-enabled').checked ? 'cod' : (document.getElementById('cfg-pay-wayl-enabled').checked ? 'wayl' : ''),
          noPaymentNotice: document.getElementById('cfg-pay-no-methods-msg') ? document.getElementById('cfg-pay-no-methods-msg').value.trim() : 'نعتذر، المتجر لا يستقبل طلبات جديدة حالياً. سيتم استئناف استقبال الطلبات قريباً.',
          methods: {
            cod: {
              enabled: document.getElementById('cfg-pay-cod-enabled').checked,
              title: document.getElementById('cfg-pay-cod-title').value,
              subtitle: document.getElementById('cfg-pay-cod-sub').value
            },
            wayl: {
              enabled: document.getElementById('cfg-pay-wayl-enabled').checked,
              title: document.getElementById('cfg-pay-wayl-title').value,
              subtitle: document.getElementById('cfg-pay-wayl-sub').value,
              customDomain: '${waylDomain}'
            }
          }
        },
        fraudConfig: {
          requireIraqiPhone: document.getElementById('cfg-fraud-iraqPhone').checked,
          preventDuplicates: document.getElementById('cfg-fraud-preventDuplicates').checked,
          duplicateWindowSeconds: Number(document.getElementById('cfg-fraud-window').value) || 60,
          blacklistPhones: document.getElementById('cfg-fraud-blacklist').value
        },
        boosterConfig: {
          exitIntent: {
            enabled: document.getElementById('cfg-boost-exitIntent-enabled') ? document.getElementById('cfg-boost-exitIntent-enabled').checked : false,
            couponCode: document.getElementById('cfg-boost-exitIntent-coupon') ? document.getElementById('cfg-boost-exitIntent-coupon').value.trim() : '',
            discountBadge: document.getElementById('cfg-boost-exitIntent-badge') ? document.getElementById('cfg-boost-exitIntent-badge').value.trim() : '10%',
            minOrderTotal: Number(document.getElementById('cfg-boost-exitIntent-minTotal') ? document.getElementById('cfg-boost-exitIntent-minTotal').value : 0) || 0,
            title: document.getElementById('cfg-boost-exitIntent-title') ? document.getElementById('cfg-boost-exitIntent-title').value.trim() : 'لأنك غالي علينا',
            subtitle: document.getElementById('cfg-boost-exitIntent-subtitle') ? document.getElementById('cfg-boost-exitIntent-subtitle').value.trim() : 'تهانينا! لقد حصلت للتو على خصم خاص لطلبك!',
            btnAccept: document.getElementById('cfg-boost-exitIntent-btnAccept') ? document.getElementById('cfg-boost-exitIntent-btnAccept').value.trim() : 'قبول العرض والحصول على الخصم',
            btnReject: document.getElementById('cfg-boost-exitIntent-btnReject') ? document.getElementById('cfg-boost-exitIntent-btnReject').value.trim() : 'لا، شكراً'
          }
        }
      };

      // 2. Shipping Configuration
      var rows = document.querySelectorAll('#shipping-rates-tbody tr:not(#shipping-empty-row)');
      var rates = [];
      rows.forEach(function(row) {
        var countryInput = row.querySelector('.shipping-country-input');
        var regionInput = row.querySelector('.shipping-region-input');
        var cityInput = row.querySelector('.shipping-city-input');
        var rateInput = row.querySelector('.shipping-rate-input');
        var customRatesInput = row.querySelector('.shipping-custom-rates-input');
        var timeInput = row.querySelector('.shipping-time-input');

        var countryCode = countryInput ? countryInput.value.trim().toUpperCase() : 'MA';
        var regionName = regionInput ? regionInput.value.trim() : '';
        var cityName = cityInput ? cityInput.value.trim() : '';
        var customRates = customRatesInput ? customRatesInput.value.trim() : '';
        var timeVal = timeInput ? timeInput.value.trim() : '24-48 ساعة';

        if (regionName || cityName || customRates || (rateInput && rateInput.value !== '')) {
          var p = rateInput && rateInput.value !== '' ? Number(rateInput.value) : 0;
          rates.push({
            countryCode: countryCode || 'MA',
            region: regionName,
            city: cityName,
            area: '',
            rateType: customRates ? 'rate' : 'flat',
            cost: p,
            price: p,
            customRates: customRates,
            time: timeVal
          });
        }
      });

      var rawDef = document.getElementById('cfg-shippingDefaultPrice') ? document.getElementById('cfg-shippingDefaultPrice').value : '';
      var defPrice = rawDef !== '' && !isNaN(Number(rawDef)) ? Number(rawDef) : 0;
      var freeActive = document.getElementById('cfg-enableFreeShipping').checked;
      var freeThresh = Number(document.getElementById('cfg-freeShippingThreshold').value) || 0;
      var defTitle = document.getElementById('cfg-shippingDefaultTitle').value || 'توصيل سريع لكافة المحافظات';

      var shippingSettings = {
        shopCurrency: '${shopCurrency}',
        general: {
          enabled: true,
          defaultTitle: defTitle,
          defaultPrice: defPrice,
          defaultRate: defPrice,
          enableFreeShipping: freeActive,
          freeShippingEnabled: freeActive,
          freeShippingThreshold: freeThresh,
          freeShippingText: "مجاناً (توصيل مجاني)",
          defaultMethods: [
            { id: "standard", title: defTitle, price: defPrice }
          ]
        },
        rates: rates
      };

      var trackingPayload = getTrackingPayload();

      try {
        var [res1, res2, res3] = await Promise.all([
          fetch('/settings/save?shop=' + encodeURIComponent('${shop}'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shop: '${shop}', settings: { formConfig: formSettings } })
          }),
          fetch('/shipping/save?shop=' + encodeURIComponent('${shop}'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shop: '${shop}', config: shippingSettings })
          }),
          fetch('/settings/tracking/save?shop=' + encodeURIComponent('${shop}'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shop: '${shop}', tracking: trackingPayload })
          })
        ]);

        var data1 = await res1.json().catch(function() { return { ok: true }; });
        var data2 = await res2.json().catch(function() { return { ok: true }; });
        var data3 = await res3.json().catch(function() { return { ok: true }; });

        if ((data1 && data1.ok === false) || (data2 && data2.ok === false) || (data3 && data3.ok === false)) {
          throw new Error((data1 && data1.error) || (data2 && data2.error) || (data3 && data3.error) || 'Failed to save settings');
        }

        hideSaveBar();
        showToast('Settings saved successfully and published to store! ✅');

        allSaveBtns.forEach(function(b, idx) {
          b.innerHTML = '✅ Saved!';
          setTimeout(function() {
            b.innerHTML = origLabels[idx] || '💾 Save Settings';
            b.disabled = false;
            b.style.opacity = '1';
          }, 1800);
        });
      } catch (e) {
        showToast('Failed to save settings: ' + (e.message || 'Unknown error'), true);
        allSaveBtns.forEach(function(b, idx) {
          b.innerHTML = origLabels[idx] || '💾 Save Settings';
          b.disabled = false;
          b.style.opacity = '1';
        });
      }
    }

    // Modal Control Functions
    function openTemplatesModal() {
      var modal = document.getElementById('shipping-templates-modal');
      if (modal) modal.classList.add('active');
    }

    function closeTemplatesModal() {
      var modal = document.getElementById('shipping-templates-modal');
      if (modal) modal.classList.remove('active');
    }

    function switchCountryTab(code) {
      document.querySelectorAll('.country-tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.country-tab-pane').forEach(function(pane) {
        pane.style.display = 'none';
      });

      var targetBtn = document.getElementById('tab-btn-' + code);
      if (targetBtn) targetBtn.classList.add('active');

      var targetPane = document.getElementById('tab-content-' + code);
      if (targetPane) targetPane.style.display = 'block';
    }

    // Templates Datasets conforming to Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
    var TEMPLATES_LIBRARY = {
      'ma-regions-flat': {
        title: 'توصيل سريع لجميع جهات المغرب',
        defaultPrice: 25,
        rates: [
          { countryCode: 'MA', region: 'Casablanca-Settat', city: '', cost: 15, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Rabat-Salé-Kénitra', city: '', cost: 20, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Marrakech-Safi', city: '', cost: 25, customRates: '', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Tanger-Tétouan-Al Hoceïma', city: '', cost: 25, customRates: '', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Fès-Meknès', city: '', cost: 25, customRates: '', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Souss-Massa', city: '', cost: 30, customRates: '', time: '48-72 ساعة' },
          { countryCode: 'MA', region: 'Béni Mellal-Khénifra', city: '', cost: 30, customRates: '', time: '48 ساعة' },
          { countryCode: 'MA', region: "L'Oriental", city: '', cost: 35, customRates: '', time: '48-72 ساعة' },
          { countryCode: 'MA', region: 'Drâa-Tafilalet', city: '', cost: 40, customRates: '', time: '48-72 ساعة' },
          { countryCode: 'MA', region: 'Guelmim-Oued Noun', city: '', cost: 45, customRates: '', time: '3-4 أيام' },
          { countryCode: 'MA', region: 'Laâyoune-Sakia El Hamra', city: '', cost: 50, customRates: '', time: '3-5 أيام' },
          { countryCode: 'MA', region: 'Dakhla-Oued Ed-Dahab', city: '', cost: 55, customRates: '', time: '3-5 أيام' }
        ]
      },
      'ma-casablanca-cities': {
        title: 'توصيل سريع جهة الدار البيضاء - سطات',
        defaultPrice: 20,
        rates: [
          { countryCode: 'MA', region: 'Casablanca-Settat', city: '', cost: 20, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Casablanca', cost: 15, customRates: '', time: '24 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Mohammedia', cost: 20, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Nouaceur', cost: 20, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Médiouna', cost: 20, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Berrechid', cost: 25, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Settat', cost: 25, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'El Jadida', cost: 30, customRates: '', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Benslimane', cost: 30, customRates: '', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Sidi Bennour', cost: 35, customRates: '', time: '48 ساعة' }
        ]
      },
      'ma-regions-custom-rates': {
        title: 'توصيل جهوي (منزل / مكتب)',
        defaultPrice: 25,
        rates: [
          { countryCode: 'MA', region: 'Casablanca-Settat', city: '', cost: 20, customRates: 'Home:20|Desk:15', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Rabat-Salé-Kénitra', city: '', cost: 25, customRates: 'Home:25|Desk:20', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Marrakech-Safi', city: '', cost: 30, customRates: 'Home:30|Desk:25', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Tanger-Tétouan-Al Hoceïma', city: '', cost: 30, customRates: 'Home:30|Desk:25', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Fès-Meknès', city: '', cost: 30, customRates: 'Home:30|Desk:25', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Souss-Massa', city: '', cost: 35, customRates: 'Home:35|Desk:30', time: '48-72 ساعة' },
          { countryCode: 'MA', region: "L'Oriental", city: '', cost: 40, customRates: 'Home:40|Desk:35', time: '48-72 ساعة' },
          { countryCode: 'MA', region: 'Laâyoune-Sakia El Hamra', city: '', cost: 50, customRates: 'Home:50|Desk:45', time: '3-5 أيام' }
        ]
      },
      'ma-casablanca-cities-custom': {
        title: 'توصيل جهة الدار البيضاء (منزل / مكتب)',
        defaultPrice: 25,
        rates: [
          { countryCode: 'MA', region: 'Casablanca-Settat', city: '', cost: 25, customRates: 'Home:25|Desk:18', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Casablanca', cost: 18, customRates: 'Home:18|Desk:12', time: '24 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Mohammedia', cost: 20, customRates: 'Home:20|Desk:15', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Nouaceur', cost: 22, customRates: 'Home:22|Desk:16', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Berrechid', cost: 25, customRates: 'Home:25|Desk:20', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Settat', cost: 28, customRates: 'Home:28|Desk:22', time: '24-48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'El Jadida', cost: 30, customRates: 'Home:30|Desk:25', time: '48 ساعة' },
          { countryCode: 'MA', region: 'Casablanca-Settat', city: 'Sidi Bennour', cost: 35, customRates: 'Home:35|Desk:30', time: '48 ساعة' }
        ]
      },
      'dz-wilayas-flat': {
        title: 'توصيل سريع لجميع الولايات الجزائرية',
        defaultPrice: 500,
        rates: [
          { countryCode: 'DZ', region: 'Alger', city: '', cost: 400, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'DZ', region: 'Blida', city: '', cost: 500, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'DZ', region: 'Oran', city: '', cost: 600, customRates: '', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Constantine', city: '', cost: 600, customRates: '', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Sétif', city: '', cost: 600, customRates: '', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Annaba', city: '', cost: 650, customRates: '', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Tlemcen', city: '', cost: 700, customRates: '', time: '48-72 ساعة' },
          { countryCode: 'DZ', region: 'Ouargla', city: '', cost: 900, customRates: '', time: '3-4 أيام' },
          { countryCode: 'DZ', region: 'Béchar', city: '', cost: 1000, customRates: '', time: '3-4 أيام' },
          { countryCode: 'DZ', region: 'Tamanrasset', city: '', cost: 1400, customRates: '', time: '4-6 أيام' }
        ]
      },
      'dz-wilayas-custom-rates': {
        title: 'توصيل للولايات (منزل / مكتب)',
        defaultPrice: 600,
        rates: [
          { countryCode: 'DZ', region: 'Alger', city: '', cost: 500, customRates: 'Home:500|Desk:300', time: '24-48 ساعة' },
          { countryCode: 'DZ', region: 'Blida', city: '', cost: 600, customRates: 'Home:600|Desk:350', time: '24-48 ساعة' },
          { countryCode: 'DZ', region: 'Oran', city: '', cost: 700, customRates: 'Home:700|Desk:400', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Constantine', city: '', cost: 700, customRates: 'Home:700|Desk:400', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Sétif', city: '', cost: 700, customRates: 'Home:700|Desk:400', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Annaba', city: '', cost: 750, customRates: 'Home:750|Desk:450', time: '48 ساعة' },
          { countryCode: 'DZ', region: 'Ouargla', city: '', cost: 950, customRates: 'Home:950|Desk:600', time: '3-4 أيام' },
          { countryCode: 'DZ', region: 'Tamanrasset', city: '', cost: 1400, customRates: 'Home:1400|Desk:900', time: '4-6 أيام' }
        ]
      },
      'iq-governorates-flat': {
        title: 'توصيل سريع لكافة المحافظات',
        defaultPrice: 5000,
        rates: [
          { countryCode: 'IQ', region: 'Baghdad', city: 'بغداد', cost: 5000, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'IQ', region: 'Basra', city: 'البصرة', cost: 6000, customRates: '', time: '2-3 أيام' },
          { countryCode: 'IQ', region: 'Erbil', city: 'أربيل', cost: 6000, customRates: '', time: '2-3 أيام' },
          { countryCode: 'IQ', region: 'Najaf', city: 'النجف', cost: 6000, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'IQ', region: 'Karbala', city: 'كربلاء', cost: 6000, customRates: '', time: '24-48 ساعة' },
          { countryCode: 'IQ', region: 'Sulaymaniyah', city: 'السليمانية', cost: 7000, customRates: '', time: '2-3 أيام' },
          { countryCode: 'IQ', region: 'Nineveh', city: 'نينوى', cost: 7000, customRates: '', time: '2-3 أيام' },
          { countryCode: 'IQ', region: 'Anbar', city: 'الأنبار', cost: 7000, customRates: '', time: '2-3 أيام' },
          { countryCode: 'IQ', region: 'Kirkuk', city: 'كركوك', cost: 6500, customRates: '', time: '2-3 أيام' },
          { countryCode: 'IQ', region: 'Duhok', city: 'دهوك', cost: 8000, customRates: '', time: '2-3 أيام' }
        ]
      }
    };

    function applyShippingTemplate(templateId) {
      var tmpl = TEMPLATES_LIBRARY[templateId];
      if (!tmpl) return;

      var tbody = document.getElementById('shipping-rates-tbody');
      if (!tbody) return;

      document.getElementById('cfg-shippingDefaultTitle').value = tmpl.title;
      document.getElementById('cfg-shippingDefaultPrice').value = tmpl.defaultPrice;

      tbody.innerHTML = tmpl.rates.map(function(r) {
        return '<tr data-city="' + (r.city || '') + '" data-region="' + (r.region || '') + '">' +
          '<td><input type="text" class="form-input shipping-country-input" value="' + (r.countryCode || 'MA') + '" style="max-width: 60px; font-weight: bold; text-transform: uppercase;"></td>' +
          '<td><input type="text" class="form-input shipping-region-input" value="' + (r.region || '') + '" placeholder="Region" style="width: 100%; font-weight: 600;"></td>' +
          '<td><input type="text" class="form-input shipping-city-input" value="' + (r.city || '') + '" placeholder="City" style="width: 100%;"></td>' +
          '<td><input type="number" class="form-input shipping-rate-input" value="' + (r.cost !== undefined ? r.cost : 0) + '" style="max-width: 110px;"></td>' +
          '<td><input type="text" class="form-input shipping-custom-rates-input" value="' + (r.customRates || '') + '" placeholder="Home:XX|Desk:YY" style="width: 100%; font-size: 12px;"></td>' +
          '<td><input type="text" class="form-input shipping-time-input" value="' + (r.time || '24-48 ساعة') + '" style="max-width: 110px; font-size: 12px;"></td>' +
          '<td style="text-align: center;"><button type="button" class="btn btn-secondary" onclick="deleteShippingRow(this)" style="padding: 4px 8px; font-size: 12px; color: #d82c0d;" title="Delete">✕</button></td>' +
        '</tr>';
      }).join('');

      updateRatesCount();
      showSaveBar();
      closeTemplatesModal();
      showToast('Template applied (' + tmpl.rates.length + ' locations)! Click Save to confirm changes.');
    }

    function clearAllShippingRates() {
      var tbody = document.getElementById('shipping-rates-tbody');
      if (tbody) {
        tbody.innerHTML = '<tr id="shipping-empty-row">' +
          '<td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--p-color-text-subdued);">' +
            '<div style="font-size: 32px; margin-bottom: 8px;">🚚</div>' +
            '<div style="font-weight: 700; font-size: 15px; color: #202223; margin-bottom: 4px;">No regional rates configured yet</div>' +
            '<div style="font-size: 13px; max-width: 480px; margin: 0 auto 16px;">Click "Country Templates" to load ready presets for Morocco, Algeria, or Iraq, or add your custom locations manually.</div>' +
            '<button type="button" class="btn btn-primary" onclick="openTemplatesModal()">🌐 Browse Country Templates</button>' +
          '</td>' +
        '</tr>';
      }
      updateRatesCount();
      showSaveBar();
      showToast('Shipping rates cleared. Click Save to publish.');
    }

    function updateRatesCount() {
      var rows = document.querySelectorAll('#shipping-rates-tbody tr:not(#shipping-empty-row)');
      var badge = document.getElementById('rates-count-badge');
      if (badge) badge.textContent = rows.length;
    }

    function addCustomShippingRow() {
      var defPrice = Number(document.getElementById('cfg-shippingDefaultPrice').value) || 0;

      var emptyRow = document.getElementById('shipping-empty-row');
      if (emptyRow) emptyRow.remove();

      var tbody = document.getElementById('shipping-rates-tbody');
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><input type="text" class="form-input shipping-country-input" value="MA" style="max-width: 60px; font-weight: bold; text-transform: uppercase;"></td>' +
        '<td><input type="text" class="form-input shipping-region-input" value="" placeholder="Region / Governorate" style="width: 100%; font-weight: 600;"></td>' +
        '<td><input type="text" class="form-input shipping-city-input" value="" placeholder="City (optional)" style="width: 100%;"></td>' +
        '<td><input type="number" class="form-input shipping-rate-input" value="' + defPrice + '" style="max-width: 110px;"></td>' +
        '<td><input type="text" class="form-input shipping-custom-rates-input" value="" placeholder="Home:XX|Desk:YY" style="width: 100%; font-size: 12px;"></td>' +
        '<td><input type="text" class="form-input shipping-time-input" value="24-48 ساعة" style="max-width: 110px; font-size: 12px;"></td>' +
        '<td style="text-align: center;"><button type="button" class="btn btn-secondary" onclick="deleteShippingRow(this)" style="padding: 4px 8px; font-size: 12px; color: #d82c0d;" title="Delete">✕</button></td>';

      tbody.insertBefore(tr, tbody.firstChild);
      updateRatesCount();
      showSaveBar();
      showToast('New location row added! Enter location details and click Save.');
      var firstInput = tr.querySelector('.shipping-region-input');
      if (firstInput) firstInput.focus();
    }

    function deleteShippingRow(btn) {
      var tr = btn.closest('tr');
      if (tr) {
        tr.remove();
        var rows = document.querySelectorAll('#shipping-rates-tbody tr:not(#shipping-empty-row)');
        if (rows.length === 0) {
          var tbody = document.getElementById('shipping-rates-tbody');
          if (tbody) {
            tbody.innerHTML = '<tr id="shipping-empty-row">' +
              '<td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--p-color-text-subdued);">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">🚚</div>' +
                '<div style="font-weight: 700; font-size: 15px; color: #202223; margin-bottom: 4px;">No regional rates configured yet</div>' +
                '<div style="font-size: 13px; max-width: 480px; margin: 0 auto 16px;">Click "Country Templates" to load ready presets for Morocco, Algeria, or Iraq, or add your custom locations manually.</div>' +
                '<button type="button" class="btn btn-primary" onclick="openTemplatesModal()">🌐 Browse Country Templates</button>' +
              '</td>' +
            '</tr>';
          }
        }
        updateRatesCount();
        showSaveBar();
      }
    }

    // Standard CSV Export: Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
    function exportRatesCsv() {
      var rows = document.querySelectorAll('#shipping-rates-tbody tr:not(#shipping-empty-row)');
      var lines = ['Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates'];

      rows.forEach(function(row) {
        var cInput = row.querySelector('.shipping-country-input');
        var rInput = row.querySelector('.shipping-region-input');
        var ciInput = row.querySelector('.shipping-city-input');
        var costInput = row.querySelector('.shipping-rate-input');
        var crInput = row.querySelector('.shipping-custom-rates-input');

        var code = cInput ? cInput.value.trim().toUpperCase() : 'MA';
        var reg = rInput ? rInput.value.trim() : '';
        var city = ciInput ? ciInput.value.trim() : '';
        var cost = costInput && costInput.value !== '' ? costInput.value.trim() : '';
        var custom = crInput ? crInput.value.trim() : '';
        var rateType = custom ? 'rate' : '';

        var escapeCsv = function(s) {
          if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        };

        lines.push([
          escapeCsv(code),
          escapeCsv(reg),
          escapeCsv(city),
          '',
          rateType,
          cost,
          escapeCsv(custom)
        ].join(','));
      });

      var csvContent = lines.join(String.fromCharCode(10));
      var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'artiz-shipping-rates-${shop}.csv';
      a.click();
      showToast('Exported CSV with ' + (lines.length - 1) + ' locations! 📁');
    }

    // Standard CSV Import: Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
    function importRatesCsv(event) {
      var file = event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var text = (e.target.result || '').replace(/^\\uFEFF/, '').trim();
          var lines = text.split(/\\r?\\n/).filter(function(l) { return l.trim().length > 0; });
          if (lines.length < 2) {
            alert('CSV file contains no data rows.');
            return;
          }

          var delimiter = lines[0].indexOf(';') !== -1 && lines[0].indexOf(',') === -1 ? ';' : ',';
          var headers = lines[0].split(delimiter).map(function(h) { return h.trim().toLowerCase().replace(/["'\\s]/g, '_'); });

          var countryIdx = headers.findIndex(function(h) { return h === 'country_code' || h.indexOf('country') !== -1; });
          var regionIdx = headers.findIndex(function(h) { return h === 'region' || h.indexOf('region') !== -1 || h.indexOf('state') !== -1 || h.indexOf('wilaya') !== -1; });
          var cityIdx = headers.findIndex(function(h) { return h === 'city' || h.indexOf('city') !== -1 || h.indexOf('ville') !== -1; });
          var costIdx = headers.findIndex(function(h) { return h === 'cost' || h.indexOf('cost') !== -1 || h.indexOf('price') !== -1 || h.indexOf('tarif') !== -1; });
          var customIdx = headers.findIndex(function(h) { return h === 'custom_rates' || h.indexOf('custom') !== -1; });

          var newRowsHtml = [];

          for (var i = 1; i < lines.length; i++) {
            var rowLine = lines[i].trim();
            if (!rowLine) continue;

            // Handle quoted fields
            var row = [];
            var inQuote = false;
            var cur = '';
            for (var c = 0; c < rowLine.length; c++) {
              var ch = rowLine[c];
              if (ch === '"') {
                inQuote = !inQuote;
              } else if (ch === delimiter && !inQuote) {
                row.push(cur.trim().replace(/^["']|["']$/g, ''));
                cur = '';
              } else {
                cur += ch;
              }
            }
            row.push(cur.trim().replace(/^["']|["']$/g, ''));

            var cCode = countryIdx !== -1 && row[countryIdx] ? row[countryIdx].trim().toUpperCase() : 'MA';
            var rName = regionIdx !== -1 && row[regionIdx] ? row[regionIdx].trim() : '';
            var ciName = cityIdx !== -1 && row[cityIdx] ? row[cityIdx].trim() : '';
            var cVal = costIdx !== -1 && row[costIdx] !== undefined ? row[costIdx].trim() : '';
            var crVal = customIdx !== -1 && row[customIdx] ? row[customIdx].trim() : '';

            newRowsHtml.push('<tr data-city="' + ciName + '" data-region="' + rName + '">' +
              '<td><input type="text" class="form-input shipping-country-input" value="' + (cCode || 'MA') + '" style="max-width: 60px; font-weight: bold; text-transform: uppercase;"></td>' +
              '<td><input type="text" class="form-input shipping-region-input" value="' + rName + '" style="width: 100%; font-weight: 600;"></td>' +
              '<td><input type="text" class="form-input shipping-city-input" value="' + ciName + '" style="width: 100%;"></td>' +
              '<td><input type="number" class="form-input shipping-rate-input" value="' + (cVal !== '' ? Number(cVal) : 0) + '" style="max-width: 110px;"></td>' +
              '<td><input type="text" class="form-input shipping-custom-rates-input" value="' + crVal + '" placeholder="Home:XX|Desk:YY" style="width: 100%; font-size: 12px;"></td>' +
              '<td><input type="text" class="form-input shipping-time-input" value="24-48 ساعة" style="max-width: 110px; font-size: 12px;"></td>' +
              '<td style="text-align: center;"><button type="button" class="btn btn-secondary" onclick="deleteShippingRow(this)" style="padding: 4px 8px; font-size: 12px; color: #d82c0d;" title="Delete">✕</button></td>' +
            '</tr>');
          }

          if (newRowsHtml.length > 0) {
            var tbody = document.getElementById('shipping-rates-tbody');
            tbody.innerHTML = newRowsHtml.join('');
            updateRatesCount();
            showSaveBar();
            showToast('Imported ' + newRowsHtml.length + ' locations from CSV! Click Save to apply.');
          }
        } catch (err) {
          alert('Could not parse CSV file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    function exportShippingRates() {
      var rows = document.querySelectorAll('#shipping-rates-tbody tr');
      var data = [];
      rows.forEach(function(row) {
        var cityInput = row.querySelector('.shipping-city-input');
        var rateInput = row.querySelector('.shipping-rate-input');
        var timeInput = row.querySelector('.shipping-time-input');
        var cityName = (cityInput ? cityInput.value : (row.dataset.city || '')).trim();
        if (cityName) {
          data.push({
            city: cityName,
            price: Number(rateInput?.value) || 5000,
            time: timeInput ? timeInput.value : '24-48 ساعة'
          });
        }
      });
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'artiz-shipping-rates-${shop}.json';
      a.click();
    }

    function importShippingRates(event) {
      var file = event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            var tbody = document.getElementById('shipping-rates-tbody');
            tbody.innerHTML = data.map(function(r) {
              return '<tr data-city="' + (r.city || '') + '">' +
                '<td><strong>📍 <input type="text" class="form-input shipping-city-input" value="' + (r.city || '') + '" style="max-width: 200px; display:inline-block; font-weight:bold;"></strong></td>' +
                '<td><input type="number" class="form-input shipping-rate-input" data-city="' + (r.city || '') + '" value="' + (r.price || r.cost || 5000) + '" style="max-width: 140px;"></td>' +
                '<td><input type="text" class="form-input shipping-time-input" data-city="' + (r.city || '') + '" value="' + (r.time || '24-48 ساعة') + '" style="max-width: 140px; font-size: 12px;"></td>' +
                '<td style="text-align: center;"><button type="button" class="btn btn-secondary" onclick="deleteShippingRow(this)" style="padding: 4px 8px; font-size: 12px; color: #d82c0d;" title="Delete">✕</button></td>' +
              '</tr>';
            }).join('');
            updateRatesCount();
            showSaveBar();
            showToast('Imported ' + data.length + ' shipping rates successfully! Click Save to apply.');
          }
        } catch (err) {
          alert('Invalid JSON file format: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    async function saveAdminTokenFromSettings() {
      var tokenInput = document.getElementById('settings-access-token');
      var token = tokenInput ? tokenInput.value.trim() : '';
      if (!token) {
        alert('Please enter your Shopify Admin Access Token (shpat_...)');
        return;
      }
      try {
        var res = await fetch('/settings/save?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shop: '${shop}', accessToken: token })
        });
        var data = await res.json();
        if (data.ok) {
          showToast('Shopify Admin Access Token saved successfully! ✅');
          tokenInput.value = '';
        } else {
          alert('Error saving token: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Failed to connect to worker: ' + err.message);
      }
    }

    async function saveManualToken() {
      var input = document.getElementById('manual-access-token');
      var token = input ? input.value.trim() : '';
      if (!token) {
        alert('Please enter your Shopify Admin Access Token (shpat_...)');
        return;
      }
      try {
        var res = await fetch('/settings/save?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shop: '${shop}', accessToken: token })
        });
        var data = await res.json();
        if (data.ok) {
          showToast('Token saved successfully! Reloading...');
          setTimeout(function() { window.location.reload(); }, 600);
        } else {
          alert('Error saving token: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Connection error: ' + err.message);
      }
    }

    function exportFullConfiguration() {
      var rawDef = document.getElementById('cfg-shippingDefaultPrice') ? document.getElementById('cfg-shippingDefaultPrice').value : '';
      var defPrice = rawDef !== '' && !isNaN(Number(rawDef)) ? Number(rawDef) : 0;

      var config = {
        exportedAt: new Date().toISOString(),
        shop: '${shop}',
        formConfig: {
          addressMode: document.getElementById('cfg-cascadingAddress') && document.getElementById('cfg-cascadingAddress').checked ? 'cascading' : 'standard',
          orderTag: document.getElementById('cfg-orderTag') ? document.getElementById('cfg-orderTag').value.trim() : 'Artiz-COD',
          enableCustomThankYou: document.getElementById('cfg-enableCustomThankYou') ? document.getElementById('cfg-enableCustomThankYou').checked : false,
          thankYouUrl: document.getElementById('cfg-thankYouUrl') ? document.getElementById('cfg-thankYouUrl').value.trim() : '',
          thankYouTitle: document.getElementById('cfg-thankYouTitle') ? document.getElementById('cfg-thankYouTitle').value.trim() : '',
          thankYouMsg: document.getElementById('cfg-thankYouMsg') ? document.getElementById('cfg-thankYouMsg').value.trim() : '',
          thankYouWhatsappBtn: document.getElementById('cfg-thankYouWhatsappBtn') ? document.getElementById('cfg-thankYouWhatsappBtn').checked : true,
          thankYouWhatsappNumber: document.getElementById('cfg-thankYouWhatsappNumber') ? document.getElementById('cfg-thankYouWhatsappNumber').value.trim() : '',
          displayMode: document.getElementById('cfg-displayMode') ? document.getElementById('cfg-displayMode').value : 'popup_modal',
          formTitle: document.getElementById('cfg-formTitle') ? document.getElementById('cfg-formTitle').value : '',
          buttonText: document.getElementById('cfg-buttonText') ? document.getElementById('cfg-buttonText').value : '',
          submitButtonText: document.getElementById('cfg-submitButtonText') ? document.getElementById('cfg-submitButtonText').value : '',
          primaryColor: document.getElementById('cfg-primaryColor') ? document.getElementById('cfg-primaryColor').value : '#008060',
          secondaryColor: document.getElementById('cfg-secondaryColor') ? document.getElementById('cfg-secondaryColor').value : '#ffffff'
        },
        shippingConfig: {
          defaultTitle: document.getElementById('cfg-shippingDefaultTitle') ? document.getElementById('cfg-shippingDefaultTitle').value : '',
          defaultPrice: defPrice,
          enableFreeShipping: document.getElementById('cfg-enableFreeShipping') ? document.getElementById('cfg-enableFreeShipping').checked : false,
          freeShippingThreshold: Number(document.getElementById('cfg-freeShippingThreshold') ? document.getElementById('cfg-freeShippingThreshold').value : 0)
        }
      };
      var blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'artiz-config-${shop}.json';
      a.click();
      showToast('Configuration exported! 📁');
    }

    function importFullConfiguration(event) {
      var file = event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var data = JSON.parse(e.target.result);
          if (data && data.formConfig) {
            if (data.formConfig.formTitle && document.getElementById('cfg-formTitle')) document.getElementById('cfg-formTitle').value = data.formConfig.formTitle;
            if (data.formConfig.buttonText && document.getElementById('cfg-buttonText')) document.getElementById('cfg-buttonText').value = data.formConfig.buttonText;
            if (data.formConfig.submitButtonText && document.getElementById('cfg-submitButtonText')) document.getElementById('cfg-submitButtonText').value = data.formConfig.submitButtonText;
            if (data.formConfig.primaryColor && document.getElementById('cfg-primaryColor')) document.getElementById('cfg-primaryColor').value = data.formConfig.primaryColor;
            if (data.formConfig.orderTag && document.getElementById('cfg-orderTag')) document.getElementById('cfg-orderTag').value = data.formConfig.orderTag;
            if (document.getElementById('cfg-cascadingAddress')) document.getElementById('cfg-cascadingAddress').checked = (data.formConfig.addressMode === 'cascading');
            if (document.getElementById('cfg-enableCustomThankYou') && data.formConfig.enableCustomThankYou !== undefined) {
              document.getElementById('cfg-enableCustomThankYou').checked = Boolean(data.formConfig.enableCustomThankYou);
              var b = document.getElementById('thank-you-custom-box');
              if (b) b.style.display = data.formConfig.enableCustomThankYou ? 'block' : 'none';
            }
            if (data.formConfig.thankYouUrl !== undefined && document.getElementById('cfg-thankYouUrl')) document.getElementById('cfg-thankYouUrl').value = data.formConfig.thankYouUrl;
            if (data.formConfig.thankYouTitle !== undefined && document.getElementById('cfg-thankYouTitle')) document.getElementById('cfg-thankYouTitle').value = data.formConfig.thankYouTitle;
            if (data.formConfig.thankYouMsg !== undefined && document.getElementById('cfg-thankYouMsg')) document.getElementById('cfg-thankYouMsg').value = data.formConfig.thankYouMsg;
            if (data.formConfig.thankYouWhatsappNumber !== undefined && document.getElementById('cfg-thankYouWhatsappNumber')) document.getElementById('cfg-thankYouWhatsappNumber').value = data.formConfig.thankYouWhatsappNumber;

            showSaveBar();
            showToast('Configuration loaded into form! Click "Save Settings" to publish. ✅');
          } else {
            alert('Invalid configuration file structure.');
          }
        } catch (err) {
          alert('Could not parse configuration JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    function resetFactoryDefaults() {
      if (document.getElementById('cfg-cascadingAddress')) document.getElementById('cfg-cascadingAddress').checked = false;
      if (document.getElementById('cfg-orderTag')) document.getElementById('cfg-orderTag').value = 'Artiz-COD';
      if (document.getElementById('cfg-thankYouUrl')) document.getElementById('cfg-thankYouUrl').value = '';
      if (document.getElementById('cfg-primaryColor')) document.getElementById('cfg-primaryColor').value = '#008060';
      if (document.getElementById('cfg-secondaryColor')) document.getElementById('cfg-secondaryColor').value = '#ffffff';
      showSaveBar();
      showToast('Reset to defaults! Click "Save Settings" to confirm.');
    }

    var donutPeriodsData = ${JSON.stringify(fulfillmentBreakdown)};
    function switchDonutPeriod(period, btn) {
      var btns = document.querySelectorAll('.dash-card-donut .dash-period-btn');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');

      var d = donutPeriodsData[period] || donutPeriodsData['h24'];
      var subtitle = document.getElementById('donut-subtitle');
      var rateText = document.getElementById('donut-rate-text');
      var subCount = document.getElementById('donut-orders-sub');
      var arc = document.getElementById('donut-delivered-arc');
      var delCount = document.getElementById('stat-delivered-count');
      var delPct = document.getElementById('stat-delivered-pct');
      var pndCount = document.getElementById('stat-pending-count');
      var pndPct = document.getElementById('stat-pending-pct');

      var periodLabels = {
        'h24': 'Last 24 Hours',
        'h48': 'Last 48 Hours'
      };

      if (subtitle) subtitle.textContent = 'Delivery Status (' + (periodLabels[period] || '') + ')';
      if (rateText) rateText.textContent = d.rate + '%';
      if (subCount) subCount.textContent = d.total + ' orders (' + (periodLabels[period] || '') + ')';
      if (delCount) delCount.textContent = d.delivered;
      if (delPct) delPct.textContent = d.rate + '%';
      if (pndCount) pndCount.textContent = d.pending;
      if (pndPct) pndPct.textContent = (100 - Number(d.rate)).toFixed(1) + '%';

      if (arc) {
        var offset = 390 - (390 * (Number(d.rate) / 100));
        arc.setAttribute('stroke-dashoffset', offset);
      }
    }

    function switchOrdersTab(tab, btn) {
      var btns = document.querySelectorAll('#orders-filter-toggle .dash-period-btn');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');

      var viewUnfulfilled = document.getElementById('orders-table-unfulfilled');
      var viewInTransit = document.getElementById('orders-table-intransit');
      var viewAll = document.getElementById('orders-table-all');
      var subtitle = document.getElementById('orders-tab-subtitle');
      var countBadge = document.getElementById('orders-tab-count');
      var linkBtn = document.getElementById('orders-link-btn');

      if (viewUnfulfilled) viewUnfulfilled.style.display = (tab === 'unfulfilled' ? 'block' : 'none');
      if (viewInTransit) viewInTransit.style.display = (tab === 'intransit' ? 'block' : 'none');
      if (viewAll) viewAll.style.display = (tab === 'all' ? 'block' : 'none');

      var shopDomain = ${JSON.stringify(shop)};
      var unfulfilledCount = ${unfulfilledOrders.length};
      var inTransitCount = ${inTransitOrders.length};
      var allCount = ${allOrders.length};

      if (tab === 'unfulfilled') {
        if (subtitle) subtitle.textContent = 'Orders awaiting packaging and courier dispatch';
        if (countBadge) countBadge.textContent = unfulfilledCount;
        if (linkBtn) {
          linkBtn.href = 'https://' + shopDomain + '/admin/orders?fulfillment_status=unfulfilled';
          linkBtn.textContent = 'View in Shopify ↗';
        }
      } else if (tab === 'intransit') {
        if (subtitle) subtitle.textContent = 'Dispatched COD orders awaiting delivery and cash collection';
        if (countBadge) countBadge.textContent = inTransitCount;
        if (linkBtn) {
          linkBtn.href = 'https://' + shopDomain + '/admin/orders';
          linkBtn.textContent = 'View in Shopify ↗';
        }
      } else {
        if (subtitle) subtitle.textContent = 'All recent store orders and current statuses';
        if (countBadge) countBadge.textContent = allCount;
        if (linkBtn) {
          linkBtn.href = 'https://' + shopDomain + '/admin/orders';
          linkBtn.textContent = 'View in Shopify ↗';
        }
      }
    }

    function onButtonModeChange(mode) {
      var box = document.getElementById('box-show-add-to-cart');
      var labelReplace = document.getElementById('label-mode-replace');
      var labelHijack = document.getElementById('label-mode-hijack');
      if (mode === 'hijack') {
        if (box) box.style.display = 'none';
        if (labelHijack) { labelHijack.style.borderColor = '#008060'; labelHijack.style.background = '#f0fdf4'; }
        if (labelReplace) { labelReplace.style.borderColor = 'var(--p-color-border)'; labelReplace.style.background = '#ffffff'; }
      } else {
        if (box) box.style.display = 'flex';
        if (labelReplace) { labelReplace.style.borderColor = '#008060'; labelReplace.style.background = '#f0fdf4'; }
        if (labelHijack) { labelHijack.style.borderColor = 'var(--p-color-border)'; labelHijack.style.background = '#ffffff'; }
      }
      showSaveBar();
    }

    var chartPointsData = ${JSON.stringify(salesChartSvg.points)};
    var chartCurrencySymbol = ${JSON.stringify(currencyDisplay)};

    function initChartInteractivity() {
      var hitRect = document.getElementById('chart-hit-rect');
      var svgEl = document.querySelector('.chart-svg');
      var guideLine = document.getElementById('chart-guide-line');
      var activeDot = document.getElementById('chart-active-dot');
      var tooltip = document.getElementById('chart-hover-tooltip');
      var tooltipDate = document.getElementById('tooltip-date');
      var tooltipSales = document.getElementById('tooltip-sales');

      if (!hitRect || !svgEl || !guideLine || !activeDot || !tooltip || !chartPointsData || chartPointsData.length === 0) return;

      function onMove(e) {
        var rect = svgEl.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        var relX = clientX - rect.left;
        var relY = clientY - rect.top;

        if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) {
          onLeave();
          return;
        }

        // Map mouse position to SVG coordinates (0 - 600)
        var svgX = (relX / rect.width) * 600;

        // Find nearest point along x
        var closest = chartPointsData[0];
        var minDiff = Math.abs(closest.x - svgX);
        for (var i = 1; i < chartPointsData.length; i++) {
          var diff = Math.abs(chartPointsData[i].x - svgX);
          if (diff < minDiff) {
            minDiff = diff;
            closest = chartPointsData[i];
          }
        }

        // Update guide line and active dot
        guideLine.setAttribute('x1', closest.x);
        guideLine.setAttribute('x2', closest.x);
        guideLine.style.display = 'block';

        activeDot.setAttribute('cx', closest.x);
        activeDot.setAttribute('cy', closest.y);
        activeDot.style.display = 'block';

        // Update tooltip content
        tooltipDate.textContent = 'Date: ' + (closest.fullDateISO || closest.fullDate);
        var ordersCountText = closest.ordersCount !== undefined ? ' • ' + closest.ordersCount + ' orders' : '';
        tooltipSales.innerHTML = 'Sales: <strong>' + (closest.revenueFormatted || Number(closest.revenue).toLocaleString()) + ' ' + chartCurrencySymbol + '</strong>' + (ordersCountText ? '<span style="font-size:11px;color:#94a3b8;font-weight:normal;margin-left:4px;">' + ordersCountText + '</span>' : '');

        // Position tooltip in % of wrap
        var pctX = (closest.x / 600) * 100;
        var pctY = (closest.y / 190) * 100;

        if (pctX < 18) {
          tooltip.style.transform = 'translate(-10%, -100%)';
        } else if (pctX > 82) {
          tooltip.style.transform = 'translate(-90%, -100%)';
        } else {
          tooltip.style.transform = 'translate(-50%, -100%)';
        }

        if (pctY < 28) {
          tooltip.style.marginTop = '28px';
        } else {
          tooltip.style.marginTop = '-12px';
        }

        tooltip.style.left = pctX + '%';
        tooltip.style.top = Math.max(8, pctY) + '%';
        tooltip.style.display = 'block';
      }

      function onLeave() {
        guideLine.style.display = 'none';
        activeDot.style.display = 'none';
        tooltip.style.display = 'none';
      }

      hitRect.addEventListener('mousemove', onMove);
      hitRect.addEventListener('touchmove', onMove, { passive: true });
      hitRect.addEventListener('mouseleave', onLeave);
      hitRect.addEventListener('touchend', onLeave);

      // Asynchronously fetch complete 7-day paginated orders without blocking initial dashboard load
      fetchWeeklySalesData();
    }

    async function fetchWeeklySalesData() {
      var skeleton = document.getElementById('chart-skeleton');
      try {
        var res = await fetch('/dashboard/weekly-sales?shop=' + encodeURIComponent('${shop}'));
        var json = await res.json();
        if (json && json.ok && json.data && Array.isArray(json.data.points) && json.data.points.length === 7) {
          var d = json.data;
          chartPointsData = d.points;
          if (d.currency) chartCurrencySymbol = d.currency;

          // Update SVG Path & Area
          var areaEl = document.getElementById('chart-area-path');
          var lineEl = document.getElementById('chart-line-path');
          if (areaEl && d.areaD) areaEl.setAttribute('d', d.areaD);
          if (lineEl && d.pathD) lineEl.setAttribute('d', d.pathD);

          // Update Day Markers
          var pointsGroup = document.getElementById('chart-points-group');
          if (pointsGroup) {
            pointsGroup.innerHTML = d.points.map(function(pt) {
              return '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="3.2" fill="#14161a" stroke="#f59e0b" stroke-width="1.8" class="chart-point" pointer-events="none"></circle>';
            }).join('');
          }

          // Update Y-Axis Scale
          var maxR = d.maxRev || 50;
          function fmtCompact(val) {
            var num = Number(val) || 0;
            var abs = Math.abs(num);
            if (abs >= 1000000000) return (num / 1000000000).toFixed(2).replace(/\.?0+$/, '') + 'B';
            if (abs >= 1000000) return (num / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
            if (abs >= 1000) return (num / 1000).toFixed(2).replace(/\.?0+$/, '') + 'K';
            return num % 1 === 0 ? num.toLocaleString() : num.toFixed(2);
          }
          var y4 = document.getElementById('y-axis-4'); if (y4) y4.textContent = fmtCompact(maxR);
          var y3 = document.getElementById('y-axis-3'); if (y3) y3.textContent = fmtCompact(maxR * 0.75);
          var y2 = document.getElementById('y-axis-2'); if (y2) y2.textContent = fmtCompact(maxR * 0.5);
          var y1 = document.getElementById('y-axis-1'); if (y1) y1.textContent = fmtCompact(maxR * 0.25);

          // Update X-Axis Dates
          var xAxisEl = document.getElementById('dash-chart-x-axis');
          if (xAxisEl) {
            xAxisEl.innerHTML = d.points.map(function(p) {
              return '<span>' + p.date + '</span>';
            }).join('');
          }

          // Update Badge with live weekly order count
          var badgeText = document.getElementById('chart-badge-text');
          if (badgeText) {
            var count = d.ordersFetched || d.totalWeeklyOrders || 0;
            badgeText.textContent = 'Last 7 Days (' + count + ' orders)';
          }
        }
      } catch (e) {
        console.warn('Weekly sales async fetch error:', e);
      } finally {
        if (skeleton) {
          skeleton.classList.add('chart-loaded');
        }
      }
    }

    // Attach listeners on all form controls for automatic dirty tracking
    function initChangeListeners() {
      initChartInteractivity();

      var inputs = document.querySelectorAll('input:not(#manual-access-token):not(#settings-access-token), select, textarea');
      inputs.forEach(function(el) {
        el.addEventListener('input', showSaveBar);
        el.addEventListener('change', showSaveBar);
      });

      document.querySelectorAll('.mode-card').forEach(function(c) {
        c.addEventListener('click', showSaveBar);
      });

      var sbSave = document.getElementById('save-bar-save-btn');
      if (sbSave) {
        sbSave.addEventListener('click', function(e) {
          if (e) e.preventDefault();
          saveAllSettings();
        });
      }
      var sbDiscard = document.getElementById('save-bar-discard-btn');
      if (sbDiscard) {
        sbDiscard.addEventListener('click', function(e) {
          if (e) e.preventDefault();
          discardChanges();
        });
      }
    }

    // ==================== ABANDONED ORDERS RECOVERY & WHATSAPP ====================
    window._abandonedCheckouts = [];
    var currentAbandonedFilter = 'all';
    var currentActiveCheckout = null;

    function formatRelTime(dateIso) {
      if (!dateIso) return 'Just now';
      var diffMin = Math.floor((Date.now() - new Date(dateIso).getTime()) / 60000);
      if (diffMin >= 60 * 24) return Math.floor(diffMin / (60 * 24)) + 'd ago';
      if (diffMin >= 60) return Math.floor(diffMin / 60) + 'h ago';
      if (diffMin > 1) return diffMin + 'm ago';
      return 'Just now';
    }

    function buildTemplateMessage(tplKey, checkout, options) {
      options = options || {};
      var name = (checkout.customer?.name || "عميلنا الكريم").trim();
      var storeName = ${JSON.stringify(storeDisplayTitle)};
      var storeSign = "فريق " + storeName + " 🌟";
      var storeUrl = ${JSON.stringify(storeDisplayDomain)};
      var currency = "${currencyDisplay}";
      var total = Number(checkout.pricing?.total || 0).toLocaleString() + " " + currency;
      var productNames = (checkout.items || []).map(function(i) { return i.title; }).filter(Boolean).join(" + ") || "الطلب";
      var eta = "15-30 دقيقة";
      var code = (options.discountCode || "OFFER10").trim().toUpperCase();
      var pct = options.discountPct || 10;
      var lines = [];

      switch (tplKey) {
        case "abandoned_recovery":
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "لاحظنا أنك بدأت طلب في متجر " + storeName + " ولم تتمكن من إكمال الدفع.",
            "🛒 *المنتج:* " + productNames,
            "💰 *المبلغ:* " + total,
            "",
            "هل واجهتك أي مشكلة أثناء الدفع أو تحتاج مساعدة لإكمال طلبك؟",
            "يسعدنا الرد على استفسارك ومساعدتك في أي وقت 💬",
            "",
            "🔗 رابط المتجر: " + storeUrl,
            "",
            storeSign
          ];
          break;

        case "abandoned_discount":
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "لاحظنا أنك بدأت طلب في متجر " + storeName + " ولم تتمكن من إكمال الدفع.",
            "🛒 *المنتج:* " + productNames,
            "💰 *المبلغ:* " + total,
            "",
            "ولأنك غالي علينا 🫶🏻",
            "هذا كود خصم خاص " + pct + "٪ لك وللي يعز عليك:",
            "الكود هو: *" + code + "*",
            "أكمل طلبك الآن واستفد من الخصم الحصري.",
            "",
            "🔗 رابط المتجر: " + storeUrl,
            "",
            "نحن هنا لمساعدتك في أي وقت 💬",
            storeSign
          ];
          break;

        case "confirmation":
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "تم تأكيد الدفع والطلب بنجاح في متجر " + storeName + " ✅",
            "🛒 *المنتج:* " + productNames,
            "💰 *المبلغ:* " + total,
            "",
            "سنبدأ بتجهيز طلبك وإرساله فوراً خلال " + eta + ".",
            "📘 لمتابعة حالة الطلب: " + storeUrl,
            "",
            "شكراً لثقتك بـ " + storeName + " 🌟"
          ];
          break;

        case "credentials":
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "تم تجهيز طلبك / اشتراكك بنجاح في متجر " + storeName + " ✅",
            "🛒 *المنتج:* " + productNames,
            "",
            "بيانات الطلب / الاشتراك:",
            "🔑 *الكود / المرجع:* " + (checkout.sessionId || ""),
            "🔗 *الرابط:* " + storeUrl,
            "",
            "إذا كان لديك أي استفسار أو احتجت مساعدة، يسعدنا الرد عليك هنا في أي وقت 💬",
            storeSign
          ];
          break;

        case "delay":
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "نعتذر منك — الطلب يحتاج وقتاً إضافياً للتجهيز.",
            "⏰ الوقت المتوقّع: " + eta,
            "",
            "شكراً جزيلاً لصبرك وتفهمك 🙏",
            storeSign
          ];
          break;

        case "follow_up":
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "نتابع معك بخصوص طلبك في " + storeName + ".",
            "هل كل شيء وصلك ويعمل معك بشكل سليم وممتاز؟",
            "",
            "في خدمتك دائماً 💬 — " + storeSign
          ];
          break;

        case "review_request":
          lines = [
            "مرحباً بك " + name + " 🌟",
            "",
            "نتمنى أن تكون تجربتك مع طلب (" + productNames + ") تجربة ممتازة وتليق بتطلعاتك!",
            "",
            "رأيك وملاحظاتك تهمنا كثيراً وتساعدنا على تطوير خدماتنا باستمرار.",
            "يسعدنا مشاركتنا تقييمك عبر الرابط المباشر:",
            "⭐ " + storeUrl,
            "",
            "شكراً لاختيارك " + storeName + "، ونحن في خدمتك دائماً في أي وقت 👋",
            storeSign
          ];
          break;

        case "custom":
        default:
          lines = [
            "السلام عليكم " + name + " 👋",
            "",
            "...",
            "",
            storeSign
          ];
          break;
      }
      return lines.join(String.fromCharCode(10));
    }

    window.loadAbandonedOrders = async function(showToast) {
      var tbody = document.getElementById('ab-orders-tbody');
      var refreshBtn = document.getElementById('ab-btn-refresh');
      var refreshSpinner = document.getElementById('ab-refresh-spinner');

      if (refreshBtn) refreshBtn.disabled = true;
      if (refreshSpinner) refreshSpinner.style.display = 'inline-block';
      if (tbody && (!window._abandonedCheckouts || window._abandonedCheckouts.length === 0)) {
        tbody.innerHTML = '<tr><td colspan="8" style="padding: 36px; text-align: center; color: #94a3b8;">⏳ Loading abandoned checkouts...</td></tr>';
      }

      try {
        var res = await fetch('/abandoned/list?shop=' + encodeURIComponent('${shop}'));
        var json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load abandoned checkouts');

        var stats = json.data?.stats || json.stats || {};
        window._abandonedCheckouts = json.data?.checkouts || json.checkouts || [];

        var totalEl = document.getElementById('ab-stat-total');
        if (totalEl) totalEl.textContent = stats.totalAbandoned || 0;

        var valEl = document.getElementById('ab-stat-value');
        if (valEl) valEl.innerHTML = (Number(stats.potentialLostValue || 0)).toLocaleString() + ' <span class="dash-kpi-cur">${currencyDisplay}</span>';

        var todayEl = document.getElementById('ab-stat-today');
        if (todayEl) todayEl.textContent = stats.abandonedToday || 0;

        var contEl = document.getElementById('ab-stat-contacted');
        if (contEl) contEl.textContent = stats.contactedCount || 0;

        window.renderAbandonedTable();
      } catch (err) {
        console.error('Error loading abandoned checkouts:', err);
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="8" style="padding: 36px; text-align: center; color: #ef4444;">Failed to load abandoned checkouts: ' + err.message + '</td></tr>';
        }
      } finally {
        if (refreshBtn) refreshBtn.disabled = false;
        if (refreshSpinner) refreshSpinner.style.display = 'none';
      }
    };

    window.setAbandonedFilter = function(filter, el) {
      currentAbandonedFilter = filter;
      document.querySelectorAll('#page-abandoned-orders .btn-period').forEach(function(b) { b.classList.remove('active'); });
      if (el) el.classList.add('active');
      window.renderAbandonedTable();
    };

    window.onFilterAbandoned = function() {
      window.renderAbandonedTable();
    };

    window.renderAbandonedTable = function() {
      var tbody = document.getElementById('ab-orders-tbody');
      if (!tbody) return;

      var searchVal = (document.getElementById('ab-search-input')?.value || '').toLowerCase().trim();
      var nowMs = Date.now();
      var todayStr = new Date().toISOString().split('T')[0];

      var filtered = (window._abandonedCheckouts || []).filter(function(item) {
        if (searchVal) {
          var name = (item.customer?.name || '').toLowerCase();
          var phone = (item.customer?.phone || '').toLowerCase();
          var city = (item.customer?.city || '').toLowerCase();
          var sid = (item.sessionId || '').toLowerCase();
          var prods = (item.items || []).map(function(i) { return i.title; }).join(' ').toLowerCase();
          if (!name.includes(searchVal) && !phone.includes(searchVal) && !city.includes(searchVal) && !sid.includes(searchVal) && !prods.includes(searchVal)) {
            return false;
          }
        }

        if (currentAbandonedFilter === 'today') {
          return item.createdAt && item.createdAt.startsWith(todayStr);
        }
        if (currentAbandonedFilter === 'week') {
          var itemMs = new Date(item.createdAt || 0).getTime();
          return (nowMs - itemMs) <= (7 * 24 * 60 * 60 * 1000);
        }
        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="padding: 48px 16px; text-align: center; color: #94a3b8;"><div style="font-size: 36px; margin-bottom: 8px;">🎉</div><strong style="color: #fff; font-size: 15px;">No abandoned checkouts found</strong><div style="font-size: 12px; margin-top: 4px;">All checkouts completed or filter returned no matches.</div></td></tr>';
        updateSelectedCount();
        return;
      }

      var html = '';
      filtered.forEach(function(item) {
        var isConverted = item.status === 'converted';
        var isFailed = item.status === 'payment_failed';
        var isContacted = item.contactStatus === 'contacted' || isConverted;
        var relTime = formatRelTime(item.createdAt);

        var statusBadge = '';
        if (isConverted) {
          statusBadge = '<span class="status-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16,185,129,0.3); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Recovered (#' + (item.convertedOrderNumber || '') + ')</span>';
        } else if (isFailed) {
          statusBadge = '<span class="status-badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); padding: 4px 8px; border-radius: 4px; font-size: 11px;">Payment Failed</span>';
        } else if (item.contactStatus === 'contacted') {
          var methodLabel = item.contactMethod === 'bot' ? '🤖 Bot' : '💬 WhatsApp';
          var timeText = item.contactedAt ? ' • ' + formatRelTime(item.contactedAt) : '';
          statusBadge = '<span class="status-badge" style="background: rgba(14, 165, 233, 0.2); color: #38bdf8; border: 1px solid rgba(14,165,233,0.4); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Contacted (' + methodLabel + timeText + ')</span>';
        } else {
          statusBadge = '<span class="status-badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); padding: 4px 8px; border-radius: 4px; font-size: 11px;">Not Contacted</span>';
        }

        var itemsList = (item.items || []).map(function(it) {
          var title = it.title || 'منتج';
          return '<div style="margin-bottom: 2px;"><strong style="color: #e2e8f0;">' + title + '</strong>' +
            (it.variantTitle ? ' <span style="color: #94a3b8; font-size: 11px;">(' + it.variantTitle + ')</span>' : '') +
            ' <span style="color: #f59e0b; font-weight: 600;">×' + (it.quantity || 1) + '</span></div>';
        }).join('');
        if (!itemsList) itemsList = '<span style="color: #64748b;">(No items)</span>';

        html += '<tr style="border-bottom: 1px solid #1e293b; ' + (isConverted ? 'background: rgba(16, 185, 129, 0.05);' : '') + '">' +
          '<td style="padding: 14px 16px; text-align: center;"><input type="checkbox" class="ab-row-check" value="' + item.sessionId + '" onchange="onAbandonedRowCheckChange()" style="cursor: pointer; width: 16px; height: 16px; accent-color: #10b981;"></td>' +
          '<td style="padding: 14px 16px; font-family: monospace; font-size: 11px; color: #94a3b8;">' + (item.sessionId || '').slice(-10) + '</td>' +
          '<td style="padding: 14px 16px;">' +
            '<div style="font-weight: 600; color: #fff;">' + (item.customer?.name || 'Customer') + '</div>' +
            '<div style="color: #38bdf8; font-size: 12px; margin-top: 2px; direction: ltr; text-align: left;">' + (item.customer?.phone || '-') + '</div>' +
            (item.customer?.city ? '<div style="color: #64748b; font-size: 11px;">📍 ' + item.customer.city + (item.customer.address ? ' - ' + item.customer.address : '') + '</div>' : '') +
          '</td>' +
          '<td style="padding: 14px 16px; max-width: 280px;">' + itemsList + '</td>' +
          '<td style="padding: 14px 16px; white-space: nowrap;"><strong style="color: #fff; font-size: 14px;">' + Number(item.pricing?.total || 0).toLocaleString() + '</strong> <span style="color: #94a3b8; font-size: 11px;">${currencyDisplay}</span></td>' +
          '<td style="padding: 14px 16px; white-space: nowrap; color: #94a3b8;">' + relTime + '</td>' +
          '<td style="padding: 14px 16px; white-space: nowrap;">' + statusBadge + '</td>' +
          '<td style="padding: 14px 16px; white-space: nowrap; text-align: center;">' +
            '<div style="display: flex; gap: 6px; justify-content: center; align-items: center;">' +
              '<button type="button" data-sid="' + item.sessionId + '" onclick="openAbandonedWhatsAppModal(this.dataset.sid)" class="btn" style="background: #25D366; color: #fff; font-weight: 600; padding: 6px 10px; font-size: 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;" title="إرسال واتساب بقوالب جاهزة"><span>💬</span> WhatsApp</button>' +
              (!isConverted ? '<button type="button" data-sid="' + item.sessionId + '" onclick="convertAbandonedToCod(this.dataset.sid, this)" class="btn" style="background: #10b981; color: #fff; padding: 6px 10px; font-size: 12px; border-radius: 6px;" title="Convert to COD Order in Shopify">Convert to COD</button>' : '') +
              '<button type="button" data-sid="' + item.sessionId + '" onclick="deleteAbandoned(this.dataset.sid, this)" class="btn" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 6px 8px; font-size: 11px; border-radius: 6px;" title="Delete">🗑</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });

      tbody.innerHTML = html;
      updateSelectedCount();
    };

    window.toggleSelectAllAbandoned = function(masterCb) {
      var isChecked = masterCb.checked;
      document.querySelectorAll('.ab-row-check').forEach(function(cb) {
        cb.checked = isChecked;
      });
      updateSelectedCount();
    };

    window.onAbandonedRowCheckChange = function() {
      updateSelectedCount();
    };

    function updateSelectedCount() {
      var checked = document.querySelectorAll('.ab-row-check:checked');
      var count = checked.length;
      var countSpan = document.getElementById('ab-selected-count');
      var bulkBtn = document.getElementById('ab-btn-bulk-delete');
      var masterCb = document.getElementById('ab-select-all');

      if (countSpan) countSpan.textContent = count;
      if (bulkBtn) {
        bulkBtn.style.display = count > 0 ? 'inline-flex' : 'none';
      }

      var allRows = document.querySelectorAll('.ab-row-check');
      if (masterCb && allRows.length > 0) {
        masterCb.checked = (checked.length === allRows.length);
      }
    }

    window.deleteSelectedAbandoned = async function() {
      var checkedBoxes = document.querySelectorAll('.ab-row-check:checked');
      var ids = Array.from(checkedBoxes).map(function(cb) { return cb.value; });
      if (ids.length === 0) return;

      if (!confirm('Are you sure you want to permanently delete ' + ids.length + ' selected abandoned checkouts?')) return;

      var bulkBtn = document.getElementById('ab-btn-bulk-delete');
      if (bulkBtn) { bulkBtn.disabled = true; bulkBtn.textContent = 'Deleting...'; }

      try {
        var res = await fetch('/abandoned/delete?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionIds: ids })
        });
        var json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Bulk delete failed');

        window.loadAbandonedOrders(false);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        if (bulkBtn) { bulkBtn.disabled = false; }
        updateSelectedCount();
      }
    };

    window.openAbandonedWhatsAppModal = function(sessionId) {
      var checkout = (window._abandonedCheckouts || []).find(function(c) { return c.sessionId === sessionId; });
      if (!checkout) {
        alert('Checkout details not found.');
        return;
      }
      currentActiveCheckout = checkout;

      var custName = checkout.customer?.name || 'العميل';
      var phone = checkout.customer?.phone || 'بدون رقم';
      var titleEl = document.getElementById('ab-wa-modal-title');
      var subEl = document.getElementById('ab-wa-modal-sub');
      if (titleEl) titleEl.textContent = 'WhatsApp Follow-Up — ' + custName;
      if (subEl) subEl.textContent = 'Phone: ' + phone + ' | Cart ID: ' + (sessionId.slice(-10));

      var tplSelect = document.getElementById('ab-wa-template-select');
      if (tplSelect) tplSelect.value = 'abandoned_recovery';

      var discountWrap = document.getElementById('ab-wa-discount-wrap');
      if (discountWrap) discountWrap.style.display = 'none';

      window.onAbandonedTemplateChange();

      var modal = document.getElementById('ab-wa-modal');
      if (modal) modal.style.display = 'flex';
    };

    window.closeAbandonedWhatsAppModal = function() {
      var modal = document.getElementById('ab-wa-modal');
      if (modal) modal.style.display = 'none';
      currentActiveCheckout = null;
    };

    window.onAbandonedTemplateChange = function() {
      if (!currentActiveCheckout) return;
      var tpl = document.getElementById('ab-wa-template-select')?.value || 'abandoned_recovery';
      var discountWrap = document.getElementById('ab-wa-discount-wrap');
      var isDiscount = (tpl === 'abandoned_discount');
      if (discountWrap) {
        discountWrap.style.display = isDiscount ? 'grid' : 'none';
      }

      var discountCode = document.getElementById('ab-wa-discount-code')?.value || 'OFFER10';
      var discountPct = Number(document.getElementById('ab-wa-discount-pct')?.value || 10);

      var msg = buildTemplateMessage(tpl, currentActiveCheckout, {
        discountCode: discountCode,
        discountPct: discountPct
      });

      var textarea = document.getElementById('ab-wa-message-text');
      if (textarea) {
        textarea.value = msg;
        var countEl = document.getElementById('ab-wa-char-count');
        if (countEl) countEl.textContent = msg.length + ' characters';
      }
    };

    window.sendAbandonedManualWhatsApp = async function() {
      if (!currentActiveCheckout) return;
      var rawPhone = currentActiveCheckout.customer?.phone || '';
      var cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.indexOf('00') === 0) cleanPhone = cleanPhone.slice(2);
      if (!cleanPhone) {
        alert('No valid phone number found for this customer.');
        return;
      }

      var message = document.getElementById('ab-wa-message-text')?.value || '';
      var tpl = document.getElementById('ab-wa-template-select')?.value || 'abandoned_recovery';

      var waUrl = 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(message);
      window.open(waUrl, '_blank');

      try {
        var res = await fetch('/abandoned/status?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentActiveCheckout.sessionId,
            contactStatus: 'contacted',
            contactMethod: 'whatsapp_manual',
            template: tpl
          })
        });
        var json = await res.json();
        if (json.ok) {
          currentActiveCheckout.contactStatus = 'contacted';
          currentActiveCheckout.contactMethod = 'whatsapp_manual';
          currentActiveCheckout.contactedAt = json.contactedAt || new Date().toISOString();
          currentActiveCheckout.templateUsed = tpl;
          window.renderAbandonedTable();
        }
      } catch (e) {
        console.warn('Status update error:', e);
      }

      window.closeAbandonedWhatsAppModal();
    };

    window.sendAbandonedBotWhatsApp = async function() {
      if (!currentActiveCheckout) return;
      var rawPhone = currentActiveCheckout.customer?.phone || '';
      var cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.indexOf('00') === 0) cleanPhone = cleanPhone.slice(2);
      if (!cleanPhone) {
        alert('No valid phone number found for this customer.');
        return;
      }

      var tpl = document.getElementById('ab-wa-template-select')?.value || 'abandoned_recovery';
      if (!confirm('Confirm automated bot WhatsApp message to: ' + cleanPhone + '?\\nMessage will be queued and status updated.')) return;

      try {
        var res = await fetch('/abandoned/status?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentActiveCheckout.sessionId,
            contactStatus: 'contacted',
            contactMethod: 'bot',
            template: tpl
          })
        });
        var json = await res.json();
        if (json.ok) {
          currentActiveCheckout.contactStatus = 'contacted';
          currentActiveCheckout.contactMethod = 'bot';
          currentActiveCheckout.contactedAt = json.contactedAt || new Date().toISOString();
          currentActiveCheckout.templateUsed = tpl;
          window.renderAbandonedTable();
          alert('🤖 WhatsApp bot message sent successfully!');
        }
      } catch (e) {
        alert('Error: ' + e.message);
      }

      window.closeAbandonedWhatsAppModal();
    };

    window.convertAbandonedToCod = async function(sessionId, btn) {
      if (!confirm('Are you sure you want to convert this abandoned checkout into an active COD order in Shopify?')) return;
      if (btn) { btn.disabled = true; btn.textContent = 'Converting...'; }
      try {
        var res = await fetch('/abandoned/convert?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId })
        });
        var json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Conversion failed');
        alert('✅ Order created successfully in Shopify! Order #' + (json.orderNumber || json.data?.orderNumber || ''));
        window.loadAbandonedOrders(false);
      } catch (err) {
        alert('Error: ' + err.message);
        if (btn) { btn.disabled = false; btn.textContent = 'Convert to COD'; }
      }
    };

    window.deleteAbandoned = async function(sessionId, btn) {
      if (!confirm('Are you sure you want to delete this abandoned checkout?')) return;
      if (btn) { btn.disabled = true; }
      try {
        var res = await fetch('/abandoned/delete?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId })
        });
        var json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Delete failed');
        window.loadAbandonedOrders(false);
      } catch (err) {
        alert('Error: ' + err.message);
        if (btn) { btn.disabled = false; }
      }
    };

    window.cleanupAbandoned24h = async function(btn) {
      if (!confirm('Clean up and delete all abandoned checkouts older than 24 hours?')) return;
      if (btn) { btn.disabled = true; btn.textContent = 'Cleaning...'; }
      try {
        var res = await fetch('/abandoned/delete?shop=' + encodeURIComponent('${shop}'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ olderThanHours: 24 })
        });
        var json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Cleanup failed');
        alert('Cleaned ' + (json.deletedCount || json.data?.deletedCount || 0) + ' old abandoned checkouts');
        window.loadAbandonedOrders(false);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = '🧹 Clean Older Than 24h'; }
      }
    };

    // Always pre-load abandoned orders in background to populate badge and overview banner
    window.loadAbandonedOrders(false);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChangeListeners);
    } else {
      initChangeListeners();
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": `frame-ancestors https://${shop} https://admin.shopify.com`
    }
  });
}
