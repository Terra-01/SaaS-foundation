// path: src/models/guest-merge-log.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IGuestMergeLog extends Document {
    guestId: string;
    userId: string;
    mergedModels: Array<{ model: string; count: number }>;
    totalMerged: number;
    mergedAt: Date;
}

const guestMergeLogSchema = new Schema<IGuestMergeLog>(
    {
        guestId: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        mergedModels: [
            {
                model: { type: String, required: true },
                count: { type: Number, required: true, min: 0 },
            },
        ],
        totalMerged: {
            type: Number,
            required: true,
            min: 0,
        },
        mergedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index for idempotency lookups
guestMergeLogSchema.index({ guestId: 1, userId: 1 });

export const GuestMergeLog: Model<IGuestMergeLog> =
    mongoose.models.GuestMergeLog ||
    mongoose.model<IGuestMergeLog>("GuestMergeLog", guestMergeLogSchema);
