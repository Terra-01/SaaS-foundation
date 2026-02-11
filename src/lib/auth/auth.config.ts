// path: src/lib/auth/auth.config.ts
//
// ⚠️  EDGE-SAFE — No Mongoose, no Node-only imports.
//     This file is imported by `middleware.ts` which runs at the Edge.
//
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

const publicRoutes = ["/", "/auth/signin", "/auth/error"];

export default {
    providers: [GitHub],

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },

    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

            // Public routes: always allow
            if (isPublicRoute) return true;

            // Protected routes require auth OR will be handled by guest fallback
            // (returning true allows middleware to proceed; the guest cookie logic
            //  runs separately in middleware.ts)
            return true;
        },
    },
} satisfies NextAuthConfig;
