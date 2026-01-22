'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

interface DashboardStats {
    todayRevenue: number;
    revenueChange: number;
    todayOrders: number;
    totalProducts: number;
    lowStockCount: number;
}

interface RecentTransaction {
    id: string;
    code: string;
    type: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

interface LowStockItem {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    minStockLevel: number;
}

// Stat Card Component
function StatCard({
    title,
    value,
    change,
    changeType = 'positive',
    icon,
    loading = false
}: {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: string;
    loading?: boolean;
}) {
    const changeColors = {
        positive: 'text-emerald-400',
        negative: 'text-red-400',
        neutral: 'text-slate-400',
    };

    return (
        <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#1e293b] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-medium">{title}</span>
                <div className="size-10 rounded-lg bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed]">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
            <div className="flex items-end gap-2">
                {loading ? (
                    <div className="h-8 w-20 bg-slate-700 rounded animate-pulse" />
                ) : (
                    <>
                        <span className="text-3xl font-bold text-white">{value}</span>
                        {change && (
                            <span className={`text-sm font-medium ${changeColors[changeType]} flex items-center gap-1`}>
                                <span className="material-symbols-outlined text-[16px]">
                                    {changeType === 'positive' ? 'trending_up' : changeType === 'negative' ? 'trending_down' : 'remove'}
                                </span>
                                {change}
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Recent Transactions Table
function RecentTransactions({ transactions, loading }: { transactions: RecentTransaction[]; loading: boolean }) {
    const statusStyles: Record<string, string> = {
        COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        CONFIRMED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        CANCELED: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="font-semibold text-white">Recent Transactions</h3>
                <a href="/transactions" className="text-[#7c3bed] text-sm font-medium hover:underline">
                    View All
                </a>
            </div>
            {loading ? (
                <div className="p-8 text-center text-slate-400">
                    <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading transactions...</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
                    <p>No transactions yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Customer/Supplier</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-[#7c3bed] font-medium">{txn.code}</span>
                                    </td>
                                    <td className="px-4 py-3 text-white capitalize">{txn.type.toLowerCase()}</td>
                                    <td className="px-4 py-3 text-white">{txn.customerName}</td>
                                    <td className="px-4 py-3 text-white text-right font-medium">
                                        ${txn.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusStyles[txn.status] || statusStyles.DRAFT}`}>
                                            {txn.status.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{formatDate(txn.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// Low Stock Alerts
function LowStockAlerts({ alerts, loading }: { alerts: LowStockItem[]; loading: boolean }) {
    return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400">warning</span>
                    Low Stock Alerts
                </h3>
                <span className="bg-red-500/10 text-red-400 text-xs font-medium px-2 py-1 rounded-full">
                    {alerts.length} items
                </span>
            </div>
            {loading ? (
                <div className="p-8 text-center text-slate-400">
                    <div className="inline-block size-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : alerts.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 text-emerald-400">check_circle</span>
                    <p>All stock levels are healthy!</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-800">
                    {alerts.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                            <div>
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-slate-400 text-sm">{item.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${item.quantity <= 3 ? 'text-red-400' : 'text-amber-400'}`}>
                                    {item.quantity} / {item.minStockLevel}
                                </p>
                                <p className="text-slate-500 text-xs">in stock</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {alerts.length > 0 && (
                <div className="p-3 border-t border-slate-800">
                    <a
                        href="/inventory?stockStatus=low_stock"
                        className="flex items-center justify-center gap-1 text-sm text-[#7c3bed] hover:text-[#9b6bf0] font-medium transition-colors"
                    >
                        View All
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
    const [lowStockAlerts, setLowStockAlerts] = useState<LowStockItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Refetch when tab becomes visible (after 30+ seconds) or stock is updated
    const fetchRef = useRef<() => void>(() => { });
    const hiddenAtRef = useRef<number | null>(null);

    useEffect(() => {
        fetchRef.current = fetchDashboardData;
    });

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                hiddenAtRef.current = Date.now();
            } else if (document.visibilityState === 'visible' && hiddenAtRef.current) {
                const hiddenDuration = Date.now() - hiddenAtRef.current;
                if (hiddenDuration > 30000) { // 30 seconds
                    fetchRef.current();
                }
                hiddenAtRef.current = null;
            }
        };
        const handleStockUpdate = () => fetchRef.current();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('stock-updated', handleStockUpdate);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('stock-updated', handleStockUpdate);
        };
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, transactionsRes, alertsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/recent-transactions'),
                api.get('/dashboard/low-stock-alerts?limit=10'),
            ]);
            setStats(statsRes.data);
            setTransactions(transactionsRes.data);
            setLowStockAlerts(alertsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Today's Revenue"
                    value={stats ? formatCurrency(stats.todayRevenue) : '$0'}
                    change={stats && stats.revenueChange !== 0 ? `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%` : undefined}
                    changeType={stats && stats.revenueChange >= 0 ? 'positive' : 'negative'}
                    icon="payments"
                    loading={loading}
                />
                <StatCard
                    title="Orders Today"
                    value={stats ? stats.todayOrders.toString() : '0'}
                    icon="receipt_long"
                    loading={loading}
                />
                <StatCard
                    title="Products"
                    value={stats ? stats.totalProducts.toString() : '0'}
                    icon="inventory_2"
                    loading={loading}
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats ? stats.lowStockCount.toString() : '0'}
                    change={stats && stats.lowStockCount > 0 ? 'Needs attention' : undefined}
                    changeType="negative"
                    icon="warning"
                    loading={loading}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentTransactions transactions={transactions} loading={loading} />
                </div>
                <div>
                    <LowStockAlerts alerts={lowStockAlerts} loading={loading} />
                </div>
            </div>
        </DashboardLayout>
    );
}
