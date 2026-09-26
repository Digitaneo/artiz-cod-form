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