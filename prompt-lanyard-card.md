# AGENT PROMPT: 1:1 REPLICATION OF 3D GRAVITY LANYARD ID CARD IN FLUTTER

> **Directive & Persona:** You are a Principal Graphics Engineer & Flutter Physics Specialist. Your task is to perform an exact 1:1 migration and recreation of the **3D Interactive Lanyard ID Card with Gravity Physics, Verlet Ribbon Simulation, Bauhaus Matrix Canvas, and Dynamic Fresnel Clearcoat Shading** from the web application into Flutter.

---

## 1. MANDATORY SKILL FILE (READ FIRST)
Before implementing, you **MUST** read and adhere to the skill documentation:
* **Path:** `.agents/skills/flutter-lanyard-card-physics/SKILL.md`

---

## 2. WEB SOURCE TRACE & VISUAL ANATOMY (OBSERVE FIRST)

Read the following web files to observe the exact 3D physics, Rapier joint hierarchy, canvas textures, and interactions:
1. **Master 3D Lanyard & Physics Component:**
   * **Path:** `src/components/atoms/DoctorIdCard3D.tsx`
     * Lines 50–165: Procedural Bauhaus geometric grid matrix with 6 algorithmic shapes.
     * Lines 166–213: Deterministic 1D barcode generator (`drawLinearBarcode`).
     * Lines 215–374: Dual-sided 4K procedural canvas texture (`createDoctorCardCanvasTexture`).
     * Lines 376–428: Lanyard fabric texture with stitched edges and hospital typography.
     * Lines 513–517: 4-node rope chain joints (`useRopeJoint`, `useSphericalJoint`, gravity: `[0, -40, 0]`).
     * Lines 530–595: Physics frame loop (Catmull-Rom spline rope curve, angular restitution $\tau_y = -\theta_y \times 0.25$, and Fresnel clearcoat modulation).
     * Lines 643–665: Interactive drag, unprojection, and tap-to-spin impulse gestures.
2. **Screen Shell & Container:**
   * **Path:** `src/components/organisms/DoctorIdCardScreen.tsx` (Lines 163 to 227)

---

## 3. FLUTTER NATIVE REQUIREMENTS
* **Verlet Integration Physics Loop:**
  * Implement a 4-node Verlet/Spring chain (`VerletNode`) driven by Flutter `Ticker` at 60/120 FPS.
  * Integrate gravity ($1800\,\text{px/s}^2$), drag tracking, constraint relaxation, and damping ($0.94$).
* **3D Perspective & Angular Dynamics:**
  * Transform badge with `Matrix4.identity()..setEntry(3, 2, 0.001)..rotateX(rx)..rotateY(ry)`.
  * Support tap-to-spin impulse ($\omega_y = \pm 12\,\text{rad/s}$) when tapping the card margins.
* **Dynamic Fresnel Specular Sheen:**
  * Calculate card normal vector $|\vec{n}_z| = |\cos(\theta_y)|$ to dynamically modulate glossy clearcoat opacity between $0.04$ (flat) and $0.92$ (acute tilt).
* **Double-Sided Identity Badge:**
  * Front: Bauhaus geometric canvas grid, cutout doctor avatar, and clinical license plate.
  * Back: Theme grid, 1D Barcode with number `*DOC-50344212026*`, and verification seal.
