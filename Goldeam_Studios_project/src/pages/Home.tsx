import { ArrowRight, Play, Mic2, Video, Cast, Sliders, Coffee, Wifi, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import bg from '../assets/banner_three.jpeg';
import gallery1 from '../assets/banner_four.jpeg';
import gallery2 from '../assets/banner_six.jpg';
import gallery3 from '../assets/banner_two.png';
import gallery4 from '../assets/banner.jpeg';
import gallery5 from '../assets/banner_five.jpeg';
import gallery6 from '../assets/banner_three.jpeg';
import gallery7 from '../assets/images/studio/photo_studio.jpg';
import gallery8 from '../assets/images/studio/photo_studio1.jpg';
import gallery9 from '../assets/images/studio/photo_studio2.jpeg';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Mic2,
      title: 'Pro Audio',
      description:
        'Shure SM7B microphones and RØDECaster Pro II interfaces deliver broadcast-quality sound for podcasts, interviews, and voice recording.',
    },
    {
      icon: Video,
      title: '4K Multi-Cam',
      description:
        'Three-angle Sony 4K camera setup with professional lighting and live switching for a cinematic, multi-camera look.',
    },
    {
      icon: Cast,
      title: 'Live Streaming',
      description:
        'Direct integration with YouTube, Twitch, and Facebook Live via high-speed fiber for reliable, real-time broadcasting.',
    },
    {
      icon: Sliders,
      title: 'Post Production',
      description:
        'Full post-production services available including video editing, audio mixing, clip creation, and delivery of final files.',
    },
    {
      icon: Coffee,
      title: 'Comfort',
      description:
        'Comfortable lounge area with cold beverages and complimentary coffee to keep the creative energy flowing.',
    },
    {
      icon: Wifi,
      title: 'Fiber Internet',
      description:
        'Ultra-fast symmetric 3Gbps fiber connection ensures smooth live streams, fast uploads, and lag-free remote guests.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Audio Only',
      price: '$125',
      period: '/ hour',
      description: '',
      features: [
        'Up to 4 professional microphones',
        'Dedicated sound engineer',
        'Acoustically treated studio',
        'Raw WAV & MP3 files',
        'Instant file transfer',
        'High-speed internet for remote guests',
      ],
      bestFor: 'Audio podcasts, interviews, voiceovers',
      popular: false,
    },
    {
      name: 'Audio + Video',
      price: '$300',
      period: '/ hour',
      description: '',
      features: [
        'Includes everything in Audio Only, plus:',
        'Multi-camera 4K video setup',
        'Live multi-angle switching',
        'Professional studio lighting',
        'Custom set & color configuration',
        'Raw video + audio files included',
        'Ideal for YouTube, social clips, and livestreams',
      ],
      bestFor: 'Video podcasts, YouTube shows, branded content',
      popular: true,
    },
    {
      name: 'General Content',
      price: '$200',
      period: '/ hour',
      description: 'Designed for content beyond podcasts.',
      features: [
        'Complete studio access with flexible set configurations',
        'Professional production gear (4K Sony cameras, studio lighting, broadcast-quality audio)',
        'On-site camera operator / studio technician',
        'Custom lighting and camera setup',
        'Delivery of raw video and audio files',
        'High-speed fiber internet',
        'Post-production services available upon request',
      ],
      bestFor: 'Creators, educators, businesses, marketing teams, agencies, and brands producing polished visual content.',
      popular: false,
    },
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={bg}
            alt="Podcast Studio"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/10 animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6 animate-pulse">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full absolute"></div>
              <span className="text-amber-500 font-bold tracking-widest uppercase text-sm ml-4">
                Now Accepting New Creators
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 animate-fade-in">
              ELEVATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 animate-gradient">
                VOICE
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed animate-fade-in-delay">
              Premier podcast production facility. Professional audio engineering, 4K video
              recording, and live streaming services in a state-of-the-art studio.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-delay-2">
              <Link
                to="/book"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 rounded-lg"
              >
                Book A Session
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="flex items-center justify-center gap-3 border-2 border-amber-500/30 hover:border-amber-500 text-white px-8 py-4 text-lg font-bold uppercase tracking-wider transition-all backdrop-blur-sm hover:bg-amber-500/10 rounded-lg">
                <Play className="h-5 w-5 fill-current" />
                Watch Tour
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-br from-amber-500 to-transparent blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-on-scroll opacity-0">
            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-4 animate-slide-down">
              The Studio
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase animate-slide-up">
              Designed for Creators
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 bg-zinc-900/50 backdrop-blur-sm border border-amber-500/10 p-8 hover:border-amber-500/50 transition-all duration-500 group hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-500/20 rounded-lg relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                <div className="relative z-10">
                  <div className="text-gray-400 mb-4 group-hover:text-amber-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 transform">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase group-hover:text-amber-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Gallery with Scroll Reveal */}
      <section className="py-12 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
          {[
            gallery1,
            gallery2,
            gallery3,
            gallery4,
            gallery5,
            gallery6,
            gallery7,
            gallery8,
            gallery9,
          ].map((src, index) => (
            <div
              key={index}
              className="group relative h-64 md:h-80 overflow-hidden animate-on-scroll opacity-0 bg-black"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={src}
                alt={`Studio Shot ${index + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-125 group-hover:rotate-2 brightness-75 group-hover:brightness-100"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-amber-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated border */}
              <div className="absolute inset-0 border-4 border-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100"></div>

              {/* Number badge */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-black/80 backdrop-blur-sm border border-amber-500/50 rounded-full flex items-center justify-center text-amber-500 font-bold text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-360">
                {index + 1}
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 right-1/4 w-full h-full bg-gradient-to-tl from-amber-500 to-transparent blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-on-scroll opacity-0">
            <div className="max-w-2xl">
              <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-4">
                Rates & Packages
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase">
                Simple, Transparent Pricing
              </h3>
            </div>
            <p className="text-gray-400 max-w-sm md:text-right">
              No hidden fees. All sessions include a sound engineer to handle the technical
              side.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 flex flex-col h-full rounded-lg transition-all duration-500 hover:transform hover:-translate-y-3 group ${plan.popular
                  ? 'border-2 border-amber-500 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-amber-500/30 scale-105'
                  : 'border border-amber-500/20 bg-black/50 backdrop-blur-sm hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/20'
                  }`}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold px-4 py-1 uppercase tracking-wider rounded-full animate-pulse-glow shadow-lg shadow-amber-500/50">
                    Most Popular
                  </div>
                )}

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4 group-hover:text-amber-500 transition-colors">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-black text-white group-hover:text-amber-400 transition-colors">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  {plan.description && (
                    <p className="text-gray-400 text-sm mb-6 -mt-4 italic">{plan.description}</p>
                  )}
                  <ul className="space-y-4 mb-4 flex-1">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-gray-300 group-hover:text-white transition-colors">
                        <Check className="h-5 w-5 text-amber-500 mr-3 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.bestFor && (
                    <div className="mb-6 pt-4 border-t border-amber-500/10">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Best for:</p>
                      <p className="text-sm text-gray-300 leading-snug">{plan.bestFor}</p>
                    </div>
                  )}
                  <button
                    className={`relative overflow-hidden w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-lg group/button ${plan.popular
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50'
                      : 'bg-white text-black hover:bg-amber-400'
                      }`}
                  >
                    <span className="relative z-10">Select Plan</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover/button:opacity-100 transition-opacity"></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 border-y border-amber-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-shimmer"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <p className="text-gray-400 uppercase tracking-widest mb-8 animate-fade-in">
            Trusted by Creators From
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            {['SPOTIFY', 'APPLE', 'YOUTUBE', 'AUDIBLE'].map((brand, index) => (
              <span
                key={brand}
                className="text-2xl font-black hover:text-amber-500 hover:scale-110 transition-all duration-300 cursor-default"
                style={{
                  fontFamily: index === 0 ? 'serif' : index === 1 ? 'mono' : index === 2 ? 'sans-serif' : 'inherit',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
