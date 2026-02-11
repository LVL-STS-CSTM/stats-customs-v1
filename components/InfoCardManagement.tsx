
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { InfoCard, View } from '../types';
import { TrashIcon, PlusIcon } from './icons';

const allViews: View[] = [
    'about', 'partners', 'contact', 'faq', 'services', 
    'terms-of-service', 'return-policy', 'privacy-policy', 'materials', 'catalogue', 'mockup-generator'
];

const InfoCardEditor: React.FC<{ 
    cardData: InfoCard; 
    showToast: (message: string) => void;
    onDelete: (id: string) => void;
}> = ({ cardData, showToast, onDelete }) => {
    const { infoCards, updateData } = useData();
    const [formData, setFormData] = useState<InfoCard>(cardData);

    useEffect(() => {
        setFormData(cardData);
    }, [cardData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newForm = { ...prev, [name]: value };
            // If we change the link type, reset the link value to prevent invalid combinations
            if (name === 'linkType') {
                newForm.linkValue = '';
            }
            return newForm;
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedCards = infoCards.map(c => c.id === formData.id ? formData : c);
        updateData('infoCards', updatedCards);
        showToast(`'${formData.title.replace('\n', ' ')}' card saved!`);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            onDelete(formData.id);
        }
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A3A3A] sm:text-sm placeholder-gray-500";
    
    return (
        <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Card ID: {formData.id} | Order: {formData.displayOrder || 0}
                </span>
                <button 
                    type="button" 
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                    title="Delete Card"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`title-${formData.id}`} className="block text-sm font-medium text-gray-700">Title</label>
                        <textarea
                            name="title"
                            id={`title-${formData.id}`}
                            rows={2}
                            value={formData.title}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        />
                         <p className="text-xs text-gray-500 mt-1">Use a new line for a line break.</p>
                    </div>
                    <div>
                        <label htmlFor={`imageUrl-${formData.id}`} className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            id={`imageUrl-${formData.id}`}
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor={`description-${formData.id}`} className="block text-sm font-medium text-gray-700">Popup Description (Optional)</label>
                    <textarea
                        name="description"
                        id={`description-${formData.id}`}
                        rows={3}
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        placeholder="If filled, clicking the card opens a detail popup before navigating."
                        className={darkInputStyles}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`linkType-${formData.id}`} className="block text-sm font-medium text-gray-700">Link Type</label>
                        <select
                            name="linkType"
                            id={`linkType-${formData.id}`}
                            value={formData.linkType}
                            onChange={handleInputChange}
                            className={darkInputStyles}
                        >
                            <option value="page">Internal Page</option>
                            <option value="modal">Modal Pop-up</option>
                            <option value="external">External URL</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`linkValue-${formData.id}`} className="block text-sm font-medium text-gray-700">Link Destination</label>
                        {formData.linkType === 'page' && (
                            <select name="linkValue" id={`linkValue-${formData.id}`} value={formData.linkValue} onChange={handleInputChange} className={darkInputStyles}>
                                 <option value="">-- Select Page --</option>
                                 {allViews.sort().map(view => <option key={view} value={view}>{view.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                            </select>
                        )}
                        {formData.linkType === 'modal' && (
                            <select name="linkValue" id={`linkValue-${formData.id}`} value={formData.linkValue} onChange={handleInputChange} className={darkInputStyles}>
                                <option value="">-- Select Modal --</option>
                                <option value="subscribe">Subscription Modal</option>
                                <option value="search">Search Modal</option>
                            </select>
                        )}
                        {formData.linkType === 'external' && (
                            <input
                                type="url"
                                name="linkValue"
                                id={`linkValue-${formData.id}`}
                                value={formData.linkValue}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                                className={darkInputStyles}
                                required
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 text-sm font-semibold">
                        Save Card
                    </button>
                </div>
            </form>
        </div>
    );
};

const InfoCardManagement: React.FC = () => {
    const { infoCards, updateData } = useData();
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleAddCard = () => {
        const newCard: InfoCard = {
            id: `card-${Date.now()}`,
            title: 'NEW INFO\nCARD',
            imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
            linkType: 'page',
            linkValue: 'contact',
            displayOrder: infoCards.length
        };
        updateData('infoCards', [...infoCards, newCard]);
        showToast('New card added!');
    };

    const handleDeleteCard = (id: string) => {
        const updatedCards = infoCards.filter(c => c.id !== id);
        updateData('infoCards', updatedCards);
        showToast('Card deleted.');
    };

    return (
        <div className="space-y-6 relative">
             {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    {toast.message}
                </div>
            )}
            
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleAddCard}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Info Card
                </button>
            </div>

            {infoCards
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map(card => (
                    <InfoCardEditor 
                        key={card.id} 
                        cardData={card} 
                        showToast={showToast} 
                        onDelete={handleDeleteCard}
                    />
                ))
            }
            
            {infoCards.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p className="font-oswald uppercase tracking-widest mb-4">No info cards displayed.</p>
                    <button onClick={handleAddCard} className="text-sm underline hover:text-black">Create your first card</button>
                </div>
            )}
        </div>
    );
}

export default InfoCardManagement;
