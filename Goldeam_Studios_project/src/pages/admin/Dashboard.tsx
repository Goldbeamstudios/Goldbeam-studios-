import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Calendar, Search, Loader2, Music, Video, Zap, Clock, User } from 'lucide-react';
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
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
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

        setDeleteLoading(id);
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setDeleteLoading(null);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 uppercase tracking-tight">
                        {activeTab === 'posts' ? 'Blog Management' : 'Studio Bookings'}
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {activeTab === 'posts' ? 'Edit and publish your blog content' : 'Manage upcoming sessions and availability'}
                    </p>
                </div>
                {activeTab === 'posts' ? (
                    <Link
                        to="/admin/editor"
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all"
                    >
                        <Plus size={20} />
                        Create New Post
                    </Link>
                ) : (
                    <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
                        >
                            Blog
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder={activeTab === 'posts' ? "Search posts..." : "Search customers..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-gray-200 focus:ring-2 focus:ring-amber-500/50 outline-none"
                        />
                    </div>
                </div>

                {activeTab === 'posts' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-950/50 border-b border-gray-800">
                                    <th className="p-4 font-medium text-gray-400 uppercase text-xs tracking-widest">Title</th>
                                    <th className="p-4 font-medium text-gray-400 uppercase text-xs tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-800/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-200">{post.title}</div>
                                            <div className="text-xs text-zinc-500 font-mono">{post.slug}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/editor?id=${post.id}`} className="p-2 text-zinc-400 hover:text-white"><Pencil size={18} /></Link>
                                                <button onClick={() => handleDeletePost(post.id, post.title)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-950/50 border-b border-gray-800">
                                    <th className="p-4 font-medium text-gray-400 uppercase text-xs tracking-widest">Customer</th>
                                    <th className="p-4 font-medium text-gray-400 uppercase text-xs tracking-widest">Plan & Studio</th>
                                    <th className="p-4 font-medium text-gray-400 uppercase text-xs tracking-widest">Date & Time</th>
                                    <th className="p-4 font-medium text-gray-400 uppercase text-xs tracking-widest text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredAppts.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-gray-800/20 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-zinc-800 p-2 rounded-full"><User size={16} className="text-amber-500" /></div>
                                                <div>
                                                    <div className="font-bold text-gray-200">{appt.customer_name}</div>
                                                    <div className="text-xs text-zinc-500">{appt.customer_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {appt.plan_type === 'audio' ? <Music size={14} className="text-blue-500" /> : appt.plan_type === 'audio_video' ? <Video size={14} className="text-amber-500" /> : <Zap size={14} className="text-purple-500" />}
                                                <span className="text-sm font-medium capitalize">{appt.plan_type.replace('_', ' + ')}</span>
                                            </div>
                                            <div className="text-xs text-zinc-500">Studio {appt.studio} {appt.theme ? `(${appt.theme})` : ''}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Calendar size={14} /> {appt.booking_date}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Clock size={12} /> {appt.start_time} ({appt.duration_hours}h)
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="font-black text-amber-500">${appt.total_price}</div>
                                            <div className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">{appt.status}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
