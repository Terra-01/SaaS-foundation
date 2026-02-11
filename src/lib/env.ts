// path: src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url("MONGODB_URI must be a valid connection string"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = getEnv();
