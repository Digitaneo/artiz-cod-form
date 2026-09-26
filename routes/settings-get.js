import { getCurrentShop } from "../utils/session.js";

export async function settingsGetRoute(request, env) {
  const shop = await getCurrentShop(request, env);


    const data = await env.SHOPIFY_CONFIG.get(shop);

    if (!data) {

        return Response.json({

            ok: false,

            error: "Shop not found"

        }, {

            status: 404

        });

    }

    return Response.json({

        ok: true,

        config: JSON.parse(data)

    });

}