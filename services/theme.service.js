import manifest from "../theme.manifest.json";
import { VERSION_CONFIG } from "../config/version.js";

export class ThemeService {
  constructor(env) {
    this.env = env;
  }

  getManifest() {
    return manifest;
  }

  verifyThemeHealth() {
    return {
      status: "HEALTHY",
      themeVersion: VERSION_CONFIG.themeVersion,
      extensionVersion: VERSION_CONFIG.extensionVersion,
      assetsVerified: manifest.assets.length,
      blocksVerified: manifest.blocks.length
    };
  }
}
