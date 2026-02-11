// path: src/app/(protected)/dashboard/layout.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { mergeGuestData } from "@/app/actions/merge-guest-data";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const hasMerged = useRef(false);
    const [mergeStatus, setMergeStatus] = useState<string | null>(null);

    useEffect(() => {
        if (hasMerged.current) return;
        hasMerged.current = true;

        async function attemptMerge() {
            const result = await mergeGuestData();

            if (!result.success) {
                console.warn("[DashboardLayout] Merge failed:", result.error);
                return;
            }

            if (result.data.alreadyMerged) {
                // Silent — data was already migrated in a previous session
                return;
            }

            if (result.data.mergedCount > 0) {
                setMergeStatus(
                    `✅ Migrated ${result.data.mergedCount} item(s) from your guest session.`
                );

                // Auto-dismiss after 5 seconds
                setTimeout(() => setMergeStatus(null), 5000);
            }
        }

        attemptMerge();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Merge notification banner */}
            {mergeStatus && (
                <div className="bg-emerald-900/60 border-b border-emerald-700/50 px-4 py-3 text-center text-sm text-emerald-200 backdrop-blur-sm">
                    {mergeStatus}
                </div>
            )}

            {/* Dashboard shell */}
            <nav className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
                    <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        SaaS Foundation
                    </span>
                    <form action="/api/auth/signout" method="POST">
                        <button
                            type="submit"
                            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
    );
}
