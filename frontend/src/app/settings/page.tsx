'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';

export default function SettingsPage() {
    const { user, checkAuth } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');

    // Profile form state
    const [profileName, setProfileName] = useState(user?.fullName || '');
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleProfileSave = async () => {
        if (!profileName.trim()) {
            setProfileMessage({ type: 'error', text: 'Name is required' });
            return;
        }

        setProfileSaving(true);
        setProfileMessage(null);

        try {
            await api.patch('/auth/profile', { fullName: profileName });
            await checkAuth(); // Refresh user data
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setPasswordSaving(true);

        try {
            await api.post('/auth/change-password', { currentPassword, newPassword });
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your account and preferences.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 shrink-0">
                    <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${activeTab === 'general' ? 'bg-[#7c3bed]/10 text-[#7c3bed] border-l-2 border-[#7c3bed]' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-medium">General</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${activeTab === 'security' ? 'bg-[#7c3bed]/10 text-[#7c3bed] border-l-2 border-[#7c3bed]' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <span className="material-symbols-outlined">lock</span>
                            <span className="font-medium">Security</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${activeTab === 'notifications' ? 'bg-[#7c3bed]/10 text-[#7c3bed] border-l-2 border-[#7c3bed]' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="font-medium">Notifications</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-[#7c3bed] to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user?.fullName || 'User'}</p>
                                        <p className="text-slate-400 text-sm">{user?.email || '-'}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#7c3bed]/10 text-[#7c3bed] rounded-full">
                                            {user?.role || 'Staff'}
                                        </span>
                                    </div>
                                </div>

                                {profileMessage && (
                                    <div className={`mb-4 p-3 rounded-lg text-sm ${profileMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {profileMessage.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleProfileSave}
                                        disabled={profileSaving}
                                        className="px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {profileSaving && (
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        )}
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            {/* Business Settings - Only visible to Owner/Admin */}
                            {(user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                                <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Business Settings</h3>
                                    <p className="text-slate-400 text-sm mb-4">These settings affect the entire application. Changes will apply to all users.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-1.5">Business Name</label>
                                            <input
                                                type="text"
                                                defaultValue="NyankoGarage"
                                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-1.5">Currency</label>
                                            <select className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm">
                                                <option>USD ($)</option>
                                                <option>EUR (€)</option>
                                                <option>GBP (£)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-1.5">Tax Rate (%)</label>
                                            <input
                                                type="number"
                                                defaultValue="8"
                                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-1.5">Low Stock Threshold</label>
                                            <input
                                                type="number"
                                                defaultValue="10"
                                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>

                            {passwordMessage && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1.5">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#7c3bed] focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={passwordSaving}
                                    className="px-4 py-2 bg-[#7c3bed] hover:bg-[#6b2bd6] text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {passwordSaving && (
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer">
                                    <div>
                                        <p className="text-white font-medium">Low Stock Alerts</p>
                                        <p className="text-slate-400 text-sm">Get notified when products are running low</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-600 bg-transparent text-[#7c3bed] focus:ring-[#7c3bed]" />
                                </label>
                                <label className="flex items-center justify-between p-4 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer">
                                    <div>
                                        <p className="text-white font-medium">New Transaction</p>
                                        <p className="text-slate-400 text-sm">Notify on new sales or purchases</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-600 bg-transparent text-[#7c3bed] focus:ring-[#7c3bed]" />
                                </label>
                                <label className="flex items-center justify-between p-4 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer">
                                    <div>
                                        <p className="text-white font-medium">Daily Summary</p>
                                        <p className="text-slate-400 text-sm">Receive daily sales summary by email</p>
                                    </div>
                                    <input type="checkbox" className="h-5 w-5 rounded border-slate-600 bg-transparent text-[#7c3bed] focus:ring-[#7c3bed]" />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
