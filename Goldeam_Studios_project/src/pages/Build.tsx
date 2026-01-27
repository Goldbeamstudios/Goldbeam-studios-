import { Mic2, Video, Headphones, Radio, Music, Podcast } from 'lucide-react';

export default function Build() {
  const studioFeatures = [
    {
      icon: Mic2,
      name: 'Professional Audio',
      description: 'Broadcast-quality recording equipment',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: Video,
      name: '4K Video Recording',
      description: 'Multi-camera setup with professional lighting',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Headphones,
      name: 'Sound Engineering',
      description: 'Expert audio mixing and mastering',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Radio,
      name: 'Live Streaming',
      description: 'Stream directly to all major platforms',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Music,
      name: 'Post Production',
      description: 'Professional editing and enhancement',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Podcast,
      name: 'Full Service Studio',
      description: 'Everything you need for podcast success',
      color: 'from-red-500 to-orange-500',
    },
  ];

  const studioBenefits = [
    {
      title: 'Professional Quality',
      description: 'Broadcast-grade equipment and facilities',
    },
    {
      title: 'Expert Support',
      description: 'Experienced sound engineers included',
    },
    {
      title: 'Flexible Booking',
      description: 'Book by the hour or monthly packages',
    },
    {
      title: 'Modern Facilities',
      description: 'State-of-the-art recording environment',
    },
    {
      title: 'Fast Delivery',
      description: 'Files delivered within 24 hours (non-edited)',
    },
    {
      title: 'All-Inclusive',
      description: 'Equipment, engineer, and comfort amenities',
    },
  ];

  return (
    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen pt-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase mb-6">
              What We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Offer
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-gray-300 leading-relaxed mb-8">
              Professional podcast and content production services designed to elevate your brand from recording to post-production.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mic2 className="h-5 w-5 text-amber-500" />
                <span>Professional Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-amber-500" />
                <span>4K Video</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-amber-500" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase mb-4">
              Our Services
            </h2>
            <p className="text-zinc-600 dark:text-gray-400">Everything you need for professional podcast production</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studioFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 p-8 rounded-2xl hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-xl w-fit mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{feature.name}</h3>
                <p className="text-zinc-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Benefits */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase mb-4">
              Why Choose Us
            </h2>
            <p className="text-zinc-600 dark:text-gray-400">The Goldbeam Studios advantage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studioBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-amber-500/20 p-6 rounded-xl hover:border-amber-500/50 transition-all shadow-lg shadow-zinc-200/50 dark:shadow-none"
              >
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-zinc-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase mb-4">
              How to Get Started
            </h2>
            <p className="text-zinc-600 dark:text-gray-400">Three simple steps to your first session</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 'Step 1',
                title: 'Choose Your Session',
                tasks: [
                  'Select audio-only or video production',
                  'Pick hourly plan',
                  'Choose your preferred studio',
                  'Select date and time',
                ],
              },
              {
                step: 'Step 2',
                title: 'Book & Prepare',
                tasks: [
                  'Secure online booking powered by Stripe',
                  'Receive pre-session guide',
                  'Coordinate with remote guests',
                  'Plan your content',
                ],
              },
              {
                step: 'Step 3',
                title: 'Record & Receive',
                tasks: [
                  'Professional recording session',
                  'Expert engineer handles tech',
                  'Files delivered within 24 hours',
                  'Optional post-production services',
                ],
              },
            ].map((phase, index) => (
              <div
                key={index}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 rounded-2xl p-8 hover:border-amber-500/50 transition-all shadow-xl shadow-zinc-200/50 dark:shadow-none"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-black font-black text-2xl w-20 h-20 rounded-xl flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-amber-500 font-bold uppercase mb-2">{phase.step}</div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.tasks.map((task, tIndex) => (
                        <li key={tIndex} className="text-zinc-600 dark:text-gray-400 flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
