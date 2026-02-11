// path: src/lib/auth/auth.ts
//
// 🖥️  NODE-ONLY — Full Auth.js initialization with DB callbacks.
//     Import this in Server Actions / API routes, NEVER in middleware.
//
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { UserRole, UserPlan } from "./types";
import "@/lib/auth/types"; // side-effect import for module augmentation

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,

    // Session strategy — JWT (no DB adapter needed)
    session: { strategy: "jwt" },

    callbacks: {
        ...authConfig.callbacks,

        async jwt({ token, user, trigger }) {
            // On initial sign-in, seed role + plan
            if (user) {
                token.role = (user.role as UserRole) ?? "USER";
                token.plan = (user.plan as UserPlan) ?? "FREE";
            }

            // Allow manual session updates (e.g., after plan upgrade)
            if (trigger === "update") {
                // Re-fetch from DB if needed in the future
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = token.role;
                session.user.plan = token.plan;
            }
            return session;
        },
    },
});
