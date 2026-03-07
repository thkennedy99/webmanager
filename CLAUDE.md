# CLAUDE.md — Multi-Tenant Website Platform

> Version 3.0 — Updated infrastructure: Hetzner VPS + Cloudflare (CDN, SSL, WAF, DNS).
> Replaces DigitalOcean + Certbot + manual Nginx with Hetzner + Cloudflare + Coolify.
> Drop this file in the repo root. Claude Code reads it automatically.

---

## Platform Overview

A single Next.js + Payload CMS application serving multiple independent websites
from one Hetzner VPS, with Cloudflare handling SSL, CDN, DDoS protection, and
DNS in front of it. Each site (tenant) has its own domain, branding, navigation
structure, content editors, and feature set — all managed from one Payload admin.

**Initial deployment:** erinshoreprod.com (and additional tenant sites)
**VPS:** Hetzner CX22 — 2 vCPU / 4 GB RAM / 40 GB NVMe — ~$6/mo
**Edge:** Cloudflare Free — SSL, CDN, DDoS, WAF, DNS — $0/mo
**Deployment:** Coolify (self-hosted PaaS on Hetzner — git push deploy)
**Traffic:** 100–200 visitors/month per site

---

## Tech Stack

| Layer | Package |
|---|---|
| Framework | `next` 15+ (App Router, TypeScript strict) |
| CMS | `payload` v3 + `@payloadcms/plugin-multi-tenant` |
| Database | PostgreSQL 16 via `@payloadcms/db-postgres` |
| UI | `react-bootstrap` + `bootstrap` 5 |
| Forms | `react-hook-form` + `zod` |
| State | `zustand` (cart, UI) |
| Music | `react-h5-audio-player` + local MP3s in `/public/audio/[tenant]/` |
| Video | `react-player` (Vimeo — dynamic import, ssr: false) |
| Payments | `@stripe/stripe-js` + `@stripe/react-stripe-js` + `stripe` |
| Merch | Printful REST API (via `/lib/printful.ts`) |
| Email | `resend` + React Email templates |
| Images | `next/image` + local `/public/images/[tenant]/` |
| Auth | `next-auth` v5 (Auth.js) |
| SEO | Next.js Metadata API + `next-sitemap` |
| VPS | Hetzner CX22 — Ubuntu 24.04 LTS |
| Edge / CDN / SSL | Cloudflare Free (sits in front of Hetzner) |
| Deployment | Coolify (self-hosted, installed on Hetzner) |
| Reverse Proxy | Traefik (via Coolify — no manual Nginx config) |
| Security | Cloudflare WAF + `arcjet` (API rate limiting) + CSP headers |
| Monitoring | `@sentry/nextjs` |
| Analytics | Cloudflare Web Analytics (free, cookie-free, GDPR-compliant) |


---

## Infrastructure — How It Fits Together

```
Browser
  → Cloudflare Edge (SSL termination, CDN cache, WAF, DDoS protection)
    → Cache HIT: serves static asset from edge (0 origin requests)
    → Cache MISS: forwards to Hetzner over encrypted tunnel
        → Traefik reverse proxy (via Coolify, port 443)
          → Next.js app (port 3002 locally / 3000 in prod)
            → middleware.ts: Host header → tenant lookup
              → Payload CMS + PostgreSQL
```

**Cloudflare handles:** SSL for all domains automatically, global CDN caching,
DDoS mitigation, WAF, bot filtering, DNS for all tenant domains.

**Certbot / Let's Encrypt is NOT used.** SSL = Cloudflare Universal SSL
(browser → Cloudflare) + Cloudflare Origin Certificate (Cloudflare → Hetzner).
Set SSL/TLS mode to "Full (Strict)" in Cloudflare dashboard.

**Nginx is NOT used.** Coolify runs Traefik internally as the reverse proxy.
Adding a new domain = Cloudflare dashboard (DNS A record) + Coolify dashboard
(domain routing). No SSH required to add a new tenant site.

---

## Adding a New Tenant Domain

1. Point domain registrar nameservers → Cloudflare
2. Cloudflare DNS → Add A record: `@` → Hetzner IP, Proxy ON (orange cloud)
3. SSL is live immediately via Universal SSL — no commands needed
4. Coolify dashboard → add domain to Next.js service routing
5. Payload admin → Tenants → Create (domain, slug, theme, API keys)
6. Payload admin → Users → Create tenant-editor
7. Payload admin → Navigation + Pages → build site structure
8. Publish content → site is live

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
webmanager/
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── layout.tsx              # Root layout: tenant Navbar + Footer
│   │   │   ├── page.tsx                # Home (tenant home template)
│   │   │   └── [...slug]/
│   │   │       └── page.tsx            # ALL non-home routes
│   │   ├── (payload)/                  # Payload admin (auto-generated)
│   │   └── api/
│   │       ├── contact/route.ts
│   │       └── stripe/
│   │           ├── create-intent/route.ts
│   │           └── webhook/route.ts
│   ├── collections/
│   │   ├── Tenants.ts
│   │   ├── Users.ts
│   │   ├── Navigation.ts
│   │   ├── Pages.ts
│   │   ├── Artists.ts
│   │   ├── Tracks.ts
│   │   ├── Playlists.ts
│   │   ├── Videos.ts
│   │   ├── Events.ts
│   │   ├── Products.ts
│   │   ├── Awards.ts
│   │   └── Media.ts
│   ├── components/
│   │   ├── layout/        # Navbar (data-driven), Footer, PageWrapper
│   │   ├── templates/     # One per page type
│   │   ├── music/         # AudioPlayer, TrackList, PlaylistSelector
│   │   ├── video/         # VideoEmbed, VideoCard
│   │   ├── store/         # ProductCard, Cart, CheckoutForm
│   │   └── ui/            # Shared primitives
│   ├── lib/
│   │   ├── tenant.ts      # getTenant() — reads x-tenant-slug
│   │   ├── stripe.ts
│   │   ├── printful.ts
│   │   ├── resend.ts
│   │   └── env.ts         # Zod env validation
│   ├── emails/
│   ├── middleware.ts
│   └── payload.config.ts
├── public/
│   ├── images/[tenant-slug]/
│   └── audio/[tenant-slug]/
├── next.config.mjs
└── .env.local
```

---

## Page Types

| type | Template Component | Description |
|---|---|---|
| `home` | (page.tsx) | Hero + content blocks + featured items |
| `general` | `GeneralPageTemplate` | Rich text content |
| `artists` | `ArtistsTemplate` | Artist card grid + detail pages |
| `events` | `EventsTemplate` | Event listings + Stripe ticketing |
| `store` | `StoreTemplate` | Products (Stripe + Printful) |
| `video-gallery` | `VideoGalleryTemplate` | Vimeo embed grid |
| `music` | `MusicPlayerTemplate` | Playlist + react-h5-audio-player |
| `contact` | `ContactTemplate` | Inquiry / booking form |


---

## Access Control Pattern

Apply this **identical pattern** to every content collection. Never deviate:

```typescript
access: {
  read: ({ req }) => {
    if (!req.user) return true;
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
npm run dev           # Local dev (localhost:3002)
npm run build         # Production build
npm run lint          # ESLint
npm run generate:types  # Regenerate Payload TypeScript types
npx next-sitemap      # Regenerate sitemaps (post-build)
```

---

## Environment Variables (.env.local)

> Stripe and Printful keys are stored per-tenant in Payload — NOT here.
> In Coolify (prod), these are managed in the dashboard env var editor.

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/erin_shore_platform
PAYLOAD_SECRET=         # 32+ char random string
AUTH_SECRET=            # 32+ char random string
NEXTAUTH_URL=           # http://localhost:3002 (dev) / https://erinshoreprod.com (prod)
RESEND_API_KEY=
STRIPE_WEBHOOK_SECRET=
ARCJET_KEY=
SENTRY_DSN=
NEXT_PUBLIC_PLATFORM_NAME=Erin Shore Platform
```


---

## Subagents

### `architect`
**Scope:** Infrastructure, configuration, routing, environment

```
You are the architect agent for the multi-tenant website platform.

Your scope is ONLY:
- middleware.ts: domain → tenant routing via Host header → x-tenant-slug
- next.config.mjs: image domains, CSP headers, redirects
- payload.config.ts: collections array, db-postgres adapter, multi-tenant plugin
- tsconfig.json: path aliases, strict mode settings
- /lib/env.ts: Zod validation of all env vars at startup
- Coolify deployment configuration
- Cloudflare DNS and SSL configuration guidance

Infrastructure model:
- Hetzner CX22 runs Coolify, which manages Traefik (reverse proxy) and PM2.
- Cloudflare sits in front of Hetzner: SSL, CDN, WAF, DDoS.
- SSL = Cloudflare Universal SSL + Origin Certificate. Mode = Full (Strict).
- NO Certbot. NO Let's Encrypt. NO manual Nginx config.
- Adding a domain = Cloudflare DNS A record (proxy ON) + Coolify routing. No SSH.
- Database = PostgreSQL 16 via @payloadcms/db-postgres. DATABASE_URL in .env.local.
- Dev port = 3002. Prod port = 3000 (via Coolify).

Architecture rules:
- middleware.ts reads req.headers.host, looks up tenant, sets x-tenant-slug.
- getTenant() in lib/tenant.ts reads x-tenant-slug from headers().
- All content routes: app/(site)/[...slug]/page.tsx — no hardcoded routes.
- Tenant API keys fetched from Tenant record server-side. NEVER in .env.local.
- Validate all env vars at startup with Zod. Throw clearly if missing.
- Never touch collection schemas, component files, or Stripe logic.
```

---

### `cms-builder`
**Scope:** All Payload CMS collection schemas, hooks, and access control

```
You are the CMS builder agent for the multi-tenant website platform.

Your scope is ONLY:
- All files in /src/collections/*.ts
- payload.config.ts (collections array only)
- Payload beforeChange/afterChange/beforeRead hooks
- Access control functions

MANDATORY rules:

1. TENANT FIELD: Every content collection must have a tenant relationship field.
   Required: true. Admin visibility: shown only to super-admin.

2. ACCESS CONTROL: Apply the standard pattern from this file exactly.

3. ADMIN VISIBILITY: Tenants, Users — set admin.hidden for non-super-admins.

4. RESERVED SLUGS: Pages slug validates against:
   ['api','admin','_next','static','favicon.ico','sitemap.xml','robots.txt','media']

5. RICH TEXT: Use lexicalEditor() for all richText fields.

6. TYPES: Every collection exports its TypeScript type.

Collections: Tenants, Users, Navigation, Pages, Artists, Tracks, Playlists,
Videos, Events, Products, Awards, Media — see architecture doc for full schemas.
```

---

### `ui-builder`
**Scope:** All React components, page templates, layouts

```
You are the UI builder agent for the multi-tenant website platform.

Your scope is ONLY:
- All files in /src/components/**
- src/app/(site)/layout.tsx and src/app/(site)/page.tsx
- src/app/(site)/[...slug]/page.tsx

Rules:
- React-Bootstrap is the primary UI library.
- next/image for ALL images. Always width, height, alt.
- next/link for ALL internal navigation.
- Navbar is data-driven from Navigation collection. Never hardcode nav items.
- react-player and react-h5-audio-player: ALWAYS next/dynamic with ssr: false.
- Bootstrap .ratio.ratio-16x9 wraps all video embeds.
- Theme tokens from Tenant.theme injected as CSS custom properties:
    --color-primary, --color-accent, --font-family
- No inline styles except dynamic tenant theme values.
- Server components by default — 'use client' only when hooks required.
```


---

### `music-agent`
**Scope:** Music player, audio files, Tracks and Playlists

```
You are the music agent for the multi-tenant website platform.

Your scope is ONLY:
- /src/components/music/*
- /src/components/templates/MusicPlayerTemplate.tsx
- Tracks and Playlists collections (coordinate with cms-builder)

Rules:
- Package: react-h5-audio-player. Dynamic import, ssr: false.
- Audio: /public/audio/[tenant-slug]/[filename].mp3
- Tracks.audioFile stores path string: '/audio/[tenant-slug]/[filename].mp3'
- Cloudflare CDN caches audio files at edge — fast globally.
- MusicPlayerTemplate: PlaylistSelector → TrackList → AudioPlayer
- Player state: local useState only. Do NOT use Zustand.
- show_skip_controls: true. Never autoplay with sound.
```

---

### `video-agent`
**Scope:** Video embeds, Vimeo, VideoGalleryTemplate

```
You are the video agent for the multi-tenant website platform.

Your scope is ONLY:
- /src/components/video/*
- /src/components/templates/VideoGalleryTemplate.tsx
- Videos collection (coordinate with cms-builder)

Rules:
- Package: react-player. ALWAYS next/dynamic with ssr: false. Never top-level import.
- VideoEmbed wraps in <div className="ratio ratio-16x9">
- VideoGrid: mount ReactPlayer only on user click (no multiple iframes).
- Never autoplay with sound.
```

---

### `store-agent`
**Scope:** Store, cart, Stripe, Printful, checkout, webhooks

```
You are the store agent for the multi-tenant website platform.

Your scope is ONLY:
- /src/components/templates/StoreTemplate.tsx
- /src/components/store/*
- /src/app/api/stripe/**
- /src/lib/stripe.ts
- /src/lib/printful.ts

CRITICAL:
- NEVER expose Stripe secret key or Printful API key to the client.
- Payment Intents created ONLY server-side.
- ALWAYS verify Stripe webhook signatures.
- Arcjet rate limiting: create-intent 10 req/min/IP.
- Per-tenant keys fetched from Tenant record server-side only.
- Webhook identifies tenant from payment_intent.metadata.tenantId.
- Cart (Zustand): CartItem includes tenantSlug, productType, variant.
- Prices: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
```

---

### `seo-agent`
**Scope:** Per-tenant metadata, structured data, sitemaps

```
You are the SEO agent for the multi-tenant website platform.

Your scope is ONLY:
- generateMetadata() in all page.tsx files
- next-sitemap.config.js
- /src/components/seo/* (JSON-LD components)

Rules:
- Title template: '%s | [tenant.name]'
- Open Graph on every page. Canonical URL uses tenant.domain.
- JSON-LD: LocalBusiness (layout), MusicGroup (artists), Event (events).
- Cloudflare CDN respects Next.js ISR Cache-Control headers.
- robots.txt: disallow /api/**, /(payload)/**, /admin/**
```

---

### `security-agent`
**Scope:** Rate limiting, Auth.js, CSP, validation

```
You are the security agent for the multi-tenant website platform.

Security layers:
1. Cloudflare edge: DDoS, WAF, bot filtering — automatic, no code needed.
2. Arcjet: application-level rate limiting on all API routes.
3. Auth.js + Payload RBAC: authentication and role-based access.

Rules:
- Arcjet: /api/contact 5/min, /api/stripe/create-intent 10/min, others 30/min.
- Auth.js session: { userId, email, role, tenantId, tenantSlug }
- CSP allowlist: self, js.stripe.com, hooks.stripe.com, player.vimeo.com.
- /lib/env.ts Zod schema validates all env vars at startup.
- UFW on Hetzner: ports 22, 80, 443, 8000 only.
```

---

### `email-agent`
**Scope:** Resend transactional emails

```
You are the email agent for the multi-tenant website platform.

Your scope is ONLY:
- /src/app/api/contact/route.ts
- /src/lib/resend.ts
- /src/emails/*.tsx

Rules:
- From address: tenant.resendFromEmail — never hardcode.
- Contact form: TWO emails (admin notification + user auto-reply).
- Order confirmation: triggered from Stripe webhook.
- Rate limit /api/contact: 5 req/min/IP via Arcjet.
- Log ONLY: tenantSlug, timestamp, success|fail. Never log body content.
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| VPS | Hetzner CX22 (~$6/mo) | ~75% cheaper than DigitalOcean; NVMe SSD; 20 TB bandwidth |
| Edge / CDN / SSL | Cloudflare Free | SSL for all domains, global CDN, DDoS + WAF — $0 |
| SSL method | Cloudflare Universal SSL + Origin Cert | No Certbot, instant SSL per new tenant domain |
| Reverse proxy | Traefik via Coolify | No manual Nginx; domain routing in Coolify dashboard |
| Deployment | Coolify on Hetzner | Git push deploy, zero-downtime, no Vercel needed |
| Database | PostgreSQL 16 via @payloadcms/db-postgres | Local dev on Postgres 16; same in prod on Hetzner |
| Multi-tenancy | Payload multi-tenant plugin + middleware | Native support, clean tenant isolation |
| Navigation | Data in Payload Navigation collection | Per-site menus without code changes |
| Page routing | `[...slug]` catch-all + type-based templates | Any slug, any page type, per tenant |
| Music | react-h5-audio-player + local MP3s | Simple, accessible; Cloudflare CDN serves audio from edge |
| Video | react-player (Vimeo), dynamic import | Client uses Vimeo; handles all embed formats |
| Stripe keys | Per-tenant on Tenant record | Each site's payments fully isolated |
| Storage | Local /public/[tenant]/ | No S3/R2 needed; Cloudflare CDN caches at edge |
| Auth | Auth.js v5: super-admin + tenant-editor | Clean role separation, Payload admin scoped per editor |
| Analytics | Cloudflare Web Analytics | Zero-config, cookie-free, GDPR-compliant, no extra package |
