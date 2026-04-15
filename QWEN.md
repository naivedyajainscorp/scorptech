## Qwen Added Memories
- WORKPLACE VIZ CONNECTOR LOGIC — NEVER CHANGE THIS APPROACH:

1. **VHV elbow routing, center-to-center**: `buildElbowPath(ox,oy,dx,dy)` = `M ox,oy L ox,midY L dx,midY L dx,dy` where `midY = oy + (dy-oy)/2`. Connect hub center to node center.

2. **Nodes cover endpoints**: Node cards have higher z-index than SVG connectors, so path endpoints are naturally hidden behind cards. NO cardinal-edge math needed.

3. **Measurement**: Use `getBoundingClientRect()` after temporarily making nodes `scale(1)` for measurement, then reset to `scale(0)` for GSAP animation.

4. **GSAP draw-in**: Use `stroke-dasharray` = path length, `stroke-dashoffset` = path length initially, animate offset to 0.

5. **Loop rebuild**: `onRepeat` must call `cleanup()` then `buildDesktop()` and swap `eps` array.

6. **Simple is correct**: No hubExitPt, no nodeEntryPt, no cardinal-side calculations. Center-to-center VHV with node overlays = always works.
