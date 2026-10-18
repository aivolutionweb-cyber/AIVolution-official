# Tee Widget — Standalone Prototype (for approval, not integrated)

Run: `cd prototype/tee && python3 -m http.server 8822` → http://localhost:8822/index.html

## What it is
Bottom-right floating 3D Aivolutions tee. Genuine WebGL garment — original procedural
mesh (extruded oversized silhouette + puff/fold displacement + collar rib), official
artwork composited in-canvas (`front-chest-logo.png` chest mark, `back-art-isolated.png`
full back print). No external models, no new website dependencies (three.js lives only
in `prototype/tee/node_modules`, loaded lazily via dynamic import).

## Verified (headless Chrome + scripted interaction, zero JS errors)
- Front / three-quarter / back views, correct print orientation both sides — `shots/`
- Drag rotates full 360° yaw, pitch clamps ±0.38; flick releases carry inertia with
  exponential damping; idle float + slow drift resume after 4s (off under
  `prefers-reduced-motion` / `?spin=0`)
- "psst… spin me ↻" hint dismisses on first rotate
- Front / Back / ⟲ / Expand controls; expanded viewer reuses the same canvas
  (one GL context) with ¾-view, zoom (wheel/pinch), spec sheet, ✕/Esc close
- ⋮⋮ grip repositions within safe viewport bounds, independent of rotation
- Light/dark chrome adaptation proven on chalk section (`light-adapt.png`)
- Mobile 148px compact widget, icon-only Expand (`mobile.png`); touch + keyboard
  (arrows/F/B/R/E/Esc); static front/back fallback if WebGL fails
- Production website untouched — everything lives under `prototype/tee/`

## Integration path (after approval)
Port `tee-scene.js` + interaction shell into a lazy React component
(`React.lazy`, `Suspense` fallback = static art), three.js added to package.json then;
R3F/Drei unnecessary — the widget owns one canvas and zero shared state, plain
three.js is lighter and already proven here.
