import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Check, ChevronRight,
    ChevronLeft, Loader2, Music, Video, Zap, ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// CONFIGURATION: Replace these with your actual Square IDs
const DEFAULT_LOCATION_ID = 'LMTXXK2JVCGRJ';
const DEFAULT_SERVICE_ID = 'M6M42KEY7HWM6IYSAFEPU4K4';

type Step = 'plan' | 'studio' | 'details' | 'schedule' | 'confirm';

interface BookingState {
    plan: 'audio' | 'audio_video' | 'general';
    studio: 'A' | 'B';
    theme: string;
    duration: number;
    addons: string[];
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
}

const ADD_ONS = [
    { id: 'iso', name: 'ISO Recording', price: 75, duration: 'per hour' },
    { id: 'basic_edit', name: 'Basic Video Edit', price: 75, duration: 'per episode' },
    { id: 'mastering', name: 'Audio Mixing & Mastering', price: 60, duration: 'per episode' },
    { id: 'clips', name: 'Social Media Clips', price: 90, duration: 'per set (5 clips)' },
];

const THEMES = [
    { id: 'signature', name: 'Signature', description: 'Core Goldbeam look' },
    { id: 'oasis', name: 'Oasis', description: 'Relaxed storytelling' },
    { id: 'chroma', name: 'Chroma', description: 'RGB custom moods' },
];

export default function BookWizard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState<Step>('plan');
    const [loading, setLoading] = useState(false);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    const [config, setConfig] = useState({
        locationId: DEFAULT_LOCATION_ID,
        serviceId: DEFAULT_SERVICE_ID,
        teamMemberId: '',
        isDynamic: false
    });

    // Auto-configure IDs from Square
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data, error } = await supabase.functions.invoke('list-square-services');
                if (!error && data?.services?.length > 0) {
                    // Use the first available service for the demo
                    const service = data.services[0];
                    console.log('Auto-configured Square:', service, 'Team Member:', data.teamMemberId);
                    setConfig({
                        locationId: service.location_id || DEFAULT_LOCATION_ID,
                        serviceId: service.variation_id,
                        teamMemberId: data.teamMemberId || '',
                        isDynamic: true
                    });
                }
            } catch (err) {
                console.warn('Failed to auto-configure Square IDs:', err);
            }
        };
        fetchConfig();
    }, []);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [booking, setBooking] = useState<BookingState>(() => {
        const planFromState = location.state?.plan;
        console.log('Initializing BookWizard with plan:', planFromState);
        return {
            plan: planFromState || 'audio_video',
            studio: 'A',
            theme: 'signature',
            duration: 1,
            addons: [],
            date: new Date().toISOString().split('T')[0],
            time: '',
            customerName: '',
            customerEmail: '',
        };
    });

    const fetchSlots = useCallback(async () => {
        if (!booking.date) return;
        setFetchingSlots(true);
        try {
            const { data, error } = await supabase.functions.invoke('square-availability', {
                body: {
                    location_id: config.locationId,
                    start_at: `${booking.date}T00:00:00Z`,
                    end_at: `${booking.date}T23:59:59Z`,
                    service_id: config.serviceId
                }
            });
            if (error) throw error;
            // Extract times from availabilities
            const times = data.availabilities?.map((a: any) =>
                new Date(a.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            ) || [];
            setAvailableSlots(times);
        } catch (err) {
            console.error('Error fetching slots:', err);
            // Fallback slots for demo if API fails
            setAvailableSlots(['09:00', '11:00', '13:00', '15:00', '17:00']);
        } finally {
            setFetchingSlots(false);
        }
    }, [booking.date, config.locationId, config.serviceId]);

    useEffect(() => {
        if (currentStep === 'schedule') {
            fetchSlots();
        }
    }, [currentStep, fetchSlots]);

    // Calculate total price accurately
    const calculateTotal = () => {
        let base = 0;
        if (booking.plan === 'audio') base = 170;
        if (booking.plan === 'audio_video') base = 300;
        if (booking.plan === 'general') base = 250;

        const hourlyAddons = ADD_ONS.filter(a => booking.addons.includes(a.id) && a.duration === 'per hour');
        const flatAddons = ADD_ONS.filter(a => booking.addons.includes(a.id) && a.duration !== 'per hour');

        const totalHourly = base + hourlyAddons.reduce((sum, a) => sum + a.price, 0);
        const totalFlat = flatAddons.reduce((sum, a) => sum + a.price, 0);

        return (totalHourly * booking.duration) + totalFlat;
    };

    const handleNext = () => {
        if (currentStep === 'plan') {
            if (booking.plan === 'audio') {
                setBooking(prev => ({ ...prev, studio: 'B', theme: '' }));
                setCurrentStep('details');
            } else {
                setCurrentStep('studio');
            }
        } else if (currentStep === 'studio') {
            setCurrentStep('details');
        } else if (currentStep === 'details') {
            setCurrentStep('schedule');
        } else if (currentStep === 'schedule') {
            setCurrentStep('confirm');
        }
    };

    const handleBack = () => {
        if (currentStep === 'studio') setCurrentStep('plan');
        if (currentStep === 'details') {
            if (booking.plan === 'audio') setCurrentStep('plan');
            else setCurrentStep('studio');
        }
        if (currentStep === 'schedule') setCurrentStep('details');
        if (currentStep === 'confirm') setCurrentStep('schedule');
    };

    const submitBooking = async () => {
        setLoading(true);
        try {
            // 1. Create booking in Square via Edge Function
            const { data: squareData, error: squareError } = await supabase.functions.invoke('square-booking', {
                body: {
                    appointment_data: {
                        customer: {
                            name: booking.customerName,
                            email: booking.customerEmail
                        },
                        booking: {
                            start_at: `${booking.date}T${booking.time}:00Z`,
                            location_id: config.locationId,
                            service_variation_id: config.serviceId,
                            team_member_id: config.teamMemberId,
                            duration_minutes: booking.duration * 60
                        }
                    }
                }
            });

            if (squareError) throw squareError;

            // 2. Log to Database
            const { error: dbError } = await supabase.from('appointments').insert({
                square_booking_id: squareData.booking.id,
                customer_name: booking.customerName,
                customer_email: booking.customerEmail,
                plan_type: booking.plan,
                studio: booking.studio,
                theme: booking.theme || null,
                duration_hours: booking.duration,
                addons: booking.addons,
                total_price: calculateTotal(),
                booking_date: booking.date,
                start_time: booking.time,
                status: 'confirmed'
            });

            if (dbError) throw dbError;

            // 3. Send Notification
            await supabase.functions.invoke('send-notification', {
                body: {
                    to: booking.customerEmail,
                    subject: 'Booking Confirmed - Goldbeam Studios',
                    html: `<h1>Your session is confirmed!</h1><p>Plan: ${booking.plan}</p><p>Total: $${calculateTotal()}</p>`
                }
            });

            navigate('/booking-success');
        } catch (error: any) {
            console.error('Booking failed:', error);
            alert('Booking failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Stepper */}
                <div className="mb-12 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 z-0"></div>
                    {['plan', 'studio', 'details', 'schedule', 'confirm'].map((s, idx) => (
                        <div
                            key={s}
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === s
                                ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30'
                                : (idx < ['plan', 'studio', 'details', 'schedule', 'confirm'].indexOf(currentStep))
                                    ? 'bg-zinc-900 border-amber-500 text-amber-500'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                                }`}
                        >
                            {idx < ['plan', 'studio', 'details', 'schedule', 'confirm'].indexOf(currentStep) ? <Check className="h-5 w-5" /> : idx + 1}
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* STEP 1: PLAN */}
                    {currentStep === 'plan' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Choose Your Plan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'audio', name: 'Audio Only', icon: Music, color: 'text-blue-500' },
                                    { id: 'audio_video', name: 'Audio + Video', icon: Video, color: 'text-amber-500' },
                                    { id: 'general', name: 'General', icon: Zap, color: 'text-purple-500' }
                                ].map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setBooking(prev => ({ ...prev, plan: p.id as any }))}
                                        className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 ${booking.plan === p.id
                                            ? 'bg-amber-500/10 border-amber-500'
                                            : 'bg-zinc-800/50 border-transparent hover:border-zinc-600'
                                            }`}
                                    >
                                        <p.icon className={`h-8 w-8 ${booking.plan === p.id ? 'text-amber-500' : 'text-zinc-400'}`} />
                                        <span className="font-bold text-lg uppercase">{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: STUDIO */}
                    {currentStep === 'studio' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Select Studio & Theme</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <button
                                    onClick={() => setBooking(prev => ({ ...prev, studio: 'A' }))}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${booking.studio === 'A' ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-800/50 border-transparent'
                                        }`}
                                >
                                    <h3 className="font-bold text-xl mb-2">Studio A</h3>
                                    <p className="text-sm text-gray-400">Large & Professional Space</p>
                                </button>
                                <button
                                    onClick={() => setBooking(prev => ({ ...prev, studio: 'B' }))}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${booking.studio === 'B' ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-800/50 border-transparent'
                                        }`}
                                >
                                    <h3 className="font-bold text-xl mb-2">Studio B</h3>
                                    <p className="text-sm text-gray-400">Compact & Intimate Space</p>
                                </button>
                            </div>

                            {booking.studio === 'A' && (
                                <div className="animate-fade-in">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Select Theme for Studio A:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {THEMES.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setBooking(prev => ({ ...prev, theme: theme.id }))}
                                                className={`p-4 rounded-xl border transition-all text-left ${booking.theme === theme.id ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 border-transparent text-gray-400'
                                                    }`}
                                            >
                                                {theme.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: DETAILS (Duration & Add-ons) */}
                    {currentStep === 'details' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Session Details</h2>
                            <div className="space-y-12">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">Booking Duration (Hours):</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(h => (
                                            <button
                                                key={h}
                                                onClick={() => setBooking(prev => ({ ...prev, duration: h }))}
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${booking.duration === h ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-400'
                                                    }`}
                                            >
                                                {h}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">Add-On Services:</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ADD_ONS.map(addon => (
                                            <button
                                                key={addon.id}
                                                onClick={() => {
                                                    const newAddons = booking.addons.includes(addon.id)
                                                        ? booking.addons.filter(a => a !== addon.id)
                                                        : [...booking.addons, addon.id];
                                                    setBooking(prev => ({ ...prev, addons: newAddons }));
                                                }}
                                                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${booking.addons.includes(addon.id) ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-800/50 border-transparent'
                                                    }`}
                                            >
                                                <div className="text-left">
                                                    <p className="font-bold">{addon.name}</p>
                                                    <p className="text-xs text-amber-500">${addon.price} {addon.duration}</p>
                                                </div>
                                                {booking.addons.includes(addon.id) && <Check className="h-5 w-5 text-amber-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SCHEDULE */}
                    {currentStep === 'schedule' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Pick Time & Date</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">Select Date:</label>
                                    <input
                                        type="date"
                                        value={booking.date}
                                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">Select Time:</label>
                                    {fetchingSlots ? (
                                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                                            Fetching available times...
                                        </div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableSlots.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setBooking(prev => ({ ...prev, time: t }))}
                                                    className={`p-3 rounded-lg text-sm font-bold transition-all ${booking.time === t ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-500 hover:text-white'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-zinc-600 italic">No available slots for this date.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: CONFIRM */}
                    {currentStep === 'confirm' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Review & Confirm</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-4">Final Summary</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 capitalize">{booking.plan} Podcast</span>
                                                <span className="font-bold">${booking.plan === 'audio' ? 170 : booking.plan === 'audio_video' ? 300 : 250}/hr</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Duration</span>
                                                <span className="font-bold">{booking.duration} Hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Studio</span>
                                                <span className="font-bold">Studio {booking.studio} {booking.theme ? `(${booking.theme})` : ''}</span>
                                            </div>
                                            {booking.addons.length > 0 && (
                                                <div className="pt-3 border-t border-zinc-700">
                                                    <p className="text-xs text-amber-500 font-bold mb-2">Add-ons:</p>
                                                    {booking.addons.map(a => {
                                                        const addon = ADD_ONS.find(item => item.id === a);
                                                        return (
                                                            <div key={a} className="flex justify-between text-sm">
                                                                <span className="text-gray-400">{addon?.name}</span>
                                                                <span className="text-gray-300 font-medium">${addon?.price}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <div className="pt-6 border-t border-zinc-700 flex justify-between items-baseline">
                                                <span className="text-lg font-bold text-white uppercase">Total Estimate</span>
                                                <span className="text-3xl font-black text-amber-500">${calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={booking.customerName}
                                            onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-amber-500"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={booking.customerEmail}
                                            onChange={(e) => setBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <div className="flex items-start gap-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                                        <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            By proceeding, you agree to our terms. Secure checkout will be processed via Square.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Controls */}
                    <div className="mt-12 flex justify-between items-center pt-8 border-t border-zinc-800">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 'plan' || loading}
                            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
                        >
                            <ChevronLeft className="h-5 w-5" /> Back
                        </button>

                        {currentStep === 'confirm' ? (
                            <button
                                onClick={submitBooking}
                                disabled={loading || !booking.customerName || !booking.customerEmail}
                                className="bg-amber-500 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Booking'}
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="bg-amber-500 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2"
                            >
                                Next Step
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
