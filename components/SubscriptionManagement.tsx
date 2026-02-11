
import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const SubscriptionManagement: React.FC = () => {
    const { subscriptions, fetchAdminData } = useAdmin();
    const [copyStatus, setCopyStatus] = useState('Copy All Emails');

    useEffect(() => {
        if (subscriptions.length === 0) {
            fetchAdminData();
        }
    }, [fetchAdminData, subscriptions.length]);

    const handleCopyEmails = () => {
        const emailList = subscriptions.map(s => s.email).join(', ');
        navigator.clipboard.writeText(emailList);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy All Emails'), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-xl rounded-[2.5rem] border border-gray-100 overflow-hidden">
                <header className="px-10 py-10 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-50/30">
                    <div>
                        <h2 className="text-xl font-oswald uppercase tracking-widest text-gray-900 leading-none">Audience Management</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Registered newsletter subscribers</p>
                    </div>
                    <button 
                        onClick={handleCopyEmails}
                        className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10"
                    >
                        {copyStatus}
                    </button>
                </header>
                
                <div className="overflow-x-auto no-scrollbar">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-10 py-6 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Email Address</th>
                                <th className="px-10 py-6 text-left text-[9px] font-black text-zinc-300 uppercase tracking-widest">Date Subscribed</th>
                                <th className="px-10 py-6 text-right text-[9px] font-black text-zinc-300 uppercase tracking-widest">Platform</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[...subscriptions]
                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((sub, index) => (
                                    <tr key={index} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{sub.email}</span>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-mono font-black text-gray-900">{new Date(sub.date).toLocaleDateString()}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase">{new Date(sub.date).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap text-right">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Website UI</span>
                                        </td>
                                    </tr>
                                ))
                            }
                            {subscriptions.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-32 text-zinc-200 text-[10px] font-black uppercase tracking-[0.5em]">
                                        No subscribers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionManagement;
