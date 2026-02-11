
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Service, Capability } from '../types';
import { DragHandleIcon, TrashIcon, PlusIcon } from './icons';
import ServiceFormModal from './ServiceFormModal';
import CapabilityFormModal from './CapabilityFormModal';

const ServiceManagement: React.FC = () => {
    const { services, capabilities, updateData } = useData();
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isCapModalOpen, setIsCapModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [capToEdit, setCapToEdit] = useState<Capability | null>(null);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // --- Service Handlers ---
    const handleAddService = () => {
        setServiceToEdit(null);
        setIsServiceModalOpen(true);
    };

    const handleEditService = (service: Service) => {
        setServiceToEdit(service);
        setIsServiceModalOpen(true);
    };

    const handleDeleteService = (id: string) => {
        if (window.confirm('Delete this service block?')) {
            updateData('services', services.filter(s => s.id !== id));
        }
    };

    // --- Capability Handlers ---
    const handleAddCap = () => {
        setCapToEdit(null);
        setIsCapModalOpen(true);
    };

    const handleEditCap = (cap: Capability) => {
        setCapToEdit(cap);
        setIsCapModalOpen(true);
    };

    const handleDeleteCap = (id: string) => {
        if (window.confirm('Delete this capability card?')) {
            updateData('capabilities', capabilities.filter(c => c.id !== id));
        }
    };

    // --- Generic Drag Logic ---
    const handleSort = (type: 'services' | 'capabilities') => {
        // Fix: Use separate logic for services and capabilities to avoid TypeScript union array splice ambiguity (Line 58-64)
        if (dragItem.current !== null && dragOverItem.current !== null) {
            if (type === 'services') {
                const list = [...services];
                const dragged = list.splice(dragItem.current, 1)[0];
                list.splice(dragOverItem.current, 0, dragged);
                const reordered = list.map((item, idx) => ({ ...item, displayOrder: idx }));
                updateData('services', reordered);
            } else {
                const list = [...capabilities];
                const dragged = list.splice(dragItem.current, 1)[0];
                list.splice(dragOverItem.current, 0, dragged);
                const reordered = list.map((item, idx) => ({ ...item, displayOrder: idx }));
                updateData('capabilities', reordered);
            }
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
        <div className="space-y-12">
            {/* Solutions Management */}
            <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-oswald uppercase tracking-widest text-gray-900">Major Solutions</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage large visual blocks on services page</p>
                    </div>
                    <button onClick={handleAddService} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all">
                        <PlusIcon className="w-4 h-4" /> Add Block
                    </button>
                </header>

                <div className="space-y-4">
                    {services.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((s, idx) => (
                        <div 
                            key={s.id}
                            draggable
                            onDragStart={() => dragItem.current = idx}
                            onDragEnter={() => dragOverItem.current = idx}
                            onDragEnd={() => handleSort('services')}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 group cursor-grab active:cursor-grabbing"
                        >
                            <DragHandleIcon className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                            <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                <img src={s.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <span className="text-[9px] font-black uppercase text-zinc-400">{s.subtitle}</span>
                                <h4 className="text-sm font-black uppercase text-zinc-900">{s.title}</h4>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleEditService(s)} className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Modify</button>
                                <button onClick={() => handleDeleteService(s.id)} className="text-red-400 hover:text-red-600 transition-colors"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && <p className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest">No service blocks defined.</p>}
                </div>
            </section>

            {/* Capabilities Management */}
            <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-oswald uppercase tracking-widest text-gray-900">Technical Capabilities</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage secondary capability cards</p>
                    </div>
                    <button onClick={handleAddCap} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all">
                        <PlusIcon className="w-4 h-4" /> Add Card
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {capabilities.sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((c, idx) => (
                        <div 
                            key={c.id}
                            draggable
                            onDragStart={() => dragItem.current = idx}
                            onDragEnter={() => dragOverItem.current = idx}
                            onDragEnd={() => handleSort('capabilities')}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 group cursor-grab active:cursor-grabbing"
                        >
                            <DragHandleIcon className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                            <div className="flex-grow">
                                <span className="text-[9px] font-black uppercase text-zinc-400">{c.iconName}</span>
                                <h4 className="text-sm font-black uppercase text-zinc-900">{c.title}</h4>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleEditCap(c)} className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Modify</button>
                                <button onClick={() => handleDeleteCap(c.id)} className="text-red-400 hover:text-red-600 transition-colors"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
                {capabilities.length === 0 && <p className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest">No capability cards defined.</p>}
            </section>

            {isServiceModalOpen && (
                <ServiceFormModal 
                    isOpen={isServiceModalOpen} 
                    onClose={() => setIsServiceModalOpen(false)} 
                    serviceToEdit={serviceToEdit} 
                />
            )}

            {isCapModalOpen && (
                <CapabilityFormModal 
                    isOpen={isCapModalOpen} 
                    onClose={() => setIsCapModalOpen(false)} 
                    capToEdit={capToEdit} 
                />
            )}
        </div>
    );
};

export default ServiceManagement;
