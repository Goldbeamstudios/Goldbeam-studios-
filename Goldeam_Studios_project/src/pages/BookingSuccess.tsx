import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Mail, ArrowRight } from 'lucide-react';

export default function BookingSuccess() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex items-center justify-center pt-24 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="bg-amber-500/10 p-6 rounded-full border border-amber-500/20 animate-bounce">
                        <CheckCircle2 className="h-20 w-20 text-amber-500" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black uppercase mb-6">
                    Booking <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                        Confirmed
                    </span>
                </h1>

                <p className="text-xl text-zinc-600 dark:text-gray-400 mb-12 leading-relaxed max-w-lg mx-auto">
                    Your session at Goldbeam Studios has been successfully scheduled.
                    A confirmation email with all details has been sent to you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 text-left shadow-lg shadow-zinc-200/50 dark:shadow-none">
                        <div className="bg-amber-500/10 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase">What's Next?</p>
                            <p className="text-sm text-zinc-600 dark:text-gray-300">Prepare your script & assets</p>
                        </div>
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 text-left shadow-lg shadow-zinc-200/50 dark:shadow-none">
                        <div className="bg-amber-500/10 p-3 rounded-xl">
                            <Mail className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase">Check Inbox</p>
                            <p className="text-sm text-zinc-600 dark:text-gray-300">View confirmation details</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="bg-zinc-900 text-white dark:bg-white dark:text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        Return Home
                    </Link>
                    <Link
                        to="/location-parking"
                        className="border-2 border-amber-500 text-amber-500 px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                        Location Info <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
