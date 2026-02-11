import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: string; // e.g., "aspect-[4/5]"
    objectFit?: 'cover' | 'contain';
}

/**
 * @description A high-performance image component using IntersectionObserver.
 * Features: Shimmer placeholders, fade-in animations, and native browser fallbacks.
 */
const LazyImage: React.FC<LazyImageProps> = ({ 
    src, 
    alt, 
    className = "", 
    aspectRatio = "aspect-square",
    objectFit = 'cover'
}) => {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '400px' } // Pre-load assets slightly before they enter viewport
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`relative overflow-hidden bg-zinc-50 ${aspectRatio} ${className}`}
        >
            {/* Modular Shimmer Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 z-10 bg-zinc-100 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[scroll_1.5s_infinite] transition-transform"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                         <img src="https://i.imgur.com/OIYeMvS.png" alt="" className="w-8 h-8 grayscale" />
                    </div>
                </div>
            )}

            {/* The Asset - Only rendered when within proximity */}
            {isInView && (
                <img
                    src={hasError ? 'https://placehold.co/600x800/fafafa/d4d4d8?text=Asset+Unavailable' : src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setIsLoaded(true);
                    }}
                    className={`
                        w-full h-full 
                        transition-all duration-[800ms] cubic-bezier(0.2, 1, 0.2, 1)
                        ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
                        ${isLoaded ? 'opacity-100 scale-100 translate-y-0 grayscale-0' : 'opacity-0 scale-[1.02] translate-y-2 grayscale-[50%] blur-sm'}
                    `}
                />
            )}
        </div>
    );
};

export default LazyImage;