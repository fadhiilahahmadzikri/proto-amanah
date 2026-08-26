# Prompt: 1:1 Flutter Implementation of Liquid Glass Card via Custom GLSL Variable Blur Fragment Shader

---

## Instructions for the AI / Senior Graphics Engineer

You are acting as an elite Flutter & GPU Graphics Engineer specialized in GLSL fragment shaders, the Flutter Impeller/Skia rendering pipeline, and iOS-grade variable blur effects (comparable to Apple's Metal `CAFilter.variableBlur`).

Your task is to produce a production-ready, zero-artifact, 1:1 fidelity Flutter implementation of the real estate card defined in the reference component (`glass-mask.jsx`), using a **custom GPU Fragment Shader (`.frag`)** for real-time progressive liquid blur and saturation boost.

---

### Context & Problem Statement

In standard Flutter, combining `BackdropFilter` with `ShaderMask` causes severe compositing defects:
1. **Harsh/Crisp Boundaries:** Standard `BackdropFilter` snapshots the entire frame buffer into a uniform bounding box, creating hard rectangular cutoffs.
2. **Milky / Dark Gray Halos:** Applying an alpha mask (`dstIn`) to a `BackdropFilter` fades the whole layer to transparent rather than interpolating blur radius down to crispness, resulting in desaturated, murky gray artifacts.
3. **No Native Variable Blur Radius:** Flutter lacks a built-in parameter to vary `sigmaX/sigmaY` smoothly per-pixel across the Y-axis.

**Solution Requirement:**
Build a custom GLSL 460 fragment shader (`shaders/variable_blur.frag`) integrated into Flutter 3.7+ using `FragmentProgram` / `flutter_shaders`. The shader must sample the background texture, calculate a Gaussian/Poisson blur kernel with radius dynamically scaled by vertical coordinate ($uv.y$), and apply a $1.6\times$ (160%) saturation boost in a single GPU pass.

---

## Detailed Specifications

### 1. GLSL Fragment Shader (`shaders/variable_blur.frag`)

Write the complete Flutter-compatible SPIR-V GLSL shader with the following requirements:
- **Language / Standards:** `#version 460 core` with `#include <flutter/runtime_effect.glsl>`.
- **Inputs & Uniforms:**
  - `uniform vec2 uResolution`: Viewport / card dimensions in physical pixels.
  - `uniform sampler2D uTexture`: The captured or rendered source image texture.
  - `uniform float uMaxBlurRadius`: Maximum blur radius at the bottom (e.g., `18.0` - `24.0` pixels).
  - `uniform float uSaturation`: Saturation multiplier (set to `1.6` for 160% vibrance boost).
  - `uniform vec4 uProgressiveStops`: Piecewise transition control across normalized Y-coordinates `(0.0, 0.35, 0.55, 0.75)` matching the reference CSS gradient.
- **Sampling & Blur Algorithm:**
  - Multi-tap 2D Gaussian kernel or Poisson disk sampling (min 16–24 samples) with sample weights normalized to `1.0`.
  - Calculate dynamic blur intensity $b(y)$ using smooth step interpolation:
    - $y \in [0.0, 0.35] \implies b(y) = 1.0$ (100% max blur)
    - $y \in [0.35, 0.55] \implies b(y) \approx 0.95 \to 0.30$
    - $y \in [0.55, 0.75] \implies b(y) \approx 0.30 \to 0.00$
    - $y > 0.75 \implies b(y) = 0.0$ (Zero blur, crisp native sampling).
  - Scale kernel offset vectors by `b(y) * uMaxBlurRadius / uResolution`.
- **Saturation Math (Rec. 709 Luminance):**
  - Compute grayscale luminance: `float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));`
  - Interpolate: `color.rgb = mix(vec3(luma), color.rgb, uSaturation);`
- **Output:** Output standard pre-multiplied or straight RGBA fragment color.

---

### 2. Flutter Engine Integration & State Architecture

Provide the complete Flutter widget tree and rendering pipeline:

1. **`pubspec.yaml` Configuration:**
   - Include shader asset path:
     ```yaml
     flutter:
       shaders:
         - shaders/variable_blur.frag
     ```
   - Optional dependency: `flutter_shaders: ^0.1.1` (or vanilla `dart:ui` `FragmentProgram.fromAsset`).

2. **Shader Lifecycle & Uniform Binding:**
   - Asynchronously load and cache `FragmentProgram` during `initState` / app warmup.
   - Use `ShaderBuilder` / `AnimatedSampler` from `flutter_shaders` (or `CustomPainter` with `Canvas.drawRect` + `Paint.shader`) to automatically feed the child image as a texture sampler to the shader.
   - Pass exact uniform values ensuring correct byte-alignment and float indices.

3. **Layer Composition Stack:**
   - **Layer 1 (Source Image):** High-resolution Unsplash image (`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop`) with `BoxFit.cover`.
   - **Layer 2 (Liquid Glass Shader):** The custom fragment shader processing the image texture with variable blur and saturation.
   - **Layer 3 (Ambient Contrast Gradient):** High-contrast protective dark overlay:
     - `LinearGradient(begin: Alignment.bottomCenter, end: Alignment.topCenter, stops: [0.0, 0.40, 0.70], colors: [Color(0xD10C140F), Color(0x660C140F), Colors.transparent])`.
   - **Layer 4 (Top Badge):**
     - Rounded pill container (`BorderRadius.circular(999)`), background `Colors.white.withOpacity(0.95)`, backdrop blur, amber star icon, text `"Prime Pick"` (`12px`, `FontWeight.w600`, `#111827`).
   - **Layer 5 (Card Content Overlay):**
     - Price: `"List: $250,000"` (`25px`, `FontWeight.w600`, tracking `-0.5`, leading tight).
     - Subtitle & Address: `"Harry Konigsberg's..."` (`13px`, `white70`) and `"1065 AG Guillaume Briard"` (`13.5px`, `FontWeight.w500`).
     - Specs metrics: Living area `"29m²"` with square area icon and Rooms `"2"` with house/door icon, separated by vertical divider line (`white20`, height `28px`).
     - Horizontal hairline divider (`1px`, `white20`).
     - Footer metadata: `"By"` &bull; `"Waleed Sabir"` (underlined) &bull; `"2 days ago"` (`12px`, `white80`).

---

### 3. Non-Functional & Quality Requirements

- **Zero Memory Leaks:** Properly dispose of painters or shader controllers.
- **Impeller & Skia Compatibility:** The GLSL code must compile cleanly on both iOS (Metal via Impeller) and Android (Vulkan / OpenGL).
- **Responsive Geometry:** The shader must dynamically adapt if the card is resized or aspect ratio changes.
- **Pixel-Perfect Alignment:** Margins, paddings, icon scales, divider opacities, and border radii must match the reference React JSX file down to the pixel.

---

### 4. Expected Deliverables

1. `shaders/variable_blur.frag`: The complete, commented GLSL fragment shader source code.
2. `pubspec.yaml` snippet showing shader registration.
3. `lib/liquid_glass_card.dart`: The complete Flutter widget implementation with all sub-widgets, painters, uniform loaders, and design tokens.
4. Step-by-step instructions on how to test and run on iOS Simulator and Android Device.
