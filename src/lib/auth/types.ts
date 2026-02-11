// path: src/lib/auth/types.ts
import type { DefaultSession } from "next-auth";

export type UserRole = "USER" | "ADMIN";
export type UserPlan = "FREE" | "PRO";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            plan: UserPlan;
        } & DefaultSession["user"];
    }

    interface User {
        role?: UserRole;
        plan?: UserPlan;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        role: UserRole;
        plan: UserPlan;
    }
}

export interface OwnerIdentity {
    ownerId: string;
    type: "user" | "guest";
}
