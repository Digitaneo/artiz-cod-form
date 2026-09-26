import { getCurrentShop } from "../utils/session.js";

export async function settingsSaveRoute(request, env) {
  const shop = await getCurrentShop(request, env);
  const body = await request.json();
  const { settings } = body;


    const oldData = await env.SHOPIFY_CONFIG.get(shop);

    if (!oldData) {

        return Response.json({

            ok: false,

            error: "Shop not found"

        }, {

            status: 404

        });

    }

    const config = JSON.parse(oldData);

    config.settings = {

        ...config.settings,

        ...settings

    };

    await env.SHOPIFY_CONFIG.put(

        shop,

        JSON.stringify(config)

    );

    return Response.json({

        ok: true,

        config

    });

}