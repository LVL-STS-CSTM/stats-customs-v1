
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { SubscriptionModalContent } from '../types';

const SubscriptionModalManagement: React.FC = () => {
    const { subscriptionModalContent, updateData } = useData();
    const [formData, setFormData] = useState<SubscriptionModalContent>(subscriptionModalContent);
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        setFormData(subscriptionModalContent);
    }, [subscriptionModalContent]);

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updateData('subscriptionModalContent', formData);
        if (success) {
            showToast('Signup popup settings saved!');
        }
    };

    const inputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-gray-300 bg-white text-gray-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm";
    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-1 mb-1";

    return (
        <div className="relative">
            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toast.message}
                </div>
            )}
            
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <header className="mb-8">
                    <h3 className="text-xl font-oswald uppercase tracking-widest text-gray-900">Newsletter Popup Settings</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Update the message and image of your newsletter signup.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Main Headline</label>
                                <input 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleInputChange} 
                                    className={inputClasses} 
                                    placeholder="e.g. Join The Inner Circle"
                                    required 
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Sub-headline / Message</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows={4} 
                                    className={inputClasses} 
                                    placeholder="Explain the benefits of joining..."
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Popup Image URL</label>
                                <input 
                                    name="imageUrl" 
                                    type="url" 
                                    value={formData.imageUrl} 
                                    onChange={handleInputChange} 
                                    className={inputClasses} 
                                    placeholder="https://images.pexels.com/..."
                                    required 
                                />
                            </div>
                        </div>

                        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex flex-col items-center justify-center">
                            <span className={labelClasses}>Live Preview Mockup</span>
                            <div className="mt-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex w-full max-w-sm aspect-[4/3] border border-zinc-200">
                                <div className="w-1/2 bg-zinc-200 overflow-hidden">
                                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                                <div className="w-1/2 p-4 flex flex-col justify-center text-center">
                                    <h4 className="text-[10px] font-black uppercase leading-tight">{formData.title}</h4>
                                    <p className="text-[7px] text-zinc-400 mt-2 line-clamp-3 uppercase tracking-tighter">{formData.description}</p>
                                    <div className="mt-4 h-6 w-full bg-zinc-100 rounded-lg"></div>
                                    <div className="mt-2 h-6 w-full bg-black rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex justify-end">
                        <button 
                            type="submit" 
                            className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                        >
                            Update Popup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubscriptionModalManagement;
