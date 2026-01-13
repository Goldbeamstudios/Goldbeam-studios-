import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Calendar, Search, Zap, User, Check, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Appointment } from '../../types/supabase';

interface Post {
    id: string;
    title: string;
    slug: string;
    created_at: string;
    published: boolean;
    excerpt: string;
}

export default function Dashboard() {
    const location = useLocation();
    const isPostsPage = location.pathname === '/admin/posts';
    const [posts, setPosts] = useState<Post[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'posts' | 'appointments'>(
        (isPostsPage ? 'posts' : 'appointments') as 'posts' | 'appointments'
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [postsRes, apptsRes] = await Promise.all([
                supabase.from('posts').select('*').order('created_at', { ascending: false }),
                supabase.from('appointments').select('*').order('booking_date', { ascending: false })
            ]);

            if (postsRes.error) throw postsRes.error;
            if (apptsRes.error) throw apptsRes.error;

            setPosts(postsRes.data || []);
            setAppointments(apptsRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        try {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAppts = appointments.filter(appt =>
        appt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = appointments.reduce((sum, appt) => sum + Number(appt.total_price), 0);
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const publishedPosts = posts.filter(p => p.published).length;

    const stats = [
        { label: 'Gross Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active Bookings', value: confirmedCount, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Editorial Reach', value: publishedPosts, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Client Satisfaction', value: '98%', icon: Check, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Hydrating Dashboard Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-[1px] w-8 bg-amber-500/50"></span>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Admin Control Center</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Studio <span className="text-zinc-500 italic">Pulse</span>
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">Real-time operational overview for Goldbeam Studios</p>
                </div>

                <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 shadow-2xl">
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                            activeTab === 'appointments' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                            activeTab === 'posts' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        Journal
                    </button>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="group bg-zinc-950 border border-zinc-900 rounded-3xl p-6 transition-all hover:border-zinc-800 hover:shadow-2xl hover:shadow-black/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <div className="h-1 w-8 bg-zinc-900 rounded-full mt-2"></div>
                        </div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Action Showcase */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">{activeTab === 'posts' ? 'Editorial Content' : 'Upcoming Sessions'}</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                            <input
                                type="text"
                                placeholder="Search records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-b border-zinc-900 py-1.5 pl-10 pr-4 text-xs text-white outline-none focus:border-amber-500/50 transition-all font-bold uppercase tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="bg-zinc-950 rounded-3xl border border-zinc-900 overflow-hidden shadow-inner">
                        {activeTab === 'posts' ? (
                            <div className="divide-y divide-zinc-900/50">
                                {filteredPosts.length > 0 ? filteredPosts.slice(0, 5).map((post) => (
                                    <div key={post.id} className="group p-5 flex items-center justify-between hover:bg-zinc-900/30 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all border border-zinc-800">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{post.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[9px] font-mono text-zinc-600 tracking-tighter">/{post.slug}</span>
                                                    <span className={cn("text-[8px] font-black uppercase px-1.5 py-0.5 rounded", post.published ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                                                        {post.published ? 'Live' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Link to={`/admin/editor?id=${post.id}`} className="p-2 text-zinc-500 hover:text-white transition-colors"><Pencil size={16} /></Link>
                                            <button onClick={() => handleDeletePost(post.id, post.title)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-20 text-center">
                                        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">No matching posts found</p>
                                    </div>
                                )}
                                {posts.length > 5 && (
                                    <Link to="/admin/posts" className="block text-center p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors border-t border-zinc-900/50">
                                        View All Content Inventory
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-900/50">
                                {filteredAppts.length > 0 ? filteredAppts.slice(0, 5).map((appt) => (
                                    <div key={appt.id} className="group p-5 flex items-center justify-between hover:bg-zinc-900/30 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-all border border-zinc-800 shadow-lg">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{appt.customer_name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-zinc-500">{appt.booking_date}</span>
                                                    <span className="h-[2px] w-[2px] rounded-full bg-zinc-800"></span>
                                                    <span className="text-[10px] font-bold text-amber-500/80 uppercase">Studio {appt.studio}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-white tracking-tighter">${appt.total_price}</div>
                                            <div className="text-[8px] font-black text-emerald-500 uppercase tracking-tight">{appt.status}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-20 text-center">
                                        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">No matching bookings found</p>
                                    </div>
                                )}
                                <Link to="/admin/bookings" className="block text-center p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors border-t border-zinc-900/50">
                                    Open Booking Management Hub
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Creative Sidebar Showcase */}
                <div className="space-y-6">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest px-2">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link to="/admin/editor" className="group bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl border border-amber-400/20 shadow-xl shadow-amber-500/10 transition-all hover:-translate-y-1 active:scale-95">
                            <Plus className="text-black mb-4 h-6 w-6" />
                            <h3 className="text-base font-black text-black uppercase tracking-tight">Draft New Story</h3>
                            <p className="text-black/60 text-[10px] font-bold uppercase tracking-wide mt-1">Expand your editorial reach</p>
                        </Link>

                        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                <Zap size={80} className="text-white fill-current" />
                            </div>
                            <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">Live Status</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-black text-zinc-600 uppercase tracking-widest">API Latency</span>
                                    <span className="font-mono text-emerald-500 font-bold">12ms - Optimal</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-black text-zinc-600 uppercase tracking-widest">Studio Load</span>
                                    <span className="font-mono text-zinc-400 font-bold">85% Utilization</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-zinc-800 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stripe Engine</span>
                            </div>
                            <span className="text-[10px] font-black text-white uppercase bg-zinc-900 px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
