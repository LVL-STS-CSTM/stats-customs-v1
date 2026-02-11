import React, { useRef, useState, useEffect } from 'react';
import { ChatIcon, DesignIcon, ProductionIcon, LogisticsIcon, CloseIcon, ArrowLongRightIcon } from './icons';
import { useOnScreen } from '../useOnScreen';

const steps = [
    { 
        icon: <ChatIcon className="w-8 h-8" />, 
        title: "Consultation", 
        description: "Share your vision. We provide a transparent, detailed quote tailored to your needs.",
        imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    { 
        icon: <DesignIcon className="w-8 h-8" />, 
        title: "Design & Mockup", 
        description: "Our designers create digital proofs, refining every detail until it matches your vision perfectly.",
        imageUrl: "https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
    },
    { 
        icon: <ProductionIcon className="w-8 h-8" />, 
        title: "Production", 
        description: "Expert craftsmen bring your design to life using premium materials and precision equipment.",
        imageUrl: "https://images.pexels.com/photos/823707/pexels-photo-823707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    { 
        icon: <LogisticsIcon className="w-8 h-8" />, 
        title: "Delivery", 
        description: "Rigorous quality checks before we package and ship your order safely to your doorstep.",
        imageUrl: "https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
];

const HowItWorks: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);
    
    // Track active index for carousel logic
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const activeStep = selectedIndex !== null && steps[selectedIndex] ? steps[selectedIndex] : null;

    // Swipe gesture state
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            return (prev + 1) % steps.length;
        });
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => {
            if (prev === null) return null;
            return (prev - 1 + steps.length) % steps.length;
        });
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        
        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    return (
        <section ref={sectionRef} className="bg-[#0A0A0A] py-16 md:py-24 relative overflow-hidden border-t border-b border-white/5">
            {/* Technical Background Pattern - Inverted to White Dots */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <span className={`text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] block mb-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>Streamlined Process</span>
                    <h2 className={`font-oswald text-3xl md:text-6xl text-white mb-6 uppercase tracking-tighter transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>How It Works</h2>
                    <p className={`text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-light transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>From concept to doorstep in four simple steps.</p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Connecting Line (Desktop) - Inverted */}
                    <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[1px] bg-white/10 -z-10">
                        <div className={`h-full bg-white origin-left transition-transform duration-[1.5s] ease-out delay-500 ${isVisible ? 'scale-x-100' : 'scale-x-0'}`}></div>
                    </div>

                    {steps.map((step, index) => (
                        <div 
                            key={step.title}
                            className={`group relative flex flex-col items-center text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} bg-white/0 p-4 md:p-0 rounded-2xl md:rounded-none cursor-pointer`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <div className="relative mb-6 md:mb-8 pointer-events-none">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-[#111] border border-white/10 shadow-2xl flex items-center justify-center text-white z-10 group-hover:border-white/40 group-hover:scale-110 transition-all duration-500 relative overflow-hidden isolate backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 z-0"></div>
                                    <img src={step.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 grayscale" />
                                    <div className="transition-transform duration-300 z-10 group-hover:scale-110">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-black shadow-lg transform group-hover:scale-125 transition-transform duration-300 border-2 border-[#0A0A0A] z-20">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="font-oswald text-lg md:text-xl text-white uppercase tracking-wide mb-2 md:mb-3 group-hover:text-zinc-300 transition-colors bg-transparent px-2 relative z-10">{step.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-400 transition-colors px-2 md:px-4 bg-transparent relative z-10">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* IMMERSIVE POPUP MODAL */}
            {activeStep && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-8 animate-fade-in"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div 
                        className="relative w-full h-full md:max-w-[85vw] md:max-h-[90vh] bg-[#0A0A0A] md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row group border-0 md:border border-white/5"
                        onClick={e => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={activeStep.imageUrl} 
                                alt={activeStep.title} 
                                className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 md:to-transparent"></div>
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>

                        {/* Navigation Arrows */}
                        <button onClick={handlePrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-white text-white hover:text-black rounded-full items-center justify-center backdrop-blur-md border border-white/10 transition-all active:scale-95">
                            <ArrowLongRightIcon className="w-6 h-6 rotate-180" />
                        </button>
                        <button onClick={handleNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-white text-white hover:text-black rounded-full items-center justify-center backdrop-blur-md border border-white/10 transition-all active:scale-95">
                            <ArrowLongRightIcon className="w-6 h-6" />
                        </button>

                        <button onClick={() => setSelectedIndex(null)} className="absolute top-6 right-6 z-40 w-10 h-10 md:w-12 md:h-12 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md border border-white/10 active:scale-95" aria-label="Close">
                            <CloseIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Content Overlay */}
                        <div className="relative z-20 flex flex-col justify-end w-full h-full p-8 md:p-16 lg:p-24 pointer-events-none">
                            <div className="max-w-4xl pointer-events-auto">
                                <div className="flex items-center gap-4 mb-6 md:mb-8">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <div className="transform scale-75 md:scale-100">{activeStep.icon}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Process</span>
                                        <div className="flex gap-1 mt-1">
                                            {steps.map((_, i) => (
                                                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-4xl md:text-6xl font-black text-white/5 font-eurostile ml-auto select-none">
                                        0{(selectedIndex || 0) + 1}
                                    </span>
                                </div>
                                <h3 className="font-eurostile text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter mb-6 text-white drop-shadow-2xl leading-[0.9]">
                                    {activeStep.title}
                                </h3>
                                <p className="text-base sm:text-lg md:text-2xl font-medium text-zinc-300 leading-relaxed drop-shadow-lg border-l-4 border-white pl-6">
                                    {activeStep.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HowItWorks;