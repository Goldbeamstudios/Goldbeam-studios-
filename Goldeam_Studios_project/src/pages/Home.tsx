import { ArrowRight, Play, Mic2, Video, Cast, Sliders, Coffee, Wifi, Check, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      price: '$170',
      period: '/ hour',
      description: 'Perfect for audio-focused podcasts, interviews, and voiceovers.',
      features: [
        'Dedicated audio-only studio (up to 2 people)',
        'Professional sound engineer',
        'Acoustically treated room',
        'Raw WAV & MP3 files',
        'File delivery within 24 hours',
      ],
      bestFor: 'Audio podcasts, interviews, voice recording',
      popular: false,
    },
    {
      name: 'Audio + Video',
      price: '$300',
      period: '/ hour',
      description: 'A cinematic podcast experience designed for creators who want a professional visual presence.',
      features: [
        'Multi-camera 4K video setup',
        'Live multi-angle switching',
        'Professional studio lighting',
        'On-site camera operator / technician',
        'Custom set and color configuration',
        'Live-cut program video + program audio',
        'File delivery within 24 hours',
      ],
      bestFor: 'Video podcasts, YouTube shows, branded content',
      popular: true,
    },
    {
      name: 'General Content',
      price: '$250',
      period: '/ hour',
      description: 'Designed for content beyond podcasts, including educational videos, interviews, product demos, and brand content.',
      features: [
        'Full studio access',
        'Professional camera operator / studio technician',
        'Studio lighting and camera setup',
        'Live-cut program video + program audio',
        'File delivery within 24 hours',
      ],
      bestFor: 'Creators, educators, businesses, agencies, and brands',
      popular: false,
    },
  ];

  return (
    <div className="bg-black text-white transition-colors duration-300">
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

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>

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
              <button
                onClick={() => navigate('/book-wizard')}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 rounded-lg"
              >
                Book A Session
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

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
                style={{ animationDelay: `${index * 100} ms` }}
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
              style={{ animationDelay: `${index * 150} ms` }}
            >
              <img
                src={src}
                alt={`Studio Shot ${index + 1} `}
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
                className={`relative p-8 flex flex-col h-full rounded-2xl transition-all duration-500 hover:transform hover:-translate-y-3 group ${plan.popular
                  ? 'border-2 border-amber-500 bg-zinc-900/80 backdrop-blur-md shadow-[0_20px_50px_rgba(245,158,11,0.2)] scale-105 z-10'
                  : 'border border-amber-500/10 bg-zinc-900/30 backdrop-blur-sm hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10'
                  } `}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold px-6 py-1.5 uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/50 z-20">
                    Most Popular
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-sm font-bold text-amber-500/80 uppercase tracking-[0.2em] mb-4 group-hover:text-amber-500 transition-colors">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-black text-white group-hover:scale-110 transition-transform origin-left">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-2 font-medium">{plan.period}</span>
                  </div>

                  {plan.description && (
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed italic">{plan.description}</p>
                  )}

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-gray-300 group-hover:text-white transition-colors">
                        <div className="p-1 bg-amber-500/10 rounded-full mr-3 mt-0.5 group-hover:bg-amber-500/20 transition-colors">
                          <Check className="h-3 w-3 text-amber-500" />
                        </div>
                        <span className="text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.bestFor && (
                    <div className="mb-8 p-4 bg-black/50 rounded-xl border border-amber-500/5">
                      <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-black mb-2">Perfect For</p>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">{plan.bestFor}</p>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/book-wizard', { state: { plan: plan.name === 'Audio Only' ? 'audio' : plan.name === 'Audio + Video' ? 'audio_video' : 'general' } })}
                    className={`relative overflow-hidden w-full py-4 text-center text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl group/btn block ${plan.popular
                      ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-white text-black hover:bg-amber-500 hover:text-black border border-amber-500/10'
                      } `}
                  >
                    <span className="relative z-10">Secure Your Slot</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 border-y border-amber-500/20 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-shimmer"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <p className="text-gray-500 uppercase tracking-widest mb-8 animate-fade-in">
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

      {/* Location Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.05),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-on-scroll opacity-0">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5">
              <MapPin className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Find Your Way</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-white uppercase mb-8 leading-[0.9] tracking-tighter">
              Located steps from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                Woodbine Station
              </span>
            </h3>
            <p className="text-xl text-gray-500 font-medium uppercase tracking-[0.2em]">
              Danforth Ave, Toronto, ON
            </p>
          </div>

          <div className="animate-on-scroll opacity-0 delay-200 w-full max-w-6xl mx-auto group">
            <div className="relative p-2 bg-zinc-900 border border-amber-500/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.667503461284!2d-79.3090!3d43.6860!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cc7766099dc3%3A0x63806a644171221b!2sWoodbine!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: 'contrast(1.2)'
                  }}
                  className="relative z-0 transition-transform duration-1000 group-hover:scale-105 grayscale-[1] invert-[0.9]"
                ></iframe>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-10 left-10 p-5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl z-20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Visit Our Studio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
