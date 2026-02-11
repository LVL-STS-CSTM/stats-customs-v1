
import React, { useMemo } from 'react';
import { useQuote } from '../context/CartContext';
import { CloseIcon, TrashIcon, SparklesIcon } from './icons';
import { QuoteItem } from '../types';
import Button from './Button';
import LazyImage from './LazyImage';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, onCheckout }) => {
    const { quoteItems } = useQuote();

    const title = 'Your Inquiry List';

    const totalEstimate = useMemo(() => {
        return quoteItems.reduce((sum: number, item: QuoteItem) => {
            // Safety check for item structure
            if (!item || !item.sizeQuantities) return sum;
            const qty = Object.values(item.sizeQuantities).reduce((s: number, q: number) => s + q, 0);
            return sum + ((item.unitPrice || 0) * qty);
        }, 0);
    }, [quoteItems]);

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="font-oswald text-xl uppercase tracking-widest">{title}</h2>
                        <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-400 hover:text-black transition-colors" /></button>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                        {quoteItems.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-oswald uppercase tracking-widest">Your list is empty</p>
                                <button onClick={onClose} className="mt-4 text-xs font-black uppercase underline tracking-widest text-black">Browse Catalogue</button>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {quoteItems.map(item => <QuoteItemRow key={item.quoteItemId} item={item} />)}
                            </ul>
                        )}
                    </div>

                    {quoteItems.length > 0 && (
                        <footer className="p-6 border-t border-gray-100 space-y-4 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Estimated Total</span>
                                    <span className="text-2xl font-oswald font-black text-black">₱{totalEstimate.toLocaleString()}</span>
                                </div>
                            </div>
                            <Button 
                                variant="solid" 
                                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 bg-black" 
                                onClick={onCheckout}
                            >
                                Proceed to Inquiry
                            </Button>
                        </footer>
                    )}
                </div>
            </div>
        </>
    );
};

const QuoteItemRow: React.FC<{item: QuoteItem}> = ({ item }) => {
    const { removeFromQuote } = useQuote();

    // Critical defensive checks for malformed data
    // This prevents the entire cart from crashing if one item is corrupted in local storage
    if (!item || !item.product || !item.sizeQuantities || !item.selectedColor) {
        return null; 
    }

    const totalQty = Object.values(item.sizeQuantities).reduce((s: number, q: number) => s + q, 0);
    const imageUrls = item.product.imageUrls || {};
    const imagesForColor = imageUrls[item.selectedColor.name] || [];
    const imageUrl = imagesForColor[0] || Object.values(imageUrls).flat()[0] || 'https://placehold.co/100x120?text=No+Image';

    return (
        <li className="flex gap-5 p-4 bg-zinc-50 rounded-2xl group transition-all hover:bg-white hover:shadow-xl border border-transparent hover:border-zinc-100">
            <div className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-zinc-200">
                <LazyImage src={imageUrl} alt={item.product.name || 'Product'} aspectRatio="aspect-square" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-black uppercase truncate pr-4 text-zinc-900">{item.product.name}</h3>
                        <button onClick={() => removeFromQuote(item.quoteItemId)} className="text-zinc-300 hover:text-red-500 transition-colors shrink-0"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.selectedColor.hex}}></span>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{item.selectedColor.name} • {totalQty} pcs</p>
                    </div>
                </div>
                <div className="flex items-end justify-between">
                     <div className="flex flex-wrap gap-1">
                        {Object.entries(item.sizeQuantities).map(([s, q]) => (
                            <span key={s} className="text-[8px] bg-white border border-zinc-100 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter text-zinc-600">{s}: {q}</span>
                        ))}
                    </div>
                    <p className="text-xs font-black text-zinc-900">₱{((item.unitPrice || 0) * (totalQty as number)).toLocaleString()}</p>
                </div>
            </div>
        </li>
    );
}

export default QuoteModal;
