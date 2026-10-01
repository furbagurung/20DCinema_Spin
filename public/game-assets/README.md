# 20D Cinema Spin Game Assets

Copy the `assets/` folder from the supplied `20d-spin-game` source ZIP into this directory and keep these filenames:

- background.webp
- festival-banner.webp
- 20d-logo.webp
- wheel.webp
- hub.webp
- pointer.webp
- pedestal.webp
- spin-button.webp

The client spin UI references these files from `/game-assets/`.

The game result is still selected server-side through `/api/spin`; the client only animates the wheel to the returned prize slot.
