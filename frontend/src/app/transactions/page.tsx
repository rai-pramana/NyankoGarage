'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { TransactionFormModal, TransactionActions, TransactionDetailModal } from '@/components/ui';
import api from '@/lib/api';
import { useTransactionSocket } from '@/hooks/useSocket';

interface Transaction {
    id: string;
    code: string;
    type: 'SALE' | 'PURCHASE';
    status: 'DRAFT' | 'COMPLETED' | 'CANCELED';
    customerName?: string;
    supplierName?: string;
    totalAmount: number;
    createdAt: string;
    items?: { length: number };
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function TransactionsPageContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(initialSearch);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [viewingTransactionId, setViewingTransactionId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Summary stats from backend
    const [summaryStats, setSummaryStats] = useState({
        totalSales: 0,
        totalPurchases: 0,
        pendingCount: 0,
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync search from URL when it changes (for same-page navigation)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== search) {
            setSearch(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchTransactions();
    }, [page, limit, typeFilter, statusFilter]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchTransactions();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Refetch when tab becomes visible (after being hidden for 30+ seconds)
    const fetchRef = useRef<() => void>(() => { });
    const hiddenAtRef = useRef<number | null>(null);

    useEffect(() => {
        fetchRef.current = fetchTransactions;
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
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (typeFilter) params.append('type', typeFilter);
            if (statusFilter) params.append('status', statusFilter);

            const response = await api.get(`/transactions?${params.toString()}`);
            setTransactions(response.data.data || []);
            if (response.data.meta) {
                setTotalItems(response.data.meta.total || 0);
            }
            if (response.data.summary) {
                setSummaryStats(response.data.summary);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Real-time updates via WebSocket
    useTransactionSocket(fetchTransactions);

    // No client-side filtering - backend handles everything
    const displayTransactions = transactions;

    // Pagination from backend
    const totalPages = Math.ceil(totalItems / limit);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'CONFIRMED': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'DRAFT': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'CANCELED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    // Stats from backend (reflects all filtered items)
    const totalSales = summaryStats.totalSales;
    const totalPurchases = summaryStats.totalPurchases;
    const pendingCount = summaryStats.pendingCount;

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Transactions</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage sales and purchase transactions.</p>
                </div>
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Transaction
                        <span className={`material-symbols-outlined text-[18px] transition-transform ${showDropdown ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-20">
                            <button
                                onClick={() => {
                                    setShowSaleModal(true);
                                    setShowDropdown(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-800 text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-emerald-400">trending_up</span>
                                <span className="text-sm font-medium">New Sale</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowPurchaseModal(true);
                                    setShowDropdown(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-800 text-white transition-colors border-t border-slate-700"
                            >
                                <span className="material-symbols-outlined text-rose-400">trending_down</span>
                                <span className="text-sm font-medium">New Purchase</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Total Sales</span>
                        <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">${totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Total Purchases</span>
                        <div className="size-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                            <span className="material-symbols-outlined">trending_down</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-rose-400 mt-2">${totalPurchases.toLocaleString()}</p>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Pending</span>
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <span className="material-symbols-outlined">pending</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mt-2">{pendingCount}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px] max-w-md relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search by code, customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm"
                    >
                        <option value="">All Types</option>
                        <option value="SALE">Sale</option>
                        <option value="PURCHASE">Purchase</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="DRAFT">Draft</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELED">Canceled</option>
                    </select>
                    {(typeFilter || statusFilter || search) && (
                        <button
                            onClick={() => {
                                setTypeFilter('');
                                setStatusFilter('');
                                setSearch('');
                                setPage(1);
                            }}
                            className="px-3 py-2.5 text-slate-400 hover:text-white text-sm flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">
                        <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Loading transactions...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Party</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {displayTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    displayTransactions.map((txn: Transaction) => (
                                        <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-[#7c3bed] font-medium">{txn.code}</td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 ${txn.type === 'SALE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    <div className={`size-6 rounded ${txn.type === 'SALE' ? 'bg-emerald-400/10' : 'bg-rose-400/10'} flex items-center justify-center`}>
                                                        <span className="material-symbols-outlined text-[16px]">
                                                            {txn.type === 'SALE' ? 'arrow_upward' : 'arrow_downward'}
                                                        </span>
                                                    </div>
                                                    <span className="text-white">{txn.type === 'SALE' ? 'Sale' : 'Purchase'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-white">{txn.customerName || txn.supplierName || '-'}</td>
                                            <td className="px-6 py-4 text-white text-right font-medium">${Number(txn.totalAmount).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyle(txn.status)}`}>
                                                    {txn.status.toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(txn.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <TransactionActions
                                                    transaction={txn}
                                                    onUpdate={fetchTransactions}
                                                    onViewDetails={setViewingTransactionId}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer with Pagination */}
                <div className="border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">Rows per page:</span>
                        <select
                            value={limit >= 1000 ? 'all' : limit}
                            onChange={(e) => {
                                const newLimit = e.target.value === 'all' ? 1000 : parseInt(e.target.value);
                                setLimit(newLimit);
                            }}
                            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer"
                        >
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                            <option value="all">All</option>
                        </select>
                        <p className="text-sm text-slate-400">
                            Showing <span className="text-white font-medium">{displayTransactions.length}</span> of{' '}
                            <span className="text-white font-medium">{totalItems}</span> transactions
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-400">
                            Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages || 1}</span>
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* New Sale Modal */}
            <TransactionFormModal
                isOpen={showSaleModal}
                onClose={() => setShowSaleModal(false)}
                onSuccess={fetchTransactions}
                type="SALE"
            />

            {/* New Purchase Modal */}
            <TransactionFormModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onSuccess={fetchTransactions}
                type="PURCHASE"
            />

            {/* Transaction Detail Modal */}
            <TransactionDetailModal
                isOpen={!!viewingTransactionId}
                onClose={() => setViewingTransactionId(null)}
                transactionId={viewingTransactionId}
            />
        </DashboardLayout>
    );
}

export default function TransactionsPage() {
    return (
        <Suspense fallback={
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c3bed]"></div>
                </div>
            </DashboardLayout>
        }>
            <TransactionsPageContent />
        </Suspense>
    );
}
