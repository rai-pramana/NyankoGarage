'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { StockAdjustmentModal } from '@/components/ui';
import api from '@/lib/api';

interface HeaderProps {
    onMenuClick?: () => void;
}

interface StockAlert {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    minStockLevel: number;
    alertType: 'low_stock' | 'out_of_stock';
}

interface SearchResult {
    id: string;
    type: 'product' | 'transaction';
    title: string;
    subtitle: string;
    icon: string;
    url: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [alerts, setAlerts] = useState<StockAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Stock adjustment modal state
    const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<StockAlert | null>(null);

    // Fetch stock alerts for notifications
    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard/low-stock-alerts');
            setAlerts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchAlerts();
    }, []);

    // Refetch when window gains focus (user returns to tab)
    useEffect(() => {
        const handleFocus = () => fetchAlerts();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Search functionality - debounced
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            setSearchLoading(true);
            setShowSearchResults(true);
            try {
                // Search products and transactions in parallel
                const [productsRes, transactionsRes] = await Promise.all([
                    api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`),
                    api.get(`/transactions?search=${encodeURIComponent(searchQuery)}&limit=5`),
                ]);

                const results: SearchResult[] = [];

                // Add products
                const products = productsRes.data.data || [];
                products.forEach((p: any) => {
                    results.push({
                        id: p.id,
                        type: 'product',
                        title: p.name,
                        subtitle: `SKU: ${p.sku} • ${p.category}`,
                        icon: 'inventory_2',
                        url: `/products?search=${encodeURIComponent(p.name)}`,
                    });
                });

                // Add transactions
                const transactions = transactionsRes.data.data || [];
                transactions.forEach((t: any) => {
                    results.push({
                        id: t.id,
                        type: 'transaction',
                        title: t.code,
                        subtitle: `${t.type} • ${t.customerName || t.supplierName || 'N/A'} • $${Number(t.totalAmount).toFixed(2)}`,
                        icon: t.type === 'SALE' ? 'arrow_upward' : 'arrow_downward',
                        url: `/transactions?search=${encodeURIComponent(t.code)}`,
                    });
                });

                setSearchResults(results);
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleAlertClick = (alert: StockAlert) => {
        setSelectedProduct(alert);
        setShowAdjustmentModal(true);
        setShowNotifications(false);
    };

    const handleSearchResultClick = (result: SearchResult) => {
        router.push(result.url);
        setShowSearchResults(false);
        setSearchQuery('');
    };

    const outOfStockCount = alerts.filter(a => a.alertType === 'out_of_stock').length;
    const lowStockCount = alerts.filter(a => a.alertType === 'low_stock').length;

    return (
        <>
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
                    <div className="relative w-64 md:w-80" ref={searchRef}>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">
                            search
                        </span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#7c3bed] text-slate-900 dark:text-white placeholder-slate-500"
                            placeholder="Search products, transactions..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                        />

                        {/* Search Results Dropdown */}
                        {showSearchResults && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                                {searchLoading ? (
                                    <div className="p-4 text-center text-slate-400">
                                        <div className="inline-block size-5 border-2 border-[#7c3bed] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="p-4 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-2xl mb-1">search_off</span>
                                        <p className="text-sm">No results found</p>
                                    </div>
                                ) : (
                                    <div className="max-h-80 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <div
                                                key={`${result.type}-${result.id}`}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800 last:border-b-0"
                                                onClick={() => handleSearchResultClick(result)}
                                            >
                                                <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${result.type === 'product'
                                                        ? 'bg-[#7c3bed]/10 text-[#7c3bed]'
                                                        : result.icon === 'arrow_upward'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : 'bg-rose-500/10 text-rose-400'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-[18px]">{result.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white font-medium truncate">{result.title}</p>
                                                    <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${result.type === 'product'
                                                        ? 'bg-[#7c3bed]/10 text-[#7c3bed]'
                                                        : 'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {result.type === 'product' ? 'Product' : 'Transaction'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => {
                                const opening = !showNotifications;
                                setShowNotifications(opening);
                                setShowProfile(false);
                                setShowSearchResults(false);
                                if (opening) fetchAlerts(); // Refresh when opening
                            }}
                            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            {alerts.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#111827]" />
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                                    <h4 className="font-semibold text-white">Stock Alerts</h4>
                                    {alerts.length > 0 && (
                                        <div className="flex gap-2">
                                            {outOfStockCount > 0 && (
                                                <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                                                    {outOfStockCount} out
                                                </span>
                                            )}
                                            {lowStockCount > 0 && (
                                                <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
                                                    {lowStockCount} low
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 text-center text-slate-400">
                                            <div className="inline-block size-5 border-2 border-[#7c3bed] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : alerts.length === 0 ? (
                                        <div className="p-6 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-3xl mb-2 text-emerald-400">check_circle</span>
                                            <p className="text-sm">All stock levels are healthy!</p>
                                        </div>
                                    ) : (
                                        alerts.map((alert) => (
                                            <div
                                                key={alert.id}
                                                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800 last:border-b-0"
                                                onClick={() => handleAlertClick(alert)}
                                            >
                                                <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${alert.alertType === 'out_of_stock'
                                                        ? 'bg-red-500/10'
                                                        : 'bg-amber-500/10'
                                                    }`}>
                                                    <span className={`material-symbols-outlined text-[18px] ${alert.alertType === 'out_of_stock'
                                                            ? 'text-red-400'
                                                            : 'text-amber-400'
                                                        }`}>
                                                        {alert.alertType === 'out_of_stock' ? 'error' : 'warning'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white font-medium truncate">{alert.name}</p>
                                                    <p className={`text-xs ${alert.alertType === 'out_of_stock'
                                                            ? 'text-red-400'
                                                            : 'text-slate-400'
                                                        }`}>
                                                        {alert.alertType === 'out_of_stock'
                                                            ? 'Out of stock!'
                                                            : `Low stock: ${alert.quantity}/${alert.minStockLevel} remaining`}
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-500 text-[18px]">chevron_right</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User profile */}
                    <div className="relative flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700" ref={profileRef}>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {user?.fullName || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {user?.role?.toLowerCase() || 'Staff'}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowProfile(!showProfile);
                                setShowNotifications(false);
                                setShowSearchResults(false);
                            }}
                            className="flex items-center gap-2"
                        >
                            <div className="size-10 rounded-full bg-[#7c3bed]/20 flex items-center justify-center text-[#7c3bed] font-bold overflow-hidden">
                                {user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                        </button>

                        {/* Profile Dropdown */}
                        {showProfile && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-slate-700">
                                    <p className="font-medium text-white">{user?.fullName}</p>
                                    <p className="text-sm text-slate-400">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            router.push('/settings');
                                            setShowProfile(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                        Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-red-400 hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Stock Adjustment Modal */}
            {selectedProduct && (
                <StockAdjustmentModal
                    isOpen={showAdjustmentModal}
                    onClose={() => {
                        setShowAdjustmentModal(false);
                        setSelectedProduct(null);
                    }}
                    product={{
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        sku: selectedProduct.sku,
                        quantity: selectedProduct.quantity,
                    }}
                    onSuccess={() => {
                        setShowAdjustmentModal(false);
                        setSelectedProduct(null);
                        // Refresh alerts
                        api.get('/dashboard/low-stock-alerts').then(res => setAlerts(res.data || []));
                        // Dispatch custom event so pages can refresh their data
                        window.dispatchEvent(new CustomEvent('stock-updated'));
                    }}
                />
            )}
        </>
    );
}
