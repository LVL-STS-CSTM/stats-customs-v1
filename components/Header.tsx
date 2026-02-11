import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, UserIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './icons';
import { View } from '../types';
import { useData } from '../context/DataContext';

const IconButton: React.FC<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    ariaLabel: string,
    className?: string,
    theme?: 'light' | 'dark'
}> = ({ onClick, children, ariaLabel, className = '', theme = 'light' }) => {
    const themeClasses = theme === 'dark'
        ? 'text-gray-300 hover:text-white'
        : 'text-gray-500 hover:text-gray-900';

    return (
        <button onClick={onClick} className={`${themeClasses} transition-colors duration-200 relative ${className}`} aria-label={ariaLabel}>
            {children}
        </button>
    );
};

interface HeaderProps {
    onNavigate: (page: View, category?: string | null) => void;
    onQuoteClick: () => void;
    onSearchClick: () => void;
    onSubscribeClick: () => void;
    view: View;
    catalogueFilter: { type: 'group' | 'category' | 'gender'; value: string } | null;
    isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onQuoteClick, onSearchClick, onSubscribeClick, view, catalogueFilter, isScrolled }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);

    const { products, collections } = useData();

    const isTransparent = view === 'home' && !isScrolled;
    const headerClasses = isTransparent ? 'bg-transparent' : 'bg-black shadow-2xl';

    const productCategories = useMemo(() => {
        return (collections || []).map(group => {
            const categoriesSet = new Set<string>();
            (products || []).forEach(product => {
                if (product && group && product.categoryGroup === group.name) {
                    categoriesSet.add(product.category);
                }
            });
            return {
                groupName: group?.name || 'Unknown',
                categories: Array.from(categoriesSet).sort()
            };
        }).sort((a,b) => (a.groupName || '').localeCompare(b.groupName || ''));
    }, [products, collections]);
    
    const exploreLinks = useMemo(() => [
        { label: 'About Us', view: 'about' as View },
        { label: 'Contact Us', view: 'contact' as View },
        { label: 'How We Work', view: 'how-we-work' as View },
        { label: 'Our Materials', view: 'materials' as View },
        { label: 'Our Partners', view: 'partners' as View },
        { label: 'Other Services', view: 'services' as View },
    ].sort((a, b) => a.label.localeCompare(b.label)), []);

    useEffect(() => {
        const body = document.body;
        body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
        return () => { body.style.overflow = 'auto'; };
    }, [isMobileMenuOpen]);

    const handleNavClick = (page: View, category: string | null = null) => {
        onNavigate(page, category);
        setIsMobileMenuOpen(false);
        setIsMegaMenuOpen(false);
        setIsExploreMenuOpen(false);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[40] transition-all duration-500 ${headerClasses}`}>
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8" onMouseLeave={() => { setIsMegaMenuOpen(false); setIsExploreMenuOpen(false); }}>
                    <div className="relative flex items-center justify-between h-16 md:h-20">
                        <div className="flex-1 flex justify-start items-center">
                            <nav className="hidden md:flex md:space-x-10">
                                <div className="relative h-full flex items-center" onMouseEnter={() => { setIsMegaMenuOpen(true); setIsExploreMenuOpen(false); }}>
                                    <button
                                        onClick={() => handleNavClick('browse', null)}
                                        className={`flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${view === 'browse' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        <span>Catalogue</span>
                                        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-500 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                                <div className="relative h-full flex items-center" onMouseEnter={() => { setIsExploreMenuOpen(true); setIsMegaMenuOpen(false); }}>
                                    <button className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 hover:text-white transition-colors duration-300">
                                        <span>Explore</span>
                                        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-500 ${isExploreMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`absolute top-full left-0 mt-0 pt-2 min-w-[200px] bg-white shadow-2xl rounded-b-xl border border-gray-100 transition-all duration-500 ease-in-out z-50 ${isExploreMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                                        <div className="py-3">
                                            {exploreLinks.map(link => (
                                                <button
                                                    key={link.label}
                                                    onClick={() => handleNavClick(link.view)}
                                                    className={`flex items-center justify-between w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${view === link.view ? 'bg-zinc-50 text-black' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'}`}
                                                >
                                                    {link.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </nav>
                            <div className="md:hidden">
                                <IconButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} ariaLabel="Menu" theme="dark">
                                    <MenuIcon className="w-7 h-7" />
                                </IconButton>
                            </div>
                        </div>

                        {/* Centered Logo - Updated Source */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                             <button onClick={() => handleNavClick('home')} className="flex items-center transition-transform duration-500 hover:scale-110" aria-label="Home">
                                <img 
                                    src="https://i.imgur.com/OIYeMvS.png" 
                                    alt="STATS CUSTOM APPAREL" 
                                    className="h-10 md:h-14 w-auto object-contain"
                                    onError={(e) => {
                                        // Fallback if URL fails
                                        (e.target as HTMLImageElement).src = "https://i.imgur.com/vHq0L9A.png";
                                    }}
                                />
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-end">
                            <div className="flex items-center justify-end space-x-6">
                                <IconButton onClick={onSearchClick} ariaLabel="Search" theme="dark">
                                    <SearchIcon className="w-5 h-5" />
                                </IconButton>
                                <IconButton onClick={onSubscribeClick} ariaLabel="Subscribe" theme="dark">
                                    <UserIcon className="w-5 h-5" />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    {/* Mega Menu */}
                    <div className={`absolute top-full left-0 right-0 bg-white shadow-3xl border-t border-zinc-100 transition-all duration-700 ease-in-out ${isMegaMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-10'}`} onMouseLeave={() => setIsMegaMenuOpen(false)}>
                        <div className="max-w-screen-2xl mx-auto px-12 py-16 grid grid-cols-6 gap-12">
                           {productCategories.map(group => (
                               <div key={group.groupName} className="space-y-8">
                                   <button 
                                       onClick={() => handleNavClick('catalogue', group.groupName)} 
                                       className={`font-eurostile text-xs uppercase tracking-[0.4em] mb-4 hover:text-black transition-colors ${catalogueFilter?.value === group.groupName ? 'text-black border-b border-black pb-1' : 'text-zinc-400'}`}
                                   >
                                       {group.groupName}
                                   </button>
                                   <ul className="space-y-4">
                                       {group.categories.map(category => (
                                           <li key={category}>
                                               <button onClick={() => handleNavClick('catalogue', category)} className={`text-[10px] uppercase tracking-widest font-medium hover:text-black transition-colors ${catalogueFilter?.value === category ? 'text-black font-bold' : 'text-zinc-500'}`}>{category}</button>
                                           </li>
                                       ))}
                                   </ul>
                               </div>
                           ))}
                            <div className="space-y-8">
                                <h3 className="font-eurostile text-xs uppercase tracking-[0.4em] text-zinc-400 mb-4">Utility</h3>
                                <ul className="space-y-4">
                                    {['Men', 'Women', 'Unisex'].map(gender => (
                                        <li key={gender}>
                                            <button onClick={() => handleNavClick('catalogue', gender)} className={`text-[10px] uppercase tracking-widest font-medium hover:text-black transition-colors ${catalogueFilter?.value === gender ? 'text-black font-bold' : 'text-zinc-500'}`}>{gender}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[50] md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-700 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className={`fixed top-0 left-0 h-full w-full max-w-[300px] bg-white shadow-3xl z-50 transform transition-transform duration-700 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <header className="flex items-center justify-between p-8 border-b border-zinc-50">
                            <h2 className="font-eurostile font-bold text-[10px] uppercase tracking-[0.4em] text-zinc-400">Navigation</h2>
                            <IconButton onClick={() => setIsMobileMenuOpen(false)} ariaLabel="Close menu"><CloseIcon className="w-5 h-5" /></IconButton>
                        </header>
                        <nav className="flex-1 overflow-y-auto p-8 space-y-2 no-scrollbar">
                             <button onClick={() => handleNavClick('browse', null)} className="flex items-center justify-center w-full p-5 rounded-xl bg-zinc-900 text-white font-bold uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 shadow-xl mb-10">Full Catalogue</button>
                             <div className="space-y-10">
                                {productCategories.map(group => (
                                    <div key={group.groupName} className="space-y-6">
                                        <button 
                                            onClick={() => handleNavClick('catalogue', group.groupName)} 
                                            className="w-full text-left text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-300"
                                        >
                                            {group.groupName}
                                        </button>
                                        <div className="grid grid-cols-1 gap-4">
                                            {group.categories.map(category => (
                                                <button key={category} onClick={() => handleNavClick('catalogue', category)} className="w-full text-left text-[11px] font-medium uppercase tracking-widest text-zinc-600 hover:text-black">{category}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;