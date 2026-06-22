// Site Configuration
export const SITE_NAME = 'KĀNGI';
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

// API Endpoints - Using import.meta.env for Vite
export const YOCO_PUBLIC_KEY = import.meta.env.VITE_YOCO_PUBLIC_KEY || 'test_public_key';
export const YOCO_SECRET_KEY = import.meta.env.VITE_YOCO_SECRET_KEY || 'test_secret_key';
export const YOCO_WEBHOOK_SECRET = import.meta.env.VITE_YOCO_WEBHOOK_SECRET || 'webhook_secret';

// Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

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
        title: 'KĀNGI - Premium Fashion',
        description: 'Discover our curated collection of timeless pieces designed for the discerning individual.',
    },
    SHOP: {
        title: 'Shop All - KĀNGI',
        description: 'Explore our complete collection of premium fashion.',
    },
    CART: {
        title: 'Cart - KĀNGI',
        description: 'Review your items and proceed to checkout.',
    },
    CHECKOUT: {
        title: 'Checkout - KĀNGI',
        description: 'Complete your order securely.',
    },
} as const;