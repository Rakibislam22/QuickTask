import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0f1c] text-white selection:bg-cyan-500/30">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.8),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 py-20 sm:px-10 lg:px-12">
        
        {/* --- HERO SECTION (Refined & Centered) --- */}
        <section className="flex flex-col items-center justify-center pt-10 text-center sm:pt-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase backdrop-blur-md">
            ✨ Meet QuickTask
          </div>
          
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 sm:text-6xl lg:text-7xl">
            Simple Task Manager <br /> with Payment Unlock
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
            A minimal SaaS task management tool built for efficiency, clarity, and momentum. Organize your work, stay focused, and move faster without the clutter.
          </p>
          
          <div className="mt-10 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-cyan-400 px-8 text-base font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] focus:outline-none"
            >
              Get Started for Free
            </Link>
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 focus:outline-none"
            >
              Log into Account
            </Link>
          </div>
        </section>

        {/* --- FEATURES SECTION (Clean 3-Column Grid) --- */}
        <section className="relative mt-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to move faster.
            </h2>
            <p className="mt-4 text-slate-400">Simple, secure, and powerful tools for your daily workflow.</p>
          </div>

          {/* Equal Grid Layout (Organized & Clean) */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Feature 1 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors hover:border-cyan-500/30 hover:bg-white/[0.05]">
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Intuitive Kanban</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Plan, prioritize, and ship in a clean workflow. Drag and drop tasks effortlessly across To-Do, In Progress, and Done.
                </p>
              </div>
            </article>

            {/* Feature 2 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors hover:border-cyan-500/30 hover:bg-white/[0.05]">
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Secure JWT Auth</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Industry-standard JSON Web Tokens keep your data safe. Private routes and encrypted sessions for total peace of mind.
                </p>
              </div>
            </article>

            {/* Feature 3 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors hover:border-cyan-500/30 hover:bg-white/[0.05]">
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Premium Stripe Unlock</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Start for free, upgrade when you need power. Seamless and secure one-time payment processing via Stripe.
                </p>
              </div>
            </article>

          </div>
        </section>

        {/* --- HOW IT WORKS SECTION (Minimal & Clean) --- */}
        <section className="relative pb-20 pt-10">
          <div className="grid gap-8 border-t border-white/10 pt-16 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl font-bold text-cyan-400">1</span>
              <h3 className="text-lg font-semibold text-white">Create Account</h3>
              <p className="mt-2 text-sm text-slate-400">Sign up in seconds and get moving.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl font-bold text-cyan-400">2</span>
              <h3 className="text-lg font-semibold text-white">Organize Workflow</h3>
              <p className="mt-2 text-sm text-slate-400">Plan tasks and keep priorities visible.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl font-bold text-cyan-400">3</span>
              <h3 className="text-lg font-semibold text-white">Unlock Premium</h3>
              <p className="mt-2 text-sm text-slate-400">Upgrade when you need advanced power.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
