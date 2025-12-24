import { useEffect } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export default function Book() {
  useEffect(() => {
    // Square Widget Script Loader
    const script = document.createElement('script');
    script.src = 'https://app.squareup.com/appointments/buyer/widget/21w2rftjhu82lt/LMTXXK2JVCGRJ.js';
    script.async = true;

    // We want to append it to the specific container
    const container = document.getElementById('square-booking-widget');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
      // Square widget often creates other elements (modals, overlays) 
      // but usually the main iframe is inside the container.
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase mb-6 tracking-tighter">
              Booking <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                Portal
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              Schedule your session in seconds. Secure your production time with our seamless booking experience.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Steps Bar */}
      <section className="py-12 border-y border-amber-500/10 bg-zinc-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: 'Pick a Service' },
              { icon: Clock, title: 'Choose Time' },
              { icon: CreditCard, title: 'Secure Pay' },
              { icon: CheckCircle2, title: 'Confirmed' },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4 justify-center md:justify-start">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg shadow-amber-500/20">
                  <step.icon className="h-5 w-5 text-black" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/80">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Booking Interface */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-amber-500/20 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden shadow-amber-500/5">
            <div className="bg-black/80 rounded-[2.2rem] p-6 md:p-12">
              <div className="mb-12 text-center">
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Schedule Now</h2>
                <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full"></div>
              </div>

              {/* LIVE SQUARE WIDGET CONTAINER */}
              <div className="min-h-[600px] w-full relative">
                <div id="square-booking-widget" className="w-full">
                  {/* The Square script will inject the widget here */}
                </div>

                {/* Fallback/Loading State */}
                <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6"></div>
                  <p className="text-gray-500 font-medium">Loading Booking System...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy and Info */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="h-px w-8 bg-amber-500/50"></span>
                Arrival Time
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Please arrive <span className="text-white font-bold">15 minutes early</span> to your scheduled session. This allows us to get you settled, test audio levels, and ensure we start exactly on time.
              </p>
            </div>
            <div>
              <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="h-px w-8 bg-amber-500/50"></span>
                Cancellation
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rescheduling is free up to <span className="text-white font-bold">24 hours</span> before your session. Cancellations within 24 hours are subject to a 50% technical fee.
              </p>
            </div>
            <div>
              <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="h-px w-8 bg-amber-500/50"></span>
                File Delivery
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Raw audio and video files are delivered <span className="text-white font-bold">immediately</span> via secure transfer. Post-production turnarounds vary by project scope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-20 bg-amber-500/5 border-t border-amber-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Production Quote?</h3>
          <p className="text-gray-400 mb-8">For large-scale projects, recurring bookings, or multi-day sessions.</p>
          <a
            href="mailto:contact@goldbeamstudios.com"
            className="inline-block border-2 border-amber-500 text-amber-500 px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
          >
            Contact Production Team
          </a>
        </div>
      </section>
    </div>
  );
}
