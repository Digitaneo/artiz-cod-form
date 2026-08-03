import crypto from "node:crypto";

export function generateNonce() {
    return crypto.randomBytes(16).toString("hex");
}

export function buildInstallUrl(shop, env, nonce) {

    const scopes = env.SCOPES;

    const redirectUri =
        `${env.APP_URL}/callback`;

    return `https://${shop}/admin/oauth/authorize?client_id=${env.SHOPIFY_API_KEY}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}`;
}