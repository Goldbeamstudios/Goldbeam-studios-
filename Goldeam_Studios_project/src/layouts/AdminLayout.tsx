
import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PenTool, FileText, LogOut, Menu, X, Globe, Calendar, ShoppingBag, Zap } from 'lucide-react';
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

    const navSections = [
        {
            group: 'Core',
            items: [
                { label: 'Overview', path: '/admin', icon: LayoutDashboard },
                { label: 'Live Site', path: '/', icon: Globe, external: true },
            ]
        },
        {
            group: 'Management',
            items: [
                { label: 'Bookings', path: '/admin/bookings', icon: ShoppingBag },
                { label: 'Schedule', path: '/admin/schedule', icon: Calendar },
            ]
        },
        {
            group: 'Content',
            items: [
                { label: 'All Posts', path: '/admin/posts', icon: FileText },
                { label: 'New Post', path: '/admin/editor', icon: PenTool },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-zinc-100 flex font-inter">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-72 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-3xl sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Zap size={20} className="text-black fill-current" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none">Goldbeam</h1>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter mt-1">Admin Console</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pb-8">
                    {navSections.map((section, idx) => (
                        <div key={section.group} className={cn("mb-8", idx === 0 ? "" : "pt-2")}>
                            <h3 className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">
                                {section.group}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={cn(
                                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                                                isActive
                                                    ? "bg-zinc-900 text-white shadow-xl shadow-black/50 border border-zinc-800"
                                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                                            )}
                                            <Icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-amber-500" : "text-zinc-600 group-hover:text-zinc-400")} />
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                            {item.external && <Globe size={12} className="ml-auto opacity-30" />}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-zinc-900/50">
                    <button
                        onClick={handleSignOut}
                        className="group flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
                    >
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                            <LogOut size={16} />
                        </div>
                        <span className="text-sm font-bold">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative">
                {/* Mobile Header */}
                <div className="md:hidden p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <Zap size={16} className="text-black fill-current" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">Admin</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobileOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl p-6 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-end mb-8">
                            <button onClick={() => setIsMobileOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="space-y-6">
                            {navSections.map((section) => (
                                <div key={section.group}>
                                    <h3 className="px-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-4">{section.group}</h3>
                                    <div className="space-y-2">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsMobileOpen(false)}
                                                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 active:scale-[0.98] transition-all"
                                            >
                                                <item.icon size={20} className="text-amber-500" />
                                                <span className="text-lg font-bold">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-4 px-4 py-5 w-full rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold mt-12"
                            >
                                <LogOut size={20} />
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
