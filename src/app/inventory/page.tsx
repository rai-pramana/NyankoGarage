'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StockAdjustmentModal } from '@/components/ui';
import api from '@/lib/api';

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
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'low' | 'movements'>('all');
    const [adjustingProduct, setAdjustingProduct] = useState<InventoryItem | null>(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/inventory');
            setInventory(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    const lowStockItems = filteredInventory.filter(item => item.isLowStock);

    const displayItems = activeTab === 'low' ? lowStockItems : filteredInventory;

    // Stats
    const totalItems = inventory.reduce((sum, i) => sum + i.quantity, 0);
    const totalValue = inventory.reduce((sum, i) => sum + i.quantity * 50, 0); // Rough estimate
    const lowStockCount = inventory.filter(i => i.isLowStock).length;

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Inventory</h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor stock levels and manage adjustments.</p>
                </div>
                <button
                    onClick={() => {
                        if (inventory.length > 0) {
                            setAdjustingProduct(inventory[0]);
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20"
                >
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                    Stock Adjustment
                </button>
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
                    <p className="text-2xl font-bold text-white mt-2">{totalItems.toLocaleString()}</p>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Estimated Value</span>
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
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-[#7c3bed] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    All Stock
                </button>
                <button
                    onClick={() => setActiveTab('low')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'low' ? 'bg-[#7c3bed] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Low Stock ({lowStockCount})
                </button>
                <button
                    onClick={() => setActiveTab('movements')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'movements' ? 'bg-[#7c3bed] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Movement History
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-800 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                />
            </div>

            {/* Inventory Table */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">
                        <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Loading inventory...</p>
                    </div>
                ) : activeTab === 'movements' ? (
                    <div className="p-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-5xl mb-3 block">history</span>
                        <p className="text-lg font-medium text-white mb-1">Movement History</p>
                        <p className="text-sm">Track all stock changes here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4 text-right">Quantity</th>
                                    <th className="px-6 py-4 text-right">Reserved</th>
                                    <th className="px-6 py-4 text-right">Available</th>
                                    <th className="px-6 py-4">Last Movement</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {displayItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
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
                                                        <p className="text-slate-400 text-xs">{item.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-400">{item.sku}</td>
                                            <td className={`px-6 py-4 text-right font-medium ${item.isLowStock ? 'text-amber-400' : 'text-white'}`}>
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400">{item.reservedQty}</td>
                                            <td className="px-6 py-4 text-right text-white font-medium">{item.available}</td>
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
                )}
            </div>

            {/* Stock Adjustment Modal */}
            <StockAdjustmentModal
                isOpen={!!adjustingProduct}
                onClose={() => setAdjustingProduct(null)}
                onSuccess={fetchInventory}
                product={adjustingProduct}
            />
        </DashboardLayout>
    );
}
