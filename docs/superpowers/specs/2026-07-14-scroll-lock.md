# Scroll Lock: No Document-Level Scrolling

## Problem

The `<body>` has no `overflow-y` set (defaults to `visible`), so the entire document scrolls as one continuous page. Multiple nested `min-h-screen` layouts compound this — content beyond viewport causes body-level scroll instead of being contained within designated scrollable areas.

## Solution

Lock body scroll, set all page wrappers to exact viewport height (`h-dvh`), and let specific content areas scroll independently via `overflow-y: auto`.

## Files Changed

### Core Lock
- `src/app/layout.tsx` — body: `overflow-x-hidden` → `overflow-hidden`

### Layout Wrappers (exact viewport)
- `src/components/layout/MainLayout.tsx` — outer div: `min-h-screen` → `h-dvh`
- `src/components/layout/AuthLayout.tsx` — outer div: `min-h-screen` → `h-dvh`
- `src/app/dashboard/layout.tsx` — outer div: `min-h-screen` → `h-dvh`
- `src/app/dashboard/(weather)/layout.tsx` — outer div: `min-h-dvh` → `h-dvh`

### Content Areas (scrollable)
- `src/components/layout/MainLayout.tsx` — `<main>` on dashboard: `min-h-[100dvh]` → `flex-1 overflow-y-auto`
- `src/app/dashboard/(weather)/page.tsx` — main content area: add `overflow-y-auto`

### Dashboard Pages (inner wrappers — `min-h-screen` → `h-full`)
- `src/app/dashboard/(weather)/page.tsx` — flex wrapper: `min-h-screen` → `h-full`
- `src/app/dashboard/(weather)/weekly/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/(weather)/packing/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/(weather)/search/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/today/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/notifications/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/settings/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/profile/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/empty-states/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/error/network-error/page.tsx` — outer div: `min-h-screen` → `h-full`
- `src/app/dashboard/error/location-denied/page.tsx` — outer div: `min-h-screen` → `h-full`

## Verification

- No page content is cut off (all scrollable areas can reach their full content)
- Body never scrolls (test by overscrolling on mobile/resizing small desktop)
- Sidebar scrolls independently on desktop
- Auth form scrolls if content tall
- Build passes
