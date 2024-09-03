import type {AstroConfig, AstroIntegration } from "astro";
import { AstroError } from "astro/errors";

const store = globalThis as typeof globalThis & {
  _resolvedAstroConfig: AstroConfig
}

const integrationName = "resolved-config";
export function resolvedAstroConfig(): AstroIntegration {
  return {
    "name": integrationName,
    "hooks": {
      "astro:config:done": ({config}) => {
        store._resolvedAstroConfig = config;
      }
    }
  }
}

export function getResolvedAstroConfig() {
  const config = store._resolvedAstroConfig;
  if (config == undefined) {
    throw new AstroError(
      `Failed to retrieve resolved Astro project configuration!`,
      `Function is being called in midst of resolving process, or the Astro's '${integrationName}' integration is not being applied to the project properly`
    );
  }

  return store._resolvedAstroConfig;
}