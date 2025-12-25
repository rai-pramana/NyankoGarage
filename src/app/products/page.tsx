'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ProductFormModal } from '@/components/ui';
import api from '@/lib/api';

interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: string;
    costPrice: number;
    sellingPrice: number;
    unit: string;
    minStockLevel: number;
    isActive: boolean;
    stock?: { quantity: number };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const getStockStatus = (product: Product) => {
        const qty = product.stock?.quantity || 0;
        if (qty === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
        if (qty <= product.minStockLevel) return { label: 'Low Stock', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
        return { label: 'In Stock', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your product catalog and inventory.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px] max-w-md relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>
                    <select className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm">
                        <option>All Categories</option>
                        <option>Fluids</option>
                        <option>Brakes</option>
                        <option>Filters</option>
                        <option>Electrical</option>
                    </select>
                    <select className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm">
                        <option>All Status</option>
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">
                        <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Cost</th>
                                    <th className="px-6 py-4 text-right">Price</th>
                                    <th className="px-6 py-4 text-right">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                                            {search ? 'No products match your search' : 'No products found. Add your first product!'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => {
                                        const status = getStockStatus(product);
                                        return (
                                            <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono text-[#7c3bed] font-medium">{product.sku}</td>
                                                <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                                                <td className="px-6 py-4 text-slate-400">{product.category || '-'}</td>
                                                <td className="px-6 py-4 text-slate-400 text-right">${Number(product.costPrice).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-white text-right font-medium">${Number(product.sellingPrice).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-white text-right">{product.stock?.quantity || 0}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setEditingProduct(product)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="Edit product"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={deletingId === product.id}
                                                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1 disabled:opacity-50"
                                                        title="Delete product"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {deletingId === product.id ? 'hourglass_empty' : 'delete'}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t border-slate-800 p-4 flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        Showing <span className="text-white font-medium">{filteredProducts.length}</span> of{' '}
                        <span className="text-white font-medium">{products.length}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <ProductFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchProducts}
            />

            {/* Edit Product Modal */}
            <ProductFormModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                onSuccess={fetchProducts}
                product={editingProduct}
            />
        </DashboardLayout>
    );
}
