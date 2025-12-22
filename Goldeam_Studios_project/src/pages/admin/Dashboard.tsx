import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Calendar, FileText, Search, Loader2 } from 'lucide-react';

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
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
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
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        setDeleteLoading(id);
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                        {isPostsPage ? 'All Posts' : 'Dashboard'}
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {isPostsPage ? 'Manage all your blog content' : 'Overview of your blog statistics'}
                    </p>
                </div>
                <Link
                    to="/admin/editor"
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25"
                >
                    <Plus size={20} />
                    Create New Post
                </Link>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {searchQuery ? (
                            <>
                                <Search size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No posts found matching "{searchQuery}"</p>
                            </>
                        ) : (
                            <>
                                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No blog posts yet. Create your first one!</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-950/50 border-b border-gray-800">
                                    <th className="p-4 font-medium text-gray-400">Title</th>
                                    <th className="p-4 font-medium text-gray-400">Slug</th>
                                    <th className="p-4 font-medium text-gray-400">Date</th>
                                    <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-200">{post.title}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt || "No excerpt"}</div>
                                        </td>
                                        <td className="p-4 text-gray-500 font-mono text-sm">{post.slug}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/admin/editor?id=${post.id}`}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    disabled={deleteLoading === post.id}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleteLoading === post.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
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
