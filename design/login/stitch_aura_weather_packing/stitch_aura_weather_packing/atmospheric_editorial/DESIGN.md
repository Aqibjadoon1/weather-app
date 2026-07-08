---
name: Atmospheric Editorial
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e5'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fe'
  surface-container: '#ecedf9'
  surface-container-high: '#e6e8f3'
  surface-container-highest: '#e0e2ed'
  on-surface: '#181c23'
  on-surface-variant: '#414755'
  inverse-surface: '#2d3039'
  inverse-on-surface: '#eef0fc'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#4c4aca'
  on-secondary: '#ffffff'
  secondary-container: '#6664e4'
  on-secondary-container: '#fffbff'
  tertiary: '#9e3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c2c1ff'
  on-secondary-fixed: '#0c006a'
  on-secondary-fixed-variant: '#3631b4'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb595'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f9f9ff'
  on-background: '#181c23'
  surface-variant: '#e0e2ed'
typography:
  hero-temp:
    fontFamily: Playfair Display
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 110px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Playfair Display
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  element-gap: 16px
  section-margin: 40px
  asymmetric-offset: 12px
---

## Brand & Style

The design system is built on the intersection of high-end editorial publishing and playful utility. It targets travelers and commuters who appreciate precision but crave a joyful, tactile experience. The aesthetic departs from standard SaaS frameworks by embracing **Editorial Minimalism** with a **Tactile** twist.

The interface should feel like a premium physical travel journal brought to life. It avoids the rigidity of traditional grids in favor of organic, asymmetrical layouts that guide the eye through "glanceable" weather data and packing checklists. The emotional response is one of clarity, optimism, and preparedness. Key characteristics include massive typographic contrasts, airy white space, and subtle grain textures that ground the digital interface in a physical reality.

## Colors

The palette is anchored in a "Premium Bright" philosophy. While the background remains a clean, off-white to reduce eye strain and provide a sophisticated canvas, the functional colors are vibrant and high-chroma.

- **Atmospheric Gradients:** Use gradients to represent weather states within cards. Unlike flat backgrounds, these should have a soft "glow" effect, mimicking the sky's natural dispersion.
- **Ink Contrast:** Typography should never be pure black; use a deep, "ink" charcoal (#1C1C1E) to maintain the editorial feel against the pure white surfaces.
- **Functional Accents:** Use Amber for warnings and heat, Sky Blue for primary actions, and Sunset Pink for high-priority packing items or urgent alerts.

## Typography

This design system uses a high-contrast typographic pairing to achieve an editorial look. 

- **Display:** **Playfair Display** is used for hero temperatures, locations, and section headings. It should be set with tight letter-spacing for large sizes to feel "inked" and intentional.
- **UI & Body:** **Inter** handles all functional data. Use bold weights for labels to create a clear hierarchy against the elegant serif headings.
- **The "Hero Temp" Rule:** The primary temperature on the home screen should be massive, acting as the visual anchor of the entire page, often breaking typical grid boundaries.

## Layout & Spacing

This system rejects the "perfectly centered" look. It utilizes an **Asymmetric Fluid Layout**.

- **Asymmetry:** Group related elements with slight vertical offsets (e.g., a packing category label might be shifted 12px to the left of its card stack).
- **Density:** Weather forecast tiles should be high-density (small gutters, 8px), while packing lists should have generous, breathable padding (24px) to feel manageable and calm.
- **Safe Areas:** Maintain a minimum 24px margin on mobile to ensure the editorial feel isn't cramped by the hardware edges.

## Elevation & Depth

Depth is conveyed through **Ambient Stacking** rather than traditional shadows.

- **The Layer Stack:** 
    1. Base: Off-white canvas (#FAFAFA).
    2. Surfaces: Pure white cards (#FFFFFF) with a extremely soft, large-radius shadow (Blur: 40px, Opacity: 4%, Color: Secondary Indigo).
    3. Overlays: Glassmorphic blurs (Backdrop-filter: 20px) are used for sticky headers or navigation bars to maintain the "Atmospheric" feel.
- **Texture:** Apply a subtle noise/grain texture (3% opacity) to surface cards to mimic high-quality paper stock.

## Shapes

The shape language is ultra-soft and approachable. 
- **Cards:** Use a 24px (`rounded-lg`) or 32px (`rounded-xl`) radius to create a "friendly object" feel.
- **Interactive Elements:** Buttons and tags use fully rounded (pill) shapes to distinguish them from the structural containers.
- **Checkboxes:** Unlike standard squares, use circles with a 4px inner inset when active to maintain the organic flow.

## Components

### Buttons
- **Primary:** Vibrant Sky Blue with a soft white glow on hover. Pill-shaped.
- **Ghost:** No border, Indigo text, with a subtle gray-wash background appearing only on interaction.
- **FAB:** Large (64px), Amber or Pink, floating with a high-diffusion shadow to indicate the "Add Item" or "Refresh" action.

### Cards
- **Weather Tiles:** Use atmospheric gradients. Data is bottom-aligned to leave the top "sky" portion of the card open.
- **Packing Cards:** Feature a "Checklist Texture"—a subtle vertical line on the left side of the card, mimicking a notebook margin.

### Inputs
- **Minimalist:** A single 1px ink line that expands into a soft white pill shape when focused. Labels float above the line in the `label-bold` style.

### Atmosphere & Motion
- **Springs:** All transitions must use a "bouncy" spring (stiffness: 300, damping: 20).
- **Parallax:** When scrolling, weather icons (clouds/sun) should move at a slightly different speed than the cards they inhabit to create depth.