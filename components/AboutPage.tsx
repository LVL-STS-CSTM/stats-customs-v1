
import React, { useRef } from 'react';
import { View } from '../types';
import Button from './Button';
import { ChatIcon, BriefcaseIcon, DesignIcon, ProductionIcon, LogisticsIcon, TargetIcon, EyeIcon, SampleTestingIcon, SustainabilityIcon, SparklesIcon } from './icons';
import { useOnScreen } from '../useOnScreen';
import PageHeader from './PageHeader';
import LazyImage from './LazyImage';

const ProcessStep: React.FC<{
    icon: React.ReactNode;
    step: number;
    title: string;
    description: string;
    isVisible: boolean;
    delay: number;
    isLast: boolean;
}> = ({ icon, step, title, description, isVisible, delay, isLast }) => (
    <div className="relative pl-32 pb-24 last:pb-0 group">
        {!isLast && (
            <div className="absolute left-[40px] top-[80px] bottom-0 w-[2px] overflow-hidden">
                <div 
                    className={`w-full h-full bg-zinc-200 origin-top transition-transform duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1)`}
                    style={{ 
                        transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                        transitionDelay: `${delay + 600}ms`
                    }}
                ></div>
            </div>
        )}

        <div 
            className={`absolute left-0 top-0 w-20 h-20 rounded-full bg-white text-[#3A3A3A] flex items-center justify-center border-4 border-zinc-100 shadow-xl z-10 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-12'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className={`transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`} style={{ transitionDelay: `${delay + 300}ms` }}>
                {icon}
            </div>
            
            <div className={`absolute -right-2 -top-2 w-8 h-8 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center transition-all duration-500 shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: `${delay + 400}ms` }}>
                {step}
            </div>
        </div>

        <div 
            className={`transition-all duration-1000 cubic-bezier(0.2, 1, 0.2, 1) ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDelay: `${delay + 200}ms` }}
        >
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em] mb-2 block font-eurostile">Step 0{step}</span>
                <h4 className="font-eurostile text-2xl text-[#1A1A1A] uppercase tracking-widest mb-4 leading-tight">{title}</h4>
                <div className="w-12 h-0.5 bg-black/10 mb-4"></div>
                <p className="text-gray-500 leading-relaxed font-light max-w-xl antialiased">{description}</p>
            </div>
        </div>
    </div>
);

const ValueCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number; isVisible: boolean }> = ({ icon, title, children, delay, isVisible }) => (
    <div 
        className={`bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-white transition-all duration-700 ease-out hover:bg-white/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6">
            {icon}
        </div>
        <h4 className="font-eurostile text-base text-white mb-3 uppercase tracking-widest">{title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed font-light">{children}</p>
    </div>
);

interface AboutPageProps {
    onNavigate: (page: View, value?: string | null, color?: string | null) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const sectionRefs = {
        about: useRef<HTMLDivElement>(null),
        missionVision: useRef<HTMLDivElement>(null),
        values: useRef<HTMLDivElement>(null),
        process: useRef<HTMLDivElement>(null),
        cta: useRef<HTMLDivElement>(null),
    };
    
    const visibility = {
        about: useOnScreen(sectionRefs.about),
        missionVision: useOnScreen(sectionRefs.missionVision),
        values: useOnScreen(sectionRefs.values),
        process: useOnScreen(sectionRefs.process),
        cta: useOnScreen(sectionRefs.cta),
    };
    
    const processSteps = [
        { icon: <ChatIcon className="w-8 h-8"/>, title: "Let's Talk", description: "Connect with us! Reach out through our contact number, social media, or email us at contact@statscustoms.ph. Just send over your initial idea and we’ll assist you from there. No design yet? No problem—we'll handle the creative work for you!" },
        { icon: <BriefcaseIcon className="w-8 h-8"/>, title: "Free Quotation", description: "After a quick chat about your order (quantities, materials, design complexity), we'll send over a detailed quote. Don't worry about hidden charges! Our rates are always fair and transparent." },
        { icon: <DesignIcon className="w-8 h-8"/>, title: "Custom Design", description: "Our team will be assisting you every step of the way. We'll create a dedicated group chat to iron out all the specifics like design, fabric choice, and colors. We'll share proposed designs for your final approval." },
        { icon: <ProductionIcon className="w-8 h-8"/>, title: "Expert Production", description: "Time to bring it to life! A 50% downpayment kicks off production. Lead time is typically 2–3 weeks. Once your order is ready, settle the remaining balance before we ship it out." },
        { icon: <LogisticsIcon className="w-8 h-8"/>, title: "Careful Delivery", description: "We'll ship your goods via courier and send you the tracking details right away! Need to check on your order? You can reach us via email, social media, or give us a call." }
    ];

    return (
        <div className="bg-white text-[#3A3A3A] overflow-x-hidden">
            <PageHeader page="about" fallbackTitle="Our Story" fallbackDescription="Crafting Quality. Championing Local Excellence." />
            
            <section ref={sectionRefs.about} className="py-32 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className={`transition-all duration-1000 ease-out ${visibility.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-[1px] bg-black"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black">Our Journey</span>
                        </div>
                        <h2 className="font-eurostile text-4xl lg:text-5xl text-gray-900 mb-8 uppercase tracking-widest">About Stats</h2>
                        <div className="space-y-6 text-gray-500 leading-relaxed font-light text-lg antialiased">
                            <p>
                                <strong>STATS</strong> is a proudly Filipino brand that creates custom clothing — crafted for teams, businesses, and everyday people who believe quality shouldn’t come with an outrageous price tag.
                            </p>
                            <p>
                                From game-day jerseys to work polos and daily tees, every piece is designed, printed, and sewn by skilled local hands that take pride in every detail. No shortcuts. No overpriced fluff. Just honest, durable apparel that feels right, fits well, and looks even better.
                            </p>
                            <p>
                                We carry the spirit of Filipino craftsmanship in every stitch as we believe locals can lead, and we’re here to prove it. From our design studio to the production floor, we obsess over the details that define professional apparel.
                            </p>
                        </div>
                    </div>
                    <div className={`transition-all duration-1000 ease-out delay-200 ${visibility.about ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-zinc-50 relative">
                            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
                            <LazyImage src="https://images.pexels.com/photos/5699865/pexels-photo-5699865.jpeg" alt="Fabric quality" aspectRatio="aspect-square" />
                        </div>
                    </div>
                </div>
            </section>
            
            <section ref={sectionRefs.missionVision} className="py-24 px-4 bg-zinc-50">
                 <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className={`bg-white p-12 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 flex flex-col transition-all duration-1000 ease-out ${visibility.missionVision ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
                                <TargetIcon className="w-8 h-8 text-white"/>
                            </div>
                            <h2 className="font-eurostile text-2xl text-gray-900 uppercase tracking-widest">Our Mission</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-500 leading-relaxed font-light text-lg antialiased">
                                To empower Filipinos by making high-quality, custom apparel accessible — because looking good, feeling proud, and representing who you are shouldn’t come at a high cost.
                            </p>
                            <p className="text-gray-500 leading-relaxed font-light text-lg antialiased">
                                At STATS, we believe excellence doesn’t have to be expensive. Through honest pricing, skilled local craftsmanship, and thoughtful design, we make clothing every Filipino can wear with pride.
                            </p>
                        </div>
                    </div>
                     <div className={`bg-white p-12 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 flex flex-col transition-all duration-1000 ease-out delay-300 ${visibility.missionVision ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
                                <EyeIcon className="w-8 h-8 text-white"/>
                            </div>
                            <h2 className="font-eurostile text-2xl text-gray-900 uppercase tracking-widest">Our Vision</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-500 leading-relaxed font-light text-lg antialiased">
                                To become the most trusted Filipino-made custom apparel brand—where quality, affordability, and national pride meet.
                            </p>
                            <p className="text-gray-500 leading-relaxed font-light text-lg antialiased">
                                We envision a future where every team, big or small, can wear high quality uniforms that reflect their spirit, without breaking the bank. By championing local artisans and ethical pricing, we aim to redefine the game — through every piece we create, and every Filipino we proudly represent.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sectionRefs.values} className="py-32 px-4 bg-[#0F0F0F]">
                 <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-4 block font-eurostile">What We Stand For</span>
                        <h2 className="font-eurostile text-4xl lg:text-5xl text-white mb-4 uppercase tracking-widest">Our Values</h2>
                        <div className="w-24 h-1 bg-white/10 mx-auto mt-8"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ValueCard icon={<SampleTestingIcon className="w-6 h-6"/>} title="Excellence" delay={0} isVisible={visibility.values}>We obsess over every single detail to ensure you get the best.</ValueCard>
                        <ValueCard icon={<BriefcaseIcon className="w-6 h-6"/>} title="Partnership" delay={150} isVisible={visibility.values}>Your vision is our mission. We grow when you grow.</ValueCard>
                        <ValueCard icon={<SustainabilityIcon className="w-6 h-6"/>} title="Integrity" delay={300} isVisible={visibility.values}>Transparent pricing and ethical local manufacturing practices.</ValueCard>
                        <ValueCard icon={<SparklesIcon className="w-6 h-6"/>} title="Innovation" delay={450} isVisible={visibility.values}>Constantly evolving our materials and printing techniques.</ValueCard>
                    </div>
                </div>
            </section>

            <div ref={sectionRefs.process} className="py-32 px-4 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-32">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em] mb-4 block font-eurostile">Our 5-Step Process</span>
                        <h2 className="font-eurostile text-4xl lg:text-5xl text-[#1A1A1A] mb-4 uppercase tracking-widest">How We Make It Happen</h2>
                        <p className="mt-6 text-gray-500 max-w-2xl mx-auto">We’ve simplified everything so you can focus on the excitement of your custom gear. Siguradong diretso sa next level ang branding mo!</p>
                    </div>
                    <div className="relative">
                        {processSteps.map((step, index) => (
                             <ProcessStep 
                                key={index} 
                                {...step} 
                                step={index + 1}
                                isVisible={visibility.process} 
                                delay={index * 200} 
                                isLast={index === processSteps.length - 1}
                             />
                        ))}
                    </div>
                </div>
            </div>

            <section ref={sectionRefs.cta} className={`py-32 px-4 bg-zinc-50 transition-all duration-1000 ease-out ${visibility.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="font-eurostile text-4xl md:text-6xl text-gray-900 mb-12 uppercase tracking-widest leading-none">Ready to Level Up Your<br/>Team's Identity?</h2>
                    <Button variant="solid" onClick={() => onNavigate('catalogue')} className="px-16 py-6 text-lg rounded-2xl shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                        Browse Our Full Collection
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
