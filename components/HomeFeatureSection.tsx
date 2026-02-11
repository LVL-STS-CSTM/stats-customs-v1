
import React, { useRef, useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import LazyImage from './LazyImage';
import { ArrowLongRightIcon, CloseIcon } from './icons';

interface HomeFeatureSectionProps {
    onNavigate: (page: any, value?: string | null) => void;
}

const HomeFeatureSection: React.FC<HomeFeatureSectionProps> = ({ onNavigate }) => {
    const { homeFeature } = useData();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    // State to track the currently opened slide for the popup
    const [selectedSlide, setSelectedSlide] = useState<{ id: string; title: string; subtitle: string; description: string; image: string } | null>(null);

    // Defensive check: ensure homeFeature exists before accessing isVisible
    if (!homeFeature || !homeFeature.isVisible) return null;

    const slides = [
        {
            id: 'main-feature',
            title: homeFeature.headline || 'Custom Apparel',
            subtitle: homeFeature.tagline || 'Premium Quality',
            description: homeFeature.description || '',
            image: homeFeature.imageUrl
        },
        // Defensive check: ensure tabs is an array and items are valid before mapping
        ...(Array.isArray(homeFeature.tabs) ? homeFeature.tabs : []).map((tab, idx) => {
            if (!tab) return null;
            return {
                id: `tab-${idx}`,
                title: tab.label || 'Feature',
                subtitle: 'Professional Grade',
                description: `Custom designed ${tab.label ? tab.label.toLowerCase() : 'gear'} crafted for durability, style, and team identity.`,
                image: tab.imageUrl
            };
        }).filter(slide => slide !== null) as { id: string; title: string; subtitle: string; description: string; image: string }[]
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const slideWidth = current.clientWidth;
            current.scrollBy({ left: direction === 'left' ? -slideWidth : slideWidth, behavior: 'smooth' });
        }
    };

    // Update active index on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const index = Math.round(scrollContainerRef.current.scrollLeft / scrollContainerRef.current.clientWidth);
                setActiveIndex(index);
            }
        };
        const el = scrollContainerRef.current;
        if (el) el.addEventListener('scroll', handleScroll);
        return () => el?.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle body scroll locking when modal is open
    useEffect(() => {
        if (selectedSlide) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedSlide]);

    return (
        <section className="bg-white py-0 md:py-8 lg:py-16">
            <div className="max-w-[1840px] mx-auto relative group">
                
                {/* Navigation Buttons - Simple & Centered - Hidden on Mobile */}
                <button 
                    onClick={() => scroll('left')} 
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 left-4 z-20 p-4 bg-white text-black rounded-full transition-all duration-300 shadow-md hover:scale-110 disabled:opacity-0 disabled:pointer-events-none ${activeIndex === 0 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                    disabled={activeIndex === 0}
                    aria-label="Previous slide"
                >
                    <ArrowLongRightIcon className="w-5 h-5 rotate-180" />
                </button>

                <button 
                    onClick={() => scroll('right')} 
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 right-4 z-20 p-4 bg-white text-black rounded-full transition-all duration-300 shadow-md hover:scale-110 disabled:opacity-0 disabled:pointer-events-none ${activeIndex === slides.length - 1 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                    disabled={activeIndex === slides.length - 1}
                    aria-label="Next slide"
                >
                    <ArrowLongRightIcon className="w-5 h-5" />
                </button>

                {/* Carousel - Full Width Single Frame */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth rounded-none md:rounded-[2.5rem]"
                >
                    {slides.map((slide) => (
                        <div 
                            key={slide.id}
                            className="min-w-full relative aspect-[3/4] md:aspect-[21/9] snap-center overflow-hidden bg-gray-100 cursor-pointer"
                            onClick={() => setSelectedSlide(slide)}
                        >
                            <LazyImage 
                                src={slide.image} 
                                alt={slide.title} 
                                aspectRatio="h-full w-full"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 pointer-events-none"></div>
                            
                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 p-6 md:p-16 text-white max-w-4xl pointer-events-none w-full">
                                <span className="inline-block px-2 py-1 md:px-3 mb-3 md:mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white text-black rounded-sm">
                                    {slide.subtitle}
                                </span>
                                <h3 className="font-eurostile text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-widest leading-[0.9] mb-3 md:mb-6 drop-shadow-xl break-words">
                                    {slide.title}
                                </h3>
                                <p className="text-xs sm:text-sm md:text-lg font-medium text-white/80 max-w-xl leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-none">
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicators - Simple Lines */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {slides.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-300 shadow-sm ${activeIndex === idx ? 'w-8 md:w-12 bg-white' : 'w-2 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            {/* POPUP MODAL - Improved Mobile Scaling */}
            {selectedSlide && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-8 animate-fade-in" 
                    onClick={() => setSelectedSlide(null)}
                >
                    <div 
                        className="relative w-full h-full md:max-w-screen-2xl md:max-h-[90vh] bg-zinc-900 md:rounded-[2rem] overflow-hidden shadow-2xl border-0 md:border border-white/10 flex flex-col group" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedSlide(null)}
                            className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md border border-white/20 active:scale-90"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        
                        <div className="relative w-full h-full">
                            <img 
                                src={selectedSlide.image} 
                                alt={selectedSlide.title} 
                                className="w-full h-full object-cover"
                            />
                            {/* Deep Gradient Overlay for text readability - Stronger on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 md:via-black/40 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 p-6 md:p-20 w-full overflow-y-auto max-h-[60vh] md:max-h-full no-scrollbar">
                                <div className="max-w-7xl pb-8 md:pb-0">
                                    <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 mb-4 md:mb-6 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] bg-white text-black rounded-sm">
                                        {selectedSlide.subtitle}
                                    </span>
                                    <h2 className="font-eurostile text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-widest leading-[0.9] mb-4 md:mb-8 text-white drop-shadow-2xl">
                                        {selectedSlide.title}
                                    </h2>
                                    <p className="text-sm sm:text-lg md:text-2xl font-medium text-white/90 leading-relaxed max-w-4xl drop-shadow-lg border-l-2 md:border-l-4 border-white pl-4 md:pl-6">
                                        {selectedSlide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HomeFeatureSection;
