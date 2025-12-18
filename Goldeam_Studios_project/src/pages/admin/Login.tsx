
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-75"></div>
            </div>

            <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">Admin Access</h1>
                    <p className="text-gray-400 mt-2">Sign in to manage your blog content</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
