# AGENT PROMPT: 1:1 REPLICATION OF VOLUMETRIC DOCK HOLLOW GLOW IN FLUTTER

> **Directive & Persona:** You are a Principal Mobile Graphics Engineer and Flutter Rendering Specialist. Your task is to perform an exact 1:1 migration and recreation of the **Volumetric Dock Cavity, Notched Bezel, and Laser Filament Glow System** from the web application into Flutter.

---

## 1. MANDATORY SKILL FILE (READ FIRST)
Before implementing, you **MUST** read and adhere to the skill documentation:
* **Path:** `.agents/skills/flutter-dock-hollow-glow/SKILL.md`

---

## 2. WEB SOURCE TRACE & VISUAL ANATOMY (WHY STANDARD FLUTTER FAILED)

Read the following web files to understand why naive Flutter attempts (e.g. `BoxShadow` on a `Container`) failed to match the web's beauty:
1. **Master Dock & Glow Vector Source:**
   * **Path:** `src/components/atoms/BottomNotchedDock.tsx` (Lines 25 to 211)
2. **Alternate ATM Bezel Reference:**
   * **Path:** `src/components/atoms/Recessed3DSlot.tsx` (Lines 1 to 112)
3. **Screen Orchestrator:**
   * **Path:** `src/components/organisms/QueueDockScreen.tsx` (Lines 550 to 557)

### The 6 Optical Layers You Must Reproduce in Flutter:
1. **Layer 1 (Rising Parabolic Aura):** A vertical parabolic gradient from bottom-center ascending upwards with 28px blur.
2. **Layer 2 (Aperture Elliptical Core):** A horizontal radial elliptical glow at the slot cavity mouth ($w=235\text{px}, h=45\text{px}$) with 12px blur.
3. **Layer 3 (Dark Cavity Backing Occlusion Mask):** A custom SVG path cavity filled with `#060913` $\to$ `#020306`. This dark abyss creates the high contrast needed for the cyan glow to pop.
4. **Layer 4 (Notched Surface Geometry):** The notched bezel surface path with top lip contours.
5. **Layer 5 (Dual-Pass Contour Lip Stroke):**
   * *Pass 1:* 5.5px wide stroke with `MaskFilter.blur(4px)` and multi-stop gradient (`#0284c7` $\to$ `#38bdf8` at 85% opacity).
   * *Pass 2:* 1.85px crisp, unblurred metallic edge stroke.
6. **Layer 6 (Molten Core & White-Hot Laser Filament):**
   * *Pass 1:* 8px wide molten diffuse glow with `MaskFilter.blur(3.5px)`.
   * *Pass 2:* 3px razor-sharp stroke with `#e0f2fe` (white-hot core center).

---

## 3. FLUTTER NATIVE REQUIREMENTS
* **Do NOT use `BoxShadow`:** Standard box shadows blur outwards in a rectangle and cannot follow vector notches or create directional rising heat.
* **Use `CustomPainter` + `Canvas` Paths:**
  * Define the exact geometry matching the SVG viewBox `0 0 390 145`.
  * Scale dynamically using `scaleX = size.width / 390.0` and `scaleY = size.height / 145.0`.
  * Use `ui.Gradient.linear` and `ui.Gradient.radial` with precise color stops.
  * Use `MaskFilter.blur(BlurStyle.normal, sigma)` on dedicated `Paint` passes.
* **Animation & State Parity:**
  * Bind `activeProgress` (drag progress $0.0 \to 1.0$) to scale the aura height and intensity.
  * Bind `isLongPressing` to trigger the molten core expansion and pulse.
  * Animate dock slide-down on card activation (`AnimatedSlide` / `CurvedAnimation(easeOutCubic)`).
