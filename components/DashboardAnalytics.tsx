
import React, { useEffect, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useData } from '../context/DataContext';
import { SubmittedQuote } from '../types';

const StatCard: React.FC<{title: string, value: string | number, description: string, accent?: boolean, trend?: string}> = ({title, value, description, accent, trend}) => (
    <div className={`p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-700 hover:-translate-y-2 group relative overflow-hidden ${accent ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-100'}`}>
        {accent && <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-600/20 blur-[60px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-zinc-600/40 transition-colors"></div>}
        
        <div className="flex justify-between items-start relative z-10">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 font-eurostile ${accent ? 'text-zinc-400' : 'text-gray-400'}`}>{title}</h3>
            {trend && <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${accent ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-600'}`}>{trend}</span>}
        </div>
        
        <p className={`text-6xl font-eurostile tracking-tighter leading-none mb-6 ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        <p className={`text-xs font-bold tracking-tight uppercase ${accent ? 'text-zinc-400' : 'text-gray-400'}`}>{description}</p>
    </div>
);


const DashboardAnalytics: React.FC = () => {
    const { submittedQuotes, subscriptions, fetchAdminData } = useAdmin();
    const { products } = useData();

    useEffect(() => {
        if (submittedQuotes.length === 0 || subscriptions.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, submittedQuotes.length, subscriptions.length]);

    const stats = useMemo(() => {
        const total = submittedQuotes.length;
        const orders = submittedQuotes.filter(q => q.id.startsWith('ORD')).length;
        const quotes = total - orders;
        const newItems = submittedQuotes.filter(q => q.status === 'New').length;
        const totalSubscribers = subscriptions.length;
        
        return { total, orders, quotes, newItems, totalSubscribers };
    }, [submittedQuotes, subscriptions]);

    const recentActivity = [...submittedQuotes]
        .sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
        .slice(0, 8);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    title="Store Activity" 
                    value={stats.total} 
                    description={`Orders: ${stats.orders} | Quotes: ${stats.quotes}`} 
                    trend="+12% Increase"
                />
                <StatCard 
                    title="Pending Action" 
                    value={stats.newItems} 
                    description="New requests waiting for follow-up" 
                    accent={stats.newItems > 0} 
                    trend={stats.newItems > 0 ? "ACTION NEEDED" : "ALL CAUGHT UP"}
                />
                <StatCard 
                    title="Total Audience" 
                    value={stats.totalSubscribers} 
                    description="Verified email subscribers" 
                    trend="GROWING"
                />
                <StatCard 
                    title="Total Products" 
                    value={products.length} 
                    description="Active items in your store catalogue" 
                    trend="UP TO DATE"
                />
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                <header className="px-10 py-10 border-b border-gray-50 flex items-center justify-between bg-zinc-50/50">
                    <div>
                        <h2 className="text-xl font-oswald uppercase tracking-widest text-gray-900 leading-none">Recent Activity</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Latest inquiries and store orders</p>
                    </div>
                </header>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-50">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-10 py-6 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Date Submitted</th>
                                <th className="px-10 py-6 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Type</th>
                                <th className="px-10 py-6 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Customer</th>
                                <th className="px-10 py-6 text-right text-[9px] font-black text-zinc-300 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentActivity.map((quote: SubmittedQuote) => (
                                <tr key={quote.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-10 py-6 whitespace-nowrap text-xs font-mono text-zinc-400">{new Date(quote.submissionDate).toLocaleDateString()}</td>
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                            quote.id.startsWith('ORD') ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-indigo-100 bg-indigo-50 text-indigo-600'
                                        }`}>
                                            {quote.id.startsWith('ORD') ? 'Store Order' : 'Quote Request'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-zinc-900 group-hover:text-black transition-colors uppercase">{quote.contact.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{quote.contact.company || 'Personal Order'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap text-right">
                                        <span className={`px-4 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full ${
                                            quote.status === 'New' ? 'bg-zinc-900 text-white shadow-lg shadow-black/10' :
                                            quote.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                            'bg-zinc-100 text-zinc-400'
                                        }`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics;
