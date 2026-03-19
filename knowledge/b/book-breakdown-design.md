# Design System Specification: Editorial Precision

## 1. Overview & Creative North Star: "The Digital Atheneum"
This design system moves beyond the "app" paradigm and into the realm of the "digital artifact." Our Creative North Star is **The Digital Atheneum**—a space that feels as structured and permanent as a high-end physical archive, yet as fluid as a modern editorial layout.

To achieve this, we reject the rigid, boxed-in layouts of standard SaaS products. Instead, we utilize **intentional asymmetry**, high-contrast typography scales, and **tonal layering**. The goal is to create a "document-centric" experience where the interface recedes, allowing the user's content to take center stage. We treat the screen not as a grid of buttons, but as a series of tactile, stacked surfaces that breathe through generous whitespace.

---

## 2. Colors: Tonal Architecture
The palette is rooted in a "Paper & Ink" philosophy, utilizing subtle shifts in temperature rather than heavy lines to define structure.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited.
Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` sidebar should sit directly against a `surface` background. The eye should perceive the change in depth through color, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium cardstock.
- **Base Layer:** `surface` (#f9f9fb)
- **Secondary Workspace:** `surface_container_low` (#f3f3f5)
- **Interactive Floating Elements:** `surface_container_lowest` (#ffffff)
- **Elevated Modals:** `surface_bright` (#f9f9fb) with backdrop blurs.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" feel, use **Glassmorphism** for navigation bars and floating menus. Utilize semi-transparent versions of `surface_container_lowest` with a `backdrop-filter: blur(20px)`.

### Signature Textures
Main CTAs and Hero sections should utilize a subtle linear gradient from `primary` (#416372) to `primary_container` (#b9dcee) at a 135-degree angle. This adds a "lithographic" quality to the interface that flat fills lack.

---

## 3. Typography: Editorial Authority
We utilize **Inter** as our typographic workhorse, but we treat it with the discipline of a print typesetter.

| Level | Size | Weight | Role |
| :--- | :--- | :--- | :--- |
| **Display LG** | 3.5rem | 600 | Hero moments; extreme negative letter-spacing (-0.02em). |
| **Headline MD** | 1.75rem | 500 | Section headers; sets the rhythmic pace of the document. |
| **Title SM** | 1.0rem | 600 | Subsection identifiers; high-contrast against body text. |
| **Body LG** | 1.0rem | 400 | Primary reading experience; 1.6x line-height for breathability. |
| **Label SM** | 0.6875rem | 700 | Metadata; always Uppercase with +0.05em tracking. |

The hierarchy is designed to guide the eye through a clear narrative flow. By using `display-lg` for headers and `label-sm` for metadata, we create a sophisticated tension between the large and the small.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "muddy." In this system, we achieve depth through ambient light simulation.

- **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f3f3f5) section. This 2-point hex shift is enough to create a "soft lift" that feels architectural rather than digital.
- **Ambient Shadows:** For floating elements (menus/modals), use a "Diffusion Shadow":
- `box-shadow: 0 12px 40px rgba(26, 28, 29, 0.06);` (Using a tinted version of `on_surface`).
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at 15% opacity. Never use a 100% opaque border.
- **Glassmorphism Depth:** When using glass layers, the `surface_container_highest` (#e2e2e4) token should be used for a 1px inner-glow (top edge only) to mimic the edge of a glass pane.

---

## 5. Components: Tactile Minimalism

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `roundness-md`, no border.
- **Secondary:** `surface_container_high` background with `on_surface` text.
- **Tertiary:** Pure text with `on_primary_container` color, switching to a subtle `surface_container_low` background on hover.

### Cards & Lists
**Strict Rule:** No divider lines. Separate list items using the spacing scale (e.g., `8` / 2rem) or by alternating background tints (`surface` vs `surface_container_low`).
- **Cards:** Should use `roundness-xl` (1.5rem) to feel friendly yet substantial.

### Input Fields
Inputs should not be boxes. Use a "Minimalist Underscore" or a solid `surface_container_highest` block with `roundness-sm`. Focus states should transition the background to `primary_fixed` (#c5e8fa) at 20% opacity.

### The "Canvas" Component
A unique component for this system. A large, white (`surface_container_lowest`) central area with extra-wide margins (Spacing `24`) that mimics a physical sheet of paper, centered on a `surface` background.

---

## 6. Do's and Don'ts

### Do
- **Do** use `24` (6rem) spacing for top-level section padding to create an editorial feel.
- **Do** use `title-sm` for buttons to give them a firm, authoritative presence.
- **Do** allow content to overflow off-center; intentional asymmetry is a sign of custom design.

### Don't
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#1a1c1d).
- **Don't** use standard 4px border radii. Use the `md` (0.75rem) or `lg` (1rem) tokens to maintain a modern, "soft-brutalist" look.
- **Don't** add shadows to buttons. Reserve shadows exclusively for floating overlays and modals to maintain a "flat-stack" hierarchy.

## Remark
The design system is extracted from https://www.craft.do/.
