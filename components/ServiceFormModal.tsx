
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon, PlusIcon, TrashIcon } from './icons';

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceToEdit: Service | null;
}

const emptyService: Omit<Service, 'id' | 'displayOrder'> = {
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    includedItems: []
};

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ isOpen, onClose, serviceToEdit }) => {
    const { services, updateData } = useData();
    const [formData, setFormData] = useState<Service | Omit<Service, 'id' | 'displayOrder'>>(serviceToEdit || emptyService);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        setFormData(serviceToEdit || emptyService);
    }, [serviceToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddIncludedItem = () => {
        if (newItem.trim()) {
            setFormData(prev => ({ ...prev, includedItems: [...prev.includedItems, newItem.trim()] }));
            setNewItem('');
        }
    };

    const handleRemoveIncludedItem = (idx: number) => {
        setFormData(prev => ({ ...prev, includedItems: prev.includedItems.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl) {
            alert('Title and Image URL are required.');
            return;
        }

        if (serviceToEdit) {
            updateData('services', services.map(s => s.id === serviceToEdit.id ? { ...formData, id: s.id, displayOrder: s.displayOrder } as Service : s));
        } else {
            const newService = { ...formData, id: `s-${Date.now()}`, displayOrder: services.length } as Service;
            updateData('services', [...services, newService]);
        }
        onClose();
    };

    const inputClasses = "mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm";
    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-1 mb-1";

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-oswald uppercase tracking-widest">{serviceToEdit ? 'Edit Service block' : 'Add Service block'}</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-400 hover:text-black" /></button>
                </header>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Subtitle (Division)</label>
                            <input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className={inputClasses} placeholder="e.g. PERFORMANCE SYSTEMS" />
                        </div>
                        <div>
                            <label className={labelClasses}>Primary Title</label>
                            <input name="title" value={formData.title} onChange={handleInputChange} className={inputClasses} placeholder="e.g. PERFORMANCE TEAMWEAR" required />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Visual Identity (Image URL)</label>
                        <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} className={inputClasses} placeholder="https://..." required />
                    </div>

                    <div>
                        <label className={labelClasses}>Strategic Narrative</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClasses} placeholder="Explain the value proposition..." />
                    </div>

                    <div className="space-y-4">
                        <label className={labelClasses}>Included Nodes (Bullet Points)</label>
                        <div className="flex gap-2">
                            <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddIncludedItem())} className={inputClasses} placeholder="Add a service item..." />
                            <button type="button" onClick={handleAddIncludedItem} className="bg-black text-white px-4 rounded-xl hover:bg-zinc-800 transition-colors active:scale-95"><PlusIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {formData.includedItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 group">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item}</span>
                                    <button type="button" onClick={() => handleRemoveIncludedItem(idx)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-3.5 h-3.5" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer className="pt-8 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Discard</button>
                        <button type="submit" className="px-8 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">Authorize Block</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;
