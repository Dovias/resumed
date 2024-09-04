import {EOL} from "os";

import {z, getEntry} from "astro:content";
import {AstroError} from "astro/errors";
import type {AstroConfig} from "astro";

import {getResolvedAstroConfig} from "../astro/config";
import type {LocaleName} from "./astro/integration";

const localeMetadataSchema = z.object({
  "name": z.string().min(1),
  "iconPath": z.string().min(1)
}).readonly();

export function getRegisteredLocales ({i18n}: AstroConfig = getResolvedAstroConfig()) {
  if (!i18n) {
    throw new AstroError(
      "Failed to retrieve all registered locale",
      "Missing i18n astro configuration section in the provided Astro configuration object"
    );
  }

  return i18n.locales;
}

export function getLocaleEntry (locale: LocaleName, id: string) {
  return getEntry("locale", `${locale}/${id}`);
}

export async function loadLocaleMetadata (locale: LocaleName) {
  const metadataEntry = await getLocaleEntry(locale, "metadata");
  try {
    if (!metadataEntry) {
      throw new Error(`'${locale}' locale metadata was not found`);
    }
    return localeMetadataSchema.parse(metadataEntry.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AstroError(
        `Failed to parse locale metadata! (locale: '${locale}')`,
        error.errors.map(issue => `${issue.message} (path: '${issue.path.join(".")}')`).join(EOL));
    } else if (error instanceof Error) {
      throw new AstroError(`Failed to load locale data!`, error.message);
    }
    throw error;
  }
}