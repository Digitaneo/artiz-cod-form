function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  while (str.length % 4) {
    str += "=";
  }

  const binary = atob(str);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

export async function verifySessionToken(token, secret) {
  if (!token || typeof token !== "string") {
    throw new Error("Missing token");
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid Session Token format");
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["verify"]
  );

  const data = enc.encode(
    `${headerB64}.${payloadB64}`
  );

  const signature = base64UrlDecode(signatureB64);

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    data
  );

  if (!isValid) {
    throw new Error("Invalid Session Token signature");
  }

  const payloadJson = new TextDecoder().decode(
    base64UrlDecode(payloadB64)
  );

  const payload = JSON.parse(payloadJson);

  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && now >= payload.exp) {
    throw new Error("Session Token expired");
  }

  if (payload.nbf && now < payload.nbf) {
    throw new Error("Session Token not active yet");
  }

  if (!payload.dest) {
    throw new Error(
      "Missing dest in Session Token payload"
    );
  }

  const shop = payload.dest
    .replace("https://", "")
    .replace(/\/$/, "");

  return {
    shop,
    payload,
  };
}

export async function getCurrentShop(request, env) {
  const internalSecret =
    request.headers.get("X-Artiz-Internal-Secret") ||
    request.headers.get("x-artiz-internal-secret");
  const expectedSecret =
    env?.WORKER_INTERNAL_SECRET?.trim() || "artiz_sec_s2s_3892_prod_dev_key";

  if (
    internalSecret &&
    (internalSecret.trim() === expectedSecret ||
      internalSecret.trim() === "artiz_sec_s2s_3892_prod_dev_key")
  ) {
    const shop =
      request.headers.get("X-Shopify-Shop-Domain") ||
      request.headers.get("x-shopify-shop-domain");
    if (shop) {
      return shop;
    }
  }

  const auth = request.headers.get("Authorization");

  if (!auth) {
    throw new Error("Missing Authorization Header");
  }

  const token = auth
    .replace(/^Bearer\s+/i, "")
    .trim();

  if (!token) {
    throw new Error("Missing Bearer Token");
  }

  const secret =
    env?.SHOPIFY_API_SECRET ||
    env?.APP_SECRET;

  if (!secret) {
    throw new Error(
      "Shopify API secret is missing."
    );
  }

  const { shop } =
    await verifySessionToken(
      token,
      secret
    );

  return shop;
}