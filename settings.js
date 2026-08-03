export async function getSettings(env, shop) {
  const data = await env.SHOPIFY_CONFIG.get(shop);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export async function saveSettings(env, shop, settings) {
  await env.SHOPIFY_CONFIG.put(
    shop,
    JSON.stringify(settings)
  );
}
