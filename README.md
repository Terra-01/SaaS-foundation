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