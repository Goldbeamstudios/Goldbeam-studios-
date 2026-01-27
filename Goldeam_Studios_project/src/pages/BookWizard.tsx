import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Check, ChevronRight,
    ChevronLeft, Loader2, Music, Video, Zap, ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatTime } from '../lib/utils';
import { useServerTime } from '../hooks/useServerTime';

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
    { id: 'advanced_edit', name: 'Advanced Video Edit', price: 250, duration: 'per episode' },
    { id: 'mastering', name: 'Audio Mixing & Mastering', price: 60, duration: 'per episode' },
    { id: 'clips', name: 'Social Media Clips', price: 90, duration: 'per set (5 clips)' },
    { id: 'notes', name: 'Show Notes & Timestamps', price: 30, duration: 'per episode' },
    { id: 'teleprompter', name: 'Teleprompter', price: 50, duration: 'per session' },
    { id: 'monitor', name: 'On-Set Display / TV Monitor', price: 50, duration: 'per session' },
    { id: 'live_stream', name: 'Live Streaming', price: 75, duration: 'per hour' },
];

const THEMES = [
    { id: 'signature', name: 'Signature', description: 'Core Goldbeam look' },
    { id: 'sahara', name: 'Sahara', description: 'Relaxed storytelling' },
    { id: 'chroma', name: 'Chroma', description: 'RGB custom moods' },
];

interface Studio {
    id: string;
    name: string;
    description: string;
}

export default function BookWizard() {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState<Step>('plan');
    const [loading, setLoading] = useState(false);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [studios, setStudios] = useState<Studio[]>([]);
    const [blockedDates, setBlockedDates] = useState<{ blocked_date: string; reason: string }[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { serverTime } = useServerTime();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStudios();
        fetchBlockedDates();
    }, []);

    const fetchBlockedDates = async () => {
        const { data, error } = await supabase.from('blocked_dates').select('blocked_date, reason');
        if (!error && data) {
            setBlockedDates(data);
        }
    };

    const [booking, setBooking] = useState<BookingState>(() => {
        const planFromState = location.state?.plan || 'audio_video';
        console.log('Initializing BookWizard with plan:', planFromState);
        return {
            plan: planFromState,
            studio: 'A',
            theme: 'signature',
            duration: 1,
            addons: [],
            date: '', // Initialize as empty, will be set by serverTime effect
            time: '',
            customerName: '',
            customerEmail: '',
        };
    });

    // Update date when serverTime is available
    useEffect(() => {
        if (serverTime && !booking.date) {
            setBooking(prev => ({
                ...prev,
                date: serverTime.toISOString().split('T')[0]
            }));
        }
    }, [serverTime, booking.date]);

    const fetchStudios = async () => {
        const { data, error } = await supabase.from('studios').select('*').eq('is_active', true);
        if (!error && data) {
            setStudios(data);
        }
    };

    const fetchSlots = useCallback(async () => {
        if (!booking.date) return;

        const currentStudio = studios.find(s => s.name === booking.studio);
        if (!currentStudio) return;

        setFetchingSlots(true);
        try {
            const { data, error } = await supabase.rpc('get_available_slots', {
                p_studio_id: currentStudio.id,
                p_date: booking.date,
                p_duration: 1 // Always fetch 1-hour slots to show all possibilities
            });

            if (error) throw error;

            // Map time objects/strings to HH:mm format
            const freeSlots = data?.map((slot: { slot_time: string }) => {
                const parts = slot.slot_time.split(':');
                return `${parts[0]}:${parts[1]}`;
            }) || [];

            setAvailableSlots(freeSlots);

            // Clear selected time if it's no longer available
            if (booking.time && !freeSlots.includes(booking.time)) {
                setBooking(prev => ({ ...prev, time: '' }));
            }
        } catch (err) {
            console.error('Error fetching slots:', err);
            setAvailableSlots([]);
        } finally {
            setFetchingSlots(false);
        }
    }, [booking.date, booking.studio, studios]);

    useEffect(() => {
        if (currentStep === 'schedule' || (currentStep === 'details' && booking.date)) {
            fetchSlots();
        }
    }, [currentStep, fetchSlots]);

    // Calculate total price accurately
    const handleSlotClick = (time: string) => {
        if (!booking.time) {
            setBooking(prev => ({ ...prev, time, duration: 1 }));
            return;
        }

        const slots = availableSlots;
        const startIdx = slots.indexOf(booking.time);
        const clickIdx = slots.indexOf(time);

        if (clickIdx === -1) return;

        // If clicking the current start time, clear selection
        if (time === booking.time) {
            setBooking(prev => ({ ...prev, time: '', duration: 1 }));
            return;
        }

        // If clicking a selected slot (not the start), deselect it and subsequent ones
        const isCurrentlySelected = clickIdx >= startIdx && clickIdx < (startIdx + booking.duration);
        if (isCurrentlySelected) {
            const newDuration = clickIdx - startIdx;
            if (newDuration === 0) {
                setBooking(prev => ({ ...prev, time: '', duration: 1 }));
            } else {
                setBooking(prev => ({ ...prev, duration: newDuration }));
            }
            return;
        }

        // If clicking the slot immediately following current selection, expand
        const nextIdx = startIdx + booking.duration;
        if (clickIdx === nextIdx) {
            setBooking(prev => ({ ...prev, duration: prev.duration + 1 }));
            return;
        }

        // If clicking the slot immediately preceding current selection, expand backwards
        if (clickIdx === startIdx - 1) {
            setBooking(prev => ({ ...prev, time, duration: prev.duration + 1 }));
            return;
        }

        // Otherwise (non-contiguous), reset selection to start at new slot
        setBooking(prev => ({ ...prev, time, duration: 1 }));
    };

    const isSlotSelected = (time: string) => {
        if (!booking.time) return false;
        const slots = availableSlots;
        const startIdx = slots.indexOf(booking.time);
        const currentIdx = slots.indexOf(time);
        return currentIdx >= startIdx && currentIdx < (startIdx + booking.duration);
    };

    const calculateTotal = () => {
        let baseRate = 0;

        // Base Rates
        if (booking.plan === 'audio') baseRate = 170; // Studio B only
        else if (booking.plan === 'audio_video') {
            baseRate = booking.studio === 'A' ? 300 : 250;
        } else if (booking.plan === 'general') {
            baseRate = booking.studio === 'A' ? 250 : 200;
        }

        // Apply Multi-Hour Discounts
        let discount = 0;
        if (booking.duration === 2) discount = 0.20;
        else if (booking.duration === 3) discount = 0.25;
        else if (booking.duration === 4) discount = 0.30;
        else if (booking.duration === 5) discount = 0.32;
        else if (booking.duration === 6) discount = 0.34;
        else if (booking.duration === 7) discount = 0.36;
        else if (booking.duration >= 8) discount = 0.40;

        const discountedStudioTotal = (baseRate * booking.duration) * (1 - discount);

        // Add-ons Calculation
        const hourlyAddons = ADD_ONS.filter(a => booking.addons.includes(a.id) && a.duration === 'per hour');
        const flatAddons = ADD_ONS.filter(a => booking.addons.includes(a.id) && a.duration !== 'per hour');

        const totalHourlyAddons = hourlyAddons.reduce((sum, a) => sum + a.price, 0) * booking.duration;
        const totalFlatAddons = flatAddons.reduce((sum, a) => sum + a.price, 0);

        return discountedStudioTotal + totalHourlyAddons + totalFlatAddons;
    };

    const handleNext = () => {
        setValidationError(null);
        if (currentStep === 'plan') {
            if (booking.plan === 'audio') {
                setBooking(prev => ({ ...prev, studio: 'B', theme: '' }));
            }
            setCurrentStep('studio');
        } else if (currentStep === 'studio') {
            setCurrentStep('details');
        } else if (currentStep === 'details') {
            setCurrentStep('schedule');
        } else if (currentStep === 'schedule') {
            if (!booking.date || !booking.time) {
                setValidationError('Please select both a date and a time range to continue.');
                return;
            }
            setCurrentStep('confirm');
        }
    };

    const handleBack = () => {
        if (currentStep === 'studio') setCurrentStep('plan');
        if (currentStep === 'details') {
            setCurrentStep('studio');
        }
        if (currentStep === 'schedule') setCurrentStep('details');
        if (currentStep === 'confirm') setCurrentStep('schedule');
    };

    const submitBooking = async () => {
        setLoading(true);
        try {
            const currentStudio = studios.find(s => s.name === booking.studio);
            if (!currentStudio) throw new Error('Studio not found');

            // 1. Create Stripe Checkout Session via Edge Function
            const { data, error } = await supabase.functions.invoke('stripe-checkout', {
                body: {
                    booking_data: {
                        ...booking,
                        studio_id: currentStudio.id,
                        totalPrice: calculateTotal()
                    }
                }
            });

            if (error) throw error;
            if (!data?.url) throw new Error('Failed to get checkout URL');

            // 2. Redirect to Stripe
            window.location.href = data.url;

        } catch (error: any) {
            console.error('Booking failed:', error);
            alert('Booking failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen pt-32 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Progress Stepper */}
                <div className="mb-12 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-200 dark:bg-zinc-800 z-0"></div>
                    {['plan', 'studio', 'details', 'schedule', 'confirm'].map((s, idx) => (
                        <div
                            key={s}
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === s
                                ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30'
                                : (idx < ['plan', 'studio', 'details', 'schedule', 'confirm'].indexOf(currentStep))
                                    ? 'bg-white dark:bg-zinc-900 border-amber-500 text-amber-500'
                                    : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                                }`}
                        >
                            {idx < ['plan', 'studio', 'details', 'schedule', 'confirm'].indexOf(currentStep) ? <Check className="h-5 w-5" /> : idx + 1}
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
                    {/* STEP 1: PLAN */}
                    {currentStep === 'plan' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Choose Your Plan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'audio', name: 'Audio Only', icon: Music, color: 'text-blue-500', description: 'Voice-only recording (Studio B)' },
                                    { id: 'audio_video', name: 'Audio + Video', icon: Video, color: 'text-amber-500', description: 'Multi-cam podcast recording' },
                                    { id: 'general', name: 'General', icon: Zap, color: 'text-purple-500', description: 'Interviews, branded content, YouTube & custom shoots' }
                                ].map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setBooking(prev => ({ ...prev, plan: p.id as any }))}
                                        className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 ${booking.plan === p.id
                                            ? 'bg-amber-500/10 border-amber-500'
                                            : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <p.icon className={`h-6 w-6 ${booking.plan === p.id ? 'text-amber-500' : 'text-zinc-400'}`} />
                                            <span className="font-bold text-lg uppercase">{p.name}</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-gray-400 leading-snug">{p.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: STUDIO */}
                    {currentStep === 'studio' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-2">Select Studio & Theme</h2>
                            <p className="text-zinc-500 dark:text-gray-400 mb-8 border-l-4 border-amber-500 pl-4 py-1 bg-amber-500/5 rounded-r-lg text-sm">
                                {booking.plan === 'audio'
                                    ? "Studio selection not required for Audio-Only sessions."
                                    : "Themes apply to Studio A only. Studio B uses a fixed setup optimized for audio-focused sessions."}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <button
                                    onClick={() => setBooking(prev => ({ ...prev, studio: 'A' }))}
                                    disabled={booking.plan === 'audio'}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${booking.studio === 'A'
                                        ? 'bg-amber-500/10 border-amber-500'
                                        : booking.plan === 'audio'
                                            ? 'bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed'
                                            : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-transparent'
                                        }`}
                                >
                                    <h3 className="font-bold text-xl mb-2">Studio A</h3>
                                    <p className="text-sm text-zinc-600 dark:text-gray-400">Large & Professional Space</p>
                                </button>
                                <button
                                    onClick={() => setBooking(prev => ({ ...prev, studio: 'B' }))}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${booking.studio === 'B' ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-transparent'
                                        }`}
                                >
                                    <h3 className="font-bold text-xl mb-2">Studio B</h3>
                                    <p className="text-sm text-zinc-600 dark:text-gray-400">Compact & Intimate Space</p>
                                </button>
                            </div>

                            {booking.studio === 'A' && (
                                <div className="animate-fade-in">
                                    <p className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-widest mb-4">Select Theme for Studio A:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {THEMES.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setBooking(prev => ({ ...prev, theme: theme.id }))}
                                                className={`p-4 rounded-xl border transition-all text-left ${booking.theme === theme.id ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-transparent text-zinc-600 dark:text-gray-400'
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

                    {/* STEP 3: CUSTOMIZE (Add-ons Only) */}
                    {currentStep === 'details' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase mb-8">Customize Your Session</h2>
                            <div className="space-y-12">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase mb-2 block">Add-On Services:</label>
                                    <p className="text-[10px] text-zinc-400 dark:text-gray-500 mb-4 italic">Pricing shown is per session unless otherwise noted.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ADD_ONS
                                            .filter(addon => {
                                                if (booking.plan === 'audio') {
                                                    // Hide video-specific addons for Audio Only
                                                    return !['advanced_edit', 'basic_edit', 'monitor'].includes(addon.id);
                                                }
                                                return true;
                                            })
                                            .map(addon => (
                                                <button
                                                    key={addon.id}
                                                    onClick={() => {
                                                        const newAddons = booking.addons.includes(addon.id)
                                                            ? booking.addons.filter(a => a !== addon.id)
                                                            : [...booking.addons, addon.id];
                                                        setBooking(prev => ({ ...prev, addons: newAddons }));
                                                    }}
                                                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${booking.addons.includes(addon.id) ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-transparent'
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
                                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase mb-4 block">Select Date:</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={booking.date}
                                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-none rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 ring-amber-500 outline-none"
                                    />
                                    {booking.date && blockedDates.some(d => d.blocked_date === booking.date) && (
                                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm italic">
                                            {blockedDates.find(d => d.blocked_date === booking.date)?.reason || "This date is currently unavailable. Please select another date."}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase block">Select Time Range:</label>
                                        <p className="text-[10px] text-zinc-400 dark:text-gray-500 italic">All times shown in ET</p>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 dark:text-gray-500 mb-4 bg-zinc-50 dark:bg-black/20 p-2 rounded-lg border border-zinc-200 dark:border-white/5">
                                        Select consecutive hours only. Deselecting an hour clears subsequent selections.
                                    </p>
                                    {fetchingSlots ? (
                                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                                            Fetching available times...
                                        </div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-3 gap-2">
                                                {availableSlots.map(t => {
                                                    const selected = isSlotSelected(t);
                                                    return (
                                                        <button
                                                            key={t}
                                                            onClick={() => handleSlotClick(t)}
                                                            className={`p-3 rounded-lg text-sm font-bold transition-all border ${selected
                                                                ? 'bg-amber-500 border-amber-600 text-black shadow-lg shadow-amber-500/20'
                                                                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-transparent text-zinc-600 dark:text-gray-500 hover:border-amber-500/50 hover:text-zinc-900 dark:hover:text-white'
                                                                }`}
                                                        >
                                                            {formatTime(t)}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {booking.time && (
                                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-fade-in">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Booking Summary</p>
                                                            <p className="text-lg font-black text-zinc-900 dark:text-white">
                                                                {booking.duration} {booking.duration === 1 ? 'Hour' : 'Hours'}
                                                            </p>
                                                            <p className="text-xs text-zinc-600 dark:text-gray-400">
                                                                {formatTime(booking.time)} – {(() => {
                                                                    const [h, m] = booking.time.split(':').map(Number);
                                                                    const endHour = h + booking.duration;
                                                                    return formatTime(`${endHour}:${m === 0 ? '00' : m}`);
                                                                })()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Estimated total (CAD)</p>
                                                            <p className="text-2xl font-black text-zinc-900 dark:text-white">${calculateTotal().toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                    <div className="p-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                                        <p className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase mb-4">Final Summary</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-gray-400 capitalize">{booking.plan.replace('_', ' + ')} Podcast</span>
                                                <span className="font-bold text-zinc-900 dark:text-white">Studio {booking.studio}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-gray-400">Duration</span>
                                                <span className="font-bold text-zinc-900 dark:text-white">{booking.duration} Hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-gray-400">Studio Area</span>
                                                <span className="font-bold text-zinc-900 dark:text-white">Studio {booking.studio} {booking.theme ? `(${booking.theme})` : ''}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-gray-400">Time Range</span>
                                                <span className="font-bold text-zinc-900 dark:text-white italic">
                                                    {formatTime(booking.time)} – {(() => {
                                                        const [h, m] = booking.time.split(':').map(Number);
                                                        const endHour = h + booking.duration;
                                                        return formatTime(`${endHour}:${m === 0 ? '00' : m}`);
                                                    })()} (ET)
                                                </span>
                                            </div>
                                            {booking.addons.length > 0 && (
                                                <div className="pt-3 border-t border-zinc-700">
                                                    <p className="text-xs text-amber-500 font-bold mb-2">Add-ons:</p>
                                                    {booking.addons.map(a => {
                                                        const addon = ADD_ONS.find(item => item.id === a);
                                                        return (
                                                            <div key={a} className="flex justify-between text-sm">
                                                                <span className="text-zinc-600 dark:text-gray-400">{addon?.name}</span>
                                                                <span className="text-zinc-500 dark:text-gray-300 font-medium">${addon?.price}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-baseline">
                                                <span className="text-lg font-bold text-zinc-900 dark:text-white uppercase">Total Estimate (CAD)</span>
                                                <span className="text-3xl font-black text-amber-500">${calculateTotal().toFixed(2)}</span>
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
                                            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={booking.customerEmail}
                                            onChange={(e) => setBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                                            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <div className="flex items-start gap-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                                        <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-zinc-600 dark:text-gray-400 leading-relaxed">
                                            By proceeding, you agree to our terms. Secure checkout will be processed in **CAD** via Stripe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation Toast */}
                    {validationError && (
                        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-xl">
                                <Zap className="h-4 w-4 fill-white" />
                                <span className="text-xs font-black uppercase tracking-widest">{validationError}</span>
                                <button onClick={() => setValidationError(null)} className="ml-2 hover:opacity-50">
                                    <Loader2 className="h-3 w-3 rotate-45" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Controls */}
                    <div className="mt-12 flex justify-between items-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 'plan' || loading}
                            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all disabled:opacity-0 cursor-pointer disabled:cursor-default"
                        >
                            <ChevronLeft className="h-5 w-5" /> Back
                        </button>

                        {currentStep === 'confirm' ? (
                            <button
                                onClick={submitBooking}
                                disabled={loading || !booking.customerName || !booking.customerEmail}
                                className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-amber-500/20 ${loading || !booking.customerName || !booking.customerEmail
                                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 scale-95 cursor-not-allowed border border-transparent'
                                    : 'bg-amber-500 text-black hover:bg-amber-400 hover:-translate-y-0.5 cursor-pointer active:scale-95'
                                    }`}
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Booking'}
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${currentStep === 'schedule' && (!booking.date || !booking.time)
                                    ? 'bg-amber-500 opacity-60'
                                    : 'bg-amber-500 text-black hover:bg-amber-400 hover:-translate-y-0.5 shadow-xl shadow-amber-500/20'
                                    }`}
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
