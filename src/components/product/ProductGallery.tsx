import { useState, useEffect } from 'react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
    className?: string;
}

export const ProductGallery = ({
                                   images,
                                   productName,
                                   className = '',
                               }: ProductGalleryProps) => {
    const [mainImage, setMainImage] = useState(images[0] || '');
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        // Reset to first image when images array changes
        setMainImage(images[0] || '');
    }, [images]);

    const placeholderImage = 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop';

    const displayImages = images.length > 0 ? images : [placeholderImage];

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* Main Image */}
            <div
                className={`relative aspect-[3/4] bg-[#F5F1EA] overflow-hidden cursor-zoom-in ${
                    isZoomed ? 'cursor-zoom-out' : ''
                }`}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <img
                    src={mainImage || placeholderImage}
                    alt={productName}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                />
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {displayImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setMainImage(image)}
                            className={`
                relative aspect-[3/4] bg-[#F5F1EA] overflow-hidden
                border-2 transition-colors duration-200
                ${mainImage === image ? 'border-[#6B5D4F]' : 'border-transparent hover:border-[#C4B8A8]'}
              `}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img
                                src={image}
                                alt={`${productName} - view ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};