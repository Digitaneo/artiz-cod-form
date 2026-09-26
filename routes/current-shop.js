import { getCurrentShop } from "../utils/session.js";

export async function currentShop(request, env) {
  const shop = await getCurrentShop(request, env);

  return Response.json({
    ok: true,
    shop,
  });
}