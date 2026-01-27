import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Clock,
    Calendar,
    Save,
    Building2,
    Lock,
    Unlock,
    Trash2,
    Plus,
    X,
    ChevronDown,
    Ban,
    Edit3,
    Settings2,
    Zap
} from 'lucide-react';
import { formatTime, cn } from '../../lib/utils';
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
        setError(null);
        console.log('Attempting to update working hour:', editingHour);
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

            console.log('Update successful, refreshing data...');
            if (selectedStudio) await fetchStudioData(selectedStudio);
            setIsEditHourOpen(false);
            setEditingHour(null);
        } catch (err: any) {
            console.error('Update failed:', err);
            setError(err.message || 'Failed to update working hours');
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
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-[1px] w-8 bg-amber-500/50"></span>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Temporal Config</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Studio <span className="text-zinc-500 italic">Pulse</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">Manage operational windows with surgical precision</p>
                        {serverTime && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-900 text-amber-500/80 rounded-md border border-zinc-800 shadow-lg">
                                Live: {serverTime.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 shadow-2xl">
                    {studios.map(s => (
                        <button
                            key={s.id}
                            onClick={() => handleStudioChange(s.id)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                selectedStudio === s.id
                                    ? "bg-white text-black shadow-xl scale-105"
                                    : "text-zinc-500 hover:text-white"
                            )}
                        >
                            Room {s.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:col-span-3 space-y-4">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-6 shadow-xl sticky top-8">
                        <nav className="flex flex-col gap-2">
                            {[
                                { id: 'hours', label: 'Working Hours', icon: Clock, desc: 'Operational Matrix' },
                                { id: 'blocked', label: 'Holiday Blocks', icon: Calendar, desc: 'Global Closures' },
                                { id: 'slots', label: 'Recurring Blocks', icon: Ban, desc: 'Fixed Exclusions' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group border",
                                        activeTab === item.id
                                            ? "bg-zinc-900 border-zinc-800 shadow-inner"
                                            : "hover:bg-zinc-900/50 border-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2.5 rounded-xl transition-all duration-500",
                                        activeTab === item.id
                                            ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110"
                                            : "bg-zinc-900 text-zinc-600 group-hover:text-amber-500 border border-zinc-800"
                                    )}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-tight",
                                            activeTab === item.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                        )}>
                                            {item.label}
                                        </p>
                                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-9 space-y-6">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] min-h-[500px]">
                        {/* Tab Content: Working Hours */}
                        {activeTab === 'hours' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
                                    <div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Studio Matrix</h2>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Operational window definitions</p>
                                    </div>
                                    <div className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl">
                                        <Building2 size={24} />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                                        <div className="relative h-12 w-12 text-amber-500">
                                            <Zap size={48} className="animate-pulse-slow fill-current opacity-20 absolute inset-0" />
                                            <div className="absolute inset-0 border-b-2 border-amber-500 rounded-full animate-spin"></div>
                                        </div>
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Hydrating Temporal Matrix...</p>
                                    </div>
                                ) : workingHours.length === 0 ? (
                                    <div className="p-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-zinc-900 rounded-[32px] flex items-center justify-center mx-auto text-zinc-700 border border-zinc-800 shadow-inner">
                                            <Settings2 size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Null Registry</h3>
                                            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest max-w-sm mx-auto">This node has no operational definitions. Initialize base schedule to continue.</p>
                                        </div>
                                        <button
                                            onClick={handleInitializeHours}
                                            disabled={saving}
                                            className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-white/5 transition-all active:scale-95 flex items-center gap-2 mx-auto disabled:opacity-50"
                                        >
                                            {saving ? <div className="h-4 w-4 border-2 border-zinc-300 border-t-black animate-spin rounded-full"></div> : <Plus size={16} />}
                                            {saving ? 'UPDATING...' : 'Initialize Registry'}
                                        </button>
                                        {error && <p className="text-red-500 text-[10px] font-black uppercase bg-red-500/5 p-4 rounded-2xl border border-red-500/10 max-w-md mx-auto">{error}</p>}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto p-4 custom-scrollbar">
                                        <table className="w-full text-left border-separate border-spacing-y-3">
                                            <thead className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                                                <tr>
                                                    <th className="px-6 py-4">Rotation Day</th>
                                                    <th className="px-6 py-4">Status Node</th>
                                                    <th className="px-6 py-4">Active Window</th>
                                                    <th className="px-6 py-4 text-right">Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm font-bold">
                                                {workingHours.map((hour) => (
                                                    <tr key={hour.id} className="group transition-all">
                                                        <td className="px-6 py-5 bg-zinc-900/30 rounded-l-[24px] border-y border-l border-zinc-900/50">
                                                            <span className="font-black text-white uppercase tracking-tighter text-sm lg:text-base">{DAYS[hour.day_of_week]}</span>
                                                        </td>
                                                        <td className="px-6 py-5 bg-zinc-900/30 border-y border-zinc-900/50">
                                                            {hour.is_closed ? (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-zinc-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-900">
                                                                    <Lock size={12} /> Restricted
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                                    <Unlock size={12} /> Operational
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 bg-zinc-900/30 border-y border-zinc-900/50 font-mono text-zinc-400">
                                                            {!hour.is_closed ? (
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-white font-black lg:text-base">{formatTime(hour.start_time)}</span>
                                                                    <span className="text-zinc-800">—</span>
                                                                    <span className="text-white font-black lg:text-base">{formatTime(hour.end_time)}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-zinc-800 font-black italic tracking-widest">LOCKED</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 bg-zinc-900/30 rounded-r-[24px] border-y border-r border-zinc-900/50 text-right">
                                                            <button
                                                                onClick={() => { setEditingHour(hour); setIsEditHourOpen(true); }}
                                                                className="h-10 w-10 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-amber-500 hover:border-amber-500/30 rounded-xl transition-all shadow-lg flex items-center justify-center ml-auto"
                                                            >
                                                                <Edit3 size={16} />
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
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Holiday Matrix</h2>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Global operational shutdowns</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddDateOpen(true)}
                                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/5 transition-all active:scale-95 hover:bg-zinc-200"
                                    >
                                        <Plus size={16} /> Add Global Block
                                    </button>
                                </div>

                                {blockedDates.length === 0 ? (
                                    <div className="text-center py-24 bg-zinc-900/30 rounded-[32px] border-2 border-dashed border-zinc-900">
                                        <Calendar className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                                        <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No active global blocks detected</p>
                                        <button onClick={() => setIsAddDateOpen(true)} className="text-amber-500 text-[10px] font-black mt-4 uppercase tracking-widest hover:text-amber-400 transition-colors">Initiate Closure</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {blockedDates.map(d => (
                                            <div key={d.id} className="group p-6 bg-zinc-900/50 border border-zinc-900 rounded-[32px] flex items-center justify-between hover:bg-zinc-900 transition-all shadow-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-amber-500 border border-zinc-800 shadow-inner group-hover:bg-amber-500 group-hover:text-black transition-all">
                                                        <Calendar size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-lg tracking-tighter uppercase">
                                                            {new Date(d.blocked_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{d.reason || 'General Exclusion'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBlockedDate(d.id)}
                                                    className="p-3 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
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
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Slot Exclusions</h2>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Room-specific recurring restrictions</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddSlotOpen(true)}
                                        className="flex items-center gap-2 bg-amber-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all active:scale-95 hover:bg-amber-400"
                                    >
                                        <Plus size={16} /> Block recurring window
                                    </button>
                                </div>

                                {blockedSlots.length === 0 ? (
                                    <div className="text-center py-24 bg-zinc-900/30 rounded-[32px] border-2 border-dashed border-zinc-900">
                                        <Clock className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                                        <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No recurring exclusions active</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {blockedSlots.map(s => (
                                            <div key={s.id} className="group p-6 bg-zinc-900/50 border border-zinc-900 rounded-[32px] flex items-center justify-between hover:bg-zinc-900 transition-all shadow-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-amber-500 border border-zinc-800 shadow-inner group-hover:bg-amber-500 group-hover:text-black transition-all">
                                                        <Ban size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-lg tracking-tighter uppercase">
                                                            {DAYS[s.day_of_week]} <span className="text-zinc-500">@</span> {formatTime(s.slot_time)}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{s.reason || 'Recurring closure'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBlockedSlot(s.id)}
                                                    className="p-3 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
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

            {isEditHourOpen && editingHour && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 transition-all animate-in fade-in duration-300">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Edit Slot</h3>
                                <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em]">{DAYS[editingHour.day_of_week]}</p>
                            </div>
                            <button onClick={() => setIsEditHourOpen(false)} className="h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-white bg-zinc-900 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-8">
                            {/* Toggle Closed */}
                            <div className="flex items-center justify-between p-6 bg-zinc-900/50 rounded-3xl border border-zinc-900">
                                <div>
                                    <p className="font-black text-sm text-white uppercase tracking-tight">Temporal lockout</p>
                                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">Restrict entire day</p>
                                </div>
                                <button
                                    onClick={() => setEditingHour({ ...editingHour, is_closed: !editingHour.is_closed })}
                                    className={cn(
                                        "relative w-14 h-8 rounded-full transition-all duration-500",
                                        editingHour.is_closed ? "bg-amber-500 shadow-lg shadow-amber-500/20" : "bg-zinc-800"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-500",
                                        editingHour.is_closed ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            {!editingHour.is_closed && (
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Start Time Section */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Daily Opening Window</p>
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
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white font-black text-lg appearance-none focus:ring-1 ring-amber-500/50 outline-none transition-all"
                                                    >
                                                        {pick.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
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

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase text-red-500 tracking-widest text-center">
                                        Update Error: {error}
                                    </p>
                                </div>
                            )}

                            <div className="pt-6">
                                <button
                                    onClick={handleSaveWorkingHour}
                                    disabled={saving}
                                    className="w-full bg-white text-black py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-white/5 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <div className="h-4 w-4 border-2 border-zinc-400 border-t-black animate-spin rounded-full"></div> : <Save size={16} />}
                                    {saving ? 'UPDATING...' : 'COMMIT CHANGES'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAddDateOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 transition-all animate-in fade-in duration-300">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Global Block</h3>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Temporal exclusion</p>
                            </div>
                            <button onClick={() => setIsAddDateOpen(false)} className="h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-white bg-zinc-900 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Target Date</label>
                                <input
                                    type="date"
                                    value={newBlockedDate.date}
                                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-900 rounded-2xl p-5 text-white font-black text-lg focus:ring-1 ring-amber-500/50 outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Logic / Reason</label>
                                <textarea
                                    placeholder="Maintenance / Holiday / Private Event"
                                    value={newBlockedDate.reason}
                                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-900 rounded-2xl p-5 text-sm text-zinc-400 min-h-[120px] focus:ring-1 ring-amber-500/50 outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleAddBlockedDate}
                                disabled={saving || !newBlockedDate.date}
                                className="w-full bg-white text-black py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-white/5 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? 'SYNCING...' : 'COMMIT EXCLUSION'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddSlotOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 transition-all animate-in fade-in duration-300">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Recurring Block</h3>
                                <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Fixed Studio Closure</p>
                            </div>
                            <button onClick={() => setIsAddSlotOpen(false)} className="h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-white bg-zinc-900 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Rotation Day</label>
                                <div className="relative">
                                    <select
                                        value={newBlockedSlot.day}
                                        onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, day: parseInt(e.target.value) })}
                                        className="w-full bg-zinc-900 border border-zinc-900 rounded-2xl p-5 text-white font-black text-lg appearance-none focus:ring-1 ring-amber-500/50 outline-none transition-all"
                                    >
                                        {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Exclusion Time</p>
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
                                                className="w-full bg-zinc-900 border border-zinc-900 rounded-2xl p-5 text-white font-black text-lg appearance-none cursor-pointer focus:ring-1 ring-amber-500/50 outline-none transition-all"
                                            >
                                                {pick.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Restriction Reason</label>
                                <input
                                    type="text"
                                    placeholder="Weekly Maintenance / Reserved Window"
                                    value={newBlockedSlot.reason}
                                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, reason: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-900 rounded-2xl p-5 text-sm text-zinc-400 focus:ring-1 ring-amber-500/50 outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={handleAddBlockedSlot}
                                disabled={saving}
                                className="w-full bg-amber-500 text-black py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 hover:bg-amber-400"
                            >
                                {saving ? 'PROCESSING...' : 'APPLY EXCLUSION'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
