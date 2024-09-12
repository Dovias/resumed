import {defineConfig} from "astro/config";

import {contentCollectionLocales} from "./src/locale/astro/integration";

import cssnanoPlugin from "cssnano";

export default defineConfig({
  "integrations": [
    contentCollectionLocales({
      "defaultLocale": "en",
      "routing": {
        "redirectToDefaultLocale": true,
        "prefixDefaultLocale": true,
        "fallbackType": "redirect"
      }
    })
  ],
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