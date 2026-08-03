// ======================================================
// إنشاء رابط تثبيت التطبيق
// ======================================================

export function buildOAuthUrl(shop, env, state) {

    const redirectUri =
        `${env.APP_URL}/callback`;

    const params = new URLSearchParams({

        client_id: env.SHOPIFY_API_KEY,

        scope: env.SCOPES,

        redirect_uri: redirectUri,

        state,

        response_type: "code"

    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;

}


// ======================================================
// استبدال Code بـ Access Token
// ======================================================

export async function exchangeCodeForToken(

    shop,

    code,

    env

) {

    const response = await fetch(

        `https://${shop}/admin/oauth/access_token`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                client_id: env.SHOPIFY_API_KEY,

                client_secret: env.SHOPIFY_API_SECRET,

                code

            })

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(

            data.error ||

            JSON.stringify(data)

        );

    }

    return data;

}


// ======================================================
// التحقق من HMAC
// ======================================================

export async function verifyHmac(url, env) {

    const params = new URL(url).searchParams;

    const receivedHmac = params.get("hmac");

    params.delete("hmac");

    const message = [...params.entries()]

        .sort()

        .map(([k, v]) => `${k}=${v}`)

        .join("&");

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(

        "raw",

        encoder.encode(env.SHOPIFY_API_SECRET),

        {

            name: "HMAC",

            hash: "SHA-256"

        },

        false,

        ["sign"]

    );

    const signature = await crypto.subtle.sign(

        "HMAC",

        key,

        encoder.encode(message)

    );

    const calculated = [...new Uint8Array(signature)]

        .map(b =>

            b.toString(16).padStart(2, "0")

        )

        .join("");

    return calculated === receivedHmac;

}