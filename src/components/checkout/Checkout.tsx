import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            setProcessing(true);

            // TEMP MOCK CHECKOUT (no payment gateway)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            navigate('/order-success');
        } catch (error) {
            console.error('Checkout failed:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>

            <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
                {processing ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
};