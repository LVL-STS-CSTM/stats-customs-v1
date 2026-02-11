
import React, { useRef, useState, useEffect } from 'react';
import { InfoCard } from '../types';
import { useOnScreen } from '../useOnScreen';
import { CloseIcon, ArrowLongRightIcon } from './icons';

interface InfoCardsProps {
    cards: InfoCard[];
    onCardClick: (card: InfoCard) => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({ cards, onCardClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const [selectedCard, setSelectedCard] = useState<InfoCard | null>(null);

    // Sort the cards by displayOrder
    const sortedCards = [...cards].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Handle initial click
    const handleInteraction = (card: InfoCard) => {
        // If card has a description, show popup first. Otherwise navigate immediately.
        if (card.description && card.description.trim().length > 0) {
            setSelectedCard(card);
        } else {
            onCardClick(card);
        }
    };

    // Proceed from modal
    const handleProceed = () => {
        if (selectedCard) {
            onCardClick(selectedCard);
            setSelectedCard(null);
        }
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedCard) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedCard]);

    return (
        <section className="max-w-[1840px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-12 overflow-hidden md:overflow-visible">
            {/* 
                Grid Layout Adjustment:
                - Changed from lg:grid-cols-4 to lg:grid-cols-3 to support larger cards for a 3-card layout.
                - Added xl:grid-cols-3 explicitly to maintain this layout on very wide screens.
            */}
            <div ref={ref} className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-4 lg:gap-6 flex overflow-x-auto snap-x snap-mandatory gap-2.5 no-scrollbar -mx-2 sm:-mx-4 md:mx-0 px-2 sm:px-4 md:px-0">
                {sortedCards.map((card, index) => (
                    <div 
                        key={card.id}
                        className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} flex-shrink-0 w-[90vw] sm:w-[80vw] md:w-auto snap-center h-full`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <button 
                            onClick={() => handleInteraction(card)}
                            className="relative group aspect-square md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-cover bg-center text-white flex items-center justify-center text-center w-full rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
                            style={{ backgroundImage: `url(${card.imageUrl})` }}
                            aria-label={(card.title || '').replace('\n', ' ')}
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full w-full">
                                <div className="border border-white/30 px-6 py-4 backdrop-blur-sm rounded-none transform transition-transform duration-500 group-hover:scale-105 group-hover:border-white/60">
                                    <h2 
                                        className="font-oswald text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase whitespace-pre-line leading-tight drop-shadow-lg"
                                    >
                                        {card.title}
                                    </h2>
                                </div>
                                {(card.description || card.linkType === 'modal') && (
                                    <span className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                        View Details
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {/* Immersive Popup for Cards with Descriptions */}
            {selectedCard && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-8 animate-fade-in"
                    onClick={() => setSelectedCard(null)}
                >
                    <div 
                        className="relative w-full h-full md:max-w-[85vw] md:max-h-[90vh] bg-zinc-900 md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row group border-0 md:border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedCard(null)} 
                            className="absolute top-6 right-6 z-50 w-10 h-10 md:w-12 md:h-12 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md border border-white/10 active:scale-95"
                        >
                            <CloseIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={selectedCard.imageUrl} 
                                alt={selectedCard.title} 
                                className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-100 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-20 flex flex-col justify-end w-full h-full p-8 md:p-16 lg:p-24 pointer-events-none">
                            <div className="max-w-2xl pointer-events-auto">
                                <div className="mb-6 md:mb-8">
                                    <div className="w-16 h-1 bg-white/50 mb-6"></div>
                                    <h3 className="font-eurostile text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter mb-6 text-white drop-shadow-2xl leading-[0.9] whitespace-pre-line">
                                        {selectedCard.title}
                                    </h3>
                                    <p className="text-base sm:text-lg md:text-xl font-light text-white/90 leading-relaxed drop-shadow-lg border-l-2 border-white/30 pl-6 mb-8">
                                        {selectedCard.description}
                                    </p>
                                    
                                    <button 
                                        onClick={handleProceed}
                                        className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl active:scale-95 group/btn"
                                    >
                                        <span>Proceed</span>
                                        <ArrowLongRightIcon className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InfoCards;
