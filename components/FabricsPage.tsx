import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Material } from '../types';
import MaterialCareModal from './MaterialCareModal';
import PageHeader from './PageHeader';
import { useOnScreen } from '../useOnScreen';
import LazyImage from './LazyImage';

const MaterialSection: React.FC<{ material: Material; index: number; openCareModal: (url?: string) => void }> = ({ material, index, openCareModal }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    return (
        <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <LazyImage src={material.imageUrl} alt={material.name} aspectRatio="aspect-[4/3]" />
                    </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Our Fabric</span>
                        <h3 className="font-oswald text-3xl lg:text-4xl text-gray-900 mt-2 uppercase tracking-widest">{material.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {material.features.map(f => <span key={f} className="bg-white text-gray-700 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-gray-100 shadow-sm">{f}</span>)}
                    </div>
                    <p className="text-gray-600 leading-loose text-lg font-light antialiased">{material.description}</p>
                    <button 
                        onClick={() => openCareModal(material.careImageUrl)} 
                        className="inline-block border-b-2 border-black pb-1 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-600 transition-all"
                    >
                        Care Instructions &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

const FabricsPage: React.FC = () => {
    const { materials } = useData();
    const [isCareModalOpen, setIsCareModalOpen] = useState(false);
    const [selectedCareImage, setSelectedCareImage] = useState<string | undefined>(undefined);

    return (
        <>
            <div className="bg-white">
                <PageHeader page="materials" fallbackTitle="Fabric Engineering" fallbackDescription="Premium textiles designed for comfort and peak performance." />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="space-y-32">
                        {materials.map((m, i) => (
                            <MaterialSection 
                                key={m.id} 
                                material={m} 
                                index={i} 
                                openCareModal={(url) => { setSelectedCareImage(url); setIsCareModalOpen(true); }} 
                            />
                        ))}
                    </div>
                </div>
            </div>
            <MaterialCareModal isOpen={isCareModalOpen} onClose={() => setIsCareModalOpen(false)} imageUrl={selectedCareImage} />
        </>
    );
};

export default FabricsPage;