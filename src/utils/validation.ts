import { PATTERNS, ERROR_MESSAGES } from './constants';

/**
 * Validation result type
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
    if (!email) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (!PATTERNS.EMAIL.test(email)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
    }
    return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (password.length < 6) {
        return { isValid: false, error: ERROR_MESSAGES.PASSWORD_MIN };
    }
    return { isValid: true };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
    password: string,
    confirmPassword: string
): ValidationResult => {
    if (!confirmPassword) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (password !== confirmPassword) {
        return { isValid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH };
    }
    return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
    if (!phone) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (!PATTERNS.PHONE.test(phone)) {
        return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE };
    }
    return { isValid: true };
};

/**
 * Validate postal code
 */
export const validatePostalCode = (postalCode: string): ValidationResult => {
    if (!postalCode) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (!PATTERNS.POSTAL_CODE.test(postalCode)) {
        return { isValid: false, error: 'Please enter a valid postal code' };
    }
    return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
    if (!value || value.trim() === '') {
        return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
};

/**
 * Validate price
 */
export const validatePrice = (price: number): ValidationResult => {
    if (price === undefined || price === null) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (isNaN(price) || price <= 0) {
        return { isValid: false, error: 'Price must be a positive number' };
    }
    return { isValid: true };
};

/**
 * Validate quantity
 */
export const validateQuantity = (quantity: number, min: number = 1, max?: number): ValidationResult => {
    if (quantity === undefined || quantity === null) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (isNaN(quantity) || quantity < min) {
        return { isValid: false, error: `Quantity must be at least ${min}` };
    }
    if (max !== undefined && quantity > max) {
        return { isValid: false, error: `Quantity cannot exceed ${max}` };
    }
    return { isValid: true };
};

/**
 * Validate slug
 */
export const validateSlug = (slug: string): ValidationResult => {
    if (!slug) {
        return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
    }
    if (!PATTERNS.SLUG.test(slug)) {
        return { isValid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
    }
    return { isValid: true };
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): ValidationResult => {
    if (!url) {
        return { isValid: true }; // URL is optional
    }
    try {
        new URL(url);
        return { isValid: true };
    } catch {
        return { isValid: false, error: 'Please enter a valid URL' };
    }
};

/**
 * Validate image URL
 */
export const validateImageUrl = (url: string): ValidationResult => {
    const result = validateUrl(url);
    if (!result.isValid) return result;

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));

    if (!hasImageExtension) {
        return { isValid: false, error: 'URL must point to an image file (jpg, png, webp, gif)' };
    }

    return { isValid: true };
};

/**
 * Validate a form object
 */
export const validateForm = <T extends Record<string, any>>(
    data: T,
    rules: Record<keyof T, (value: any) => ValidationResult>
): {
    isValid: boolean;
    errors: Partial<Record<keyof T, string>>;
} => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const [key, validate] of Object.entries(rules)) {
        const result = validate(data[key as keyof T]);
        if (!result.isValid) {
            errors[key as keyof T] = result.error;
            isValid = false;
        }
    }

    return { isValid, errors };
};

/**
 * Sanitize string for security
 */
export const sanitizeString = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .slice(0, 1000); // Limit length
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (input: string): string => {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return input.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
};