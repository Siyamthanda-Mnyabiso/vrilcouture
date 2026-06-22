// src/services/yoco/checkout.service.ts
// Either remove unused parameters or prefix with underscore

export const checkoutService = {
    // Example: Add underscore to unused parameters
    async createPayment(_options: any) {
        // ... implementation
    },

    async confirmPayment(_token: string, _amount: number, _currency: string) {
        // ... implementation
    },

    async mountCardElement(_formElement: HTMLElement, _publicKey: string) {
        // ... implementation
    }
};