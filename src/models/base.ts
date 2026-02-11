// path: src/models/base.ts
import { Schema, type SchemaOptions } from "mongoose";

/**
 * BaseSchema plugin — adds standard fields to every Mongoose model:
 *   - ownerId  (String, required, indexed, immutable at document level)
 *   - isArchived (Boolean, defaults false)
 *   - timestamps (createdAt, updatedAt)
 *
 * Note: `mergeGuestData` uses `Model.updateMany()` which bypasses
 * document-level middleware and the immutable flag intentionally.
 */
export function applyBaseSchema(schema: Schema, _opts?: SchemaOptions): void {
    schema.add({
        ownerId: {
            type: String,
            required: [true, "ownerId is required"],
            index: true,
            immutable: true,
        },
        isArchived: {
            type: Boolean,
            default: false,
            index: true,
        },
    });

    schema.set("timestamps", true);

    // Soft-delete: exclude archived docs from default queries
    schema.pre(/^find/, function (this: any) {
        if (this.getFilter().isArchived === undefined) {
            this.where({ isArchived: false });
        }
    });
}
