import {lstatSync, readdirSync} from "fs";
import {fileURLToPath} from "url";
import {join} from "path";

import type {AstroConfig, AstroIntegration} from "astro";
import {AstroError} from "astro/errors";

import {resolvedAstroConfig} from "../../astro/config/integration";
import type {LocaleName} from "../locale";

type AstroUpdateConfig = Parameters<Parameters<Required<AstroIntegration["hooks"]>["astro:config:setup"]>[0]["updateConfig"]>[0];


interface IntegrationOptions {
  "collectionName"?: LocaleName;
  "i18n"?: AstroUpdateConfig["i18n"];
}

const integrationName = "content-collection-locales";
export function contentCollectionLocales ({i18n, collectionName}: IntegrationOptions): AstroIntegration {
  return {
    "name": integrationName,
    "hooks": {
      "astro:config:setup": (options) => {
        options.updateConfig({
          "integrations": [
            resolvedAstroConfig()
          ],
          "i18n": {
            "locales": getContentLocaleCodes(options.config, collectionName)
          } 
        });

        if (i18n) {
          options.updateConfig({i18n});
        }
      }
    }
  };
}

function getContentLocaleCodes (config: AstroConfig, name: LocaleName = "locale") {
  const localePath = join(fileURLToPath(config.srcDir), "content", name);
  let files;
  try {
    files = readdirSync(localePath);
  } catch {
    throw new AstroError(`Failed to load locale collection '${name}'`, `Ensure that such locale collection exists within '${localePath}' path`);
  }
  return files.filter(file => lstatSync(join(localePath, file)).isDirectory());
}