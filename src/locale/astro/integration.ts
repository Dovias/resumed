import {lstatSync, readdirSync} from "fs";
import {fileURLToPath} from "url";
import {join} from "path";

import type {AstroConfig, AstroIntegration} from "astro";
import {AstroError} from "astro/errors";

import {resolvedAstroConfig, getResolvedAstroConfig} from "../../astro/config/integration";
import type {DataEntryMap} from "astro:content";

type AstroUpdateConfig = Parameters<Parameters<Required<AstroIntegration["hooks"]>["astro:config:setup"]>[0]["updateConfig"]>[0];

export interface IntegrationOptions extends Pick<AstroUpdateConfig, "i18n"> {
  "collection"?: keyof DataEntryMap;
}

const store = global as typeof global & {
  "_resolvedLocaleCollection": IntegrationOptions["collection"];
};

const integrationName = "content-collection-locales";
export function contentCollectionLocales ({collection = "locale", i18n}: IntegrationOptions): AstroIntegration {
  store._resolvedLocaleCollection = collection;
  return {
    "name": integrationName,
    "hooks": {
      "astro:config:setup": (options) => {
        options.updateConfig({
          "integrations": [
            resolvedAstroConfig()
          ],
          "i18n": {
            "locales": getContentLocales(options.config)!
          } 
        });

        if (i18n) {
          options.updateConfig({i18n});
        }
      }
    }
  };
}

export function getContentLocaleCollection () {
  return store._resolvedLocaleCollection;
}

export function getContentLocales (config: AstroConfig = getResolvedAstroConfig()) {
  const localeCollection = getContentLocaleCollection();
  if (!localeCollection) {
    return;
  }

  const localePath = join(fileURLToPath(config.srcDir), "content", localeCollection);
  let files;
  try {
    files = readdirSync(localePath);
  } catch {
    throw new AstroError(`Failed to load locale collection '${name}'`, `Ensure that such locale collection exists within '${localePath}' path`);
  }
  return files.filter(file => lstatSync(join(localePath, file)).isDirectory());
}