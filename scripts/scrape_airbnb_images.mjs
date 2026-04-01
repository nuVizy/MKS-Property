import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const INPUT_FILE = path.resolve('scripts/airbnb_listings.txt');
const OUTPUT_ROOT = path.resolve('public/airbnb/properties');
const INDEX_FILE = path.join(OUTPUT_ROOT, 'index.json');

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#x2F;', '/')
    .replaceAll('&#39;', "'");
}

function extFromUrl(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean);
  return ext || '.jpg';
}

function normalizeImageUrl(url = '') {
  return decodeHtml(url).replace(/[),]+$/, '').split('?')[0];
}

function isListingImage(url) {
  return (
    url.startsWith('https://a0.muscache.com/im/pictures/hosting/') &&
    url.includes('/original/') &&
    /\.(jpe?g|png|webp)(\?|$)/i.test(url)
  );
}

function extractImageUrls(html) {
  const matches = html.match(/https:\/\/a0\.muscache\.com\/im\/pictures\/[^"'\\\s<>()]+/g) || [];
  const unique = new Set();

  for (const rawMatch of matches) {
    const normalized = normalizeImageUrl(rawMatch);
    if (isListingImage(normalized)) {
      unique.add(normalized);
    }
  }

  return [...unique];
}

function extractMeta(html, property) {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`, 'i'));
  return match ? decodeHtml(match[1]) : '';
}

function parseListingTitle(title = '') {
  const introMatch = title.match(/^([^·]+?)\s+in\s+([^·]+)/i);
  const bedroomsMatch = title.match(/(\d+)\s+bedrooms?/i);
  const bathroomsMatch = title.match(/(\d+(?:\.\d+)?)\s+bathrooms?/i);
  const bedsMatch = title.match(/(\d+)\s+beds?/i);
  const ratingMatch = title.match(/★(\d+(?:\.\d+)?)/i);

  return {
    propertyType: introMatch?.[1]?.trim() || null,
    location: introMatch?.[2]?.trim() || null,
    bedrooms: bedroomsMatch ? Number(bedroomsMatch[1]) : null,
    bathrooms: bathroomsMatch ? Number(bathroomsMatch[1]) : null,
    beds: bedsMatch ? Number(bedsMatch[1]) : null,
    rating: ratingMatch ? Number(ratingMatch[1]) : null,
  };
}

async function fetchText(url) {
  const response = await fetchWithRetry(url, {
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'en-GB,en;q=0.9',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
    },
    redirect: 'follow',
  });

  return response.text();
}

async function downloadFile(url, outputPath) {
  const response = await fetchWithRetry(url, {
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'en-GB,en;q=0.9',
      accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      referer: 'https://www.airbnb.co.uk/',
    },
    redirect: 'follow',
  });

  const arrayBuffer = await response.arrayBuffer();
  await writeFile(outputPath, Buffer.from(arrayBuffer));
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRetry(url, options, maxAttempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      clearTimeout(timeout);
      return response;
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

async function readJsonFile(filePath, fallbackValue) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallbackValue;
  }
}

function resolveListingSlug(id, folder, fallbackSlug) {
  const basename = path.basename(folder);
  const prefix = `${id}-`;
  return basename.startsWith(prefix) ? basename.slice(prefix.length) : fallbackSlug;
}

async function main() {
  const raw = await readFile(INPUT_FILE, 'utf8');
  const listings = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [id, slug, url] = line.split('|');
      if (!id || !slug || !url) {
        throw new Error(`Invalid listing line: ${line}`);
      }
      return { id, slug, url };
    });

  await mkdir(OUTPUT_ROOT, { recursive: true });
  const existingIndex = await readJsonFile(INDEX_FILE, []);
  const existingById = new Map(existingIndex.map((entry) => [entry.id, entry]));

  const summary = [];
  const failures = [];

  for (const listing of listings) {
    const existingEntry = existingById.get(listing.id);
    const dir = existingEntry?.folder ? path.resolve(existingEntry.folder) : path.join(OUTPUT_ROOT, `${listing.id}-${listing.slug}`);
    const effectiveSlug = resolveListingSlug(listing.id, dir, listing.slug);
    await mkdir(dir, { recursive: true });

    try {
      console.log(`Scraping ${listing.id}...`);
      const html = await fetchText(listing.url);
      const title = extractMeta(html, 'og:title');
      const description = extractMeta(html, 'og:description');
      const coverImageUrl = normalizeImageUrl(extractMeta(html, 'og:image'));
      const parsedDetails = parseListingTitle(title);
      const imageUrls = [...new Set([coverImageUrl, ...extractImageUrls(html)].filter(Boolean))];

      if (imageUrls.length === 0) {
        throw new Error(`No images found for listing ${listing.id}`);
      }

      const downloads = [];
      for (let index = 0; index < imageUrls.length; index += 1) {
        const imageUrl = imageUrls[index];
        const filename = `${String(index + 1).padStart(2, '0')}${extFromUrl(imageUrl)}`;
        const outputPath = path.join(dir, filename);

        if (!(await pathExists(outputPath))) {
          console.log(`  downloading ${listing.id} image ${index + 1}/${imageUrls.length}`);
          await downloadFile(imageUrl, outputPath);
        }

        downloads.push({ filename, url: imageUrl });
      }

      const coverImageFilename =
        downloads.find((download) => download.url === coverImageUrl)?.filename ||
        downloads[0]?.filename ||
        null;

      await writeFile(
        path.join(dir, 'metadata.json'),
        `${JSON.stringify(
          {
            id: listing.id,
            slug: effectiveSlug,
            sourceUrl: listing.url,
            imageCount: downloads.length,
            title,
            description,
            listingName: description || null,
            coverImageFilename,
            ...parsedDetails,
            images: downloads,
          },
          null,
          2,
        )}\n`,
        'utf8',
      );

      summary.push({
        id: listing.id,
        slug: effectiveSlug,
        imageCount: downloads.length,
        folder: path.relative(process.cwd(), dir),
        title,
        description,
        listingName: description || null,
        coverImageFilename,
        ...parsedDetails,
      });
    } catch (error) {
      failures.push({
        id: listing.id,
        slug: effectiveSlug,
        sourceUrl: listing.url,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`Failed listing ${listing.id}:`, error);
    }
  }

  await writeFile(path.join(OUTPUT_ROOT, 'index.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  await writeFile(path.join(OUTPUT_ROOT, 'failures.json'), `${JSON.stringify(failures, null, 2)}\n`, 'utf8');

  console.log(`Finished ${summary.length} listings with ${failures.length} failures.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
