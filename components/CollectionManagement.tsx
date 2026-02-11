
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Collection } from '../types';
import CollectionFormModal from './CollectionFormModal';

const CollectionManagement: React.FC = () => {
    const { collections, products, updateData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);

    const handleAddNew = () => {
        setCollectionToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (collection: Collection) => {
        setCollectionToEdit(collection);
        setIsModalOpen(true);
    };

    const handleDelete = (collection: Collection) => {
        if (window.confirm(`Are you sure you want to delete the "${collection.name}" collection? This will remove the collection name from all associated products.`)) {
            const newCollections = collections.filter(c => c.id !== collection.id);
            updateData('collections', newCollections);
            
            const updatedProducts = products.map(p => {
                if (p.categoryGroup === collection.name) {
                    return { ...p, categoryGroup: '' };
                }
                return p;
            });
            updateData('products', updatedProducts);
        }
    };

    const productCounts = useMemo(() => {
        return collections.reduce((acc, collection) => {
            acc[collection.name] = products.filter(p => p.categoryGroup === collection.name).length;
            return acc;
        }, {} as Record<string, number>);
    }, [products, collections]);

    return (
        <>
            <div className="bg-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Collections ({collections.length})</h2>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-[#3A3A3A] text-white text-sm font-semibold rounded-md hover:bg-[#4f4f4f] transition-colors"
                    >
                        Add New Collection
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banner Preview</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {collections.sort((a,b) => a.displayOrder - b.displayOrder).map((collection) => (
                                <tr key={collection.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-24 h-14 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                            <img src={collection.imageUrl} alt={collection.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {collection.name}
                                        {collection.description && <p className="text-[10px] text-gray-400 uppercase tracking-tighter truncate w-40">{collection.description}</p>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{productCounts[collection.name] || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEdit(collection)} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(collection)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {collections.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No collections found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <CollectionFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    collectionToEdit={collectionToEdit}
                />
            )}
        </>
    );
};

export default CollectionManagement;
