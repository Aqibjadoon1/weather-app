---
name: Atmospheric Editorial
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-xl:
    fontFamily: Libre Caslon Text
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 88px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is an immersive, time-aware framework designed for editorial and luxury storytelling. It leans heavily into a **High-Contrast / Modern** aesthetic with **Glassmorphism** influences to handle changing environmental states. The brand personality is sophisticated, observant, and reactive, shifting its visual tone to match the user's local time of day. 

The core experience revolves around a "dynamic canvas" that serves as the backdrop for high-fidelity typography. The UI evokes a sense of presence and rhythm, transitioning between four distinct atmospheric states to reduce cognitive load and enhance the emotional resonance of the content. High-contrast data overlays ensure that utility is never sacrificed for atmosphere.

## Colors
The color strategy uses a "Temporal Palette" that swaps core tokens based on the time of day. While the primary and secondary colors for UI elements (like buttons or active states) remain consistently high-contrast, the environmental tokens shift:

- **Morning:** Uses soft amber and peach washes to evoke sunrise. Text contrast is maintained with deep earthy browns.
- **Afternoon:** High-energy sky blues and crisp whites. This is the "high-noon" state with maximum clarity.
- **Evening:** Deep indigo and violet gradients. Interactive elements take on a neon-adjacent glow to remain visible against dark backgrounds.
- **Night:** Inky navy and charcoal. This state uses "True Black" for deep surfaces to minimize light bleed, with stark white or cyan for critical data.

All data overlays must maintain a minimum 7:1 contrast ratio against the atmospheric background.

## Typography
The system employs a classic-meets-modern pairing. **Libre Caslon Text** provides an authoritative, editorial voice for headings, suggesting a physical broadsheet or high-end magazine. **Hanken Grotesk** offers a sharp, contemporary counterpoint for functional text and UI labels, ensuring legibility at small sizes.

Large display type should utilize negative letter spacing to create a tight, architectural feel. For mobile, headline scales are aggressively reduced to ensure three-line caps are avoided.

## Layout & Spacing
This design system uses a **Fixed Grid** for desktop and a **Fluid Grid** for mobile devices. The layout is structured on a strict 8px baseline power-of-two scale.

- **Desktop:** 12-column grid with a 1280px max-width, centered in the viewport. 
- **Mobile:** 4-column fluid grid with 20px side margins. 
- **Vertical Rhythm:** Spacing between editorial sections should be generous (80px to 120px) to allow the atmospheric background gradients to "breathe" and set the tone.

## Elevation & Depth
Depth is created through **Glassmorphism** and light-source simulation rather than traditional drop shadows.

- **Surface Layers:** Use backdrop-blur (minimum 20px) and semi-transparent fills. 
- **Lighting:** In "Morning" and "Afternoon," surfaces have a subtle 1px white top-border to simulate natural overhead light. In "Evening" and "Night," surfaces use a "rim-light" effect—a thin, colored outer stroke that matches the atmospheric accent color.
- **Tonal Tiers:** Content is elevated through contrast. Secondary information is tucked into lower-opacity containers, while primary data sits on the most opaque glass layer.

## Shapes
The shape language is **Soft** and structured. A 4px (0.25rem) base radius is used for interactive elements to maintain a professional, editorial edge. 

Cards and large containers may scale up to `rounded-lg` (8px) to soften the transition between the background atmospheric gradients and the hard-edged content. Circular shapes are reserved strictly for avatars or status indicators to avoid breaking the grid-heavy editorial aesthetic.

## Components
- **Buttons:** Primary buttons use solid fills (Black in light modes, White in dark modes) for maximum visibility. Secondary buttons are "Ghost" style with a 1px border.
- **Atmospheric Cards:** Containers that house data. They must use the `surface` token of the current time-state with a `backdrop-filter: blur()`.
- **Data Overlays:** Small chips or labels used for metrics. These always use the highest contrast pairing (e.g., White text on Night background) and are often paired with a monospaced font variant for a technical feel.
- **Inputs:** Minimalist bottom-border only inputs for an elegant, non-intrusive look. The focus state triggers a glow effect matching the current atmospheric accent color.
- **Progress Bars:** Thin 2px lines. The background of the bar is a low-opacity version of the accent color, with the progress indicator being the full-saturation accent.