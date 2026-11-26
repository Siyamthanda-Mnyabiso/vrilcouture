export const GENDERS = ['men', 'women', 'unisex'] as const;

export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
    men: 'Men',
    women: 'Women',
    unisex: 'Unisex',
};

export const isGender = (value: unknown): value is Gender =>
    GENDERS.includes(value as Gender);

/**
 * Whether a product belongs in the Men or Women section. Unisex products, and
 * products with no gender chosen yet, appear in both.
 */
export const matchesGender = (productGender: string | null | undefined, section: Gender) =>
    !productGender || productGender === 'unisex' || productGender === section;

/** Menu link for a category, e.g. ("T Shirts", "women") -> /category/t-shirts?gender=women */
export const categoryPath = (name: string, gender?: Gender) =>
    `/category/${name.toLowerCase().replaceAll(' ', '-')}${gender ? `?gender=${gender}` : ''}`;
