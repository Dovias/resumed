import {lstatSync, readdirSync} from "fs";
import {fileURLToPath} from "url";
import {join} from "path";

import type {AstroConfig, AstroIntegration} from "astro";
import {AstroError} from "astro/errors";

import {resolvedAstroConfig} from "../../astro/config/integration";
import type {getEntry} from "astro:content";

type AstroUpdateConfig = Parameters<Parameters<Required<AstroIntegration["hooks"]>["astro:config:setup"]>[0]["updateConfig"]>[0];

interface IntegrationOptions {
  "collection"?: Parameters<typeof getEntry>[0];
  "i18n"?: AstroUpdateConfig["i18n"];
}

const integrationName = "content-collection-locales";
export function contentCollectionLocales ({i18n, collection}: IntegrationOptions): AstroIntegration {
  return {
    "name": integrationName,
    "hooks": {
      "astro:config:setup": (options) => {
        options.updateConfig({
          "integrations": [
            resolvedAstroConfig()
          ],
          "i18n": {
            "locales": getContentLocaleCodes(options.config, collection)
          } 
        });

        if (i18n) {
          options.updateConfig({i18n});
        }
      }
    }
  };
}

function getContentLocaleCodes (config: AstroConfig, collection: IntegrationOptions["collection"] = "locale") {
  const localePath = join(fileURLToPath(config.srcDir), "content", collection);
  let files;
  try {
    files = readdirSync(localePath);
  } catch {
    throw new AstroError(`Failed to load locale collection '${name}'`, `Ensure that such locale collection exists within '${localePath}' path`);
  }
  return files.filter(file => lstatSync(join(localePath, file)).isDirectory());
}