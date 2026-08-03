import { buildInstallUrl, generateNonce } from "../auth.js";

export async function installRoute(request, env) {

    const url = new URL(request.url);

    const shop = url.searchParams.get("shop");

    if (!shop) {

        return Response.json({

            ok: false,

            error: "Missing shop parameter"

        }, { status: 400 });

    }

    const nonce = generateNonce();

    const redirect =
        buildInstallUrl(shop, env, nonce);

    return Response.redirect(redirect, 302);

}