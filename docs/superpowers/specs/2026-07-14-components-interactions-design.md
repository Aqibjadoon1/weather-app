# Components & Interactions Refinement

## Scope

Systematic audit of all UI components, interaction states, animation consistency, accessibility, and dark mode. Pass 3 of a 3-pass full design audit following `UI-UX-design-guideline.md`.

## 1. Interaction States — Focus Visibility

### Current
Zero interactive elements have `focus-visible:` ring styles. Keyboard navigation provides no visible focus indicator.

### Target
Add `focus-visible:` ring to every interactive element:

**Pattern:** `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold`

**Components affected:** Button, FAB, TopNavbar links/icons, BottomNav items, DotNav dots, ForecastWaveChart circles, Toast dismiss, HeaderBar icons, RecentlySearched pills, LeftSidebar nav links, StatusWidget "See More" link, auth links (login/register/forgot-password), splash "Get Started"

**Exceptions:** Input — already has animated underline focus behavior. Add `focus-visible:ring-2` as keyboard fallback.

**Implementation:** One-time utility class addition per interactive element. Most are single line changes.

## 2. Component Bug Fixes

### 2a. Badge success variant
- **File:** `src/components/ui/Badge.tsx`
- **Bug:** `success` and `primary` variants both render `bg-primary text-on-primary`, making them indistinguishable
- **Fix:** Change `success` to `bg-success text-on-success`

### 2b. Duplicate glass-card CSS
- **File:** `src/app/globals.css`
- **Bug:** `.glass-card` defined twice — once in `@layer utilities` (line ~204) and once unlayered (line ~429). The unlayered version wins.
- **Fix:** Remove the `@layer utilities` version (line ~204 block), keep the unlayered version (line ~429 block)

### 2c. StatusWidget misleading fallback
- **File:** `src/components/dashboard/StatusWidget.tsx`
- **Bug:** When weather data is null, fallback `{ score: 15, label: "Good" }` shows inaccurate "Good" state
- **Fix:** Return null or render skeleton placeholder when weather prop is null

## 3. Animation Consistency

### Current
Three different spring curves:
- `spring-button`: `0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` — canonical (Keep)
- `animate-spring`: `0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)` — remove
- `bouncy-hover`: same as `spring-button` — consistent
- FAB: `transition-all duration-200` — no spring
- TopNavbar/HeaderBar icons: `active:scale-95` — snaps, no spring

### Target
Extract spring curve to a CSS variable:
```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Changes:
- Remove `animate-spring` keyframe and class
- Remove `bouncy-hover` class (redundant with `spring-button`)
- Add `spring-button` class to FAB, TopNavbar icon buttons, HeaderBar icon buttons
- Add `transition-transform` to elements with `active:scale-95` that lack it
- Replace `transition: transform 0.3s var(--ease-spring)` in globals.css

## 4. Toast Improvements

### File: `src/components/ui/Toast.tsx`

**Additions:**
- Exit animation on dismiss: `animate-out slide-out-to-right duration-200`
- `role="alert"` on individual toasts for screen reader announcement
- Limit visible toasts to 3 max (prevent stacking overflow)

## 5. Skeleton/Loading States

### 5a. RecentlySearched
- **File:** `src/components/dashboard/RecentlySearched.tsx`
- **Current:** Returns null if empty, no loading state
- **Add:** Show 4 `Skeleton` pill placeholders (`variant="rectangular"`, `h-8 w-24`) while loading, matching the pill layout

### 5b. StatusWidget
- **File:** `src/components/dashboard/StatusWidget.tsx`
- **Current:** Shows misleading "Good" fallback when weather is null
- **Add:** Return null or `Skeleton` block when weather prop is null

## 6. Dark Mode Aether Color Overrides

### File: `src/app/globals.css` — `.dark` block

Add aether color tokens to ensure components using `text-aether-*`, `bg-aether-*` etc. render correctly in dark mode:

```css
.dark {
  /* ... existing dark overrides ... */
  --color-aether-text-primary: rgba(255, 255, 255, 0.95);
  --color-aether-text-secondary: rgba(255, 255, 255, 0.70);
  --color-aether-text-muted: rgba(255, 255, 255, 0.45);
  --color-aether-ink: rgba(255, 255, 255, 0.95);
  --color-aether-ink-muted: rgba(255, 255, 255, 0.45);
  --color-aether-icon: rgba(255, 255, 255, 0.85);
  --color-aether-gold: #B8892E;
  --color-aether-gold-soft: #D4A94A;
  --color-aether-bg: #141313;
  --color-aether-surface: #1c1b1b;
}
```

## 7. Modal Component

### File: Create `src/components/ui/Modal.tsx`

Accessible, reusable modal following guideline Section 8.6:

```tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

Pattern:
- Outer wrapper: `fixed inset-0 z-50 overflow-y-auto`
- Backdrop: `fixed inset-0 bg-black/40 backdrop-blur-md` — click to close
- Flex container: `flex min-h-full items-center justify-center p-4 py-16 md:p-8`
- Modal box: `relative w-full max-w-lg bg-surface rounded-2xl p-6 md:p-8`
- Close button: SVG X icon, top-right, `absolute top-4 right-4`
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` linking to title
- Escape key closes
- Entry: `animate-fade-in-up`, exit: opacity transition

## 8. Input A11y Improvements

### File: `src/components/ui/Input.tsx`

**Changes:**
- Add `aria-invalid={!!error}` to the `<input>` element
- Add unique `id` to error `<p>` (e.g., `${name}-error`)
- Add `aria-describedby={error ? `${name}-error` : undefined}` linking input to error message

## Files Changed

- `src/components/ui/Badge.tsx` — fix success variant colors
- `src/components/ui/Toast.tsx` — exit animation, aria, stacking limit
- `src/components/ui/Input.tsx` — aria-invalid, aria-describedby
- `src/components/ui/Button.tsx` — focus-visible ring
- `src/components/ui/Card.tsx` — focus-visible (if interactive)
- `src/components/ui/Modal.tsx` — CREATE new component
- `src/components/dashboard/StatusWidget.tsx` — null on null data
- `src/components/dashboard/RecentlySearched.tsx` — skeleton loading
- `src/components/dashboard/LeftSidebar.tsx` — focus-visible on nav links
- `src/components/dashboard/BottomStrip.tsx` — focus-visible on day labels
- `src/components/dashboard/DotNav.tsx` — focus-visible on dots
- `src/components/dashboard/ForecastWaveChart.tsx` — focus-visible on circles
- `src/components/dashboard/HeaderBar.tsx` — focus-visible + spring-button on icons
- `src/components/dashboard/HeroSection.tsx` — focus-visible if any interactive
- `src/components/layout/TopNavbar.tsx` — focus-visible + spring-button on icons/links
- `src/components/layout/BottomNav.tsx` — focus-visible + spring-button
- `src/components/layout/Footer.tsx` — focus-visible on links
- `src/components/buttons/FAB.tsx` — focus-visible + spring-button
- `src/app/globals.css` — spring-button refactor, remove duplicate glass-card, remove animate-spring/bouncy-hover, add --ease-spring, add dark aether tokens
- `src/app/(auth)/login/page.tsx` — focus-visible on links
- `src/app/(auth)/register/page.tsx` — focus-visible on links
- `src/app/(auth)/forgot-password/page.tsx` — focus-visible on links
- `src/app/location-denied/page.tsx` — focus-visible on link
- `src/app/network-error/page.tsx` — focus-visible on link
- `src/components/animations/SplashScreen.tsx` — focus-visible on Get Started

## Verification

- Build passes (`npm run build`)
- Tab through every page — focus ring visible on each interactive element
- Badge success variant shows different colors from primary
- Toast shows exit animation when dismissed
- StatusWidget shows skeleton/no content when weather is null
- RecentlySearched shows skeleton pills while loading
- Dark mode aether colors render correctly
- Modal opens, closes via X/Escape/backdrop click
- Input error message linked via aria-describedby
