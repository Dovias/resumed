import {EOL} from "os";

import {z, getEntry} from "astro:content";
import {AstroError} from "astro/errors";

export type LocaleName = string;
export type LocaleEntryId = string;

export const iconSchema = z.object({
  "path": z.string().min(1),
  "description": z.string().nullish()
});

export const localeMetadataSchema = z.object({
  "name": z.string().min(1),
  "icon": iconSchema
}).readonly();

export function getLocaleEntry (locale: LocaleName, id: LocaleEntryId, ...ids: LocaleEntryId[]) {
  return getEntry("locale", [locale, id, ...ids].join("/"));
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