
import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PenTool, FileText, LogOut, Menu, X, Globe } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming clsx/tailwind-merge utils exist, otherwise I'll use inline or create it.

export default function AdminLayout() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'All Posts', path: '/admin/posts', icon: FileText },
        { label: 'New Post', path: '/admin/editor', icon: PenTool },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl">
                <div className="p-6 border-b border-gray-800 flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">A</div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Admin
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                    <div className="my-4 border-t border-gray-800"></div>
                    <Link
                        to="/blog"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                    >
                        <Globe size={20} />
                        <span className="font-medium">View Live Site</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
                    <span className="font-bold text-lg">Admin Panel</span>
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-400">
                        {isMobileOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobileOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-gray-950/95 backdrop-blur-sm p-4 animate-in fade-in slide-in-from-top-10">
                        <nav className="space-y-2 mt-12">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-4 rounded-lg text-lg font-medium text-gray-300 hover:bg-gray-800"
                                >
                                    <item.icon size={24} />
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 px-4 py-4 w-full rounded-lg text-lg font-medium text-red-400 hover:bg-red-500/10 mt-8"
                            >
                                <LogOut size={24} />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
