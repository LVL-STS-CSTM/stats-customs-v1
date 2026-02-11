
import React, { useState } from 'react';
import { CloseIcon, MailIcon } from './icons';
import { useData } from '../context/DataContext';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    showToast: (message: string) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, showToast }) => {
    const { subscriptionModalContent } = useData();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        try {
            localStorage.setItem('subscriptionModalDismissed', 'true');
        } catch (e) {
            console.error("Failed to save to localStorage", e);
        }
        // Delay reset to allow closing animation
        setTimeout(() => {
            setEmail('');
            setIsSubmitted(false);
            setError('');
        }, 300);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                try {
                    localStorage.setItem('subscriptionModalDismissed', 'true');
                } catch (e) {
                    console.error("Failed to save to localStorage", e);
                }
                setIsSubmitted(true);
            } else {
                const data = await response.json();
                setError(data.message || 'An error occurred.');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div 
                className={`bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                role="dialog" aria-modal="true"
            >
                {/* Image Column */}
                <div className="relative hidden md:block">
                    <img src={subscriptionModalContent.imageUrl} alt="Join the inner circle" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Content Column */}
                <div className="relative flex flex-col">
                    <button onClick={handleClose} aria-label="Close form" className="absolute top-3 right-3 text-gray-400 hover:text-black z-10">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                    
                    {isSubmitted ? (
                        <div className="p-8 md:p-12 text-center flex-grow flex flex-col justify-center">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-oswald uppercase tracking-wider text-gray-900">You're In!</h2>
                            <p className="text-gray-700 mt-3">Keep an eye on your inbox for updates. Siguradong LEVEL up ang style mo!</p>
                            <button onClick={handleClose} className="mt-6 w-full py-3 bg-[#3A3A3A] text-white rounded-md hover:bg-[#4f4f4f] font-semibold">
                                Continue Browsing
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
                            <h2 className="text-3xl font-oswald uppercase tracking-wider text-gray-900 text-center">{subscriptionModalContent.title}</h2>
                            <p className="text-gray-600 text-center mt-3 mb-6 uppercase tracking-widest text-[10px] font-bold">{subscriptionModalContent.description}</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="subscription-email" className="sr-only">Email Address</label>
                                    <div className="relative">
                                         <MailIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                         <input
                                            type="email"
                                            id="subscription-email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                                            required
                                            autoFocus
                                            placeholder="EMAIL@EXAMPLE.COM"
                                            className={`w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-sm font-bold uppercase tracking-widest ${error ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-black focus:border-black'}`}
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-[9px] font-black mt-1 uppercase">{error}</p>}
                                </div>
                                <button type="submit" className="w-full py-4 bg-black text-white rounded-xl hover:bg-zinc-800 font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Join Now'}
                                </button>
                                <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest mt-4">We respect your privacy. Unsubscribe at any time.</p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
