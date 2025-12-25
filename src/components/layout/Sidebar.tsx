'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/products', label: 'Products', icon: 'inventory_2' },
    { href: '/inventory', label: 'Inventory', icon: 'dataset' },
    { href: '/transactions', label: 'Transactions', icon: 'receipt_long' },
    { href: '/reports', label: 'Reports', icon: 'bar_chart' },
];

const adminMenuItems = [
    { href: '/users', label: 'Users', icon: 'group' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const isAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      fixed lg:static inset-y-0 left-0 z-40
      flex flex-col w-64 
      border-r border-slate-200 dark:border-[#312447] 
      bg-white dark:bg-[#111827]
      transition-transform duration-300 ease-in-out
      lg:translate-x-0
    `}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6">
                <div className="size-10 rounded-xl bg-[#7c3bed] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-[24px]">warehouse</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                        NyankoGarage
                    </h1>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Warehouse OS</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 gap-2 flex flex-col">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                ${isActive
                                    ? 'bg-[#7c3bed]/10 text-[#7c3bed]'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }
              `}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <>
                        <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
                        <span className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Admin
                        </span>
                        {adminMenuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                    ${isActive
                                            ? 'bg-[#7c3bed]/10 text-[#7c3bed]'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }
                  `}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                {user && (
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="size-10 rounded-full bg-[#7c3bed]/20 flex items-center justify-center text-[#7c3bed] font-bold text-sm">
                            {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {user.fullName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {user.role?.toLowerCase()}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
