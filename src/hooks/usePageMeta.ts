// Keeps the tab title, description and canonical link right while moving around
// the site. On a first visit api/page.ts has already put them in the page.
import { useEffect } from 'react';
import { DEFAULT_TITLE, SITE_URL, type PageMeta } from '../utils/seo';

/** Finds the tag in <head>, or adds it, and marks which page it belongs to. */
const headTag = (selector: string, create: () => HTMLElement, path: string) => {
    const tag = document.head.querySelector<HTMLElement>(selector) ?? create();
    tag.dataset.seo = path;
    if (!tag.isConnected) document.head.appendChild(tag);
    return tag;
};

const removeTags = (selector: string) =>
    document.head.querySelectorAll(selector).forEach((tag) => tag.remove());

/** Pass null while the page's data is still loading. */
export function usePageMeta(meta: PageMeta | null) {
    const { title, description, path } = meta ?? {};

    useEffect(() => {
        if (!title || !description || !path) return;

        removeTags(`[data-seo]:not([data-seo="${path}"])`);
        document.title = title;

        headTag(
            'meta[name="description"]',
            () => Object.assign(document.createElement('meta'), { name: 'description' }),
            path
        ).setAttribute('content', description);

        headTag(
            'link[rel="canonical"]',
            () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
            path
        ).setAttribute('href', SITE_URL + path);
    }, [title, description, path]);

    // Leaving the page: nothing from it should carry over to the next one.
    useEffect(
        () => () => {
            document.title = DEFAULT_TITLE;
            removeTags('[data-seo]');
        },
        []
    );
}
