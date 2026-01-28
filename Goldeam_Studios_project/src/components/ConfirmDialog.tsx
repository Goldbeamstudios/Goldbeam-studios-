import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Glow Effect */}
                <div className={cn(
                    "absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20",
                    variant === 'danger' ? "bg-red-500" : "bg-amber-500"
                )} />

                <div className="p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center pt-4">
                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                            variant === 'danger' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                            <AlertTriangle size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8 px-4">
                            {message}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 rounded-2xl bg-zinc-900 text-zinc-300 font-bold text-sm hover:bg-zinc-800 hover:text-white transition-all active:scale-[0.98]"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={cn(
                                    "flex-1 px-6 py-3.5 rounded-2xl font-bold text-sm text-black transition-all active:scale-[0.98] shadow-lg",
                                    variant === 'danger'
                                        ? "bg-red-500 hover:bg-red-400 shadow-red-500/20"
                                        : "bg-amber-500 hover:bg-amber-400 shadow-amber-500/20"
                                )}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
