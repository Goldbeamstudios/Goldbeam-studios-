
import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
    Plus,
    Search,
    FileText,
    Pencil,
    Trash2,
    ExternalLink,
    Clock,
    Eye,
    EyeOff,
    MoreVertical,
    Zap,
    BookOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Post {
    id: string;
    title: string;
    slug: string;
    created_at: string;
    published: boolean;
    excerpt: string;
    image_url: string | null;
    content: string;
}

const AdminPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        setIsDeleting(id);
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const togglePublished = async (post: Post) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({ published: !post.published })
                .eq('id', post.id);

            if (error) throw error;
            setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'published' && post.published) ||
            (filter === 'draft' && !post.published);
        return matchesSearch && matchesFilter;
    });

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="relative h-12 w-12 text-amber-500">
                    <Zap size={48} className="animate-pulse-slow fill-current opacity-20 absolute inset-0" />
                    <div className="absolute inset-0 border-b-2 border-amber-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Indexing Content Repository...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-inter">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-[1px] w-8 bg-amber-500/50"></span>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Editorial Management</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Journal <span className="text-zinc-500 italic">Vault</span>
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">Manage your stories and editorial pipeline</p>
                </div>

                <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 shadow-2xl">
                    {(['all', 'published', 'draft'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                                filter === f ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {f === 'all' ? 'All Stories' : f === 'published' ? 'Live' : 'Drafts'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-amber-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search by title or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-amber-500/50 transition-all font-bold uppercase tracking-tight"
                    />
                </div>

                <Link
                    to="/admin/editor"
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                    <Plus size={16} /> Draft New Story
                </Link>
            </div>

            {/* Content Inventory */}
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="group bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden transition-all hover:border-zinc-800 hover:shadow-2xl hover:shadow-black/50"
                        >
                            {/* Card Image */}
                            <div className="relative h-48 bg-zinc-900 overflow-hidden">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                        <BookOpen size={64} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => togglePublished(post)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md transition-all border",
                                            post.published
                                                ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20"
                                                : "bg-amber-500/20 text-amber-500 border-amber-500/20"
                                        )}
                                    >
                                        {post.published ? 'Live' : 'Draft'}
                                    </button>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-mono text-zinc-600 tracking-tighter">/{post.slug}</span>
                                        <span className="h-1 w-1 rounded-full bg-zinc-800"></span>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                            <Clock size={10} /> {calculateReadTime(post.content)}m read
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight line-clamp-2 leading-[1.1]">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed italic">
                                        "{post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 100)}..."
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-zinc-900 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/admin/editor?id=${post.id}`}
                                            className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800 shadow-lg"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id, post.title)}
                                            disabled={isDeleting === post.id}
                                            className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-zinc-800 shadow-lg disabled:opacity-50"
                                        >
                                            {isDeleting === post.id ? <div className="h-4 w-4 border-2 border-zinc-700 border-t-red-500 animate-spin rounded-full"></div> : <Trash2 size={16} />}
                                        </button>
                                    </div>

                                    <a
                                        href={`/blog/${post.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                                    >
                                        View Live <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 bg-zinc-950/30 rounded-[40px] border border-dashed border-zinc-900 text-center space-y-4">
                    <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 shadow-inner">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Repository Empty</h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight mt-1">No stories match your current registry filters</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(AdminPosts);
