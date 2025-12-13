import { Check, Sparkles } from 'lucide-react';

export default function Pricing() {
  const pricingPlans = [
    {
      name: 'Audio Only',
      price: '$85',
      period: '/ hour',
      description: 'Perfect for audio-focused podcasters',
      features: [
        'Up to 4 Microphones',
        'Sound Engineer Included',
        'Raw WAV/MP3 Delivery',
        'Instant File Transfer',
        'Acoustically Treated Room',
        'Unlimited Coffee & Water',
      ],
      popular: false,
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Audio + Video',
      price: '$125',
      period: '/ hour',
      description: 'Most popular for content creators',
      features: [
        'Everything in Audio Only',
        '3-Camera 4K Setup',
        'Live Video Switching',
        'Professional Lighting',
        'Custom Set Colors',
        'Raw Video Files Included',
        'Green Room Access',
      ],
      popular: true,
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      name: 'Monthly Pro',
      price: '$400',
      period: '/ month',
      description: 'Best value for regular creators',
      features: [
        '4 Hours Studio Time',
        'Audio & Video Included',
        'Priority Booking',
        'File Storage (3 Months)',
        'Discount on Editing',
        'Free Guest Parking',
        'Dedicated Support',
      ],
      popular: false,
      gradient: 'from-amber-600 to-orange-600',
    },
  ];

  const addOns = [
    {
      name: 'Video Editing',
      price: '$50/hour',
      description: 'Professional editing with cuts, transitions, and graphics',
    },
    {
      name: 'Audio Mixing',
      price: '$35/hour',
      description: 'Advanced audio processing and mastering',
    },
    {
      name: 'Social Clips',
      price: '$75',
      description: '5 short-form clips optimized for social media',
    },
    {
      name: 'Show Notes',
      price: '$25',
      description: 'AI-generated timestamps and episode summary',
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
                className={`relative p-8 flex flex-col h-full rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  plan.popular
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
                <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
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
                <button
                  className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-lg ${
                    plan.popular
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
                  className="bg-zinc-900 border border-amber-500/20 p-6 rounded-xl hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{addon.name}</h3>
                  <p className="text-2xl font-black text-amber-500 mb-3">{addon.price}</p>
                  <p className="text-sm text-gray-400">{addon.description}</p>
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
                a: 'We accept all major credit cards, debit cards, and ACH payments through Square.',
              },
              {
                q: 'Can I cancel or reschedule?',
                a: 'Yes, you can reschedule up to 24 hours before your session at no charge.',
              },
              {
                q: 'Do you offer discounts for bulk bookings?',
                a: 'Yes! Contact us for custom packages if you need more than 4 hours per month.',
              },
              {
                q: 'What if I go over my booked time?',
                a: 'Additional time is billed at the hourly rate in 15-minute increments.',
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
