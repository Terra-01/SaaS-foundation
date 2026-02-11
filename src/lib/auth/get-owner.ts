// path: src/lib/auth/get-owner.ts
import { cookies } from "next/headers";
import { auth } from "./auth";
import type { OwnerIdentity } from "./types";
import "@/lib/auth/types";

const GUEST_COOKIE = "guest_session_id";

/**
 * getCurrentOwner — THE single source of truth for identity resolution.
 *
 * Priority:
 *   1. Authenticated session → { ownerId: user.email, type: 'user' }
 *   2. Guest cookie         → { ownerId: guestId,     type: 'guest' }
 *   3. Throws               → No identity available
 *
 * ⚠️  This is the ONLY file allowed to resolve user identity.
 *     No ad-hoc cookie reading in components or queries.
 */
export async function getCurrentOwner(): Promise<OwnerIdentity> {
    // 1. Check authenticated session first (strict override)
    const session = await auth();

    if (session?.user?.email) {
        return { ownerId: session.user.email, type: "user" };
    }

    // 2. Fall back to guest cookie
    const cookieStore = await cookies();
    const guestId = cookieStore.get(GUEST_COOKIE)?.value;

    if (guestId) {
        return { ownerId: guestId, type: "guest" };
    }

    // 3. No identity — should not happen if middleware is configured correctly
    throw new Error(
        "No identity found. Ensure middleware sets guest_session_id cookie."
    );
}

/**
 * Helper to extract the raw guest cookie value.
 * Only used by the merge action — NOT for general identity resolution.
 */
export async function getGuestSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(GUEST_COOKIE)?.value;
}

export { GUEST_COOKIE };
