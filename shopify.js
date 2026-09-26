import { getSettings } from "./settings.js";

export function getShopifyAdminUrl(shop) {
  return `https://${shop}/admin/api/2026-07/graphql.json`;
}

export async function adminRequest(shop, query, variables = {}, env) {

  const settings = await getSettings(env, shop);

  if (!settings) {
    throw new Error("Shop not installed.");
  }

  if (!settings.accessToken) {
    throw new Error("Missing Shopify Access Token.");
  }

  const response = await fetch(
    getShopifyAdminUrl(shop),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": settings.accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json;
}