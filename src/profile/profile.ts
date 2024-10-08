import {EOL} from "os";

import {AstroError} from "astro/errors";
import {getEntry, type DataEntryMap} from "astro:content";
import {z} from "astro/zod";

import {deepMerge} from "../utilities/object";
import {type ContentLocaleName, iconSchema, getContentLocaleData} from "../locale";
import type {localeContentCollection} from "../locale/astro/integration";

export const profilesContentCollection = "profiles" as const satisfies keyof DataEntryMap;

export type ContentProfilePath = Split<keyof DataEntryMap[typeof profilesContentCollection], "/">;


const nonEmptyStringSchema = z.string().min(1);
const nonEmptyStringNonEmptyArraySchema = nonEmptyStringSchema.array().nonempty();

const nullishNonEmptyStringSchema = nonEmptyStringSchema.nullish();
const defaultBooleanSchema = z.boolean().default(true);
const dateSchema = z.date();

export const profileSchema = z.object({
  "names": nonEmptyStringNonEmptyArraySchema,
  "role": nonEmptyStringSchema,
  "picture": z.object({
    "path": nonEmptyStringSchema,
    "description": nullishNonEmptyStringSchema
  }).readonly(),
  "contact": z.object({
    "label": nonEmptyStringSchema,
    "entries": z.record(z.object({
      "label": nullishNonEmptyStringSchema,
      "url": nonEmptyStringSchema.url().transform(url => new URL(url)),
      "newInstance": defaultBooleanSchema,
      "icon": iconSchema.readonly()
    })).readonly(),
    "qr": z.object({
      "enabled": defaultBooleanSchema,
      "description": nonEmptyStringSchema
    }).readonly()
  }),
  "aspects": z.record(z.object({
    "label": nonEmptyStringSchema,
    "entries": z.record(z.object({
      "label": nonEmptyStringSchema,
      "icon": iconSchema.readonly()
    })).readonly()
  })),
  "timelines": z.record(z.object({
    "label": nonEmptyStringSchema,
    "entries": z.record(z.object({
      "label": nonEmptyStringSchema,
      "highlights": z.object({
        "label": nonEmptyStringSchema,
        "entries": nonEmptyStringNonEmptyArraySchema
      }).nullish(),
      "timespan": z.object({
        "from": dateSchema,
        "to": dateSchema.nullish()
      }).transform((transform) => {
        const to = transform.to;
        const from = transform.from;
        if (to != undefined && from > to) {
          transform.from = to;
          transform.to = from;
        }
        
        return transform;
      }).readonly()
    })).readonly()
  }))
}).readonly();

export type Profile = z.infer<typeof profileSchema>;

export type ContentLocaleProfileName<
  L extends ContentLocaleName,
  S = keyof DataEntryMap[typeof localeContentCollection]
> = S extends `${L}/${typeof profilesContentCollection}/${infer N}` ? N : never;
 
export type ContentLocalizedProfileName<
  L extends ContentLocaleName,
  V = keyof DataEntryMap[typeof profilesContentCollection]
> = V extends ContentLocaleProfileName<L> ? ContentLocaleProfileName<L> : never;

export async function getContentProfileData (...ids: ContentProfilePath) {
  return (await getEntry(profilesContentCollection, ids.join("/")))?.data;
}

export async function loadContentLocalizedProfile<T extends ContentLocaleName> (locale?: T, profile: ContentLocalizedProfileName<T> = "default" as ContentLocalizedProfileName<T>) {
  const profileEntry = await getContentProfileData(profile as ContentLocalizedProfileName<ContentLocaleName>);
  try {
    if (!profileEntry) {
      throw new Error(`Profile '${profile}' was not found`);
    }

    if (locale) {
      const localeEntry = await getContentLocaleData(locale, profilesContentCollection, profile as ContentLocalizedProfileName<ContentLocaleName>);
      if (!localeEntry) {
        throw new Error(`Locale '${locale}' for profile '${profile}' was not found`);
      }

      deepMerge(profileEntry, localeEntry);
    }

    return profileSchema.parse(profileEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AstroError(
        `Failed to parse profile data! (profile: '${profile}')`,
        error.errors.map(issue => `${issue.message} (path: '${issue.path.join(".")}')`).join(EOL));
    } else if (error instanceof Error) {
      throw new AstroError(`Failed to load profile data!`, error.message);
    }
    throw error;
  }
}