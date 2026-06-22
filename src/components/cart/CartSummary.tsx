import { formatCurrency } from '../../utils/currency';

interface CartSummaryProps {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    className?: string;
}

export const CartSummary = ({
                                subtotal,
                                tax,
                                shipping,
                                total,
                                className = '',
                            }: CartSummaryProps) => {
    const format = (value: number) => formatCurrency(value);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A8378]">Subtotal</span>
                <span className="text-[#2C2420] font-medium">{format(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A8378]">Tax (15%)</span>
                <span className="text-[#2C2420] font-medium">{format(tax)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A8378]">Shipping</span>
                <span className="text-[#2C2420] font-medium">
          {shipping === 0 ? 'Free' : format(shipping)}
        </span>
            </div>

            {/* Free shipping threshold notice */}
            {shipping > 0 && subtotal < 2550 && (
                <p className="text-xs text-[#8A8378] text-right">
                    Add {format(2550 - subtotal)} more for free shipping
                </p>
            )}

            <div className="border-t border-[#D5C9B9] pt-3 mt-3">
                <div className="flex items-center justify-between">
          <span className="text-base font-medium text-[#2C2420] uppercase tracking-wide">
            Total
          </span>
                    <span className="text-xl font-bold text-[#2C2420]">
            {format(total)}
          </span>
                </div>
            </div>
        </div>
    );
};