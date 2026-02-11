// path: src/models/note.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";
import { applyBaseSchema } from "./base";

export interface INote extends Document {
    ownerId: string;
    title: string;
    content: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title must be under 200 characters"],
    },
    content: {
        type: String,
        default: "",
    },
});

// Apply base fields: ownerId, isArchived, timestamps
applyBaseSchema(noteSchema);

export const Note: Model<INote> =
    mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);
