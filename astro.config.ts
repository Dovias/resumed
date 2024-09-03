import {defineConfig} from "astro/config";

import {contentCollectionLocales} from "./src/locale/astro/integration";

export default defineConfig({
  "integrations": [
    contentCollectionLocales({
      "i18n": {
        "defaultLocale": "en",
        "routing": {
          "redirectToDefaultLocale": true,
          "prefixDefaultLocale": true,
          "fallbackType": "redirect"
        }
      }
    })
  ]
});