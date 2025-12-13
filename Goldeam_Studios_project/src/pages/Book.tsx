import { Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export default function Book() {
  return (
    <div className="bg-black text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              Book Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Session
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Select your preferred studio, date, and time. Secure payment via Square.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-12 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: 'Choose Studio', description: 'Select from Studio A, B, or C' },
              { icon: Clock, title: 'Pick Date & Time', description: 'View real-time availability' },
              { icon: CreditCard, title: 'Secure Payment', description: 'Pay safely via Square' },
              { icon: CheckCircle2, title: 'Confirmation', description: 'Receive booking details' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-xl">
                    <step.icon className="h-8 w-8 text-black" />
                  </div>
                </div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form/Integration */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-black text-white uppercase mb-8 text-center">
              Select Your Package
            </h2>

            {/* Package Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { name: 'Audio Only', price: '$85/hr', features: ['Up to 4 Mics', 'Engineer Included', 'Raw Files'] },
                { name: 'Audio + Video', price: '$125/hr', features: ['4K Recording', '3 Cameras', 'Lighting'], popular: true },
                { name: 'Monthly Pro', price: '$400/mo', features: ['4 Hours', 'Priority Booking', 'Storage'] },
              ].map((pkg, index) => (
                <button
                  key={index}
                  className={`text-left p-6 rounded-xl border-2 transition-all hover:transform hover:-translate-y-1 ${
                    pkg.popular
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-amber-500/20 hover:border-amber-500/50'
                  }`}
                >
                  {pkg.popular && (
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 inline-block">
                      Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-black text-amber-500 mb-4">{pkg.price}</p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="text-sm text-gray-400 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Square Integration Placeholder */}
            <div className="bg-black border border-amber-500/20 rounded-xl p-12 text-center">
              <CreditCard className="h-16 w-16 text-amber-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Square Booking Integration
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                This is where the Square booking and payment widget will be integrated. Customers
                can select dates, times, and complete secure payment directly through Square.
              </p>
              <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-3 rounded-lg font-bold">
                Square Appointment Widget Goes Here
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 border-t border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white uppercase mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Before Your Session',
                points: [
                  'Receive confirmation email with details',
                  'Pre-session checklist and studio guide',
                  'Remote guest coordination support',
                ],
              },
              {
                title: 'During Your Session',
                points: [
                  'Arrive 15 minutes early for setup',
                  'Engineer handles all technical aspects',
                  'Focus on creating great content',
                ],
              },
              {
                title: 'After Your Session',
                points: [
                  'Files delivered within 24 hours',
                  'Access to optional editing services',
                  'Priority rebooking for next session',
                ],
              },
              {
                title: 'Cancellation Policy',
                points: [
                  'Free rescheduling up to 24 hours before',
                  'Cancellations within 24 hours: 50% fee',
                  'No-shows are non-refundable',
                ],
              },
            ].map((section, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-amber-500/20 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.points.map((point, pIndex) => (
                    <li key={pIndex} className="text-gray-400 flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
