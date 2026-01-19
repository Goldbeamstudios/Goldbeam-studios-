import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Booking & Scheduling',
      questions: [
        {
          q: 'How do I book a session?',
          a: 'You can book a session directly through our website using Stripe. Choose your preferred date, time, and studio, then complete the secure payment.',
        },
        {
          q: 'How far in advance should I book?',
          a: 'We recommend booking at least 1-2 weeks in advance, especially for weekends. However, we often have same-week availability.',
        },
        {
          q: 'Can I cancel or reschedule?',
          a: 'Yes, you can reschedule up to 24 hours before your session at no charge. Cancellations within 24 hours are subject to a 50% fee.',
        },
      ],
    },
    {
      category: 'Equipment & Technical',
      questions: [
        {
          q: 'What equipment is included?',
          a: 'All sessions include professional microphones (Shure SM7B), audio interface, headphones, and a sound engineer. Video sessions include 4K cameras, lighting, and live switching.',
        },
        {
          q: 'Can I bring my own equipment?',
          a: 'Absolutely! Many clients bring their own microphones or audio interfaces. Our engineer can help integrate your gear into our setup.',
        },
        {
          q: 'Do you provide technical support?',
          a: 'Yes, a professional sound engineer is included with every session to handle all technical aspects.',
        },
      ],
    },
    {
      category: 'Recording & Production',
      questions: [
        {
          q: 'How long does a typical session last?',
          a: 'Most sessions are 2-3 hours, but you can book for as little as 1 hour or as long as you need.',
        },
        {
          q: 'When will I receive my files?',
          a: 'Raw audio and video files are delivered within 24 hours via secure cloud transfer. Edited content timelines vary based on scope.',
        },
        {
          q: 'What file formats do you provide?',
          a: 'Audio: WAV and MP3. Video: MP4 (H.264). We can accommodate special format requests.',
        },
      ],
    },
    {
      category: 'Pricing & Payment',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and ACH payments through Stripe.',
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No hidden fees. The price you see includes the studio, equipment, and engineer. Additional services like editing are clearly listed.',
        },
        {
          q: 'Do you offer discounts?',
          a: 'Yes! We offer monthly packages with discounted rates. Contact us for custom bulk booking discounts.',
        },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen pt-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                FAQs
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-gray-300 leading-relaxed">
              Find answers to common questions about our studio, booking process, and services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-16">
              <h2 className="text-3xl font-black text-amber-500 uppercase mb-8">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const globalIndex = catIndex * 100 + qIndex;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div
                      key={qIndex}
                      className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 rounded-xl overflow-hidden hover:border-amber-500/50 transition-colors"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="text-lg font-bold text-zinc-900 dark:text-white pr-8">{faq.q}</span>
                        {isOpen ? (
                          <Minus className="h-5 w-5 text-amber-500 shrink-0" />
                        ) : (
                          <Plus className="h-5 w-5 text-amber-500 shrink-0" />
                        )}
                      </button>
                      <div
                        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="px-6 pb-6 text-zinc-600 dark:text-gray-400 leading-relaxed">{faq.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 border-y border-zinc-200 dark:border-amber-500/20 bg-zinc-50 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-gray-300 mb-8">
            Can't find what you're looking for? Contact us and we'll be happy to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
