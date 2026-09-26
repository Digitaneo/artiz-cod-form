export class Logger {
  static log(shop, endpoint, executionTimeMs, responseStatus, errors = null) {
    const logPayload = {
      timestamp: new Date().toISOString(),
      shop: shop || "N/A",
      endpoint,
      executionTimeMs: Math.round(executionTimeMs),
      responseStatus,
      errors: errors ? (errors.message || errors) : null
    };

    console.log(`[Artiz COD OS Log]`, JSON.stringify(logPayload));
    return logPayload;
  }
}
