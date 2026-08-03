export async function settingsGetRoute(request, env) {

    const url = new URL(request.url);

    const shop = url.searchParams.get("shop");

    if (!shop) {

        return Response.json({

            ok: false,

            error: "Missing shop"

        }, {

            status: 400

        });

    }

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