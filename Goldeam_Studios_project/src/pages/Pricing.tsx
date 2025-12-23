import { Check, Sparkles } from 'lucide-react';

export default function Pricing() {
  const pricingPlans = [
    {
      name: 'Audio Only',
      price: '$125',
      period: '/ hour',
      description: 'Perfect for audio-focused podcasters',
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
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Audio + Video',
      price: '$300',
      period: '/ hour',
      description: 'A full cinematic podcast experience — designed for creators who want to look as professional as they sound.',
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
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      name: 'General Content',
      price: '$200',
      period: '/ hour',
      description: 'Designed for content beyond podcasts. Ideal for short-form videos, educational content, brand features, product demonstrations, interviews, and creative productions.',
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
      gradient: 'from-amber-600 to-orange-600',
    },
  ];

  const addOns = [
    {
      name: 'Video Editing',
      price: '$60 / hour',
      description: 'Professional editing tailored for podcasts, interviews, and branded content.',
      features: [
        'Clean cuts & pacing',
        'Color correction',
        'Lower thirds & basic motion graphics',
        'Export optimized for YouTube & social platforms',
      ]
    },
    {
      name: 'Audio Mixing & Mastering',
      price: '$40 / hour',
      description: 'Broadcast-ready audio polishing for a clean, balanced sound.',
      features: [
        'Noise reduction & cleanup',
        'EQ, compression, loudness leveling',
        'Optimized for Spotify, Apple Podcasts, YouTube',
      ]
    },
    {
      name: 'Social Media Clips',
      price: '$90',
      period: 'per set (5 clips)',
      description: 'Short-form vertical clips designed to grow your audience.',
      features: [
        '5 clips (30–60 seconds each)',
        'Vertical (Reels / TikTok / Shorts)',
        'Captions-ready delivery',
        'Platform-safe formatting',
      ]
    },
    {
      name: 'Show Notes & Timestamps',
      price: '$30',
      period: 'per episode',
      description: 'AI-assisted summaries reviewed for clarity and structure.',
      features: [
        'Episode summary',
        'Key timestamps',
        'SEO-friendly formatting',
        'Ready for website & podcast platforms',
      ]
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Pricing
              </span>{' '}
              Plans
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Transparent pricing with no hidden fees. All sessions include a professional
              sound engineer.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 flex flex-col h-full rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 ${plan.popular
                    ? 'border-2 border-amber-500 bg-zinc-900 shadow-2xl shadow-amber-500/30 scale-105'
                    : 'border border-amber-500/20 bg-black/50 hover:border-amber-500/50'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-1.5 uppercase tracking-wider rounded-full text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6 italic">{plan.description}</p>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start text-gray-300">
                      <Check className="h-5 w-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
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
                  className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-lg ${plan.popular
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/30'
                      : 'bg-white text-black hover:bg-gray-200'
                    }`}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="border-t border-amber-500/20 pt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
                Add-On Services
              </h2>
              <p className="text-gray-400">Enhance your content with professional services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 border border-amber-500/20 p-6 rounded-xl hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 h-full flex flex-col"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{addon.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-2xl font-black text-amber-500">{addon.price}</p>
                    {addon.period && <span className="text-sm text-gray-400">{addon.period}</span>}
                  </div>
                  <p className="text-sm text-gray-300 mb-4 flex-grow">{addon.description}</p>

                  {addon.features && (
                    <ul className="space-y-2 mt-4 pt-4 border-t border-amber-500/10">
                      {addon.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-xs text-gray-400">
                          <Check className="h-3 w-3 text-amber-500 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-white uppercase mb-12 text-center">
            Pricing FAQs
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit and debit cards through our secure Square checkout system. Payment is required to confirm your booking.',
              },
              {
                q: 'Can I cancel or reschedule my session?',
                a: 'Yes. You may reschedule up to 24 hours before your session at no additional charge. Cancellations made within 24 hours of the booking time may be subject to a fee.',
              },
              {
                q: 'Do you offer discounts for extended or repeat bookings?',
                a: 'Yes. If you require multiple hours, recurring sessions, or long-form production, please contact us to discuss custom pricing options.',
              },
              {
                q: 'What happens if my session runs longer than scheduled?',
                a: 'Additional time is billed at the standard hourly rate, calculated in 15-minute increments, subject to studio availability.',
              },
              {
                q: 'Is there a minimum booking time?',
                a: 'Some services and studio setups may require a minimum booking duration, which will be shown during scheduling or confirmed before your session.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-black border border-amber-500/20 p-6 rounded-xl hover:border-amber-500/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
