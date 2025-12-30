import { useState, useEffect } from 'react';
import { Sparkles, Users, Wifi, Coffee, Mic2, Video, Check, ArrowRight, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

// Import images
import studioOne from '../assets/images/studio/studo_one.jpeg';
import studioTwo from '../assets/images/studio/studo_two.jpg';
import studioThree from '../assets/images/studio/stuido-three.jpeg';
import studioFour from '../assets/images/studio/studio_four.jpg';

export default function Studios() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStudio, setLightboxStudio] = useState<'A' | 'B'>('A');

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveTheme((prev) => (prev + 1) % studioA.themes.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveTheme((prev) => (prev - 1 + studioA.themes.length) % studioA.themes.length);
  };

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
    subtitle: 'General Content Studio',
    description: '(Studio A) Our largest and most versatile studio, designed for high-end visual content and professional productions that require flexibility, variety, and space.',
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
    description: '(Studio B) Our smaller, streamlined studio designed for focused recordings and efficient content creation. It offers professional quality in a more intimate setting.',
    features: [
      'Professional audio setup',
      'Studio lighting',
      'Acoustic treatment',
      'Simple, clean visual layout',
      'Ideal for single-host or one-on-one recordings',
    ],
    optionalSetup: 'Green screen recording available upon request',
    bestFor: 'Solo podcasts, interviews, voice recordings, short-form content, and creators who need a clean, distraction-free space.',
    bookingUrl: 'https://book.squareup.com/appointments/vp8i8fb53nyb4e/location/LMTXXK2JVCGRJ/services/KIZZB5V36MBOXNNU2QH4Y6JR',
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
    <div className="bg-black text-white min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-8 leading-[0.9] text-shadow-lg shadow-black/50 animate-slide-up">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Studios
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
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
              {/* Image Side - Carousel */}
              <div className="flex-1 w-full order-1">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-amber-500/20 aspect-[4/3] md:aspect-[3/2] lg:aspect-square xl:aspect-[4/3]">
                  {/* Sliding Container */}
                  <div
                    className="flex h-full transition-transform duration-700 ease-out cursor-zoom-in bg-zinc-900"
                    style={{ transform: `translateX(-${activeTheme * 100}%)` }}
                    onClick={() => {
                      setLightboxStudio('A');
                      setIsLightboxOpen(true);
                    }}
                  >
                    {studioA.themes.map((theme, idx) => (
                      <div key={idx} className="min-w-full h-full relative">
                        <img
                          src={theme.image}
                          alt={`${studioA.name} - ${theme.name}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/20">
                            <Maximize2 className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                  {/* Navigation Arrows */}
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
                    <button
                      onClick={prevSlide}
                      className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-white hover:bg-amber-500 hover:text-black transition-all duration-300 pointer-events-auto shadow-xl group/btn"
                      aria-label="Previous theme"
                    >
                      <ChevronLeft className="h-6 w-6 transition-transform group-hover/btn:-translate-x-1" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-white hover:bg-amber-500 hover:text-black transition-all duration-300 pointer-events-auto shadow-xl group/btn"
                      aria-label="Next theme"
                    >
                      <ChevronRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                  {/* Theme Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 px-6 py-2 rounded-full flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                        {studioA.themes[activeTheme].name} Theme
                      </span>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {studioA.themes.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTheme(idx);
                        }}
                        className={`h-1.5 transition-all duration-300 rounded-full ${activeTheme === idx ? 'w-8 bg-amber-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-8 order-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-amber-500/50"></span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] mb-6">
                      {studioA.name}
                    </h2>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-amber-500 uppercase tracking-widest">
                    {studioA.subtitle}
                  </h3>
                </div>

                <p className="text-xl text-gray-400 mb-8 leading-relaxed font-light">
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
                          : 'bg-zinc-900 border-amber-500/20 text-gray-300 hover:border-amber-500/50 hover:text-white'
                          }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-zinc-900 rounded-2xl border border-amber-500/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-amber-500" />
                    <span className="text-white font-bold">{studioA.themes[activeTheme].capacity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {studioA.themes[activeTheme].description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studioA.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
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
                    className="w-full h-[400px] md:h-[550px] object-cover transition-all duration-700 group-hover:scale-105 cursor-zoom-in"
                    onClick={() => {
                      setLightboxStudio('B');
                      setIsLightboxOpen(true);
                    }}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/20">
                      <Maximize2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-8 lg:order-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="h-px w-12 bg-amber-500/50"></span>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight">
                      {studioB.name}
                    </h2>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-amber-500 uppercase tracking-widest">
                    {studioB.subtitle}
                  </h3>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed">
                  {studioB.description}
                </p>

                <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-amber-500/10 w-fit">
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
                  className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest transform transition-all hover:scale-105 hover:bg-amber-500 hover:text-black group"
                >
                  Book {studioB.name}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Amenities Section */}
      <section className="py-32 bg-black/50 relative">
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
                className="animate-on-scroll opacity-0 bg-zinc-900 border border-amber-500/10 p-10 rounded-3xl text-center hover:border-amber-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 group"
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
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 p-4 text-white/70 hover:text-white transition-colors z-[110]"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={40} strokeWidth={1.5} />
          </button>

          {/* Navigation Arrows - Only for Studio A */}
          {lightboxStudio === 'A' && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-8 p-6 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-[110] border border-white/10 hidden md:block"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-8 p-6 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-[110] border border-white/10 hidden md:block"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[85vh] mx-auto px-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxStudio === 'A' ? studioA.themes[activeTheme].image : studioB.image}
              alt={lightboxStudio === 'A' ? `${studioA.name} - ${studioA.themes[activeTheme].name}` : studioB.name}
              className="w-full h-full object-contain rounded-xl shadow-2xl animate-fade-in-up"
            />

            {/* Info Overlay */}
            <div className="mt-8 text-center space-y-2">
              <h3 className="text-2xl font-black uppercase text-amber-500 tracking-wider">
                {lightboxStudio === 'A' ? `${studioA.name} - ${studioA.themes[activeTheme].name}` : `${studioB.name} - ${studioB.subtitle}`}
              </h3>
              <p className="text-muted-foreground font-medium">
                {lightboxStudio === 'A' ? studioA.themes[activeTheme].capacity : studioB.capacity}
              </p>
            </div>

            {/* Mobile Navigation - Only for Studio A */}
            {lightboxStudio === 'A' && (
              <div className="flex gap-4 mt-8 md:hidden">
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-4 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
