# AI Companion Frontend

This project is a Next.js based web application called **Knolia**. It provides a conversational interface to an AI companion. The application connects to a backend service via REST APIs and WebSockets, allowing users to chat with an AI that learns from their conversations.

## Purpose
- Offer a "personalized AI companion" experience.
- Manage user authentication, sessions and settings.
- Provide an interactive UI with overlays for login, settings, credits, etc.

## Tech Stack
- **Next.js 15** with the `/app` directory architecture.
- **React** and **TypeScript** for UI components.
- **Tailwind CSS** for styling.
- **NextAuth** with **Supabase** credentials for authentication.
- **Zustand** store for client side state management.
- Communication with the backend via `fetch` and WebSockets defined in `lib/api` and components like `InteractionHubEnhanced`.

## Repository Structure
- `app/` – Next.js pages and API routes. Notably:
  - `(app)/` – main layout and landing page (`layout.tsx`, `page.tsx`).
  - `(info)/` – informational pages like welcome, privacy, terms, etc.
  - `api/` – Next.js API routes (e.g. authentication).
- `components/` – React components including overlays, UI elements, and the interaction hub.
- `lib/` – Helper libraries and API wrappers. Contains authentication setup (`lib/auth.ts`) and various API functions under `lib/api`.
- `store/` – Zustand store (`store/index.ts`) managing UI state and user preferences.
- `hooks/` – Reusable React hooks.
- `types/` – TypeScript type definitions.
- `public/` – Static assets.

## How it Works
1. **Authentication** – Users authenticate using credentials. `lib/auth.ts` configures NextAuth with Supabase and stores tokens in the session.
2. **Main Page** – `app/(app)/page.tsx` renders the background, the main interaction hub, and disables scrolling while active.
3. **Interaction** – `components/core/InteractionHubEnhanced.tsx` manages WebSocket connections to the backend, handles speech recognition, audio playback, and conversation state.
4. **Overlays** – `components/layout/RenderOverlays.tsx` renders modal overlays (login, settings, credits, etc.) controlled by the Zustand store.
5. **State Management** – `store/index.ts` stores UI flags (open/close state of overlays, user preferences, pilot program status, etc.) and persists selected fields to `localStorage` via the `persist` middleware.

## Development
```bash
npm install       # install dependencies
npm run dev       # start the development server
npm run lint      # run ESLint
npm run build     # create a production build
```

This file provides a high level view for contributors who are new to the project.
