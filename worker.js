// Aladdin Quick Order - Dedicated Cloudflare Worker Engine (Production v1.0.1)
// Automated Build Verification
import { publicCheckoutRoute } from "./routes/public-checkout.js";
import { publicOrderDetailsRoute } from "./routes/public-order-details.js";
import { publicFormConfigRoute } from "./routes/public-form-config.js";
import { dashboardSummary } from "./routes/dashboard-summary.js";
import { currentShop } from "./routes/current-shop.js";
import { systemStatus } from "./routes/system-status.js";
import { ordersListRoute } from "./routes/orders-list.js";
import { settingsSaveRoute } from "./routes/settings-save.js";
import { settingsGetRoute } from "./routes/settings-get.js";
import { settingsRegisterRoute } from "./routes/settings-register.js";
import { healthRoute } from "./routes/health.js";
import { installRoute } from "./routes/install.js";
import { callbackRoute } from "./routes/callback.js";
import { getOpenApiSpec } from "./routes/docs.js";
import { shippingRatesGetRoute } from "./routes/shipping-rates-get.js";
import { shippingRatesSaveRoute } from "./routes/shipping-rates-save.js";
import { shippingImportCsvRoute } from "./routes/shipping-import-csv.js";
import { shippingImportShopifyRoute } from "./routes/shipping-import-shopify.js";
import { publicShippingCalculateRoute } from "./routes/public-shipping-calculate.js";
import { webhooksWaylRoute } from "./routes/webhooks-wayl.js";
import { dashboardEmbeddedRoute } from "./routes/dashboard-embedded.js";
import { dashboardWeeklySalesRoute } from "./routes/dashboard-weekly-sales.js";
import { abandonedListRoute } from "./routes/abandoned-list.js";
import { abandonedConvertRoute } from "./routes/abandoned-convert.js";
import { abandonedStatusRoute } from "./routes/abandoned-status.js";
import { abandonedDeleteRoute } from "./routes/abandoned-delete.js";
import { publicValidateCouponRoute } from "./routes/public-validate-coupon.js";
import { settingsTrackingGetRoute, settingsTrackingSaveRoute } from "./routes/settings-tracking.js";

import { handleCors, applyCorsHeaders } from "./middleware/cors.js";
import { authMiddleware } from "./middleware/auth.js";
import { handleGlobalError } from "./middleware/errors.js";
import { Logger } from "./middleware/logger.js";
import { successResponse, errorResponse } from "./middleware/response.js";
import { ROUTE_PATHNAMES } from "./config/routes.js";

export default {
  async fetch(request, env, ctx) {
    const startTime = Date.now();

    // 1. CORS Preflight
    const corsPreflight = handleCors(request);
    if (corsPreflight) return corsPreflight;

    const url = new URL(request.url);
    let shop = "N/A";
    let response;

    try {
      // 2. Auth Middleware — gates all non-public routes
      const auth = await authMiddleware(request, env);
      if (!auth.ok) {
        return applyCorsHeaders(auth.response);
      }
      if (auth.shop) shop = auth.shop;

      // 3. Route Dispatcher
      switch (url.pathname) {
        case ROUTE_PATHNAMES.PUBLIC_CHECKOUT:
          response = await publicCheckoutRoute(request, env, ctx);
          break;

        case ROUTE_PATHNAMES.PUBLIC_ORDER_DETAILS:
          response = await publicOrderDetailsRoute(request, env);
          break;

        case ROUTE_PATHNAMES.PUBLIC_FORM_CONFIG:
          response = await publicFormConfigRoute(request, env);
          break;

        case ROUTE_PATHNAMES.DASHBOARD_SUMMARY:
          response = await dashboardSummary(request, env);
          break;

        case ROUTE_PATHNAMES.CURRENT_SHOP:
          response = await currentShop(request, env);
          break;

        case ROUTE_PATHNAMES.ORDERS_LIST:
          response = await ordersListRoute(request, env);
          break;

        case ROUTE_PATHNAMES.SYSTEM_STATUS: {
          const statusData = await systemStatus(request, env);
          shop = statusData.shop || shop;
          response = successResponse(statusData);
          break;
        }

        case ROUTE_PATHNAMES.SETTINGS_SAVE:
          response = await settingsSaveRoute(request, env);
          break;

        case ROUTE_PATHNAMES.SETTINGS_GET:
          response = await settingsGetRoute(request, env);
          break;

        case ROUTE_PATHNAMES.SETTINGS_REGISTER:
          response = await settingsRegisterRoute(request, env);
          break;

        case ROUTE_PATHNAMES.HEALTH:
          response = await healthRoute(request, env);
          break;

        case ROUTE_PATHNAMES.INSTALL:
          response = await installRoute(request, env);
          break;

        case ROUTE_PATHNAMES.CALLBACK:
          response = await callbackRoute(request, env);
          break;

        case ROUTE_PATHNAMES.DOCS_OPENAPI:
          response = successResponse(getOpenApiSpec());
          break;

        case ROUTE_PATHNAMES.SHIPPING_GET:
          response = await shippingRatesGetRoute(request, env);
          break;

        case ROUTE_PATHNAMES.SHIPPING_SAVE:
          response = await shippingRatesSaveRoute(request, env);
          break;

        case ROUTE_PATHNAMES.SHIPPING_IMPORT_CSV:
          response = await shippingImportCsvRoute(request, env);
          break;

        case ROUTE_PATHNAMES.SHIPPING_IMPORT_SHOPIFY:
          response = await shippingImportShopifyRoute(request, env);
          break;

        case ROUTE_PATHNAMES.PUBLIC_SHIPPING_CALCULATE:
          response = await publicShippingCalculateRoute(request, env);
          break;

        case ROUTE_PATHNAMES.WEBHOOK_WAYL:
          response = await webhooksWaylRoute(request, env);
          break;

        case ROUTE_PATHNAMES.DASHBOARD_WEEKLY_SALES:
          response = await dashboardWeeklySalesRoute(request, env);
          break;

        case ROUTE_PATHNAMES.ABANDONED_LIST:
          response = await abandonedListRoute(request, env);
          break;

        case ROUTE_PATHNAMES.ABANDONED_CONVERT:
          response = await abandonedConvertRoute(request, env);
          break;

        case ROUTE_PATHNAMES.ABANDONED_STATUS:
          response = await abandonedStatusRoute(request, env);
          break;

        case ROUTE_PATHNAMES.ABANDONED_DELETE:
          response = await abandonedDeleteRoute(request, env);
          break;

        case ROUTE_PATHNAMES.PUBLIC_VALIDATE_COUPON:
          response = await publicValidateCouponRoute(request, env);
          break;

        case ROUTE_PATHNAMES.TRACKING_GET:
          response = await settingsTrackingGetRoute(request, env);
          break;

        case ROUTE_PATHNAMES.TRACKING_SAVE:
          response = await settingsTrackingSaveRoute(request, env);
          break;

        case "/":
        case "":
        case "/overview":
        case "/abandoned-orders":
        case "/abandoned-checkouts":
        case "/form-builder":
        case "/shipping":
        case "/payment-methods":
        case "/fraud-prevention":
        case "/sales-booster":
        case "/integrations":
        case "/tracking":
          response = await dashboardEmbeddedRoute(request, env);
          break;

        case "/settings":
          if (request.headers.get("authorization") || request.headers.get("accept")?.includes("application/json")) {
            response = await settingsGetRoute(request, env);
          } else {
            response = await dashboardEmbeddedRoute(request, env);
          }
          break;

        default:
          response = errorResponse("Route not found", "NOT_FOUND", 404);
          break;
      }
    } catch (err) {
      response = handleGlobalError(err, request, shop, startTime);
    }

    // 4. Structured Logger — every request logged
    Logger.log(shop, url.pathname, Date.now() - startTime, response.status);

    // 5. Apply CORS headers to every response
    return applyCorsHeaders(response);
  },
};