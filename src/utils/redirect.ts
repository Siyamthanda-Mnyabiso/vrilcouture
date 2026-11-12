// src/utils/redirect.ts

/**
 * Reads the `redirect` query parameter and returns it only if it is a safe,
 * internal path (starts with a single "/"). Anything else falls back, which
 * stops the login page being used to bounce people to another website.
 */
export function getSafeRedirect(search: string, fallback = '/'): string {
    const target = new URLSearchParams(search).get('redirect');
    if (!target) return fallback;
    if (!target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) {
        return fallback;
    }
    return target;
}
