
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import Button from './Button';
import LazyImage from './LazyImage';
import { SparklesIcon, CloseIcon, PrintingIcon, DesignIcon } from './icons';

/**
 * @description Mockup Generator Page component for creating custom product previews.
 */
const MockupGeneratorPage: React.FC = () => {
    const { products } = useData();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [logoPos, setLogoPos] = useState({ x: 0.5, y: 0.5, scale: 0.15 });
    const [isExporting, setIsExporting] = useState(false);

    const mockupProducts = products.filter(p => p.mockupImageUrl);

    useEffect(() => {
        if (selectedProduct && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const productImg = new Image();
            productImg.crossOrigin = "anonymous";
            productImg.src = selectedProduct.mockupImageUrl!;
            productImg.onload = () => {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(productImg, 0, 0);

                if (logo) {
                    const logoImg = new Image();
                    logoImg.src = logo;
                    logoImg.onload = () => {
                        const area = selectedProduct.mockupArea || { top: 20, left: 20, width: 60, height: 60 };
                        const drawW = (canvas.width * (area.width / 100)) * logoPos.scale * 4;
                        const drawH = logoImg.height * (drawW / logoImg.width);
                        
                        const drawX = (canvas.width * (area.left / 100)) + (canvas.width * (area.width / 100) * logoPos.x) - (drawW / 2);
                        const drawY = (canvas.height * (area.top / 100)) + (canvas.height * (area.height / 100) * logoPos.y) - (drawH / 2);
                        
                        ctx.shadowColor = "rgba(0,0,0,0.1)";
                        ctx.shadowBlur = 10;
                        ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
                        ctx.shadowBlur = 0;
                    };
                }
            };
        }
    }, [selectedProduct, logo, logoPos]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (prev) => setLogo(prev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        setIsExporting(true);
        setTimeout(() => {
            const link = document.createElement('a');
            link.download = `LEVEL-MOCKUP-${selectedProduct?.id}-${Date.now()}.png`;
            link.href = canvasRef.current?.toDataURL('image/png') || '';
            link.click();
            setIsExporting(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-14 text-white overflow-hidden selection:bg-zinc-700">
            <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
                
                <aside className="w-full lg:w-96 bg-[#111111] border-r border-white/5 flex flex-col z-20 shadow-2xl">
                    <header className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Design Studio</span>
                        </div>
                        <h1 className="font-oswald text-3xl uppercase tracking-widest">Mockup Builder</h1>
                        <p className="text-xs text-white/40 mt-1 font-medium">Create and preview your custom gear.</p>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                        <section className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">01. Choose a Product</label>
                                <span className="text-[9px] text-zinc-400 font-bold">{mockupProducts.length} Items</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {mockupProducts.map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setSelectedProduct(p)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${selectedProduct?.id === p.id ? 'border-white bg-white/10' : 'border-white/5 bg-white/5'}`}
                                        title={p.name}
                                    >
                                        <img src={p.mockupImageUrl!} alt={p.name} className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">02. Upload Your Logo</label>
                            <div className={`relative group p-6 rounded-2xl border-2 border-dashed transition-all ${logo ? 'border-white/50 bg-white/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                                <input type="file" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <div className="text-center space-y-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto group-hover:bg-zinc-800 transition-colors">
                                        <DesignIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                                        {logo ? 'Change Logo' : 'Select Logo File'}
                                    </p>
                                    <p className="text-[9px] text-white/30 uppercase tracking-tighter">SVG / PNG Recommended</p>
                                </div>
                            </div>
                        </section>

                        {logo && (
                            <section className="space-y-6 animate-fade-in">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">03. Adjust Your Design</label>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40">
                                            <span>Logo Size</span>
                                            <span className="text-white">{(logoPos.scale * 100).toFixed(0)}%</span>
                                        </div>
                                        <input type="range" min="0.05" max="0.5" step="0.01" value={logoPos.scale} onChange={(e) => setLogoPos(p => ({...p, scale: parseFloat(e.target.value)}))} className="w-full accent-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Left / Right</span>
                                            <input type="range" min="0" max="1" step="0.01" value={logoPos.x} onChange={(e) => setLogoPos(p => ({...p, x: parseFloat(e.target.value)}))} className="w-full accent-white/20" />
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Up / Down</span>
                                            <input type="range" min="0" max="1" step="0.01" value={logoPos.y} onChange={(e) => setLogoPos(p => ({...p, y: parseFloat(e.target.value)}))} className="w-full accent-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <footer className="p-8 border-t border-white/5 bg-[#0D0D0D]">
                        <Button 
                            variant="solid" 
                            className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-xl flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-white/5"
                            disabled={!selectedProduct || !logo || isExporting}
                            onClick={handleDownload}
                        >
                            {isExporting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    <span className="text-xs font-black uppercase tracking-widest">Creating Mockup...</span>
                                </>
                            ) : (
                                <>
                                    <PrintingIcon className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Download Mockup</span>
                                </>
                            )}
                        </Button>
                    </footer>
                </aside>

                <main className="flex-1 bg-[#050505] relative flex items-center justify-center p-8 lg:p-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    
                    <div className={`relative w-full max-w-2xl bg-[#0F0F0F] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden transition-all duration-700 ${selectedProduct ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}>
                        {selectedProduct ? (
                            <div className="relative group">
                                <canvas ref={canvasRef} className="w-full h-auto" />
                                <div className="absolute top-6 left-6 flex flex-col gap-1">
                                    <span className="text-[10px] font-mono text-zinc-300 bg-black/80 px-2 py-1 rounded">Model: {selectedProduct.name}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-[4/5] flex flex-col items-center justify-center text-center p-12 space-y-6">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                                    <DesignIcon className="w-8 h-8 text-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-oswald text-xl uppercase tracking-widest text-white/60">Ready to design?</h3>
                                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Pick a product from the list to get started</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="absolute bottom-8 right-8 text-right hidden md:block">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">High-Resolution Preview</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MockupGeneratorPage;
