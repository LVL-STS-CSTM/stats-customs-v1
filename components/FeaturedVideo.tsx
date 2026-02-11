
import React, { useRef } from 'react';
import { useOnScreen } from '../useOnScreen';

interface FeaturedVideoProps {
    title: string;
    description: string;
    youtubeVideoUrl: string;
}

/**
 * Extracts the YouTube video ID from various URL formats.
 */
const getYoutubeVideoId = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    let videoId = null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    if (match) {
        videoId = match[1];
    }
    return videoId;
};

const FeaturedVideo: React.FC<FeaturedVideoProps> = ({ title, description, youtubeVideoUrl }) => {
    const videoId = getYoutubeVideoId(youtubeVideoUrl);
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    
    const embedUrl = videoId 
        ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`
        : '';

    return (
        <section 
            ref={ref} 
            className={`bg-gray-100 py-16 md:py-24 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="font-oswald text-3xl md:text-4xl tracking-widest text-gray-900 mb-4 uppercase">
                        {title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
                        {description}
                    </p>
                </div>
                {embedUrl ? (
                    <div className="relative shadow-2xl rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                     <div className="relative shadow-2xl rounded-lg overflow-hidden bg-gray-200" style={{ paddingTop: '56.25%' }}>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center text-red-600 p-4">
                            <h3 className="font-bold text-lg">Invalid YouTube URL</h3>
                            <p className="text-sm">Please check the URL in the admin dashboard.</p>
                        </div>
                     </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedVideo;
