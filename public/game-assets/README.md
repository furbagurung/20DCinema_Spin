# 20D Cinema Spin Game Assets

The live Next.js game uses the optimized composite assets:

- `game-frame.webp` — fixed Dashain/Tihar artwork, logo, wheel rim, pointer, hub, pedestal and panel.
- `wheel-inner.webp` — rotating prize-wheel artwork.

The original source artwork is in the supplied `20d-spin-game` ZIP if further visual editing is needed.

The prize result is still selected server-side through `/api/spin`; the client only animates the wheel to the returned prize slot.
