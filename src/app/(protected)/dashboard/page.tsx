// path: src/app/(protected)/dashboard/page.tsx
import { getCurrentOwner } from "@/lib/auth/get-owner";

export default async function DashboardPage() {
    const owner = await getCurrentOwner();

    return (
        <div className="space-y-8">
            {/* Identity card */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <h1 className="text-2xl font-bold tracking-tight mb-4">Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-zinc-800/40 p-4">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                            Owner ID
                        </p>
                        <p className="text-sm font-mono text-zinc-300 break-all">
                            {owner.ownerId}
                        </p>
                    </div>
                    <div className="rounded-xl bg-zinc-800/40 p-4">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                            Session Type
                        </p>
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${owner.type === "user"
                                    ? "bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-700/50"
                                    : "bg-amber-900/50 text-amber-300 ring-1 ring-amber-700/50"
                                }`}
                        >
                            {owner.type === "user" ? "Authenticated" : "Guest"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Notes", "Calculators", "Checklists"].map((vertical) => (
                    <div
                        key={vertical}
                        className="group rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 hover:border-zinc-700/60 hover:bg-zinc-900/50 transition-all duration-300"
                    >
                        <h3 className="font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors">
                            {vertical}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500">
                            Your {vertical.toLowerCase()} will appear here.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
