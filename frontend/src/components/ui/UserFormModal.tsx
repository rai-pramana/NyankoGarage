'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '@/lib/api';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: {
        id: string;
        email: string;
        fullName: string;
        role: 'OWNER' | 'ADMIN' | 'STAFF' | 'WAREHOUSE';
    } | null;
}

export default function UserFormModal({ isOpen, onClose, onSuccess, user }: UserFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        role: 'STAFF' as 'OWNER' | 'ADMIN' | 'STAFF' | 'WAREHOUSE',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                fullName: user.fullName,
                password: '',
                role: user.role,
            });
        } else {
            setFormData({
                email: '',
                fullName: '',
                password: '',
                role: 'STAFF',
            });
        }
        setError(null);
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (user) {
                // Update user
                await api.patch(`/users/${user.id}`, {
                    fullName: formData.fullName,
                    role: formData.role,
                });
            } else {
                // Create user
                await api.post('/users', {
                    email: formData.email,
                    fullName: formData.fullName,
                    password: formData.password,
                    role: formData.role,
                });
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'STAFF', label: 'Staff', description: 'Basic access - can create transactions' },
        { value: 'WAREHOUSE', label: 'Warehouse', description: 'Manage inventory and stock adjustments' },
        { value: 'ADMIN', label: 'Admin', description: 'Full access except user management' },
        { value: 'OWNER', label: 'Owner', description: 'Full system access' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add New User'} size="md">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Full Name */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Full Name *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                    />
                </div>

                {/* Email (only for new users) */}
                {!user && (
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="user@example.com"
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>
                )}

                {/* Password (only for new users) */}
                {!user && (
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="Minimum 6 characters"
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                        />
                    </div>
                )}

                {/* Role */}
                <div>
                    <label className="block text-slate-400 text-sm mb-2">Role *</label>
                    <div className="space-y-2">
                        {roles.map((r) => (
                            <label
                                key={r.value}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.role === r.value
                                        ? 'border-[#7c3bed] bg-[#7c3bed]/10'
                                        : 'border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={r.value}
                                    checked={formData.role === r.value}
                                    onChange={handleChange}
                                    className="mt-1 accent-[#7c3bed]"
                                />
                                <div>
                                    <p className="text-white font-medium">{r.label}</p>
                                    <p className="text-slate-400 text-sm">{r.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
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
                        {user ? 'Save Changes' : 'Create User'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
