// src/components/cart/CartSummary.tsx
import { formatCurrency } from '../../utils/currency';

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    className?: string;
}

export const CartSummary = ({
                                subtotal,
                                shipping,
                                total,
                                className = '',
                            }: CartSummaryProps) => {
    const format = (value: number) => formatCurrency(value);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-black/50">Subtotal</span>
                <span className="text-black font-medium">{format(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-black/50">Shipping</span>
                <span className="text-black font-medium">
          {shipping === 0 ? 'Free' : format(shipping)}
        </span>
            </div>

            {/* Free shipping threshold notice */}
            {shipping > 0 && subtotal < 1000 && (
                <p className="text-xs text-black/50 text-right">
                    Add {format(1000 - subtotal)} more for free shipping
                </p>
            )}

            <div className="border-t border-black/10 pt-3 mt-3">
                <div className="flex items-center justify-between">
          <span className="text-base font-medium text-black uppercase tracking-wide">
            Total
          </span>
                    <span className="text-xl font-bold text-black">
            {format(total)}
          </span>
                </div>
            </div>
        </div>
    );
};