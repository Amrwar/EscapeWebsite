# Gallery photos

Drop photos into a folder named after the section they belong in:

    images/gallery/the-chairs/mirror-row.jpg   → shows under "The Chairs"
    images/gallery/fades/skin-fade-01.jpg      → shows under "Fades"
    images/gallery/anything.jpg                → shows under "More"

Run `npm run build`. New photos appear first in the gallery and feed the three
tiles on the home page. The folder name becomes the filter button, and the file
name becomes the alt text ("skin-fade-01.jpg" → "Skin Fade 01 at Escape
Barbershop") — to write that yourself, add an entry to `photoCaptions` in
site.config.json:

    "photoCaptions": { "fades/skin-fade-01.jpg": "A tight skin fade, finished with a razor" }

Landscape shots around 1600px wide work best. Everything is shown in black and
white, so mixed lighting between photos matters less than you'd think.
