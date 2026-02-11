
import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { View, Product, InfoCard } from './types';
import { QuoteProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import QuoteModal from './components/Cart';
import CategoryLandingPage from './components/CategoryLandingPage';
import Toast from './components/Toast';
import SearchModal from './components/SearchModal';
import PasswordModal from './components/PasswordModal';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { Router } from './services/router';

// Lazy loaded heavy components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const MockupGeneratorPage = lazy(() => import('./components/MockupGeneratorPage'));
const TrackProjectPage = lazy(() => import('./components/TrackProjectPage'));
const CataloguePage = lazy(() => import('./components/CataloguePage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const PartnersPage = lazy(() => import('./components/PartnersPage'));
const FaqPage = lazy(() => import('./components/FaqPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const FabricsPage = lazy(() => import('./components/FabricsPage'));
const CommunityPage = lazy(() => import('./components/CommunityPage'));
const HowWeWorkPage = lazy(() => import('./components/HowWeWorkPage'));
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage'));
const ReturnPolicyPage = lazy(() => import('./components/ReturnPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const SubscriptionModal = lazy(() => import('./components/SubscriptionModal'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-zinc-100 border-t-black rounded-full animate-spin"></div>
    </div>
);

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [initialColor, setInitialColor] = useState<string | null>(null);
    const [catalogueFilter, setCatalogueFilter] = useState<{ type: 'group' | 'category' | 'gender'; value: string } | null>(null);
    
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    
    const [toastMessage, setToastMessage] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const { isAuthenticated, login } = useAdmin();
    const { 
        products: allProducts, collections, faqs: faqData, materials, 
        heroContents, infoCards, featuredVideoContent, brandReviews, platformRatings, partners,
        isLoading: isDataLoading 
    } = useData();

    const knownViews = ['home', 'product', 'catalogue', 'browse', 'about', 'partners', 'contact', 'faq', 'admin', 'services', 'terms-of-service', 'return-policy', 'privacy-policy', 'materials', 'community', 'how-we-work', 'mockup-generator', 'track-project', 'checkout'];
    const knownGroups = useMemo(() => collections.map(c => c.name), [collections]);

    const parseUrl = useCallback(() => {
        const { page, filter, id, color } = Router.parseUrl(window.location.pathname, knownViews, knownGroups);
        
        setCatalogueFilter(filter);
        setSelectedProductId(id);
        setInitialColor(color);

        if (page === 'admin' && !isAuthenticated) {
            setIsPasswordModalOpen(true);
        }
        
        setView(page);
    }, [isAuthenticated, knownGroups]);

    useEffect(() => {
        window.addEventListener('popstate', parseUrl);
        if (!isDataLoading) parseUrl();

        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const splashTimer = setTimeout(() => setIsAppLoading(false), 1500);
        const visibilityTimer = setTimeout(() => setIsSplashVisible(false), 3000);
        
        const subTimer = setTimeout(() => {
            if (!localStorage.getItem('subscriptionModalDismissed')) setIsSubscriptionModalOpen(true);
        }, 8000);

        return () => {
            window.removeEventListener('popstate', parseUrl);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(splashTimer);
            clearTimeout(visibilityTimer);
            clearTimeout(subTimer);
        };
    }, [parseUrl, isDataLoading]);

    const handleNavigate = (page: View, value: string | null = null, color: string | null = null) => {
        let params: any = {};
        if (page === 'catalogue' && value) {
            const isGroup = collections.some(c => c.name === value);
            const isGender = ['Men', 'Women', 'Unisex'].includes(value);
            params = isGroup ? { group: value } : { type: isGender ? 'gender' : 'category', value };
        } else if (page === 'product' && value) {
            const product = allProducts.find(p => p.id === value);
            params = { id: value, group: product?.categoryGroup, color };
        }
        
        const newPath = Router.getPath(page, params);
        
        // Only push state if the path actually changed
        if (window.location.pathname !== newPath) {
            window.history.pushState({}, '', newPath);
            parseUrl(); // Manually trigger state update since pushState doesn't fire popstate
        }
        
        window.scrollTo(0, 0);
    };

    const handleProductClick = (product: Product) => handleNavigate('product', product.id);

    const handleCardClick = (card: InfoCard) => {
        if (card.linkType === 'page') handleNavigate(card.linkValue as View);
        else if (card.linkType === 'modal') {
            if (card.linkValue === 'subscribe') setIsSubscriptionModalOpen(true);
            if (card.linkValue === 'search') setIsSearchModalOpen(true);
        } else if (card.linkType === 'external') window.open(card.linkValue, '_blank', 'noopener,noreferrer');
    };

    const handlePasswordSubmit = async (password: string, username: string) => {
        const success = await login(username, password);
        if (success) {
            setIsPasswordModalOpen(false);
            handleNavigate('admin');
        } else {
            setToastMessage("Invalid credentials.");
        }
    };

    const renderView = () => {
        if (isDataLoading) return <LoadingFallback />;

        const homePageProps = {
            onNavigate: handleNavigate,
            onProductClick: handleProductClick,
            onCardClick: handleCardClick,
            allProducts, heroContents, infoCards, featuredVideoContent, brandReviews, platformRatings, partners
        };

        switch (view) {
            case 'home': return <HomePage {...homePageProps} />;
            case 'browse': return <CategoryLandingPage onNavigate={handleNavigate} />;
            case 'catalogue': return <Suspense fallback={<LoadingFallback />}><CataloguePage products={allProducts} onProductClick={handleProductClick} initialFilter={catalogueFilter} onNavigate={handleNavigate} /></Suspense>;
            case 'product':
                const product = allProducts.find(p => p.id === selectedProductId);
                return product ? (
                    <ProductPage 
                        product={product} 
                        initialColorName={initialColor}
                        onNavigate={handleNavigate} 
                        showToast={setToastMessage} 
                        materials={materials} 
                        allProducts={allProducts} 
                        onProductClick={handleProductClick} 
                    />
                ) : <div className="text-center py-20 font-oswald text-xl uppercase tracking-widest">Product Not Found</div>;
            case 'about': return <Suspense fallback={<LoadingFallback />}><AboutPage onNavigate={handleNavigate} /></Suspense>;
            case 'partners': return <Suspense fallback={<LoadingFallback />}><PartnersPage onNavigate={handleNavigate} /></Suspense>;
            case 'faq': return <Suspense fallback={<LoadingFallback />}><FaqPage faqData={faqData} /></Suspense>;
            case 'contact': return <Suspense fallback={<LoadingFallback />}><ContactPage showToast={setToastMessage} /></Suspense>;
            case 'admin': return isAuthenticated ? <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense> : <HomePage {...homePageProps} />;
            case 'services': return <Suspense fallback={<LoadingFallback />}><ServicesPage onNavigate={handleNavigate} /></Suspense>;
            case 'materials': return <Suspense fallback={<LoadingFallback />}><FabricsPage /></Suspense>;
            case 'community': return <Suspense fallback={<LoadingFallback />}><CommunityPage onNavigate={handleNavigate} /></Suspense>;
            case 'how-we-work': return <Suspense fallback={<LoadingFallback />}><HowWeWorkPage /></Suspense>;
            case 'mockup-generator': return <Suspense fallback={<LoadingFallback />}><MockupGeneratorPage /></Suspense>;
            case 'track-project': return <Suspense fallback={<LoadingFallback />}><TrackProjectPage /></Suspense>;
            case 'terms-of-service': return <Suspense fallback={<LoadingFallback />}><TermsOfServicePage /></Suspense>;
            case 'return-policy': return <Suspense fallback={<LoadingFallback />}><ReturnPolicyPage /></Suspense>;
            case 'privacy-policy': return <Suspense fallback={<LoadingFallback />}><PrivacyPolicyPage /></Suspense>;
            case 'checkout': return <Suspense fallback={<LoadingFallback />}><CheckoutPage onNavigate={handleNavigate} showToast={setToastMessage} /></Suspense>;
            default: return <div className="text-center py-20 font-oswald text-xl uppercase tracking-widest">Page Not Found</div>;
        }
    };

    return (
        <ErrorBoundary>
            <div className="font-sans min-h-screen flex flex-col bg-white selection:bg-black selection:text-white">
                {isSplashVisible && <SplashScreen isFadingOut={!isAppLoading && !isDataLoading} />}
                {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

                <Header 
                    onNavigate={handleNavigate} 
                    onQuoteClick={() => setIsQuoteModalOpen(true)} 
                    onSearchClick={() => setIsSearchModalOpen(true)} 
                    onSubscribeClick={() => setIsSubscriptionModalOpen(true)} 
                    view={view} 
                    catalogueFilter={catalogueFilter} 
                    isScrolled={isScrolled} 
                />

                <main className={`flex-grow transition-opacity duration-700 ${isAppLoading || isDataLoading ? 'opacity-0' : 'opacity-100'} ${view === 'home' || view === 'checkout' ? 'pt-0' : 'pt-14'}`}>
                    {renderView()}
                </main>

                {view !== 'checkout' && <Footer onNavigate={handleNavigate} />}

                <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} onCheckout={() => { setIsQuoteModalOpen(false); handleNavigate('checkout'); }} />
                <SearchModal 
                    isOpen={isSearchModalOpen} 
                    onClose={() => setIsSearchModalOpen(false)} 
                    products={allProducts} 
                    onProductClick={(p) => { handleProductClick(p); setIsSearchModalOpen(false); }} 
                    onNavigate={(page, val) => { handleNavigate(page, val); setIsSearchModalOpen(false); }} 
                    collections={collections.map(c => c.name)} faqs={faqData} materials={materials} 
                />
                <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordSubmit} />
                <Suspense fallback={null}>
                    <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} showToast={setToastMessage} />
                </Suspense>
            </div>
        </ErrorBoundary>
    );
};

const App: React.FC = () => (
    <DataProvider>
        <AdminProvider>
            <QuoteProvider>
                <AppContent />
            </QuoteProvider>
        </AdminProvider>
    </DataProvider>
);

export default App;
