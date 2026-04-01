import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/airbnb/properties');
const LISTINGS_FILE = path.resolve('scripts/airbnb_listings.txt');

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

function decodeHtml(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#x2F;', '/')
    .replaceAll('&#39;', "'");
}

function slugify(value) {
  return decodeHtml(value)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, ' ')
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractMeta(html, property) {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`, 'i'));
  return match ? decodeHtml(match[1]) : '';
}

function parseLocation(title) {
  const match = title.match(/ in ([^·]+)/i);
  return match ? match[1].trim() : '';
}

function buildBetterSlug(id, title, description, fallbackSlug) {
  const location = slugify(parseLocation(title));
  const desc = slugify(description)
    .replace(/\b(rental-unit|home|townhouse|apartment)\b/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const pieces = [location, desc].filter(Boolean);
  const candidate = pieces.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return candidate || fallbackSlug || id;
}

async function fetchWithRetry(url, maxAttempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          'accept-language': 'en-GB,en;q=0.9',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          pragma: 'no-cache',
          'cache-control': 'no-cache',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      clearTimeout(timeout);
      return response.text();
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < maxAttempts) {
        console.warn(`Retry ${attempt}/${maxAttempts - 1} for ${url}`);
      }
    }
  }

  throw lastError;
}

async function main() {
  const rawListings = await readFile(LISTINGS_FILE, 'utf8');
  const lines = rawListings
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  const listings = lines.map((line) => {
    const [id, slug, url] = line.split('|');
    return { id, slug, url };
  });

  const indexPath = path.join(ROOT, 'index.json');
  const failuresPath = path.join(ROOT, 'failures.json');

  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  const failures = JSON.parse(await readFile(failuresPath, 'utf8'));

  const successById = new Map(index.map((entry) => [entry.id, entry]));
  const failureById = new Map(failures.map((entry) => [entry.id, entry]));
  const updatedIndex = [];
  const updatedFailures = [];
  const renameLog = [];

  await mkdir(ROOT, { recursive: true });

  for (const listing of listings) {
    console.log(`Naming ${listing.id}...`);
    const html = await fetchWithRetry(listing.url);
    const title = extractMeta(html, 'og:title');
    const description = extractMeta(html, 'og:description');
    const betterSlug = buildBetterSlug(listing.id, title, description, listing.slug);

    const oldFolder =
      successById.get(listing.id)?.folder ||
      path.join('public/airbnb/properties', `${listing.id}-${listing.slug}`);
    const newFolder = path.join('public/airbnb/properties', `${listing.id}-${betterSlug}`);

    if (oldFolder !== newFolder) {
      await rename(path.resolve(oldFolder), path.resolve(newFolder));
    }

    const metadataPath = path.resolve(newFolder, 'metadata.json');
    try {
      const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
      metadata.slug = betterSlug;
      metadata.title = title;
      metadata.description = description;
      metadata.folder = newFolder;
      await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
    } catch {
      // Failed-listing folders may not have metadata yet.
    }

    if (successById.has(listing.id)) {
      const entry = successById.get(listing.id);
      updatedIndex.push({
        ...entry,
        slug: betterSlug,
        folder: newFolder,
        title,
        description,
      });
    }

    if (failureById.has(listing.id)) {
      const entry = failureById.get(listing.id);
      updatedFailures.push({
        ...entry,
        slug: betterSlug,
        title,
        description,
        folder: newFolder,
      });
    }

    renameLog.push({
      id: listing.id,
      oldFolder,
      newFolder,
      title,
      description,
    });
  }

  await writeFile(indexPath, `${JSON.stringify(updatedIndex, null, 2)}\n`, 'utf8');
  await writeFile(failuresPath, `${JSON.stringify(updatedFailures, null, 2)}\n`, 'utf8');
  await writeFile(path.join(ROOT, 'rename-log.json'), `${JSON.stringify(renameLog, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
