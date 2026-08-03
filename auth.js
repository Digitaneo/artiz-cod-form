export function generateNonce() {

    const bytes = crypto.getRandomValues(
        new Uint8Array(16)
    );

    return [...bytes]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");

}

export function buildInstallUrl(shop, env, nonce) {

    const redirect =
        `${env.APP_URL}/callback`;

    return `https://${shop}/admin/oauth/authorize?client_id=${env.SHOPIFY_API_KEY}&scope=${encodeURIComponent(env.SCOPES)}&redirect_uri=${encodeURIComponent(redirect)}&state=${nonce}`;

}