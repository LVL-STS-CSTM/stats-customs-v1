
import React, { useRef } from 'react';
import { useOnScreen } from '../useOnScreen';
import LazyImage from './LazyImage';

const techniques = [
    { 
        id: '01',
        title: "Heat Transfer", 
        label: "Precision Depth",
        description: "Graphics cleanly applied with commercial-grade heat for a crisp, vibrant finish.", 
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5dpvr5PsCJ9D_pBSX9k93hXqqbaeRfzEVMw&s" 
    },
    { 
        id: '02',
        title: "Embroidery", 
        label: "Artisan Stitch",
        description: "Stitched directly into the grain for a textured, 3D premium signature.", 
        imageUrl: "https://image.made-in-china.com/365f3j00RCpMcDBsAUoK/Hello-Japan-12-Needles-6-Heads-2-Cab-Computerized-Embroidery-Machine-Portable-Digital-14-Needle-Cap-Embroidery-Machines.webp" 
    },
    { 
        id: '03',
        title: "Sublimation", 
        label: "Atomic Infusion",
        description: "Fade-proof designs infused into the textile for total breathability.", 
        imageUrl: "https://thevisualcommunicationguy.com/wp-content/uploads/2023/10/Sublimation-Printer-800x445.jpg" 
    },
    { 
        id: '04',
        title: "DTF Print", 
        label: "Over-the-Fabric",
        description: "Versatile, high-detail full-color transfers with a durable, flexible finish.", 
        imageUrl: "https://www.shutterstock.com/image-photo/press-printing-on-colored-tshirts-600nw-2392783701.jpg" 
    }
];

const CustomizationShowcase: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef, '0px 0px -20% 0px');

    return (
        <section ref={sectionRef} className="bg-white text-black py-32 lg:py-48 overflow-hidden relative">
            {/* Technical Background Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end mb-24 lg:mb-32">
                    <div className="lg:col-span-7 relative">
                        {/* Animated Line */}
                        <div className={`absolute -top-12 left-0 h-[1px] bg-black transition-all duration-[1.5s] ease-out ${isVisible ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}></div>
                        
                        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.6em] block mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 bg-black rounded-full"></span>
                                Expertise & Hardware
                            </span>
                            <h2 className="font-eurostile font-black text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.8] tracking-tight">
                                Technical<br/>Capabilities
                            </h2>
                        </div>
                    </div>
                    <div className="lg:col-span-5 pb-2">
                        <div className={`transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <p className="text-base md:text-lg text-zinc-600 leading-relaxed font-light border-l-2 border-zinc-200 pl-8">
                                <strong className="text-black font-bold">Precision Meets Craft.</strong> Dito sa STATS, hindi kami basta-basta nagpi-print lang. We combine pro techniques with real craftsmanship para gawing reality ang vision mo. Pulidong gawa at quality na pangmatagalan.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                    {techniques.map((tech, index) => (
                        <div 
                            key={tech.title} 
                            className={`group relative aspect-[3/5] md:aspect-[3/4] overflow-hidden bg-zinc-900 cursor-pointer transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Number BG */}
                            <div className="absolute top-0 right-0 p-6 z-20 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                                <span className="font-eurostile font-black text-9xl text-white leading-none">{tech.id}</span>
                            </div>

                            {/* Image */}
                            <div className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
                                <LazyImage 
                                    src={tech.imageUrl} 
                                    alt={tech.title} 
                                    aspectRatio="h-full w-full"
                                    className="opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                                />
                            </div>
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                            
                            {/* Border Reveal on Hover */}
                            <div className="absolute inset-0 border-[1px] border-white/0 group-hover:border-white/20 transition-all duration-500 m-4 pointer-events-none"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-20 pointer-events-none">
                                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="overflow-hidden mb-2">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 block transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                            {tech.label}
                                        </span>
                                    </div>
                                    <h3 className="font-eurostile font-black text-3xl uppercase tracking-widest mb-4 leading-none text-white group-hover:text-white transition-colors">
                                        {tech.title}
                                    </h3>
                                    <div className="h-[1px] w-12 bg-white/30 mb-4 group-hover:w-full transition-all duration-700 ease-out"></div>
                                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider leading-relaxed max-w-[90%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                                        {tech.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomizationShowcase;
