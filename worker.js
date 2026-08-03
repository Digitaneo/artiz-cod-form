import { settingsSaveRoute } from "./routes/settings-save.js";
import { settingsGetRoute } from "./routes/settings-get.js";
import { healthRoute } from "./routes/health.js";
import { installRoute } from "./routes/install.js";
import { callbackRoute } from "./routes/callback.js";

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    switch (url.pathname) {


      case "/settings/save-test":

    return settingsSaveRoute(
        new Request(request.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                shop: "iuq7xa-0g.myshopify.com",

                settings: {

                    country: "SA",

                    currency: "SAR",

                    shippingPrice: 25,

                    freeShippingFrom: 200,

                    orderTag: "Artiz COD",

                    checkoutPage: "/pages/checkout"

                }

            })

        }),

        env

    );
    

      // ==========================================
      // api Check
      // ==========================================
      case "/settings/save":

        return settingsSaveRoute(request, env);

      // ==========================================
      // kv Check
      // ==========================================

      case "/settings":
         return settingsGetRoute(request, env);

      // ==========================================
      // Health Check
      // ==========================================

      case "/health":
        return healthRoute(request, env);

      // ==========================================
      // Shopify Install
      // ==========================================

      case "/install":
        return installRoute(request, env);

      // ==========================================
      // Shopify OAuth Callback
      // ==========================================

      case "/callback":
        return callbackRoute(request, env);

      // ==========================================
      // KV Test
      // ==========================================

      case "/kv-test": {

        await env.SHOPIFY_CONFIG.put("test", "hello");

        const value = await env.SHOPIFY_CONFIG.get("test");

        return Response.json({
          ok: true,
          value
        });

      }
      case "/kv-list": {

      const list = await env.SHOPIFY_CONFIG.list();

      return Response.json(list);

  }

      // ==========================================
      // 404
      // ==========================================

      default:

        return Response.json(
          {
            ok: false,
            error: "Route not found"
          },
          {
            status: 404
          }
        );

    }

  }

};