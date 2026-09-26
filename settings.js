export async function getSettings(env, shop) {

  const data = await env.SHOPIFY_CONFIG.get(shop);

  if (!data) return null;

  return JSON.parse(data);

}

export async function saveSettings(env, shop, settings) {

  const current = await getSettings(env, shop);

  await env.SHOPIFY_CONFIG.put(

    shop,

    JSON.stringify({

      ...current,

      ...settings,

    })

  );

}

export async function getShopifyAccessToken(shop, env) {

  const current = await getSettings(env, shop);

  return current?.accessToken || null;

}

export async function saveShopifyAccessToken(shop, accessToken, env) {

  const current = await getSettings(env, shop);

  await env.SHOPIFY_CONFIG.put(

    shop,

    JSON.stringify({

      ...current,

      accessToken,

    })

  );

}