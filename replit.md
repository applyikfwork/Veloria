# Veloria Wedding Platform

A luxury digital Indian wedding invitation platform called **Veloria** that allows couples to create cinematic, personalized wedding invitations with full guest management, RSVP tracking, and more.

## Run & Operate

- `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/wedding-platform run dev` — run the Veloria frontend (port 5000)
- `PORT=8080 pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion + shadcn/ui
- Auth: Supabase Auth
- DB: Supabase (PostgreSQL)
- API: Express 5 with Google Gemini AI
- Validation: Zod
- Build: Vite (CJS/ESM)

## Where things live

- `artifacts/wedding-platform/src/pages/` — all page components (home, invitation, rsvp, dashboard, checkin, etc.)
- `artifacts/wedding-platform/src/components/` — shared UI components (navbar, AuthModal, etc.)
- `artifacts/wedding-platform/src/hooks/useAuth.ts` — Supabase auth hook
- `artifacts/wedding-platform/src/lib/supabase.ts` — Supabase client
- `artifacts/api-server/src/routes/ai.ts` — AI routes (quiz, hashtag, translate, story)
- `SUPABASE_SETUP.sql` — DB schema for Supabase tables

## Architecture decisions

- Supabase handles auth + database (no separate backend DB needed for wedding data)
- AI features (hashtag generator, quiz, translation, story writer) go through the Express API server which proxies to Gemini
- The invitation page loads all features client-side using the slug from the URL
- Framer Motion used for all animations throughout the app
- Multi-language translation is done on-the-fly via AI API call when language is changed

## Product

Veloria is a luxury digital Indian wedding invitation platform with:

1. **Animated Video Invitations** — cinematic video invitations auto-generated from couple details
2. **Live Countdown Timer** — animated countdown to the wedding (glows when < 24 hours)
3. **Digital Save-the-Date** — beautiful single-card teaser for early sharing
4. **Cinematic Photo Reveal** — timed slideshow of couple/family photos with music
5. **Personalized Guest Greetings** — guest name embedded via URL query param (?guest=Name)
6. **Multi-Event Invitations** — each event (Mehndi, Sangeet, Wedding) gets its own page/link
7. **Interactive RSVP** — multi-step form with meal preferences, plus-one, event selection
8. **WhatsApp Blast** — send invitations to entire guest list from the dashboard
9. **QR Code Check-in** — unique QR per guest, staff scans on wedding day
10. **Interactive Venue Map** — embedded Google Maps with directions button
11. **Couple's Love Quiz** — interactive quiz for guests ("How well do you know the couple?")
12. **Guest Wishes Wall** — guests leave video/photo/text blessings on the invitation page
13. **Wedding Hashtag Generator** — AI generates the perfect wedding hashtag
14. **Shareable Story Card** — one-tap Instagram Stories / WhatsApp Status export
15. **AI Story Writer** — personalized heartfelt messages for each guest
16. **Multi-Language Invitations** — translate to Hindi, Tamil, Punjabi, Telugu, Gujarati, etc.
17. **Digital Memory Book** — downloadable PDF of all wishes, RSVPs, and memories

## User preferences

- Brand name: **Veloria** (not "Vivah" or anything else)
- Style: luxury, cinematic, Indian wedding aesthetic
- Dark theme with gold (#D4AF37) as primary color

## Gotchas

- Supabase URL/key are in `.replit` as userenv — do not hardcode them
- The app requires `PORT` and `BASE_PATH` env vars at startup (set in artifact.toml)
- Port 20823 → external port 3000 via `.replit` port mapping
