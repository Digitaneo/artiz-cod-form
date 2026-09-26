export async function getCurrentShop(request) {

    const shop = request.headers.get("x-shopify-shop-domain");

    if (!shop) {
        throw new Error("Missing Shopify Shop");
    }

    return shop;

}