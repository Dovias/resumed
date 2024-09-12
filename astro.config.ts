import {defineConfig} from "astro/config";

import {contentCollectionLocales} from "./src/locale/astro/integration";

import cssnano from "cssnano";

// @ts-expect-error @csstools/postcss-sass does not have type declarations
import sass from "@csstools/postcss-sass";

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
          cssnano()
        ]
      }
    }
  }
});