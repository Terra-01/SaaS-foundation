// path: src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth/auth.config";
import { v4 as uuidv4 } from "uuid";

const GUEST_COOKIE = "guest_session_id";
const GUEST_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
    const { nextUrl } = req;
    const response = NextResponse.next();

    // If user has an active auth session, skip guest cookie generation
    // The auth token is set by next-auth under `authjs.session-token`
    const authToken =
        req.cookies.get("authjs.session-token")?.value ??
        req.cookies.get("__Secure-authjs.session-token")?.value;

    if (authToken) {
        // Authenticated user — no guest session needed
        return response;
    }

    // No auth session: ensure guest_session_id cookie exists
    const existingGuest = req.cookies.get(GUEST_COOKIE)?.value;

    if (!existingGuest) {
        const guestId = `guest_${uuidv4()}`;

        response.cookies.set(GUEST_COOKIE, guestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: GUEST_COOKIE_MAX_AGE,
            path: "/",
        });
    }

    return response;
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico and common static files
         * - API auth routes (handled by Auth.js)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
