export function buildOAuthUrl(shop, redirectUri, state) {
  const params = new URLSearchParams({
    client_id: 'placeholder-client-id',
    scope: 'read_products,write_orders,read_customers',
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
  });

  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}
