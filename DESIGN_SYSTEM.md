# CampusExchange Design System

## Overview
CampusExchange employs a modern, student-centric visual design system designed to convey trust, accessibility, and high visual polish. It features tailored brand tokens, sleek dark/light mode states, subtle glassmorphism, responsive grid layouts, and micro-animations.

---

## 1. Color Palette & Tokens

### Primary Brand Colors (Indigo / Electric Violet Scale)
- `brand-50`: `#eef2ff` (Soft background tint)
- `brand-100`: `#e0e7ff`
- `brand-500`: `#6366f1` (Primary Action Accent)
- `brand-600`: `#4f46e5` (Primary Buttons, Active States)
- `brand-700`: `#4338ca` (Hover / Focus State)
- `brand-950`: `#1e1b4b` (Dark Mode Deep Contrast)

### Neutral Surface Grays (Slate)
- **Light Theme**:
  - Background: `bg-slate-50` (`#f8fafc`)
  - Surface Card: `bg-white` (`#ffffff`)
  - Border: `border-slate-200/80`
- **Dark Theme**:
  - Background: `bg-slate-950` (`#020617`)
  - Surface Card: `bg-slate-900` (`#0f172a`)
  - Border: `border-slate-800/80`

### Semantic Accent Colors
- **Success / Available**: Emerald (`bg-emerald-500/10 text-emerald-600 border-emerald-500/20`)
- **Danger / Sold / Error**: Rose (`bg-rose-500/10 text-rose-600 border-rose-500/20`)
- **Electronics**: Blue (`bg-blue-500/10 text-blue-600`)
- **Books**: Emerald (`bg-emerald-500/10 text-emerald-600`)
- **Cycles**: Purple (`bg-purple-500/10 text-purple-600`)
- **Furniture**: Amber (`bg-amber-500/10 text-amber-600`)
- **Stationery**: Indigo (`bg-indigo-500/10 text-indigo-600`)
- **Fashion**: Pink (`bg-pink-500/10 text-pink-600`)

---

## 2. Typography

- **Headings**: `Outfit` / `Sora` (Google Fonts, Bold / Extrabold with tight letter spacing)
- **Body & Controls**: `Plus Jakarta Sans` / `Inter` (Google Fonts, 400/500/600/700 weights)

---

## 3. Shadows & Glassmorphism

- `shadow-soft`: `0 4px 20px -2px rgba(0, 0, 0, 0.05)`
- `shadow-glow`: `0 0 20px rgba(99, 102, 241, 0.25)`
- `glass-header`: `bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80`

---

## 4. Component Standards

- **Buttons**: Rounded `rounded-xl`, 5 variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), loading spinner integration, active scale effect (`active:scale-[0.98]`).
- **Cards**: Aspect-ratio fixed image containers, hover lift (`hover:-translate-y-1`), subtle borders, overlay badges for availability/condition.
- **Form Controls**: Full rounded `rounded-xl`, custom focus rings (`focus:ring-2 focus:ring-brand-500/20`), inline validation messages.
- **Navigation Bar**: Translucent sticky header, notification bell with live counter, responsive drawer navigation on mobile.
