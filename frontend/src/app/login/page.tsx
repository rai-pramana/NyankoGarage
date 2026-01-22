'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth.store';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await login(data.email, data.password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden animated-bg text-white">
            {/* Decorative background blobs */}
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#7c3bed]/30 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-pink-600/20 blur-[100px]" />

            <div className="flex h-full grow flex-col items-center justify-center p-4">
                {/* Login Card */}
                <div className="glass-card w-full max-w-[480px] rounded-2xl p-8 sm:p-10 flex flex-col gap-6 relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7c3bed]/20 text-[#7c3bed] mb-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-white">NyankoGarage</h1>
                        <p className="text-[#a692c8] text-sm font-medium">Garage Management System</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form Section */}
                    <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium leading-normal" htmlFor="email">
                                Email Address
                            </label>
                            <div className="flex w-full items-stretch rounded-xl bg-[#312447] border border-transparent focus-within:border-[#7c3bed]/50 transition-colors">
                                <input
                                    {...register('email')}
                                    className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white focus:outline-0 focus:ring-0 border-none h-12 px-4 placeholder:text-[#a692c8] text-base font-normal leading-normal rounded-xl"
                                    id="email"
                                    placeholder="user@nyanko.garage"
                                    type="email"
                                />
                                <div className="flex items-center justify-center pr-4 text-[#a692c8]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.email && (
                                <span className="text-red-400 text-xs">{errors.email.message}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium leading-normal" htmlFor="password">
                                Password
                            </label>
                            <div className="flex w-full items-stretch rounded-xl bg-[#312447] border border-transparent focus-within:border-[#7c3bed]/50 transition-colors">
                                <input
                                    {...register('password')}
                                    className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white focus:outline-0 focus:ring-0 border-none h-12 px-4 placeholder:text-[#a692c8] text-base font-normal leading-normal rounded-xl"
                                    id="password"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="flex items-center justify-center pr-4 text-[#a692c8] cursor-pointer hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-400 text-xs">{errors.password.message}</span>
                            )}
                        </div>

                        {/* Options Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-[#463366] border-2 bg-transparent text-[#7c3bed] checked:bg-[#7c3bed] checked:border-[#7c3bed] focus:ring-0 focus:ring-offset-0 focus:border-[#7c3bed] focus:outline-none transition-all cursor-pointer"
                                />
                                <span className="text-gray-300 group-hover:text-white text-sm font-normal transition-colors select-none">
                                    Remember me
                                </span>
                            </label>
                            <a className="text-[#7c3bed] text-sm font-medium hover:text-white transition-colors underline-offset-4 hover:underline" href="#">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full rounded-xl bg-[#7c3bed] hover:bg-[#6b2bd6] h-12 text-white text-base font-bold shadow-lg shadow-[#7c3bed]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <span>Login</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-2 text-center border-t border-white/10 mt-2">
                        <p className="text-[#a692c8] text-sm">
                            Don&apos;t have an account?{' '}
                            <a className="text-white font-medium hover:text-[#7c3bed] transition-colors ml-1" href="/register">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 text-[#a692c8]/50 text-xs">
                    © 2024 NyankoGarage Inc. All rights reserved.
                </div>
            </div>
        </div>
    );
}
