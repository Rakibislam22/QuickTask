import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.25),rgba(15,23,42,0.7))]" />
      <div className="relative flex min-h-screen items-center justify-center px-6 py-20 sm:px-10 lg:px-12">
        <section className="relative w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-16 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium tracking-[0.2em] text-cyan-100/90 uppercase">
              QuickTask
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-7xl">
              QuickTask: Manage Tasks. Unlock Productivity.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A minimal SaaS task management tool built for efficiency, clarity,
              and momentum. Organize work, stay focused, and move faster with a
              clean interface designed to keep distractions out of the way.
            </p>
            <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-14 items-center justify-center rounded-full bg-cyan-300 px-8 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.45)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Get Started / Register
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-cyan-300/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
