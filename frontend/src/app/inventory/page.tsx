'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StockAdjustmentModal } from '@/components/ui';
import api from '@/lib/api';
import { useInventorySocket } from '@/hooks/useSocket';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    quantity: number;
    reservedQty: number;
    available: number;
    minStockLevel: number;
    isLowStock: boolean;
    lastMovementAt: string | null;
    costPrice?: number;
}

interface StockMovement {
    id: string;
    type: string;
    quantity: number;
    balanceAfter: number;
    notes: string | null;
    createdAt: string;
    product: { name: string; sku: string };
    user: { fullName: string };
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const CATEGORIES = ['Fluids', 'Brakes', 'Filters', 'Ignition', 'Electrical', 'Engine', 'Accessories', 'Other'];

function InventoryPageContent() {
    const searchParams = useSearchParams();
    const initialStockStatus = searchParams.get('stockStatus') || '';

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [movementsLoading, setMovementsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockStatusFilter, setStockStatusFilter] = useState(initialStockStatus);
    const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
    const [adjustingProduct, setAdjustingProduct] = useState<InventoryItem | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [movementsPage, setMovementsPage] = useState(1);
    const [movementsTotal, setMovementsTotal] = useState(0);

    // Summary stats from backend
    const [summaryStats, setSummaryStats] = useState({
        totalUnits: 0,
        totalValue: 0,
        lowStockCount: 0,
    });

    useEffect(() => {
        fetchInventory();
    }, [page, limit, categoryFilter, stockStatusFilter]);

    useEffect(() => {
        if (activeTab === 'movements') {
            fetchMovements();
        }
    }, [activeTab, movementsPage]);

    // Sync stockStatusFilter from URL when it changes (for same-page navigation)
    useEffect(() => {
        const urlStockStatus = searchParams.get('stockStatus') || '';
        if (urlStockStatus !== stockStatusFilter) {
            setStockStatusFilter(urlStockStatus);
        }
    }, [searchParams]);

    // Refetch when tab becomes visible (after 30+ seconds) or stock is updated
    const fetchInventoryRef = useRef<() => void>(() => { });
    const fetchMovementsRef = useRef<() => void>(() => { });
    const hiddenAtRef = useRef<number | null>(null);

    useEffect(() => {
        fetchInventoryRef.current = fetchInventory;
        fetchMovementsRef.current = fetchMovements;
    });

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                hiddenAtRef.current = Date.now();
            } else if (document.visibilityState === 'visible' && hiddenAtRef.current) {
                const hiddenDuration = Date.now() - hiddenAtRef.current;
                if (hiddenDuration > 30000) { // 30 seconds
                    fetchInventoryRef.current();
                    if (activeTab === 'movements') fetchMovementsRef.current();
                }
                hiddenAtRef.current = null;
            }
        };
        const handleStockUpdate = () => {
            fetchInventoryRef.current();
            if (activeTab === 'movements') fetchMovementsRef.current();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('stock-updated', handleStockUpdate);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('stock-updated', handleStockUpdate);
        };
    }, [activeTab]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (categoryFilter) params.append('category', categoryFilter);
            if (stockStatusFilter) params.append('stockStatus', stockStatusFilter);

            const response = await api.get(`/inventory?${params.toString()}`);
            setInventory(response.data.data || []);
            if (response.data.meta) {
                setTotalItems(response.data.meta.total || 0);
            }
            if (response.data.summary) {
                setSummaryStats(response.data.summary);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMovements = async () => {
        setMovementsLoading(true);
        try {
            const response = await api.get(`/inventory/movements?page=${movementsPage}&limit=20`);
            setMovements(response.data.data || []);
            if (response.data.meta) {
                setMovementsTotal(response.data.meta.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch movements:', error);
        } finally {
            setMovementsLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchInventory();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Real-time updates via WebSocket
    useInventorySocket(() => {
        fetchInventory();
        if (activeTab === 'movements') fetchMovements();
    });

    // No client-side filtering needed - backend handles everything
    const displayItems = inventory;

    // Stats from backend (reflects all filtered items, not just paginated)
    const totalUnits = summaryStats.totalUnits;
    const totalValue = summaryStats.totalValue;
    const lowStockCount = summaryStats.lowStockCount;

    const totalPages = Math.ceil(totalItems / limit);
    const movementsTotalPages = Math.ceil(movementsTotal / 20);

    const getMovementIcon = (type: string) => {
        switch (type) {
            case 'SALE_OUT': return { icon: 'arrow_upward', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
            case 'PURCHASE_IN': return { icon: 'arrow_downward', color: 'text-blue-400', bg: 'bg-blue-500/10' };
            case 'ADJUST': return { icon: 'tune', color: 'text-amber-400', bg: 'bg-amber-500/10' };
            case 'INIT': return { icon: 'add_circle', color: 'text-purple-400', bg: 'bg-purple-500/10' };
            case 'DAMAGE': return { icon: 'broken_image', color: 'text-red-400', bg: 'bg-red-500/10' };
            default: return { icon: 'swap_vert', color: 'text-slate-400', bg: 'bg-slate-500/10' };
        }
    };

    const formatMovementType = (type: string) => {
        switch (type) {
            case 'SALE_OUT': return 'Sale';
            case 'PURCHASE_IN': return 'Purchase';
            case 'ADJUST': return 'Adjustment';
            case 'INIT': return 'Initial Stock';
            case 'DAMAGE': return 'Damage';
            default: return type;
        }
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Inventory</h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor stock levels and manage adjustments.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Total Units</span>
                        <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{totalUnits.toLocaleString()}</p>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Inventory Value</span>
                        <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">${totalValue.toLocaleString()}</p>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Low Stock Items</span>
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mt-2">{lowStockCount}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#1e293b] p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'stock' ? 'bg-[#7c3bed] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Stock
                </button>
                <button
                    onClick={() => setActiveTab('movements')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'movements' ? 'bg-[#7c3bed] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Movement History
                </button>
            </div>

            {/* Filters (only for stock tab) */}
            {activeTab === 'stock' && (
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-800 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white text-sm"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={stockStatusFilter}
                        onChange={(e) => {
                            setStockStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                    {(categoryFilter || stockStatusFilter || search) && (
                        <button
                            onClick={() => {
                                setCategoryFilter('');
                                setStockStatusFilter('');
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
            )}

            {/* Content based on active tab */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800">
                {loading && activeTab === 'stock' ? (
                    <div className="p-8 text-center text-slate-400">
                        <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Loading inventory...</p>
                    </div>
                ) : activeTab === 'movements' ? (
                    // Movement History Table
                    <>
                        {movementsLoading ? (
                            <div className="p-8 text-center text-slate-400">
                                <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                                <p>Loading movements...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4 text-right">Quantity</th>
                                            <th className="px-6 py-4 text-right">Balance After</th>
                                            <th className="px-6 py-4">Notes</th>
                                            <th className="px-6 py-4">Performed By</th>
                                            <th className="px-6 py-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {movements.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                                                    No movement history found
                                                </td>
                                            </tr>
                                        ) : (
                                            movements.map((movement) => {
                                                const style = getMovementIcon(movement.type);
                                                return (
                                                    <tr key={movement.id} className="hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`size-8 rounded-lg ${style.bg} flex items-center justify-center ${style.color}`}>
                                                                    <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                                                                </div>
                                                                <span className="text-white font-medium">{formatMovementType(movement.type)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-white">{movement.product?.name || '-'}</p>
                                                            <p className="text-slate-400 text-xs font-mono">{movement.product?.sku || '-'}</p>
                                                        </td>
                                                        <td className={`px-6 py-4 text-right font-medium ${movement.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-white">{movement.balanceAfter}</td>
                                                        <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate">{movement.notes || '-'}</td>
                                                        <td className="px-6 py-4 text-slate-400">{movement.user?.fullName || 'System'}</td>
                                                        <td className="px-6 py-4 text-slate-400">
                                                            {new Date(movement.createdAt).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* Movements Pagination */}
                        <div className="border-t border-slate-800 p-4 flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                Showing <span className="text-white font-medium">{movements.length}</span> of{' '}
                                <span className="text-white font-medium">{movementsTotal}</span> movements
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setMovementsPage(p => Math.max(1, p - 1))}
                                    disabled={movementsPage <= 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-slate-400">
                                    Page <span className="text-white">{movementsPage}</span> of <span className="text-white">{movementsTotalPages || 1}</span>
                                </span>
                                <button
                                    onClick={() => setMovementsPage(p => Math.min(movementsTotalPages, p + 1))}
                                    disabled={movementsPage >= movementsTotalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Stock Inventory Table
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4 text-right">Quantity</th>
                                        <th className="px-6 py-4 text-right">Reserved</th>
                                        <th className="px-6 py-4 text-right">Available</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Last Movement</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {displayItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                                                No inventory items found
                                            </td>
                                        </tr>
                                    ) : (
                                        displayItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                                            <span className="material-symbols-outlined text-[20px]">package_2</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{item.name}</p>
                                                            <p className="text-slate-400 text-xs">{item.category || '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-400">{item.sku}</td>
                                                <td className={`px-6 py-4 text-right font-medium ${item.isLowStock ? 'text-amber-400' : 'text-white'}`}>
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-400">{item.reservedQty}</td>
                                                <td className="px-6 py-4 text-right text-white font-medium">{item.available}</td>
                                                <td className="px-6 py-4">
                                                    {item.quantity === 0 ? (
                                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                            Out of Stock
                                                        </span>
                                                    ) : item.isLowStock ? (
                                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">
                                                    {item.lastMovementAt ? new Date(item.lastMovementAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setAdjustingProduct(item)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="Adjust stock"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">tune</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Inventory Pagination */}
                        <div className="border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-400">Rows per page:</span>
                                <select
                                    value={limit >= 1000 ? 'all' : limit}
                                    onChange={(e) => {
                                        const newLimit = e.target.value === 'all' ? 1000 : parseInt(e.target.value);
                                        setLimit(newLimit);
                                        setPage(1);
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer"
                                >
                                    {PAGE_SIZE_OPTIONS.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                    <option value="all">All</option>
                                </select>
                                <p className="text-sm text-slate-400">
                                    Showing <span className="text-white font-medium">{displayItems.length}</span> of{' '}
                                    <span className="text-white font-medium">{totalItems}</span> items
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
                    </>
                )}
            </div>

            {/* Stock Adjustment Modal */}
            <StockAdjustmentModal
                isOpen={!!adjustingProduct}
                onClose={() => setAdjustingProduct(null)}
                onSuccess={() => {
                    fetchInventory();
                    if (activeTab === 'movements') {
                        fetchMovements();
                    }
                }}
                product={adjustingProduct}
            />
        </DashboardLayout>
    );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c3bed]"></div>
                </div>
            </DashboardLayout>
        }>
            <InventoryPageContent />
        </Suspense>
    );
}
