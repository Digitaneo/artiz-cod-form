export async function healthRoute(request, env){

    return Response.json({

        ok:true,

        service:"artiz-cod-form",

        apiKey:!!env.SHOPIFY_API_KEY,

        apiSecret:!!env.SHOPIFY_API_SECRET,

        appUrl:!!env.APP_URL,

        appSecret:!!env.APP_SECRET,

        kv:!!env.SHOPIFY_CONFIG

    });

}