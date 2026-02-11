
import React, { useState } from 'react';
import { View } from '../types';

/**
 * @interface HeroProps
 * @description Props for the Hero component.
 */
interface HeroProps {
    mediaSrc: string;
    mediaType: 'video' | 'image' | 'gif';
    title: string;
    description: string;
    buttonText?: string;
    buttonCollectionLink?: string;
    onNavigate: (page: View, category?: string | null) => void;
    isFirst: boolean;
}

/**
 * @description A full-width hero section with media background and text overlay.
 */
const Hero: React.FC<HeroProps> = ({ mediaSrc, mediaType, title, description, buttonText, buttonCollectionLink, onNavigate, isFirst }) => {
    const [hasError, setHasError] = useState(false);

    const heroHeightClass = isFirst ? 'min-h-screen lg:max-h-[1080px]' : 'h-[60vh] min-h-[400px]';
    // Slightly nudged down titles for a more sophisticated, "perfect" scale
    const titleSize = isFirst ? 'text-xl md:text-2xl lg:text-3xl' : 'text-lg md:text-xl lg:text-2xl';
    const descriptionSize = 'text-[9px] md:text-[10px]';
    
    const alignmentClass = 'flex items-end justify-start text-left';
    const paddingClass = 'pb-12 md:pb-24 pl-6 md:pl-12';

    return (
        <section className={`relative w-full ${heroHeightClass} overflow-hidden ${alignmentClass} bg-neutral-900 group`}>
            {/* Background media */}
            {!hasError && (
                <>
                    {mediaType === 'video' ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            onError={() => setHasError(true)}
                            className="absolute top-0 left-0 w-full h-full object-cover z-0"
                        >
                            <source src={mediaSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={mediaSrc}
                            alt=""
                            onError={() => setHasError(true)}
                            className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-transform duration-[20s] ease-linear hover:scale-110"
                        />
                    )}
                </>
            )}
            
            <div className={`absolute inset-0 z-[1] ${hasError ? 'bg-neutral-900' : 'bg-black/30'}`}></div>
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-[2]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-[2]"></div>

            <div className={`relative z-10 w-full max-w-screen-2xl mx-auto ${paddingClass}`}>
                <div className="max-w-xl text-white">
                    <h1 className={`font-eurostile font-bold ${titleSize} tracking-[0.2em] mb-4 uppercase leading-[1.15] drop-shadow-2xl animate-fade-in-up [animation-delay:100ms] whitespace-pre-line`}>
                        {title}
                    </h1>
                    
                    <p className={`${descriptionSize} leading-relaxed mb-10 text-white/70 font-medium max-w-sm uppercase tracking-[0.3em] animate-fade-in-up [animation-delay:200ms] whitespace-pre-line antialiased`}>
                        {description}
                    </p>
                    
                    {buttonText && buttonCollectionLink && (
                        <div className="animate-fade-in-up [animation-delay:300ms]">
                            <button 
                                onClick={() => onNavigate('catalogue', buttonCollectionLink)}
                                className="group relative px-10 py-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/40 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out skew-x-[-20deg] pointer-events-none"></div>
                                
                                <span className="relative z-10 text-white text-[10px] font-bold uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-500">
                                    {buttonText}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;