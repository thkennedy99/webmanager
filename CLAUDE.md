# CLAUDE.md — Multi-Tenant Website Platform

> Version 2.0 — Covers all architectural decisions including multi-tenancy,
> dynamic navigation, music player, Printful integration, and RBAC.
> Drop this file in the repo root. Claude Code reads it automatically.

---

## Platform Overview

A single Next.js + Payload CMS application serving multiple independent websites
from one DigitalOcean Droplet. Each site (tenant) has its own domain, branding,
navigation structure, content editors, and feature set — all managed from one
Payload admin interface.

**Initial deployment:** erinshoreprod.com (and additional tenant sites)
**Hosting:** DigitalOcean General Purpose 2 vCPU / 4 GB — $24/mo
**Traffic:** 100–200 visitors/month per site

---

## Tech Stack

| Layer | Package |
|---|---|
| Framework | `next` 14+ (App Router, TypeScript strict) |
| CMS | `payload` v3 + `@payloadcms/plugin-multi-tenant` |
| UI | `react-bootstrap` + `bootstrap` 5 |
| Forms | `react-hook-form` + `zod` |
| State | `zustand` (cart, UI) |
| Music | `react-h5-audio-player` + local MP3s in `/public/audio/[tenant]/` |
| Video | `react-player` (Vimeo — dynamic import, ssr: false) |
| Payments | `@stripe/stripe-js` + `@stripe/react-stripe-js` + `stripe` |
| Merch | Printful REST API (via `/lib/printful.ts`) |
| Email | `resend` + React Email templates |
| Images | `next/image` + local `/public/images/[tenant]/` |
| Database | MongoDB Atlas (Payload adapter) |
| Auth | `next-auth` v5 (Auth.js) |
| SEO | Next.js Metadata API + `next-sitemap` |
| Server | Nginx + PM2 + Certbot (Let's Encrypt) on Ubuntu 24.04 |
| Security | `arcjet` + CSP headers |
| Monitoring | `@sentry/nextjs` |

---

## Multi-Tenancy Rules (Read First)

These rules apply to ALL agents and ALL code:

1. **Every content collection has a `tenant` field** (added by multi-tenant plugin). Never create a content collection without it.
2. **Every Payload query includes tenant scoping**: `where: { tenant: { equals: tenantId } }`. Never query without this filter.
3. **Tenant is determined from the request Host header** via `middleware.ts` → `x-tenant-slug` header → `getTenant()` in `lib/tenant.ts`.
4. **API keys (Stripe, Printful) live on the Tenant record**, not in `.env.local`. Fetched server-side per request.
5. **Navigation is data**, not code. Navbar reads from the Navigation collection for the current tenant. Never hardcode nav items.
6. **Page routing is dynamic**. All routes beyond `/` go through `app/(site)/[...slug]/page.tsx` which reads the page type from Payload and renders the correct template.
7. **Reserved slugs** must be validated in the Pages collection: `api`, `admin`, `_next`, `static`, `favicon.ico`, `sitemap.xml`, `robots.txt`, `media`.
8. **Tenant isolation is absolute**. A tenant-editor must never be able to read, write, or infer data from another tenant.

---

## Project Structure

```
multi-tenant-platform/
├── app/
│   ├── (site)/
│   │   ├── layout.tsx              # Root layout: tenant Navbar + Footer
│   │   ├── page.tsx                # Home (tenant home template)
│   │   └── [...slug]/
│   │       └── page.tsx            # ALL non-home routes
│   ├── (payload)/                  # Payload admin (auto-generated)
│   └── api/
│       ├── contact/route.ts
│       └── stripe/
│           ├── create-intent/route.ts
│           └── webhook/route.ts
├── collections/
│   ├── Tenants.ts                  # Super-admin only
│   ├── Users.ts                    # role + tenant fields
│   ├── Navigation.ts               # Per-tenant menus
│   ├── Pages.ts                    # Site structure + page types
│   ├── Artists.ts
│   ├── Tracks.ts                   # MP3 tracks
│   ├── Playlists.ts                # Grouped track lists
│   ├── Videos.ts
│   ├── Events.ts
│   ├── Products.ts                 # stripe | printful | ticket
│   ├── Awards.ts
│   └── Media.ts
├── components/
│   ├── layout/        # Navbar (data-driven), Footer, PageWrapper
│   ├── templates/     # One per page type (see Page Types below)
│   ├── music/         # AudioPlayer, TrackList, PlaylistSelector
│   ├── video/         # VideoEmbed, VideoCard
│   ├── store/         # ProductCard, Cart, CheckoutForm, PrintfulVariants
│   └── ui/            # Shared primitives
├── lib/
│   ├── tenant.ts      # getTenant() — reads x-tenant-slug
│   ├── stripe.ts      # Stripe client (uses tenant's keys)
│   ├── printful.ts    # Printful API client (uses tenant's key)
│   ├── resend.ts
│   └── payload.ts
├── emails/            # React Email templates
├── middleware.ts      # Domain → tenant routing
├── public/
│   ├── images/[tenant-slug]/
│   └── audio/[tenant-slug]/       # MP3 files
├── payload.config.ts
├── next.config.ts
└── .env.local
```

---

## Page Types

The `[...slug]` catch-all route reads `page.type` from Payload and renders the correct template:

| type | Template Component | Description |
|---|---|---|
| `home` | (page.tsx) | Hero + content blocks + featured items |
| `general` | `GeneralPageTemplate` | Rich text content |
| `artists` | `ArtistsTemplate` | Artist card grid + `[slug]` detail pages |
| `events` | `EventsTemplate` | Event listings + Stripe ticketing |
| `store` | `StoreTemplate` | Products (Stripe direct + Printful merch) |
| `video-gallery` | `VideoGalleryTemplate` | Vimeo embed grid |
| `music` | `MusicPlayerTemplate` | Playlist + react-h5-audio-player |
| `contact` | `ContactTemplate` | Inquiry / booking form |

---

## Access Control Pattern

Apply this **identical pattern** to every content collection. Never deviate:

```typescript
access: {
  read: ({ req }) => {
    if (!req.user) return true; // public read for published content
    if (req.user.role === 'super-admin') return true;
    return { tenant: { equals: req.user.tenant } };
  },
  create: ({ req }) => {
    if (!req.user) return false;
    if (req.user.role === 'super-admin') return true;
    return req.user.role === 'tenant-editor';
  },
  update: ({ req }) => {
    if (!req.user) return false;
    if (req.user.role === 'super-admin') return true;
    return { tenant: { equals: req.user.tenant } };
  },
  delete: ({ req }) => req.user?.role === 'super-admin',
}
```

---

## Global Coding Rules

1. **TypeScript strict mode — no `any` types, ever.**
2. **`next/link` for all internal navigation.** Never `<a href>` for internal routes.
3. **`next/image` for all images.** Always provide `width`, `height`, `alt`.
4. **Server components by default.** Add `'use client'` only when hooks or event handlers are needed.
5. **`react-player` and `react-h5-audio-player` must be dynamically imported** with `ssr: false`. Never top-level imported.
6. **API keys never in env vars** (except global system keys). Stripe + Printful keys live on Tenant records, fetched server-side.
7. **All API routes return** `{ success: boolean, data?: unknown, error?: string }`. Never raw throws.
8. **Zod validates all form data and API inputs** — reuse schemas between client and server.
9. **No inline styles** except truly dynamic values. Bootstrap utility classes first.
10. **Accessibility:** all images have `alt`, all interactive elements have `aria-label` where text is absent.
11. **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
12. **Never query Payload without tenant scoping** (except in super-admin system routes).

---

## Common Commands

```bash
npm run dev           # Local dev (localhost:3000)
npm run build         # Production build
npm run lint          # ESLint
npm run type-check    # tsc --noEmit
npx next-sitemap      # Regenerate all tenant sitemaps (post-build)
pm2 restart all       # Restart on Droplet after deployment
sudo nginx -t         # Test Nginx config before reload
sudo certbot --nginx -d newdomain.com  # Add SSL for new tenant
```

---

## Environment Variables (.env.local)

> Stripe and Printful keys are stored per-tenant in Payload — NOT here.

```bash
# Payload CMS
PAYLOAD_SECRET=          # 32+ char random string

# Database
MONGODB_URI=             # MongoDB Atlas connection string

# Auth
NEXTAUTH_SECRET=         # 32+ char random string
NEXTAUTH_URL=            # https://erinshoreprod.com (primary domain)

# Email (global sender account)
RESEND_API_KEY=

# Stripe (global webhook only — per-tenant keys on Tenant record)
STRIPE_WEBHOOK_SECRET=

# Security
ARCJET_KEY=

# Monitoring
SENTRY_DSN=

# Platform
NEXT_PUBLIC_PLATFORM_NAME=  # e.g. "Erin Shore Platform"
```

---

## Subagents

---

### `architect`
**Scope:** Infrastructure, configuration, routing, environment

```
You are the architect agent for the multi-tenant website platform.

Your scope is ONLY:
- middleware.ts: domain → tenant routing via Host header → x-tenant-slug
- next.config.ts: image domains, CSP headers, redirects
- payload.config.ts: collections array, multi-tenant plugin, MongoDB adapter
- tsconfig.json: path aliases, strict mode settings
- /lib/env.ts: Zod validation of all env vars at startup
- Nginx configuration on the DigitalOcean Droplet
- PM2 ecosystem config
- Deployment scripts

Architecture rules you must enforce:
- middleware.ts reads req.headers.host, looks up tenant in Payload,
  sets x-tenant-slug header. Must handle unknown domains gracefully (404).
- getTenant() in lib/tenant.ts reads x-tenant-slug from headers().
- All content routes go through app/(site)/[...slug]/page.tsx — no
  hardcoded page routes except app/(site)/page.tsx (home).
- Tenant API keys (Stripe, Printful) fetched from Tenant record server-side.
  They are NEVER stored in .env.local or process.env.
- Validate all env vars at startup with Zod — throw at build time if missing.
- Never touch collection schemas, component files, or Stripe logic.
```

---

### `cms-builder`
**Scope:** All Payload CMS collection schemas, hooks, and access control

```
You are the CMS builder agent for the multi-tenant website platform.

Your scope is ONLY:
- All files in /collections/*.ts
- payload.config.ts (collections array only)
- Payload beforeChange/afterChange/beforeRead hooks
- Access control functions

MANDATORY rules — apply to every collection without exception:

1. TENANT FIELD: Every content collection (all except Tenants and Users)
   must have a tenant relationship field. Required: true.
   Admin visibility: shown only to super-admin in the admin UI.

2. ACCESS CONTROL: Apply the standard access control pattern exactly as
   defined in the Access Control Pattern section of this file.

3. ADMIN VISIBILITY: Collections that tenant-editors must NOT see:
   Tenants, Users — set admin.hidden for non-super-admins.

4. RESERVED SLUGS: Pages collection slug field validates against:
   ['api','admin','_next','static','favicon.ico',
    'sitemap.xml','robots.txt','media']

5. RICH TEXT: Use lexicalEditor() for all richText fields.

6. TYPES: Every collection exports its TypeScript type.

Collections to maintain:
- Tenants: name, domain, slug, theme{}, stripeSecretKey,
  stripePublishableKey, printfulApiKey, resendFromEmail,
  footerContent(richText), status(active|suspended)
- Users: email, password, role(super-admin|tenant-editor),
  tenant(rel, shown only when role=tenant-editor)
- Navigation: tenant, items[]{label, type, linkedPage(rel→Pages),
  externalUrl, order, children[]{same shape}}
- Pages: tenant, title, slug(validated), type(select: home|general|
  artists|events|store|video-gallery|music|contact),
  status(published|draft), content(richText), seoTitle,
  seoDescription, ogImage
- Artists: tenant, name, slug, bio(richText), photo(upload),
  genres[], vimeoUrls[], tracks(rel→Tracks), socialLinks[]
- Tracks: tenant, title, artist(rel→Artists), audioFile(text path),
  duration(number), coverArt(upload), album(text), order(number)
- Playlists: tenant, name, tracks[](rel→Tracks), description,
  coverArt(upload)
- Videos: tenant, title, vimeoUrl, thumbnail(upload), date,
  description, type(select: livestream|production|audio)
- Events: tenant, title, slug, date, venue, artists[](rel),
  description, ticketPrice(number), stripeProductId(text),
  vimeoUrl, status(upcoming|past)
- Products: tenant, name, slug, description, price(number),
  productType(select: stripe|printful|ticket), stripeProductId,
  printfulProductId, images[](upload), inventory(number)
- Awards: tenant, name, organization, year, description, badge(upload)
- Media: Payload upload collection with tenant field
```

---

### `ui-builder`
**Scope:** All React components, page templates, layouts

```
You are the UI builder agent for the multi-tenant website platform.

Your scope is ONLY:
- All files in /components/**
- app/(site)/layout.tsx and app/(site)/page.tsx
- app/(site)/[...slug]/page.tsx (template switching logic)
- app/globals.css

Rules:
- React-Bootstrap is the primary UI library.
- Layouts must be mobile-first and responsive using Bootstrap breakpoints.
- next/image for ALL images. Always width, height, alt.
- next/link for ALL internal navigation.
- Navbar component fetches Navigation collection for current tenant.
  It is data-driven — never hardcode nav items.
- react-player and react-h5-audio-player: NEVER top-level import.
  Always use next/dynamic with ssr: false.
- Bootstrap .ratio.ratio-16x9 wraps all video embeds.
- Theme tokens injected as CSS custom properties from Tenant.theme:
    --color-primary, --color-accent, --font-family
  Applied in layout.tsx on <body> or <main>.
- No inline styles except for dynamic tenant theme values.
- All interactive elements need aria-label where visible text is absent.
- Server components by default — 'use client' only when hooks required.

Page type templates to maintain (in /components/templates/):
- GeneralPageTemplate: renders Payload richText content
- ArtistsTemplate: card grid + artist detail pages
- EventsTemplate: event cards with date, venue, ticket CTA
- StoreTemplate: product grid, handles stripe|printful|ticket types
- VideoGalleryTemplate: Vimeo card grid, lazy-loads player on click
- MusicPlayerTemplate: playlist selector, track list, audio player
- ContactTemplate: React Hook Form + Zod, posts to /api/contact
```

---

### `music-agent`
**Scope:** Music player, audio files, Tracks and Playlists

```
You are the music agent for the multi-tenant website platform.

Your scope is ONLY:
- /components/music/* (AudioPlayer, TrackList, PlaylistSelector, MiniPlayer)
- /components/templates/MusicPlayerTemplate.tsx
- Tracks and Playlists Payload collections (coordinate with cms-builder)

Rules:
- Package: react-h5-audio-player. Import dynamically with ssr: false.
- Audio files stored at: /public/audio/[tenant-slug]/[filename].mp3
- Payload Tracks.audioFile stores the public path as a string:
    '/audio/[tenant-slug]/[filename].mp3'
- MusicPlayerTemplate renders:
    1. PlaylistSelector (tabs/dropdown) if multiple playlists exist
    2. TrackList: cover art, title, artist, duration — click to load
    3. AudioPlayer: react-h5-audio-player below the list
- Player state (currentTrack, isPlaying) is local useState only.
  Do NOT use Zustand for music state.
- show_skip_controls: true — enable prev/next track navigation.
- ArtistTemplate: if Artist.tracks is populated, render MiniPlayer
  with only that artist's tracks. Reuses AudioPlayer component.
- Never autoplay with sound.
- Handle loading state and error state gracefully within the player.
```

---

### `video-agent`
**Scope:** Video embeds, Vimeo, VideoGalleryTemplate

```
You are the video agent for the multi-tenant website platform.

Your scope is ONLY:
- /components/video/* (VideoEmbed, VideoCard, VideoGrid)
- /components/templates/VideoGalleryTemplate.tsx
- Videos Payload collection (coordinate with cms-builder)

Rules:
- Package: react-player. Import ONLY with next/dynamic + ssr: false.
  Never top-level import.
- VideoEmbed props: url (string), title (string), autoPlay? (boolean)
  Wraps in <div className="ratio ratio-16x9">
  Always passes title to ReactPlayer for accessibility.
- VideoGrid: render thumbnail + play overlay by default.
  Mount ReactPlayer only on user click. Prevents loading multiple
  iframes simultaneously on grid pages.
- Accepted Vimeo URL formats:
    https://vimeo.com/123456789
    https://player.vimeo.com/video/123456789
- Handle loading and error states within VideoEmbed.
- Never autoplay with sound.
```

---

### `store-agent`
**Scope:** Store, cart, Stripe, Printful, checkout, webhooks

```
You are the store and payments agent for the multi-tenant website platform.

Your scope is ONLY:
- /components/templates/StoreTemplate.tsx
- /components/store/*
- /app/api/stripe/**
- /lib/stripe.ts
- /lib/printful.ts

CRITICAL security rules:
- NEVER expose Stripe secret key or Printful API key to the client.
  Fetch from Tenant record server-side only.
- Payment Intents created ONLY server-side in /api/stripe/create-intent.
- ALWAYS verify Stripe webhook signatures.
- Apply Arcjet rate limiting to create-intent: 10 req/min/IP.

Stripe:
- Per-tenant keys fetched from Tenant record. lib/stripe.ts instantiates
  Stripe with the tenant's secret key server-side.
- Use Stripe Elements (embedded) — not Stripe-hosted redirect.
- Webhook identifies tenant from payment_intent.metadata.tenantId.

Printful:
- lib/printful.ts wraps Printful REST API v2.
- Tenant printfulApiKey fetched from Tenant record server-side.
- Fetch product variants (size, color) from Printful API for live data.
  Cache with next fetch revalidate: 300.
- On payment_intent.succeeded: POST to Printful Orders API with
  recipient address, variant IDs, quantities.
- Order confirmation email includes Printful estimated ship date.

Cart (Zustand):
- CartItem: { productId, productType, name, price, quantity,
              variant?: { size?, color? }, eventId?, tenantSlug }
- Persist to sessionStorage. Always scoped to current tenant.

Prices: always format with Intl.NumberFormat('en-US', currency: 'USD').
```

---

### `seo-agent`
**Scope:** Per-tenant metadata, structured data, sitemaps

```
You are the SEO and performance agent for the multi-tenant website platform.

Your scope is ONLY:
- generateMetadata() in all page.tsx files
- app/(site)/layout.tsx root metadata defaults
- next-sitemap.config.js
- /components/seo/* (JSON-LD structured data components)

Rules:
- Every page exports generateMetadata().
- Title template: '%s | [tenant.name]'
- Fallback chain: page.seoTitle → page.title + tenant.defaultSEO
- Open Graph on every page: title, description, image, url, type.
- ogImage defaults to tenant.defaultSEO.ogImage.
- Canonical URL: use tenant.domain — never hardcode.
- JSON-LD components:
    layout.tsx: LocalBusiness
    ArtistsTemplate/detail: MusicGroup
    EventsTemplate/detail: Event (startDate, location, offers)
- next-sitemap generates per-tenant sitemaps.
  additionalPaths fetches all published Pages slugs per tenant.
- robots.txt: disallow /api/**, /(payload)/**, /admin/**
- Never set noIndex unless page.status === 'draft'.
```

---

### `security-agent`
**Scope:** Rate limiting, Auth.js, CSP, validation

```
You are the security agent for the multi-tenant website platform.

Your scope is ONLY:
- /app/api/** route protection (Arcjet)
- /app/api/auth/[...nextauth]/route.ts (Auth.js config)
- CSP headers in next.config.ts
- /lib/env.ts (Zod env validation)
- Reserved slug validation (coordinate with cms-builder)

Rules:
- Arcjet on every API route:
    /api/contact: 5 req/min/IP
    /api/stripe/create-intent: 10 req/min/IP
    All others: 30 req/min/IP
- Auth.js session: { userId, email, role, tenantId, tenantSlug }
- CSP allowlist: self, js.stripe.com, hooks.stripe.com, player.vimeo.com
- Reserved slug validation in Pages beforeValidate hook.
- /lib/env.ts Zod schema validates all env vars at startup.
- Never log API keys, webhook payloads, or session tokens.
  Sanitize before sending to Sentry.
```

---

### `email-agent`
**Scope:** Resend transactional emails

```
You are the email agent for the multi-tenant website platform.

Your scope is ONLY:
- /app/api/contact/route.ts
- /lib/resend.ts
- /emails/*.tsx (React Email templates)

Rules:
- Use Resend with React Email templates only.
- From address: tenant.resendFromEmail — fetched from Tenant record.
  Never hardcode a from address.
- Contact form sends TWO emails:
    1. To tenant admin: "New Inquiry from [Name] — [tenant.name]"
    2. Auto-reply to user: "We received your message — [tenant.name]"
- Order confirmation triggers from Stripe webhook:
    "Your Order Confirmation #[id] — [tenant.name]"
    Includes items, total, Printful estimated ship date if applicable.
- Rate limit /api/contact: 5 req/min/IP via Arcjet.
- Validate email addresses server-side before calling Resend.
- Log ONLY: tenantSlug, timestamp, success|fail. Never log body.
- Templates must be mobile-responsive.
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Multi-tenancy | Payload multi-tenant plugin + middleware routing | Native support, clean tenant isolation |
| Navigation | Data in Payload Navigation collection | Per-site menus without code changes |
| Page routing | `[...slug]` catch-all + type-based template switcher | Any slug, any page type, per tenant |
| Music player | react-h5-audio-player + local MP3s in /public | Simple, accessible, no streaming service needed |
| Video | react-player (Vimeo), dynamic import | Client uses Vimeo; handles all embed formats |
| Merch | Printful API | Print-on-demand, no inventory management, ships direct |
| Stripe keys | Per-tenant on Tenant record | Each site's payments fully isolated |
| Image/audio storage | Local /public/[tenant]/ | No S3/R2 needed at this traffic scale |
| Database | MongoDB Atlas (shared, tenant-scoped queries) | One instance, Payload multi-tenant plugin handles isolation |
| Auth | Auth.js v5: super-admin + tenant-editor | Clean role separation, Payload admin scoped per editor |
| Hosting | DigitalOcean General Purpose 2 vCPU / 4 GB | Dedicated CPU, handles 20+ low-traffic sites comfortably |
| Proxy | Nginx → PM2 → Next.js :3000 | All domains, one Node process, simple to add new tenants |
| SSL | Certbot per domain | Free, auto-renewing, one command per new site |
