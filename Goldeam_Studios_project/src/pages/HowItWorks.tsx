import { Calendar, Headphones, Video, Download, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      number: '01',
      title: 'Book Your Session',
      description:
        'Choose your preferred date and time. Select from audio-only or full video production packages.',
      details: [
        'Instant online booking',
        'Flexible scheduling',
        'Secure payment via Square',
      ],
    },
    {
      icon: Headphones,
      number: '02',
      title: 'Prepare Your Content',
      description:
        'We send you a pre-session checklist and studio guide. Arrive 15 minutes early for setup.',
      details: [
        'Content planning guide',
        'Technical requirements',
        'Guest coordination',
      ],
    },
    {
      icon: Video,
      number: '03',
      title: 'Record in Studio',
      description:
        'Our engineer handles all technical aspects. You focus on creating great content.',
      details: [
        'Professional audio mixing',
        '4K video recording',
        'Live monitoring',
      ],
    },
    {
      icon: Download,
      number: '04',
      title: 'Receive Your Files',
      description:
        'Get high-quality files delivered within 24 hours. Optional editing services available.',
      details: [
        'Cloud delivery',
        'Multiple formats',
        'Post-production available',
      ],
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
              How It{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Works
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              From booking to delivery, we've streamlined every step to make professional
              podcast production effortless.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="text-7xl font-black text-amber-500/20">
                      {step.number}
                    </span>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl">
                      <step.icon className="h-8 w-8 text-black" />
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase">
                    {step.title}
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, dIndex) => (
                      <li key={dIndex} className="flex items-center gap-3 text-gray-400">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1 relative">
                  <div className="aspect-video bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-2xl border border-amber-500/20 p-8 flex items-center justify-center hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20">
                    <step.icon className="h-32 w-32 text-amber-500/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book your first session today and experience professional podcast production.
          </p>
          <a
            href="/book"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 rounded-lg"
          >
            Book Now
          </a>
        </div>
      </section>
    </div>
  );
}
