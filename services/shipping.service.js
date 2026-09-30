import { ShippingRepository } from "../repositories/shipping.repository.js";
import { ShopifyService } from "./shopify.service.js";

export class ShippingService {
  constructor(env) {
    this.env = env;
    this.repo = new ShippingRepository(env);
    this.shopifyService = new ShopifyService(env);
  }

  async getConfig(shop) {
    return await this.repo.getShippingConfig(shop);
  }

  async saveConfig(shop, config) {
    return await this.repo.saveShippingConfig(shop, config);
  }

  /**
   * Calculates applicable shipping methods and cost for a given cart and customer location.
   */
  async calculateShipping(shop, { subtotal = 0, country = "", region = "", city = "", area = "", methodId = "" }) {
    const config = await this.getConfig(shop);
    const general = config.general || {};

    const numSubtotal = Number(subtotal || 0);
    const threshold = Number(general.freeShippingThreshold || 0);
    const isFree = general.freeShippingEnabled && threshold > 0 && numSubtotal >= threshold;

    if (isFree) {
      return {
        isFree: true,
        selectedMethod: {
          id: "free",
          title: general.freeShippingText || "مجاناً (توصيل مجاني)",
          price: 0
        },
        methods: [
          {
            id: "free",
            title: general.freeShippingText || "مجاناً (توصيل مجاني)",
            price: 0
          }
        ],
        freeShippingThreshold: threshold,
        amountNeededForFree: 0
      };
    }

    // Look for regional rate match
    const rates = Array.isArray(config.rates) ? config.rates : [];
    let matchedRate = null;

    // Normalization helper
    const norm = (str) => String(str || "").trim().toLowerCase();
    const cNorm = norm(country);
    const rNorm = norm(region);
    const ciNorm = norm(city);
    const aNorm = norm(area);

    // Specificity search: Area -> City -> Region -> Country
    if (aNorm) {
      matchedRate = rates.find(r => norm(r.area) === aNorm && (!r.city || norm(r.city) === ciNorm));
    }
    if (!matchedRate && ciNorm) {
      matchedRate = rates.find(r => norm(r.city) === ciNorm && (!r.region || norm(r.region) === rNorm));
    }
    if (!matchedRate && rNorm) {
      matchedRate = rates.find(r => norm(r.region) === rNorm);
    }
    if (!matchedRate && cNorm) {
      matchedRate = rates.find(r => norm(r.countryCode) === cNorm || norm(r.country) === cNorm);
    }

    let methods = [];

    if (matchedRate) {
      if (matchedRate.customRates && String(matchedRate.customRates).includes(":")) {
        // e.g. "Standard:50|Express:100|Overnight:200" or "Home:40|Desk:25"
        const parts = String(matchedRate.customRates).split("|");
        methods = parts.map((p, idx) => {
          const [title, price] = p.split(":");
          return {
            id: `custom_${idx}`,
            title: title.trim(),
            price: Number(price.trim() || 0)
          };
        });
      } else if (matchedRate.cost !== undefined && matchedRate.cost !== null && matchedRate.cost !== "") {
        methods = [
          {
            id: "standard",
            title: matchedRate.title || general.defaultTitle || "توصيل قياسي",
            price: Number(matchedRate.cost)
          }
        ];
      }
    }

    // Fallback to default store methods
    if (methods.length === 0) {
      if (Array.isArray(general.defaultMethods) && general.defaultMethods.length > 0) {
        methods = general.defaultMethods.map(m => ({ ...m }));
      } else {
        methods = [
          {
            id: "default",
            title: general.defaultTitle || "توصيل سريع لجميع المدن",
            price: Number(general.defaultRate || 30)
          }
        ];
      }
    }

    // Determine active selected method
    let selected = methods.find(m => m.id === methodId) || methods[0];

    const amountNeeded = Math.max(0, threshold - numSubtotal);

    return {
      isFree: false,
      selectedMethod: selected,
      methods,
      freeShippingThreshold: threshold,
      amountNeededForFree: amountNeeded
    };
  }

  /**
   * Parses CSV string adhering to:
   * Country_code,Region,City,Area,Rate_or_extra,Cost,Custom_rates
   */
  async importCsv(shop, csvText) {
    if (!csvText || typeof csvText !== "string") {
      throw new Error("Invalid CSV content.");
    }

    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error("CSV has no data rows.");
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[\"\'\s]/g, "_"));
    const countryIdx = headers.findIndex(h => h.includes("country"));
    const regionIdx = headers.findIndex(h => h.includes("region"));
    const cityIdx = headers.findIndex(h => h.includes("city"));
    const areaIdx = headers.findIndex(h => h.includes("area"));
    const rateOrExtraIdx = headers.findIndex(h => h.includes("rate") || h.includes("extra"));
    const costIdx = headers.findIndex(h => h.includes("cost") || h.includes("price"));
    const customRatesIdx = headers.findIndex(h => h.includes("custom"));

    const newRates = [];

    for (let i = 1; i < lines.length; i++) {
      const rowLine = lines[i];
      // Handle commas inside quotes
      const row = [];
      let inQuote = false;
      let curVal = "";
      for (let c = 0; c < rowLine.length; c++) {
        const char = rowLine[c];
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          row.push(curVal.trim());
          curVal = "";
        } else {
          curVal += char;
        }
      }
      row.push(curVal.trim());

      const countryCode = countryIdx !== -1 ? row[countryIdx] : "";
      const region = regionIdx !== -1 ? row[regionIdx] : "";
      const city = cityIdx !== -1 ? row[cityIdx] : "";
      const area = areaIdx !== -1 ? row[areaIdx] : "";
      const rateType = rateOrExtraIdx !== -1 ? row[rateOrExtraIdx] : "rate";
      const cost = costIdx !== -1 && row[costIdx] !== "" ? Number(row[costIdx]) : null;
      const customRates = customRatesIdx !== -1 ? row[customRatesIdx] : "";

      if (countryCode || region || city || area || customRates || cost !== null) {
        newRates.push({
          countryCode: countryCode || "MA",
          region: region || "",
          city: city || "",
          area: area || "",
          rateType: rateType || "rate",
          cost: cost !== null ? cost : undefined,
          customRates: customRates || ""
        });
      }
    }

    const config = await this.getConfig(shop);
    config.rates = newRates;
    return await this.saveConfig(shop, config);
  }

  /**
   * Imports shipping options configured in Shopify Admin
   */
  async importFromShopify(shop) {
    try {
      const restData = await this.shopifyService.restRequest(shop, "shipping_zones.json", "GET");
      const zones = restData?.shipping_zones || [];
      const newRates = [];
      let defaultFlat = 30;
      let freeThreshold = 0;
      let defaultTitle = "توصيل سريع لجميع المدن";

      zones.forEach(zone => {
        const weightRates = zone.weight_based_shipping_rates || [];
        const priceRates = zone.price_based_shipping_rates || [];

        priceRates.forEach(pr => {
          defaultTitle = pr.name || defaultTitle;
          const ratePrice = Number(pr.price || 0);
          if (ratePrice > 0) defaultFlat = ratePrice;
          if (ratePrice === 0 && Number(pr.min_order_subtotal || 0) > 0) {
            freeThreshold = Number(pr.min_order_subtotal);
          }
        });

        // Add countries/provinces if available
        (zone.countries || []).forEach(country => {
          (country.provinces || []).forEach(prov => {
            newRates.push({
              countryCode: country.code || "MA",
              region: prov.name || "",
              city: "",
              area: "",
              rateType: "rate",
              cost: defaultFlat,
              customRates: ""
            });
          });
        });
      });

      const config = await this.getConfig(shop);
      if (defaultFlat > 0) config.general.defaultRate = defaultFlat;
      if (defaultTitle) config.general.defaultTitle = defaultTitle;
      if (freeThreshold > 0) {
        config.general.freeShippingEnabled = true;
        config.general.freeShippingThreshold = freeThreshold;
      }
      if (newRates.length > 0) {
        config.rates = newRates;
      }

      config.syncedFromShopifyAt = new Date().toISOString();
      return await this.saveConfig(shop, config);
    } catch (err) {
      console.warn("Failed to import from Shopify shipping zones:", err?.message);
      // Still return the current config without throwing
      return await this.getConfig(shop);
    }
  }
}
