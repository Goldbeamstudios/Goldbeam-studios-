
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    content: string;
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
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-20">
                <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                <Link to="/blog" className="text-amber-500 hover:text-amber-400 font-bold uppercase flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero Image */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src={post.image_url || 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1000'}
                    className="w-full h-full object-cover"
                    alt={post.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 uppercase tracking-wider text-sm font-bold bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 uppercase tracking-tight leading-tight">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-300">
                        <span className="flex items-center gap-2">
                            <Calendar size={18} className="text-amber-500" />
                            {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
                <div className="prose-premium max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
