import { errorResponse } from "./response.js";
import { Logger } from "./logger.js";

export function handleGlobalError(error, request, shop = "N/A", startTime = Date.now()) {
  const executionTimeMs = Date.now() - startTime;
  const url = new URL(request.url);

  Logger.log(shop, url.pathname, executionTimeMs, 500, error);

  const message = error?.message || "Internal Server Error";
  const code = error?.code || "UNHANDLED_EXCEPTION";

  return errorResponse(message, code, 500);
}
