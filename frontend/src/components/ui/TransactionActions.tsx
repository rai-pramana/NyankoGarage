'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

interface Transaction {
    id: string;
    code: string;
    status: 'DRAFT' | 'COMPLETED' | 'CANCELED';
}

interface TransactionActionsProps {
    transaction: Transaction;
    onUpdate: () => void;
    onViewDetails?: (id: string) => void;
}

export default function TransactionActions({ transaction, onUpdate, onViewDetails }: TransactionActionsProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = async (action: 'confirm' | 'complete' | 'cancel') => {
        if (!confirm(`Are you sure you want to ${action} this transaction?`)) return;

        setLoading(true);
        try {
            await api.patch(`/transactions/${transaction.id}/${action}`);
            onUpdate();
            setOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || `Failed to ${action} transaction`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to permanently delete transaction ${transaction.code}? This cannot be undone.`)) return;

        setLoading(true);
        try {
            await api.delete(`/transactions/${transaction.id}`);
            onUpdate();
            setOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete transaction');
        } finally {
            setLoading(false);
        }
    };

    const canComplete = transaction.status === 'DRAFT';
    const canCancel = transaction.status === 'DRAFT';
    const canDelete = transaction.status !== 'COMPLETED';

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                disabled={loading}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                title="Actions"
            >
                <span className="material-symbols-outlined text-[20px]">
                    {loading ? 'hourglass_empty' : 'more_vert'}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                    {/* View Details */}
                    <button
                        onClick={() => {
                            if (onViewDetails) {
                                onViewDetails(transaction.id);
                            }
                            setOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-slate-800 text-white text-sm transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px] text-slate-400">visibility</span>
                        View Details
                    </button>

                    {/* Complete (Draft only) */}
                    {canComplete && (
                        <button
                            onClick={() => handleAction('complete')}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-slate-800 text-white text-sm transition-colors border-t border-slate-700"
                        >
                            <span className="material-symbols-outlined text-[18px] text-emerald-400">task_alt</span>
                            Complete
                        </button>
                    )}

                    {/* Cancel */}
                    {canCancel && (
                        <button
                            onClick={() => handleAction('cancel')}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-slate-800 text-red-400 text-sm transition-colors border-t border-slate-700"
                        >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                            Cancel
                        </button>
                    )}

                    {/* Delete */}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-red-500/10 text-red-400 text-sm transition-colors border-t border-slate-700"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
