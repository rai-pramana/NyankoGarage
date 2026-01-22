'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserFormModal } from '@/components/ui';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'OWNER' | 'ADMIN' | 'STAFF' | 'WAREHOUSE';
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data || response.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Refetch when tab becomes visible (after 30+ seconds)
    const fetchRef = useRef<() => void>(() => { });
    const hiddenAtRef = useRef<number | null>(null);

    useEffect(() => {
        fetchRef.current = fetchUsers;
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
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const handleDeactivate = async (userId: string) => {
        if (!confirm('Are you sure you want to deactivate this user?')) return;

        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to deactivate user');
        }
    };

    const handleReactivate = async (userId: string) => {
        try {
            await api.patch(`/users/${userId}/reactivate`);
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to reactivate user');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'OWNER': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'ADMIN': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'STAFF': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'WAREHOUSE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const isOwner = currentUser?.role === 'OWNER';
    const isAdmin = currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN';

    if (!isAdmin) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-slate-400">You don&apos;t have permission to view this page.</p>
                </div>
            </DashboardLayout>
        );
    }

    // Stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const roleBreakdown = {
        owners: users.filter(u => u.role === 'OWNER').length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        staff: users.filter(u => u.role === 'STAFF').length,
        warehouse: users.filter(u => u.role === 'WAREHOUSE').length,
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Users</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage team members and permissions.</p>
                </div>
                {isOwner && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Add User
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalUsers}</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-sm">Active Users</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{activeUsers}</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-sm">Admins</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{roleBreakdown.admins + roleBreakdown.owners}</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-sm">Staff</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{roleBreakdown.staff + roleBreakdown.warehouse}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-800 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white text-sm"
                >
                    <option value="">All Roles</option>
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="WAREHOUSE">Warehouse</option>
                </select>
                {(roleFilter || search) && (
                    <button
                        onClick={() => {
                            setRoleFilter('');
                            setSearch('');
                        }}
                        className="px-3 py-2.5 text-slate-400 hover:text-white text-sm flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        Clear
                    </button>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-800">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">
                        <div className="inline-block size-8 border-4 border-[#7c3bed] border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Login</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-gradient-to-br from-[#7c3bed] to-pink-500 flex items-center justify-center text-white font-bold">
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{user.fullName}</p>
                                                        <p className="text-slate-400 text-xs">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`size-2 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                    <span className={user.isActive ? 'text-emerald-400' : 'text-red-400'}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div ref={openDropdown === user.id ? dropdownRef : null} className="relative inline-block">
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                    </button>

                                                    {openDropdown === user.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-40 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser(user);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-slate-800 text-white text-sm transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-slate-400">edit</span>
                                                                Edit
                                                            </button>
                                                            {isOwner && user.id !== currentUser?.id && (
                                                                <>
                                                                    {user.isActive ? (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleDeactivate(user.id);
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-red-500/10 text-red-400 text-sm transition-colors border-t border-slate-700"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[18px]">person_off</span>
                                                                            Deactivate
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleReactivate(user.id);
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-emerald-500/10 text-emerald-400 text-sm transition-colors border-t border-slate-700"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[18px]">person_check</span>
                                                                            Reactivate
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t border-slate-800 p-4">
                    <p className="text-sm text-slate-400">
                        Showing <span className="text-white font-medium">{filteredUsers.length}</span> of{' '}
                        <span className="text-white font-medium">{users.length}</span> users
                    </p>
                </div>
            </div>

            {/* Add User Modal */}
            <UserFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchUsers}
            />

            {/* Edit User Modal */}
            <UserFormModal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                onSuccess={fetchUsers}
                user={editingUser}
            />
        </DashboardLayout>
    );
}
