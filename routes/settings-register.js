import { getCurrentShop } from "../utils/session.js";

export async function settingsRegisterRoute(request, env) {
  try {
    const shop = await getCurrentShop(request, env);
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return Response.json(
        { ok: false, error: "Missing accessToken in request body" },
        { status: 400 }
      );
    }

    const oldData = await env.SHOPIFY_CONFIG.get(shop);
    let config = {};

    if (oldData) {
      try {
        config = typeof oldData === "string" ? JSON.parse(oldData) : oldData;
      } catch {
        config = { settings: {} };
      }
    } else {
      config = {
        shop,
        installedAt: Date.now(),
        settings: {}
      };
    }

    config.accessToken = accessToken;
    config.shop = shop;

    await env.SHOPIFY_CONFIG.put(shop, JSON.stringify(config));

    return Response.json({
      ok: true,
      config
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message || "Registration failed" },
      { status: 500 }
    );
  }
}
