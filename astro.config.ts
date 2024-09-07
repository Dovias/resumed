import {defineConfig} from "astro/config";

import {contentCollectionLocales} from "./src/locale/astro/integration";
import tailwind from "@astrojs/tailwind";

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