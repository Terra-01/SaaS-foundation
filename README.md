# SaaS Foundation

A production-grade **Next.js 15 (App Router)** boilerplate featuring **Hybrid Authentication** (Guest + GitHub OAuth) and transactional data merging.

## Features

* **Hybrid Auth:** Frictionless Guest access that upgrades to Authenticated User.
* **Transactional Merge:** Atomic `Guest -> User` data migration with rollback safety.
* **Strict Architecture:** Single source of truth for identity (`getCurrentOwner`).
* **Tech Stack:** TypeScript, Tailwind, MongoDB (Mongoose), Auth.js v5, Zod.

## Getting Started

1.  **Clone & Install**
    ```bash
    git clone <your-repo-url>
    cd saas-foundation
    npm install
    ```

2.  **Environment Setup**
    Copy the example env file and fill in your values.
    ```bash
    cp .env.example .env.local
    ```

3.  **Database**
    Ensure your MongoDB instance is running as a **Replica Set** (required for transactions).

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Documentation for AI & Architecture

This project enforces strict architectural invariants (Edge vs. Node isolation, Immutable Owner IDs).
* See **`AI_CONTEXT.md`** for the architectural rulebook, diagrams, and logic flows.
* If you are an LLM (Claude, Cursor, Copilot), **read `AI_CONTEXT.md` first**.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

# Walkthrough

## Project Structure

```
src/
├── app/
│   ├── (protected)/dashboard/
│   │   ├── layout.tsx          ← Client: triggers mergeGuestData on mount
│   │   └── page.tsx            ← Server: shows owner identity
│   ├── actions/
│   │   ├── __tests__/
│   │   │   └── merge-guest-data.test.ts  ← Integration test pseudo-code
│   │   └── merge-guest-data.ts ← Transactional merge server action
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts            ← Auth.js API handler
│   ├── auth/
│   │   ├── error/page.tsx
│   │   └── signin/page.tsx     ← GitHub OAuth sign-in
│   ├── globals.css
│   ├── layout.tsx              ← Root layout
│   └── page.tsx                ← Landing page
├── lib/
│   ├── auth/
│   │   ├── auth.config.ts      ← Edge-safe (no Mongoose)
│   │   ├── auth.ts             ← Node-only (JWT/session callbacks)
│   │   ├── get-owner.ts        ← getCurrentOwner() — single source of truth
│   │   ├── index.ts
│   │   └── types.ts            ← Module augmentation (role, plan)
│   ├── db/
│   │   └── mongodb.ts          ← Cached Mongoose connection
│   ├── cn.ts                   ← clsx + tailwind-merge
│   ├── env.ts                  ← Zod-validated env vars
│   └── safe-action.ts          ← Generic action wrapper with Zod + error normalization
├── middleware.ts                ← Auth check + guest_session_id cookie
└── models/
    ├── base.ts                 ← BaseSchema plugin (ownerId immutable, isArchived, timestamps)
    ├── guest-merge-log.ts      ← Audit log for merges
    ├── index.ts
    └── note.ts                 ← Example domain model
```

---

## Architecture: Edge vs Node

```mermaid
graph TD
    MW[middleware.ts — Edge Runtime] -->|imports| AC[auth.config.ts — Edge-safe]
    SA[Server Actions / API] -->|imports| AF[auth.ts — Node runtime]
    AF -->|extends| AC
    AF -->|imports| MG[Mongoose / MongoDB]
    MW -.->|"❌ NEVER imports"| MG
    GO[get-owner.ts] -->|imports| AF
    SA -->|calls| GO
```

- **Edge layer**: [middleware.ts](file:///Users/terra/Developer/saas-foundation/src/middleware.ts) + [auth.config.ts](file:///Users/terra/Developer/saas-foundation/src/lib/auth/auth.config.ts) — zero Node dependencies
- **Node layer**: [auth.ts](file:///Users/terra/Developer/saas-foundation/src/lib/auth/auth.ts) + [get-owner.ts](file:///Users/terra/Developer/saas-foundation/src/lib/auth/get-owner.ts) + all models — full DB access

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| [getCurrentOwner()](file:///Users/terra/Developer/saas-foundation/src/lib/auth/get-owner.ts#9-41) as single identity resolver | Prevents ad-hoc cookie reads across the codebase |
| `ownerId: immutable: true` + `updateMany()` bypass | Document-level safety with explicit override path for migrations |
| [GuestMergeLog](file:///Users/terra/Developer/saas-foundation/src/models/guest-merge-log.ts#4-11) idempotency check | Graceful recovery if cookie deletion fails post-commit |
| [safe-action.ts](file:///Users/terra/Developer/saas-foundation/src/lib/safe-action.ts) without `"use server"` | Factory functions aren't async — directive belongs on action files |
| Module augmentation targets `@auth/core/jwt` | Auth.js v5 beta re-exports JWT from `@auth/core`, not `next-auth/jwt` |

---

## Merge Protocol Flow

```mermaid
sequenceDiagram
    participant C as Client (Dashboard)
    participant A as mergeGuestData Action
    participant DB as MongoDB

    C->>A: Trigger on mount (once)
    A->>A: 1. Verify auth session
    A->>A: 2. Read guest_session_id cookie
    A->>DB: 3. Check GuestMergeLog (idempotency)
    alt Already merged
        A->>A: Delete stale cookie
        A-->>C: { alreadyMerged: true }
    else First merge
        A->>DB: 4. Start transaction
        A->>DB: 5. updateMany(ownerId: guest → user) per model
        A->>DB: 6. Create GuestMergeLog
        A->>DB: 7. Commit transaction
        A->>A: 8. Delete guest cookie
        A-->>C: { mergedCount: N }
    end
```

---

## Verification Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ Pass (0 errors) |
| `npm run build` | ✅ Compiled successfully |
| Static routes | `/ `, `/auth/signin`, `/auth/error`, `/_not-found` |
| Dynamic routes | `/api/auth/[...nextauth]`, `/dashboard` |

---

## Setup Instructions

1. Copy [.env.example](file:///Users/terra/Developer/saas-foundation/.env.example) → `.env.local` and fill in real values
2. Ensure MongoDB is running as a **replica set** (required for transactions)
3. Create a GitHub OAuth app at [github.com/settings/developers](https://github.com/settings/developers)
4. Run `npm run dev`
