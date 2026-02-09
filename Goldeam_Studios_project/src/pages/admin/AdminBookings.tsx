import { useState, useEffect, memo } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Search,
    Clock,
    XCircle,
    Mail,
    Trash2,
    Calendar as CalendarIcon,
    RefreshCcw,
    Send,
    Eye,
    Phone,
    Check,
    User
} from 'lucide-react';
import { formatTime } from '../../lib/utils';
import ConfirmDialog from '../../components/ConfirmDialog';

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface Booking {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    plan_type: string;
    studio: string;
    theme?: string;
    addons: string[];
    booking_date: string;
    start_time: string;
    duration_hours: number;
    status: BookingStatus;
    total_price: number;
    admin_notes: string;
    stripe_session_id?: string;
    stripe_payment_intent_id?: string;
    created_at: string;
}

const STATUS_COLORS: Record<BookingStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('appointments')
                .select('*')
                .order('booking_date', { ascending: false });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
            if (selectedBooking?.id === id) {
                setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDeleteBooking = async (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Booking',
            message: 'Are you sure you want to permanently delete this booking? This action cannot be undone and will remove the record from your management hub.',
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('appointments')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    setBookings(prev => prev.filter(b => b.id !== id));
                    setSelectedIds(prev => prev.filter(itemId => itemId !== id));
                    if (selectedBooking?.id === id) setSelectedBooking(null);
                } catch (err) {
                    console.error('Error deleting:', err);
                }
            }
        });
    };

    const deleteBulk = async () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Bulk Delete',
            message: `Are you sure you want to delete ${selectedIds.length} select bookings? This will permanently erase these records from the database.`,
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('appointments')
                        .delete()
                        .in('id', selectedIds);

                    if (error) throw error;
                    setBookings(prev => prev.filter(b => !selectedIds.includes(b.id)));
                    setSelectedIds([]);
                } catch (err) {
                    console.error('Bulk delete error:', err);
                }
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredBookings.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredBookings.map(b => b.id));
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSendReminder = async (booking: Booking) => {
        setIsUpdating(true);
        try {
            const { error } = await supabase.functions.invoke('send-notification', {
                body: {
                    to: booking.customer_email,
                    template_name: 'booking_reminder',
                    appointment_id: booking.id,
                    variables: {
                        customer_name: booking.customer_name,
                        booking_date: booking.booking_date,
                        start_time: formatTime(booking.start_time),
                        studio: booking.studio,
                        duration: booking.duration_hours,
                        logo_url: 'https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/logo/GoldBeam_Logo_PNG_06.png'
                    }
                }
            });

            if (error) throw error;
            alert(`Automated reminder dispatched to ${booking.customer_name}`);
        } catch (err) {
            console.error('Error sending reminder:', err);
            alert('Notification engine failed. Please verify Edge Function status.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBulkReminders = async () => {
        if (selectedIds.length === 0) return;
        setIsUpdating(true);
        try {
            let successCount = 0;
            for (const id of selectedIds) {
                const booking = bookings.find(b => b.id === id);
                if (booking) {
                    const { error } = await supabase.functions.invoke('send-notification', {
                        body: {
                            to: booking.customer_email,
                            template_name: 'booking_reminder',
                            appointment_id: booking.id,
                            variables: {
                                customer_name: booking.customer_name,
                                booking_date: booking.booking_date,
                                start_time: formatTime(booking.start_time),
                                studio: booking.studio,
                                duration: booking.duration_hours,
                                logo_url: 'https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/logo/GoldBeam_Logo_PNG_06.png'
                            }
                        }
                    });
                    if (!error) successCount++;
                }
            }
            alert(`Batch complete: ${successCount} reminders successfully transmitted.`);
            setSelectedIds([]);
        } catch (err) {
            console.error('Bulk reminder error:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter sm:text-3xl">Booking Management</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Found {filteredBookings.length} records</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search names/emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:ring-1 ring-amber-500/50 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-400 focus:ring-1 ring-amber-500/50 outline-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Header */}
            {selectedIds.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500 text-black px-2 py-1 rounded text-[10px] font-black">{selectedIds.length} SELECTED</div>
                        <span className="text-xs font-bold text-amber-500/80 uppercase">Manage bulk operations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBulkReminders}
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-black text-zinc-300 hover:text-white transition-all uppercase disabled:opacity-50"
                        >
                            <Send size={14} className="text-amber-500" /> {isUpdating ? 'Sending...' : 'Remind All'}
                        </button>
                        <button
                            onClick={deleteBulk}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-black text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase"
                        >
                            <Trash2 size={14} /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Selection Info */}
            {filteredBookings.length > 0 && (
                <div className="flex items-center gap-3 px-1">
                    <input
                        type="checkbox"
                        checked={selectedIds.length === filteredBookings.length && filteredBookings.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest cursor-pointer select-none">Select all bookings</label>
                </div>
            )}

            {/* Main List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <RefreshCcw className="h-8 w-8 animate-spin text-amber-500" />
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Hydrating data registry...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl p-24 text-center">
                    <CalendarIcon className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                    <h3 className="text-white font-black text-lg uppercase">Registry Empty</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">No bookings found for current criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="group bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-black/50">
                            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                                {/* Checkbox & Identity */}
                                <div className="flex items-start gap-4 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(booking.id)}
                                        onChange={() => toggleSelection(booking.id)}
                                        className="mt-1 w-4 h-4 rounded border-zinc-800 bg-zinc-800 text-amber-500 focus:ring-0"
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{booking.customer_name}</h3>
                                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${STATUS_COLORS[booking.status]}`}>
                                                {booking.status}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500 text-xs font-medium">
                                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-amber-500" /> {booking.customer_email}</span>
                                            {booking.customer_phone && (
                                                <span className="flex items-center gap-1.5"><Phone size={12} className="text-amber-500" /> {booking.customer_phone}</span>
                                            )}
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-800 rounded text-[10px] uppercase font-black text-zinc-400">ID: {booking.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-[2] text-xs">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Schedule</p>
                                        <div className="flex items-center gap-2 font-bold text-zinc-300">
                                            <CalendarIcon size={12} className="text-amber-500" /> {booking.booking_date}
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-zinc-400">
                                            <Clock size={12} /> {formatTime(booking.start_time)}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-center sm:text-left">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Allocation</p>
                                        <p className="font-black text-amber-500 uppercase tracking-tight">Studio {booking.studio}</p>
                                        <p className="font-bold text-zinc-500 uppercase tracking-tighter">Plan: {booking.plan_type.replace('_', ' ')}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Add-ons</p>
                                        <div className="flex flex-wrap gap-1">
                                            {booking.addons && booking.addons.length > 0 ? (
                                                booking.addons.map((a, i) => (
                                                    <span key={i} className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-bold border border-zinc-700/50 truncate max-w-[80px]">
                                                        {a.replace('_', ' ')}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-zinc-700 italic">None</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-right sm:text-left">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Revenue</p>
                                        <p className="text-base font-black text-white">${Number(booking.total_price).toFixed(2)}</p>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase italic">Paid: confirmed</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-none border-zinc-800">
                                    <button
                                        onClick={() => setSelectedBooking(booking)}
                                        className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>

                                    <select
                                        value={booking.status}
                                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value as BookingStatus)}
                                        className="bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-[10px] font-black uppercase text-zinc-300 outline-none hover:border-amber-500/50 transition-all cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    <button
                                        onClick={() => handleSendReminder(booking)}
                                        disabled={isUpdating}
                                        className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-amber-500 rounded-lg transition-all disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                    </button>

                                    <div className="h-6 w-[1] bg-zinc-800 mx-1"></div>

                                    <button
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Dialog (Modal Alternative) */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
                    <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-zinc-900 flex justify-between items-start">
                            <div>
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Detailed Log Record</div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedBooking.customer_name}</h2>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-600 hover:text-white transition-all">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left: Identity & Contact */}
                            <div className="space-y-8">
                                <section>
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4 border-b border-zinc-900 pb-2">Client Context</label>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group">
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-500 border border-zinc-800">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-600 uppercase">Entity Name</p>
                                                <p className="text-white font-bold">{selectedBooking.customer_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-500 border border-zinc-800">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-600 uppercase">Communications</p>
                                                <p className="text-white font-bold">{selectedBooking.customer_email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-500 border border-zinc-800">
                                                <Phone size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-zinc-600 uppercase">Phone Communications</p>
                                                {selectedBooking.customer_phone ? (
                                                    <a
                                                        href={`tel:${selectedBooking.customer_phone}`}
                                                        className="text-white font-bold hover:text-amber-500 transition-colors"
                                                    >
                                                        {selectedBooking.customer_phone}
                                                    </a>
                                                ) : (
                                                    <p className="text-zinc-500 font-bold uppercase text-[10px]">No Phone Provided</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4 border-b border-zinc-900 pb-2">Professional Services</label>
                                    <div className="space-y-2">
                                        <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex justify-between items-center group">
                                            <span className="text-xs font-black text-zinc-400 uppercase tracking-tight group-hover:text-white transition-colors">Core Plan</span>
                                            <span className="text-xs font-black text-amber-500 uppercase">{selectedBooking.plan_type.replace('_', ' + ')}</span>
                                        </div>
                                        {selectedBooking.addons.map((addon, idx) => (
                                            <div key={idx} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex justify-between items-center group">
                                                <span className="text-xs font-black text-zinc-400 uppercase tracking-tight group-hover:text-white transition-colors">{addon.replace('_', ' ')}</span>
                                                <Check size={14} className="text-zinc-600" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right: Technicals & Ledger */}
                            <div className="space-y-8 text-right lg:text-left">
                                <section>
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4 border-b border-zinc-900 pb-2">Session Technicals</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Studio</p>
                                            <p className="text-xl font-black text-white tracking-widest uppercase">{selectedBooking.studio}</p>
                                        </div>
                                        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Duration</p>
                                            <p className="text-xl font-black text-white tracking-widest uppercase">{selectedBooking.duration_hours}H</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-5 bg-amber-500 text-black rounded-2xl border border-amber-600 text-center">
                                        <p className="text-[9px] font-black uppercase opacity-60 mb-1">Visual Theme</p>
                                        <p className="text-lg font-black uppercase tracking-tight">{selectedBooking.theme || 'Neutral Signature'}</p>
                                    </div>
                                </section>

                                <section>
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-4 border-b border-zinc-900 pb-2">Transaction Ledger</label>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase">Gross Revenue</p>
                                            <p className="text-3xl font-black text-white">${Number(selectedBooking.total_price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-zinc-900/30 border-t border-zinc-900 flex justify-end items-center gap-3">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="px-6 py-3 rounded-xl text-xs font-black text-zinc-500 uppercase hover:text-white transition-all"
                            >
                                Close Entry
                            </button>
                            <button
                                onClick={() => handleSendReminder(selectedBooking)}
                                disabled={isUpdating}
                                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50"
                            >
                                <Send size={14} /> {isUpdating ? 'Sending...' : 'Send Reminder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
            />
        </div>
    );
};

export default memo(AdminBookings);
