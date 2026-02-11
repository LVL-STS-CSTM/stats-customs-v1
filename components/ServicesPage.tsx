
import React, { useRef, useMemo } from 'react';
import { View, Service, Capability } from '../types';
import Button from './Button';
import { BriefcaseIcon, DesignIcon, PackagingIcon, PrintingIcon, ChatIcon, ProductionIcon, LogisticsIcon, TargetIcon, SparklesIcon } from './icons';
import { useOnScreen } from '../useOnScreen';
import PageHeader from './PageHeader';
import LazyImage from './LazyImage';
import { useData } from '../context/DataContext';

interface ServicePageProps {
    onNavigate: (page: View) => void;
}

const iconMap = {
    DesignIcon: <DesignIcon className="w-8 h-8"/>,
    BriefcaseIcon: <BriefcaseIcon className="w-8 h-8"/>,
    PrintingIcon: <PrintingIcon className="w-8 h-8"/>,
    PackagingIcon: <PackagingIcon className="w-8 h-8"/>,
    LogisticsIcon: <LogisticsIcon className="w-8 h-8"/>,
    ProductionIcon: <ProductionIcon className="w-8 h-8"/>,
    TargetIcon: <TargetIcon className="w-8 h-8"/>,
    SparklesIcon: <SparklesIcon className="w-8 h-8"/>,
    ChatIcon: <ChatIcon className="w-8 h-8"/>
};

const CapabilityCard: React.FC<{ capability: Capability; delay: number; }> = ({ capability, delay }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const Icon = iconMap[capability.iconName as keyof typeof iconMap] || <SparklesIcon className="w-8 h-8"/>;
    
    return(
        <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: `${delay}ms`}}>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 h-full group transition-all duration-500 hover:bg-black hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 text-zinc-900 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:rotate-6">
                    {Icon}
                </div>
                <h4 className="font-oswald text-2xl text-gray-900 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{capability.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors font-light">{capability.description}</p>
            </div>
        </div>
    );
};

const ServicesPage: React.FC<ServicePageProps> = ({ onNavigate }) => {
    // Mapping static labels to provided copy
    const staticCapabilities = [
        { id: '1', title: 'Graphic Design', description: 'Let\'s build your brand from the ground up! We create custom logos, engaging marketing materials, and digital assets that truly represent your style.', iconName: 'DesignIcon' },
        { id: '2', title: 'Corporate Branding', description: 'Elevate your corporate image with branded business cards, IDs, mugs, and other professional office essentials.', iconName: 'BriefcaseIcon' },
        { id: '3', title: 'Specialized Printing', description: 'Need more than just apparel? We handle high-quality printing for everything: business cards, event backdrops, large-format vinyl signage, and marketing flyers.', iconName: 'PrintingIcon' },
        { id: '4', title: 'Specialized Apparel Finishes', description: 'Elevate your custom apparel with high-quality embroidery, specialized vinyl applications, and unique texture printing for a premium look and feel.', iconName: 'SparklesIcon' }
    ];

    return (
        <div className="bg-white">
            <PageHeader page="services" fallbackTitle="Expert Solutions" fallbackDescription="We don't just stop at custom apparel! Let's make your brand ready for the next LEVEL." />
            
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-20">
                    <span className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.4em] block mb-4">Complete Creative Suite</span>
                    <h2 className="font-oswald text-4xl lg:text-5xl text-gray-900 uppercase tracking-widest">Additional Services & Branding</h2>
                    <p className="mt-8 text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
                        We offer a complete creative suite to make sure your brand looks consistent, professional, and totally unforgettable everywhere it appears. Think of us as your one-stop shop for merch, print, and all the details in between.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
                    {staticCapabilities.map((capability, index) => (
                        <CapabilityCard key={capability.id} capability={capability as any} delay={index * 150} />
                    ))}
                </div>
            </section>

            <section className="bg-zinc-50 py-24 px-4 overflow-hidden relative">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-600/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                                <SparklesIcon className="w-4 h-4 text-white" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Inquire Now</span>
                            </div>
                            <h2 className="font-oswald text-4xl md:text-6xl text-white uppercase tracking-widest leading-none">Ready to Build Your<br/>Brand's Legacy?</h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                                Join our network of industry-leading partners. From initial design strategy to global delivery, our team is equipped to handle your most complex requirements.
                            </p>
                            <div className="pt-8">
                                <Button 
                                    variant="solid" 
                                    onClick={() => onNavigate('contact')} 
                                    className="bg-white text-black hover:bg-zinc-100 hover:scale-105 transition-all px-16 py-6 text-lg rounded-2xl shadow-2xl"
                                >
                                    Initiate Consultation
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
