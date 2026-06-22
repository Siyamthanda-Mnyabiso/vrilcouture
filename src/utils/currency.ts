import { CURRENCY, CURRENCY_SYMBOL, CURRENCY_LOCALE } from './constants';

/**
 * Format a number as currency
 */
export const formatCurrency = (
    amount: number,
    currency: string = CURRENCY,
    locale: string = CURRENCY_LOCALE
): string => {
    if (!amount && amount !== 0) return `${CURRENCY_SYMBOL}0.00`;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format currency without the currency symbol
 */
export const formatCurrencyNumber = (
    amount: number,
    locale: string = CURRENCY_LOCALE
): string => {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Parse a currency string to number
 */
export const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9.,-]/g, '');
    return parseFloat(cleaned.replace(/,/g, ''));
};

/**
 * Check if amount qualifies for free shipping
 */
export const qualifiesForFreeShipping = (amount: number, threshold: number = 2550): boolean => {
    return amount >= threshold;
};

/**
 * Calculate tax amount
 */
export const calculateTax = (amount: number, taxRate: number = 0.15): number => {
    return amount * taxRate;
};

/**
 * Calculate total with tax and shipping
 */
export const calculateTotal = (
    subtotal: number,
    taxRate: number = 0.15,
    shippingCost: number = 100,
    freeShippingThreshold: number = 2550
): {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
} => {
    const tax = calculateTax(subtotal, taxRate);
    const shipping = qualifiesForFreeShipping(subtotal, freeShippingThreshold) ? 0 : shippingCost;
    const total = subtotal + tax + shipping;

    return {
        subtotal,
        tax,
        shipping,
        total,
    };
};