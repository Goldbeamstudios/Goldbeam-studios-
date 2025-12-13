import { Sparkles, Users, Wifi, Coffee, Mic2, Video, Monitor } from 'lucide-react';
import studioOne from '../assets/images/studio/studo_one.jpeg';
import studioTwo from '../assets/images/studio/studo_two.jpg';
import studioThree from '../assets/images/studio/stuido-three.jpeg';
import studioFour from '../assets/images/studio/studio_four.jpg';
import studioFive from '../assets/images/studio/studio_siven.jpg';
import studioSix from '../assets/images/studio/studio_six.jpg';
import photoStudio from '../assets/images/studio/photo_studio.jpg';

export default function Studios() {
  const studios = [
    {
      name: 'Studio A',
      subtitle: 'Main Production Suite',
      capacity: '2-4 People',
      image: studioOne,
      features: [
        '4K Multi-Camera Setup',
        'Professional Lighting',
        'Shure SM7B Microphones',
        'Live Streaming Capable',
        'Acoustic Treatment',
        'Green Room Access',
      ],
      size: '500 sq ft',
    },
    {
      name: 'Studio B',
      subtitle: 'Intimate Recording Space',
      capacity: '1-2 People',
      image: studioTwo,
      features: [
        '2-Camera 4K Setup',
        'Studio Lighting',
        'Professional Microphones',
        'Soundproof Booth',
        'Compact & Cozy',
        'Perfect for Solo Shows',
      ],
      size: '250 sq ft',
    },
    {
      name: 'Studio C',
      subtitle: 'Large Format Production',
      capacity: '5-8 People',
      image: studioThree,
      features: [
        '5-Camera 4K Array',
        'Stage Lighting System',
        '8 Microphone Channels',
        'Panel Discussion Setup',
        'Audience Seating',
        'Live Audience Capable',
      ],
      size: '800 sq ft',
    },
    {
      name: 'Studio D',
      subtitle: 'Executive Recording Suite',
      capacity: '2-3 People',
      image: studioFour,
      features: [
        '3-Camera 4K Setup',
        'Premium Lighting',
        'High-End Microphones',
        'Luxury Furnishings',
        'Private Entrance',
        'VIP Experience',
      ],
      size: '350 sq ft',
    },
    {
      name: 'Studio E',
      subtitle: 'Multi-Purpose Production',
      capacity: '3-6 People',
      image: studioFive,
      features: [
        '4-Camera Setup',
        'Flexible Layout',
        'Pro Audio Equipment',
        'Customizable Lighting',
        'Live Stream Ready',
        'Team Collaboration',
      ],
      size: '600 sq ft',
    },
    {
      name: 'Studio F',
      subtitle: 'Creative Content Hub',
      capacity: '2-5 People',
      image: studioSix,
      features: [
        '3-Camera 4K System',
        'Dynamic Lighting',
        'Broadcast Microphones',
        'Modern Design',
        'Content Creation Focus',
        'Social Media Optimized',
      ],
      size: '450 sq ft',
    },
    {
      name: 'Studio G',
      subtitle: 'Professional Photo Shoot Studio',
      capacity: '1-6 People',
      image: photoStudio,
      features: [
        'High-End DSLR Equipment',
        'Professional Lighting Kits',
        'Multiple Backdrops',
        'Props & Accessories',
        'Product Photography Setup',
        'Portrait & Fashion Ready',
      ],
      size: '700 sq ft',
    },
  ];

  const amenities = [
    { icon: Wifi, name: '1Gbps Fiber', description: 'Ultra-fast internet' },
    { icon: Coffee, name: 'Refreshments', description: 'Unlimited coffee & snacks' },
    { icon: Users, name: 'Green Room', description: 'Guest preparation area' },
    { icon: Monitor, name: 'Control Room', description: 'Professional monitoring' },
    { icon: Mic2, name: 'Pro Gear', description: 'Industry-standard equipment' },
    { icon: Video, name: '4K Video', description: 'Crystal clear recordings' },
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

      {/* Studios Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {studios.map((studio, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-12 items-center`}
              >
                {/* Image */}
                <div className="flex-1 w-full">
                  <div className="relative group overflow-hidden rounded-2xl">
                    <img
                      src={studio.image}
                      alt={studio.name}
                      className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">
                          {studio.size}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-2">
                      {studio.name}
                    </h2>
                    <p className="text-xl text-amber-500 font-bold">{studio.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-5 w-5 text-amber-500" />
                    <span>{studio.capacity}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {studio.features.map((feature, fIndex) => (
                      <div
                        key={fIndex}
                        className="flex items-center gap-2 text-gray-300 bg-zinc-900 p-3 rounded-lg border border-amber-500/20"
                      >
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg">
                    Book {studio.name}
                  </button>
                </div>
              </div>
            ))}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                <h3 className="text-white font-bold mb-1">{amenity.name}</h3>
                <p className="text-xs text-gray-400">{amenity.description}</p>
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
