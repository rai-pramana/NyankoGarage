'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data || response.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // Use mock data if API fails
            setUsers([
                { id: '1', email: 'owner@nyanko.garage', fullName: 'Alice Smith', role: 'OWNER', isActive: true, lastLogin: new Date().toISOString(), createdAt: new Date().toISOString() },
                { id: '2', email: 'admin@nyanko.garage', fullName: 'Bob Johnson', role: 'ADMIN', isActive: true, lastLogin: new Date().toISOString(), createdAt: new Date().toISOString() },
                { id: '3', email: 'staff@nyanko.garage', fullName: 'Diana Prince', role: 'STAFF', isActive: true, lastLogin: null, createdAt: new Date().toISOString() },
                { id: '4', email: 'warehouse@nyanko.garage', fullName: 'Charlie Day', role: 'WAREHOUSE', isActive: true, lastLogin: null, createdAt: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'OWNER': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'ADMIN': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'STAFF': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'WAREHOUSE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

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

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Users</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage team members and permissions.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#7c3bed]/20">
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Add User
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-800 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                />
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-slate-400">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-slate-400">No users found</div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-[#1e293b] rounded-xl border border-slate-800 p-5 hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-full bg-gradient-to-br from-[#7c3bed] to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                        {user.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user.fullName}</p>
                                        <p className="text-slate-400 text-sm">{user.email}</p>
                                    </div>
                                </div>
                                <button className="p-1 text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                                    {user.role}
                                </span>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={`size-2 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                    <span className="text-slate-400">{user.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>

                            {user.lastLogin && (
                                <p className="text-slate-500 text-xs mt-3">
                                    Last login: {new Date(user.lastLogin).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
