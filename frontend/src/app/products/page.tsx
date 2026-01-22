'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
    transactionCount?: number;
    canDelete?: boolean;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const CATEGORIES = ['Fluids', 'Brakes', 'Filters', 'Ignition', 'Electrical', 'Engine', 'Accessories', 'Other'];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(initialSearch);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 1 });
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Sync search from URL when it changes (for same-page navigation)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== search) {
            setSearch(urlSearch);
        }
    }, [searchParams]);

    // Fetch products when filters, page, or limit changes
    useEffect(() => {
        fetchProducts();
    }, [page, limit, categoryFilter, statusFilter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (categoryFilter) params.append('category', categoryFilter);
            if (statusFilter) params.append('status', statusFilter);

            const response = await api.get(`/products?${params.toString()}`);
            setProducts(response.data.data || []);
            if (response.data.meta) {
                setMeta(response.data.meta);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset to first page on search
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Refetch when tab becomes visible (after 30+ seconds) or stock is updated
    const fetchRef = useRef<() => void>(() => { });
    const hiddenAtRef = useRef<number | null>(null);

    useEffect(() => {
        fetchRef.current = fetchProducts;
    });

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                hiddenAtRef.current = Date.now();
            } else if (document.visibilityState === 'visible' && hiddenAtRef.current) {
                const hiddenDuration = Date.now() - hiddenAtRef.current;
                if (hiddenDuration > 30000) { // 30 seconds
                    fetchRef.current();
                }
                hiddenAtRef.current = null;
            }
        };
        const handleStockUpdate = () => fetchRef.current();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('stock-updated', handleStockUpdate);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('stock-updated', handleStockUpdate);
        };
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) return;

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

    const getStockStatus = (product: Product) => {
        const qty = product.stock?.quantity || 0;
        if (qty === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-400 border-red-500/20', value: 'out_of_stock' };
        if (qty <= product.minStockLevel) return { label: 'Low Stock', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', value: 'low_stock' };
        return { label: 'In Stock', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', value: 'in_stock' };
    };

    // Client-side filtering by status (since backend status filter is for stock levels)
    const filteredProducts = statusFilter
        ? products.filter(p => getStockStatus(p).value === statusFilter)
        : products;

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
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm cursor-pointer"
                    >
                        <option value="">All Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                    {(categoryFilter || statusFilter || search) && (
                        <button
                            onClick={() => {
                                setCategoryFilter('');
                                setStatusFilter('');
                                setSearch('');
                                setPage(1);
                            }}
                            className="px-3 py-2.5 text-slate-400 hover:text-white text-sm flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                            Clear Filters
                        </button>
                    )}
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
                                            {search || categoryFilter || statusFilter
                                                ? 'No products match your filters'
                                                : 'No products found. Add your first product!'}
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
                                                        disabled={deletingId === product.id || product.canDelete === false}
                                                        className={`p-1.5 rounded-lg transition-colors ml-1 disabled:opacity-50 disabled:cursor-not-allowed ${product.canDelete === false
                                                            ? 'text-slate-600 cursor-not-allowed'
                                                            : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                                                            }`}
                                                        title={product.canDelete === false
                                                            ? `Cannot delete - used in ${product.transactionCount} transaction(s)`
                                                            : 'Delete product'
                                                        }
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {deletingId === product.id ? 'hourglass_empty' : product.canDelete === false ? 'lock' : 'delete'}
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

                {/* Footer with Pagination */}
                <div className="border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">Rows per page:</span>
                        <select
                            value={limit >= 1000 ? 'all' : limit}
                            onChange={(e) => {
                                const newLimit = e.target.value === 'all' ? 1000 : parseInt(e.target.value);
                                setLimit(newLimit);
                                setPage(1);
                            }}
                            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer"
                        >
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                            <option value="all">All</option>
                        </select>
                        <p className="text-sm text-slate-400">
                            Showing <span className="text-white font-medium">{filteredProducts.length}</span> of{' '}
                            <span className="text-white font-medium">{meta.total}</span> products
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-400">
                            Page <span className="text-white">{page}</span> of <span className="text-white">{meta.totalPages || 1}</span>
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            disabled={page >= meta.totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
