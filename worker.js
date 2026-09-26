// Artiz COD Form - Cloudflare Worker Engine
// Automated Build Verification
import { publicCheckoutRoute } from "./routes/public-checkout.js";
import { publicOrderDetailsRoute } from "./routes/public-order-details.js";
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

import { handleCors, applyCorsHeaders } from "./middleware/cors.js";
import { authMiddleware } from "./middleware/auth.js";
import { handleGlobalError } from "./middleware/errors.js";
import { Logger } from "./middleware/logger.js";
import { successResponse, errorResponse } from "./middleware/response.js";
import { ROUTE_PATHNAMES } from "./config/routes.js";

export default {
  async fetch(request, env) {
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
          response = await publicCheckoutRoute(request, env);
          break;

        case ROUTE_PATHNAMES.PUBLIC_ORDER_DETAILS:
          response = await publicOrderDetailsRoute(request, env);
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