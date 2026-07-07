"use client";

import { useState } from "react";
// import api from "@/lib/axios"; // We will use this for API calls

export default function DashboardPage() {
    // Temporary static state for UI building
    const [isPremium] = useState(false);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_34%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#0b1120_100%)] text-white selection:bg-cyan-500/30">
            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Navbar / Header */}
                <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
                        <p className="text-sm text-slate-400">Manage your tasks and boost productivity.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isPremium && (
                            <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                                Unlock Unlimited ($5)
                            </button>
                        )}
                        <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10">
                            Add New Task
                        </button>
                    </div>
                </header>

                {/* Kanban Board Layout */}
                <div className="grid gap-6 md:grid-cols-3">

                    {/* To Do Column */}
                    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-cyan-500/5 p-4 backdrop-blur-xl sm:p-5">
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                                <h2 className="font-semibold text-slate-100">To Do</h2>
                            </div>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">2</span>
                        </div>

                        {/* Sample Task Card */}
                        <div className="group cursor-pointer rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan-500/10">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex rounded-full bg-fuchsia-500/15 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-200">Feature</span>
                                    <h3 className="mt-3 font-semibold text-white">Design Landing Page</h3>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">P1</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2">Create a modern glassmorphic landing page using Tailwind CSS with premium polish.</p>
                            <div className="mt-5 flex items-center justify-between">
                                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">Move →</span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-semibold text-cyan-100 ring-1 ring-cyan-400/20">RA</div>
                            </div>
                        </div>

                        <div className="group cursor-pointer rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan-500/10">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-200">Urgent</span>
                                    <h3 className="mt-3 font-semibold text-white">Prepare Sprint Backlog</h3>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">P0</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2">Prioritize the upcoming release tasks and confirm ownership.</p>
                            <div className="mt-5 flex items-center justify-between">
                                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">Move →</span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-400/15 text-xs font-semibold text-fuchsia-100 ring-1 ring-fuchsia-400/20">MK</div>
                            </div>
                        </div>
                    </section>

                    {/* In Progress Column */}
                    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-blue-500/5 p-4 backdrop-blur-xl sm:p-5">
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.8)]" />
                                <h2 className="font-semibold text-slate-100">In Progress</h2>
                            </div>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">1</span>
                        </div>

                        {/* Sample Task Card */}
                        <div className="group cursor-pointer rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/30 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] font-semibold text-blue-200">Backend</span>
                                    <h3 className="mt-3 font-semibold text-white">Backend Authentication</h3>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">P1</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2">Implement JWT login and registration with secure session handling.</p>
                            <div className="mt-5 flex items-center justify-between">
                                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">Move →</span>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400/15 text-xs font-semibold text-blue-100 ring-1 ring-blue-400/20">JT</div>
                            </div>
                        </div>
                    </section>

                    {/* Done Column */}
                    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-emerald-500/5 p-4 backdrop-blur-xl sm:p-5">
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
                                <h2 className="font-semibold text-slate-100">Done</h2>
                            </div>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">1</span>
                        </div>

                        {/* Sample Task Card */}
                        <div className="group cursor-pointer rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur-md opacity-85 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/10 hover:opacity-100 hover:shadow-xl hover:shadow-emerald-500/10">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">Release</span>
                                    <h3 className="mt-3 font-semibold text-white line-through decoration-slate-500">Database Setup</h3>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">Done</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2">Configure Prisma ORM and Neon DB for deployment readiness.</p>
                            <div className="mt-5 flex items-center justify-end">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/20">RA</div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}