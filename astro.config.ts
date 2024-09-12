import {defineConfig} from "astro/config";

import {contentCollectionLocales} from "./src/locale/astro/integration";

import cssnanoPlugin from "cssnano";

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
      "cssMinify": false
    },
    "css": {
      "postcss": {
        "plugins": [
          cssnanoPlugin()
        ]
      }
    }
  }
});