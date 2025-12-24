import { useState, useEffect } from 'react';
import { Sparkles, Users, Wifi, Coffee, Mic2, Video, Check, ArrowRight } from 'lucide-react';

// Import images
import studioOne from '../assets/images/studio/studo_one.jpeg';
import studioTwo from '../assets/images/studio/studo_two.jpg';
import studioThree from '../assets/images/studio/stuido-three.jpeg';
import studioFour from '../assets/images/studio/studio_four.jpg';
import studioFive from '../assets/images/studio/studio_siven.jpg';

export default function Studios() {
  const [activeTheme, setActiveTheme] = useState(0);

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
  }, [activeTheme]); // Re-observe when theme changes as elements might re-render

  const studioA = {
    name: 'Studio A',
    subtitle: 'Main Production Suite',
    description: 'Our largest and most versatile studio, Studio A is designed for professional productions that require flexibility, visual variety, and space.',
    themes: [
      {
        name: 'Signature',
        image: studioOne,
        capacity: 'Up to 4 people',
        description: 'A polished, modern setup that represents the core Goldbeam Studio look. Ideal for podcasts, interviews, panels, and branded content.',
        bookingUrl: 'https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ/services/ZHLIUT4OKK265VGAQDD34YXS',
      },
      {
        name: 'Oasis',
        image: studioThree,
        capacity: 'Up to 4 people',
        description: 'A warm, relaxed environment designed for conversational content, storytelling, and educational videos with a softer, lifestyle feel.',
        bookingUrl: 'https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ/services/NYQAYVPQRWRAWYVSTAG5L4AC',
      },
      {
        name: 'Chroma',
        image: studioFour,
        capacity: 'Up to 2 people',
        description: 'A minimalist white backdrop enhanced with RGB lighting, allowing you to create custom color moods and branded looks without post-production effects.',
        bookingUrl: 'https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ/services/J44VS5ERBOKIONVWZ4DOPC4V',
      },
    ],
    features: [
      '4K multi-camera production setup',
      'Professional studio lighting',
      'Shure SM7B microphones',
      'Acoustic treatment for broadcast-quality sound',
      'Live streaming capability',
      'Green room access',
      'Custom set configuration by theme',
    ],
    optionalSetup: 'Green screen recording available upon request',
    bestFor: 'Podcasts, interviews, YouTube shows, educational content, branded videos, livestreams, and creative productions.',
  };

  const studioB = {
    name: 'Studio B',
    subtitle: 'Compact Production Studio',
    capacity: 'Up to 2 people',
    image: studioTwo,
    description: 'Studio B is our smaller, streamlined studio designed for focused recordings and efficient content creation. It offers professional quality in a more intimate setting.',
    features: [
      'Professional audio setup',
      'Studio lighting',
      'Acoustic treatment',
      'Simple, clean visual layout',
      'Ideal for single-host or one-on-one recordings',
    ],
    optionalSetup: 'Green screen recording available upon request',
    bestFor: 'Solo podcasts, interviews, voice recordings, short-form content, and creators who need a clean, distraction-free space.',
    bookingUrl: 'https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ/services/KIZZB5V36MBOXNNU2QH4Y6JR', // Using Audio Only for Studio B for now if not distinct
  };

  const studioC = {
    name: 'Studio C',
    subtitle: 'General Content Studio',
    capacity: 'Flexible',
    image: studioFive,
    description: 'Designed for high-end visual content beyond podcasts, from brand features to product shots.',
    features: [
      'Complete studio access',
      '4K Sony cameras',
      'Studio lighting kits',
      'Broadcast-quality audio',
      'On-site camera operator',
      'Custom lighting setup',
      'High-speed fiber internet',
    ],
    optionalSetup: 'Post-production services available upon request',
    bestFor: 'Creators, educators, businesses, marketing teams, agencies, and brands producing polished visual content.',
    bookingUrl: 'https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ/services/PGCDYBESUFP7SQBIAKF7WFSJ',
  };

  const amenities = [
    {
      icon: Wifi,
      name: 'High-Speed Fiber Internet',
      description: 'Reliable uploads, livestreams & remote guests'
    },
    {
      icon: Coffee,
      name: 'Refreshments',
      description: 'Complimentary coffee, water & energy drinks'
    },
    {
      icon: Mic2,
      name: 'Professional Equipment',
      description: 'Broadcast-quality cameras, lighting & audio'
    },
    {
      icon: Video,
      name: '4K Video Capture',
      description: 'High-resolution, multi-camera recording'
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6 animate-fade-in">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Studios
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              State-of-the-art facilities designed for creators of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Studios List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="space-y-40">

          {/* Studio A */}
          <section className="animate-on-scroll opacity-0">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              {/* Image Side */}
              <div className="flex-1 w-full order-1">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-amber-500/20">
                  <img
                    src={studioA.themes[activeTheme].image}
                    alt={studioA.name}
                    className="w-full h-[400px] md:h-[550px] object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Theme Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 px-6 py-2 rounded-full flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                        {studioA.themes[activeTheme].name} Theme
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-8 order-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-amber-500/50"></span>
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-sm">Studio A</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight">
                    {studioA.subtitle}
                  </h2>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed">
                  {studioA.description}
                </p>

                {/* Theme Switcher */}
                <div className="space-y-4 pt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Theme:</p>
                  <div className="flex flex-wrap gap-3">
                    {studioA.themes.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTheme(index)}
                        className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 border ${activeTheme === index
                          ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/40 transform -translate-y-1'
                          : 'bg-zinc-900 border-amber-500/20 text-gray-400 hover:border-amber-500/50 hover:text-white'
                          }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/50 rounded-2xl border border-amber-500/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-amber-500" />
                    <span className="text-white font-bold">{studioA.themes[activeTheme].capacity}</span>
                  </div>
                  <p className="text-sm text-gray-400 italic leading-relaxed">
                    {studioA.themes[activeTheme].description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studioA.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={studioA.themes[activeTheme].bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 group"
                >
                  Book {studioA.name}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          </section>

          {/* Studio B */}
          <section className="animate-on-scroll opacity-0">
            <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
              {/* Image Side */}
              <div className="flex-1 w-full lg:order-2">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-amber-500/20">
                  <img
                    src={studioB.image}
                    alt={studioB.name}
                    className="w-full h-[400px] md:h-[550px] object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-8 lg:order-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-amber-500/50"></span>
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-sm">Studio B</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight">
                    {studioB.subtitle}
                  </h2>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed">
                  {studioB.description}
                </p>

                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-amber-500/10 w-fit">
                  <Users className="h-5 w-5 text-amber-500" />
                  <span className="text-white font-bold">{studioB.capacity} Capacity</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studioB.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={(studioB as any).bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest transform transition-all hover:scale-105 hover:bg-amber-500 group"
                >
                  Book {studioB.name}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          </section>

          {/* Studio C */}
          <section className="animate-on-scroll opacity-0">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              {/* Image Side */}
              <div className="flex-1 w-full order-1">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-amber-500/20">
                  <img
                    src={studioC.image}
                    alt={studioC.name}
                    className="w-full h-[400px] md:h-[550px] object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-8 order-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-amber-500/50"></span>
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-sm">Studio C</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight">
                    {studioC.subtitle}
                  </h2>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed">
                  {studioC.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studioC.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Best For:</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{studioC.bestFor}</p>
                </div>

                <a
                  href={(studioC as any).bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 border-2 border-amber-500/30 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transform transition-all hover:border-amber-500 hover:bg-amber-500/5 group"
                >
                  Book {studioC.name}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Amenities Section */}
      <section className="py-32 bg-zinc-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-on-scroll opacity-0">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
              Premium Amenities
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide everything you need to focus on your content while we handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 bg-black/40 border border-amber-500/10 p-10 rounded-3xl text-center hover:border-amber-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-amber-500/20">
                    <amenity.icon className="h-8 w-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{amenity.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 border-t border-amber-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase mb-8 leading-tight">
            Ready to <span className="text-amber-500">Record?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Experience the gold standard in production. Book your session today and elevate your content.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 block text-center"
            >
              Book Now
            </a>
            <button className="border-2 border-amber-500/30 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transform transition-all hover:border-amber-500 hover:bg-amber-500/5">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
