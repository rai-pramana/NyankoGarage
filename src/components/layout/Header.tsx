'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuthStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                {/* Search */}
                <div className="relative w-64 md:w-80">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">
                        search
                    </span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#7c3bed] text-slate-900 dark:text-white placeholder-slate-500"
                        placeholder="Search orders, items..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111827]" />
                    </button>
                </div>

                {/* User profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {user?.role?.toLowerCase() || 'Staff'}
                        </p>
                    </div>
                    <div
                        className="size-10 rounded-full bg-[#7c3bed]/20 flex items-center justify-center text-[#7c3bed] font-bold overflow-hidden cursor-pointer"
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                </div>
            </div>
        </header>
    );
}
