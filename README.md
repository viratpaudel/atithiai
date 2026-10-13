﻿# Atithi AI

A hotel **guest-concierge + staff-dashboard prototype** built with **Vite + React 18 + Tailwind CSS 3 + framer-motion + lucide-react**.

This is a frontend-only prototype. There is **no backend, database, or API** — all data is demo data and the concierge is a keyword-based stub that runs entirely in the browser.

## What's inside

- **Guest app** (`/`): a mobile-style concierge with Home, Discover, AI Concierge, Services, Lens, and Profile tabs. Weather can be simulated to demo an AI itinerary intervention (rain swaps an outdoor walk for indoor alternatives).
- **Admin dashboard** (`/admin`): a staff view showing the live weather context, AI intervention status, and guest activity.
- **Demo controls**: floating widget to switch between the guest app and admin dashboard and to trigger/reset the simulated rain. It is visible when running `npm run dev`, or on any deployment when the URL contains `?demo=1`. It is hidden otherwise.
- **AI Concierge stub**: matches keywords in the guest's message (spa, towels, dining, transport, booking) and creates a mock request. Messages containing negations like "not", "don't", "do not", "no need", or "cancel" do **not** create a request.

## Setup

```bash
npm install
npm run dev      # start the dev server (frontend only)
npm run build    # production build (output in dist/)
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## AI concierge (serverless)

The chat endpoint `POST /api/chat` is a Vercel serverless function (`api/chat.js`) that calls the Gemini API (`gemini-2.0-flash`) server-side. The key is never exposed to the client.

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY=<your key>` (get one from Google AI Studio).
2. Test locally with the Vercel CLI, which serves both the Vite app and the `api/` functions:

```bash
npx vercel dev   # app on http://localhost:3000, /api/chat included
```

Without a key, `/api/chat` returns a polite fallback reply and the frontend automatically falls back to the built-in keyword matcher, so the demo still works.

On Vercel, add `GEMINI_API_KEY` in Project Settings → Environment Variables.

## Atithi Lens (camera explanation)

The guest points the phone camera at something (temple sign, menu, monument, price board, plant) and gets an explanation in their language (EN / हिं toggle).

- Component: `src/components/guest/LensTab.jsx` — 6th tab in the guest bottom nav (Camera icon). It uses `<input type="file" accept="image/*" capture="environment">` (no camera-permission code needed), downscales the photo client-side to max 1024px width via canvas, converts it to JPEG base64, calls `/api/lens`, and shows the result as a card: title, explanation, etiquette chips, translated text, fair-price verdict badge, speaker button (speechSynthesis) and an "Ask Atithi about this" button that opens the AI tab prefilled. Includes a loading skeleton, error state, and the disclaimer **"AI estimate. Verify locally."**
- Endpoint: `POST /api/lens` (`api/lens.js`) — accepts `{ imageBase64, language: "en" | "hi", note? }` (JPEG base64, no `data:` prefix), rejects payloads over ~4MB, calls Gemini with `inlineData` (mime `image/jpeg`) and `responseMimeType: application/json`, uses `GEMINI_MODEL` (default `gemini-2.0-flash`) with a 15s timeout, and always returns a friendly 200 fallback on failure. Response shape:

```json
{
  "whatIsThis": "...",
  "explanation": "...",
  "etiquette": ["..."],
  "translatedText": "... | null",
  "fairPrice": { "applicable": false, "estimateINR": "", "verdict": "unknown", "note": "" },
  "confidence": "low | medium | high"
}
```

The prompt never claims certainty, labels price estimates as rough ranges, and refuses to fabricate history or facts.

### Environment variables

| Variable | Used by | Default | Notes |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | `/api/chat`, `/api/lens` | — | Required for live AI; without it both endpoints return polite fallbacks |
| `GEMINI_MODEL` | `/api/lens` | `gemini-2.0-flash` | Optional; override to a multimodal-capable model if desired |

## Live weather

`AppContext` fetches real weather for Dehradun from Open-Meteo (no API key). If it is raining or the 4 PM precipitation probability is ≥ 60%, the AI intervention flow triggers automatically. The "Trigger Rain" demo button remains as a manual override — once clicked, live weather no longer overrides your choice.

## Folder structure

```
src/
  main.jsx
  App.jsx                      # router + shell only
  data/guest.js                # demo data (guest, itinerary, experiences, requests)
  context/AppContext.jsx       # weather (live + demo), itinerary, requests state + actions
  components/
    DemoControls.jsx           # floating demo widget (?demo=1 / dev only)
    guest/
      GuestApp.jsx  HomeTab.jsx  DiscoverTab.jsx  AITab.jsx
      ServicesTab.jsx  ProfileTab.jsx  ProfileToggle.jsx  NavIcon.jsx  LensTab.jsx
    admin/
      AdminDashboard.jsx  SidebarItem.jsx  StatCard.jsx
api/
  chat.js                      # Vercel serverless function (Gemini concierge)
  lens.js                      # Vercel serverless function (Gemini camera lens)
```

## Routes

- `/` — guest app
- `/admin` — admin dashboard
- `*` — redirects to `/`

## Demo flag

Append `?demo=1` to the URL to show the demo controls in a production build (e.g. `https://example.com/?demo=1`). In development the controls are always visible.

## PWA metadata

`index.html` includes a theme color, description, apple-touch-icon, and a link to `public/manifest.webmanifest`. The manifest references placeholder icons at `/icons/icon-192.png` and `/icons/icon-512.png` — **add these images to `public/icons/`**.

## Roadmap

- Real backend + PostgreSQL
- LLM concierge with tool calling (the Gemini endpoint is the first step; the keyword matcher is now its fallback)
- Secure per-room QR authentication
- Multilingual support
- Maps integration (the `show_places` action already stores the query)
- Dark mode

> Note: earlier drafts of this README mentioned Next.js, FastAPI, OpenAI keys, and multi-agent workflows. Those claims were inaccurate — this project is a Vite + React frontend prototype with a single Vercel serverless function.
