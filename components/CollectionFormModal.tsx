
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Collection } from '../types';
import { CloseIcon } from './icons';

interface CollectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    collectionToEdit: Collection | null;
}

const emptyCollection: Omit<Collection, 'id'> = {
    name: '',
    imageUrl: '',
    description: '',
    displayOrder: 0
};

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({ isOpen, onClose, collectionToEdit }) => {
    const { collections, products, updateData } = useData();
    const [formData, setFormData] = useState<Collection | Omit<Collection, 'id'>>(collectionToEdit || emptyCollection);

    useEffect(() => {
        if (isOpen) {
            setFormData(collectionToEdit || { ...emptyCollection, displayOrder: collections.length });
        }
    }, [collectionToEdit, isOpen, collections.length]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = formData.name.trim();
        const imageUrl = formData.imageUrl.trim();
        
        if (!name || !imageUrl) {
            alert('Name and Banner Image URL are required.');
            return;
        }

        if (collectionToEdit) {
            const updatedCollections = collections.map(c => c.id === collectionToEdit.id ? { ...formData, id: c.id } as Collection : c);
            updateData('collections', updatedCollections);

            // If name changed, update products linked to this group
            if (name !== collectionToEdit.name) {
                const updatedProducts = products.map(p => {
                    if (p.categoryGroup === collectionToEdit.name) {
                        return { ...p, categoryGroup: name };
                    }
                    return p;
                });
                updateData('products', updatedProducts);
            }

        } else {
            const newCollection = { ...formData, id: `c-${Date.now()}` } as Collection;
            updateData('collections', [...collections, newCollection]);
        }
        onClose();
    };

    const darkInputStyles = "mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white sm:text-sm placeholder-gray-400";
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" role="dialog" aria-modal="true">
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{collectionToEdit ? 'Edit Collection' : 'Add New Collection'}</h2>
                    <button onClick={onClose} aria-label="Close form">
                        <CloseIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Collection Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            autoFocus
                            className={darkInputStyles}
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Banner Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            required
                            placeholder="https://images.pexels.com/..."
                            className={darkInputStyles}
                        />
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Recommended size: 1200x800px</p>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Description (Optional)</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description || ''}
                            onChange={handleInputChange}
                            rows={2}
                            className={darkInputStyles}
                            placeholder="Briefly describe this division..."
                        />
                    </div>
                    <footer className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f]">
                            Save Collection
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CollectionFormModal;
