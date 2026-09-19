/**
 * Photo discovery, so adding pictures never means editing code.
 *
 *   images/team/<name>.jpg         → that barber's portrait, matched by name
 *                                    ("Abdullah" → images/team/abdullah.jpg)
 *   images/gallery/<group>/<x>.jpg → a gallery photo, filed under that group
 *                                    ("the-chairs" → "The Chairs")
 *   images/gallery/<x>.jpg         → a gallery photo under "More"
 *
 * Alt text is taken from `photoCaptions` in site.config.json when it's there,
 * and otherwise made from the file name, so a dropped-in photo is never
 * unlabelled for a screen reader.
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

export const slug = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const humanize = (file) =>
  path
    .basename(file, path.extname(file))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const listImages = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => IMAGE.test(f)).sort() : [];

/** name → web path, for every portrait sitting in images/team/. */
export function teamPhotos(root) {
  const dir = path.join(root, 'images', 'team');
  const found = new Map();
  for (const file of listImages(dir)) {
    found.set(slug(path.basename(file, path.extname(file))), `images/team/${file}`);
  }
  return found;
}

/** Everything under images/gallery/, grouped by the folder it sits in. */
export function galleryPhotos(root, captions = {}) {
  const base = path.join(root, 'images', 'gallery');
  if (!existsSync(base)) return [];

  const photos = [];
  const add = (relative, group) => {
    const key = relative.replace(/\\/g, '/');
    photos.push({
      file: `gallery/${key}`,
      alt: captions[key] ?? `${humanize(key)} at Escape Barbershop`,
      group,
    });
  };

  for (const entry of readdirSync(base).sort()) {
    const full = path.join(base, entry);
    if (statSync(full).isDirectory()) {
      const group = humanize(entry);
      for (const file of listImages(full)) add(`${entry}/${file}`, group);
    } else if (IMAGE.test(entry)) {
      add(entry, 'More');
    }
  }
  return photos;
}
