
import React, { useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useOnScreen } from '../useOnScreen';

interface ProductGridProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    layout?: 'grid-sm' | 'grid-lg';
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, layout = 'grid-sm' }) => {
    const gridRef = useRef<HTMLElement>(null);
    const isVisible = useOnScreen(gridRef, '0px 0px -100px 0px');

    // Adjusted for "2 per row on mobile" with "reduced spaces" (gap-x-3) to make cards larger.
    const gridClasses = layout === 'grid-lg'
        ? 'grid-cols-2 sm:grid-cols-2 gap-x-3 gap-y-12'
        : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-12 md:gap-x-6 md:gap-y-20';

    // Ensure we don't try to render null products
    const validProducts = (products || []).filter(p => !!p && !!p.id);

    return (
        <section ref={gridRef} className="w-full">
            <div className={`grid ${gridClasses}`}>
                {validProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        <ProductCard 
                            product={product} 
                            onProductClick={onProductClick} 
                        />
                    </div>
                ))}
            </div>

            {validProducts.length === 0 && (
                <div className="py-40 text-center">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">0 Items Found</p>
                </div>
            )}
        </section>
    );
};

export default ProductGrid;
