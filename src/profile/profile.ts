import {EOL} from "os";

import {AstroError} from "astro/errors";
import {getEntry} from "astro:content";
import {z} from "astro/zod";

import {deepMerge} from "../utilities/object";

import {type LocaleName, getLocaleEntry} from "../locale";

const profileSchema = z.object({
  "contacts": z.object({
    "names": z.string().array().nonempty(),
    "role": z.string().min(1),
    "picture": z.object({
      "path": z.string().min(1),
      "description": z.string().nullish()
    }).readonly(),
    "telephoneNumber": z.string().regex(/^\+?[0-9]{1,15}$/g),
    "emailAddress": z.string().email(),
    "links": z.object({
      "entries": z.record(z.object({
        "path": z.string().min(1),
        "icon": z.object({
          "path": z.string().min(1),
          "description": z.string().nullish()
        }).readonly()
      })).readonly()
    }).readonly()
  }),
  "aspects": z.record(z.object({
    "name": z.string().min(1),
    "entries": z.record(z.object({
      "name": z.string().min(1),
      "icon": z.object({
        "path": z.string().min(1),
        "description": z.string().nullish()
      }).readonly()
    })).readonly()
  })),
  "timelines": z.record(z.object({
    "name": z.string().min(1),
    "entries": z.record(z.object({
      "name": z.string().min(1).nullish(),
      "type": z.string().min(1),
      "location": z.string().min(1),
      "description": z.string().min(1).nullish(),
      "timespan": z.object({
        "from": z.date(),
        "to": z.date().nullish()
      }).readonly()
    })).readonly()
  }))
}).readonly();

export type Profile = z.infer<typeof profileSchema>;
export type ProfileName = string;

export async function loadProfile (locale?: LocaleName, profile: ProfileName = "default") {
  const profileEntry = await getEntry("profiles", profile);
  try {
    if (!profileEntry) {
      throw new Error(`Profile '${profile}' was not found`);
    }

    if (locale) {
      const localeEntry = await getLocaleEntry(locale, `profiles/${profile}`);
      if (!localeEntry) {
        throw new Error(`Locale '${locale}' for profile '${profile}' was not found`);
      }

      deepMerge(profileEntry.data, localeEntry.data);
    }

    return profileSchema.parse(profileEntry.data);
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