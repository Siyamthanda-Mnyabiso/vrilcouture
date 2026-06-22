export const initializeYocoCheckout = async (payload: {
    amount: number;
    currency: string;
    email: string;
    name: string;
    metadata?: any;
}) => {
    try {
        // TEMP MOCK OR REAL YOCO LOGIC HERE
        const response = await fetch('/api/yoco/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        return {
            success: true,
            redirectUrl: data.redirectUrl,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Checkout initialization failed',
        };
    }
};