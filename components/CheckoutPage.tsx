
import React, { useState, useMemo } from 'react';
import { useQuote } from '../context/CartContext';
import { View } from '../types';
import Button from './Button';
import LazyImage from './LazyImage';
import { ChevronDownIcon, SendIcon, CartIcon } from './icons';

interface CheckoutPageProps {
    onNavigate: (page: View) => void;
    showToast: (message: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, showToast }) => {
    const { quoteItems, clearQuote } = useQuote();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        country: 'Philippines',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        postalCode: '',
        city: '',
        region: '',
        phone: '',
        shippingMethod: 'GoGo Express',
        paymentMethod: 'Gcash'
    });

    const subtotal = useMemo(() => {
        return quoteItems.reduce((sum, item) => {
            const qty = Object.values(item.sizeQuantities).reduce((s: number, q: number) => s + q, 0);
            return sum + (item.unitPrice * qty);
        }, 0);
    }, [quoteItems]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (quoteItems.length === 0) return;
        
        setIsSubmitting(true);

        try {
            const processedItems = await Promise.all(quoteItems.map(async (item) => {
                let logoData = null;
                let designData = null;

                if (item.logoFile) {
                    try { logoData = await fileToBase64(item.logoFile); } catch (e) { console.error("Logo processing error", e); }
                }
                if (item.designFile) {
                    try { designData = await fileToBase64(item.designFile); } catch (e) { console.error("Design processing error", e); }
                }

                return {
                    product: { id: item.product.id, name: item.product.name },
                    selectedColor: item.selectedColor,
                    sizeQuantities: item.sizeQuantities,
                    unitPrice: item.unitPrice,
                    logoData,
                    designData
                };
            }));

            const submissionData = {
                contact: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.apartment || 'N/A',
                    message: `Address: ${formData.address}, ${formData.city}, ${formData.region}, ${formData.postalCode} | Shipping: ${formData.shippingMethod} | Payment: ${formData.paymentMethod}`,
                    address: `${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}, ${formData.region}, ${formData.postalCode}`,
                    deliveryMethod: formData.shippingMethod,
                    paymentMethod: formData.paymentMethod
                },
                type: 'quote_request', // Always a quote request now
                items: processedItems,
            };

            const response = await fetch('/api/quotes', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(submissionData) 
            });
            
            if (response.ok) {
                setIsSuccess(true);
                clearQuote();
                window.scrollTo(0, 0);
            } else {
                showToast("Submission failed. Please check your inputs.");
            }
        } catch (error) { 
            showToast('Connection error. Please check your internet.'); 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="font-eurostile font-black text-3xl uppercase tracking-widest text-gray-900 mb-4">
                    Inquiry Sent
                </h1>
                <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed uppercase tracking-widest font-medium mb-12">
                    Your custom inquiry has been submitted. A specialist will review your requirements and contact you within 24 hours.
                </p>
                <Button variant="solid" onClick={() => onNavigate('home')} className="px-12 py-5 rounded-full">
                    Back to Home
                </Button>
            </div>
        );
    }

    const inputClasses = "w-full px-4 py-3.5 bg-white border border-zinc-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all text-sm placeholder-zinc-300";
    const labelClasses = "block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1";

    return (
        <div className="bg-white min-h-screen pt-20 lg:pt-0">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
                <div className="lg:col-span-7 px-6 py-12 lg:px-20 lg:py-24 border-r border-zinc-100">
                    <button 
                        onClick={() => onNavigate('browse')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-12"
                    >
                        <span>&larr; Back to Products</span>
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-16">
                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0">
                                <SendIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase text-amber-900">Quotation Notice</h3>
                                <p className="text-[10px] text-amber-800 uppercase tracking-widest leading-relaxed mt-1">
                                    This submission is a <strong>Quote Request</strong>. Our team will contact you to finalize pricing and production details.
                                </p>
                            </div>
                        </div>

                        <section className="space-y-8">
                            <h2 className="font-eurostile font-black text-xl uppercase tracking-widest">Contact Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClasses}>Email Address</label>
                                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="you@example.com" required className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Country</label>
                                    <select name="country" value={formData.country} onChange={handleInputChange} className={inputClasses}>
                                        <option value="Philippines">Philippines</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="font-eurostile font-black text-xl uppercase tracking-widest">Shipping Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>First Name</label>
                                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" required className={inputClasses} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClasses}>Complete Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="House Number, Street, Barangay" required className={`${inputClasses} h-24 resize-none`}></textarea>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClasses}>Postal Code</label>
                                        <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="1776" required className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>City</label>
                                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City Name" required className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Region</label>
                                        <select name="region" value={formData.region} onChange={handleInputChange} required className={inputClasses}>
                                            <option value="">Select region</option>
                                            <option value="NCR">National Capital Region (NCR)</option>
                                            <option value="Region 4A">CALABARZON</option>
                                            <option value="Region 3">Central Luzon</option>
                                            <option value="Region 1">Ilocos Region</option>
                                            <option value="Region 2">Cagayan Valley</option>
                                            <option value="Region 5">Bicol Region</option>
                                            <option value="Region 6">Western Visayas</option>
                                            <option value="Region 7">Central Visayas</option>
                                            <option value="Region 8">Eastern Visayas</option>
                                            <option value="Region 9">Zamboanga Peninsula</option>
                                            <option value="Region 10">Northern Mindanao</option>
                                            <option value="Region 11">Davao Region</option>
                                            <option value="Region 12">SOCCSKSARGEN</option>
                                            <option value="Region 13">Caraga</option>
                                            <option value="BARMM">Bangsamoro</option>
                                            <option value="CAR">Cordillera</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Phone Number</label>
                                    <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="e.g. 0912 345 6789" required className={inputClasses} />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="font-eurostile font-black text-xl uppercase tracking-widest">Payment Method</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['BDO', 'Gcash', 'BPI'].map(method => (
                                    <button 
                                        key={method}
                                        type="button"
                                        onClick={() => setFormData({...formData, paymentMethod: method})}
                                        className={`py-5 border-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.paymentMethod === method ? 'border-black bg-black text-white' : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-300'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="pt-12">
                            <Button 
                                type="submit" 
                                variant="solid" 
                                disabled={isSubmitting || quoteItems.length === 0}
                                className="w-full py-6 rounded-full font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <SendIcon className="w-5 h-5" />
                                        <span>Submit for Quotation</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-5 bg-zinc-50 px-6 py-12 lg:px-20 lg:py-24">
                    <div className="lg:sticky lg:top-12 space-y-12">
                        <header>
                            <h2 className="font-eurostile font-black text-xl uppercase tracking-widest mb-1">
                                Project Summary
                            </h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">({quoteItems.length}) Items Selected</p>
                        </header>

                        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 no-scrollbar">
                            {quoteItems.map(item => {
                                const images = Object.values(item.product.imageUrls).flat();
                                const qty = Object.values(item.sizeQuantities).reduce((s: number,q: number) => s+q, 0);
                                return (
                                    <div key={item.quoteItemId} className="flex gap-6 animate-fade-in">
                                        <div className="w-24 h-32 bg-white rounded-2xl overflow-hidden border border-zinc-200 shrink-0">
                                            <LazyImage src={images[0]} alt={item.product.name} aspectRatio="aspect-square" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-black uppercase text-zinc-900 leading-tight mb-1">{item.product.name}</h4>
                                                    <span className="text-[7px] font-black text-amber-600 border border-amber-200 px-1 py-0.5 rounded uppercase shrink-0 ml-2">Quote</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.selectedColor.hex}}></span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.selectedColor.name}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {Object.entries(item.sizeQuantities).map(([s, q]) => (
                                                        <span key={s} className="text-[9px] bg-white px-2 py-0.5 rounded border border-zinc-200 font-black uppercase">{s}: {q}</span>
                                                    ))}
                                                </div>
                                                {(item.logoFile || item.designFile) && (
                                                    <div className="mt-2 flex gap-2">
                                                        {item.logoFile && <span className="text-[7px] bg-zinc-200 px-1 py-0.5 rounded uppercase font-black">Logo Attached</span>}
                                                        {item.designFile && <span className="text-[7px] bg-zinc-200 px-1 py-0.5 rounded uppercase font-black">Design Attached</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-mono font-bold">₱{(item.unitPrice * qty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-zinc-200">
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Est. Subtotal</span>
                                <span className="font-mono text-zinc-900">₱{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                <span className="font-eurostile font-black text-xl uppercase tracking-tighter">
                                    Estimated Total
                                </span>
                                <span className="font-mono font-black text-2xl">₱{subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
