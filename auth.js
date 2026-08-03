export async function getAccessToken(env, shop) {
  const data = await env.SHOPIFY_CONFIG.get(shop);

  if (!data) {
    return null;
  }

  const config = JSON.parse(data);

  return config.access_token;
}
