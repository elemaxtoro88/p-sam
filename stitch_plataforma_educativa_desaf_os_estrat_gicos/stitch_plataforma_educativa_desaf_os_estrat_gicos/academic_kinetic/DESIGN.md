---
name: Academic Kinetic
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#632ecd'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d4ce7'
  on-tertiary-container: '#f6edff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  card-padding: 20px
  section-gap: 40px
---

## Brand & Style

The design system is engineered for "Desafíos," a platform that balances the rigor of academic management with the vibrant energy of personal growth. The brand personality is **Dynamic, Empowering, and Sophisticated**. It moves away from the typical "kiddy" educational aesthetic, instead adopting a "Pro-Tool" feel that respects the maturity of teenagers and young adults.

The visual style is **Corporate-Modern with Kinetic Accents**. It utilizes high-density information layouts common in productivity apps, softened by fluid transitions and "Atomic Habit" visual cues. The interface should feel like a high-end dashboard—clean enough to focus on deep work, yet stimulating enough to encourage daily engagement through subtle motion and tactile feedback.

## Colors

This design system uses a strategic palette to drive action and categorize the user journey:

- **Identity Blue (#2563eb):** The foundation. Used for navigation, primary branding, and "work mode" states. It represents stability and professional growth.
- **Energy Orange (#f97316):** The catalyst. Reserved strictly for high-priority calls to action, progress milestones, and "start" buttons.
- **Phase Tones:** Subtle, low-saturation background tints categorize different areas of the app without overwhelming the user. Identity (Blue tint), Health (Green tint), and Emotions (Pink/Purple tint) provide immediate environmental context.
- **Functional Neutrals:** A deep Slate (#0f172a) is used for typography to ensure high legibility and a premium feel, contrasted against clean white surfaces.

## Typography

The typography system prioritizes clarity and hierarchy to manage complex educational content.

- **Headlines (Montserrat):** Used for titles and major milestones. Its geometric nature provides a modern, confident tone. Bold weights are preferred for "Display" and "Headline" levels to create strong visual anchors.
- **Body & Labels (Inter):** Chosen for its exceptional readability on screens. Inter handles dense data (schedules, task lists, habit logs) with a neutral, professional tone.
- **Responsive Scaling:** On mobile devices, headline sizes scale down significantly to preserve vertical space while maintaining weight to keep the "bold" brand feel.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **The 8px Rhythm:** All spacing (padding, margins, gaps) must be multiples of 8px. This creates a predictable, structured layout that feels "engineered."
- **Card-Centricity:** Content is grouped into logical cards. These cards use a 20px internal padding to ensure content doesn't feel cramped, allowing the user to scan their "Desafíos" (challenges) quickly.
- **Vertical Flow:** Information is stacked by priority. High-level progress metrics sit at the top, followed by actionable "Daily Challenges," then deeper resource libraries.

## Elevation & Depth

To maintain a "High-End Productivity" feel, depth is communicated through **Tonal Layers** and **Soft Ambient Shadows**.

- **Surface Levels:** The background uses the Phase Tones (e.g., identity-blue-light). Primary cards sit one level above on pure white (#FFFFFF).
- **Shadows:** Use extremely diffused shadows (Blur: 20px, Y: 4px, Opacity: 4%) with a slight tint of the Primary Blue. This avoids a "dirty" look and makes elements appear light and airy.
- **Active State:** When a user interacts with a card or habit-trigger, the elevation should increase (larger shadow) or the border should intensify using the Energy Orange to signal focus.

## Shapes

The shape language is **Refined and Intentional**. 

- **Standard Radius:** A 0.5rem (8px) radius is the default for buttons, input fields, and small UI elements. This provides a approachable feel without being overly "bubbly."
- **Large Components:** Cards and major containers use a 1rem (16px) radius to distinguish them from functional UI elements.
- **Progress Indicators:** Circular shapes are reserved specifically for "Atomic Habit" metrics (progress rings, completion checkmarks) to differentiate between a "Task" and a "Goal."

## Components

### Buttons & Interaction
- **Primary Button:** High-contrast Identity Blue with white text.
- **Action Button (CTA):** Energy Orange. Reserved for "Submit Challenge" or "Start Session."
- **Ghost Buttons:** Transparent with a 1px border for secondary actions like "View History."

### Progress Rings (Habit Cues)
- Central to the "Desafíos" experience. Circular strokes that fill as tasks are completed. Use thin 4px strokes for a "sophisticated" look rather than thick, blocky bars.

### Cards
- White background, 16px corner radius, soft blue-tinted shadow. Cards should always have a "Header" section that includes a small icon related to the Phase (Identity, Health, Emotions).

### Input Fields
- Subtle grey borders (#E2E8F0) that transition to Identity Blue on focus. Labels are always positioned above the field in "Label-MD" typography for maximum accessibility.

### Chips & Tags
- Used for categorizing challenges (e.g., "Daily," "Weekly," "Academic"). Use low-opacity versions of the Phase colors with high-contrast text.