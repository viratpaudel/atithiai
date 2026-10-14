# Release check: `final/release-check` → `main`

**Verdict: READY WITH CAVEATS** — all P0 blockers verified green; a list of demo-data gaps and manual steps is below.

## What was found and fixed
1. **`npm run lint` failed (1 error) on `src/App.jsx`**: `react/no-unknown-property` reported a bogus `lassName=` at line 15. Root cause: the file began with **two stacked UTF-8 BOMs**, which corrupted the plugin's JSX attribute-name extraction. Removing the BOMs fixed it; a minimal repro confirmed the file content itself was fine. **FIXED.**
2. Lint now reports **0 errors, 0 warnings** (`no-undef` and `react/jsx-no-undef` are enabled at error level via `js.configs.recommended` + `react` recommended — no hits in `src/` or `api/`).
3. `.env.example` now documents `GEMINI_API_KEY` and the optional `GEMINI_MODEL`.
4. Added `scripts/smoke.mjs`, a Playwright runtime smoke test (19 assertions), all passing.

## Runtime smoke test (Playwright + Chromium, `vite preview`, real assertions on every tab)
| Scenario | Result |
|---|---|
| a) clean localStorage, all 6 tabs | PASS |
| b) returning user (`atithi-started-exploring=true`) for ubud / lisbon / jaipur, all tabs | PASS ×3 |
| c) corrupted storage (invalid JSON profile/plan/chat/requests, invalid theme) | PASS |
| d) `localStorage` throwing (Safari private mode) | PASS |
| e) all `/api/*` requests aborted, 500, 429, and malformed JSON | PASS ×4 |
| interactions: theme toggle, "Demo mode" toggle, demo disruption (`?demo=1`), all tabs after | PASS ×4 |

**TOTAL: 19 checks, 0 failures.** No `pageerror` events and no error-boundary text appeared in any scenario.

## Build output
- `dist/assets/index-D7x5Xq5z.js` — 385.0 kB (gzip 118.0 kB) — single bundle
- `dist/assets/index-BrAywWHT.css` — 42.4 kB (gzip 8.1 kB)
- No chunk over 300 kB gzip. **Caveat:** the app is one bundle; there is no route-level lazy loading (`React.lazy`) and no map tab exists to lazy-load.

## Priority table (P0–P1)
| # | Area | Status | Notes |
|---|---|---|---|
| 1 | install/lint/build | PASS | lint 0/0; build succeeds |
| 2 | runtime smoke | PASS | 19/19 above |
| 3 | no-undef safety | PASS | rules on at error level; no hits |
| 4 | assets | **FAIL (data gap)** | see below |
| 5 | nav layout | NOT VERIFIED (see note) | see below |
| 6 | vercel.json SPA rewrite | PASS | `/api/(.*)` first, then `/((?!api/).*)` → `/index.html` |
| 7 | api/*.js functions | PASS | ESM, default handler, POST-only w/ 405, 200 fallback on any Gemini failure, timeout-wrapped |
| 8 | env vars / secrets | PASS | no key in src/, none in history, `.env*` gitignored; `GEMINI_MODEL` honored in lens.js — but chat.js hardcodes its model URL (see caveats) |
| 9 | live URL test | NOT VERIFIED | no URL provided |
| 10 | chunk sizes | PASS | 118 kB gzip total first load |

## Known demo-data gaps (NOT fabricated — must be added manually)
**All 8 image files are missing from `public/images/`, as are the icons, favicon and samples:**

Must be added (exact paths):
```
public/images/hero-bg.webp        (≤400 KB)
public/images/jaipur.webp         (≤250 KB)
public/images/ubud.webp
public/images/lisbon.webp
public/images/hidden-gems.webp
public/images/local-experiences.webp
public/images/taste-local.webp
public/images/empty-plan.webp
public/icons/icon-192.png
public/icons/icon-512.png
public/favicon.ico (or update index.html if you use a different filename)
public/samples/sample-menu.jpg
public/samples/sample-sign.jpg
public/samples/sample-transport.jpg
```
Note: the current UI does **not** reference `/images/*` or `/samples/*` anywhere — it uses Unsplash hotlinks (e.g. `HomeTab.jsx:46`). Either add the files **and** switch references to them, or ship with Unsplash (works online, fails offline). `public/manifest.webmanifest` references `/icons/icon-192.png` and `/icons/icon-512.png`; `index.html` references `/icons/icon-192.png` as apple-touch-icon. Until files exist, the PWA icon/apple-touch-icon will 404 (no broken-image icon in the UI itself, but Add-to-Home-Screen icon will be blank).

## Other caveats (MINOR, recommend before demo)
- **chat.js hardcodes** `gemini-2.0-flash` in `MODEL_ENDPOINT` (api/chat.js:4-5); lens.js correctly uses `process.env.GEMINI_MODEL`. If the deployed default model is retired, chat falls back gracefully (200 + fallback text), so it won't crash — but it will stop replying. Suggested 1-line fix: build the URL from an env-overridable model like lens.js does.
- **No top-level ErrorBoundary** exists (`start fresh` text not found anywhere). Scenarios a–e didn't produce uncaught crashes, but a single uncaught render error would blank the page. Recommend adding a small error boundary around `<Routes>` before the demo.
- **Stated feature mismatch (from the brief):** the app in this repo is the Dehradun hotel-concierge build: no destination packs (Jaipur/Ubud/Lisbon), no header destination switcher, no map tab (react-leaflet is in package.json but unused — it inflates the bundle by ~140 kB), no Plan add/remove stops, no share, no `src/lib/rank.js`. Chat/plan/lens flows that exist do have offline fallbacks. Don't promise these on stage.
- **Honesty labels** are mostly present ("demo values", "estimated", "Demo event", "AI estimate. Verify locally." in LensTab.jsx:64); "Verified Official Rate" appears nowhere. ✓
- **Mobile a11y gaps:** viewport meta lacks `viewport-fit=cover`; no `safe-area` padding; `prefers-reduced-motion` not handled; some decorative 9–10px text. Cosmetic, not blockers.
- **security:** no `dangerouslySetInnerHTML`/`eval`; model output rendered as text ✓. No stack traces leak to clients ✓.
- P0.5 (compiled CSS order for `.bottom-nav-glass`): that class does not exist in this build — the nav is the "floating pill" in GuestApp.jsx:126-128 with plain utility classes; no Tailwind-vs-custom-CSS nav conflict is possible here. Marked NOT VERIFIED for the original claim, but no regression of the known past failure is present.

## Commits on `final/release-check`
- `e669f8a` Snapshot of local working tree (uncommitted changes) as base for release check
- `0370a7c` Fix double-BOM lint error in App.jsx; add release smoke test + .env.example docs
- `41b9652` Remove transient smoke-test output logs from the commit
- `cc80e46` Ignore .DS_Store

**PR:** the branch is pushed, but PR creation via API was not possible from this environment (no GitHub token with `repo` scope available). Open it in one click:
https://github.com/viratpaudel/atithiai/pull/new/final/release-check
(NOTE: the configured remote is `viratpaudel/atithiai`, not `pharswanmohit07-cell/atithiai` as stated in the brief — if the real repo is the latter, push the branch there and open the PR from that URL.)

## What you must do manually
1. Add the 14 asset files listed above (exact paths/sizes).
2. In Vercel → Settings → Environment Variables: set `GEMINI_API_KEY` for **Production and Preview** (optionally `GEMINI_MODEL`), then redeploy.
3. Merge the PR after review.
4. Test the deployed URL:
```
curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" https://YOUR_URL/
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR_URL/plan
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR_URL/manifest.webmanifest
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR_URL/images/hero-bg.webp
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR_URL/icons/icon-192.png
curl -s -X POST -H "Content-Type: application/json" -d '{"messages":[{"from":"guest","text":"hello"}]}' https://YOUR_URL/api/chat
curl -s -X POST -H "Content-Type: application/json" -d '{"imageBase64":"/9j/4AAQSkZJRg==","language":"en"}' https://YOUR_URL/api/lens
```
(Repeat the POST pattern for `/api/intent` and `/api/plan` if those functions exist in your deployed copy; this repo only ships `api/chat.js` and `api/lens.js`.)

## 10-minute phone smoke test (after deploy)
1. Open the URL in Android Chrome — app loads, no white screen.
2. Complete/skip onboarding; Home renders.
3. Visit all tabs; nothing crashes.
4. Toggle dark/light; colors flip with no flash.
5. Send a chat message in English, then in Hindi; replies match the language (or graceful fallback offline).
6. Enable "Demo mode: use cached results" with airplane mode ON; chat still answers from the local fallback.
7. Lens: run a sample scan; then photograph a real menu; result card + "AI estimate. Verify locally." shows; tap the speaker for TTS.
8. Turn on `?demo=1`, trigger a demo disruption; the AI banner/alternative appears; Accept/Keep works.
9. Put the phone in airplane mode, reload `/plan` (or refresh on a deep link) — app still opens (SPA fallback + offline shell).
10. Check the bottom nav doesn't overlap content with the keyboard open; reopen the site and use "Add to Home Screen" (iOS Safari share menu) — icon launches standalone.
