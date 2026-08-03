export async function settingsSaveRoute(request, env) {

    const body = await request.json();

    const { shop, settings } = body;

    if (!shop) {

        return Response.json({

            ok: false,

            error: "Missing shop"

        }, {

            status: 400

        });

    }

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