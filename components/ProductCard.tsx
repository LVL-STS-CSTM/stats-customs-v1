
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const allImages = Object.values(product.imageUrls || {}).flat();
    const primaryImageUrl = allImages[0] || 'https://placehold.co/600x800?text=No+Image';
    const secondaryImageUrl = allImages[1] || primaryImageUrl;

    return (
        <div 
            className="group flex flex-col cursor-pointer h-full"
            onClick={() => onProductClick(product)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-zinc-50 border border-zinc-100 rounded-sm mb-4">
                {/* Image Stack */}
                <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
                    <img
                        src={primaryImageUrl}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered && allImages.length > 1 ? 'opacity-0' : 'opacity-100'}`}
                        loading="lazy"
                    />
                    {allImages.length > 1 && (
                        <img
                            src={secondaryImageUrl}
                            alt={`${product.name} alternate view`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            loading="lazy"
                        />
                    )}
                </div>

                {/* Overlays */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    {product.isBestseller && (
                        <span className="text-[9px] font-bold tracking-wider text-black bg-white/90 px-2 py-1 uppercase backdrop-blur-sm shadow-sm rounded-sm">
                            Bestseller
                        </span>
                    )}
                </div>
            </div>
            
            {/* Label */}
            <div className="text-center px-1 flex-grow flex flex-col justify-start">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-900 group-hover:text-black transition-colors leading-snug break-words">
                    {product.name}
                </h3>
                <div className="mt-3 w-0 h-[1px] bg-black mx-auto transition-all duration-500 group-hover:w-8 opacity-20"></div>
            </div>
        </div>
    );
};

export default ProductCard;
