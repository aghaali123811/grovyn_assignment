# LustraHair — AI Virtual Hair Try-On

A customer-facing virtual try-on experience for a fictional premium hair brand.
It answers the one question that stops people buying hair extensions, wigs and
colour online: **"how will this actually look on me?"**

The journey is a single continuous page:

**Discover → Upload photo → Choose a look → AI try-on → Compare before/after → View product → Take action**

---

## Demo Mode — read this first

The nav has a **Live Mode / Demo Mode** toggle.

| Mode | Needs an API key | What it does |
| --- | --- | --- |
| **Live Mode** (default) | Yes | Sends the photo to Replicate and generates a real result |
| **Demo Mode** | No | Simulates the generation and returns a stock result |

Demo Mode exists so the whole journey can be reviewed without a credential or
per-generation cost. It is an explicit user choice, never a silent fallback — if
Live Mode has no usable key it says so plainly and offers Demo Mode as recovery,
rather than passing off a stock photo as an AI result.

---

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.3.1, App Router, Turbopack |
| Language | TypeScript 5 |
| UI | React 19.2, Tailwind CSS v4, `lucide-react` icons |
| Backend | Next.js Route Handler (`POST /api/tryon`) |
| AI | Replicate (`replicate` SDK 1.4) |
| Runtime | Node.js ≥ 20.9 |

No database, no auth, no state library — the scope is deliberately small.

---

## AI technology / approach

**Model:** [`timbrooks/instruct-pix2pix`](https://replicate.com/timbrooks/instruct-pix2pix)
via Replicate — instruction-guided image-to-image editing. It edits an existing
photograph from a natural-language instruction rather than generating a new
image, which is the right shape for this problem: the customer's own face has to
survive the edit.

**How a try-on runs:**

1. The browser downscales the photo to ≤1024px and re-encodes it as JPEG (q 0.85).
2. The data URL is posted to `/api/tryon` with the chosen `styleId`.
3. The server looks the style up in the catalogue and runs the model with that
   style's prompt.
4. The output URL comes back and is rendered against the original in the
   before/after slider.

**Prompt strategy.** Every catalogue entry in `src/data/styles.ts` carries its
own prompt, written to change one hair attribute while explicitly holding
identity fixed — each one ends with a variation of *"Keep the exact same face,
skin tone, and identity."* Colour entries additionally pin the hairstyle so only
tone changes. A shared negative prompt suppresses the usual failure modes
(deformed anatomy, watermarks, blur).

**Inference parameters** (`src/lib/replicate.ts`) are tuned toward fidelity over
creativity: `image_guidance_scale: 1.5` keeps the result anchored to the input
photo, `guidance_scale: 7.5` keeps it responsive to the instruction, at 30 steps.

The API token is read server-side only and never reaches the browser.

---

## Key technical decisions

**Generation runs server-side.** The route handler is the only thing that
touches Replicate, so the token stays secret and the model choice can change
without a client release.

**Photos are downscaled in the browser before upload.** A modern phone photo is
several megabytes; capping the longest edge at 1024px cuts request size, latency
and per-generation cost at no visible quality loss, and keeps the payload inside
serverless body limits.

**Demo Mode is a first-class mode, not a fallback.** An earlier version silently
returned a stock photo when the key was missing, which quietly misrepresents the
product. Now a missing or rejected key raises `MissingApiKeyError`, the API
answers `503` with `code: "MISSING_API_KEY"`, and the UI explains the situation
and offers Demo Mode as a deliberate choice.

**Errors are typed, not just strings.** The API returns a machine-readable
`code` alongside customer-safe copy, so the UI can offer targeted recovery
("Continue in Demo Mode" vs "Try Again"). Configuration detail — which env var
to set — renders only outside production, so customers never see internals.

**One page, one step machine.** The experience is a scrolling narrative driven
by a `Step` union rather than routes. It suits a landing-page funnel and keeps
the whole story visible. The trade-off is that steps aren't linkable or
back-button aware; routes would be the right call once the funnel is measured.

**The before/after slider clips rather than resizes.** The revealed half is a
`clip-path: inset(...)` over a full-size image, so both layers stay pixel-aligned
at any handle position and no layout work happens during a drag. Dragging is
tracked on `document`, so it survives the pointer leaving the image, and the
handle is keyboard operable with proper slider ARIA.

**Commerce state is in-memory.** Cart, saved looks and consultation requests
live in React state. The brief explicitly excludes checkout, so the goal was a
believable next action rather than a real basket.

**Design tokens over ad-hoc colour.** The light theme is a single set of CSS
custom properties in `globals.css`, surfaced to Tailwind v4 via `@theme inline`.

---

## Setup

**Requirements:** Node.js ≥ 20.9 and npm.

```bash
npm install
cp .env.example .env.local
```

Add a Replicate token to `.env.local`:

```
REPLICATE_API_TOKEN=r8_your_real_token
```

Get one at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens).
Generations are billed per run.

```bash
npm run dev     # http://localhost:3000
```

**No token?** Start the app and switch the nav toggle to **Demo Mode** — the
entire journey works without a credential.

```bash
npm run build && npm start   # production build
npm run lint                 # eslint
```

---

## Project structure

```
src/
├─ app/
│  ├─ page.tsx              # step machine + full journey
│  ├─ layout.tsx            # fonts, metadata
│  ├─ globals.css           # light-theme design tokens
│  └─ api/tryon/route.ts    # POST /api/tryon
├─ components/
│  ├─ PhotoUpload.tsx       # drag/drop, validation, client-side resize
│  ├─ StyleSelector.tsx     # catalogue grid + category filter
│  ├─ LoadingAnimation.tsx  # processing state
│  ├─ BeforeAfterSlider.tsx # clip-path comparison slider
│  ├─ TryOnError.tsx        # typed error states + recovery
│  ├─ ProductCard.tsx       # product + commerce actions
│  ├─ ConsultationModal.tsx # consultation request form
│  └─ Toast.tsx             # action confirmations
├─ data/styles.ts           # 9 looks (6 styles, 3 colours) + prompts
└─ lib/replicate.ts         # model call, demo results, key resolution
```

---

## Known limitations

**Demo Mode results are not your face.** It returns stock portraits of other
people. It demonstrates the flow, timing and UI — not the AI. Any judgement of
generation quality has to be made in Live Mode.

**Identity preservation is inconsistent.** `instruct-pix2pix` is a
general-purpose editing model, not a hair-specific try-on model. It handles
colour changes and broad length/texture changes well, but can drift on facial
features — more so with side profiles, heavy occlusion or low light. Best
results come from a well-lit, front-facing, head-and-shoulders photo. Choosing a
face-preserving pipeline is the single highest-value upgrade (see below).

**Generation is synchronous.** The request is held open for the whole model
run. That is fine locally, but a slow run sits close to serverless timeout
limits, and the UI's "about 5-10 seconds" estimate is a placeholder rather than
a measured figure — real latency has not been benchmarked.

**Nothing persists.** Cart, saved looks and consultation requests are cleared on
refresh. There is no database, account or order.

**Catalogue imagery is hotlinked** from Unsplash and rendered with plain `<img>`
rather than `next/image`, so there is no optimisation or resilience if an
upstream asset disappears.

**The API is unprotected.** `/api/tryon` has no auth, rate limiting or abuse
protection — anyone with the URL can spend credits.

**Photos are sent to a third party.** The uploaded image goes to Replicate.
There is no consent step, retention policy or deletion guarantee yet.

**No automated tests.** Verification so far has been manual and browser-driven.

---

## Taking this to production

**Make generation asynchronous.** Replace the blocking call with Replicate's
prediction + webhook flow: create the prediction, return an id immediately, and
push the result to the client over SSE or polling. This removes the timeout
ceiling and makes retries and queueing possible.

**Move uploads to object storage.** Issue a presigned PUT to S3/R2, upload
direct from the browser, and hand the model a URL instead of a base64 payload.
Smaller requests, and a real lifecycle policy on the stored photo.

**Upgrade the model, and measure it.** Move to an identity-conditioned pipeline
(IP-Adapter / InstantID-style face embedding, or a dedicated commercial hair
try-on API). Build a held-out evaluation set and score candidates on face
similarity (e.g. ArcFace cosine against the input) and style adherence, so model
changes are a measured decision rather than a vibe. Pin model versions and keep
a rollback path.

**Cache aggressively.** Key results on `hash(photo) + styleId`. Re-trying the
same look is the most common interaction and should never cost twice.

**Control cost and abuse.** Per-user and per-IP rate limits, auth beyond the
first few free try-ons, a concurrency-capped queue, and budget alarms on the
Replicate account.

**Treat face photos as sensitive data.** This is biometric-adjacent, and under
GDPR and India's DPDP Act it needs explicit consent before upload, a stated
retention window with automatic deletion, a data-processing agreement with the
model vendor, and region-appropriate storage. This is a launch blocker, not a
nice-to-have.

**Connect real commerce.** Swap in-memory state for the storefront's own cart
(Shopify Storefront API, Medusa, or the existing backend), persist saved looks
against an account, and route consultation requests into the CRM that the
stylists already work from.

**Instrument the funnel.** The business case is conversion, so measure it:
upload → generate → compare → add-to-cart rates, generation latency and failure
rate, and cost per generation. Add error tracking (Sentry) and structured logs.

**Harden delivery.** `next/image` with a CDN, Playwright end-to-end coverage of
the core journey in CI, and preview deploys per PR.
