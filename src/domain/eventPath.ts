// The event path is the URL segment seating-display is published under, e.g.
// https://vowsandvic.github.io/seating-display/<path>/. It travels in the exported data.json
// as `path`; seating-display's deploy workflow reads it and builds the site under that
// segment. Keep these rules in sync with the check in seating-display's deploy.yml.

export const DISPLAY_SITE_URL = 'https://vowsandvic.github.io/seating-display/';

export const EVENT_PATH_MAX = 64;

const VALID = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

/** True when `path` is a non-empty, URL-safe segment: lowercase a–z, 0–9 and inner hyphens. */
export function isValidEventPath(path: string): boolean {
  return VALID.test(path);
}

/** Coerces free typing into the allowed alphabet as the user types: lowercases, turns spaces
 * and underscores into hyphens, drops anything else, and collapses repeated hyphens. Leading
 * and trailing hyphens are kept while typing — call `finalizeEventPath` on blur/export. */
export function normalizeEventPathInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, EVENT_PATH_MAX);
}

/** Final form stored/exported: normalized with edge hyphens trimmed. May be '' (no path). */
export function finalizeEventPath(input: string): string {
  return normalizeEventPathInput(input).replace(/^-+|-+$/g, '');
}

/** Public URL of the display site for this path ('' → the site root). */
export function displayUrlFor(path: string): string {
  const p = finalizeEventPath(path);
  return p ? `${DISPLAY_SITE_URL}${p}/` : DISPLAY_SITE_URL;
}
