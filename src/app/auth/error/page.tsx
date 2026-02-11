// path: src/app/auth/error/page.tsx
import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm text-center space-y-6">
                <div className="text-4xl">⚠️</div>
                <h1 className="text-xl font-bold text-zinc-100">
                    Authentication Error
                </h1>
                <p className="text-sm text-zinc-500">
                    Something went wrong during sign-in. Please try again.
                </p>
                <Link
                    href="/auth/signin"
                    className="inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}
