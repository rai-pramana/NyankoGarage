'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import api from '@/lib/api';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/forgot-password', { email: data.email });
            setSuccess(true);
            // For testing purposes - in production, token would be sent via email
            if (response.data.resetToken) {
                setResetToken(response.data.resetToken);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
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
                {/* Card */}
                <div className="glass-card w-full max-w-[480px] rounded-2xl p-8 sm:p-10 flex flex-col gap-6 relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7c3bed]/20 text-[#7c3bed] mb-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-white">Forgot Password</h1>
                        <p className="text-[#a692c8] text-sm font-medium">
                            {success
                                ? "We've sent you a password reset link"
                                : "Enter your email to reset your password"
                            }
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success ? (
                        <div className="flex flex-col gap-4">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm text-center">
                                <p className="font-medium mb-2">Check your email!</p>
                                <p className="text-green-400/80">
                                    If an account exists with that email, you&apos;ll receive a password reset link shortly.
                                </p>
                            </div>

                            {/* For testing - show reset link */}
                            {resetToken && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-400 text-sm">
                                    <p className="font-medium mb-2">🔧 Development Mode</p>
                                    <p className="text-yellow-400/80 mb-2">Reset token (would be sent via email in production):</p>
                                    <Link
                                        href={`/reset-password?token=${resetToken}`}
                                        className="text-[#7c3bed] hover:text-white underline break-all"
                                    >
                                        Click here to reset password
                                    </Link>
                                </div>
                            )}

                            <Link
                                href="/login"
                                className="relative w-full rounded-xl bg-[#7c3bed] hover:bg-[#6b2bd6] h-12 text-white text-base font-bold shadow-lg shadow-[#7c3bed]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* Form Section */
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
                                    <span>Send Reset Link</span>
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
