# AGENT PROMPT: 1:1 REPLICATION OF 3D IDENTITY CARD PHYSICS & CYBERNETIC TEXTURE IN FLUTTER

> **Directive & Persona:** You are a Senior Graphics Engineer & Flutter Interaction Designer. Your task is to perform an exact 1:1 migration and recreation of the **Interactive 3D Identity Hero Card, Dynamic Tilt Physics, Specular Glare, and Cybernetic Pixel Texture System** from the web application into Flutter.

---

## 1. MANDATORY SKILL FILE (READ FIRST)
Before implementing, you **MUST** read and adhere to the skill documentation:
* **Path:** `.agents/skills/flutter-identity-card-physics/SKILL.md`

---

## 2. WEB SOURCE TRACE & VISUAL ANATOMY (OBSERVE FIRST)

Read the following web files to observe the exact math, multi-layered depth, and surface textures:
1. **Master 3D Card Component:**
   * **Path:** `src/components/atoms/QueueCardMaster.tsx`
     * Lines 10–106: Card Back Cover (`QueueCardCover`) with watermark mask and large embossed queue number `#01`.
     * Lines 143–234: 850ms Initial 3D Flip & Spin reveal (`spinAngle: 180° -> 0°`) with apex celebration confetti trigger at $progress \ge 0.45$.
     * Lines 237–267: Interactive 3D Pointer Physics ($X/Y$ tilt with $2.6\times$ damping, floating lift translation $tx = \text{centerX}/6, ty = -10 + \text{centerY}/6$, and scale 1.07).
     * Lines 269–302: 20-frame cubic spring decay ($ease = 1 - (1 - progress)^3$) settling on pointer release.
     * Lines 344–502: 5-level multi-layered parallax depth stack (`translateZ(1px)` to `translateZ(28px)`).
2. **Organic Cybernetic Pixel Texture:**
   * **Path:** `src/components/atoms/PixelTexture.tsx`
     * Lines 138–141: `seededHash` pseudo-random distribution algorithm.
     * Lines 144–216: $24 \times 20$ cell matrix with organic cell dropout threshold (0.35), micro-size jitter (75% to 115%), and 4-tier color palette mixing.
     * Lines 228–257: Feathered multi-stop radial corner dissolve mask.
3. **Card Container & Reveal Mount Point:**
   * **Path:** `src/components/molecules/QueueActivationOverlay.tsx` (Lines 108 to 125)

---

## 3. FLUTTER NATIVE REQUIREMENTS
* **3D Perspective Transformation (`Transform` Matrix):**
  * Apply `setEntry(3, 2, 0.001)` to create a realistic 900px focal perspective.
  * Combine rotational tilt `rotateX(rx * pi / 180)` and `rotateY((spinAngle + ry) * pi / 180)` with floating translation `translate(tx, ty)`.
* **Cybernetic Pixel Matrix CustomPainter:**
  * Implement `PixelTexturePainter` using the deterministic `_seededHash` algorithm so that every render produces a seamless organic scatter pattern with zero visual repetition.
  * Apply a radial gradient layer mask to gently dissolve the pixels toward the bottom-left corner.
* **Dynamic Specular Glare (`BlendMode.overlay`):**
  * Track pointer $(percentX, percentY)$ to render a high-gloss radial glare highlight that moves across the card face in real time.
* **850ms Flip Reveal & Confetti Apex Hook:**
  * Coordinate the opening sequence: card starts on backface (180°), flips with cubic ease-out, fires `onRevealApex` at $t = 0.45$, and settles smoothly.
