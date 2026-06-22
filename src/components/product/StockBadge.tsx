import { Badge } from '../ui/Badge';

interface StockBadgeProps {
    inventoryCount: number;
    className?: string;
    showText?: boolean;
}

export const StockBadge = ({
                               inventoryCount,
                               className = '',
                               showText = true,
                           }: StockBadgeProps) => {
    if (inventoryCount <= 0) {
        return (
            <Badge
                variant="error"
                size="sm"
                dot
                className={className}
            >
                Out of Stock
            </Badge>
        );
    }

    if (inventoryCount <= 5) {
        return (
            <Badge
                variant="warning"
                size="sm"
                dot
                className={className}
            >
                {showText ? `Only ${inventoryCount} left` : 'Low Stock'}
            </Badge>
        );
    }

    if (inventoryCount <= 20) {
        return (
            <Badge
                variant="info"
                size="sm"
                dot
                className={className}
            >
                In Stock
            </Badge>
        );
    }

    return (
        <Badge
            variant="success"
            size="sm"
            dot
            className={className}
        >
            In Stock
        </Badge>
    );
};