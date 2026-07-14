# Components & Interactions Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Systematic audit of all UI components: focus-visible rings, bug fixes, animation consistency, toast improvements, loading skeletons, dark mode colors, new Modal component, Input a11y.

**Architecture:** All changes are targeted edits to existing component files and CSS, plus one new component (Modal). No data flow changes. No Redux changes.

**Tech Stack:** Next.js 16, Tailwind v4 (CSS-first), React 19

---

### Task 1: Component Bug Fixes

Three independent bug fixes in one task.

**Files:**
- Modify: `src/components/ui/Badge.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/dashboard/StatusWidget.tsx`

- [ ] **Step 1: Fix Badge success variant**

In `src/components/ui/Badge.tsx`, find the `success` variant in the `variantStyles` map and change it from `bg-primary text-on-primary` to `bg-success text-on-success`:

```tsx
const variantStyles = {
  default: "bg-aether-text-primary/10 text-aether-text-primary",
  primary: "bg-primary text-on-primary",
  success: "bg-success text-on-success",     // was: bg-primary text-on-primary
  warning: "bg-warning text-on-warning",
  error: "bg-error text-on-error",
};
```

- [ ] **Step 2: Remove duplicate glass-card from @layer utilities**

In `src/app/globals.css`, find the `.glass-card` inside `@layer utilities` (around line 204-210) and remove it. Keep the unlayered one at the bottom of the file (around line 419+).

Remove these lines:
```css
  .glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
```

Make sure the remaining `.glass-card` (the one with `background: rgba(255, 255, 255, 0.05)` and `backdrop-filter: blur(4px)`) is untouched.

- [ ] **Step 3: Fix StatusWidget null data handling**

In `src/components/dashboard/StatusWidget.tsx`, find where the component uses weather data. When weather is null, instead of showing the fallback `{ score: 15, label: "Good" }`, return a skeleton placeholder or null.

If the component already has an early return pattern, add:
```tsx
if (!weather) return null;
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Badge.tsx src/app/globals.css src/components/dashboard/StatusWidget.tsx
git commit -m "fix: Badge success variant, duplicate glass-card, StatusWidget null fallback"
```

---

### Task 2: Focus-Visible Rings — UI & Layout Components

Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold` to all interactive elements.

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Toast.tsx`
- Modify: `src/components/ui/Card.tsx`
- Modify: `src/components/buttons/FAB.tsx`
- Modify: `src/components/layout/TopNavbar.tsx`
- Modify: `src/components/layout/BottomNav.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/dashboard/LeftSidebar.tsx`
- Modify: `src/components/dashboard/HeaderBar.tsx`

**Pattern for each:** Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold` to the element's `className` string.

- [ ] **Step 1: Button** — Add focus-visible to the `<button>` element in `Button.tsx`

Find the `className` computed value. Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold` to the class string.

For example, if the className is:
```tsx
className={cn(
  "spring-button rounded-full font-label-bold uppercase tracking-widest inline-flex items-center justify-center gap-2",
  // ...
  className
)}
```
Add the focus ring classes:
```tsx
className={cn(
  "spring-button rounded-full font-label-bold uppercase tracking-widest inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
  // ...
  className
)}
```

- [ ] **Step 2: FAB** — Same pattern on the `<Link>` or `<button>` element

- [ ] **Step 3: TopNavbar** — Add to nav links and icon buttons. Find each `<Link>` and `<button>` className and append the focus classes.

- [ ] **Step 4: BottomNav** — Add to each nav `<Link>` element

- [ ] **Step 5: Footer** — Add to each `<Link>` or `<a>` element

- [ ] **Step 6: LeftSidebar** — Add to nav link elements

- [ ] **Step 7: HeaderBar** — Add to icon buttons and the search link

- [ ] **Step 8: Card** — Add to the outer div (if interactive) or any `<button>` within

- [ ] **Step 9: Toast dismiss** — Add to the dismiss `<button>`

- [ ] **Step 10: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Toast.tsx src/components/ui/Card.tsx src/components/buttons/FAB.tsx src/components/layout/TopNavbar.tsx src/components/layout/BottomNav.tsx src/components/layout/Footer.tsx src/components/dashboard/LeftSidebar.tsx src/components/dashboard/HeaderBar.tsx
git commit -m "a11y: add focus-visible rings to UI and layout components"
```

---

### Task 3: Focus-Visible Rings — Dashboard & Auth Pages

**Files:**
- Modify: `src/components/dashboard/StatusWidget.tsx`
- Modify: `src/components/dashboard/RecentlySearched.tsx`
- Modify: `src/components/dashboard/DotNav.tsx`
- Modify: `src/components/dashboard/BottomStrip.tsx`
- Modify: `src/components/dashboard/ForecastWaveChart.tsx`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `src/app/(auth)/forgot-password/page.tsx`
- Modify: `src/app/location-denied/page.tsx`
- Modify: `src/app/network-error/page.tsx`
- Modify: `src/components/animations/SplashScreen.tsx`

- [ ] **Step 1: StatusWidget** — Add focus-visible to "See More" link

- [ ] **Step 2: RecentlySearched** — Add focus-visible to pill buttons and "See All" link

- [ ] **Step 3: DotNav** — Add focus-visible to each dot button

- [ ] **Step 4: BottomStrip** — Add focus-visible to day labels (if interactive)

- [ ] **Step 5: ForecastWaveChart** — Add focus-visible to clickable dots/circles

- [ ] **Step 6: Auth pages** (login, register, forgot-password) — Add focus-visible to links (e.g., "Sign up", "Forgot password?", "Back to login")

- [ ] **Step 7: Error pages** (location-denied, network-error) — Add focus-visible to retry/back links

- [ ] **Step 8: SplashScreen** — Add focus-visible to "Get Started" link/button

- [ ] **Step 9: Commit**

```bash
git add src/components/dashboard/StatusWidget.tsx src/components/dashboard/RecentlySearched.tsx src/components/dashboard/DotNav.tsx src/components/dashboard/BottomStrip.tsx src/components/dashboard/ForecastWaveChart.tsx src/app/\(auth\)/login/page.tsx src/app/\(auth\)/register/page.tsx src/app/\(auth\)/forgot-password/page.tsx src/app/location-denied/page.tsx src/app/network-error/page.tsx src/components/animations/SplashScreen.tsx
git commit -m "a11y: add focus-visible rings to dashboard and page components"
```

---

### Task 4: Animation Consistency

Unify spring curves, remove duplicates, add spring-button to components missing it.

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/buttons/FAB.tsx`
- Modify: `src/components/layout/TopNavbar.tsx`
- Modify: `src/components/dashboard/HeaderBar.tsx`

- [ ] **Step 1: Add --ease-spring CSS variable and refactor spring-button in globals.css**

In `src/app/globals.css`, in the `@theme inline` block, add the spring curve variable:
```css
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Then update the `.spring-button` utility class to use the variable:
```css
  .spring-button {
    transition: transform 0.3s var(--ease-spring);
  }
  .spring-button:hover {
    transform: scale(1.02) translateY(-2px);
  }
  .spring-button:active {
    transform: scale(0.95);
  }
```

- [ ] **Step 2: Remove animate-spring and bouncy-hover classes**

Remove the `animate-spring` class and `@keyframes spring-bounce` block:
```css
@keyframes spring-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.animate-spring:active {
  animation: spring-bounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

Remove the `.bouncy-hover` class:
```css
  .bouncy-hover {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .bouncy-hover:hover {
    transform: scale(1.02) translateY(-4px);
  }
```

- [ ] **Step 3: Add spring-button to FAB**

In `src/components/buttons/FAB.tsx`, find the className and add `spring-button`. Remove inline hover/active Tailwind classes if they duplicate spring-button behavior.

If current className has `transition-all duration-200 hover:scale-110 active:scale-90`, replace with `spring-button` (which already handles hover:scale and active:scale).

- [ ] **Step 4: Add spring-button to TopNavbar icon buttons**

In `src/components/layout/TopNavbar.tsx`, find the icon `<button>` elements and:
- Add `spring-button` class
- Remove `active:scale-95` if present (spring-button already handles active)
- Add `transition-transform` if `spring-button` alone doesn't cover it

- [ ] **Step 5: Add spring-button to HeaderBar icon buttons**

In `src/components/dashboard/HeaderBar.tsx`, same pattern as TopNavbar.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/buttons/FAB.tsx src/components/layout/TopNavbar.tsx src/components/dashboard/HeaderBar.tsx
git commit -m "refactor: unify spring animation curves, remove duplicates"
```

---

### Task 5: Toast Improvements

Add exit animation, aria roles, and stacking limit.

**Files:**
- Modify: `src/components/ui/Toast.tsx`

- [ ] **Step 1: Read the current Toast.tsx to understand its structure**

- [ ] **Step 2: Add exit animation to Toast dismissal**

Add an `animate-out slide-out-to-right duration-200` class to the toast element conditionally when it's being removed. The simplest approach: use a `leaving` state that triggers before actual removal from the DOM.

Or if using a simpler approach, add the classes directly and let Tailwind handle it:
```tsx
className={`... animate-out slide-out-to-right duration-200 ...`}
```

- [ ] **Step 3: Add role="alert" to toast items**

Add `role="alert"` to each individual toast `<div>`.

- [ ] **Step 4: Add stacking limit**

In the `ToastContainer`, limit the rendered toasts to the last 3:
```tsx
const visibleToasts = toasts.slice(-3);
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Toast.tsx
git commit -m "feat: toast exit animation, aria alert role, stacking limit"
```

---

### Task 6: Skeleton Loading States

**Files:**
- Modify: `src/components/dashboard/RecentlySearched.tsx`
- Modify: `src/components/dashboard/StatusWidget.tsx` (already modified in Task 1 — may need re-read)

- [ ] **Step 1: Read both files to understand current state**

- [ ] **Step 2: Add skeleton to RecentlySearched**

When loading, render 4 pill-shaped skeleton placeholders matching the layout:
```tsx
{loading && !items?.length ? (
  <div className="flex gap-2 overflow-x-auto px-4 pb-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-8 w-24 rounded-full bg-surface-container-high animate-pulse flex-shrink-0" />
    ))}
  </div>
) : null}
```

- [ ] **Step 3: Ensure StatusWidget handles null**

If Task 1 already added `if (!weather) return null;`, verify it's there. If StatusWidget needs a skeleton instead of early return, add:
```tsx
if (!weather) {
  return (
    <div className="glass-card rounded-2xl p-4 md:p-6">
      <div className="h-4 w-20 bg-surface-container-high animate-pulse rounded mb-3" />
      <div className="h-8 w-32 bg-surface-container-high animate-pulse rounded" />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/RecentlySearched.tsx src/components/dashboard/StatusWidget.tsx
git commit -m "feat: add skeleton loading states to RecentlySearched and StatusWidget"
```

---

### Task 7: Dark Mode Aether Color Overrides

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add aether color tokens to the .dark block**

In `src/app/globals.css`, inside the `.dark` block (after the existing font tokens at the end), add:

```css
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add aether color overrides to dark mode"
```

---

### Task 8: Modal Component

**Files:**
- Create: `src/components/ui/Modal.tsx`

- [ ] **Step 1: Create Modal component**

Create `src/components/ui/Modal.tsx`:

```tsx
import { useEffect, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4 py-16 md:p-8">
        <div className="relative w-full max-w-lg bg-surface rounded-2xl p-6 md:p-8 shadow-xl animate-fade-in-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-aether-text-primary/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 id="modal-title" className="font-headline-md text-headline-md text-aether-text-primary mb-4 pr-8">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Modal.tsx
git commit -m "feat: add accessible Modal component"
```

---

### Task 9: Input A11y Improvements

**Files:**
- Modify: `src/components/ui/Input.tsx`

- [ ] **Step 1: Read current Input.tsx to understand its props and structure**

- [ ] **Step 2: Add aria-invalid, aria-describedby, and error id**

Find the `<input>` element render and the error `<p>` render. Add:

1. Generate an error ID from the input's `name` prop:
```tsx
const errorId = name ? `${name}-error` : undefined;
```

2. Add to the `<input>`:
```tsx
aria-invalid={!!error}
aria-describedby={error ? errorId : undefined}
```

3. Add to the error `<p>`:
```tsx
id={errorId}
role="alert"
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Input.tsx
git commit -m "a11y: add aria-invalid and aria-describedby to Input"
```

---

### Task 10: Build Verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Compiled successfully, no TypeScript errors, all pages generated.

- [ ] **Step 2: Fix any build errors**

If the build fails, fix issues and rebuild until clean.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix: build fixes after components interactions refinement"
```
