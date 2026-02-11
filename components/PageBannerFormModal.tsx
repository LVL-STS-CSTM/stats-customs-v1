
import React, { useState, useEffect } from 'react';
import { PageBanner, View } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface PageBannerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    bannerToEdit: PageBanner | null;
}

const emptyBanner: Omit<PageBanner, 'id'> = {
    page: 'about',
    title: '',
    description: '',
    imageUrl: '',
};

const internalPages: View[] = [
    'catalogue', 'about', 'partners', 'contact', 'faq', 'services', 
    'terms-of-service', 'return-policy', 'privacy-policy', 'materials', 'community', 'how-we-work', 'mockup-generator'
];

const PageBannerFormModal: React.FC<PageBannerFormModalProps> = ({ isOpen, onClose, bannerToEdit }) => {
    const { pageBanners, updateData } = useData();
    const [formData, setFormData] = useState<PageBanner | Omit<PageBanner, 'id'>>(bannerToEdit || emptyBanner);
    
    useEffect(() => {
        setFormData(bannerToEdit || emptyBanner);
    }, [bannerToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl) {
            alert('Please fill out Title and Image URL.');
            return;
        }

        if (bannerToEdit && 'id' in formData) {
            const updated = pageBanners.map(b => b.id === (formData as PageBanner).id ? formData as PageBanner : b);
            updateData('pageBanners', updated);
        } else {
            const newBanner = { ...formData, id: `pb-${Date.now()}` };
            updateData('pageBanners', [...pageBanners, newBanner]);
        }
        onClose();
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{bannerToEdit ? 'Edit Page Banner' : 'Add Page Banner'}</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" /></button>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="page" className="block text-sm font-medium text-gray-700">Assign to Page</label>
                        <select name="page" id="page" value={formData.page} onChange={handleInputChange} required className={darkInputStyles}>
                            {internalPages.map(p => <option key={p} value={p}>{p.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Banner Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className={darkInputStyles} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Subtitle / Description</label>
                        <input type="text" name="description" id="description" value={formData.description} onChange={handleInputChange} className={darkInputStyles} />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Banner Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required className={darkInputStyles} />
                    </div>
                    <footer className="py-4 flex justify-end space-x-3 sticky bottom-0 bg-white z-10 border-t mt-4 -mx-6 px-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">Save Banner</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default PageBannerFormModal;
