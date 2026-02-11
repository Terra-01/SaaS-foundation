// path: src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            SaaS Foundation
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-indigo-800/50 bg-indigo-950/30 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm">
            Hybrid Auth · Guest + OAuth
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Production-Grade
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              SaaS Foundation
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Start building immediately. Guest users create data without
            sign-up — then seamlessly merge everything when they authenticate.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all"
            >
              Try as Guest
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all"
            >
              Sign in with GitHub
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              "Next.js 15",
              "Auth.js v5",
              "MongoDB + Mongoose",
              "Zod Validated",
              "Edge-Ready",
              "Transactional Merge",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 text-xs text-zinc-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-6 text-center text-xs text-zinc-600">
        SaaS Foundation Boilerplate
      </footer>
    </div>
  );
}
