// path: src/app/actions/merge-guest-data.ts
"use server";

import { cookies } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Note } from "@/models/note";
import { GuestMergeLog } from "@/models/guest-merge-log";
import { createSafeNoInputAction } from "@/lib/safe-action";
import "@/lib/auth/types";

const GUEST_COOKIE = "guest_session_id";

/**
 * All Mongoose models that extend BaseSchema and need migration.
 * Add new models here as the application grows.
 */
const MERGEABLE_MODELS = [{ model: Note, name: "Note" }] as const;

interface MergeResult {
    mergedCount: number;
    alreadyMerged: boolean;
}

/**
 * mergeGuestData — Transactional guest→user data migration.
 *
 * Protocol:
 *   1. Verify authenticated user via auth()
 *   2. Read guest_session_id from cookies
 *   3. Check idempotency (skip if already merged)
 *   4. Start Mongoose transaction
 *   5. updateMany({ ownerId: guestId } → { ownerId: userEmail }) per model
 *   6. Write GuestMergeLog audit record
 *   7. Commit transaction
 *   8. Delete guest_session_id cookie
 *   9. Return { success: true, mergedCount }
 *
 * Idempotency: If the DB commit succeeds but cookie deletion fails,
 * the next call will find the existing GuestMergeLog and short-circuit.
 */
export const mergeGuestData = createSafeNoInputAction<MergeResult>(
    async (): Promise<MergeResult> => {
        // Step 1: Verify authenticated user
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("Authentication required to merge guest data");
        }

        const userEmail = session.user.email;

        // Step 2: Read guest cookie
        const cookieStore = await cookies();
        const guestId = cookieStore.get(GUEST_COOKIE)?.value;

        if (!guestId) {
            // No guest session — nothing to merge
            return { mergedCount: 0, alreadyMerged: false };
        }

        // Step 3: Connect to DB
        await connectDB();

        // Step 4: Idempotency check — has this guest already been merged?
        const existingLog = await GuestMergeLog.findOne({
            guestId,
            userId: userEmail,
        }).lean();

        if (existingLog) {
            // Already merged — just clean up the stale cookie
            cookieStore.delete(GUEST_COOKIE);
            return { mergedCount: existingLog.totalMerged, alreadyMerged: true };
        }

        // Step 5: Start transaction
        const dbSession = await mongoose.startSession();

        try {
            let totalMerged = 0;
            const mergedModels: Array<{ model: string; count: number }> = [];

            await dbSession.withTransaction(async () => {
                // Step 6: Migrate each model
                for (const { model, name } of MERGEABLE_MODELS) {
                    // updateMany bypasses document-level immutable flag on ownerId
                    const result = await model.updateMany(
                        { ownerId: guestId },
                        { $set: { ownerId: userEmail } },
                        { session: dbSession }
                    );

                    const count = result.modifiedCount;
                    totalMerged += count;
                    mergedModels.push({ model: name, count });
                }

                // Step 7: Write audit log within same transaction
                await GuestMergeLog.create(
                    [
                        {
                            guestId,
                            userId: userEmail,
                            mergedModels,
                            totalMerged,
                            mergedAt: new Date(),
                        },
                    ],
                    { session: dbSession }
                );
            });

            // Step 8: Delete guest cookie (post-commit)
            // If this fails, idempotency check will catch it on next call
            try {
                cookieStore.delete(GUEST_COOKIE);
            } catch (cookieErr) {
                console.warn(
                    "[mergeGuestData] Cookie deletion failed (non-critical):",
                    cookieErr
                );
            }

            // Step 9: Return result
            return { mergedCount: totalMerged, alreadyMerged: false };
        } finally {
            await dbSession.endSession();
        }
    }
);
