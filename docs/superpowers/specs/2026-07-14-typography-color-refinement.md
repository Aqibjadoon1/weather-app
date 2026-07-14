# Typography & Color Refinement

## Scope

Audit and update the app's typography and color system to match the `UI-UX-design-guideline.md`. This covers font consolidation, type sizing/scale, line heights, letter spacing, and color opacity tiers.

## 1. Font Consolidation

### Current

5 typefaces loaded: Playfair Display, Inter, Libre Caslon Text, Hanken Grotesk, JetBrains Mono.

### Target

Reduce to exactly 2 typefaces:
- **Playfair Display** — headline/display tokens only (`font-headline-*`, `font-hero-temp`)
- **Inter** — everything else (body, label, caption, data)

### Changes

**`src/app/fonts.ts`**
- Remove `libreCaslon`, `hankenGrotesk`, `jetbrainsMono` exports
- Keep only `playfair` and `inter`

**`src/app/layout.tsx`**
- Remove Libre Caslon Text and Hanken Grotesk `link` tags from `<head>`
- Remove those font variables from the `<html>` className
- Keep only `playfair`, `inter` variables

**`src/app/globals.css` — `@theme inline` block**
- `--font-data` → change from `"JetBrains Mono", monospace` to `"Inter", sans-serif`
- All other Inter/Playfair tokens stay the same

**`src/app/globals.css` — `.dark` block**
- `--font-headline-*` and `--font-caption` → change from `"Libre Caslon Text", serif` to `"Playfair Display", serif`
- `--font-body-*` and `--font-label-bold` → change from `"Hanken Grotesk", sans-serif` to `"Inter", sans-serif`
- `--font-data` → change from `"JetBrains Mono", monospace` to `"Inter", sans-serif`
- `--font-dark-serif` and `--font-dark-sans` → remove or reassign

**Usage updates**
- Any `font-data` class → replace with `font-body-md tabular-nums` (numbers maintain alignment via tabular-nums)

## 2. Type Scale

| Token | Current Size | New Size |
|-------|-------------|----------|
| hero-temp | 120px | 120px (keep — data display) |
| headline-lg | 48px | 48px (keep) |
| headline-lg-mobile | 36px | 36px (keep) |
| headline-md | 24px | 28px |
| body-lg | 18px | 17px |
| body-md | 16px | 16px (keep) |
| caption | 14px | 13px |
| label-bold | 12px | 12px (keep) |

### Line Heights

| Token | Line Height |
|-------|-------------|
| hero-temp / headline-lg | 1.05 |
| headline-md | 1.25 |
| body-lg / body-md | 1.55 |
| caption | 1.45 |
| label-bold | 1.4 |

### Letter Spacing

| Token | Letter Spacing |
|-------|----------------|
| hero-temp / headline-lg | -0.03em |
| headline-md | -0.01em |
| body-lg / body-md | 0 |
| caption | +0.03em |
| label-bold | +0.05em |

## 3. Color Opacity Tiers

Update white-based text opacity values:

| Token | Current | New |
|-------|---------|-----|
| `--color-aether-text-primary` | 0.95 | 0.95 (keep) |
| `--color-aether-text-secondary` | 0.75 | 0.70 |
| `--color-aether-text-muted` | 0.65 | 0.45 |

## 4. Files Changed

- `src/app/globals.css` — font tokens, `.dark` fonts, type sizes, line heights, letter spacing, color opacities
- `src/app/fonts.ts` — remove 3 font exports
- `src/app/layout.tsx` — remove font link tags and variables
- Any file using `font-data` → change to `font-body-md tabular-nums`

## 5. Verification

- Build passes (`npm run build`)
- All headline text renders in Playfair Display
- All body/label/caption/data renders in Inter
- No missing font breakage in dark mode (`.dark` section uses Playfair + Inter)
- Letter-spacing visible on uppercase labels (FEELS LIKE, HUMIDITY, etc.)
- Secondary text at 0.70 opacity is readable on sky gradients
- Muted text at 0.45 opacity is subtle but legible
