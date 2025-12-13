
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Phone, HelpCircle, Building2, Wrench, DollarSign } from 'lucide-react';

export default function More() {
  const quickLinks = [
    {
      icon: Book,
      title: 'Resources & Blog',
      description: 'Expert tips, guides, and podcasting insights',
      link: '/resources',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'Contact Us',
      description: 'Get in touch with our team',
      link: '/contact',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: HelpCircle,
      title: 'FAQs',
      description: 'Find answers to common questions',
      link: '/faqs',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Building2,
      title: 'Studios',
      description: 'Explore our recording spaces',
      link: '/studios',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: DollarSign,
      title: 'Pricing',
      description: 'View our transparent pricing plans',
      link: '/pricing',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Wrench,
      title: 'How It Works',
      description: 'Learn about our process',
      link: '/how-it-works',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const services = [
    {
      title: 'Audio Recording',
      description: 'Professional podcast audio recording with broadcast-quality equipment',
      features: ['Shure SM7B Microphones', 'Acoustically Treated Room', 'Professional Mixing'],
    },
    {
      title: 'Video Production',
      description: '4K multi-camera setup with professional lighting and live switching',
      features: ['3-Camera Setup', 'Professional Lighting', 'Live Video Switching'],
    },
    {
      title: 'Live Streaming',
      description: 'Stream directly to YouTube, Twitch, Facebook Live, and more',
      features: ['Multi-Platform Streaming', '1Gbps Fiber Internet', 'Professional Quality'],
    },
    {
      title: 'Post Production',
      description: 'Full editing services including audio mixing and video editing',
      features: ['Audio Mixing', 'Video Editing', 'Social Media Clips'],
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                More
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Everything you need to know about Goldbeam Studios - all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
              Quick Links
            </h2>
            <p className="text-gray-400">Navigate to the information you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group bg-zinc-900 border border-amber-500/20 p-8 rounded-2xl hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${item.color} p-4 rounded-xl w-fit mb-6`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-amber-500 font-bold uppercase text-sm group-hover:gap-4 transition-all">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
              Our Services
            </h2>
            <p className="text-gray-400">Comprehensive podcast production solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-black border border-amber-500/20 p-8 rounded-2xl hover:border-amber-500/50 transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-zinc-900 border border-amber-500/20 p-12 rounded-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6 text-center">
              About Goldbeam Studios
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Goldbeam Studios is a premier podcast production facility offering professional
                audio engineering, 4K video recording, and live streaming services. We provide
                creators with state-of-the-art equipment and experienced technical support to
                produce broadcast-quality content.
              </p>
              <p>
                Our mission is to empower content creators by removing technical barriers and
                providing an inspiring environment to create exceptional podcasts. Whether you're
                a solo podcaster or hosting panel discussions, we have the perfect space for your
                needs.
              </p>
              <p>
                With multiple studio options, flexible booking, and comprehensive post-production
                services, Goldbeam Studios is your partner in podcast excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6">
            Ready to Create?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book your first session and experience professional podcast production.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 rounded-lg"
          >
            Book Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
