'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import api from '@/lib/api';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setError('Invalid reset link');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: data.password,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="relative flex h-screen w-full flex-col overflow-hidden animated-bg text-white">
                <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#7c3bed]/30 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-pink-600/20 blur-[100px]" />

                <div className="flex h-full grow flex-col items-center justify-center p-4">
                    <div className="glass-card w-full max-w-[480px] rounded-2xl p-8 sm:p-10 flex flex-col gap-6 relative z-10 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 text-red-400 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Invalid Reset Link</h1>
                        <p className="text-[#a692c8]">This password reset link is invalid or has expired.</p>
                        <Link
                            href="/forgot-password"
                            className="relative w-full rounded-xl bg-[#7c3bed] hover:bg-[#6b2bd6] h-12 text-white text-base font-bold shadow-lg shadow-[#7c3bed]/25 transition-all active:scale-[0.98] flex items-center justify-center"
                        >
                            Request New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden animated-bg text-white">
            {/* Decorative background blobs */}
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#7c3bed]/30 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-pink-600/20 blur-[100px]" />

            <div className="flex h-full grow flex-col items-center justify-center p-4">
                {/* Card */}
                <div className="glass-card w-full max-w-[480px] rounded-2xl p-8 sm:p-10 flex flex-col gap-6 relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7c3bed]/20 text-[#7c3bed] mb-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-white">
                            {success ? 'Password Reset!' : 'Reset Password'}
                        </h1>
                        <p className="text-[#a692c8] text-sm font-medium">
                            {success
                                ? "Your password has been successfully reset"
                                : "Enter your new password below"
                            }
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success ? (
                        /* Success State */
                        <div className="flex flex-col gap-4">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm text-center">
                                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-medium">Password changed successfully!</p>
                                <p className="text-green-400/80 mt-1">You can now log in with your new password.</p>
                            </div>

                            <Link
                                href="/login"
                                className="relative w-full rounded-xl bg-[#7c3bed] hover:bg-[#6b2bd6] h-12 text-white text-base font-bold shadow-lg shadow-[#7c3bed]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        /* Form Section */
                        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit(onSubmit)}>
                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium leading-normal" htmlFor="password">
                                    New Password
                                </label>
                                <div className="flex w-full items-stretch rounded-xl bg-[#312447] border border-transparent focus-within:border-[#7c3bed]/50 transition-colors">
                                    <input
                                        {...register('password')}
                                        className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white focus:outline-0 focus:ring-0 border-none h-12 px-4 placeholder:text-[#a692c8] text-base font-normal leading-normal rounded-xl"
                                        id="password"
                                        placeholder="At least 6 characters"
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

                            {/* Confirm Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium leading-normal" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <div className="flex w-full items-stretch rounded-xl bg-[#312447] border border-transparent focus-within:border-[#7c3bed]/50 transition-colors">
                                    <input
                                        {...register('confirmPassword')}
                                        className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white focus:outline-0 focus:ring-0 border-none h-12 px-4 placeholder:text-[#a692c8] text-base font-normal leading-normal rounded-xl"
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="flex items-center justify-center pr-4 text-[#a692c8] cursor-pointer hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showConfirmPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="text-red-400 text-xs">{errors.confirmPassword.message}</span>
                                )}
                            </div>

                            {/* Submit Button */}
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
                                    <span>Reset Password</span>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    {!success && (
                        <div className="pt-2 text-center border-t border-white/10 mt-2">
                            <p className="text-[#a692c8] text-sm">
                                Remember your password?{' '}
                                <Link className="text-white font-medium hover:text-[#7c3bed] transition-colors ml-1" href="/login">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Branding */}
                <div className="mt-8 text-[#a692c8]/50 text-xs">
                    © 2024 NyankoGarage Inc. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="relative flex h-screen w-full flex-col overflow-hidden animated-bg text-white">
                <div className="flex h-full grow flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c3bed]"></div>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
