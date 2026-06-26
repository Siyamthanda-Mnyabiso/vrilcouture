// src/utils/constants.ts

// Site Configuration
export const SITE_NAME = 'VRIL COUTURE.';
export const SITE_DESCRIPTION = 'Premium fashion for the discerning individual';
export const SITE_URL = 'https://vrilcouture.com';

// Currency
export const CURRENCY = 'ZAR';
export const CURRENCY_SYMBOL = 'R';
export const CURRENCY_LOCALE = 'en-ZA';

// Shipping
export const FREE_SHIPPING_THRESHOLD = 2550;
export const SHIPPING_COST = 100;

// Tax
export const TAX_RATE = 0.15; // 15% VAT

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;

// Product
export const MAX_IMAGE_UPLOADS = 8;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Admin
export const ADMIN_ROLE = 'admin';

// Yoco — only the PUBLIC key belongs on the client.
// The secret key and webhook secret must live ONLY as server-side env vars
// (e.g. Supabase Edge Function secrets, set via `supabase secrets set`),
// never prefixed with VITE_, and never imported into client code.
export const YOCO_PUBLIC_KEY = import.meta.env.VITE_YOCO_PUBLIC_KEY || '';

// Supabase — only the URL and ANON key belong on the client.
// The service role key must NEVER be referenced here. It bypasses RLS
// entirely; if it's prefixed VITE_, it ships straight to every browser.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Storage Buckets
export const STORAGE_BUCKET_PRODUCTS = 'products';
export const STORAGE_BUCKET_CATEGORIES = 'categories';

// Route Paths
export const ROUTES = {
    HOME: '/',
    SHOP: '/shop',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_SUCCESS: '/order-success',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN: '/admin',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_CATEGORIES: '/admin/categories',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_CUSTOMERS: '/admin/customers',
} as const;

// Category Slugs
export const CATEGORY_SLUGS = {
    MEN: 'men',
    WOMEN: 'women',
    KIDS: 'kids',
    ACCESSORIES: 'accessories',
    SPORTS: 'sports',
} as const;

// Order Statuses
export const ORDER_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    PASSWORD_MISMATCH: 'Passwords do not match',
    NETWORK_ERROR: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Regex Patterns
export const PATTERNS = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PHONE: /^\+?[0-9]{10,15}$/,
    POSTAL_CODE: /^[0-9]{4,10}$/,
    SLUG: /^[a-z0-9-]+$/,
} as const;

// Meta Data
export const META = {
    HOME: {
        title: 'VRIL COUTURE. - Premium Fashion',
        description: 'Discover our curated collection of timeless pieces designed for the discerning individual.',
    },
    SHOP: {
        title: 'Shop All - VRIL COUTURE.',
        description: 'Explore our complete collection of premium fashion.',
    },
    CART: {
        title: 'Cart - VRIL COUTURE.',
        description: 'Review your items and proceed to checkout.',
    },
    CHECKOUT: {
        title: 'Checkout - VRIL COUTURE.',
        description: 'Complete your order securely.',
    },
} as const;