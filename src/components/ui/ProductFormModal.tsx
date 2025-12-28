'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '@/lib/api';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: {
        id: string;
        sku: string;
        name: string;
        description?: string;
        category?: string;
        unit: string;
        costPrice: number;
        sellingPrice: number;
        minStockLevel: number;
    } | null;
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormProps) {
    const isEditing = !!product;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        category: '',
        unit: 'pcs',
        costPrice: '',
        sellingPrice: '',
        minStockLevel: '10',
        initialStock: '',
    });

    // Reset form when product changes (for edit mode)
    useEffect(() => {
        if (product) {
            setFormData({
                sku: product.sku || '',
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                unit: product.unit || 'pcs',
                costPrice: product.costPrice?.toString() || '',
                sellingPrice: product.sellingPrice?.toString() || '',
                minStockLevel: product.minStockLevel?.toString() || '10',
                initialStock: '',
            });
        } else {
            // Reset for add mode
            setFormData({
                sku: '',
                name: '',
                description: '',
                category: '',
                unit: 'pcs',
                costPrice: '',
                sellingPrice: '',
                minStockLevel: '10',
                initialStock: '',
            });
        }
        setError(null);
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const basePayload = {
                sku: formData.sku,
                name: formData.name,
                description: formData.description || undefined,
                category: formData.category || undefined,
                unit: formData.unit,
                costPrice: parseFloat(formData.costPrice),
                sellingPrice: parseFloat(formData.sellingPrice),
                minStockLevel: parseInt(formData.minStockLevel),
            };

            if (isEditing) {
                // Don't send initialStock for updates
                await api.patch(`/products/${product.id}`, basePayload);
            } else {
                // Include initialStock for new products
                const createPayload = {
                    ...basePayload,
                    initialStock: formData.initialStock ? parseInt(formData.initialStock) : 0,
                };
                await api.post('/products', createPayload);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Fluids', 'Brakes', 'Filters', 'Ignition', 'Electrical', 'Engine', 'Accessories', 'Other'];
    const units = ['pcs', 'set', 'pair', 'pack', 'bottle', 'box', 'kg', 'liter'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Product' : 'Add New Product'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SKU */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">SKU *</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            placeholder="e.g., OIL-5W30"
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Engine Oil 5W-30"
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        >
                            {units.map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cost Price */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Cost Price *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                                type="number"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Selling Price */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Selling Price *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Min Stock Level */}
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Min Stock Level</label>
                        <input
                            type="number"
                            name="minStockLevel"
                            value={formData.minStockLevel}
                            onChange={handleChange}
                            min="0"
                            placeholder="10"
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>

                    {/* Initial Stock (only for new products) */}
                    {!isEditing && (
                        <div>
                            <label className="block text-slate-400 text-sm mb-1.5">Initial Stock</label>
                            <input
                                type="number"
                                name="initialStock"
                                value={formData.initialStock}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                            />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Optional product description..."
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
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isEditing ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
