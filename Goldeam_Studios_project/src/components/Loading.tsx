import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
                <p className="text-gray-400 animate-pulse">Loading Studio...</p>
            </div>
        </div>
    );
}
