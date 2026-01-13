import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Clock,
    Calendar,
    Save,
    RefreshCcw,
    Building2,
    Lock,
    Unlock,
    Trash2,
    Plus,
    X,
    ChevronDown,
    Ban,
    Edit3,
    Settings2
} from 'lucide-react';
import { formatTime } from '../../lib/utils';
import { useServerTime } from '../../hooks/useServerTime';

interface Studio {
    id: string;
    name: string;
    description: string;
}

interface WorkingHour {
    id: string;
    studio_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_closed: boolean;
}

interface BlockedDate {
    id: string;
    blocked_date: string;
    reason: string;
}

interface BlockedSlot {
    id: string;
    studio_id: string;
    day_of_week: number;
    slot_time: string;
    reason: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper for 12h time conversion
const hours12 = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutes = ["00", "15", "30", "45"];

const convertTo24h = (hour: string, minute: string, period: string) => {
    let h = parseInt(hour);
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minute}:00`;
};

const parse24h = (time: string) => {
    if (!time) return { hour: "09", minute: "00", period: "AM" };
    const [hStr, m] = time.split(':');
    let h = parseInt(hStr);
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return {
        hour: h.toString().padStart(2, '0'),
        minute: m,
        period
    };
};

export default function AdminSchedule() {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
    const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hours' | 'blocked' | 'slots'>('hours');
    const [error, setError] = useState<string | null>(null);
    const { serverTime } = useServerTime();

    // Dialog States
    const [isEditHourOpen, setIsEditHourOpen] = useState(false);
    const [isAddDateOpen, setIsAddDateOpen] = useState(false);
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);

    // Form states for Dialogs
    const [editingHour, setEditingHour] = useState<WorkingHour | null>(null);
    const [newBlockedDate, setNewBlockedDate] = useState({ date: '', reason: '' });
    const [newBlockedSlot, setNewBlockedSlot] = useState({ day: 1, hour: '09', minute: '00', period: 'AM', reason: '' });

    useEffect(() => {
        fetchStudios();
        fetchGlobalBlockedDates();
    }, []);

    const fetchStudios = async () => {
        const { data, error } = await supabase.from('studios').select('*').order('name');
        if (!error && data) {
            setStudios(data);
            if (data.length > 0) {
                setSelectedStudio(data[0].id);
                fetchStudioData(data[0].id);
            }
        }
    };

    const fetchStudioData = async (studioId: string) => {
        setLoading(true);
        setError(null);
        try {
            const [hoursRes, slotsRes] = await Promise.all([
                supabase.from('studio_working_hours').select('*').eq('studio_id', studioId).order('day_of_week'),
                supabase.from('blocked_slots').select('*').eq('studio_id', studioId).order('day_of_week')
            ]);
            setWorkingHours(hoursRes.data || []);
            setBlockedSlots(slotsRes.data || []);
        } finally {
            setLoading(false);
        }
    };

    const fetchGlobalBlockedDates = async () => {
        const { data } = await supabase.from('blocked_dates').select('*').order('blocked_date');
        setBlockedDates(data || []);
    };

    const handleStudioChange = (id: string) => {
        setSelectedStudio(id);
        fetchStudioData(id);
    };

    const handleInitializeHours = async () => {
        if (!selectedStudio) return;
        setSaving(true);
        setError(null);
        try {
            // Default hours: 09:00 - 18:00 for all 7 days
            const defaultHours = Array.from({ length: 7 }, (_, i) => ({
                studio_id: selectedStudio,
                day_of_week: i,
                start_time: '09:00:00',
                end_time: '18:00:00',
                is_closed: i === 0 || i === 6 // Closed on weekends by default
            }));

            const { error } = await supabase.from('studio_working_hours').insert(defaultHours);
            if (error) throw error;
            fetchStudioData(selectedStudio);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // CRUD Handlers
    const handleSaveWorkingHour = async () => {
        if (!editingHour) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('studio_working_hours')
                .update({
                    start_time: editingHour.start_time,
                    end_time: editingHour.end_time,
                    is_closed: editingHour.is_closed
                })
                .eq('id', editingHour.id);
            if (error) throw error;
            setWorkingHours(prev => prev.map(h => h.id === editingHour.id ? editingHour : h));
            setIsEditHourOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddBlockedDate = async () => {
        if (!newBlockedDate.date) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('blocked_dates')
                .insert([{ blocked_date: newBlockedDate.date, reason: newBlockedDate.reason }]);
            if (error) throw error;
            fetchGlobalBlockedDates();
            setIsAddDateOpen(false);
            setNewBlockedDate({ date: '', reason: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteBlockedDate = async (id: string) => {
        if (!confirm('Remove this block?')) return;
        await supabase.from('blocked_dates').delete().eq('id', id);
        fetchGlobalBlockedDates();
    };

    const handleAddBlockedSlot = async () => {
        if (!selectedStudio) return;
        setSaving(true);
        const time24 = convertTo24h(newBlockedSlot.hour, newBlockedSlot.minute, newBlockedSlot.period);
        try {
            const { error } = await supabase
                .from('blocked_slots')
                .insert([{
                    studio_id: selectedStudio,
                    day_of_week: newBlockedSlot.day,
                    slot_time: time24,
                    reason: newBlockedSlot.reason
                }]);
            if (error) throw error;
            fetchStudioData(selectedStudio);
            setIsAddSlotOpen(false);
            setNewBlockedSlot({ day: 1, hour: '09', minute: '00', period: 'AM', reason: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteBlockedSlot = async (id: string) => {
        if (!confirm('Remove this block?')) return;
        await supabase.from('blocked_slots').delete().eq('id', id);
        if (selectedStudio) fetchStudioData(selectedStudio);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
                        <Clock className="text-indigo-500" />
                        AESTHETIC SCHEDULE
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-400 font-medium">Manage your studio windows and restrictions with surgical precision.</p>
                        {serverTime && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                                Server Time: {serverTime.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-800 shadow-2xl">
                    {studios.map(s => (
                        <button
                            key={s.id}
                            onClick={() => handleStudioChange(s.id)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedStudio === s.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-y-[-1px]'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Studio {s.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:col-span-3 space-y-4">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 shadow-xl sticky top-8">
                        <nav className="flex flex-col gap-2">
                            {[
                                { id: 'hours', label: 'Working Hours', icon: Clock, desc: 'Regular open times' },
                                { id: 'blocked', label: 'Holiday Blocks', icon: Calendar, desc: 'Specific closed dates' },
                                { id: 'slots', label: 'Recurring Blocks', icon: Ban, desc: 'Per-hour restrictions' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                        ? 'bg-indigo-600/10 border border-indigo-500/20 shadow-inner'
                                        : 'hover:bg-gray-800/50 border border-transparent'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-500 group-hover:text-white'}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-bold tracking-tight ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                            {item.label}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-9 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] min-h-[500px]">
                        {/* Tab Content: Working Hours */}
                        {activeTab === 'hours' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-indigo-600/5 to-transparent">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Studio Working Hours</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Define your daily operational window for bookings.</p>
                                    </div>
                                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                        <Building2 size={24} />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-32 text-gray-600">
                                        <RefreshCcw className="animate-spin mb-4" size={32} />
                                        <p className="font-bold uppercase tracking-widest text-xs">Syncing Windows...</p>
                                    </div>
                                ) : workingHours.length === 0 ? (
                                    <div className="p-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto text-gray-500 border border-gray-700 shadow-inner">
                                            <Settings2 size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white tracking-tighter">SCHEDULE NOT INITIALIZED</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto mt-2">This studio has no operational hours defined. You must initialize its weekly schedule before it can be booked.</p>
                                        </div>
                                        <button
                                            onClick={handleInitializeHours}
                                            disabled={saving}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 mx-auto disabled:opacity-50"
                                        >
                                            {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Plus size={18} />}
                                            {saving ? 'INITIALIZING...' : 'Initialize Default Schedule'}
                                        </button>
                                        {error && <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto p-4">
                                        <table className="w-full text-left border-separate border-spacing-y-2">
                                            <thead className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                <tr>
                                                    <th className="px-6 py-4">Day of Week</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Current Hours</th>
                                                    <th className="px-6 py-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {workingHours.map((hour) => (
                                                    <tr key={hour.id} className="group hover:bg-gray-800/30 transition-all">
                                                        <td className="px-6 py-5 bg-gray-950/30 rounded-l-2xl border-y border-l border-gray-800/50">
                                                            <span className="font-bold text-white tracking-tight text-base">{DAYS[hour.day_of_week]}</span>
                                                        </td>
                                                        <td className="px-6 py-5 bg-gray-950/30 border-y border-gray-800/50">
                                                            {hour.is_closed ? (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-red-500/20">
                                                                    <Lock size={12} /> Closed
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
                                                                    <Unlock size={12} /> Operational
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 bg-gray-950/30 border-y border-gray-800/50 font-mono text-gray-300">
                                                            {!hour.is_closed ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-indigo-400 font-bold">{formatTime(hour.start_time)}</span>
                                                                    <span className="text-gray-600">—</span>
                                                                    <span className="text-indigo-400 font-bold">{formatTime(hour.end_time)}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-600 font-medium">N/A</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 bg-gray-950/30 rounded-r-2xl border-y border-r border-gray-800/50 text-right">
                                                            <button
                                                                onClick={() => { setEditingHour(hour); setIsEditHourOpen(true); }}
                                                                className="p-2.5 text-gray-500 hover:text-white hover:bg-indigo-600 rounded-xl transition-all shadow-md group-hover:scale-110 active:scale-95"
                                                            >
                                                                <Edit3 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Holiday Blocks */}
                        {activeTab === 'blocked' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Holiday & Maintenance Blocks</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Shut down all studios for specific dates.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddDateOpen(true)}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                    >
                                        <Plus size={18} /> Add Blocked Date
                                    </button>
                                </div>

                                {blockedDates.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-950/50 rounded-[2rem] border-2 border-dashed border-gray-800">
                                        <Calendar className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 font-bold">No active blocks detected.</p>
                                        <button onClick={() => setIsAddDateOpen(true)} className="text-indigo-500 text-sm font-black mt-2 uppercase tracking-widest hover:text-indigo-400 transition-colors">Initiate Closure</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {blockedDates.map(d => (
                                            <div key={d.id} className="group p-6 bg-gray-950/50 border border-gray-800 rounded-3xl flex items-center justify-between hover:border-red-500/30 transition-all shadow-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                                                        <Calendar size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-lg tracking-tight">
                                                            {new Date(d.blocked_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium">{d.reason || 'General Maintenance'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBlockedDate(d.id)}
                                                    className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Recurring Blocks */}
                        {activeTab === 'slots' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Recurring Slot Restrictions</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Prevent bookings for specific recurring hours.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddSlotOpen(true)}
                                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all active:scale-95"
                                    >
                                        <Plus size={18} /> Block Recurring Slot
                                    </button>
                                </div>

                                {blockedSlots.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-950/50 rounded-[2rem] border-2 border-dashed border-gray-800">
                                        <Clock className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 font-bold">No recurring blocks for this studio.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {blockedSlots.map(s => (
                                            <div key={s.id} className="group p-6 bg-gray-950/50 border border-gray-800 rounded-3xl flex items-center justify-between hover:border-amber-500/30 transition-all shadow-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                                                        <Ban size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-lg tracking-tight">
                                                            {DAYS[s.day_of_week]} at {formatTime(s.slot_time)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium">{s.reason || 'Recurring closure'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBlockedSlot(s.id)}
                                                    className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* MODAL: Edit Working Hour */}
            {isEditHourOpen && editingHour && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60 transition-all animate-in fade-in duration-300">
                    <div className="bg-gray-950 border border-gray-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_-20px_rgba(79,70,229,0.3)] animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-800 bg-gradient-to-r from-indigo-600/10 to-transparent flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tighter">EDIT OPERATING HOURS</h3>
                                <p className="text-sm text-indigo-400 font-bold uppercase tracking-widest">{DAYS[editingHour.day_of_week]}</p>
                            </div>
                            <button onClick={() => setIsEditHourOpen(false)} className="p-3 text-gray-500 hover:text-white bg-gray-900 rounded-2xl transition-all hover:rotate-90">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8">
                            {/* Toggle Closed */}
                            <div className="flex items-center justify-between p-6 bg-gray-900/50 rounded-3xl border border-gray-800">
                                <div>
                                    <p className="font-bold text-white">Temporary Closure</p>
                                    <p className="text-xs text-gray-500">Toggle this if the studio is closed on this day.</p>
                                </div>
                                <button
                                    onClick={() => setEditingHour({ ...editingHour, is_closed: !editingHour.is_closed })}
                                    className={`relative w-14 h-8 rounded-full transition-all duration-500 ${editingHour.is_closed ? 'bg-red-600 shadow-lg shadow-red-600/30' : 'bg-gray-800 shadow-inner'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-500 shadow-md ${editingHour.is_closed ? 'translate-x-6 scale-90' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {!editingHour.is_closed && (
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Start Time Section */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Daily Opening Time</p>
                                        <div className="flex gap-3">
                                            {[
                                                { val: parse24h(editingHour.start_time).hour, options: hours12, field: 'hour' },
                                                { val: parse24h(editingHour.start_time).minute, options: minutes, field: 'minute' },
                                                { val: parse24h(editingHour.start_time).period, options: ["AM", "PM"], field: 'period' }
                                            ].map((pick, i) => (
                                                <div key={i} className="flex-1 relative group">
                                                    <select
                                                        value={pick.val}
                                                        onChange={(e) => {
                                                            const p = parse24h(editingHour.start_time);
                                                            const newVal = convertTo24h(
                                                                pick.field === 'hour' ? e.target.value : p.hour,
                                                                pick.field === 'minute' ? e.target.value : p.minute,
                                                                pick.field === 'period' ? e.target.value : p.period
                                                            );
                                                            setEditingHour({ ...editingHour, start_time: newVal });
                                                        }}
                                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 px-4 text-white font-black text-lg appearance-none cursor-pointer focus:ring-2 ring-indigo-500/50 outline-none transition-all group-hover:border-gray-700"
                                                    >
                                                        {pick.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5 pointer-events-none group-hover:text-indigo-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* End Time Section */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Daily Closing Time</p>
                                        <div className="flex gap-3">
                                            {[
                                                { val: parse24h(editingHour.end_time).hour, options: hours12, field: 'hour' },
                                                { val: parse24h(editingHour.end_time).minute, options: minutes, field: 'minute' },
                                                { val: parse24h(editingHour.end_time).period, options: ["AM", "PM"], field: 'period' }
                                            ].map((pick, i) => (
                                                <div key={i} className="flex-1 relative group">
                                                    <select
                                                        value={pick.val}
                                                        onChange={(e) => {
                                                            const p = parse24h(editingHour.end_time);
                                                            const newVal = convertTo24h(
                                                                pick.field === 'hour' ? e.target.value : p.hour,
                                                                pick.field === 'minute' ? e.target.value : p.minute,
                                                                pick.field === 'period' ? e.target.value : p.period
                                                            );
                                                            setEditingHour({ ...editingHour, end_time: newVal });
                                                        }}
                                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 px-4 text-white font-black text-lg appearance-none cursor-pointer focus:ring-2 ring-indigo-500/50 outline-none transition-all group-hover:border-gray-700"
                                                    >
                                                        {pick.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5 pointer-events-none group-hover:text-indigo-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6">
                                <button
                                    onClick={handleSaveWorkingHour}
                                    disabled={saving}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <RefreshCcw className="animate-spin" size={20} /> : <Save size={20} />}
                                    {saving ? 'UPDATING...' : 'COMMIT CHANGES'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Add Blocked Date */}
            {isAddDateOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60 transition-all animate-in fade-in duration-300">
                    <div className="bg-gray-950 border border-gray-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_-20px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-800 bg-gradient-to-r from-red-600/10 to-transparent flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Initiate Shutdown</h3>
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Global Restricted Date</p>
                            </div>
                            <button onClick={() => setIsAddDateOpen(false)} className="p-3 text-gray-500 hover:text-white bg-gray-900 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Date</label>
                                <input
                                    type="date"
                                    value={newBlockedDate.date}
                                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-white font-bold text-lg focus:ring-2 ring-red-500/50 outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reason for Closure</label>
                                <textarea
                                    placeholder="e.g. Studio Refurbishment, National Holiday"
                                    value={newBlockedDate.reason}
                                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-gray-300 min-h-[120px] focus:ring-2 ring-red-500/50 outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleAddBlockedDate}
                                disabled={saving || !newBlockedDate.date}
                                className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? 'PROCESSING...' : 'LOCK DATE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Add Blocked Slot */}
            {isAddSlotOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60 transition-all animate-in fade-in duration-300">
                    <div className="bg-gray-950 border border-gray-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_0_100px_-20px_rgba(245,158,11,0.2)] animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-800 bg-gradient-to-r from-amber-600/10 to-transparent flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Recurring Restriction</h3>
                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Fixed Studio Closure</p>
                            </div>
                            <button onClick={() => setIsAddSlotOpen(false)} className="p-3 text-gray-500 hover:text-white bg-gray-900 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Day of Week</label>
                                <div className="relative">
                                    <select
                                        value={newBlockedSlot.day}
                                        onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, day: parseInt(e.target.value) })}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-white font-bold text-lg appearance-none focus:ring-2 ring-amber-500/50 outline-none transition-all"
                                    >
                                        {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Restriction Time</p>
                                <div className="flex gap-3">
                                    {[
                                        { val: newBlockedSlot.hour, options: hours12, field: 'hour' },
                                        { val: newBlockedSlot.minute, options: minutes, field: 'minute' },
                                        { val: newBlockedSlot.period, options: ["AM", "PM"], field: 'period' }
                                    ].map((pick, i) => (
                                        <div key={i} className="flex-1 relative group">
                                            <select
                                                value={pick.val}
                                                onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, [pick.field]: e.target.value })}
                                                className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-white font-black text-lg appearance-none cursor-pointer focus:ring-2 ring-amber-500/50 outline-none transition-all"
                                            >
                                                {pick.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5 pointer-events-none group-hover:text-indigo-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Restriction Reason</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Weekly Cleaning, Staff Meeting"
                                    value={newBlockedSlot.reason}
                                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, reason: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-gray-300 focus:ring-2 ring-amber-500/50 outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={handleAddBlockedSlot}
                                disabled={saving}
                                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-amber-600/30 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? 'PROCESSING...' : 'APPLY RESTRICTION'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
