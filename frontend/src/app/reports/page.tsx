'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

type ReportType = 'sales' | 'inventory' | 'purchases' | 'profit' | 'activity' | null;

interface SalesReport {
    summary: { totalRevenue: number; totalOrders: number; totalItems: number; averageOrderValue: number };
    topProducts: { name: string; quantity: number; revenue: number }[];
    salesByDay: { date: string; amount: number }[];
    recentSales: { id: string; code: string; customerName: string; totalAmount: number; status: string; createdAt: string }[];
}

interface InventoryReport {
    summary: { totalProducts: number; totalUnits: number; totalValue: number; lowStockCount: number; outOfStockCount: number };
    byCategory: { category: string; count: number; value: number; units: number }[];
    items: { id: string; name: string; sku: string; category: string; quantity: number; stockValue: number; isLowStock: boolean }[];
}

interface PurchaseReport {
    summary: { totalSpent: number; totalOrders: number; totalItems: number; averageOrderValue: number };
    bySupplier: { supplier: string; count: number; total: number }[];
    recentPurchases: { id: string; code: string; supplierName: string; totalAmount: number; status: string; createdAt: string }[];
}

interface ProfitReport {
    summary: { totalRevenue: number; totalCost: number; grossProfit: number; grossMargin: number; totalPurchases: number; netProfit: number };
    salesCount: number;
    purchaseCount: number;
}

interface ActivityItem {
    id: string;
    type: string;
    action: string;
    description: string;
    user: string;
    createdAt: string;
}

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<ReportType>(null);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    // Date range filter
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const fetchReport = async (type: ReportType) => {
        if (!type) return;
        setLoading(true);
        try {
            let endpoint = `/reports/${type}`;
            if (type !== 'inventory' && type !== 'activity') {
                endpoint += `?startDate=${startDate}&endDate=${endDate}`;
            }
            if (type === 'activity') {
                endpoint += '?limit=50';
            }
            const response = await api.get(endpoint);
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (type: ReportType) => {
        setSelectedReport(type);
        setReportData(null);
    };

    useEffect(() => {
        if (selectedReport) {
            fetchReport(selectedReport);
        }
    }, [selectedReport, startDate, endDate]);

    const exportCSV = () => {
        if (!reportData) return;

        let csvContent = '';
        let filename = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`;

        if (selectedReport === 'sales' && reportData.allSales) {
            csvContent = 'Code,Customer,Amount,Status,Date\n';
            reportData.allSales.forEach((s: any) => {
                csvContent += `${s.code},${s.customerName || 'N/A'},${s.totalAmount},${s.status},${s.createdAt}\n`;
            });
        } else if (selectedReport === 'inventory' && reportData.items) {
            csvContent = 'Name,SKU,Category,Quantity,Value,Status\n';
            reportData.items.forEach((i: any) => {
                const status = i.isOutOfStock ? 'Out of Stock' : i.isLowStock ? 'Low Stock' : 'In Stock';
                csvContent += `${i.name},${i.sku},${i.category},${i.quantity},${i.stockValue},${status}\n`;
            });
        } else if (selectedReport === 'purchases' && reportData.allPurchases) {
            csvContent = 'Code,Supplier,Amount,Status,Date\n';
            reportData.allPurchases.forEach((p: any) => {
                csvContent += `${p.code},${p.supplierName || 'N/A'},${p.totalAmount},${p.status},${p.createdAt}\n`;
            });
        } else if (selectedReport === 'profit' && reportData.summary) {
            csvContent = 'Metric,Value\n';
            csvContent += `Total Revenue,${reportData.summary.totalRevenue}\n`;
            csvContent += `Cost of Goods Sold,${reportData.summary.totalCost}\n`;
            csvContent += `Gross Profit,${reportData.summary.grossProfit}\n`;
            csvContent += `Gross Margin %,${reportData.summary.grossMargin}\n`;
            csvContent += `Total Purchases,${reportData.summary.totalPurchases}\n`;
            csvContent += `Net Profit,${reportData.summary.netProfit}\n`;
            csvContent += `Sales Count,${reportData.salesCount}\n`;
            csvContent += `Purchase Count,${reportData.purchaseCount}\n`;
        } else if (selectedReport === 'activity' && Array.isArray(reportData)) {
            csvContent = 'Type,Action,Description,User,Date\n';
            reportData.forEach((a: any) => {
                csvContent += `${a.type},${a.action},"${a.description}",${a.user},${a.createdAt}\n`;
            });
        }

        if (csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
    };

    const reportCards = [
        { type: 'sales' as ReportType, label: 'Sales Report', subtitle: 'Revenue & transactions', icon: 'trending_up', color: 'emerald' },
        { type: 'inventory' as ReportType, label: 'Inventory Report', subtitle: 'Stock & valuation', icon: 'inventory_2', color: 'blue' },
        { type: 'purchases' as ReportType, label: 'Purchase Report', subtitle: 'Supplier & costs', icon: 'shopping_cart', color: 'amber' },
        { type: 'profit' as ReportType, label: 'Profit & Loss', subtitle: 'Financial summary', icon: 'account_balance', color: 'purple' },
        { type: 'activity' as ReportType, label: 'Activity Log', subtitle: 'Audit trail', icon: 'history', color: 'rose' },
    ];

    const colorClasses: Record<string, { bg: string; text: string }> = {
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Reports</h1>
                    <p className="text-slate-400 text-sm mt-1">View analytics and generate reports.</p>
                </div>
                {selectedReport && reportData && (
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export CSV
                    </button>
                )}
            </div>

            {/* Date Range Filter (for applicable reports) */}
            {selectedReport && selectedReport !== 'inventory' && selectedReport !== 'activity' && (
                <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-sm font-medium">Date Range:</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                    />
                    <button
                        onClick={() => setSelectedReport(null)}
                        className="ml-auto text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Reports
                    </button>
                </div>
            )}

            {/* Report Type Selection */}
            {!selectedReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCards.map((card) => (
                        <div
                            key={card.type}
                            onClick={() => handleReportClick(card.type)}
                            className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`size-12 rounded-xl ${colorClasses[card.color].bg} flex items-center justify-center ${colorClasses[card.color].text} group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{card.label}</h3>
                                    <p className="text-slate-400 text-sm">{card.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="size-8 border-3 border-[#7c3bed] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Report Data Display */}
            {!loading && selectedReport && reportData && (
                <div className="space-y-6">
                    {/* Back button for reports without date filter */}
                    {(selectedReport === 'inventory' || selectedReport === 'activity') && (
                        <button
                            onClick={() => setSelectedReport(null)}
                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Back to Reports
                        </button>
                    )}

                    {/* SALES REPORT */}
                    {selectedReport === 'sales' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Total Revenue</p>
                                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.summary.totalRevenue)}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Total Orders</p>
                                    <p className="text-2xl font-bold text-white mt-1">{reportData.summary.totalOrders}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Items Sold</p>
                                    <p className="text-2xl font-bold text-white mt-1">{reportData.summary.totalItems}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.summary.averageOrderValue)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top Products */}
                                <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <h3 className="font-semibold text-white">Top Selling Products</h3>
                                    </div>
                                    <div className="divide-y divide-slate-800">
                                        {reportData.topProducts.slice(0, 5).map((p: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between px-4 py-3">
                                                <div>
                                                    <p className="text-white font-medium">{p.name}</p>
                                                    <p className="text-slate-400 text-sm">{p.quantity} sold</p>
                                                </div>
                                                <p className="text-emerald-400 font-semibold">{formatCurrency(p.revenue)}</p>
                                            </div>
                                        ))}
                                        {reportData.topProducts.length === 0 && (
                                            <div className="p-6 text-center text-slate-400">No sales data</div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Sales */}
                                <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <h3 className="font-semibold text-white">Recent Sales</h3>
                                    </div>
                                    <div className="divide-y divide-slate-800">
                                        {reportData.recentSales.slice(0, 5).map((s: any) => (
                                            <div key={s.id} className="flex items-center justify-between px-4 py-3">
                                                <div>
                                                    <p className="text-white font-medium">{s.code}</p>
                                                    <p className="text-slate-400 text-sm">{s.customerName || 'Walk-in'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-semibold">{formatCurrency(s.totalAmount)}</p>
                                                    <p className="text-slate-500 text-xs">{formatDate(s.createdAt)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {reportData.recentSales.length === 0 && (
                                            <div className="p-6 text-center text-slate-400">No sales data</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* INVENTORY REPORT */}
                    {selectedReport === 'inventory' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Total Products</p>
                                    <p className="text-2xl font-bold text-white mt-1">{reportData.summary.totalProducts}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Total Units</p>
                                    <p className="text-2xl font-bold text-white mt-1">{reportData.summary.totalUnits}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Stock Value</p>
                                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.summary.totalValue)}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-amber-500/30">
                                    <p className="text-amber-400 text-sm">Low Stock</p>
                                    <p className="text-2xl font-bold text-amber-400 mt-1">{reportData.summary.lowStockCount}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-red-500/30">
                                    <p className="text-red-400 text-sm">Out of Stock</p>
                                    <p className="text-2xl font-bold text-red-400 mt-1">{reportData.summary.outOfStockCount}</p>
                                </div>
                            </div>

                            {/* By Category */}
                            <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-800">
                                    <h3 className="font-semibold text-white">Stock by Category</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-800/50">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Category</th>
                                                <th className="text-center px-4 py-3 text-slate-400 font-medium text-sm">Products</th>
                                                <th className="text-center px-4 py-3 text-slate-400 font-medium text-sm">Units</th>
                                                <th className="text-right px-4 py-3 text-slate-400 font-medium text-sm">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {reportData.byCategory.map((c: any) => (
                                                <tr key={c.category}>
                                                    <td className="px-4 py-3 text-white font-medium">{c.category}</td>
                                                    <td className="px-4 py-3 text-slate-300 text-center">{c.count}</td>
                                                    <td className="px-4 py-3 text-slate-300 text-center">{c.units}</td>
                                                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{formatCurrency(c.value)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* PURCHASE REPORT */}
                    {selectedReport === 'purchases' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Total Spent</p>
                                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.summary.totalSpent)}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Total Orders</p>
                                    <p className="text-2xl font-bold text-white mt-1">{reportData.summary.totalOrders}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Items Ordered</p>
                                    <p className="text-2xl font-bold text-white mt-1">{reportData.summary.totalItems}</p>
                                </div>
                                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800">
                                    <p className="text-slate-400 text-sm">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.summary.averageOrderValue)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* By Supplier */}
                                <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <h3 className="font-semibold text-white">By Supplier</h3>
                                    </div>
                                    <div className="divide-y divide-slate-800">
                                        {reportData.bySupplier.map((s: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between px-4 py-3">
                                                <div>
                                                    <p className="text-white font-medium">{s.supplier}</p>
                                                    <p className="text-slate-400 text-sm">{s.count} orders</p>
                                                </div>
                                                <p className="text-amber-400 font-semibold">{formatCurrency(s.total)}</p>
                                            </div>
                                        ))}
                                        {reportData.bySupplier.length === 0 && (
                                            <div className="p-6 text-center text-slate-400">No purchase data</div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Purchases */}
                                <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <h3 className="font-semibold text-white">Recent Purchases</h3>
                                    </div>
                                    <div className="divide-y divide-slate-800">
                                        {reportData.recentPurchases.slice(0, 5).map((p: any) => (
                                            <div key={p.id} className="flex items-center justify-between px-4 py-3">
                                                <div>
                                                    <p className="text-white font-medium">{p.code}</p>
                                                    <p className="text-slate-400 text-sm">{p.supplierName || 'Unknown'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-semibold">{formatCurrency(p.totalAmount)}</p>
                                                    <p className="text-slate-500 text-xs">{formatDate(p.createdAt)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {reportData.recentPurchases.length === 0 && (
                                            <div className="p-6 text-center text-slate-400">No purchase data</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* PROFIT REPORT */}
                    {selectedReport === 'profit' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-800">
                                <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
                                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(reportData.summary.totalRevenue)}</p>
                                <p className="text-slate-500 text-sm mt-2">{reportData.salesCount} sales</p>
                            </div>
                            <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-800">
                                <p className="text-slate-400 text-sm mb-2">Cost of Goods Sold</p>
                                <p className="text-3xl font-bold text-rose-400">{formatCurrency(reportData.summary.totalCost)}</p>
                                <p className="text-slate-500 text-sm mt-2">Direct costs</p>
                            </div>
                            <div className="bg-[#1e293b] rounded-xl p-6 border border-purple-500/30">
                                <p className="text-slate-400 text-sm mb-2">Gross Profit</p>
                                <p className="text-3xl font-bold text-purple-400">{formatCurrency(reportData.summary.grossProfit)}</p>
                                <p className="text-slate-500 text-sm mt-2">{reportData.summary.grossMargin}% margin</p>
                            </div>
                            <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-800">
                                <p className="text-slate-400 text-sm mb-2">Total Purchases</p>
                                <p className="text-3xl font-bold text-amber-400">{formatCurrency(reportData.summary.totalPurchases)}</p>
                                <p className="text-slate-500 text-sm mt-2">{reportData.purchaseCount} orders</p>
                            </div>
                            <div className="bg-[#1e293b] rounded-xl p-6 border border-emerald-500/30 col-span-2">
                                <p className="text-slate-400 text-sm mb-2">Net Profit (Revenue - Purchases)</p>
                                <p className={`text-4xl font-bold ${reportData.summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {formatCurrency(reportData.summary.netProfit)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ACTIVITY LOG */}
                    {selectedReport === 'activity' && Array.isArray(reportData) && (
                        <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-800">
                                <h3 className="font-semibold text-white">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                                {reportData.map((activity: ActivityItem) => (
                                    <div key={activity.id} className="flex items-start gap-4 px-4 py-3">
                                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'transaction' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            <span className="material-symbols-outlined text-[16px]">
                                                {activity.type === 'transaction' ? 'receipt' : 'inventory'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm">{activity.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-slate-500 text-xs">{activity.user}</span>
                                                <span className="text-slate-600">•</span>
                                                <span className="text-slate-500 text-xs">{formatDate(activity.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {reportData.length === 0 && (
                                    <div className="p-6 text-center text-slate-400">No activity recorded</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
