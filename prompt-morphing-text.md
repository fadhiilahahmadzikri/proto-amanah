# AGENT PROMPT: 1:1 REPLICATION OF DRAG-TO-ACTIVATE MORPHING TEXT IN FLUTTER

> **Directive & Persona:** You are a Senior Flutter UI & Typography Specialist. Your task is to perform an exact 1:1 migration and recreation of the **Drag-to-Activate Blurry Morphing Text & Header Transformation System** from the web application into Flutter.

---

## 1. MANDATORY SKILL FILE (READ FIRST)
Before implementing, you **MUST** read and adhere to the skill documentation:
* **Path:** `.agents/skills/flutter-morphing-text-dock/SKILL.md`

---

## 2. WEB SOURCE TRACE & BEHAVIOR (OBSERVE FIRST)

Read the following web files to understand the exact state machine and animations:
1. **Master Screen & GSAP Text Blur Source:**
   * **Path:** `src/components/organisms/QueueDockScreen.tsx`
     * Lines 136–144: Dynamic headline state machine (`isNearSlot = dragProgress >= 0.75`).
     * Lines 146–156: Monospaced 320ms typewriter dot loop for `"Memproses antrean..."`.
     * Lines 158–190: Dual-phase GSAP blur text morphing (`blur(8px)` + scale + opacity).
     * Lines 483–534: Top-to-center glide with `cubic-bezier(0.22, 1, 0.36, 1)`.
2. **3D Paramedic Toolbox Lid Open Transition:**
   * **Path:** `src/components/atoms/ParamedicToolbox3DSvg.tsx` (Lines 88 to 238)
3. **Bottom Dock Instructions Prompt Glow:**
   * **Path:** `src/components/atoms/BottomNotchedDock.tsx` (Lines 185 to 203)

---

## 3. FLUTTER NATIVE REQUIREMENTS
* **Blurry Morph Text Widget (`BlurryMorphText`):**
  * Implement using `ImageFiltered(imageFilter: ImageFilter.blur(sigmaX, sigmaY))` and `Opacity` + `Transform.scale`.
  * Phase 1 (Exit - 180ms): Fade opacity $1.0 \to 0.0$, scale $1.0 \to 0.94$, blur $0 \to 8.0\text{px}$ (`Curves.easeIn`).
  * Phase 2 (Enter - 320ms): Swap text, fade opacity $0.0 \to 1.0$, scale $1.06 \to 1.0$, blur $8.0\text{px} \to 0.0\text{px}$ (`Curves.easeOut`).
* **Zero Layout Shift Typewriter Dots:**
  * When in processing state, render a 2-line title where the dot ticker is wrapped in a fixed-width `SizedBox(width: 24)` with `monospace` font so the headline text does not twitch or shift horizontally.
* **Spatial Morphing:**
  * Animate the header block from `Alignment.topCenter` down to `Alignment.center` with `Cubic(0.22, 1.0, 0.36, 1.0)` over 700ms.
  * Concurrently animate the 3D Toolbox scale ($1.0 \to 1.1$) and open state.
