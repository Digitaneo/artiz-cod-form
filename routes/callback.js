import { exchangeCodeForToken } from "../oauth.js";

export async function callbackRoute(request, env) {

    try {

        const url = new URL(request.url);

        const shop = url.searchParams.get("shop");
        const code = url.searchParams.get("code");

        if (!shop || !code) {

            return Response.json({
                ok: false,
                error: "Missing shop or code"
            }, {
                status: 400
            });

        }

        const token = await exchangeCodeForToken(
            shop,
            code,
            env
        );

        await env.SHOPIFY_CONFIG.put(

            shop,

            JSON.stringify({

                shop,

                accessToken: token.access_token,

                installedAt: Date.now(),

                settings: {}

            })

        );

        return new Response(

            `<h2>✅ App Installed Successfully</h2>
             <p>${shop}</p>`,

            {

                headers: {

                    "Content-Type": "text/html"

                }

            }

        );

    }

    catch (e) {

        return Response.json({

            ok: false,

            error: e.message

        }, {

            status: 500

        });

    }

}