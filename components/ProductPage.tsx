import React, { useState, useMemo } from 'react';
import { Product, Color, Material, View } from '../types';
import ProductGrid from './ProductGrid';
import SizeGuideModal from './SizeGuideModal';
import { RulerIcon, PlusIcon, MinusIcon } from './icons';
import { useQuote } from '../context/CartContext';

interface ProductPageProps {
    product: Product;
    initialColorName?: string | null;
    onNavigate: (page: View, value?: string | null, color?: string | null) => void;
    showToast: (message: string) => void;
    materials: Material[];
    allProducts: Product[];
    onProductClick: (product: Product) => void;
}

/**
 * @description Product detail page component that is optimized for responsiveness and touch interactions.
 */
const ProductPage: React.FC<ProductPageProps> = ({ product, initialColorName, onNavigate, showToast, materials, allProducts, onProductClick }) => {
    const { addToQuote } = useQuote();
    const sectionLabelClasses = "text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-3 block";

    const defaultColor = useMemo(() => {
        if (!product || !product.availableColors) return null;
        const colors = product.availableColors.filter(c => !!c);
        if (initialColorName) {
            return colors.find(c => c.name && c.name.toLowerCase() === initialColorName.toLowerCase()) || colors[0] || null;
        }
        return colors[0] || null;
    }, [product, initialColorName]);

    const [selectedColor, setSelectedColor] = useState<Color | null>(defaultColor);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: number }>({});
    
    const imagesForDisplay = useMemo(() => {
        if (!product) return [];
        const imageUrls = product.imageUrls || {};
        if (selectedColor && selectedColor.name && imageUrls[selectedColor.name] && imageUrls[selectedColor.name].length > 0) {
            return imageUrls[selectedColor.name];
        }
        const allImages = Object.values(imageUrls);
        return allImages.length > 0 ? allImages.flat() : [];
    }, [selectedColor, product]);

    const materialName = useMemo(() => {
        if (!product || !materials) return 'Premium Technical Fabric';
        return materials.find(m => m.id === product.materialId)?.name || 'Premium Technical Fabric';
    }, [product, materials]);

    const relatedProducts = useMemo(() => {
        if (!allProducts || !product) return [];
        return allProducts
            .filter(p => p && p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [allProducts, product]);

    const handleAddSize = (sizeName: string) => {
        setSelectedSizes(prev => ({
            ...prev,
            [sizeName]: (prev[sizeName] || 0) + 1
        }));
    };

    const handleRemoveSize = (sizeName: string) => {
        setSelectedSizes(prev => {
            const next = { ...prev };
            if (next[sizeName] > 1) {
                next[sizeName] -= 1;
            } else {
                delete next[sizeName];
            }
            return next;
        });
    };

    const handleAddToQuote = () => {
        if (!selectedColor) {
            showToast("Please select a color.");
            return;
        }
        if (Object.keys(selectedSizes).length === 0) {
            showToast("Please select at least one size.");
            return;
        }
        
        addToQuote(product, selectedColor, selectedSizes);
        showToast(`Added ${product.name} to your inquiry list.`);
        setSelectedSizes({});
    };

    if (!product) return null;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20">
                    
                    {/* LEFT: Product Images Gallery - Mobile Optimized */}
                    <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Main Image - Large Aspect Ratio for Mobile Visibility */}
                        <div className="order-1 md:order-2 flex-grow aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100 rounded-lg shadow-sm">
                            <img 
                                src={imagesForDisplay[activeImageIndex] || 'https://placehold.co/800x1000?text=No+Image'} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-opacity duration-500"
                            />
                        </div>

                        {/* Thumbnails - Horizontal scroll on mobile, Vertical list on desktop */}
                        <div className="order-2 md:order-1 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[800px] md:min-w-[80px] pb-2 md:pb-0">
                            {imagesForDisplay.map((url, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative aspect-[3/4] w-16 sm:w-20 md:w-full flex-shrink-0 overflow-hidden border-2 transition-all rounded-md ${activeImageIndex === idx ? 'border-black' : 'border-zinc-100'}`}
                                >
                                    <img src={url} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Details - Touch Friendly Controls */}
                    <div className="lg:col-span-5 space-y-8 md:space-y-10">
                        <section>
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
                                <div className="flex-1">
                                    <span className={sectionLabelClasses}>{product.categoryGroup} / {product.category}</span>
                                    <h1 className="font-eurostile font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest text-gray-900 leading-tight">{product.name}</h1>
                                </div>
                                {product.price && (
                                    <span className="font-oswald text-2xl font-bold bg-zinc-900 text-white px-3 py-1 rounded-md">₱{product.price.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl antialiased">{product.description}</p>
                        </section>

                        {/* Color Selection - Large Tap Targets */}
                        <section>
                            <span className={sectionLabelClasses}>Select Color: <span className="text-black">{selectedColor?.name}</span></span>
                            <div className="flex flex-wrap gap-4">
                                {product.availableColors.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setActiveImageIndex(0);
                                        }}
                                        className={`group relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor?.name === color.name ? 'border-black p-1' : 'border-zinc-200'}`}
                                        aria-label={`Select color ${color.name}`}
                                    >
                                        <span className="w-full h-full rounded-full border border-zinc-100 shadow-inner" style={{ backgroundColor: color.hex }}></span>
                                        {selectedColor?.name === color.name && (
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Size Selection - Larger Interactive Areas */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <span className={sectionLabelClasses}>Select Sizes</span>
                                <button 
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                                >
                                    <RulerIcon className="w-4 h-4" />
                                    Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.availableSizes.map(size => (
                                    <div key={size.name} className="flex items-center justify-between border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 group transition-all hover:bg-white hover:border-black hover:shadow-md">
                                        <span className="text-xs font-black uppercase tracking-wider">{size.name}</span>
                                        <div className="flex items-center gap-4">
                                            {(selectedSizes[size.name] || 0) > 0 ? (
                                                <button 
                                                    onClick={() => handleRemoveSize(size.name)} 
                                                    className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 rounded-full text-zinc-400 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm active:scale-90"
                                                    aria-label={`Decrease quantity for size ${size.name}`}
                                                >
                                                    <MinusIcon className="w-3 h-3" />
                                                </button>
                                            ) : (
                                                <div className="w-8"></div>
                                            )}
                                            
                                            <span className={`text-sm font-mono font-black min-w-[1.5rem] text-center ${(selectedSizes[size.name] || 0) > 0 ? 'text-black' : 'text-zinc-300'}`}>
                                                {selectedSizes[size.name] || 0}
                                            </span>
                                            
                                            <button 
                                                onClick={() => handleAddSize(size.name)} 
                                                className="w-8 h-8 flex items-center justify-center bg-zinc-900 text-white rounded-full transition-all shadow-md active:scale-90 hover:bg-black"
                                                aria-label={`Increase quantity for size ${size.name}`}
                                            >
                                                <PlusIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Action Buttons - Full Width Mobile */}
                        <section className="pt-6 space-y-4">
                            <button 
                                onClick={handleAddToQuote}
                                className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-full hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                <span>Add to Inquiry List</span>
                            </button>
                            {product.moq && (
                                <p className="text-center text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                    Minimum Order Quantity: <span className="text-zinc-900">{product.moq} pieces</span>
                                </p>
                            )}
                        </section>

                        {/* Technical Details - Visual Polish */}
                        <section className="border-t border-zinc-100 pt-8 space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Technical Material</h4>
                                    <p className="text-xs font-bold text-gray-900 uppercase tracking-tight leading-relaxed">{materialName}</p>
                                </div>
                                {product.leadTimeWeeks && (
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Est. Production</h4>
                                        <p className="text-xs font-bold text-gray-900 uppercase tracking-tight leading-relaxed">{product.leadTimeWeeks} Weeks</p>
                                    </div>
                                )}
                            </div>
                            
                            {product.supportedPrinting && product.supportedPrinting.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Compatible Finishes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.supportedPrinting.map(method => (
                                            <span key={method} className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* RELATED PRODUCTS - Standard Grid */}
                {relatedProducts.length > 0 && (
                    <section className="mt-24 md:mt-32 pt-20 md:pt-24 border-t border-zinc-100">
                        <div className="text-center mb-12 md:mb-16">
                            <span className={sectionLabelClasses}>More like this</span>
                            <h2 className="font-eurostile font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tighter">Related Gear</h2>
                        </div>
                        <ProductGrid products={relatedProducts} onProductClick={onProductClick} />
                    </section>
                )}
            </div>

            <SizeGuideModal 
                isOpen={isSizeGuideOpen} 
                onClose={() => setIsSizeGuideOpen(false)} 
                productName={product.name} 
                sizes={product.availableSizes} 
            />
        </div>
    );
};

export default ProductPage;