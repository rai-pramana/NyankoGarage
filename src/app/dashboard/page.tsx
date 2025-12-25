'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

// Stat Card Component
function StatCard({
    title,
    value,
    change,
    changeType = 'positive',
    icon
}: {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: string;
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
                <span className="text-3xl font-bold text-white">{value}</span>
                {change && (
                    <span className={`text-sm font-medium ${changeColors[changeType]} flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-[16px]">
                            {changeType === 'positive' ? 'trending_up' : changeType === 'negative' ? 'trending_down' : 'remove'}
                        </span>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}

// Recent Transactions Table
function RecentTransactions() {
    const transactions = [
        { code: '#TRX-8291', type: 'Sale', customer: 'Alice Mechanic', amount: '$450.00', status: 'completed', date: 'Today' },
        { code: '#TRX-8290', type: 'Purchase', customer: 'Global Supplies', amount: '$1,200.00', status: 'confirmed', date: 'Today' },
        { code: '#TRX-8289', type: 'Sale', customer: 'John Doe', amount: '$85.00', status: 'completed', date: 'Yesterday' },
        { code: '#TRX-8288', type: 'Sale', customer: 'Mike Ross', amount: '$350.00', status: 'draft', date: 'Yesterday' },
        { code: '#TRX-8287', type: 'Purchase', customer: 'AutoParts Inc', amount: '$2,500.00', status: 'completed', date: '2 days ago' },
    ];

    const statusStyles: Record<string, string> = {
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        confirmed: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="font-semibold text-white">Recent Transactions</h3>
                <a href="/transactions" className="text-[#7c3bed] text-sm font-medium hover:underline">
                    View All
                </a>
            </div>
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
                            <tr key={txn.code} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-[#7c3bed] font-medium">{txn.code}</span>
                                </td>
                                <td className="px-4 py-3 text-white">{txn.type}</td>
                                <td className="px-4 py-3 text-white">{txn.customer}</td>
                                <td className="px-4 py-3 text-white text-right font-medium">{txn.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusStyles[txn.status]}`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-400">{txn.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Low Stock Alerts
function LowStockAlerts() {
    const alerts = [
        { name: 'Brake Pads - Front', sku: 'BRK-001', qty: 5, min: 10 },
        { name: 'Engine Oil 5W-30', sku: 'OIL-005', qty: 3, min: 15 },
        { name: 'Air Filter - Universal', sku: 'FLT-012', qty: 2, min: 8 },
        { name: 'Spark Plugs (4-pack)', sku: 'SPK-003', qty: 8, min: 20 },
    ];

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
            <div className="divide-y divide-slate-800">
                {alerts.map((item) => (
                    <div key={item.sku} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                        <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-slate-400 text-sm">{item.sku}</p>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold ${item.qty <= 3 ? 'text-red-400' : 'text-amber-400'}`}>
                                {item.qty} / {item.min}
                            </p>
                            <p className="text-slate-500 text-xs">in stock</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Transaction
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Today's Revenue"
                    value="$4,250"
                    change="+12.5%"
                    changeType="positive"
                    icon="payments"
                />
                <StatCard
                    title="Orders Today"
                    value="24"
                    change="+8%"
                    changeType="positive"
                    icon="receipt_long"
                />
                <StatCard
                    title="Products"
                    value="156"
                    icon="inventory_2"
                />
                <StatCard
                    title="Low Stock Items"
                    value="4"
                    change="Needs attention"
                    changeType="negative"
                    icon="warning"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentTransactions />
                </div>
                <div>
                    <LowStockAlerts />
                </div>
            </div>
        </DashboardLayout>
    );
}
