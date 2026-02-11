
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SparklesIcon, EyeIcon, EyeOffIcon, ClockIcon, TargetIcon } from './icons';

interface AuditEvent {
    id: string;
    timestamp: string;
    event: string;
    user: string;
    severity: 'low' | 'high';
}

interface SystemHealth {
    kv: boolean;
    sheets: boolean;
    region: string;
}

const SecurityManagement: React.FC = () => {
    const { updateCredentials } = useAdmin();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [logs, setLogs] = useState<AuditEvent[]>([]);
    const [health, setHealth] = useState<SystemHealth | null>(null);

    useEffect(() => {
        const mockLogs: AuditEvent[] = [
            { id: '1', timestamp: new Date().toISOString(), event: 'Login Session Started', user: 'SYSTEM', severity: 'low' },
            { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'Admin Access Verified', user: 'ADMIN', severity: 'low' }
        ];
        setLogs(mockLogs);

        const fetchHealth = async () => {
            try {
                const token = sessionStorage.getItem('admin_token');
                const res = await fetch('/api/admin/health', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setHealth(await res.json());
            } catch (e) {
                console.error("Health Check Failure.");
            }
        };
        fetchHealth();
        const interval = setInterval(fetchHealth, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Error: Passwords do not match.' });
            return;
        }

        if (formData.password.length < 8) {
            setMessage({ type: 'error', text: 'Error: Password must be at least 8 characters.' });
            return;
        }

        setIsUpdating(true);
        const success = await updateCredentials(formData.username, formData.password);
        
        if (success) {
            setMessage({ type: 'success', text: 'Success: Admin credentials updated.' });
            setFormData({ username: '', password: '', confirmPassword: '' });
            setLogs(prev => [{
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                event: 'Admin Credential Change',
                user: 'ADMIN',
                severity: 'high'
            }, ...prev]);
        } else {
            setMessage({ type: 'error', text: 'Error: Could not update credentials.' });
        }
        setIsUpdating(false);
    };

    const inputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-gray-100 text-gray-900 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all sm:text-sm placeholder-gray-400";
    const labelClasses = "block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-2 mb-1";

    return (
        <div className="space-y-10">
            {/* System Status Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Database (KV)', status: health?.kv, id: 'kv' },
                    { label: 'Orders Sheet', status: health?.sheets, id: 'sheets' },
                    { label: 'Server Region', value: health?.region || 'Detecting...', id: 'node' }
                ].map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-black transition-colors duration-500">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                        {item.status !== undefined ? (
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.status ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                                <span className="text-[10px] font-bold uppercase">{item.status ? 'Online' : 'Error'}</span>
                            </div>
                        ) : (
                            <span className="text-[10px] font-mono font-black text-indigo-600">{item.value}</span>
                        )}
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden group">
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                                <TargetIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-oswald font-black uppercase tracking-widest text-gray-900">Admin Login</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Change your login details</p>
                            </div>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelClasses}>New Username</label>
                            <input type="text" value={formData.username} onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))} required className={inputClasses} />
                        </div>

                        <div className="relative">
                            <label className={labelClasses}>New Password</label>
                            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} required className={inputClasses} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-3 text-gray-400 hover:text-black">
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>

                        <div>
                            <label className={labelClasses}>Confirm New Password</label>
                            <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))} required className={inputClasses} />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {message.text}
                            </div>
                        )}

                        <button type="submit" disabled={isUpdating} className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50">
                            {isUpdating ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>
                </section>

                <section className="bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-xl font-oswald font-black uppercase tracking-widest">Admin Activity</h2>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Recent system changes</p>
                        </div>
                    </header>

                    <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar">
                        {logs.map(log => (
                            <div key={log.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex gap-5 group hover:bg-white/10 transition-all">
                                <div className={`w-1 h-10 rounded-full shrink-0 ${log.severity === 'high' ? 'bg-amber-400' : 'bg-zinc-700'}`}></div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${log.severity === 'high' ? 'text-amber-400' : 'text-zinc-400'}`}>{log.event}</span>
                                        <span className="text-[8px] font-mono text-zinc-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-white truncate">{log.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-3">
                        <ClockIcon className="w-4 h-4 text-zinc-700" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">History is kept for security monitoring.</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SecurityManagement;
