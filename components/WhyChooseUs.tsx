
import React, { useRef } from 'react';
import { SparklesIcon, ChatIcon, LocationPinIcon, StarIcon } from './icons';
import { useOnScreen } from '../useOnScreen';

const features = [
    {
        icon: <SparklesIcon className="w-8 h-8" />,
        title: "Premium Quality",
        description: "We source only the finest materials and employ meticulous craftsmanship to ensure every product is durable, comfortable, and flawlessly finished.",
        imageUrl: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        icon: <ChatIcon className="w-8 h-8" />,
        title: "Expert Consultation",
        description: "Our dedicated team works closely with you from concept to completion, providing expert guidance to bring your unique vision to life.",
        imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        icon: <LocationPinIcon className="w-8 h-8" />,
        title: "Local Production",
        description: "By keeping our production in-house, we support local artisans, ensure higher quality control, and offer faster turnaround times.",
        imageUrl: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        icon: <StarIcon className="w-8 h-8" />,
        title: "Proven Track Record",
        description: "Trusted by industry leaders and innovative startups alike, we have a proven history of delivering exceptional results on time.",
        imageUrl: "https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
];

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; imageUrl: string; isVisible: boolean; delay: number; }> = ({ icon, title, description, imageUrl, isVisible, delay }) => {
    return (
        <div 
            className={`h-full transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} 
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="group h-full bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-zinc-100 hover:border-zinc-900 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden isolate">
                
                {/* Hover Background Image */}
                <img 
                    src={imageUrl} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20 grayscale group-hover:scale-110 transform transition-transform"
                />
                
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center z-30"></div>
                
                <div className="mb-6 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-zinc-50 text-zinc-900 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white group-hover:backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner group-hover:shadow-xl z-20">
                    {icon}
                </div>
                
                <h3 className="font-oswald text-lg md:text-xl text-gray-900 group-hover:text-white uppercase tracking-wide mb-4 group-hover:tracking-widest transition-all duration-300 z-20">{title}</h3>
                
                <div className="w-8 h-0.5 bg-zinc-200 mb-4 group-hover:w-16 group-hover:bg-white transition-all duration-500 z-20"></div>
                
                <p className="text-sm text-gray-500 leading-relaxed font-light group-hover:text-gray-300 transition-colors z-20">{description}</p>
            </div>
        </div>
    );
};

const WhyChooseUs: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    return (
        <section ref={sectionRef} className="bg-zinc-50 py-16 md:py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-20">
                    <span className={`inline-block py-1 px-3 rounded-full bg-white border border-zinc-200 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 shadow-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        The Stats Advantage
                    </span>
                    <h2 className={`font-oswald text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-6 uppercase tracking-widest leading-none transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Why Choose<br/>Stats Customs?
                    </h2>
                    <p className={`text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Your trusted partner for premium, locally-crafted custom apparel. We don't just print shirts; we engineer brand identities.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={feature.title} 
                            icon={feature.icon} 
                            title={feature.title} 
                            description={feature.description} 
                            imageUrl={feature.imageUrl}
                            isVisible={isVisible} 
                            delay={300 + (index * 150)} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
