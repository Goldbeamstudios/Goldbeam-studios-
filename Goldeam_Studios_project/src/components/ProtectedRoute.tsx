
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { user, loading, configError } = useAuth();
    const location = useLocation();

    if (configError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
                <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Configuration Error</h2>
                    <p className="text-gray-400 mb-4">{configError}</p>
                    <div className="bg-gray-950 p-4 rounded-lg text-left text-xs font-mono text-gray-400 overflow-x-auto">
                        Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
