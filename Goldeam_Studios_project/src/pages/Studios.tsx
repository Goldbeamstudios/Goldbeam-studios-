import { Sparkles, Users, Wifi, Coffee, Mic2, Video, Check } from 'lucide-react';
import studioOne from '../assets/images/studio/studo_one.jpeg';
import studioTwo from '../assets/images/studio/studo_two.jpg';

export default function Studios() {
  const studioA = {
    name: 'Studio A',
    subtitle: 'Main Production Suite',
    image: studioOne,
    description: 'Our largest and most versatile studio, Studio A is designed for professional productions that require flexibility, visual variety, and space. This studio can be configured into three distinct themes, allowing creators to match the look and feel of their content.',
    themes: [
      {
        name: 'Signature',
        capacity: 'Up to 4 people',
        description: 'A polished, modern setup that represents the core Goldbeam Studio look. Ideal for podcasts, interviews, panels, and branded content.',
      },
      {
        name: 'Oasis',
        capacity: 'Up to 4 people',
        description: 'A warm, relaxed environment designed for conversational content, storytelling, and educational videos with a softer, lifestyle feel.',
      },
      {
        name: 'Chroma',
        capacity: 'Up to 2 people',
        description: 'A minimalist white backdrop enhanced with RGB lighting, allowing you to create custom color moods and branded looks without post-production effects.',
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
    description: 'Studio B is our smaller, streamlined studio designed for focused recordings and efficient content creation. It offers the same professional quality as Studio A in a more intimate setting.',
    features: [
      'Professional audio setup',
      'Studio lighting',
      'Acoustic treatment',
      'Simple, clean visual layout',
      'Ideal for single-host or one-on-one recordings',
    ],
    optionalSetup: 'Green screen recording available upon request',
    bestFor: 'Solo podcasts, interviews, voice recordings, short-form content, and creators who need a clean, distraction-free space.',
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
              State-of-the-art facilities designed for creators of all sizes. From intimate solo
              recordings to large panel discussions.
            </p>
          </div>
        </div>
      </section>

      {/* Studio A Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
            {/* Image */}
            <div className="flex-1 w-full">
              <div className="relative group overflow-hidden rounded-2xl">
                <img
                  src={studioA.image}
                  alt={studioA.name}
                  className="w-full h-64 md:h-96 lg:h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-2">
                  {studioA.name}
                </h2>
                <p className="text-xl text-amber-500 font-bold mb-4">{studioA.subtitle}</p>
                <p className="text-gray-300 leading-relaxed">{studioA.description}</p>
              </div>

              {/* Capacity by Theme */}
              <div>
                <h3 className="text-lg font-bold text-white uppercase mb-4">Capacity:</h3>
                <div className="space-y-2">
                  {studioA.themes.map((theme, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-400">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">
                        <span className="font-semibold text-amber-400">{theme.name} Theme:</span> {theme.capacity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Available Themes */}
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase mb-8 text-center">
              Available Themes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studioA.themes.map((theme, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 border border-amber-500/20 p-6 rounded-xl hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  <h4 className="text-2xl font-bold text-amber-500 mb-3">{theme.name}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Studio A Features */}
          <div className="bg-black border border-amber-500/20 p-8 rounded-2xl mb-8">
            <h3 className="text-2xl font-bold text-white uppercase mb-6">Studio A Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {studioA.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <Check className="h-5 w-5 text-amber-500 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-amber-500/10 space-y-3">
              <div>
                <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Optional Setup:</span>
                <p className="text-gray-300 text-sm mt-1">{studioA.optionalSetup}</p>
              </div>
              <div>
                <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Best for:</span>
                <p className="text-gray-300 text-sm mt-1">{studioA.bestFor}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-amber-500/20"></div>

      {/* Studio B Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
            {/* Image */}
            <div className="flex-1 w-full">
              <div className="relative group overflow-hidden rounded-2xl">
                <img
                  src={studioB.image}
                  alt={studioB.name}
                  className="w-full h-64 md:h-96 lg:h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-2">
                  {studioB.name}
                </h2>
                <p className="text-xl text-amber-500 font-bold mb-4">{studioB.subtitle}</p>
                <p className="text-gray-300 leading-relaxed mb-6">{studioB.description}</p>

                <div className="flex items-center gap-2 text-gray-400 mb-8">
                  <Users className="h-5 w-5 text-amber-500" />
                  <span className="font-bold text-white">Capacity:</span>
                  <span>{studioB.capacity}</span>
                </div>
              </div>

              {/* Studio B Features */}
              <div className="bg-zinc-900 border border-amber-500/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white uppercase mb-4">Studio B Features</h3>
                <div className="space-y-3 mb-6">
                  {studioB.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <Check className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-amber-500/10 space-y-3">
                  <div>
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Optional Setup:</span>
                    <p className="text-gray-300 text-sm mt-1">{studioB.optionalSetup}</p>
                  </div>
                  <div>
                    <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Best for:</span>
                    <p className="text-gray-300 text-sm mt-1">{studioB.bestFor}</p>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg w-full">
                Book {studioB.name}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
              Studio Amenities
            </h2>
            <p className="text-gray-400">Everything you need for a successful recording session</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="bg-black border border-amber-500/20 p-6 rounded-xl text-center hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                    <amenity.icon className="h-6 w-6 text-black" />
                  </div>
                </div>
                <h3 className="text-white font-bold mb-2 text-sm">{amenity.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="py-20 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6">
            Take a Virtual Tour
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            See our studios in action before you book. Schedule a walkthrough or watch our
            virtual tour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg">
              Watch Tour Video
            </button>
            <button className="border-2 border-amber-500 text-white px-8 py-4 text-lg font-bold uppercase tracking-wider hover:bg-amber-500/10 transition-all rounded-lg">
              Schedule Walkthrough
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
