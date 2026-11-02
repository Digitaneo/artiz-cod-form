// Route: /public/validate-coupon
// Validates discount codes against Shopify GraphQL API & store promo rules
import { ShopifyService } from "../services/shopify.service.js";
import { successResponse, errorResponse } from "../middleware/response.js";

const SHOPIFY_DISCOUNT_QUERY = `
query codeDiscountNodeByCode($code: String!) {
  codeDiscountNodeByCode(code: $code) {
    id
    codeDiscount {
      __typename
      ... on DiscountCodeBasic {
        title
        status
        startsAt
        endsAt
        customerGets {
          value {
            __typename
            ... on DiscountPercentage {
              percentage
            }
            ... on DiscountAmount {
              amount {
                amount
                currencyCode
              }
            }
          }
        }
      }
      ... on DiscountCodeBxgy {
        title
        status
      }
      ... on DiscountCodeFreeShipping {
        title
        status
      }
    }
  }
}
`;

export async function publicValidateCouponRoute(request, env) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const code = (url.searchParams.get("code") || "").trim().toUpperCase();

    if (!shop || !code) {
      return errorResponse("Shop domain and coupon code are required", "INVALID_PARAMS", 400);
    }

    // 1. Built-in promo codes (e.g. Abandoned Cart Recovery discount codes)
    if (code === "OFFER10" || code === "WELCOME10") {
      return successResponse({
        valid: true,
        code,
        type: "percentage",
        amount: 10,
        title: "خصم خاص 10%"
      }, 200);
    }

    // 2. Validate via Shopify Admin GraphQL API
    try {
      const shopifyService = new ShopifyService(env);
      const data = await shopifyService.adminRequest(shop, SHOPIFY_DISCOUNT_QUERY, { code });

      const discountNode = data?.data?.codeDiscountNodeByCode;
      if (discountNode && discountNode.codeDiscount) {
        const cd = discountNode.codeDiscount;
        if (cd.status === "ACTIVE") {
          const val = cd.customerGets?.value;
          if (val) {
            if (val.__typename === "DiscountPercentage" || val.percentage !== undefined) {
              const rawPct = Number(val.percentage);
              const pct = rawPct > 0 && rawPct <= 1 ? Math.round(rawPct * 100) : Math.round(rawPct);
              return successResponse({
                valid: true,
                code,
                type: "percentage",
                amount: pct,
                title: cd.title || `خصم ${pct}%`
              }, 200);
            }
            if (val.__typename === "DiscountAmount" || val.amount) {
              const fixedAmount = parseFloat(val.amount.amount || 0);
              return successResponse({
                valid: true,
                code,
                type: "fixed",
                amount: fixedAmount,
                title: cd.title || `خصم ${fixedAmount}`
              }, 200);
            }
          }

          return successResponse({
            valid: true,
            code,
            type: "percentage",
            amount: 10,
            title: cd.title || "خصم"
          }, 200);
        }
      }
    } catch (shopifyErr) {
      console.warn("Shopify coupon validation query error:", shopifyErr);
    }

    // 3. Invalid or not found
    return successResponse({
      valid: false,
      code,
      message: "كود الخصم غير صحيح أو منتهي الصلاحية"
    }, 200);
  } catch (err) {
    return errorResponse(err.message || "Failed to validate coupon", "COUPON_VALIDATION_ERROR", 500);
  }
}
