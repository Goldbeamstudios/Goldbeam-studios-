
import { Calendar, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    created_at: string;
    // category: string; // Schema doesn't have category yet, I'll omit or add as "General"
}

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

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

    const filteredPosts = posts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen pt-24 text-left transition-colors duration-300">
            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-zinc-900 dark:text-white uppercase mb-6 tracking-tight">
                            Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                                Blog
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-gray-300 leading-relaxed mb-8">
                            Expert tips, guides, and industry insights.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-amber-500/20 text-zinc-900 dark:text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-amber-500" size={48} />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="group bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 flex flex-col shadow-lg shadow-zinc-200/50 dark:shadow-none"
                                    >
                                        <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
                                            <img
                                                src={post.image_url || 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1000'} // Fallback image
                                                alt={post.title}
                                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-display font-extrabold text-zinc-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors line-clamp-2 tracking-tight">
                                                {post.title}
                                            </h3>
                                            <p className="text-zinc-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">{post.excerpt}</p>
                                            <div className="mt-auto pt-4">
                                                <Link
                                                    to={`/blog/${post.slug}`}
                                                    className="inline-flex items-center gap-2 text-amber-500 font-bold uppercase text-sm group-hover:gap-4 transition-all"
                                                >
                                                    Read More
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {filteredPosts.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-zinc-500 dark:text-gray-400 text-xl">No articles found.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
