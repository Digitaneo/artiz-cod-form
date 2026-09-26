import { VERSION_CONFIG } from "../config/version.js";

export function getOpenApiSpec() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Artiz COD OS Worker API",
      version: VERSION_CONFIG.workerVersion,
      description: "Internal Self-Documented OpenAPI 3.0 specification for Artiz COD OS Worker Backend."
    },
    paths: {
      "/public/checkout": {
        post: {
          summary: "Submit public COD checkout form",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shop: { type: "string" },
                    customer: { type: "object" },
                    items: { type: "array" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Order created successfully" }
          }
        }
      },
      "/public/order-details": {
        get: {
          summary: "Get order details for thank you page",
          parameters: [
            { name: "shop", in: "query", required: true },
            { name: "order_id", in: "query", required: true }
          ],
          responses: {
            "200": { description: "Order details returned" }
          }
        }
      },
      "/dashboard/summary": {
        get: {
          summary: "Unified Dashboard Summary metrics",
          responses: {
            "200": { description: "Dashboard summary returned" }
          }
        }
      },
      "/system/status": {
        get: {
          summary: "Health Monitor & Diagnostic Status",
          responses: {
            "200": { description: "Health monitor diagnostics returned" }
          }
        }
      }
    }
  };
}
