
import React, { useMemo } from 'react';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import InfoCards from './InfoCards';
import HowItWorks from './HowItWorks';
import FeaturedVideo from './FeaturedVideo';
import CustomizationShowcase from './CustomizationShowcase';
import BrandReviews from './BrandReviews';
import FeaturedPartners from './FeaturedPartners';
import CallToAction from './CallToAction';
import HomeFeatureSection from './HomeFeatureSection';
import { Product, View, InfoCard, HeroContent, FeaturedVideoContent, BrandReview, PlatformRating, Partner } from '../types';

interface HomePageProps {
    onNavigate: (page: View, value?: string | null) => void;
    onProductClick: (product: Product) => void;
    onCardClick: (card: InfoCard) => void;
    allProducts: Product[];
    heroContents: HeroContent[];
    infoCards: InfoCard[];
    featuredVideoContent: FeaturedVideoContent;
    brandReviews: BrandReview[];
    platformRatings: PlatformRating[];
    partners: Partner[];
}

const HeroSection: React.FC<{ 
    hero: HeroContent, 
    allProducts: Product[], 
    onNavigate: any, 
    onProductClick: any, 
    isFirst: boolean 
}> = ({ hero, allProducts, onNavigate, onProductClick, isFirst }) => {
    const featuredProducts = useMemo(() => {
        if (!hero.featuredProductIds) return [];
        return hero.featuredProductIds
            .map(id => allProducts.find(p => p.id === id))
            .filter((p): p is Product => !!p);
    }, [hero, allProducts]);

    return (
        <div className="flex flex-col relative w-full">
            <Hero {...hero} onNavigate={onNavigate} isFirst={isFirst} />
            
            {featuredProducts.length > 0 && (
                <section className="bg-white py-24 px-4 border-b border-zinc-100 last:border-0 relative z-20">
                    <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em] block mb-4">Featured Collection</span>
                            <h2 className="font-eurostile font-black text-3xl lg:text-4xl tracking-tight text-gray-900 uppercase leading-none">
                                {hero.featuredProductsTitle || 'Selected Gear'}
                            </h2>
                        </div>
                        <ProductGrid products={featuredProducts} onProductClick={onProductClick} />
                    </div>
                </section>
            )}
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({
    onNavigate,
    onProductClick,
    onCardClick,
    allProducts,
    heroContents,
    infoCards,
    featuredVideoContent,
    brandReviews,
    platformRatings,
    partners
}) => {
    const sortedHeroes = useMemo(() => {
        return [...heroContents].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }, [heroContents]);

    const homeHero = sortedHeroes[0];
    const secondaryHeroes = sortedHeroes.slice(1);

    return (
        <div className="animate-fade-in bg-white w-full overflow-hidden">
            {homeHero && (
                <HeroSection 
                    hero={homeHero} 
                    allProducts={allProducts} 
                    onNavigate={onNavigate} 
                    onProductClick={onProductClick} 
                    isFirst={true} 
                />
            )}

            <div className="pb-32 lg:pb-48 pt-12">
                <InfoCards cards={infoCards} onCardClick={onCardClick} />
            </div>
            
            <HomeFeatureSection onNavigate={onNavigate} />

            {secondaryHeroes.map((hero) => (
                <HeroSection 
                    key={hero.id}
                    hero={hero}
                    allProducts={allProducts}
                    onNavigate={onNavigate}
                    onProductClick={onProductClick}
                    isFirst={false}
                />
            ))}

            <HowItWorks />
            
            {featuredVideoContent?.isVisible && <FeaturedVideo {...featuredVideoContent} />}
            
            <CustomizationShowcase />
            <BrandReviews brandReviews={brandReviews} platformRatings={platformRatings} />
            <div className="bg-zinc-50 py-24 lg:py-32">
                <FeaturedPartners partners={partners} />
            </div>
            <CallToAction onNavigate={onNavigate} />
        </div>
    );
};

export default HomePage;
