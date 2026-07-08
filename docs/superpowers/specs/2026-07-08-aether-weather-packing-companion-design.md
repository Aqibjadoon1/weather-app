# Aether Weather & Packing Companion — Design Specification

## Overview
Premium weather and packing companion application built with Next.js App Router. Features atmospheric editorial design with asymmetric fluid layouts, WebGL shader animations, Three.js 3D scenes, temporal theming, and an AI packing recommendation system.

## Design System

### Brand & Style
- **Aesthetic:** Editorial Minimalism with Tactile twist
- **Target:** Travelers and commuters
- **Emotion:** Clarity, optimism, preparedness
- **Key characteristics:** Massive typographic contrast, airy white space, subtle grain textures

### Color Palettes

#### Light Theme (Primary)
- Surface: `#f9f9ff`, Surface Container: `#ecedf9`
- Primary: `#0058bc`, Secondary: `#4c4aca`, Tertiary: `#9e3d00`
- Background: `#f9f9ff`, On-Surface: `#181c23`
- Error: `#ba1a1a`

#### Dark Theme (High Contrast / Modern)
- Surface: `#141313`, Surface Container: `#201f1f`
- Primary: `#ffffff`, Secondary: `#c6c6c7`
- Background: `#141313`, On-Surface: `#e5e2e1`
- Glassmorphism: backdrop-blur(20px), semi-transparent fills

#### Temporal Palette (Time-aware)
- Morning: soft amber/peach washes
- Afternoon: high-energy sky blues and crisp whites
- Evening: deep indigo and violet gradients
- Night: inky navy and charcoal with "True Black"

### Typography
| Style | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| hero-temp | Playfair Display | 120px | 700 | 110px |
| headline-lg | Playfair Display | 48px | 700 | 52px |
| headline-lg-mobile | Playfair Display | 36px | 700 | 40px |
| headline-md | Playfair Display | 24px | 600 | 32px |
| body-lg | Inter | 18px | 400 | 28px |
| body-md | Inter | 16px | 400 | 24px |
| label-bold | Inter | 12px | 700 | 16px |
| caption | Playfair Display | 14px | 400 | 20px |

#### Dark Theme Typography
| Style | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| display-xl | Libre Caslon Text | 80px | 400 | 88px |
| headline-lg | Libre Caslon Text | 48px | 400 | 56px |
| headline-lg-mobile | Libre Caslon Text | 32px | 400 | 40px |
| body-md | Hanken Grotesk | 16px | 400 | 24px |
| label-caps | Hanken Grotesk | 12px | 700 | 16px |

### Shapes & Borders
- Cards: `rounded-3xl` (24px), `rounded-[2.5rem]` (32px)
- Interactive: `rounded-full` (pill)
- Checkboxes: circular with 4px inner inset
- Light cards: 24px border radius
- Dark cards: 4px-8px border radius

### Elevation
- **Ambient Stacking:** Soft shadows (Blur: 40px, Opacity: 4%, Color: Secondary Indigo)
- **Glassmorphism:** backdrop-filter: blur(20px) for sticky headers/nav
- **Texture:** 3% noise/grain on surfaces

### Spacing
- Unit: 8px power-of-two scale
- Container padding: 24px (mobile safe area)
- Element gap: 16px
- Section margin: 40px
- Asymmetric offset: 12px
- Dark theme desktop margin: 64px, mobile: 20px

## Architecture

### Tech Stack
- Next.js App Router (15.x)
- React 19
- Tailwind CSS v4
- Firebase Authentication
- Firebase Firestore
- Classic Redux (NO Redux Toolkit)
- Three.js (WebGL animations)
- GSAP (for complex spring animations)

### Project Structure
```
app/
├── (auth)/          # Login, Signup, Forgot Password
├── (dashboard)/     # Main app pages (protected)
│   ├── page.tsx     # Primary Dashboard
│   ├── forecast/    # Today's & Weekly Forecast
│   ├── packing/     # AI Packing Companion
│   ├── explore/     # Search & Explore
│   ├── profile/     # User Profile
│   ├── settings/    # App Settings
│   └── notifications/
├── loading.tsx      # Splash/Loading Screen
├── error.tsx        # Error boundary
├── not-found.tsx    # 404 page
└── layout.tsx       # Root layout
```

### Redux Architecture (Classic)
- **actions/** — Action creators and async thunks
- **reducers/** — weather, forecast, packing, auth, ui, settings, notifications
- **store/** — createStore, combineReducers, applyMiddleware
- **types/** — TypeScript interfaces and types
- **constants/** — Action type string constants
- **selectors/** — Memoized selectors

### Pages (from design folder)
1. **Splash Screen** — Animated logo, clouds, weather, loading text
2. **Login** — Split screen with shader/Three.js background, floating label form
3. **Sign Up** — Desktop + mobile, progress bar, profile upload, unit preferences
4. **Primary Dashboard** — Hero section with thermometer, metrics bento grid, 7-day forecast, packing companion, saved cities
5. **Today's Forecast** — Snap-scroll journey through Morning/Afternoon/Evening/Night with temporal gradients
6. **Weekly Forecast** — Visual timeline with horizontal scroll, shader backgrounds
7. **Search Experience** — Desktop + mobile search with dropdown results
8. **Profile** — User info, preferences, activity stats
9. **Settings** — Theme toggle, units, notifications, privacy
10. **Notification Centre** — Desktop + mobile notification list
11. **AI Packing Companion** — Chat interface with weather-aware recommendations
12. **Error Pages** — 404, 500, Network Error, Location Denied
13. **Empty States** — No search results, no saved cities, no history, offline, no notifications

### Animations
- **Spring transitions:** cubic-bezier(0.34, 1.56, 0.64, 1) — bouncy feel
- **Shader animations:** WebGL simplex noise for sky/cloud effects
- **Three.js scenes:** 3D sun with rays, birds, floating particles
- **Scroll animations:** IntersectionObserver reveal, parallax effects
- **Hover effects:** bouncy-hover (scale + translate), material symbol transitions
- **Fade-in-up:** cubic-bezier(0.16, 1, 0.3, 1) for section entries

### Services Layer
- Component → Hook → Service → API Route → External API
- Firebase Auth service
- Weather API service (server-side)
- Packing recommendations service
- Location/Geocoding service

### Middleware
- Auth route protection
- Redirect authenticated users from login/signup
- Theme cookie handling

## Key Components

### Reusable UI
- Button (Primary, Ghost, FAB)
- Input (Floating label, underline style)
- WeatherCard (atmospheric gradient + bottom-aligned data)
- ForecastTile (compact day card)
- MetricCard (humidity, wind, UV, visibility)
- PackingCard (checklist texture with notebook margin line)
- NavigationBar (desktop top nav, mobile bottom nav)
- SavedCityItem
- SearchInput/SearchDropdown
- Modal/Dialog
- Toast/Notification
- SkeletonLoader
- Avatar with upload

### Custom Hooks
- useWeather() — current weather data
- useForecast() — 7-day/hourly forecast
- usePacking() — packing recommendations
- useSearch() — city search with debounce
- useAuthentication() — Firebase auth lifecycle
- useCurrentLocation() — geolocation
- useTheme() — light/dark/temporal theme
- useAnimations() — scroll reveal, parallax
- useToast() — notification toasts
- useMediaQuery() — responsive breakpoints

## Key Implementation Details

1. Primary Dashboard hero section uses WebGL shader + Three.js overlay
2. Today's Forecast uses full-viewport snap-scroll with four temporal states
3. All forms use floating labels with underline-to-pill expansion on focus
4. Grain texture applied via CSS pseudo-elements with transparent texture image
5. Font loading via next/font (Playfair Display + Inter for light, Libre Caslon Text + Hanken Grotesk for dark)
6. Material Symbols for iconography
7. Packing cards feature a left-side colored border (checklist texture)
8. Mobile bottom nav with active state indicator using primary-container background
9. FAB (Floating Action Button) positioned bottom-right
10. Progress bar on signup that fills based on form completion
11. Unit toggle (Metric/Imperial) with sliding indicator
12. Google Sign-In button with proper SVG icon
