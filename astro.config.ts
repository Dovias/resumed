import {defineConfig} from "astro/config";

import {contentCollectionLocales} from "./src/locale/astro/integration";

// @ts-expect-error @csstools/postcss-sass does not have type declarations
import sass from "@csstools/postcss-sass";

import _postcssMergePlus from "postcss-merge-rules-plus";

// @ts-expect-error @hail2u/css-mqpacker does not have type declarations
import mediaQueryPacker from "@hail2u/css-mqpacker";


import cssnano from "cssnano";

/*
 * Due to TypeScript's strict handling of ESM-to-CommonJS transpilation,
 * the `default` export is placed on `module.exports.default` instead of directly on `module.exports`.
 * This causes issues in modern environments (e.g., Vite) that expect CommonJS exports.
 * The type declaration is also incorrect, so we need to manually extract the default property
 * to properly call the plugin creator function.
 */
const {"default": postcssMergePlus} = _postcssMergePlus as unknown as {
  "default": typeof _postcssMergePlus;
};

export default defineConfig({
  "integrations": [
    contentCollectionLocales({
      "defaultLocale": "en",
      "locales": ["es"],
      "routing": {
        "redirectToDefaultLocale": true,
        "prefixDefaultLocale": true,
        "fallbackType": "redirect"
      }
    })
  ],
  "build": {
    "assets": "assets"
  },
  "vite": {
    "build": {
      // Disable built-in css minifying, since this project uses better postcss cssnano plugin minifying:
      "cssMinify": false,
      "assetsInlineLimit": 0
    },
    "css": {
      "postcss": {
        "plugins": [
          sass(),
          mediaQueryPacker(),
          postcssMergePlus(),
          cssnano()
        ]
      }
    }
  }
});