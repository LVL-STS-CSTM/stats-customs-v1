
import React, { useState, useEffect, useRef } from 'react';
import { Product, Color, ProductSize } from '../types';
import { useData } from '../context/DataContext';
import { CloseIcon, PlusIcon, TrashIcon, SparklesIcon } from './icons';
import Accordion from './Accordion';

const isHexColor = (hex: string): boolean => /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex);

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit: Product | null;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '',
    imageUrls: {},
    url: '#',
    isBestseller: false,
    description: '',
    availableSizes: [],
    availableColors: [],
    category: '',
    categoryGroup: '',
    gender: 'Unisex',
    displayOrder: 0,
    leadTimeWeeks: 2,
    supportedPrinting: []
};

const PRINT_METHODS = ["Heat Transfer", "Embroidery", "Sublimation", "DTF Print", "Silk Screen"];

const SectionHeader: React.FC<{number: string, title: string}> = ({number, title}) => (
    <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-100 first:pt-0 first:border-0">
        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs">{number}</span>
        <h3 className="font-oswald text-xl uppercase tracking-wider text-gray-900">{title}</h3>
    </div>
);

const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-red-500 text-[10px] mt-1 font-bold animate-fade-in uppercase tracking-tighter">{message}</p>;
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, productToEdit }) => {
    const { products, collections, materials, updateData } = useData();
    const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(productToEdit || emptyProduct);
    const [manualId, setManualId] = useState('');
    const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
    const [newSize, setNewSize] = useState({ name: '', width: 0, length: 0 });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => {
        setErrors({});
        if (productToEdit) {
            setFormData({ ...emptyProduct, ...productToEdit });
            setManualId('');
        } else {
            const defaultData = { ...emptyProduct };
            if (collections.length > 0) defaultData.categoryGroup = collections[0].name;
            setFormData(defaultData);
            setManualId('');
        }
    }, [productToEdit, isOpen, collections]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (['moq', 'price', 'leadTimeWeeks'].includes(name)) {
             setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const togglePrintingMethod = (method: string) => {
        setFormData(prev => {
            const current = prev.supportedPrinting || [];
            if (current.includes(method)) {
                return { ...prev, supportedPrinting: current.filter(m => m !== method) };
            } else {
                return { ...prev, supportedPrinting: [...current, method] };
            }
        });
    };

    const handleImageUrlChange = (colorName: string, index: number, value: string) => {
        if (errors.imageUrls) {
            setErrors(prev => {
                const next = { ...prev };
                delete next.imageUrls;
                return next;
            });
        }
        setFormData(prev => {
            const newImageUrls = { ...prev.imageUrls };
            const imagesForColor = [...(newImageUrls[colorName] || [])];
            imagesForColor[index] = value;
            newImageUrls[colorName] = imagesForColor;
            return { ...prev, imageUrls: newImageUrls };
        });
    };

    const handleAddColor = () => {
        if (newColor.name && newColor.hex) {
            setFormData(prev => ({
                ...prev,
                imageUrls: { ...prev.imageUrls, [newColor.name]: [] },
                availableColors: [...prev.availableColors, newColor],
            }));
            setNewColor({ name: '', hex: '#000000' });
        }
    };

    const handleAddSize = () => {
        if (newSize.name) {
            setFormData(prev => ({
                ...prev,
                availableSizes: [...prev.availableSizes, newSize]
            }));
            setNewSize({ name: '', width: 0, length: 0 });
        }
    };

    const handleRemoveSize = (index: number) => {
        setFormData(prev => ({
            ...prev,
            availableSizes: prev.availableSizes.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!productToEdit && !manualId.trim()) newErrors.manualId = 'ID required';
        if (!formData.name.trim()) newErrors.name = 'Name required';
        if (!formData.category.trim()) newErrors.category = 'Category required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dataToSave = { ...formData };
        if (productToEdit) {
            updateData('products', products.map(p => p.id === productToEdit.id ? (dataToSave as Product) : p));
        } else {
            updateData('products', [...products, { ...(dataToSave as Omit<Product, 'id'>), id: manualId.trim().toUpperCase(), displayOrder: products.length }]);
        }
        onClose();
    };
    
    const inputClasses = "mt-1 block w-full px-4 py-3.5 bg-gray-50 border border-zinc-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all sm:text-sm";
    const labelClasses = "block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 mb-1";

    return (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
                <header className="flex items-center justify-between p-8 border-b border-gray-50 bg-white z-10">
                    <div>
                        <h2 className="text-3xl font-eurostile uppercase tracking-tighter">{productToEdit ? 'Modify Asset' : 'Register New Asset'}</h2>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Product Lifecycle Management</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center transition-all group">
                        <CloseIcon className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-10 space-y-12 no-scrollbar">
                    {/* Identity */}
                    <section>
                        <SectionHeader number="01" title="Product Specification" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClasses}>Catalogue reference ID</label>
                                <input
                                    type="text"
                                    value={productToEdit ? productToEdit.id : manualId}
                                    onChange={(e) => setManualId(e.target.value)}
                                    className={`${inputClasses} ${productToEdit ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : ''}`}
                                    placeholder="e.g. V-01-TSHIRT"
                                    disabled={!!productToEdit}
                                />
                                <ErrorMessage message={errors.manualId} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Product Marketplace Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className={inputClasses} placeholder="Full Product Title" />
                                <ErrorMessage message={errors.name} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className={labelClasses}>Technical Narrative</label>
                            <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className={inputClasses} placeholder="Detailed product story and benefits..." />
                        </div>
                    </section>

                    {/* Manufacturing Specs */}
                    <section>
                        <SectionHeader number="02" title="Manufacturing Details" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
                            <div>
                                <label className={labelClasses}>Manufacturing MOQ</label>
                                <input type="number" name="moq" value={formData.moq || 24} onChange={handleInputChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Lead Time (Weeks)</label>
                                <input type="number" name="leadTimeWeeks" value={formData.leadTimeWeeks || 2} onChange={handleInputChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Base Unit Price ($)</label>
                                <input type="number" name="price" value={formData.price || 0} onChange={handleInputChange} className={inputClasses} />
                            </div>
                             <div>
                                <label className={labelClasses}>Gender Category</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClasses}>
                                    <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                            <label className={labelClasses}>Supported Application Finishes</label>
                            <div className="flex flex-wrap gap-2">
                                {PRINT_METHODS.map(m => (
                                    <button 
                                        key={m} 
                                        type="button"
                                        onClick={() => togglePrintingMethod(m)}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.supportedPrinting?.includes(m) ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Colors/Media */}
                    <section>
                        <SectionHeader number="03" title="Visual Assets" />
                        <div className="bg-zinc-50 p-8 rounded-[2.5rem] space-y-8">
                            <div>
                                <label className={labelClasses}>Define Variants (Color)</label>
                                <div className="flex gap-4 mb-6">
                                    <input value={newColor.name} onChange={e => setNewColor(c => ({ ...c, name: e.target.value }))} placeholder="Variant Name (e.g. Matte Black)" className="flex-grow px-5 py-3 rounded-2xl bg-white border border-zinc-200 outline-none" />
                                    <input type="color" value={newColor.hex} onChange={e => setNewColor(c => ({ ...c, hex: e.target.value }))} className="w-14 h-14 border-0 p-0 rounded-2xl cursor-pointer" />
                                    <button type="button" onClick={handleAddColor} className="bg-black text-white px-6 rounded-2xl hover:scale-105 transition-all"><PlusIcon className="w-6 h-6"/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.availableColors as any[]).map(c => (
                                        <div key={c.name} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100 group">
                                            <span className="w-3 h-3 rounded-full" style={{backgroundColor: c.hex}}></span>
                                            <span className="text-[10px] font-black uppercase">{c.name}</span>
                                            <button type="button" onClick={() => setFormData(p => ({...p, availableColors: p.availableColors.filter((col: any) => col.name !== c.name)}))}><CloseIcon className="w-3 h-3 text-zinc-300 group-hover:text-red-500"/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(formData.availableColors as any[]).map(color => (
                                    <Accordion key={color.name} title={`${color.name} Assets`}>
                                        <div className="p-4 space-y-4">
                                            {(formData.imageUrls[color.name] || []).map((url, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input 
                                                        value={url} 
                                                        onChange={e => handleImageUrlChange(color.name, idx, e.target.value)} 
                                                        placeholder="Asset URL" 
                                                        className="flex-grow p-3 bg-white border border-zinc-200 rounded-xl text-xs" 
                                                    />
                                                    <button type="button" onClick={() => setFormData(p => {
                                                        const copy = { ...p.imageUrls };
                                                        copy[color.name] = copy[color.name].filter((_:any, i:any) => i !== idx);
                                                        return { ...p, imageUrls: copy };
                                                    })} className="text-red-400 p-3 hover:bg-red-50 rounded-xl transition-all"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => {
                                                setFormData(prev => {
                                                    const copy = { ...prev.imageUrls };
                                                    copy[color.name] = [...(copy[color.name] || []), ''];
                                                    return { ...prev, imageUrls: copy };
                                                });
                                            }} className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-[9px] font-black uppercase text-zinc-400 hover:border-black hover:text-black transition-all">+ Add Asset Link</button>
                                        </div>
                                    </Accordion>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Sizing Section */}
                    <section>
                        <SectionHeader number="04" title="Sizing Configuration" />
                        <div className="bg-zinc-50 p-8 rounded-[2.5rem]">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className={labelClasses}>Size Label</label>
                                    <input 
                                        value={newSize.name} 
                                        onChange={e => setNewSize(s => ({ ...s, name: e.target.value }))} 
                                        placeholder="e.g. XL" 
                                        className={inputClasses} 
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Width (in)</label>
                                    <input 
                                        type="number" 
                                        value={newSize.width || ''} 
                                        onChange={e => setNewSize(s => ({ ...s, width: Number(e.target.value) }))} 
                                        placeholder="20" 
                                        className={inputClasses} 
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Length (in)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            value={newSize.length || ''} 
                                            onChange={e => setNewSize(s => ({ ...s, length: Number(e.target.value) }))} 
                                            placeholder="28" 
                                            className={inputClasses} 
                                        />
                                        <button type="button" onClick={handleAddSize} className="bg-black text-white px-4 rounded-xl hover:scale-105 transition-all flex items-center justify-center">
                                            <PlusIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="px-6 py-3">Label</th>
                                            <th className="px-6 py-3">Width</th>
                                            <th className="px-6 py-3">Length</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {formData.availableSizes.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-400 text-xs uppercase tracking-widest">No sizes configured</td>
                                            </tr>
                                        ) : (
                                            formData.availableSizes.map((size, index) => (
                                                <tr key={index} className="hover:bg-zinc-50">
                                                    <td className="px-6 py-3 font-bold text-zinc-900">{size.name}</td>
                                                    <td className="px-6 py-3 text-zinc-500 font-mono">{size.width}"</td>
                                                    <td className="px-6 py-3 text-zinc-500 font-mono">{size.length}"</td>
                                                    <td className="px-6 py-3 text-right">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleRemoveSize(index)} 
                                                            className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <TrashIcon className="w-4 h-4"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <footer className="pt-10 border-t border-zinc-100 flex justify-end gap-6 sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-10 px-10 pb-6">
                        <button type="button" onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 transition-colors">Discard Draft</button>
                        <button type="submit" className="px-14 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">Push to Catalogue</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
