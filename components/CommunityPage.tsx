
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { View, CommunityPost } from '../types';
import PageHeader from './PageHeader';
import LazyImage from './LazyImage';

interface CommunityPageProps {
    onNavigate: (page: View, value?: string | null) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
    const { communityPosts, products } = useData();
    const visiblePosts = useMemo(() => communityPosts.filter(p => p.isVisible), [communityPosts]);

    return (
        <div className="bg-gray-50">
            <PageHeader page="community" fallbackTitle="Community Gallery" fallbackDescription="See what our partners are creating." />
            
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {visiblePosts.map(post => {
                        const tagged = post.taggedProductId ? products.find(p => p.id === post.taggedProductId) : null;
                        return (
                            <div key={post.id} className="group relative break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-2xl">
                                <LazyImage src={post.imageUrl} alt={post.caption} aspectRatio="aspect-auto" />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                    <p className="text-sm font-light italic leading-relaxed mb-4">"{post.caption}"</p>
                                    <div className="flex items-center justify-between border-t border-white/20 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold uppercase tracking-widest">{post.author}</span>
                                            <span className="text-[10px] text-white/60 font-medium">{post.source}</span>
                                        </div>
                                        {tagged && (
                                            <button 
                                                onClick={() => onNavigate('product', tagged.id)} 
                                                className="px-4 py-2 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-all"
                                            >
                                                View Kit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {visiblePosts.length === 0 && (
                    <div className="text-center py-40">
                        <p className="font-oswald text-gray-400 uppercase tracking-widest text-xl">Our community is growing. Stay tuned.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
