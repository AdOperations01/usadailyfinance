# Auto Insurance Pre-Lander

Files:
- index.html — page markup
- styles.css — responsive styling
- script.js — ZIP validation + offer redirect
- assets/bg1.jpg / .webp — hero background photo
- assets/bg2.jpg / .webp — final CTA background photo
- assets/favicon.svg — favicon

## Setup
1. Open `script.js`.
2. Replace `YOUR_CLICKFLARE_OR_OFFER_URL` with your actual ClickFlare tracking URL / offer URL.
3. If you use Meta Pixel, add your approved pixel snippet to `index.html` and fire your preferred events in `goToOffer()`.
4. Upload the whole folder to your hosting.

## Tracking
The script stores the ZIP in sessionStorage under `auto_rate_zip` and appends `?zip=XXXXX` (or `&zip=XXXXX`) to the destination URL.

For production, use your actual ClickFlare macros/subid structure rather than hard-coding a user identifier.
