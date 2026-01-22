'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '@/lib/api';

interface Product {
    id: string;
    sku: string;
    name: string;
    sellingPrice: number;
    costPrice: number;
    stock?: { quantity: number };
}

interface LineItem {
    productId: string;
    product?: Product;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'SALE' | 'PURCHASE';
}

export default function TransactionFormModal({ isOpen, onClose, onSuccess, type }: TransactionFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [formData, setFormData] = useState({
        partyName: '',
        notes: '',
    });

    const [items, setItems] = useState<LineItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('1');

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            // Reset form
            setFormData({ partyName: '', notes: '' });
            setItems([]);
            setSelectedProductId('');
            setQuantity('1');
            setError(null);
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products?limit=1000');
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const addItem = () => {
        if (!selectedProductId || !quantity) return;

        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;

        const qty = parseInt(quantity);
        const unitPrice = type === 'SALE' ? Number(product.sellingPrice) : Number(product.costPrice);

        // Check if product already in list
        const existingIndex = items.findIndex(i => i.productId === selectedProductId);
        if (existingIndex >= 0) {
            const updated = [...items];
            updated[existingIndex].quantity += qty;
            updated[existingIndex].lineTotal = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
            setItems(updated);
        } else {
            setItems([...items, {
                productId: product.id,
                product,
                quantity: qty,
                unitPrice,
                lineTotal: qty * unitPrice,
            }]);
        }

        setSelectedProductId('');
        setQuantity('1');
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItemQuantity = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const updated = [...items];
        updated[index].quantity = newQty;
        updated[index].lineTotal = newQty * updated[index].unitPrice;
        setItems(updated);
    };

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError('Please add at least one item');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/transactions', {
                type,
                customerName: type === 'SALE' ? formData.partyName : undefined,
                supplierName: type === 'PURCHASE' ? formData.partyName : undefined,
                notes: formData.notes || undefined,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'SALE' ? 'New Sale' : 'New Purchase'}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Party Name */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">
                        {type === 'SALE' ? 'Customer Name' : 'Supplier Name'}
                    </label>
                    <input
                        type="text"
                        value={formData.partyName}
                        onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                        placeholder={type === 'SALE' ? 'Enter customer name' : 'Enter supplier name'}
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                    />
                </div>

                {/* Add Item Section */}
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <label className="block text-white font-medium mb-3">Add Items</label>
                    <div className="flex gap-3">
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        >
                            <option value="">Select a product</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} - ${type === 'SALE' ? Number(p.sellingPrice).toFixed(2) : Number(p.costPrice).toFixed(2)}
                                    {p.stock && ` (Stock: ${p.stock.quantity})`}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            placeholder="Qty"
                            className="w-24 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={addItem}
                            disabled={!selectedProductId}
                            className="px-4 py-2.5 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>

                {/* Items Table */}
                {items.length > 0 && (
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {items.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-800/20">
                                        <td className="px-4 py-3">
                                            <p className="text-white font-medium">{item.product?.name}</p>
                                            <p className="text-slate-400 text-xs">{item.product?.sku}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-400">${item.unitPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-white font-medium">${item.lineTotal.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-1 text-slate-400 hover:text-red-400 rounded"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Totals */}
                {items.length > 0 && (
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax (8%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-slate-700">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                        placeholder="Any additional notes..."
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
                        disabled={loading || items.length === 0}
                        className="px-6 py-2.5 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        Create {type === 'SALE' ? 'Sale' : 'Purchase'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
