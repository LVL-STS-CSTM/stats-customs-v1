import React from 'react';
import { useData } from '../context/DataContext';
import PageHeader from './PageHeader';
import LazyImage from './LazyImage';

const HowWeWorkPage: React.FC = () => {
    const { howWeWorkSections } = useData();

    return (
        <div className="bg-white">
            <PageHeader page="how-we-work" fallbackTitle="Quality Guaranteed" fallbackDescription="Our careful process ensures every piece meets our high standards of quality." />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="space-y-32">
                    {howWeWorkSections.map((section, index) => (
                        <div key={section.id} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="w-full lg:w-1/2">
                                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-50">
                                    <LazyImage src={section.imageUrl} alt={section.title} aspectRatio="aspect-[4/3]" />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-6">
                                <span className="text-[10px] font-bold text-black uppercase tracking-[0.4em]">Step 0{index + 1}</span>
                                <h3 className="font-oswald text-4xl text-gray-900 uppercase tracking-widest">{section.title}</h3>
                                <p className="text-gray-500 leading-loose text-lg font-light antialiased">{section.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowWeWorkPage;