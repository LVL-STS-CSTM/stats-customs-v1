
import React, { useState } from 'react';
import { ClockIcon, LocationPinIcon, PhoneIcon, MailIcon, SendIcon, TargetIcon } from './icons';
import Button from './Button';
import PageHeader from './PageHeader';

interface ContactPageProps {
    showToast: (message: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ showToast }) => {
    const address = 'Block 3 Lot 4, Daang Hari Road, Ayala Alabang, Muntinlupa, 1776 Metro Manila, Philippines';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15456.45260190539!2d121.01255532599602!3d14.42065097623344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1e0287a2589%3A0x6758da4f78310153!2sDaang%20Hari%20Rd%2C%20Ayala%20Alabang%2C%20Muntinlupa%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1678886400000!5m2!1sen!2sph`;

    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-2 mb-1";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = { contact: formData, items: [] };
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) { 
                setIsSubmitted(true);
                showToast("Message Sent! We'll get back to you soon.");
            } else { 
                const res = await response.json() as any;
                showToast(`Sorry: ${res.message || 'We couldn\'t send your message.'}`); 
            }
        } catch (error) {
            showToast('Error: Failed to connect to our team. Please try again.');
        } finally { setIsSubmitting(false); }
    };
    
    return (
        <div className="bg-white min-h-screen">
            <PageHeader page="contact" fallbackTitle="Get in Touch" fallbackDescription="Have a question? We're here to help you create the perfect custom apparel." />
            
            <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-12 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    
                    {/* Left: Contact Info */}
                    <div className="space-y-20">
                        <div>
                             <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-[1px] bg-black"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black">Visit Our Studio</span>
                            </div>
                            <h2 className="font-eurostile text-4xl lg:text-5xl text-gray-900 uppercase tracking-tighter leading-none mb-8">Our Location</h2>
                            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-xl">
                                We'd love to meet you! Stop by our studio in Muntinlupa to check out our fabrics, see our work in person, and chat about your next project.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex flex-col gap-6 group hover:border-black transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <LocationPinIcon className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Find Us At</h3>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase">{address}</p>
                                </div>
                            </div>

                            <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex flex-col gap-6 group hover:border-black transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <ClockIcon className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Opening Hours</h3>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase">Mon-Fri: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                            
                            <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex flex-col gap-6 group hover:border-black transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <MailIcon className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Email Us</h3>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed break-all">CONTACT@STATSCUSTOMS.PH</p>
                                </div>
                            </div>

                            <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex flex-col gap-6 group hover:border-black transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <PhoneIcon className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Call Us</h3>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase">+63 (02) 123 4567</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2.5rem] overflow-hidden border-8 border-zinc-50 shadow-2xl h-80 relative">
                             <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location Map" className="grayscale hover:grayscale-0 transition-all duration-700"></iframe>
                             <div className="absolute bottom-4 right-4">
                                <Button href={googleMapsUrl} variant="solid" target="_blank" rel="noopener noreferrer" className="rounded-full shadow-2xl text-[10px] py-3 px-6">
                                    Open in Google Maps &rarr;
                                </Button>
                             </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="sticky top-32">
                        <section className="bg-[#0F0F0F] p-10 md:p-14 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                             
                             <header className="mb-12 relative z-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                                    <TargetIcon className="w-4 h-4 text-white" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Connect with our team</span>
                                </div>
                                <h2 className="font-eurostile text-3xl uppercase tracking-tighter">Tell us about your project</h2>
                             </header>

                             {isSubmitted ? (
                                <div className="py-20 text-center space-y-8 animate-fade-in relative z-10">
                                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                                        <SendIcon className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-eurostile text-2xl uppercase tracking-widest text-white">Message Sent!</h3>
                                        <p className="text-zinc-500 mt-4 text-sm font-light uppercase tracking-widest">We've received your inquiry. One of our specialists will get back to you within 24 hours.</p>
                                    </div>
                                    <button onClick={() => setIsSubmitted(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Send Another Message</button>
                                </div>
                             ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClasses}>Full Name</label>
                                            <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm" placeholder="YOUR NAME" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Email Address</label>
                                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm" placeholder="EMAIL@EXAMPLE.COM" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClasses}>Contact Number</label>
                                            <input name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm" placeholder="MOBILE OR LANDLINE" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Company (Optional)</label>
                                            <input name="company" value={formData.company} onChange={handleInputChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm" placeholder="BUSINESS NAME" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>How can we help?</label>
                                        <textarea name="message" rows={4} value={formData.message} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm resize-none" placeholder="DESCRIBE YOUR PROJECT OR QUESTIONS..."></textarea>
                                    </div>

                                    <div className="pt-6">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-2xl"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <SendIcon className="w-4 h-4" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-6">We'll keep your information safe and secure.</p>
                                    </div>
                                </form>
                             )}
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;
