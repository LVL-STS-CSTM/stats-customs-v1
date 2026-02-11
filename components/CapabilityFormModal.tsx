
import React, { useState, useEffect } from 'react';
import { Capability } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon } from './icons';

interface CapabilityFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    capToEdit: Capability | null;
}

const emptyCap: Omit<Capability, 'id' | 'displayOrder'> = {
    title: '',
    description: '',
    iconName: 'SparklesIcon'
};

const iconOptions: Capability['iconName'][] = [
    'DesignIcon', 'BriefcaseIcon', 'PrintingIcon', 'PackagingIcon', 'LogisticsIcon', 'ProductionIcon', 'TargetIcon', 'SparklesIcon', 'ChatIcon'
];

const CapabilityFormModal: React.FC<CapabilityFormModalProps> = ({ isOpen, onClose, capToEdit }) => {
    const { capabilities, updateData } = useData();
    const [formData, setFormData] = useState<Capability | Omit<Capability, 'id' | 'displayOrder'>>(capToEdit || emptyCap);

    useEffect(() => {
        setFormData(capToEdit || emptyCap);
    }, [capToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            alert('All fields are required.');
            return;
        }

        if (capToEdit) {
            updateData('capabilities', capabilities.map(c => c.id === capToEdit.id ? { ...formData, id: c.id, displayOrder: c.displayOrder } as Capability : c));
        } else {
            const newCap = { ...formData, id: `cap-${Date.now()}`, displayOrder: capabilities.length } as Capability;
            updateData('capabilities', [...capabilities, newCap]);
        }
        onClose();
    };

    const inputClasses = "mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm";
    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-1 mb-1";

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
                <header className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-oswald uppercase tracking-widest">{capToEdit ? 'Edit Capability' : 'Add Capability'}</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-400 hover:text-black" /></button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className={labelClasses}>Technical Icon</label>
                        <select name="iconName" value={formData.iconName} onChange={handleInputChange} className={inputClasses}>
                            {iconOptions.map(opt => <option key={opt} value={opt}>{opt.replace('Icon', '')}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className={labelClasses}>Card Title</label>
                        <input name="title" value={formData.title} onChange={handleInputChange} className={inputClasses} placeholder="e.g. Precision Printing" required />
                    </div>

                    <div>
                        <label className={labelClasses}>Tactical Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClasses} placeholder="Briefly define this capability..." required />
                    </div>

                    <footer className="pt-8 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Discard</button>
                        <button type="submit" className="px-8 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">Authorize Card</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CapabilityFormModal;
