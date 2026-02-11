
import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { SearchIcon, TargetIcon, SparklesIcon, ProductionIcon, LogisticsIcon, ClockIcon } from './icons';
import { SubmittedQuote, QuoteStatus } from '../types';
import Button from './Button';

const StatusStep: React.FC<{ 
    label: string; 
    icon: React.ReactNode; 
    active: boolean; 
    completed: boolean; 
    isLast?: boolean;
}> = ({ label, icon, active, completed, isLast }) => (
    <div className={`flex-1 flex flex-col items-center relative ${isLast ? '' : 'group'}`}>
        {!isLast && (
            <div className={`absolute left-1/2 right-[-50%] top-6 h-[2px] z-0 ${completed ? 'bg-black' : 'bg-zinc-100'}`}></div>
        )}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-700 ${
            active ? 'bg-black text-white border-black shadow-xl scale-110' : 
            completed ? 'bg-black text-white border-black' : 
            'bg-white text-zinc-300 border-zinc-100'
        }`}>
            {icon}
        </div>
        <span className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center ${active ? 'text-black' : completed ? 'text-zinc-900' : 'text-zinc-400'}`}>
            {label}
        </span>
    </div>
);

const TrackProjectPage: React.FC = () => {
    const [searchId, setSearchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quote, setQuote] = useState<SubmittedQuote | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = searchId.trim().toUpperCase();
        if (!tid) return;

        setIsLoading(true);
        setError('');
        setQuote(null);

        try {
            const res = await fetch(`/api/track/${encodeURIComponent(tid)}`);
            if (res.ok) {
                const data = await res.json();
                setQuote(data);
            } else {
                setError('Order ID not found. Please double-check your ID.');
            }
        } catch (err) {
            setError('Could not connect. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const workflowSteps = [
        { label: 'Received', icon: <TargetIcon className="w-5 h-5"/>, statuses: ['New'] },
        { label: 'Consultation', icon: <SparklesIcon className="w-5 h-5"/>, statuses: ['Contacted'] },
        { label: 'In Production', icon: <ProductionIcon className="w-5 h-5"/>, statuses: ['In Progress'] },
        { label: 'Dispatched', icon: <LogisticsIcon className="w-5 h-5"/>, statuses: ['Completed'] }
    ];

    const getCurrentStepIndex = (status: QuoteStatus) => {
        if (status === 'Cancelled') return -1;
        return workflowSteps.findIndex(step => step.statuses.includes(status));
    };

    return (
        <div className="bg-white min-h-screen">
            <PageHeader 
                page="track-project" 
                fallbackTitle="Track Your Order" 
                fallbackDescription="Get real-time updates on the progress of your custom apparel." 
                fallbackImage="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
            />

            <div className="max-w-4xl mx-auto px-4 py-20">
                <section className="bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/20">
                    <h2 className="font-oswald text-2xl uppercase tracking-widest text-zinc-900 mb-8 text-center">Order Lookup</h2>
                    <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
                        <input 
                            type="text" 
                            value={searchId}
                            onChange={e => setSearchId(e.target.value)}
                            placeholder="YOUR ORDER ID (e.g. QT-12345678)"
                            className="w-full pl-6 pr-32 py-5 bg-white border border-zinc-200 rounded-2xl text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-black outline-none transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                            {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <SearchIcon className="w-4 h-4"/>}
                            <span>Check Status</span>
                        </button>
                    </form>
                    {error && <p className="text-center mt-6 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>}
                </section>

                {quote && (
                    <div className="mt-12 space-y-12 animate-fade-in-up">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-2xl">
                             <div className="flex justify-between items-center mb-12">
                                <div>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] block mb-1">Current Progress</span>
                                    <h3 className="font-oswald text-3xl uppercase tracking-widest">Order Status</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] block mb-1">Reference ID</span>
                                    <span className="text-sm font-mono font-black text-black">{quote.id}</span>
                                </div>
                             </div>

                             <div className="flex gap-4">
                                {workflowSteps.map((step, idx) => {
                                    const currentIdx = getCurrentStepIndex(quote.status);
                                    return (
                                        <StatusStep 
                                            key={step.label}
                                            label={step.label}
                                            icon={step.icon}
                                            active={currentIdx === idx}
                                            completed={currentIdx > idx}
                                            isLast={idx === workflowSteps.length - 1}
                                        />
                                    );
                                })}
                             </div>

                             {quote.status === 'Cancelled' && (
                                <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">!</div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-red-900">Order Cancelled</h4>
                                        <p className="text-[10px] text-red-700 uppercase tracking-widest mt-1">This project has been stopped. Please contact us for more information.</p>
                                    </div>
                                </div>
                             )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                                        <ClockIcon className="w-5 h-5 text-black"/>
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-widest">Order Details</h4>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex justify-between border-b border-zinc-100 pb-2">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</span>
                                        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{quote.contact.name}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-zinc-100 pb-2">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Created On</span>
                                        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{new Date(quote.submissionDate).toLocaleDateString()}</span>
                                    </li>
                                </ul>
                             </div>

                             <div className="bg-zinc-900 p-8 rounded-[2rem] text-white">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                        <TargetIcon className="w-5 h-5 text-white"/>
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-widest">Summary</h4>
                                </div>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                                    You have {quote.items.length} items in this order. Our team is working hard to ensure every stitch meets our quality standards.
                                </p>
                             </div>
                        </div>
                    </div>
                )}

                {!quote && !isLoading && (
                    <div className="mt-20 flex flex-col items-center opacity-20">
                         <div className="w-16 h-16 border-2 border-zinc-200 rounded-full flex items-center justify-center mb-6">
                            <ClockIcon className="w-8 h-8 text-zinc-400" />
                         </div>
                         <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Enter your ID to start tracking</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackProjectPage;
