// path: src/lib/safe-action.ts
//
// ⚠️ NOT a "use server" file — this is a utility module.
//    The "use server" directive belongs on the action files that import this.
//
import { type ZodType } from "zod";

export type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

/**
 * Wraps a Server Action handler with Zod validation and normalized error handling.
 *
 * @example
 * ```ts
 * // In a "use server" file:
 * export const myAction = createSafeAction(mySchema, async (data) => {
 *   return { result: "ok" };
 * });
 * ```
 */
export function createSafeAction<TInput, TOutput>(
    schema: ZodType<TInput>,
    handler: (validatedInput: TInput) => Promise<TOutput>
): (rawInput: TInput) => Promise<ActionResult<TOutput>> {
    return async (rawInput: TInput) => {
        try {
            const parsed = schema.safeParse(rawInput);

            if (!parsed.success) {
                const fieldErrors = parsed.error.flatten().fieldErrors;
                const message = Object.entries(fieldErrors)
                    .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
                    .join("; ");

                return { success: false, error: `Validation failed: ${message}` };
            }

            const data = await handler(parsed.data);
            return { success: true, data };
        } catch (err) {
            console.error("[safe-action] Unhandled error:", err);

            const message =
                err instanceof Error ? err.message : "An unexpected error occurred";

            return { success: false, error: message };
        }
    };
}

/**
 * Shorthand for actions that require no input validation.
 */
export function createSafeNoInputAction<TOutput>(
    handler: () => Promise<TOutput>
): () => Promise<ActionResult<TOutput>> {
    return async () => {
        try {
            const data = await handler();
            return { success: true, data };
        } catch (err) {
            console.error("[safe-action] Unhandled error:", err);

            const message =
                err instanceof Error ? err.message : "An unexpected error occurred";

            return { success: false, error: message };
        }
    };
}
