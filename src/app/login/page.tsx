"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');

        if (user) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            showToast('Login successful. Welcome back!', 'success');
            router.push('/dashboard');
        } catch (err: unknown) {
            const errorMessage = getAuthErrorMessage(err, 'Login failed. Please try again.');
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_34%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#0b1120_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
                <section className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200/80">
                            Welcome back
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Sign in to your account
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Use your email and password to continue.
                        </p>
                    </div>

                    {/* Error Massage UI */}
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-center border border-red-500/50">
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    {/* 3. Fix: onSubmit add kora holo */}
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                // 2. Fix: value ar onChange add kora holo
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/25"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                // 2. Fix: value ar onChange add kora holo
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/25"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-300">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 transition hover:text-cyan-100 hover:decoration-cyan-100"
                        >
                            Register here
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

function getAuthErrorMessage(error: unknown, fallback: string) {
    if (typeof error !== "object" || error === null || !("response" in error)) {
        return fallback;
    }

    const responseError = error as { response?: { data?: { message?: unknown } } };
    const message = responseError.response?.data?.message;

    return typeof message === "string" && message.trim() ? message : fallback;
}
