// Pulls the latest Instagram reels into the repo so the site stays static.
// Thumbnails are downloaded because Instagram CDN URLs are signed and expire.
// Without a token (local builds, forks) it exits cleanly and keeps the committed data.
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const LIMIT = 3;
const DATA_FILE = 'src/data/instagram-reels.json';
const THUMB_DIR = 'public/instagram';
const token = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!token) {
  console.log('[instagram] INSTAGRAM_ACCESS_TOKEN not set; keeping committed reels.');
  process.exit(0);
}

const fields = 'id,media_product_type,permalink,caption,timestamp,thumbnail_url';
const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=25&access_token=${encodeURIComponent(token)}`;
const response = await fetch(url);
const body = await response.json();
if (!response.ok) {
  // Fail loudly in CI so an expired token is noticed instead of silently freezing the feed.
  console.error(`[instagram] API error ${response.status}: ${body?.error?.message ?? 'unknown'}`);
  process.exit(1);
}

const latest = body.data
  .filter((media) => media.media_product_type === 'REELS' && media.thumbnail_url)
  .slice(0, LIMIT);

const reels = latest.map((media) => ({
  id: media.id,
  permalink: media.permalink,
  caption: (media.caption ?? '').trim(),
  timestamp: media.timestamp,
  thumbnail: `/instagram/${media.id}.jpg`,
}));

const current = await readFile(DATA_FILE, 'utf8').catch(() => '');
const next = `${JSON.stringify({ reels }, null, 2)}\n`;
if (current === next) {
  console.log('[instagram] Reels unchanged.');
  process.exit(0);
}

await mkdir(THUMB_DIR, { recursive: true });
for (const media of latest) {
  const image = await fetch(media.thumbnail_url);
  if (!image.ok) throw new Error(`[instagram] Thumbnail ${media.id} failed with ${image.status}`);
  await writeFile(join(THUMB_DIR, `${media.id}.jpg`), Buffer.from(await image.arrayBuffer()));
}

const keep = new Set(reels.map((reel) => `${reel.id}.jpg`));
for (const file of await readdir(THUMB_DIR)) {
  if (!keep.has(file)) await rm(join(THUMB_DIR, file));
}

await writeFile(DATA_FILE, next);
console.log(`[instagram] Synced ${reels.length} reels.`);
