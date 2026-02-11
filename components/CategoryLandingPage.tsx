
import React from 'react';
import { View } from '../types';
import { useData } from '../context/DataContext';
import PageHeader from './PageHeader';
import LazyImage from './LazyImage';
import { ArrowLongRightIcon } from './icons';

interface CategoryLandingPageProps {
    onNavigate: (page: View, value?: string | null) => void;
}

const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({ onNavigate }) => {
    const { collections } = useData();

    const getCollectionImage = (collection: any) => {
        return collection.imageUrl || 'https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg';
    };

    return (
        <div className="bg-[#111] min-h-screen text-white">
            <PageHeader 
                page="browse" 
                fallbackTitle="Catalogue" 
                fallbackDescription="Explore our curated collections designed for performance and style." 
            />
            
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                    {collections.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((collection) => (
                        <div 
                            key={collection.id}
                            className="group relative h-[80vh] min-h-[600px] w-full overflow-hidden cursor-pointer border-r border-white/5 last:border-r-0 border-b md:border-b-0"
                            onClick={() => onNavigate('catalogue', collection.name)}
                        >
                            {/* Background Image with Zoom Effect */}
                            <div className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
                                <LazyImage 
                                    src={getCollectionImage(collection)} 
                                    alt={collection.name} 
                                    aspectRatio="h-full w-full" 
                                    className="h-full w-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                                />
                            </div>
                            
                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
                            
                            {/* Content Container */}
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-center text-center z-10">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                    {/* Subtitle / Description */}
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-4 block">
                                        The {collection.name} Collection
                                    </span>
                                    
                                    {/* Main Title - Big & Bold */}
                                    <h3 className="font-eurostile text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-widest text-white mb-10 leading-[0.85]">
                                        {collection.name}
                                    </h3>
                                    
                                    {/* Call to Action */}
                                    <div className="flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                                        <div className="w-px h-12 bg-white/30"></div>
                                        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-gray-300 transition-colors group/btn">
                                            <span>View Products</span>
                                            <ArrowLongRightIcon className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryLandingPage;
