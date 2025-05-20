# Codebase Overview

This project is a Next.js (React) frontend for **Knolia**, a personalized AI companion application. It communicates with a backend service to provide voice and text conversations, manage user accounts, and store conversation history.

## Purpose
- Offer a web interface where users can chat with the AI via text or voice.
- Handle authentication using NextAuth and Supabase.
- Interact with a backend API for orchestration, voice processing, and knowledge extraction.

## Project Structure
- `app/(app)` – Main application routes (home page and layout).
- `app/(info)` – Informational pages such as privacy policy, terms, contact, and a welcome page.
- `components/` – Reusable React components (headers, footers, UI elements, and core interaction components).
- `lib/` – Helper modules including API wrappers (`lib/api/*`), authentication setup (`lib/auth.ts`), and utility functions.
- `store/` – Zustand store for UI state and user preferences.
- `types/` – TypeScript type definitions for message payloads and NextAuth session extensions.
- `public/` – Static assets (images, manifest, service worker, etc.).
- `info/` – Reference material in Markdown/PDF used by the project.

## Getting Started
- `npm run dev` – Start the development server.
- Environment variables (Supabase, backend URL, etc.) must be configured for API calls and authentication.

This file serves as a short orientation for newcomers to understand the overall layout and goal of the repository.
