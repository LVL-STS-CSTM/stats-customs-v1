import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useData } from '../context/DataContext';
import { SubmittedQuote, QuoteStatus } from '../types';
import QuoteDetailModal from './QuoteDetailModal';
import ProductManagement from './ProductManagement';
import DashboardAnalytics from './DashboardAnalytics';
import FaqManagement from './FaqManagement';
import HeroManagement from './HeroManagement';
import CollectionManagement from './CollectionManagement';
import PartnerManagement from './PartnerManagement';
import HowWeWorkManagement from './HowWeWorkManagement';
import FabricManagement from './FabricManagement';
import SubscriptionManagement from './SubscriptionManagement';
import EmailMarketing from './EmailMarketing';
import InfoCardManagement from './InfoCardManagement';
import FeaturedVideoManagement from './FeaturedVideoManagement';
import BrandReviewManagement from './BrandReviewManagement';
import PlatformRatingManagement from './PlatformRatingManagement';
import CommunityManagement from './CommunityManagement';
import PageBannerManagement from './PageBannerManagement';
import SecurityManagement from './SecurityManagement';
import ServiceManagement from './ServiceManagement';
import SubscriptionModalManagement from './SubscriptionModalManagement';
import HomeFeatureManagement from './HomeFeatureManagement';

const STATUSES: QuoteStatus[] = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'];

const QuoteManagement: React.FC = () => {
    const { submittedQuotes, updateQuoteStatus, fetchAdminData } = useAdmin();
    const [selectedQuote, setSelectedQuote] = useState<SubmittedQuote | null>(null);
    const [filterTab, setFilterTab] = useState<'all' | 'orders' | 'quotes'>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    
    useEffect(() => {
        if (submittedQuotes.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, submittedQuotes.length]);

    const filteredQuotes = useMemo(() => {
        let items = [...submittedQuotes];
        if (filterTab === 'orders') items = items.filter(q => q.id.startsWith('ORD'));
        if (filterTab === 'quotes') items = items.filter(q => q.id.startsWith('QT'));
        
        return items.sort((a, b) => {
            const dateA = new Date(a.submissionDate).getTime();
            const dateB = new Date(b.submissionDate).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [submittedQuotes, filterTab, sortOrder]);

    const counts = useMemo(() => ({
        all: submittedQuotes.length,
        orders: submittedQuotes.filter(q => q.id.startsWith('ORD')).length,
        quotes: submittedQuotes.filter(q => q.id.startsWith('QT')).length
    }), [submittedQuotes]);

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-xl rounded-[2rem] border border-gray-100 overflow-hidden">
                <header className="px-8 py-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/30">
                    <div className="flex gap-1.5 p-1 bg-zinc-100 rounded-2xl w-fit">
                        {[
                            { id: 'all', label: 'All Inquiries', count: counts.all },
                            { id: 'orders', label: 'Store Orders', count: counts.orders },
                            { id: 'quotes', label: 'Custom Requests', count: counts.quotes }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setFilterTab(tab.id as any)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterTab === tab.id ? 'bg-black text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                {tab.label} <span className="ml-1 opacity-50">{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sort By</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            className="px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-black outline-none"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </header>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Reference ID</th>
                                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Customer Name</th>
                                <th className="px-8 py-5 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Order Status</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black text-zinc-300 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredQuotes.map((quote) => (
                                <tr key={quote.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-mono font-black text-gray-900">{quote.id}</span>
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase">{new Date(quote.submissionDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{quote.contact.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{quote.contact.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <select
                                            value={quote.status}
                                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value as QuoteStatus)}
                                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                                                quote.status === 'New' ? 'border-zinc-100 bg-zinc-50 text-zinc-400' :
                                                quote.status === 'Completed' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                                                quote.status === 'Cancelled' ? 'border-red-100 bg-red-50 text-red-600' :
                                                'border-black bg-black text-white shadow-md'
                                            }`}
                                        >
                                            {STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => setSelectedQuote(quote)} 
                                            className="px-6 py-2.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all active:scale-95 shadow-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredQuotes.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-20 text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">
                                        No inquiries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedQuote && (
                <QuoteDetailModal 
                    quote={selectedQuote} 
                    isOpen={!!selectedQuote} 
                    onClose={() => setSelectedQuote(null)} 
                />
            )}
        </div>
    )
}

const AdminDashboard: React.FC = () => {
    const { logout, subscriptions, submittedQuotes, fetchAdminData } = useAdmin();
    const { fetchData, isLoading: isDataSyncing } = useData();
    const [activeTab, setActiveTab] = useState<'analytics' | 'quotes' | 'products' | 'collections' | 'subscriptions' | 'email-marketing' | 'content' | 'security'>('analytics');
    const [contentSubTab, setContentSubTab] = useState<'banners' | 'feature-section' | 'page-headers' | 'info-cards' | 'featured-video' | 'services' | 'materials' | 'how-we-work' | 'partners' | 'brand-reviews' | 'platform-ratings' | 'faqs' | 'community' | 'signup-popup'>('banners');

    const handleRefresh = async () => {
        await Promise.all([fetchAdminData(), fetchData()]);
    };

    const contentSubTabs = [
        { id: 'banners', label: 'Home Hero' },
        { id: 'feature-section', label: 'Home Feature' },
        { id: 'page-headers', label: 'Page Banners' },
        { id: 'info-cards', label: 'Info Cards' },
        { id: 'featured-video', label: 'Video Feature' },
        { id: 'signup-popup', label: 'Signup Popup' },
        { id: 'services', label: 'Services' },
        { id: 'materials', label: 'Fabrics' },
        { id: 'how-we-work', label: 'Process' },
        { id: 'partners', label: 'Partners' },
        { id: 'brand-reviews', label: 'Reviews' },
        { id: 'platform-ratings', label: 'Ratings' },
        { id: 'faqs', label: 'FAQs' },
        { id: 'community', label: 'Community' },
    ];

    const mainTabs = [
        { id: 'analytics', label: 'Dashboard' },
        { id: 'quotes', label: 'Inquiries', count: submittedQuotes.length },
        { id: 'products', label: 'Products' },
        { id: 'collections', label: 'Collections' },
        { id: 'subscriptions', label: 'Audience', count: subscriptions.length },
        { id: 'email-marketing', label: 'Marketing' },
        { id: 'content', label: 'Site Content' },
        { id: 'security', label: 'Admin Settings' }
    ];

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10 bg-zinc-50 font-sans selection:bg-black selection:text-white">
            <div className="max-w-[1600px] mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                             <img src="https://i.imgur.com/OIYeMvS.png" alt="STATS" className="h-10 w-auto" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-eurostile font-black uppercase tracking-tighter text-gray-900 leading-none">Admin Dashboard</h1>
                                <span className="bg-zinc-200 text-zinc-900 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-zinc-300">Stats PH v2.1</span>
                            </div>
                            <p className="text-gray-400 mt-1 text-xs font-bold tracking-widest uppercase opacity-70">Store Management Interface</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleRefresh}
                            disabled={isDataSyncing}
                            className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-all active:rotate-180 duration-500 disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <svg className={`w-4 h-4 text-gray-400 ${isDataSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                            <span className={`w-2 h-2 rounded-full ${isDataSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isDataSyncing ? 'Syncing...' : 'System Ready'}</span>
                        </div>
                        <button 
                            onClick={logout} 
                            className="px-8 py-3 bg-red-50 text-red-600 font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="lg:w-72 flex-shrink-0">
                        <nav className="flex flex-col gap-2 sticky top-28">
                            {mainTabs.map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)} 
                                    className={`group flex items-center justify-between py-5 px-8 rounded-3xl transition-all duration-500 ${
                                        activeTab === tab.id 
                                        ? 'bg-black text-white shadow-2xl translate-x-2' 
                                        : 'bg-white text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-100'
                                    }`}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-zinc-50 text-zinc-400'}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-grow min-w-0">
                        <div className="animate-fade-in [animation-duration:800ms]">
                            {activeTab === 'analytics' && <DashboardAnalytics />}
                            {activeTab === 'quotes' && <QuoteManagement />}
                            {activeTab === 'products' && <ProductManagement />}
                            {activeTab === 'collections' && <CollectionManagement />}
                            {activeTab === 'subscriptions' && <SubscriptionManagement />}
                            {activeTab === 'email-marketing' && <EmailMarketing />}
                            {activeTab === 'security' && <SecurityManagement />}
                            {activeTab === 'content' && (
                                <div className="space-y-8">
                                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 overflow-x-auto no-scrollbar">
                                        <div className="flex items-center gap-2 min-w-max">
                                            {contentSubTabs.map(tab => (
                                                <button 
                                                    key={tab.id}
                                                    onClick={() => setContentSubTab(tab.id as any)} 
                                                    className={`px-5 py-3 text-[9px] font-black uppercase tracking-widest rounded-full transition-all border ${
                                                        contentSubTab === tab.id 
                                                        ? 'bg-black text-white border-black shadow-lg' 
                                                        : 'bg-zinc-50 text-gray-400 border-zinc-100 hover:border-zinc-400 hover:text-black'
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="animate-fade-in-up [animation-duration:600ms]">
                                        {contentSubTab === 'faqs' && <FaqManagement />}
                                        {contentSubTab === 'banners' && <HeroManagement />}
                                        {contentSubTab === 'page-headers' && <PageBannerManagement />}
                                        {contentSubTab === 'partners' && <PartnerManagement />}
                                        {contentSubTab === 'how-we-work' && <HowWeWorkManagement />}
                                        {contentSubTab === 'materials' && <FabricManagement />}
                                        {contentSubTab === 'info-cards' && <InfoCardManagement />}
                                        {contentSubTab === 'featured-video' && <FeaturedVideoManagement />}
                                        {contentSubTab === 'brand-reviews' && <BrandReviewManagement />}
                                        {contentSubTab === 'platform-ratings' && <PlatformRatingManagement />}
                                        {contentSubTab === 'community' && <CommunityManagement />}
                                        {contentSubTab === 'services' && <ServiceManagement />}
                                        {contentSubTab === 'signup-popup' && <SubscriptionModalManagement />}
                                        {contentSubTab === 'feature-section' && <HomeFeatureManagement />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;