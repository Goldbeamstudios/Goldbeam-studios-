import { MapPin, Car, Train, Clock, Info, ExternalLink, ArrowRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function LocationParking() {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen transition-colors duration-300">
            {/* Hero Section - Premium Visuals */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background Mesh/Gradient */}
                <div className="absolute inset-0 z-0 bg-black">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)]"></div>
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-amber-600/10 dark:bg-amber-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-amber-500/10 dark:bg-amber-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md animate-fade-in">
                        <Navigation className="h-4 w-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Plan Your Visit</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tight mb-8 leading-[0.9] animate-slide-up">
                        Location & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 animate-gradient">
                            Parking
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
                        Centrally located in Toronto's vibrant Danforth area. Everything you need to know for a seamless arrival.
                    </p>
                </div>

                {/* Floating Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
            </section>

            {/* Section 1 - Studio Location & Map (Premium Dark Blend) */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 animate-on-scroll opacity-0">
                            <div className="space-y-2">
                                <h2 className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs">Our Studio</h2>
                                <h3 className="text-5xl font-black uppercase text-white leading-[1.1]">Goldbeam <br /> Headquarters</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-6 group">
                                    <div className="mt-1 p-3 bg-zinc-900 border border-white/5 rounded-2xl group-hover:border-amber-500/30 transition-colors">
                                        <MapPin className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white mb-2">Danforth Ave</p>
                                        <p className="text-gray-400 leading-relaxed">
                                            Steps from Woodbine Station <br />
                                            Toronto, ON, Canada
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-2xl italic text-gray-300">
                                    "Located in the heart of East York, our studio is easily accessible from any part of the city."
                                </div>
                            </div>

                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-4 bg-gradient-to-r from-white to-gray-200 text-black px-10 py-5 font-black uppercase tracking-widest rounded-2xl hover:from-amber-500 hover:to-amber-600 transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(245,158,11,0.3)]"
                            >
                                Get Directions
                                <ExternalLink className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                            </a>
                        </div>

                        <div
                            ref={mapContainerRef}
                            className="animate-on-scroll opacity-0 relative group"
                        >
                            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
                            <div className="relative p-2 bg-zinc-900 border border-amber-500/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="relative h-[600px] rounded-[2rem] overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.667503461284!2d-79.3090!3d43.6860!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cc7766099dc3%3A0x63806a644171221b!2sWoodbine!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: 'contrast(1.2)' }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        className="relative z-0 grayscale-[1] invert-[0.9]"
                                    ></iframe>
                                </div>
                                {/* Decorative UI elements */}
                                <div className="absolute top-8 left-8 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Live Studio Location</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 - Parking Information (Premium Cards) */}
            <section className="py-32 bg-zinc-950/50 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_50%)]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24 animate-on-scroll opacity-0">
                        <h2 className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs mb-6">Accessibility</h2>
                        <h3 className="text-5xl md:text-6xl font-black uppercase text-white">Parking Options</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            {
                                icon: Car,
                                title: 'Street Parking',
                                desc: 'Ample street parking is available along Danforth Ave and adjacent side streets.',
                                note: 'Ideal for short sessions (under 2 hrs).',
                                highlight: 'Free / Metered'
                            },
                            {
                                icon: Info,
                                title: 'Paid Parking',
                                desc: 'Multiple public parking lots are situated within a 200m radius of the studio.',
                                note: 'Recommended for half or full-day bookings.',
                                highlight: 'Secure Lots'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="animate-on-scroll opacity-0 group relative p-10 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:border-amber-500/50 transition-all duration-500"
                                style={{ animationDelay: `${i * 200}ms` }}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <item.icon className="h-32 w-32" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit">
                                        <item.icon className="h-8 w-8 text-amber-500" />
                                    </div>
                                    <h4 className="text-3xl font-black uppercase text-white group-hover:text-amber-500 transition-colors">{item.title}</h4>
                                    <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
                                    <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-amber-500/60">
                                        <div className="h-px w-8 bg-amber-500/20"></div>
                                        {item.note}
                                    </div>
                                    <div className="inline-block px-4 py-2 bg-amber-500 text-black font-black uppercase tracking-tighter text-xs rounded-lg transform -rotate-1 group-hover:rotate-1 transition-transform">
                                        {item.highlight}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3 - Transit Access (Glassmorphic Feature) */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-on-scroll opacity-0 relative group p-1 bg-gradient-to-br from-amber-500/40 via-transparent to-amber-600/40 rounded-[3.5rem]">
                        <div className="relative bg-zinc-900 rounded-[3.4rem] overflow-hidden p-12 md:p-24">
                            {/* Dynamic Background */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070')] bg-cover bg-center opacity-10 group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-3 bg-amber-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <Train className="h-4 w-4" />
                                        Public Transit
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] text-white transition-colors">
                                        Steps from <br /> Woodbine
                                    </h2>
                                    <div className="flex flex-col md:flex-row items-center gap-8 justify-center lg:justify-start">
                                        <div className="flex items-center gap-4 px-8 py-4 bg-zinc-800 border border-amber-500/10 rounded-2xl">
                                            <Clock className="h-10 w-10 text-amber-500" />
                                            <div className="text-left">
                                                <span className="block text-3xl font-black text-white italic leading-tight transition-colors">5–7 MINS</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">WALKING DISTANCE</span>
                                            </div>
                                        </div>
                                        <p className="text-xl text-gray-400 max-w-sm leading-relaxed transition-colors">
                                            Strategically located on the Bloor-Danforth line for maximum accessibility.
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden lg:flex items-center justify-center">
                                    <div className="relative w-80 h-80">
                                        <div className="absolute inset-0 bg-amber-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="relative w-full h-full bg-zinc-900 backdrop-blur-3xl border border-amber-500/10 rounded-full flex items-center justify-center p-12 transition-all">
                                            <Train className="w-full h-full text-amber-500 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-spin-slow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4 - Arrival Notes & CTA */}
            <section className="py-32 relative overflow-hidden bg-black">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-20 relative z-10">
                    <div className="animate-on-scroll opacity-0 space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                            <div className="group space-y-4 p-8 bg-zinc-900 border border-amber-500/10 rounded-3xl hover:border-amber-500/30 transition-all">
                                <div className="flex items-center gap-3 text-amber-500 font-black uppercase tracking-widest text-xs">
                                    <span className="w-8 h-px bg-amber-500"></span>
                                    Punctuality
                                </div>
                                <h4 className="text-2xl font-black uppercase text-white">Early Check-in</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    We recommend arriving **15 minutes early** to ensure your technical setup is perfect before recording begins.
                                </p>
                            </div>
                            <div className="group space-y-4 p-8 bg-zinc-900 border border-amber-500/10 rounded-3xl hover:border-amber-500/30 transition-all">
                                <div className="flex items-center gap-3 text-amber-500 font-black uppercase tracking-widest text-xs">
                                    <span className="w-8 h-px bg-amber-500"></span>
                                    Support
                                </div>
                                <h4 className="text-2xl font-black uppercase text-white">Need Guidance?</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    Our team is available to assist you. If you're having trouble locating us, please reach out via our contact page.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll opacity-0 pt-20 border-t border-white/5">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/60 mb-8">Ready to Start?</h5>
                        <Link
                            to="/contact"
                            className="group text-4xl md:text-6xl font-black uppercase text-white hover:text-amber-500 transition-all inline-flex flex-col items-center gap-6"
                        >
                            Contact Us for Help
                            <div className="w-20 lg:w-32 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full group-hover:w-full transition-all duration-700"></div>
                        </Link>
                    </div>
                </div>

                {/* Dynamic footer element */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
            </section>
        </div>
    );
}
