
import React from 'react';
import { ProductSize } from '../types';
import { CloseIcon, RulerIcon } from './icons';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    sizes: ProductSize[];
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, productName, sizes }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-8 border-b border-zinc-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="p-2 bg-black text-white rounded-lg">
                                <RulerIcon className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Size Guide</span>
                        </div>
                        <h2 className="font-eurostile text-2xl uppercase tracking-tighter text-gray-900 leading-none max-w-xs">{productName}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <CloseIcon className="w-6 h-6 text-zinc-400 hover:text-black" />
                    </button>
                </header>

                <div className="p-8">
                    {sizes.length === 0 ? (
                        <p className="text-center text-zinc-400 text-sm">No size chart available for this item.</p>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-xl border border-zinc-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Size</th>
                                            <th className="px-6 py-4">Width (in)</th>
                                            <th className="px-6 py-4">Length (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {sizes.map((size) => (
                                            <tr key={size.name} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="px-6 py-4 font-black uppercase text-zinc-900">{size.name}</td>
                                                <td className="px-6 py-4 text-zinc-600 font-mono">{size.width}"</td>
                                                <td className="px-6 py-4 text-zinc-600 font-mono">{size.length}"</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-500 leading-relaxed">
                                <p className="mb-2"><strong className="text-zinc-900 uppercase tracking-wider">How to Measure:</strong></p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><strong>Width:</strong> Measure across the chest, 1 inch below the armhole, with the garment laying flat.</li>
                                    <li><strong>Length:</strong> Measure from the highest point of the shoulder down to the bottom hem.</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeGuideModal;
