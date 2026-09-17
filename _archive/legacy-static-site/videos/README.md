# Hero video

Drop your background video here as **`hero.mp4`** and it will autoplay, muted and looped, behind the homepage hero text — that's the only file `index.html` looks for (`<source src="videos/hero.mp4">`).

Until it's added, the hero shows a static poster image instead (currently the `storefront` placeholder), so nothing looks broken in the meantime.

Tips for a clean result:
- Keep it short (8–20 seconds) and loop-friendly — no hard cuts at the start/end.
- Landscape, at least 1920×1080. It gets cropped to fill the hero with `object-fit: cover`.
- No audio needed — it plays muted (required for autoplay in every browser).
- Keep the file under ~15MB if you can (compress with HandBrake or similar) so it loads fast on mobile data.
- The site applies a grayscale/dark filter over it to match the black-and-white look, so color or black-and-white footage both work.
