// Refreshes src/data/countries.json from the REST Countries v5 API.
// Usage: node scripts/fetch-countries.js --key=YOUR_API_KEY
//    or: RESTCOUNTRIES_API_KEY=YOUR_API_KEY node scripts/fetch-countries.js
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'countries.json');

const keyArg = process.argv.find((arg) => arg.startsWith('--key='));
const API_KEY = keyArg ? keyArg.slice('--key='.length) : process.env.RESTCOUNTRIES_API_KEY;

if (!API_KEY) {
  console.error('Missing API key. Pass --key=YOUR_API_KEY or set RESTCOUNTRIES_API_KEY.');
  process.exit(1);
}

const FIELDS = [
  'names.common', 'names.official', 'names.native',
  'flag.url_png', 'flag.url_svg', 'flag.emoji',
  'flag.colors.dominant', 'flag.colors.prominent', 'flag.colors.swatches',
  'capitals', 'region', 'subregion', 'area.kilometers',
  'currencies', 'population', 'languages', 'timezones',
  'links.google_maps', 'links.open_street_maps',
].join(',');

const PAGE_SIZE = 100;

async function fetchPage(offset) {
  const url = `https://api.restcountries.com/countries/v5?limit=${PAGE_SIZE}&offset=${offset}&response_fields=${encodeURIComponent(FIELDS)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
  if (!res.ok) {
    throw new Error(`REST Countries request failed (offset=${offset}): ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function adapt(c) {
  const nativeName = c.names.native
    ? Object.fromEntries(Object.entries(c.names.native).map(([k, v]) => [k, { common: v.common, official: v.official }]))
    : undefined;

  const currencies = Object.fromEntries(
    (c.currencies || []).map((cur) => [cur.code, { name: cur.name, symbol: cur.symbol }])
  );

  const languages = Object.fromEntries(
    (c.languages || []).map((l) => [l.iso639_1 || l.bcp47 || l.iso639_3, l.name])
  );

  const swatches = c.flag?.colors?.swatches || {};

  return {
    name: {
      common: c.names.common,
      official: c.names.official,
      ...(nativeName ? { nativeName } : {}),
    },
    flags: { png: c.flag?.url_png || '', svg: c.flag?.url_svg || '' },
    flag: c.flag?.emoji || '',
    flagColors: {
      dominant: c.flag?.colors?.dominant || null,
      prominent: c.flag?.colors?.prominent || null,
      vibrant: swatches.vibrant || null,
      muted: swatches.muted || null,
      darkVibrant: swatches.dark_vibrant || null,
      darkMuted: swatches.dark_muted || null,
      lightVibrant: swatches.light_vibrant || null,
      lightMuted: swatches.light_muted || null,
    },
    capital: (c.capitals || []).map((cap) => cap.name).filter(Boolean),
    region: c.region || '',
    subregion: c.subregion || '',
    currencies,
    population: c.population ?? 0,
    area: c.area?.kilometers ?? 0,
    languages,
    timezones: c.timezones || [],
    maps: {
      googleMaps: c.links?.google_maps || '',
      openStreetMaps: c.links?.open_street_maps || '',
    },
  };
}

async function main() {
  const offsets = [0, 100, 200];
  const pages = await Promise.all(offsets.map(fetchPage));
  const all = pages.flatMap((p) => p.data.objects);

  const transformed = all
    .map(adapt)
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  await writeFile(OUT_PATH, JSON.stringify(transformed));
  console.log(`Wrote ${transformed.length} countries to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
