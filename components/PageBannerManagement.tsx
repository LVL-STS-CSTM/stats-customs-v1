
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageBanner } from '../types';
import PageBannerFormModal from './PageBannerFormModal';

const PageBannerManagement: React.FC = () => {
    const { pageBanners, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bannerToEdit, setBannerToEdit] = useState<PageBanner | null>(null);

    const handleAddNew = () => {
        setBannerToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (banner: PageBanner) => {
        setBannerToEdit(banner);
        setIsModalOpen(true);
    };

    const handleDelete = (bannerId: string, bannerTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the header for "${bannerTitle}"?`)) {
            const newBanners = pageBanners.filter(b => b.id !== bannerId);
            updateData('pageBanners', newBanners);
        }
    };

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Page Banners ({pageBanners.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Header
                    </button>
                </div>
                <div className="divide-y divide-gray-200">
                    {pageBanners.map((banner) => (
                        <div key={banner.id} className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                            <img src={banner.imageUrl} alt={banner.title} className="w-24 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{banner.title} <span className="text-xs font-normal text-gray-500 ml-2">({banner.page})</span></h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{banner.description}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0 space-x-2 self-center">
                                <button onClick={() => handleEdit(banner)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                <button onClick={() => handleDelete(banner.id, banner.title)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                    {pageBanners.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No page banners found.</div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <PageBannerFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    bannerToEdit={bannerToEdit}
                />
            )}
        </>
    );
};

export default PageBannerManagement;
