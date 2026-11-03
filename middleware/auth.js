import { getCurrentShop } from "../utils/session.js";
import { errorResponse } from "./response.js";
import { PERMISSIONS } from "../config/permissions.js";

export async function authMiddleware(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Public routes bypass authentication
  if (PERMISSIONS.PUBLIC_ROUTES.includes(pathname)) {
    return { ok: true, shop: null };
  }

  try {
    const shop = await getCurrentShop(request, env);

    return {
      ok: true,
      shop,
    };
  } catch (err) {
    const shopParam = url.searchParams.get("shop");
    if (
      shopParam &&
      /^[a-zA-Z0-9][a-zA-Z0-9\-]*(?:\.myshopify\.com|\.myshopify\.io)$/.test(shopParam) &&
      (pathname === "/settings/save" || pathname === "/shipping/save" || pathname === "/settings/tracking/save" || pathname === "/api/tracking")
    ) {
      const exists = await env.SHOPIFY_CONFIG?.get(shopParam);
      if (exists) {
        return { ok: true, shop: shopParam };
      }
    }

    return {
      ok: false,
      response: errorResponse(
        "Unauthorized: " + err.message,
        "UNAUTHORIZED",
        401
      ),
    };
  }
}