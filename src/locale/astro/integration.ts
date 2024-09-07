import {lstatSync, readdirSync} from "fs";
import {fileURLToPath} from "url";
import {join} from "path";

import type {AstroConfig, AstroIntegration} from "astro";
import {AstroError} from "astro/errors";

import {resolvedAstroConfig, getResolvedAstroConfig} from "../../astro/config/integration";

type AstroUpdateConfig = Parameters<Parameters<Required<AstroIntegration["hooks"]>["astro:config:setup"]>[0]["updateConfig"]>[0];

const integrationName = "content-collection-locales";
export function contentCollectionLocales (options?: AstroUpdateConfig["i18n"]): AstroIntegration {
  return {
    "name": integrationName,
    "hooks": {
      "astro:config:setup": (hookOptions) => {
        hookOptions.updateConfig({
          "integrations": [
            resolvedAstroConfig()
          ],
          "i18n": {
            "locales": getContentLocales(hookOptions.config)
          } 
        });

        if (options) {
          hookOptions.updateConfig({"i18n": options});
        }
      }
    }
  };
}

export function getContentLocales (config: AstroConfig = getResolvedAstroConfig()) {
  const localePath = join(fileURLToPath(config.srcDir), "content", "locale");
  let files;
  try {
    files = readdirSync(localePath);
  } catch {
    throw new AstroError(`Failed to load locale collection '${name}'`, `Ensure that such locale collection exists within '${localePath}' path`);
  }
  return files.filter(file => lstatSync(join(localePath, file)).isDirectory());
}