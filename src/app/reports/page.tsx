'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ReportsPage() {
    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Reports</h1>
                    <p className="text-slate-400 text-sm mt-1">View analytics and generate reports.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Export Report
                </button>
            </div>

            {/* Report Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sales Report */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">trending_up</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Sales Report</h3>
                            <p className="text-slate-400 text-sm">Revenue & transactions</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        View sales performance, top products, and revenue trends.
                    </p>
                </div>

                {/* Inventory Report */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">inventory_2</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Inventory Report</h3>
                            <p className="text-slate-400 text-sm">Stock & movements</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Analyze stock levels, movement history, and low stock alerts.
                    </p>
                </div>

                {/* Purchase Report */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Purchase Report</h3>
                            <p className="text-slate-400 text-sm">Supplier & costs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Track supplier orders, costs, and purchase history.
                    </p>
                </div>

                {/* Profit & Loss */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">account_balance</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Profit & Loss</h3>
                            <p className="text-slate-400 text-sm">Financial summary</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Calculate margins, expenses, and net profit.
                    </p>
                </div>

                {/* Activity Log */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">history</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Activity Log</h3>
                            <p className="text-slate-400 text-sm">Audit trail</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        View system activity and user actions history.
                    </p>
                </div>

                {/* Custom Report */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all cursor-pointer group border-dashed">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Custom Report</h3>
                            <p className="text-slate-400 text-sm">Build your own</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Create custom reports with specific date ranges and filters.
                    </p>
                </div>
            </div>

            {/* Coming Soon Banner */}
            <div className="bg-gradient-to-r from-[#7c3bed]/20 to-purple-600/10 rounded-xl border border-[#7c3bed]/30 p-6 flex items-center gap-4">
                <div className="size-12 rounded-full bg-[#7c3bed]/20 flex items-center justify-center text-[#7c3bed]">
                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                </div>
                <div>
                    <h3 className="text-white font-semibold">Advanced Analytics Coming Soon</h3>
                    <p className="text-slate-400 text-sm">Charts, graphs, and predictive insights will be available in the next update.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
