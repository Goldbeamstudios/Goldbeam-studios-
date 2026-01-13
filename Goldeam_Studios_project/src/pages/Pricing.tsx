import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const pricingPlans = [
    {
      id: 'audio',
      name: 'Audio-Only Podcast',
      price: 'From $170',
      period: '/ hour',
      description: 'Perfect for audio-focused podcasts, interviews, and voiceovers. Hosted in Studio B.',
      features: [
        'Dedicated audio-only studio (Studio B)',
        'Professional sound engineer',
        'Multi-hour discounts up to 40%',
        'Raw WAV & MP3 files',
        'File delivery within 24 hours',
      ],
      bestFor: 'Audio podcasts, interviews, voice recording',
      popular: false,
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      id: 'audio_video',
      name: 'Audio + Video Podcast',
      price: 'From $250',
      period: '/ hour',
      description: 'A cinematic podcast experience. Choose between Studio A (Premium) or Studio B (Standard).',
      features: [
        'Multi-camera 4K video setup',
        'Multi-hour discounts up to 40%',
        'Professional studio lighting',
        'On-site camera operator / technician',
        'Custom set and color configuration',
        'Live-cut program video + program audio',
        'File delivery within 24 hours',
      ],
      bestFor: 'Video podcasts, YouTube shows, branded content',
      popular: true,
      gradient: 'from-amber-500 to-amber-600',
      note: 'Rates: Studio A ($300/hr), Studio B ($250/hr). Discounts apply for 2+ hours.',
    },
    {
      id: 'general',
      name: 'General Content',
      price: 'From $200',
      period: '/ hour',
      description: 'Designed for educational videos, product demos, and brand content.',
      features: [
        'Full studio access (Studio A or B)',
        'Professional camera operator',
        'Multi-hour discounts up to 40%',
        'Live-cut program video + program audio',
        'File delivery within 24 hours',
      ],
      bestFor: 'Creators, educators, and businesses',
      popular: false,
      gradient: 'from-amber-600 to-orange-600',
      note: 'Rates: Studio A ($250/hr), Studio B ($200/hr). Discounts apply for 2+ hours.',
    },
  ];

  const comparisonFeatures = [
    { name: 'Book Studio A', audio: false, video: true, general: true },
    { name: 'Book Studio B', audio: true, video: true, general: true },
    { name: 'Full Studio Access', audio: false, video: true, general: true },
    { name: 'Acoustically Treated Room', audio: true, video: true, general: true },
    { name: 'Multi-Cam 4K Setup', audio: false, video: true, general: true },
    { name: 'Live Multi-Angle Switching', audio: false, video: true, general: false },
    { name: 'Studio Lighting', audio: false, video: true, general: true },
    { name: 'Custom Set Config', audio: false, video: false, general: true },
    { name: 'Raw WAV & MP3 Files', audio: true, video: false, general: false },
    { name: 'Live-Cut Program Video', audio: false, video: true, general: true },
    { name: 'Program Audio', audio: true, video: true, general: true },
    { name: 'File Delivery (24 Hours)', audio: true, video: true, general: true },
    { name: 'Producer', audio: false, video: true, general: true },
  ];

  const addOns = [
    {
      name: 'ISO Recording',
      price: '$75',
      period: 'per hour',
      description: 'Individual camera ISO files and isolated audio tracks. Includes all camera ISO files + isolated audio tracks.',
    },
    {
      name: 'Basic Video Edit',
      price: '$75',
      period: '(1 full episode)',
      description: 'Trimming dead air, basic pacing, simple audio balance, YouTube-ready export.',
    },
    {
      name: 'Advanced Video Edit',
      price: '$250',
      period: '(1 full episode)',
      description: 'Full edit, color correction, lower thirds, intro/outro (provided assets), light motion graphics, audio cleanup.',
    },
    {
      name: 'Audio Mixing & Mastering',
      price: '$60',
      period: 'per episode',
      description: 'Noise reduction, EQ, compression, broadcast-ready sound. Final WAV + MP3.',
    },
    {
      name: 'Social Media Clips',
      price: '$90',
      period: '(5 clips)',
      description: '5 short vertical clips (30–60s) optimized for Reels, TikTok, and Shorts.',
    },
    {
      name: 'Show Notes & Timestamps',
      price: '$30',
      period: 'per episode',
      description: 'Episode summary, key points, and chapter markers.',
    },
    {
      name: 'Teleprompter',
      price: '$50',
      period: 'per session',
      description: 'Hardware setup, script loading, and formatting. On-site operation included.',
    },
    {
      name: 'On-Set Display / TV Monitor',
      price: '$50',
      period: 'per session',
      description: 'TV monitor setup and HDMI input for visual reference during recording.',
    },
    {
      name: 'Live Streaming',
      price: '$75',
      period: '/ hour',
      description: 'Live broadcast setup, platform connection, and monitoring.',
    },
  ];


  const toggleAddOn = (name: string) => {
    setSelectedAddOns(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const calculateTotal = (basePrice: string) => {
    const base = parseInt(basePrice.replace('From $', ''));
    const addOnTotal = selectedAddOns.reduce((sum, name) => {
      const addon = addOns.find(a => a.name === name);
      return sum + (addon ? parseInt(addon.price.replace('$', '')) : 0);
    }, 0);
    return base + addOnTotal;
  };

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
                {(plan as any).note && (
                  <p className="text-[10px] text-gray-500 mb-6 italic leading-relaxed">
                    Note: {(plan as any).note}
                  </p>
                )}
                {plan.bestFor && (
                  <div className="mb-6 pt-4 border-t border-amber-500/10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Best for:</p>
                    <p className="text-sm text-gray-300 leading-snug">{plan.bestFor}</p>
                  </div>
                )}
                <div className="flex items-baseline mb-8 pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-bold mb-1">Estimated Total</span>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-black text-amber-500">${calculateTotal(plan.price)}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/book-wizard', { state: { plan: plan.id } })}
                  className={`w-full py-4 text-center text-sm font-bold uppercase tracking-widest transition-all rounded-lg block ${plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/30'
                    : 'bg-white text-black hover:bg-gray-200'
                    }`}
                >
                  Book Plan
                </button>
              </div>
            ))}
          </div>

          {/* Sticky Total Bar for Mobile/Desktop */}
          {selectedAddOns.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-fade-in-up">
              <div className="bg-zinc-900/90 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Multi-Service Selection</p>
                  <p className="text-sm text-gray-300">
                    {selectedAddOns.length} Add-on{selectedAddOns.length > 1 ? 's' : ''} Selected
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Additional</p>
                    <p className="text-xl font-black text-white">
                      +${selectedAddOns.reduce((sum, name) => {
                        const addon = addOns.find(a => a.name === name);
                        return sum + (addon ? parseInt(addon.price.replace('$', '')) : 0);
                      }, 0)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const element = document.getElementById('pricing-grid');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2"
                  >
                    Confirm Plans <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="mt-32 mb-24">
            <div className="text-center mb-16">
              <h2 className="text-amber-500 font-bold tracking-[0.2em] uppercase mb-4">Comparison</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase mb-8">Detailed Feature Breakdown</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">Compare our plans side-by-side to find the perfect production package for your content needs.</p>
            </div>

            <div className="overflow-x-auto pb-8">
              <div className="min-w-[900px] border border-amber-500/10 rounded-3xl overflow-hidden bg-zinc-900/30 backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-500/10">
                      <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest bg-black/50 w-1/4">Feature Specs</th>
                      {pricingPlans.map((plan, i) => (
                        <th key={i} className="p-8 text-center bg-black/50">
                          <div className="text-amber-500 font-bold text-xs mb-2 uppercase tracking-widest">{plan.name}</div>
                          <div className="text-white font-black text-3xl mb-1">{plan.price}</div>
                          <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">{plan.period}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, i) => (
                      <tr
                        key={i}
                        className={`group hover:bg-white/[0.02] transition-colors ${i !== comparisonFeatures.length - 1 ? 'border-b border-white/5' : ''
                          }`}
                      >
                        <td className="p-6 pl-8 text-gray-400 font-medium group-hover:text-white transition-colors text-sm">
                          {feature.name}
                        </td>
                        {[feature.audio, feature.video, feature.general].map((included, j) => (
                          <td key={j} className="p-6 text-center border-l border-white/5">
                            <div className="flex justify-center">
                              {included === true ? (
                                <div className="p-1.5 bg-amber-500/10 rounded-full group-hover:bg-amber-500/20 transition-all">
                                  <Check className="h-4 w-4 text-amber-500" />
                                </div>
                              ) : included === false ? (
                                <div className="p-1.5 bg-white/5 rounded-full opacity-20">
                                  <Minus className="h-4 w-4 text-gray-600" />
                                </div>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest py-1.5 px-4 bg-white/5 text-gray-300 rounded-lg group-hover:bg-amber-500 group-hover:text-black transition-all border border-white/5">
                                  {included}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-amber-500/10">
                      <td className="p-8 bg-black/50"></td>
                      {pricingPlans.map((plan, i) => (
                        <td key={i} className="p-8 text-center bg-black/50 border-l border-white/5">
                          <button
                            onClick={() => navigate('/book-wizard', { state: { plan: plan.id } })}
                            className={`inline-block w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg ${plan.popular
                              ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
                              : 'bg-white/10 text-white hover:bg-white hover:text-black border border-white/10'
                              }`}
                          >
                            Get Started
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs italic">
              <Sparkles className="h-3 w-3 text-amber-500/50" />
              <span>All sessions include a dedicated sound engineer to handle the technical side.</span>
            </div>
          </div>

          <div className="border-t border-amber-500/20"></div>

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
                a: 'We accept all major credit and debit cards through our secure Stripe checkout system. Payment is required to confirm your booking.',
              },
              {
                q: 'Is there a minimum booking time?',
                a: 'Some services and studio setups may require a minimum booking duration. This will be shown during booking.',
              },
              {
                q: 'What files will I receive?',
                a: 'Audio-Only sessions include WAV and MP3 files. Audio + Video and General Content sessions include a live-cut video and program audio.',
              },
              {
                q: 'How quickly will I receive my files?',
                a: 'Non-edited files are delivered within 24 hours. Edited content is typically delivered within 72 hours.',
              },
              {
                q: 'Are ISO files included?',
                a: 'No. ISO files are optional add-ons and must be requested in advance.',
              },
              {
                q: 'Do you offer live streaming?',
                a: 'Yes. Live streaming is available as an add-on.',
              },
              {
                q: 'What happens if my session runs longer than scheduled?',
                a: 'Additional time is billed in 15-minute increments at the standard hourly rate, subject to availability.',
              },
              {
                q: 'Can I cancel or reschedule?',
                a: 'You may reschedule up to 24 hours before your session at no charge. Cancellations within 24 hours may be subject to a fee.',
              },
              {
                q: 'Do you store files long-term?',
                a: 'Files are available for download for a limited time. Clients are responsible for backing up their files.',
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
