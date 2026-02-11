
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { SubmittedQuote, Subscription, EmailCampaign, QuoteStatus } from '../types';

interface AdminContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    submittedQuotes: SubmittedQuote[];
    subscriptions: Subscription[];
    emailCampaigns: EmailCampaign[];
    fetchAdminData: () => Promise<void>;
    updateQuoteStatus: (quoteId: string, status: QuoteStatus) => Promise<boolean>;
    sendEmailCampaign: (subject: string, content: string, segment: 'all' | 'recent') => Promise<number>;
    updateCredentials: (username: string, password: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!sessionStorage.getItem('admin_token');
    });
    const [submittedQuotes, setSubmittedQuotes] = useState<SubmittedQuote[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);

    const logout = useCallback(() => {
        sessionStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        setSubmittedQuotes([]);
        setSubscriptions([]);
        window.location.href = '/';
    }, []);

    const fetchAdminData = useCallback(async () => {
        const token = sessionStorage.getItem('admin_token');
        if (!token) return;

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [quotesRes, subsRes, campaignsRes] = await Promise.all([
                fetch('/api/quotes', { headers }),
                fetch('/api/subscriptions', { headers }),
                fetch('/api/data/emailCampaigns', { headers }),
            ]);

            if (quotesRes.status === 401) {
                logout();
                return;
            }

            if (quotesRes.ok) setSubmittedQuotes(await quotesRes.json());
            if (subsRes.ok) setSubscriptions(await subsRes.json());
            if (campaignsRes.ok) setEmailCampaigns(await campaignsRes.json());

        } catch (error) {
            console.error("Critical: Admin Data Sync Failure", error);
        }
    }, [logout]);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    sessionStorage.setItem('admin_token', data.token);
                    setIsAuthenticated(true);
                    await fetchAdminData(); 
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Identity Verification Error:", error);
            return false;
        }
    };
    
    const updateQuoteStatus = async (quoteId: string, status: QuoteStatus): Promise<boolean> => {
        try {
            const token = sessionStorage.getItem('admin_token');
            if (!token) return false;

            const response = await fetch(`/api/quotes`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quoteId, status }),
            });

            if (response.ok) {
                setSubmittedQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Workflow Update Error:", error);
            return false;
        }
    };

    const updateCredentials = async (username: string, password: string): Promise<boolean> => {
        try {
            const token = sessionStorage.getItem('admin_token');
            if (!token) return false;

            const response = await fetch('/api/admin/credentials', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, password }),
            });

            return response.ok;
        } catch (error) {
            console.error("Credential Rotation Error:", error);
            return false;
        }
    };

    const sendEmailCampaign = async (subject: string, content: string, segment: 'all' | 'recent'): Promise<number> => {
        const token = sessionStorage.getItem('admin_token');
        if(!token) return 0;

        let recipientCount = 0;
        if (segment === 'all') {
            recipientCount = subscriptions.length;
        } else {
             const thirtyDaysAgo = new Date();
             thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
             recipientCount = subscriptions.filter(s => new Date(s.date) > thirtyDaysAgo).length;
        }

        if (recipientCount > 0) {
            const newCampaign: EmailCampaign = {
                id: `camp-${Date.now()}`,
                subject,
                content,
                sentDate: new Date().toISOString(),
                recipientCount,
                recipientSegment: segment,
            };
            const updatedCampaigns = [...emailCampaigns, newCampaign];
            
            const res = await fetch('/api/data/emailCampaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedCampaigns)
            });

            if (res.ok) {
                setEmailCampaigns(updatedCampaigns);
                return recipientCount;
            }
        }
        
        return 0;
    };
    
    return (
        <AdminContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            submittedQuotes, 
            subscriptions, 
            emailCampaigns, 
            fetchAdminData,
            updateQuoteStatus,
            sendEmailCampaign,
            updateCredentials
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = (): AdminContextType => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
