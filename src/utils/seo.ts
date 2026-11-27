// Page titles and descriptions for the shop pages. Used both by the server
// function (api/page.ts) and in the browser, so the two always match.
// The ".js" in the import is needed by the server function.
import { GENDER_LABELS, type Gender } from './gender.js';

export const SITE_URL = 'https://www.vrilcouture.co.za';
/** The title in index.html, used by every page without its own. */
export const DEFAULT_TITLE = 'VRILCOUTURE';

const BRAND = 'Vril Couture';
const DESCRIPTION_LIMIT = 155;

export interface PageMeta {
    title: string;
    description: string;
    /** Address of the page without its query string, e.g. "/shop". */
    path: string;
}

/** One line, short enough to show in full under a search result. */
const summarise = (text: string) => {
    const line = text.replace(/\s+/g, ' ').trim();
    if (line.length <= DESCRIPTION_LIMIT) return line;
    const cut = line.slice(0, DESCRIPTION_LIMIT);
    return `${cut.slice(0, cut.lastIndexOf(' ') || DESCRIPTION_LIMIT)}…`;
};

export const SHOP_META: PageMeta = {
    title: `Shop | ${BRAND}`,
    description: `Browse the full ${BRAND} collection.`,
    path: '/shop',
};

export const NEW_IN_META: PageMeta = {
    title: `New In | ${BRAND}`,
    description: `See the latest pieces from ${BRAND}.`,
    path: '/new-in',
};

export const productMeta = (product: {
    id: string;
    name: string;
    description?: string | null;
}): PageMeta => ({
    title: `${product.name} | ${BRAND}`,
    description: summarise(product.description?.trim() || `Shop ${product.name} from ${BRAND}.`),
    path: `/product/${product.id}`,
});

export const categoryHeading = (name: string, gender?: Gender) =>
    gender && gender !== 'unisex' ? `${GENDER_LABELS[gender]}'s ${name}` : name;

export const categoryMeta = (
    category: { name: string; slug: string },
    gender?: Gender
): PageMeta => ({
    title: `${categoryHeading(category.name, gender)} | ${BRAND}`,
    description: `Shop ${categoryHeading(category.name, gender)} from ${BRAND}.`,
    path: `/category/${encodeURIComponent(category.slug)}`,
});
