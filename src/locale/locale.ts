import {EOL} from "os";

import {type DataEntryMap, z, getEntry} from "astro:content";
import {AstroError} from "astro/errors";
import {localeContentCollection} from "./astro/integration";

export type ContentLocalePath = Split<keyof DataEntryMap[typeof localeContentCollection], "/">;
export type ContentLocaleName = ContentLocalePath[0];

export const iconSchema = z.object({
  "path": z.string().min(1),
  "description": z.string().nullish()
});

export const localeMetadataSchema = z.object({
  "name": z.string().min(1),
  "icon": iconSchema
}).readonly();

export function getContentLocaleEntry (...ids: ContentLocalePath) {
  return getEntry(localeContentCollection, ids.join("/"));
}

export async function loadContentLocaleMetadata (locale: ContentLocaleName) {
  const metadataEntry = await getContentLocaleEntry(locale, "metadata");
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