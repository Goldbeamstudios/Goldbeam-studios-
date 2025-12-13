import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Your First Podcast Recording',
      excerpt:
        'Essential advice for first-time podcasters to make the most of their studio session.',
      category: 'Getting Started',
      date: 'March 15, 2024',
      readTime: '5 min read',
      image:
        'https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1470&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Microphone Techniques for Better Sound Quality',
      excerpt:
        'Learn proper microphone techniques to capture professional-quality audio every time.',
      category: 'Technical',
      date: 'March 10, 2024',
      readTime: '8 min read',
      image:
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1470&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'How to Prepare for a Video Podcast',
      excerpt:
        'Everything you need to know about lighting, framing, and presentation for video content.',
      category: 'Video Production',
      date: 'March 5, 2024',
      readTime: '6 min read',
      image:
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'The Ultimate Podcast Equipment Guide',
      excerpt:
        'A comprehensive breakdown of the gear we use and recommend for professional podcasting.',
      category: 'Equipment',
      date: 'February 28, 2024',
      readTime: '10 min read',
      image:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1469&auto=format&fit=crop',
    },
    {
      id: 5,
      title: 'Live Streaming Best Practices',
      excerpt:
        'Master the art of live streaming with these proven tips and technical considerations.',
      category: 'Streaming',
      date: 'February 20, 2024',
      readTime: '7 min read',
      image:
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1374&auto=format&fit=crop',
    },
    {
      id: 6,
      title: 'Post-Production Workflow for Podcasters',
      excerpt:
        'Streamline your editing process with our professional post-production workflow.',
      category: 'Editing',
      date: 'February 15, 2024',
      readTime: '9 min read',
      image:
        'https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=1470&auto=format&fit=crop',
    },
  ];

  const categories = ['All', 'Getting Started', 'Technical', 'Video Production', 'Equipment', 'Streaming', 'Editing'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-black text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              Resources &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Expert tips, guides, and industry insights to help you create better content.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-zinc-900 border border-amber-500/20 text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-bold uppercase text-sm tracking-wider transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black'
                    : 'bg-zinc-900 text-gray-400 hover:text-white border border-amber-500/20 hover:border-amber-500/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-zinc-900 border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <button className="flex items-center gap-2 text-amber-500 font-bold uppercase text-sm group-hover:gap-4 transition-all">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest tips, guides, and studio updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-zinc-900 border border-amber-500/20 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
