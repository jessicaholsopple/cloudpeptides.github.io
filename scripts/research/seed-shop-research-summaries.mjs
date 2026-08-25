// Seeds scripts/research/data/shop-research-summaries.mjs into
// public.shop_product_research_summaries. Idempotent upsert on the
// product_slug primary key (safe to re-run after editing content).
// Validates coverage against every distinct published product_slug in
// shop_products before writing, and fails loudly (without partial
// writes) if any published slug is missing content or any authored
// slug doesn't match a real product — catches drift between this data
// file and the live catalog automatically.
import { getServiceClient } from './lib/import-helpers.mjs';
import { SHOP_RESEARCH_SUMMARIES } from './data/shop-research-summaries.mjs';

const client = getServiceClient();

const { data: rows, error } = await client
  .from('shop_products')
  .select('product_slug')
  .not('product_slug', 'is', null);
if (error) throw error;

const liveSlugs = new Set(rows.map((r) => r.product_slug));
const authoredSlugs = new Set(Object.keys(SHOP_RESEARCH_SUMMARIES));

const missing = [...liveSlugs].filter((s) => !authoredSlugs.has(s)).sort();
const extra = [...authoredSlugs].filter((s) => !liveSlugs.has(s)).sort();

if (missing.length > 0) {
  console.error('Live product_slugs with NO authored research summary:', missing);
}
if (extra.length > 0) {
  console.error('Authored slugs that do not match any live shop_products.product_slug:', extra);
}
if (missing.length > 0 || extra.length > 0) {
  console.error('\nAborting without writing — fix the data file or the mismatch above and re-run.');
  process.exit(1);
}

console.log(`Coverage OK: ${authoredSlugs.size} authored summaries match ${liveSlugs.size} live product slugs exactly.`);

let upserted = 0;
for (const [slug, { preview, full }] of Object.entries(SHOP_RESEARCH_SUMMARIES)) {
  const { error: upsertError } = await client
    .from('shop_product_research_summaries')
    .upsert({ product_slug: slug, preview_text: preview, full_text: full }, { onConflict: 'product_slug' });
  if (upsertError) {
    console.error(`  ! failed for "${slug}":`, upsertError.message);
    continue;
  }
  upserted++;
}
console.log(`Upserted ${upserted} / ${authoredSlugs.size} research summaries.`);
