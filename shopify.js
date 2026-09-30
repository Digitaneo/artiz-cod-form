import { ShopifyService } from "./services/shopify.service.js";

export function getShopifyAdminUrl(shop) {
  return `https://${shop}/admin/api/2026-07/graphql.json`;
}

export async function adminRequest(shop, query, variables = {}, env) {
  const shopifyService = new ShopifyService(env);
  return shopifyService.adminRequest(shop, query, variables);
}