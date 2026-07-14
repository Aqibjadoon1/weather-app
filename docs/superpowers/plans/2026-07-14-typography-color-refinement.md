# Typography & Color Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce to 2 typefaces (Playfair + Inter), fix type scale to match guideline, add line heights/letter-spacing, tighten color opacity tiers.

**Architecture:** All changes are CSS variable swaps in `globals.css` with targeted file updates in `fonts.ts`, `layout.tsx`, and a grep-replace for `font-data`.

**Tech Stack:** Tailwind v4 (CSS-first config), Next.js 16

---

### Task 1: Remove unused font exports

**Files:**
- Modify: `src/app/fonts.ts` (entire file)

- [ ] **Step 1: Rewrite fonts.ts to only export Playfair + Inter**

```ts
export const playfair = {
  variable: "--font-serif",
};

export const inter = {
  variable: "--font-sans",
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/fonts.ts
git commit -m "refactor: remove unused font exports, keep Playfair + Inter only"
```

---

### Task 2: Remove unused font link tags from layout

**Files:**
- Modify: `src/app/layout.tsx` (remove font variables and link tags)

- [ ] **Step 1: Remove Libre Caslon, Hanken Grotesk, JetBrains Mono from the `<html>` className**

Current:
```tsx
className={`${playfair.variable} ${inter.variable} ${libreCaslon.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
```

New:
```tsx
className={`${playfair.variable} ${inter.variable} h-full antialiased`}
```

- [ ] **Step 2: Remove Libre Caslon, Hanken Grotesk link tags from `<head>`**

Remove this entire block:
```tsx
<link
  href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Hanken+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 3: Remove unused imports**

Remove `libreCaslon`, `hankenGrotesk`, `jetbrainsMono` from the import line.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "refactor: remove unused font links from layout"
```

---

### Task 3: Update globals.css — font tokens, type scale, line heights, letter spacing, color opacities

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the entire `@theme inline` font tokens block**

Current (lines 69-81):
```
  --font-headline-md: "Playfair Display", serif;
  --font-headline-lg: "Playfair Display", serif;
  --font-hero-temp: "Playfair Display", serif;
  --font-headline-lg-mobile: "Playfair Display", serif;
  --font-caption: "Playfair Display", serif;
  --font-body-lg: "Inter", sans-serif;
  --font-body-md: "Inter", sans-serif;
  --font-label-bold: "Inter", sans-serif;
  --font-data: "JetBrains Mono", monospace;
```

Replace with (note: `font-caption` changes to Inter, `font-data` changes to Inter):
```
  --font-headline-md: "Playfair Display", serif;
  --font-headline-lg: "Playfair Display", serif;
  --font-hero-temp: "Playfair Display", serif;
  --font-headline-lg-mobile: "Playfair Display", serif;
  --font-caption: "Inter", sans-serif;
  --font-body-lg: "Inter", sans-serif;
  --font-body-md: "Inter", sans-serif;
  --font-label-bold: "Inter", sans-serif;
  --font-data: "Inter", sans-serif;
```

- [ ] **Step 2: Update `--font-size-*` tokens to new type scale**

Current:
```
  --font-size-hero-temp: 120px;
  --font-size-headline-lg: 48px;
  --font-size-headline-lg-mobile: 36px;
  --font-size-headline-md: 24px;
  --font-size-body-lg: 18px;
  --font-size-body-md: 16px;
  --font-size-label-bold: 12px;
  --font-size-caption: 14px;
```

Replace with:
```
  --font-size-hero-temp: 120px;
  --font-size-headline-lg: 48px;
  --font-size-headline-lg-mobile: 36px;
  --font-size-headline-md: 28px;
  --font-size-body-lg: 17px;
  --font-size-body-md: 16px;
  --font-size-label-bold: 12px;
  --font-size-caption: 13px;
```

- [ ] **Step 3: Add `--font-*-line-height` and `--font-*-letter-spacing` tokens after the font-size block**

Add after the font-size tokens:
```
  --font-hero-temp-line-height: 1.05;
  --font-headline-lg-line-height: 1.05;
  --font-headline-md-line-height: 1.25;
  --font-body-lg-line-height: 1.55;
  --font-body-md-line-height: 1.55;
  --font-caption-line-height: 1.45;
  --font-label-bold-line-height: 1.4;

  --font-hero-temp-letter-spacing: -0.03em;
  --font-headline-lg-letter-spacing: -0.03em;
  --font-headline-md-letter-spacing: -0.01em;
  --font-body-lg-letter-spacing: 0;
  --font-body-md-letter-spacing: 0;
  --font-caption-letter-spacing: 0.03em;
  --font-label-bold-letter-spacing: 0.05em;
```

- [ ] **Step 4: Update the `font-*` utility classes in `@layer utilities` to use the new line-height and letter-spacing tokens**

Check if utility classes like `.font-hero-temp` exist in globals.css. If they don't (Tailwind v4 generates them automatically from `--font-*` tokens), then we need a different approach.

For Tailwind v4, `--font-*` tokens in `@theme inline` generate font-family utilities but NOT line-height/letter-spacing. We need to either:
1. Use Tailwind's font shorthand: `--font-hero-temp: "Playfair Display", serif, /* line-height */ 1.05, /* letter-spacing */ -0.03em;`
2. Or add CSS utility classes manually

For Tailwind v4, the font shorthand works. Let me update the font tokens to include line-height and letter-spacing in the value using Tailwind v4's font shorthand format:

Actually, looking at Tailwind v4 docs, font-family values in `@theme` can include line-height and letter-spacing as additional values. Let me use this approach.

Replace each font token with the full shorthand:
```
  --font-hero-temp: "Playfair Display", serif;
```
becomes:
```
  --font-hero-temp: "Playfair Display", serif, 1.05, -0.03em;
```

Let me do this for all font tokens:
```
  --font-hero-temp: "Playfair Display", serif, 1.05, -0.03em;
  --font-headline-lg: "Playfair Display", serif, 1.05, -0.03em;
  --font-headline-lg-mobile: "Playfair Display", serif, 1.05, -0.03em;
  --font-headline-md: "Playfair Display", serif, 1.25, -0.01em;
  --font-caption: "Inter", sans-serif, 1.45, 0.03em;
  --font-body-lg: "Inter", sans-serif, 1.55, 0;
  --font-body-md: "Inter", sans-serif, 1.55, 0;
  --font-label-bold: "Inter", sans-serif, 1.4, 0.05em;
  --font-data: "Inter", sans-serif, 1.55, 0;
```

- [ ] **Step 5: Update the `.dark` font tokens**

Replace the entire `.dark` font block:
```
  --font-headline-md: "Playfair Display", serif, 1.25, -0.01em;
  --font-headline-lg: "Playfair Display", serif, 1.05, -0.03em;
  --font-hero-temp: "Playfair Display", serif, 1.05, -0.03em;
  --font-headline-lg-mobile: "Playfair Display", serif, 1.05, -0.03em;
  --font-caption: "Inter", sans-serif, 1.45, 0.03em;
  --font-body-lg: "Inter", sans-serif, 1.55, 0;
  --font-body-md: "Inter", sans-serif, 1.55, 0;
  --font-label-bold: "Inter", sans-serif, 1.4, 0.05em;
  --font-data: "Inter", sans-serif, 1.55, 0;
```

Remove the `--font-dark-serif` and `--font-dark-sans` variables (lines 79-80 in globals.css):
```
  --font-dark-serif: "Libre Caslon Text", serif;
  --font-dark-sans: "Hanken Grotesk", sans-serif;
```

- [ ] **Step 6: Update color opacity tiers**

Current:
```
  --color-aether-text-secondary: rgba(255, 255, 255, 0.75);
  --color-aether-text-muted: rgba(255, 255, 255, 0.65);
```

Change to:
```
  --color-aether-text-secondary: rgba(255, 255, 255, 0.70);
  --color-aether-text-muted: rgba(255, 255, 255, 0.45);
```

Also update the companion variables:
```
  --color-aether-ink-muted: rgba(255, 255, 255, 0.55);
```
Change to:
```
  --color-aether-ink-muted: rgba(255, 255, 255, 0.45);
```

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: update typography scale, line-height, letter-spacing, and color opacities"
```

---

### Task 4: Replace font-data class usage across the app

**Files:**
- Grep: all `src/**/*.{ts,tsx}` for `font-data`
- Modify: each file found

- [ ] **Step 1: Find all `font-data` usages**

Run: `rg "font-data" src/ --include "*.tsx" --include "*.ts" -n`

Expected: several matches in dashboard pages (temperature values, stats numbers)

- [ ] **Step 2: Replace each `font-data` class with `font-body-md tabular-nums`**

For each file found, replace `font-data` with `font-body-md tabular-nums`.

- [ ] **Step 3: Verify no remaining `font-data` references**

Run: `rg "font-data" src/` — should return no results.

- [ ] **Step 4: Commit**

```bash
git add <all-changed-files>
git commit -m "refactor: replace font-data with font-body-md tabular-nums"
```

---

### Task 5: Build verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Compiled successfully, no TypeScript errors, all pages generated.

- [ ] **Step 2: Fix any build errors**

If the build fails, fix issues and rebuild until clean.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix: build fixes after typography refinement"
```
