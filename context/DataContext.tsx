import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, FaqItem, HeroContent, Partner, HowWeWorkSection, Material, InfoCard, FeaturedVideoContent, BrandReview, PlatformRating, CommunityPost, PageBanner, Collection, Service, Capability, SubscriptionModalContent, HomeFeature } from '../types';
import { initialProductsData, initialCollectionsData } from './initialProductData';
import { 
    initialFaqData, 
    initialHeroData, 
    initialPartnerData, 
    initialHowWeWorkData, 
    initialMaterialData, 
    initialInfoCardData, 
    initialFeaturedVideoData, 
    initialBrandReviewData, 
    initialPlatformRatingData, 
    initialCommunityPostData,
    initialPageBannerData,
    initialServiceData,
    initialCapabilityData,
    initialSubscriptionModalData,
    initialHomeFeatureData
} from './initialContentData';

interface DataContextType {
    products: Product[];
    collections: Collection[];
    faqs: FaqItem[];
    heroContents: HeroContent[];
    partners: Partner[];
    howWeWorkSections: HowWeWorkSection[];
    materials: Material[];
    infoCards: InfoCard[];
    featuredVideoContent: FeaturedVideoContent;
    brandReviews: BrandReview[];
    platformRatings: PlatformRating[];
    communityPosts: CommunityPost[];
    pageBanners: PageBanner[];
    services: Service[];
    capabilities: Capability[];
    subscriptionModalContent: SubscriptionModalContent;
    homeFeature: HomeFeature;
    isLoading: boolean;
    error: string | null;
    updateData: <T>(key: string, data: T) => Promise<boolean>;
    fetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const dataKeys = [
    'products', 'collections', 'faqs', 'heroContents', 'partners',
    'howWeWorkSections', 'materials', 'infoCards', 'featuredVideoContent',
    'brandReviews', 'platformRatings', 'communityPosts', 'pageBanners',
    'services', 'capabilities', 'subscriptionModalContent', 'homeFeature'
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<Partial<Omit<DataContextType, 'isLoading' | 'error' | 'updateData' | 'fetchData'>>>({
        products: initialProductsData,
        collections: initialCollectionsData,
        faqs: initialFaqData,
        heroContents: initialHeroData,
        partners: initialPartnerData,
        howWeWorkSections: initialHowWeWorkData,
        materials: initialMaterialData,
        infoCards: initialInfoCardData,
        featuredVideoContent: initialFeaturedVideoData,
        brandReviews: initialBrandReviewData,
        platformRatings: initialPlatformRatingData,
        communityPosts: initialCommunityPostData,
        pageBanners: initialPageBannerData,
        services: initialServiceData,
        capabilities: initialCapabilityData,
        subscriptionModalContent: initialSubscriptionModalData,
        homeFeature: initialHomeFeatureData,
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const responses = await Promise.all(dataKeys.map(key =>
                fetch(`/api/data/${key}`).then(async res => {
                    if (!res.ok) return null;
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        return res.json();
                    }
                    return null;
                }).catch(() => null)
            ));

            const newData: any = {};
            let hasNewData = false;

            responses.forEach((resData, index) => {
                if (resData !== null) {
                    newData[dataKeys[index]] = resData;
                    hasNewData = true;
                }
            });
            
            if (hasNewData) {
                setData(prev => ({ ...prev, ...newData }));
            }

        } catch (err: any) {
            console.warn("API unavailable, using fallback data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async <T,>(key: string, newData: T): Promise<boolean> => {
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch(`/api/data/${key}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) throw new Error(`Update failed: ${response.status}`);

            setData(prev => ({ ...prev, [key]: newData }));
            return true;

        } catch (err: any) {
            console.error(`Failed to update ${key}:`, err);
            return false;
        }
    };

    const value: DataContextType = {
        products: data.products || [],
        collections: data.collections || [],
        faqs: data.faqs || [],
        heroContents: data.heroContents || [],
        partners: data.partners || [],
        howWeWorkSections: data.howWeWorkSections || [],
        materials: data.materials || [],
        infoCards: data.infoCards || [],
        featuredVideoContent: data.featuredVideoContent || initialFeaturedVideoData,
        brandReviews: data.brandReviews || [],
        platformRatings: data.platformRatings || [],
        communityPosts: data.communityPosts || [],
        pageBanners: data.pageBanners || [],
        services: data.services || [],
        capabilities: data.capabilities || [],
        subscriptionModalContent: data.subscriptionModalContent || initialSubscriptionModalData,
        homeFeature: data.homeFeature || initialHomeFeatureData,
        isLoading,
        error,
        updateData,
        fetchData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};