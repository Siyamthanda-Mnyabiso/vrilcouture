import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import type { CartItem as CartItemType } from '../../store/cart.store';

interface CartItemProps {
    item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
    const { updateQuantity, removeItem } = useCart();

    const imageUrl = item.image ||
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=250&fit=crop';

    const handleQuantityChange = (delta: number) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity >= 1) {
            updateQuantity(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        removeItem(item.id);
    };

    return (
        <div className="flex gap-4 py-4 border-b border-[#D5C9B9] last:border-0">
            {/* Product Image */}
            <div className="w-20 h-24 bg-[#F5F1EA] flex-shrink-0 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-[#2C2420] truncate">
                        {item.name}
                    </h4>
                    <button
                        onClick={handleRemove}
                        className="text-[#8A8378] hover:text-[#2C2420] transition-colors flex-shrink-0"
                        aria-label="Remove item"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="square" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm font-medium text-[#2C2420] mt-1">
                    {formatCurrency(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center border border-[#D5C9B9] text-[#2C2420] hover:bg-[#F5F1EA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="square" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>
                    <span className="w-8 text-center text-sm text-[#2C2420]">
            {item.quantity}
          </span>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-7 h-7 flex items-center justify-center border border-[#D5C9B9] text-[#2C2420] hover:bg-[#F5F1EA] transition-colors"
                        aria-label="Increase quantity"
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="square" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-[#2C2420]">
                    {formatCurrency(item.price * item.quantity)}
                </p>
            </div>
        </div>
    );
};