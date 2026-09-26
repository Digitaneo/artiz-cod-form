import { getCurrentShop } from "../utils/session.js";
import { KVRepository } from "../repositories/kv.repository.js";
import { ThemeService } from "../services/theme.service.js";
import { VERSION_CONFIG } from "../config/version.js";

export async function systemStatus(request, env) {
  let shop = "N/A";
  let sessionVerified = false;
  let accessTokenOk = false;
  let shopifyConnection = "UNKNOWN";

  try {
    shop = await getCurrentShop(request, env);
    sessionVerified = true;
  } catch {
    sessionVerified = false;
  }

  let kvOk = false;
  try {
    const kvRepo = new KVRepository(env);
    await kvRepo.put("health_test", "OK", { expirationTtl: 60 });
    const val = await kvRepo.get("health_test");
    kvOk = val === "OK";

    if (shop !== "N/A") {
      const config = await kvRepo.get(shop);
      if (config && config.accessToken) {
        accessTokenOk = true;
        shopifyConnection = "CONNECTED";
      }
    }
  } catch {
    kvOk = false;
  }

  const themeService = new ThemeService(env);
  const themeHealth = themeService.verifyThemeHealth();

  return {
    shop,
    worker: {
      status: "HEALTHY",
      version: VERSION_CONFIG.workerVersion,
      apiEngine: VERSION_CONFIG.shopifyApiVersion
    },
    security: {
      sessionVerification: sessionVerified ? "VERIFIED" : "UNVERIFIED",
      accessTokenStatus: accessTokenOk ? "ACTIVE" : "MISSING_OR_EXPIRED"
    },
    database: {
      kvStatus: kvOk ? "HEALTHY" : "ERROR"
    },
    shopify: {
      connection: shopifyConnection
    },
    themeExtension: {
      status: themeHealth.status,
      themeVersion: VERSION_CONFIG.themeVersion,
      extensionVersion: VERSION_CONFIG.extensionVersion,
      requiredAssets: themeHealth.assetsVerified,
      requiredAppBlocks: themeHealth.blocksVerified
    }
  };
}