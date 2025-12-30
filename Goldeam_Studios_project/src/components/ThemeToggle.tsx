import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-zinc-900/50 dark:bg-zinc-800/50 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 group overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className="relative z-10">
                {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-500 group-hover:rotate-90 transition-transform duration-500" />
                ) : (
                    <Moon className="h-5 w-5 text-amber-600 group-hover:-rotate-12 transition-transform duration-500" />
                )}
            </div>

            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
    );
}
