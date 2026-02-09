import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    image_url: string;
    created_at: string;
}

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-500" size={48} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col items-center justify-center pt-20 transition-colors duration-300">
                <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                <Link to="/blog" className="text-amber-500 hover:text-amber-400 font-bold uppercase flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen transition-colors duration-300">
            <Helmet>
                <title>{`${post.title} | Goldbeam Studios Blog`}</title>
                <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
                <meta property="og:title" content={`${post.title} | Goldbeam Studios`} />
                <meta property="og:description" content={post.excerpt || post.content.substring(0, 160)} />
                <meta property="og:image" content={post.image_url} />
            </Helmet>
            {/* Hero Image */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src={post.image_url || 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1000'}
                    className="w-full h-full object-cover"
                    alt={post.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-900 dark:text-gray-300 hover:text-amber-500 dark:hover:text-white mb-6 uppercase tracking-wider text-sm font-bold bg-white/80 dark:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-zinc-900 dark:text-white mb-6 uppercase tracking-tight leading-tight drop-shadow-lg dark:drop-shadow-none">{post.title}</h1>
                    <div className="flex items-center gap-4 text-zinc-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                            <Calendar size={18} className="text-amber-500" />
                            {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
                <div className="prose-premium prose-zinc dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
