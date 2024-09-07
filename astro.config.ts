import {defineConfig} from "astro/config";

import tailwind from "@astrojs/tailwind";

import {contentCollectionLocales} from "./src/locale/astro/integration";

export default defineConfig({
  "integrations": [
    tailwind(),
    contentCollectionLocales({
      "defaultLocale": "en",
      "routing": {
        "redirectToDefaultLocale": true,
        "prefixDefaultLocale": true,
        "fallbackType": "redirect"
      }
    })
  ]
});