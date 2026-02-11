
import React, { useState, useMemo } from 'react';
import { Product, View } from '../types';
import ProductGrid from './ProductGrid';
import { useData } from '../context/DataContext';
import PageHeader from './PageHeader';
import { FilterIcon, CloseIcon, ChevronDownIcon } from './icons';

interface CataloguePageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    initialFilter: { type: 'group' | 'category' | 'gender'; value: string } | null;
    onNavigate: (page: View, value?: string | null) => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-b border-zinc-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
        <h3 className="font-eurostile font-black text-[10px] uppercase tracking-[0.3em] text-zinc-900 mb-6">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const FilterLink: React.FC<{ active: boolean; onClick: () => void; label: string; count?: number }> = ({ active, onClick, label, count }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-between w-full text-left group transition-all ${active ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
    >
        <span className={`text-[11px] font-bold uppercase tracking-widest ${active ? 'underline underline-offset-8 decoration-2' : ''}`}>
            {label}
        </span>
        {count !== undefined && (
            <span className={`text-[9px] font-mono transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {count}
            </span>
        )}
    </button>
);

const CataloguePage: React.FC<CataloguePageProps> = ({ products, onProductClick, initialFilter, onNavigate }) => {
    const { collections } = useData();
    const [sortOrder, setSortOrder] = useState('default');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let filtered = [...products];
        
        if (initialFilter) {
            const { type, value } = initialFilter;
            if (type === 'group') filtered = filtered.filter(p => p.categoryGroup === value);
            else if (type === 'category') filtered = filtered.filter(p => p.category === value);
            else if (type === 'gender') filtered = filtered.filter(p => p.gender === value);
        }

        // Apply Sorting
        if (sortOrder === 'price-asc') filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        if (sortOrder === 'price-desc') filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        if (sortOrder === 'newest') filtered.sort((a, b) => (b.displayOrder || 0) - (a.displayOrder || 0));
        
        return filtered;
    }, [products, initialFilter, sortOrder]);

    const uniqueCategories = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category))).sort();
    }, [products]);

    const handleFilterChange = (type: string, value: string) => {
        // App.tsx handleNavigate logic handles the semantic URL construction based on value matches
        onNavigate('catalogue', value);
        setIsMobileFilterOpen(false);
    };

    const clearAll = () => {
        onNavigate('catalogue');
        setIsMobileFilterOpen(false);
    };

    const renderFilterGroups = () => (
        <>
            <FilterSection title="Collections">
                {collections.map(c => (
                    <FilterLink 
                        key={c.id} 
                        label={c.name}
                        active={initialFilter?.type === 'group' && initialFilter.value === c.name}
                        onClick={() => handleFilterChange('group', c.name)}
                        count={products.filter(p => p.categoryGroup === c.name).length}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Gender">
                {['Men', 'Women', 'Unisex'].map(g => (
                    <FilterLink 
                        key={g} 
                        label={g}
                        active={initialFilter?.type === 'gender' && initialFilter.value === g}
                        onClick={() => handleFilterChange('gender', g)}
                        count={products.filter(p => p.gender === g).length}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Product Type">
                {uniqueCategories.map(cat => (
                    <FilterLink 
                        key={cat} 
                        label={cat}
                        active={initialFilter?.type === 'category' && initialFilter.value === cat}
                        onClick={() => handleFilterChange('category', cat)}
                        count={products.filter(p => p.category === cat).length}
                    />
                ))}
            </FilterSection>
        </>
    );

    return (
        <div className="bg-white min-h-screen">
            <PageHeader 
                page="catalogue" 
                fallbackTitle={initialFilter?.value || "The Collection"} 
                fallbackDescription={`Handcrafted quality. Currently showing ${filteredProducts.length} items.`}
            />

            <div className="max-w-[1840px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 py-12 md:py-24">
                    
                    {/* Desktop Sidebar */}
                    <aside className={`hidden lg:block transition-all duration-500 overflow-hidden ${isSidebarVisible ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
                        <div className="sticky top-28 w-64 pr-8">
                            <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-black">
                                <div className="flex items-center gap-2">
                                    <FilterIcon className="w-4 h-4" />
                                    <h2 className="font-eurostile font-black text-xs uppercase tracking-widest">Filters</h2>
                                </div>
                                {initialFilter && (
                                    <button onClick={clearAll} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                                        Clear All
                                    </button>
                                )}
                            </div>
                            {renderFilterGroups()}
                        </div>
                    </aside>
                    
                    {/* Content Grid */}
                    <div className="flex-grow">
                        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 pb-6 border-b border-zinc-100">
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                                    className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                                >
                                    <div className="w-8 h-4 border border-zinc-200 rounded-full relative flex items-center px-0.5">
                                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isSidebarVisible ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-200'}`}></div>
                                    </div>
                                    {isSidebarVisible ? 'Hide Filters' : 'Show Filters'}
                                </button>
                                <div className="hidden lg:block h-4 w-[1px] bg-zinc-100"></div>
                                <h1 className="font-eurostile font-black text-xs uppercase tracking-[0.4em] text-zinc-900">
                                    Browse All
                                    <span className="text-zinc-300 ml-4 font-mono">[{filteredProducts.length}]</span>
                                </h1>
                            </div>
                            
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Sort By</span>
                                <div className="relative flex-grow sm:flex-grow-0">
                                    <select 
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="appearance-none bg-transparent border-0 border-b border-zinc-200 py-2 pl-0 pr-8 text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer hover:border-black transition-colors w-full"
                                    >
                                        <option value="default">Featured</option>
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="price-asc">Price: Low-High</option>
                                        <option value="price-desc">Price: High-Low</option>
                                    </select>
                                    <ChevronDownIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-zinc-400" />
                                </div>
                            </div>
                        </header>

                        <ProductGrid 
                            products={filteredProducts} 
                            onProductClick={onProductClick} 
                        />

                        {filteredProducts.length === 0 && (
                            <div className="py-40 text-center space-y-6">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto border border-zinc-100">
                                    <CloseIcon className="w-6 h-6 text-zinc-300" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">No products found</p>
                                    <button onClick={clearAll} className="text-[10px] font-black uppercase underline underline-offset-8 tracking-widest hover:text-black transition-colors">View All Products</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Floating Button */}
            <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[45]">
                <button 
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="bg-black text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
                >
                    <FilterIcon className="w-4 h-4" />
                    Filter Products
                </button>
            </div>

            {/* Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] max-h-[90vh] flex flex-col transition-transform duration-500 ease-out ${isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <header className="flex items-center justify-between p-8 border-b border-zinc-100">
                        <h2 className="font-eurostile font-black text-sm uppercase tracking-[0.3em]">Filter Collection</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
                            <CloseIcon className="w-7 h-7" />
                        </button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar pb-32">
                        {renderFilterGroups()}
                    </div>
                    <footer className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent">
                        <button 
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl"
                        >
                            Apply Filters
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default CataloguePage;
