
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { HomeFeature, HomeFeatureTab } from '../types';
import { PlusIcon, TrashIcon } from './icons';

const HomeFeatureManagement: React.FC = () => {
    const { homeFeature, updateData } = useData();
    const [formData, setFormData] = useState<HomeFeature>(homeFeature);
    const [newTabLabel, setNewTabLabel] = useState('');
    const [newTabImage, setNewTabImage] = useState('');
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        setFormData(homeFeature);
    }, [homeFeature]);

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, isVisible: e.target.checked }));
    };

    const handleAddTab = () => {
        if (newTabLabel.trim() && newTabImage.trim()) {
            const newTab: HomeFeatureTab = {
                label: newTabLabel.trim(),
                imageUrl: newTabImage.trim()
            };
            setFormData(prev => ({ ...prev, tabs: [...prev.tabs, newTab] }));
            setNewTabLabel('');
            setNewTabImage('');
        } else {
            alert('Please enter both a label and an image URL for the slide.');
        }
    };

    const handleRemoveTab = (index: number) => {
        setFormData(prev => ({ ...prev, tabs: prev.tabs.filter((_, i) => i !== index) }));
    };

    const handleTabChange = (index: number, field: keyof HomeFeatureTab, value: string) => {
        const updatedTabs = [...formData.tabs];
        updatedTabs[index] = { ...updatedTabs[index], [field]: value };
        setFormData(prev => ({ ...prev, tabs: updatedTabs }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updateData('homeFeature', formData);
        if (success) {
            showToast('Feature section updated successfully!');
        }
    };

    const inputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm text-gray-900";
    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-1 mb-1";

    return (
        <div className="relative">
            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toast.message}
                </div>
            )}

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-oswald uppercase tracking-widest text-gray-900">Homepage Feature Section</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage the horizontal scrolling showcase</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Visible</label>
                        <input 
                            type="checkbox" 
                            checked={formData.isVisible} 
                            onChange={handleCheckboxChange}
                            className="w-5 h-5 accent-black"
                        />
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Main Slide Content */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4">Main Title Slide</h4>
                            <div>
                                <label className={labelClasses}>Main Image URL</label>
                                <input 
                                    name="imageUrl" 
                                    type="url"
                                    value={formData.imageUrl} 
                                    onChange={handleInputChange} 
                                    className={inputClasses} 
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Small Tagline</label>
                                <input 
                                    name="tagline" 
                                    value={formData.tagline} 
                                    onChange={handleInputChange} 
                                    className={inputClasses} 
                                    placeholder="e.g. Durable & Professional"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Main Headline</label>
                                <textarea 
                                    name="headline" 
                                    value={formData.headline} 
                                    onChange={handleInputChange} 
                                    rows={2}
                                    className={inputClasses} 
                                    placeholder="e.g. Custom Uniforms for Companies"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Description Paragraph</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows={3}
                                    className={inputClasses} 
                                    placeholder="Detailed description text..."
                                />
                            </div>
                        </div>

                        {/* Additional Slides Management */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4">Additional Slides</h4>
                            
                            {/* Add New Slide */}
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                <label className={labelClasses}>Add New Slide</label>
                                <div className="grid grid-cols-1 gap-3 mt-2">
                                    <input 
                                        value={newTabLabel}
                                        onChange={(e) => setNewTabLabel(e.target.value)}
                                        className={inputClasses} 
                                        placeholder="Slide Title (e.g. Custom Bags)"
                                    />
                                    <input 
                                        value={newTabImage}
                                        onChange={(e) => setNewTabImage(e.target.value)}
                                        className={inputClasses} 
                                        placeholder="Image URL (e.g. https://...)"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddTab}
                                        className="mt-2 w-full py-3 bg-zinc-900 text-white rounded-xl hover:bg-black transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <PlusIcon className="w-4 h-4" /> Add Slide
                                    </button>
                                </div>
                            </div>

                            {/* List Existing Slides */}
                            <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
                                {formData.tabs.map((tab, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm relative group">
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveTab(idx)}
                                            className="absolute top-2 right-2 p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors z-10"
                                            title="Remove Slide"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                        
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                                <img src={tab.imageUrl} alt={tab.label} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <input 
                                                    value={tab.label}
                                                    onChange={(e) => handleTabChange(idx, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold"
                                                    placeholder="Slide Label"
                                                />
                                                <input 
                                                    value={tab.imageUrl}
                                                    onChange={(e) => handleTabChange(idx, 'imageUrl', e.target.value)}
                                                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-gray-500"
                                                    placeholder="Image URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {formData.tabs.length === 0 && (
                                    <p className="text-center text-zinc-400 text-xs py-4">No additional slides added.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 flex justify-end">
                        <button 
                            type="submit" 
                            className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                        >
                            Save Feature Section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomeFeatureManagement;
