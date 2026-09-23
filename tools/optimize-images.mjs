/**
 * Makes a WebP copy of every photo in images/, which the build then serves
 * ahead of the JPEG. Typically halves the bytes with no visible difference.
 *
 *   npm run images      (needs ffmpeg — `npm i -D ffmpeg-static` is enough)
 *
 * Safe to re-run: a photo is only re-encoded when its WebP copy is missing or
 * older than the original, so adding one picture doesn't redo the rest.
 */

import { readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/** ffmpeg-static if it's installed, otherwise whatever is on PATH. */
function ffmpegPath() {
  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
}

const SOURCE = /\.(jpe?g|png)$/i;

async function* photos(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* photos(full);
    else if (SOURCE.test(entry.name)) yield full;
  }
}

const ffmpeg = ffmpegPath();
let made = 0;
let skipped = 0;
let before = 0;
let after = 0;

for await (const file of photos(path.join(root, 'images'))) {
  const webp = file.replace(SOURCE, '.webp');
  const source = await stat(file);
  before += source.size;

  if (existsSync(webp) && (await stat(webp)).mtimeMs >= source.mtimeMs) {
    after += (await stat(webp)).size;
    skipped += 1;
    continue;
  }

  await mkdir(path.dirname(webp), { recursive: true });
  await run(ffmpeg, ['-y', '-v', 'error', '-i', file, '-quality', '82', '-compression_level', '6', webp]);
  after += (await stat(webp)).size;
  made += 1;
  console.log(`  ${path.relative(root, webp)}`);
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
console.log(
  `\n${made} encoded, ${skipped} already current — ${mb(before)} of JPEG/PNG becomes ${mb(after)} of WebP.`
);
