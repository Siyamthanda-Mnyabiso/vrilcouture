import { Link } from 'react-router-dom';

interface CategoryCardProps {
    category: {
        id: string;
        name: string;
        slug: string;
        image_url?: string;
        description?: string;
    };
    variant?: 'default' | 'compact' | 'featured';
    className?: string;
}

export const CategoryCard = ({
                                 category,
                                 variant = 'default',
                                 className = '',
                             }: CategoryCardProps) => {
    const imageUrl = category.image_url ||
        `https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=600&fit=crop&crop=center`;

    const variantStyles = {
        default: {
            container: 'aspect-square',
            image: 'h-full',
            title: 'text-xl',
        },
        compact: {
            container: 'aspect-[4/3]',
            image: 'h-full',
            title: 'text-lg',
        },
        featured: {
            container: 'aspect-[16/9]',
            image: 'h-full',
            title: 'text-2xl',
        },
    };

    const styles = variantStyles[variant];

    return (
        <Link
            to={`/category/${category.slug}`}
            className={`block group overflow-hidden bg-[#F5F1EA] ${className}`}
        >
            <div className={`relative ${styles.container}`}>
                {/* Image */}
                <div
                    className={`w-full ${styles.image} bg-cover bg-center transition-transform duration-500 group-hover:scale-105`}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-[#2C2420] bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className="text-center">
                        <h3
                            className={`${styles.title} text-white font-bold tracking-wider mb-2 transition-transform duration-300 group-hover:scale-105`}
                            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                        >
                            {category.name}
                        </h3>

                        {variant === 'featured' && category.description && (
                            <p className="text-white/80 text-sm font-light tracking-wide max-w-xs mx-auto">
                                {category.description}
                            </p>
                        )}

                        {/* Underline indicator */}
                        <div className="mt-3 w-8 h-0.5 bg-white/60 mx-auto transition-all duration-300 group-hover:w-12 group-hover:bg-white" />
                    </div>
                </div>

                {/* Decorative corner accent - visible on hover */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
            </div>
        </Link>
    );
};