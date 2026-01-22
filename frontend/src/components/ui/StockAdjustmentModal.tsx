'use client';

import { useState } from 'react';
import Modal from './Modal';
import api from '@/lib/api';

interface StockAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: {
        id: string;
        sku: string;
        name: string;
        quantity: number;
    } | null;
}

export default function StockAdjustmentModal({ isOpen, onClose, onSuccess, product }: StockAdjustmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: 'add' as 'add' | 'remove' | 'set',
        quantity: '',
        reason: 'Manual Adjustment',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setLoading(true);
        setError(null);

        try {
            await api.post('/inventory/adjust', {
                productId: product.id,
                type: formData.type,
                quantity: parseInt(formData.quantity),
                reason: formData.reason,
                notes: formData.notes || undefined,
            });

            onSuccess();
            onClose();
            // Reset form
            setFormData({ type: 'add', quantity: '', reason: 'Manual Adjustment', notes: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to adjust stock');
        } finally {
            setLoading(false);
        }
    };

    const getNewQuantity = () => {
        if (!product || !formData.quantity) return product?.quantity || 0;
        const qty = parseInt(formData.quantity) || 0;
        switch (formData.type) {
            case 'add': return product.quantity + qty;
            case 'remove': return Math.max(0, product.quantity - qty);
            case 'set': return qty;
            default: return product.quantity;
        }
    };

    const reasons = [
        'Manual Adjustment',
        'Physical Count',
        'Damaged Goods',
        'Returned to Supplier',
        'Customer Return',
        'Inventory Correction',
        'Other',
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Stock Adjustment" size="md">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Product Info */}
                {product && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-lg bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed]">
                                <span className="material-symbols-outlined">package_2</span>
                            </div>
                            <div>
                                <p className="text-white font-medium">{product.name}</p>
                                <p className="text-slate-400 text-sm">SKU: {product.sku}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-slate-400 text-sm">Current Stock</p>
                                <p className="text-2xl font-bold text-white">{product.quantity}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Adjustment Type */}
                <div>
                    <label className="block text-slate-400 text-sm mb-2">Adjustment Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'add' })}
                            className={`p-3 rounded-lg border font-medium transition-all ${formData.type === 'add'
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <span className="material-symbols-outlined block mb-1">add_circle</span>
                            Add Stock
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'remove' })}
                            className={`p-3 rounded-lg border font-medium transition-all ${formData.type === 'remove'
                                    ? 'bg-red-500/10 border-red-500/50 text-red-400'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <span className="material-symbols-outlined block mb-1">remove_circle</span>
                            Remove
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'set' })}
                            className={`p-3 rounded-lg border font-medium transition-all ${formData.type === 'set'
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <span className="material-symbols-outlined block mb-1">edit</span>
                            Set Value
                        </button>
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">
                        {formData.type === 'set' ? 'New Quantity' : 'Quantity to ' + (formData.type === 'add' ? 'Add' : 'Remove')} *
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min={formData.type === 'set' ? 0 : 1}
                        placeholder="0"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent text-lg font-medium"
                    />
                </div>

                {/* Preview */}
                {formData.quantity && product && (
                    <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-slate-800/30">
                        <span className="text-slate-400">{product.quantity}</span>
                        <span className="material-symbols-outlined text-slate-500">arrow_forward</span>
                        <span className={`text-xl font-bold ${getNewQuantity() > product.quantity ? 'text-emerald-400' :
                                getNewQuantity() < product.quantity ? 'text-red-400' : 'text-white'
                            }`}>
                            {getNewQuantity()}
                        </span>
                    </div>
                )}

                {/* Reason */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Reason *</label>
                    <select
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                    >
                        {reasons.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Additional notes..."
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.quantity}
                        className="px-6 py-2.5 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        Apply Adjustment
                    </button>
                </div>
            </form>
        </Modal>
    );
}
