import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'OWNER' | 'ADMIN' | 'STAFF' | 'WAREHOUSE';
    isActive: boolean;
    lastLogin: string | null;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,

            login: async (email: string, password: string) => {
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const { user, tokens } = response.data;

                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || 'Login failed');
                }
            },

            register: async (email: string, password: string, fullName: string) => {
                try {
                    const response = await api.post('/auth/register', { email, password, fullName });
                    const { user, tokens } = response.data;

                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || 'Registration failed');
                }
            },

            logout: async () => {
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        await api.post('/auth/logout', { refreshToken });
                    }
                } catch (error) {
                    // Ignore logout errors
                } finally {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    set({ isLoading: false });
                    return;
                }

                try {
                    const response = await api.post('/auth/me');
                    set({ user: response.data, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
