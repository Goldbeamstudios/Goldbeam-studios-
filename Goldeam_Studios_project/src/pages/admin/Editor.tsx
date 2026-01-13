
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../../lib/supabase';
import { enhanceContent } from '../../lib/gemini';
import { Save, ArrowLeft, Loader2, Link as LinkIcon, Upload, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming cn utility is here

export default function Editor() {
    const [searchParams] = useSearchParams();
    const postId = searchParams.get('id');
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [apiKeySaved, setApiKeySaved] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
    const [uploading, setUploading] = useState(false);

    // Fetch logic if editing
    useEffect(() => {
        if (postId) {
            loadPost(postId);
        }
        const storedKey = localStorage.getItem('openrouter_api_key');
        if (storedKey) setApiKey(storedKey);
    }, [postId]);

    const handleSaveApiKey = () => {
        if (!apiKey) return;
        localStorage.setItem('openrouter_api_key', apiKey);
        setApiKeySaved(true);
        setTimeout(() => setApiKeySaved(false), 2000);
    };

    const loadPost = async (id: string) => {
        setLoading(true);
        const { data } = await supabase.from('posts').select('*').eq('id', id).single();
        if (data) {
            setTitle(data.title);
            setSlug(data.slug);
            setContent(data.content);
            setImage(data.image_url || '');
        }
        setLoading(false);
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/https?:\/\/[^\s]+|www\.[^\s]+/g, '') // Remove URLs
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (!postId) { // Only auto-generate slug on create
            setSlug(generateSlug(e.target.value));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        try {
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            setImage(publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        // Validate slug
        if (slug.includes('http://') || slug.includes('https://') || slug.includes('.com')) {
            alert('Invalid Slug: It looks like a URL. Slugs should be short text like "my-post-title".');
            return;
        }

        setLoading(true);
        const postData = {
            title,
            slug,
            content,
            image_url: image,
            excerpt: content.substring(0, 150) + '...',
            updated_at: new Date().toISOString()
        };

        try {
            if (postId) {
                const { error } = await supabase.from('posts').update(postData).eq('id', postId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('posts').insert([postData]);
                if (error) throw error;
            }
            navigate('/admin/posts');
        } catch (error) {
            console.error("Error saving post:", error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    const handleAIAction = async (action: 'fix_grammar' | 'improve_clarity' | 'rewrite') => {
        if (!apiKey) {
            alert('Please enter your OpenRouter API Key in the settings panel first.');
            return;
        }
        if (!content) return;

        setAiLoading(true);
        try {
            const enhanced = await enhanceContent(apiKey.trim(), content, action);
            setContent(enhanced);
        } catch (error: any) {
            console.error("AI Action Error:", error);
            alert('AI Enhancement failed. Check your OpenRouter API key and internet connection.');
        } finally {
            setAiLoading(false);
        }
    };

    if (loading && postId) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col gap-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/posts')} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Post Title"
                        className="bg-transparent text-xl md:text-2xl font-display font-extrabold placeholder-gray-600 focus:outline-none focus:ring-0 w-full md:w-96 text-white tracking-tight"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-0">
                {/* Left Column: Configs */}
                <div className="space-y-4 overflow-y-auto lg:h-full hide-scrollbar">
                    {/* Image Section */}
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Cover Image</label>

                        <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800">
                            <button
                                onClick={() => setImageMode('upload')}
                                className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", imageMode === 'upload' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300')}
                            >
                                Upload
                            </button>
                            <button
                                onClick={() => setImageMode('url')}
                                className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", imageMode === 'url' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300')}
                            >
                                URL
                            </button>
                        </div>

                        {imageMode === 'upload' ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800/30 transition-all group relative overflow-hidden"
                            >
                                {image ? (
                                    <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                                ) : null}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {uploading ? (
                                    <Loader2 className="animate-spin text-indigo-400" size={32} />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 relative z-10">
                                        <Upload className={cn("text-gray-400 group-hover:text-indigo-400 transition-colors", image ? "text-white drop-shadow-md" : "")} size={32} />
                                        <span className={cn("text-xs font-medium text-gray-400 group-hover:text-gray-300", image ? "text-white drop-shadow-md" : "")}>
                                            {image ? 'Click to replace' : 'Click to upload image'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-gray-950 p-2 rounded-lg border border-gray-800">
                                <LinkIcon size={14} className="text-gray-600" />
                                <input
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://..."
                                    className="bg-transparent w-full text-sm text-gray-300 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Slug */}
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Slug</label>
                        <div className="flex items-center gap-2 bg-gray-950 p-2 rounded-lg border border-gray-800">
                            <LinkIcon size={14} className="text-gray-600" />
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="bg-transparent w-full text-sm text-gray-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* OpenRouter Config */}
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                            <span>OpenRouter API Key</span>
                            {!apiKey && <AlertCircle size={14} className="text-yellow-500" />}
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type={showApiKey ? "text" : "password"}
                                    value={apiKey}
                                    onChange={(e) => {
                                        setApiKey(e.target.value);
                                        setApiKeySaved(false);
                                    }}
                                    placeholder="Enter API Key"
                                    className="w-full bg-gray-950 p-2 pr-10 rounded-lg border border-gray-800 text-sm focus:border-indigo-500/50 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button
                                onClick={handleSaveApiKey}
                                className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-colors border", apiKeySaved ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700")}
                            >
                                {apiKeySaved ? "Saved" : "Save"}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500">Required for Grammar & Clarity features (using Gemma 3).</p>
                    </div>
                </div>

                {/* Right Column: Editor & Preview */}
                <div className="lg:col-span-2 flex flex-col h-full min-h-0 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                    {/* Mobile Tabs */}
                    <div className="flex border-b border-gray-800 lg:hidden">
                        <button
                            onClick={() => setActiveTab('write')}
                            className={cn("flex-1 py-3 text-sm font-bold uppercase tracking-wide", activeTab === 'write' ? "bg-gray-800 text-white border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-300")}
                        >
                            Write
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={cn("flex-1 py-3 text-sm font-bold uppercase tracking-wide", activeTab === 'preview' ? "bg-gray-800 text-white border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-300")}
                        >
                            Preview
                        </button>
                    </div>

                    {/* Desktop Split Header (Hidden on Mobile) */}
                    <div className="hidden lg:flex border-b border-gray-800 bg-gray-950/50 px-4 py-2 items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">MARKDOWN EDITOR</span>
                        <span className="text-xs font-medium text-gray-500">LIVE PREVIEW</span>
                    </div>

                    <div className="flex-1 flex min-h-0 relative">
                        {/* Editor Pane */}
                        <div className={cn(
                            "flex-1 flex-col min-h-0 bg-gray-900/30",
                            activeTab === 'write' ? 'flex' : 'hidden lg:flex'
                        )}>
                            {/* AI Toolbar */}
                            <div className="flex items-center gap-2 p-2 border-b border-gray-800 bg-gray-950/30 overflow-x-auto">
                                <Sparkles size={14} className="text-indigo-400 shrink-0" />
                                <button onClick={() => handleAIAction('fix_grammar')} disabled={aiLoading} className="px-3 py-1.5 rounded-md bg-gray-800/50 hover:bg-indigo-500/20 text-xs text-gray-300 hover:text-indigo-300 whitespace-nowrap transition-colors border border-transparent hover:border-indigo-500/30">
                                    Fix Grammar
                                </button>
                                <button onClick={() => handleAIAction('improve_clarity')} disabled={aiLoading} className="px-3 py-1.5 rounded-md bg-gray-800/50 hover:bg-indigo-500/20 text-xs text-gray-300 hover:text-indigo-300 whitespace-nowrap transition-colors border border-transparent hover:border-indigo-500/30">
                                    Improve Clarity
                                </button>
                                <button onClick={() => handleAIAction('rewrite')} disabled={aiLoading} className="px-3 py-1.5 rounded-md bg-gray-800/50 hover:bg-indigo-500/20 text-xs text-gray-300 hover:text-indigo-300 whitespace-nowrap transition-colors border border-transparent hover:border-indigo-500/30">
                                    Rewrite
                                </button>
                                {aiLoading && <Loader2 className="animate-spin text-indigo-400 ml-auto" size={14} />}
                            </div>

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="flex-1 w-full bg-transparent p-6 resize-none focus:outline-none font-medium text-base leading-relaxed text-gray-300 placeholder:text-gray-700 font-sans"
                                placeholder="# Start writing your story..."
                            />
                        </div>

                        {/* Divider (Desktop Only) */}
                        <div className="hidden lg:block w-px bg-gray-800" />

                        {/* Preview Pane */}
                        <div className={cn(
                            "flex-1 overflow-y-auto min-h-0 p-10 prose-premium max-w-none bg-black/40",
                            activeTab === 'preview' ? 'block bg-gray-950 lg:bg-black/40' : 'hidden lg:block'
                        )}>
                            {image && <img src={image} alt="Cover" className="w-full h-56 lg:h-80 object-cover rounded-2xl mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10" />}
                            <h1 className="mb-6 text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">{title || 'Untitled Post'}</h1>
                            <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-10 shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                            {content ? (
                                <ReactMarkdown>{content}</ReactMarkdown>
                            ) : (
                                <p className="text-gray-700 italic text-lg">Nothing to preview yet...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
