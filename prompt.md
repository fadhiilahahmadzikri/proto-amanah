# TASK SPECIFICATION & AGENT PROMPT: 1:1 WEB-TO-FLUTTER GENIE EFFECT MIGRATION

> **Role & Directive:** You are a Senior Graphics Engineer & Flutter Systems Architect. Your mission is to execute an uncompromising, pixel-perfect, 1:1 migration of the macOS-style **Genie Suction & Emergence Animation System** from the existing Web (Next.js/React/Canvas2D) codebase into a native, high-performance **Flutter** implementation.

---

## 1. MANDATORY SKILL & REFERENCE REPOSITORY

Before writing a single line of Flutter code or making architectural assumptions, you **MUST** read and apply the dedicated skill file located at:
* **Path:** `.agents/skills/flutter-genie-effect/SKILL.md`

This skill provides the mathematical foundation, easing functions, and native Flutter implementation options (GPU Fragment Shader vs. CPU Canvas Raster Slicing).

---

## 2. SYSTEMATIC STEP-BY-STEP WEB CODEBASE TRACE (READ BEFORE IMPLEMENTING)

You must read each of the following files in their entirety (lines 1 to EOF) to grasp the exact timing, math, coordinates, visual layers, and lifecycle choreography:

1. **Core Mathematical & Raster Engine:**
   * **Path:** `src/lib/genie-renderer.ts`
   * **Focus Areas:**
     * `renderGenieFrame(...)`: Notice how horizontal rows ($y = 0 \dots \text{windowHeight}$) are sliced into 1px strips with staggered delays based on proximity ($prox$).
     * Non-linear easing functions: `eioC` (Cubic In-Out for horizontal pinch/width) and `eIn2` / `eOut2` (Quadratic In/Out for vertical suction and dock flare glow).
     * `runGenieAnimation(...)`: Understand the snapshot offscreen canvas capture via `toCanvas`, DOM hiding handoff, fullscreen overlay lifecycle, and promise resolution.

2. **Master Orchestrator & Screen Lifecycle:**
   * **Path:** `src/components/organisms/QueueDockScreen.tsx`
   * **Focus Areas:**
     * Lines 192–232: The **Emergence Sequence** (`open` direction) triggered after queue processing.
     * Lines 298–362: The **Suction Sequence** (`minimize` direction) triggered when closing the overlay.
     * Coordinate calculation (`getTargetRect`): How the focal point (dock mouth / slot) is calculated dynamically from the viewport.
     * Handoff state: `isGenieSettled` synchronization with GSAP 3D card flips.

3. **Overlay & Card Mount Container:**
   * **Path:** `src/components/molecules/QueueActivationOverlay.tsx`
   * **Focus Areas:**
     * `props.cardRef`: How the container holding the hero card maintains `opacity: 0` while the genie canvas animates, and snaps to `opacity: 1` once settled.
     * `handleCollectClick`: The graceful 3D rotation and retreat timeline.

4. **Deformed Visual Target (Hero Card):**
   * **Path:** `src/components/atoms/QueueCardMaster.tsx`
   * **Focus Areas:**
     * The multi-layered composition: Watermark logo (`/assets/images/wm.svg`), doctor avatar image with bottom linear fade mask, cybernetic pixel texture (`PixelTexture`), queue badge number, and specular glare sheen.
     * The 3D flip rotation mechanics from card cover backface (180°) to frontface (0°).

5. **Dock Slot & Mouth Target:**
   * **Path:** `src/components/atoms/BottomNotchedDock.tsx`
   * **Focus Areas:**
     * The physical geometry of the bottom notched slot cavity where the suction vector converges.

---

## 3. ARCHITECTURAL REQUIREMENTS FOR FLUTTER NATIVE

Your Flutter implementation must achieve exact visual and behavioral parity:

### A. Snapshot Capture Architecture
* Wrap the target Card Widget with a `RepaintBoundary` keyed by `GlobalKey`.
* Extract `ui.Image` asynchronously using `RenderRepaintBoundary.toImage(pixelRatio: min(window.devicePixelRatio, 2.0))`.
* Temporarily hide the live widget tree via `Opacity(opacity: 0.0)` or `Visibility(maintainSize: true)`.

### B. Global Coordinate & Anchor Measurement
* Use `RenderBox.localToGlobal(Offset.zero)` to calculate exact `Rect` of the Card and `Offset` of the Dock Slot.
* Support arbitrary screen dimensions, notches, and safe areas dynamically without hardcoded magic numbers.

### C. Rendering Approaches (Choose or Provide Both)
1. **Approach 1: Hardware-Accelerated Fragment Shader (GLSL) [Recommended for 120 FPS]:**
   * Load `shaders/genie_effect.frag` via `FragmentProgram.fromAsset`.
   * Pass uniforms: `uResolution`, `uDockPoint`, `uWindowPos`, `uWindowSize`, `uProgress`, `uDirection`, and the sampler `uTexture`.
   * Perform UV warping on the GPU for zero CPU overhead.
2. **Approach 2: Pure Canvas Raster Slicing (`CustomPainter`):**
   * Implement `GenieCanvasPainter` using `canvas.drawImageRect`.
   * Loop through horizontal slices ($y = 0 \dots \text{height}$) and apply the exact cubic/quadratic interpolation formulas from `src/lib/genie-renderer.ts`.

### D. Complete Lifecycle Choreography
1. **Stage 1 (Pre-Animation):** Capture card snapshot & measure geometry.
2. **Stage 2 (Genie Flight - 600ms):**
   * Animate $t: 0.0 \to 1.0$ via `AnimationController(duration: Duration(milliseconds: 600))`.
   * Animate radial glow burst at the dock mouth during $t > 0.70$.
3. **Stage 3 (Handoff & 3D Flip Reveal):**
   * Hide genie canvas, reveal live Flutter widget.
   * Immediately initiate 3D Y-Axis Flip (`Transform` matrix with `setEntry(3, 2, 0.001)`) from 180° backface cover to 0° frontface.
   * Trigger apex haptic feedback (`HapticFeedback.mediumImpact()`) at midpoint ($t = 0.45$).

---

## 4. CODE QUALITY & RIGOR STANDARDS
* **Type Safety:** 100% strict Dart null-safety, no `dynamic` casts.
* **Resource Management:** Properly `dispose()` all `AnimationController` instances and call `ui.Image.dispose()` on temporary frame snapshots to prevent GPU memory leaks.
* **Zero Frame Drops:** Ensure UI build methods are lightweight and computations occur in shaders or efficient paint routines.
