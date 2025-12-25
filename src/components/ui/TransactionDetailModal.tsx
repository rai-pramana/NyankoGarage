'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '@/lib/api';

interface TransactionItem {
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    product: {
        id: string;
        name: string;
        sku: string;
    };
}

interface TransactionDetail {
    id: string;
    code: string;
    type: 'SALE' | 'PURCHASE';
    status: 'DRAFT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
    customerName?: string;
    supplierName?: string;
    notes?: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    createdAt: string;
    completedAt?: string;
    items: TransactionItem[];
    createdBy?: { fullName: string };
    confirmedBy?: { fullName: string };
}

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: string | null;
}

export default function TransactionDetailModal({ isOpen, onClose, transactionId }: TransactionDetailModalProps) {
    const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && transactionId) {
            fetchTransaction();
        }
    }, [isOpen, transactionId]);

    const fetchTransaction = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/transactions/${transactionId}`);
            setTransaction(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load transaction');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'CONFIRMED': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'DRAFT': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'CANCELED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="xl">
            {loading ? (
                <div className="p-8 text-center">
                    <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-slate-400">Loading transaction...</p>
                </div>
            ) : error ? (
                <div className="p-8 text-center text-red-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block">error</span>
                    <p>{error}</p>
                </div>
            ) : transaction ? (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-700">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white font-mono">{transaction.code}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyle(transaction.status)}`}>
                                    {transaction.status.toLowerCase()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <span className={`flex items-center gap-1 ${transaction.type === 'SALE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">
                                        {transaction.type === 'SALE' ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {transaction.type === 'SALE' ? 'Sale' : 'Purchase'}
                                </span>
                                <span>•</span>
                                <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-sm">
                                {transaction.type === 'SALE' ? 'Customer' : 'Supplier'}
                            </p>
                            <p className="text-white font-medium">
                                {transaction.customerName || transaction.supplierName || 'Walk-in'}
                            </p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h4 className="text-white font-medium mb-3">Items ({transaction.items.length})</h4>
                        <div className="border border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {transaction.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-800/20">
                                            <td className="px-4 py-3">
                                                <p className="text-white font-medium">{item.product.name}</p>
                                                <p className="text-slate-400 text-xs font-mono">{item.product.sku}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-400">
                                                ${Number(item.unitPrice).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center text-white">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-white font-medium">
                                                ${Number(item.lineTotal).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 bg-slate-800/30 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>${Number(transaction.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax</span>
                                <span>${Number(transaction.taxAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-slate-700">
                                <span>Total</span>
                                <span className={transaction.type === 'SALE' ? 'text-emerald-400' : 'text-rose-400'}>
                                    ${Number(transaction.totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {transaction.notes && (
                        <div>
                            <h4 className="text-slate-400 text-sm mb-1">Notes</h4>
                            <p className="text-white bg-slate-800/30 rounded-lg p-3 text-sm">
                                {transaction.notes}
                            </p>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
                        {transaction.createdBy && (
                            <div>
                                <span className="text-slate-500">Created by:</span>{' '}
                                <span className="text-white">{transaction.createdBy.fullName}</span>
                            </div>
                        )}
                        {transaction.confirmedBy && (
                            <div>
                                <span className="text-slate-500">Confirmed by:</span>{' '}
                                <span className="text-white">{transaction.confirmedBy.fullName}</span>
                            </div>
                        )}
                        {transaction.completedAt && (
                            <div>
                                <span className="text-slate-500">Completed:</span>{' '}
                                <span className="text-white">{new Date(transaction.completedAt).toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    {/* Print Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-lg font-medium transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">print</span>
                            Print Invoice
                        </button>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
