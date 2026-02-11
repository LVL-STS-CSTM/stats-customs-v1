
import React from 'react';
import { SubmittedQuote } from '../types';
import { CloseIcon, LinkIcon } from './icons';

interface QuoteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: SubmittedQuote;
}

const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({ isOpen, onClose, quote }) => {
    if (!isOpen) return null;

    const copyTrackLink = () => {
        const baseUrl = window.location.origin;
        // Updated to remove hash routing: /track-project?id=...
        const link = `${baseUrl}/track-project?id=${quote.id}`;
        // Defensive check for navigator.clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link).then(() => alert('Tracking Link Copied to Clipboard'));
        } else {
            alert('Clipboard access denied. Please copy link manually: ' + link);
        }
    };

    const isDirectOrder = quote.id.startsWith('ORD');

    return (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
                <header className="flex items-center justify-between p-8 border-b sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-oswald uppercase tracking-widest text-gray-900">{isDirectOrder ? 'Order Details' : 'Inquiry Details'}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Reference ID: {quote.id}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isDirectOrder ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'}`}>
                                {isDirectOrder ? 'Store Purchase' : 'Custom Project'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={copyTrackLink}
                            className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all border border-zinc-100"
                            title="Copy Tracking Link"
                        >
                            <LinkIcon className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                            <CloseIcon className="w-6 h-6 text-gray-400 hover:text-black" />
                        </button>
                    </div>
                </header>
                
                <div className="overflow-y-auto p-8 space-y-10 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-4">Customer Info</h3>
                            <div className="space-y-4 text-sm">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Name</span>
                                    <p className="font-black text-gray-900 uppercase">{quote.contact.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Email</span>
                                    <p className="font-medium text-indigo-600"><a href={`mailto:${quote.contact.email}`}>{quote.contact.email}</a></p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Phone</span>
                                    <p className="font-mono text-gray-600">{quote.contact.phone}</p>
                                </div>
                                {quote.contact.company && (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Company / Team</span>
                                        <p className="font-bold text-gray-700 uppercase">{quote.contact.company}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="bg-zinc-900 p-6 rounded-3xl text-white">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Shipping & Payment</h3>
                            <div className="space-y-4 text-sm">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Address</span>
                                    <p className="text-zinc-300 font-medium leading-relaxed">{(quote.contact as any).address || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Courier</span>
                                        <p className="text-zinc-300 font-black uppercase">{(quote.contact as any).deliveryMethod || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Payment</span>
                                        <p className="text-emerald-400 font-black uppercase">{(quote.contact as any).paymentMethod || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-6">Requested Items</h3>
                        <div className="space-y-4">
                            {quote.items.map((item, index) => {
                                // Defensive checks for potentially missing or malformed items
                                if (!item || !item.product) return null;

                                const imagesForColor = (item.product.imageUrls && item.selectedColor && item.product.imageUrls[item.selectedColor.name]) || [];
                                const fallbackImages = item.product.imageUrls ? Object.values(item.product.imageUrls).flat() : [];
                                const imageUrl = imagesForColor[0] || fallbackImages[0] || 'https://placehold.co/100x100?text=No+Image';

                                return (
                                <div key={index} className="flex gap-6 p-4 border border-zinc-100 rounded-3xl bg-white hover:border-zinc-200 transition-colors">
                                    <img src={imageUrl} alt="" className="w-20 h-24 object-cover rounded-2xl bg-gray-100 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black uppercase text-gray-900 mb-2">{item.product.name}</h4>
                                        <div className="flex gap-4 mb-3">
                                            {item.selectedColor && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.selectedColor.hex}}></span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{item.selectedColor.name}</span>
                                                </div>
                                            )}
                                            {item.printLocations && (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{item.printLocations} Logo Locations</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(item.sizeQuantities || {}).map(([size, qty]) => (
                                                <span key={size} className="text-[8px] bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-lg font-black uppercase">
                                                    {size}: {qty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </section>

                    {quote.contact.message && (
                        <section className="border-t border-gray-100 pt-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-3">Customer Message</h3>
                            <p className="text-xs text-gray-500 italic leading-relaxed bg-zinc-50 p-4 rounded-2xl">"{quote.contact.message}"</p>
                        </section>
                    )}
                </div>
                
                <footer className="p-8 border-t border-gray-100 bg-white">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-zinc-800 transition-all"
                    >
                        Close Details
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default QuoteDetailModal;
