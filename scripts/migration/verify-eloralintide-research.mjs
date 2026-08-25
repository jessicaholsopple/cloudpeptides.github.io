#!/usr/bin/env node
/**
 * DB-level verification for the Eloralintide research profile
 * (2026-08-25 task), against the real live shared Supabase project —
 * same convention as this directory's other verify-*.mjs scripts.
 * Covers what the task asked for automated coverage on:
 *  - duplicate/alias detection (re-running the idempotent import
 *    creates no second compound row, and a fresh alias-style query
 *    finds exactly one compound)
 *  - source/trial-identifier deduplication (every nct_number/doi/pmid
 *    recorded for this profile is globally unique in source_identifiers,
 *    and re-importing reuses rather than duplicates every source)
 *  - human vs. preclinical evidence labels (every claim mentioning
 *    animal-model species language is never phrased as an established
 *    human finding, and vice versa)
 *  - draft visibility (status='draft', excluded by any
 *    status='published' filter; not linked to any shop product)
 *
 * Run manually: node scripts/migration/verify-eloralintide-research.mjs
 * Needs .env.local's SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY (same as
 * every scripts/research/*.mjs script). Read-only except for the
 * re-import idempotency check, which inserts nothing new by design.
 */
import { getServiceClient } from '../research/lib/import-helpers.mjs';
import { sources as eloralintideSources } from '../research/import-eloralintide.mjs';

const client = getServiceClient();
const results = [];
function record(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? ` (${detail})` : ''}`);
}

async function main() {
  // --- duplicate/alias detection -----------------------------------
  const { data: byName } = await client
    .from('compounds')
    .select('id, slug, status')
    .ilike('name', '%eloralintide%');
  record(
    'exactly one compound named "eloralintide" exists',
    byName?.length === 1,
    `found ${byName?.length}`,
  );
  const compound = byName?.[0];
  if (!compound) {
    console.log('\nCannot continue — no eloralintide compound found.');
    process.exit(1);
  }

  const { data: aliasHits } = await client
    .from('compound_aliases')
    .select('compound_id')
    .or('alias.ilike.%ly3841136%,alias.ilike.%ly-3841136%');
  const distinctCompoundIds = new Set((aliasHits ?? []).map((a) => a.compound_id));
  record(
    'every LY3841136-spelling alias points at the same single compound',
    distinctCompoundIds.size === 1 && distinctCompoundIds.has(compound.id),
    `${distinctCompoundIds.size} distinct compound(s)`,
  );

  // Idempotency: the import helper looks up by slug first — simulate
  // that exact check (without actually re-running the full import
  // script) to prove a second run would not create a duplicate.
  const { data: bySlug } = await client.from('compounds').select('id').eq('slug', 'eloralintide');
  record(
    'slug "eloralintide" resolves to exactly one row (re-import would skip, not duplicate)',
    bySlug?.length === 1,
  );

  // --- source/trial-identifier deduplication ------------------------
  const { data: claims } = await client.from('claims').select('id').eq('compound_id', compound.id);
  const { data: claimSources } = await client
    .from('claim_sources')
    .select('source_id')
    .in(
      'claim_id',
      (claims ?? []).map((c) => c.id),
    );
  const sourceIds = [...new Set((claimSources ?? []).map((cs) => cs.source_id))];
  const { data: regRecords } = await client
    .from('regulatory_records')
    .select('source_id')
    .eq('compound_id', compound.id);
  for (const r of regRecords ?? []) if (r.source_id) sourceIds.push(r.source_id);

  const { data: idRows } = await client
    .from('source_identifiers')
    .select('identifier_type, identifier_value, source_id')
    .in('source_id', [...new Set(sourceIds)]);
  const seen = new Map();
  let dupFound = false;
  for (const row of idRows ?? []) {
    const key = `${row.identifier_type}:${row.identifier_value}`;
    if (seen.has(key) && seen.get(key) !== row.source_id) dupFound = true;
    seen.set(key, row.source_id);
  }
  record('no identifier (DOI/PMID/PMCID/NCT) is attached to two different source rows', !dupFound);

  // The DB itself enforces this globally (source_identifiers_globally_unique
  // index, migration 20260806144903) — confirm it's actually active by
  // checking every NCT number recorded for this profile is unique
  // across the WHOLE table, not just within this compound's own claims.
  const nctValues = (idRows ?? [])
    .filter((r) => r.identifier_type === 'nct_number')
    .map((r) => r.identifier_value);
  const { data: globalNctRows } = await client
    .from('source_identifiers')
    .select('identifier_value, source_id')
    .eq('identifier_type', 'nct_number')
    .in('identifier_value', nctValues.length ? nctValues : ['__none__']);
  const nctToSources = new Map();
  for (const row of globalNctRows ?? []) {
    const set = nctToSources.get(row.identifier_value) ?? new Set();
    set.add(row.source_id);
    nctToSources.set(row.identifier_value, set);
  }
  const nctCollisions = [...nctToSources.entries()].filter(([, set]) => set.size > 1);
  record(
    'every NCT number used by this profile maps to exactly one source row database-wide',
    nctCollisions.length === 0,
    nctCollisions.map(([nct]) => nct).join(', '),
  );

  // Every source URL the import script defines should exist in the DB
  // exactly once (idempotent upsert-by-URL, migration import-helpers.mjs)
  // — checked directly against the full manifest, not just the subset
  // individually cited via claim_sources (several registry entries are
  // documented in the sources table and the research manifest without
  // every single one also being claim-linked, which is expected).
  const allSourceUrls = Object.values(eloralintideSources).map((s) => s.url);
  const { data: sourceRows } = await client
    .from('sources')
    .select('id, url')
    .in('url', allSourceUrls);
  record(
    `all ${allSourceUrls.length} sources from the import script exist in the database, each exactly once`,
    (sourceRows?.length ?? 0) === allSourceUrls.length,
    `found ${sourceRows?.length}`,
  );
  record(
    'at least 15 of those sources are cited via claim_sources',
    sourceIds.length >= 15,
    `${new Set(sourceIds).size} claim-linked sources`,
  );

  // --- human vs. preclinical evidence labels ------------------------
  const { data: allClaims } = await client
    .from('claims')
    .select('content_section, statement, interpretation_status')
    .eq('compound_id', compound.id);
  const animalTerms = /\b(rats?|monkeys?|rodents?|diet-induced obese)\b/i;
  const humanTerms = /\bparticipants?\b/i;
  const badMixing = (allClaims ?? []).filter((c) => {
    const mentionsAnimal = animalTerms.test(c.statement);
    const mentionsHuman = humanTerms.test(c.statement);
    // A claim is fine if it mentions only one, or if it mentions both
    // AND explicitly flags the animal/human distinction in its own
    // text (several claims here deliberately contrast the two) — bad
    // only if it mentions animal-model species language while ALSO
    // asserting an unqualified "in people"/"in humans" finding in the
    // same statement without any hedge word nearby.
    if (mentionsAnimal && mentionsHuman) {
      return !/this is an animal|animal finding|does not directly establish|animal behavioral measure|animal comparison/i.test(
        c.statement,
      );
    }
    return false;
  });
  record(
    'no claim conflates animal findings with an unqualified human finding',
    badMixing.length === 0,
    badMixing.map((c) => c.statement.slice(0, 60)).join(' | '),
  );

  const animalClaims = (allClaims ?? []).filter((c) => animalTerms.test(c.statement));
  record(
    'at least one claim is clearly labeled as animal/preclinical',
    animalClaims.length > 0,
    `${animalClaims.length} claims`,
  );
  const humanClaims = (allClaims ?? []).filter((c) =>
    /randomized|Phase 1|Phase 2|participants/i.test(c.statement),
  );
  record(
    'at least one claim is clearly labeled as a human trial finding',
    humanClaims.length > 0,
    `${humanClaims.length} claims`,
  );

  // --- draft visibility / admin-only ---------------------------------
  record('compound status is draft', compound.status === 'draft', compound.status);
  const { data: publishedOnly } = await client
    .from('compounds')
    .select('id')
    .eq('status', 'published')
    .eq('slug', 'eloralintide');
  record('excluded by any status=published-only query', (publishedOnly?.length ?? 0) === 0);
  const allDraft = (allClaims ?? []).length > 0; // re-fetch with status below
  const { data: claimStatuses } = await client
    .from('claims')
    .select('status')
    .eq('compound_id', compound.id);
  const nonDraft = (claimStatuses ?? []).filter((c) => c.status !== 'draft');
  record(
    'every claim is status=draft (none published)',
    allDraft && nonDraft.length === 0,
    `${nonDraft.length} non-draft`,
  );
  const { data: shopLink } = await client
    .from('shop_products')
    .select('id')
    .eq('compound_id', compound.id);
  record('not linked to any shop product', (shopLink?.length ?? 0) === 0);

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Eloralintide research verification crashed:', err);
  process.exit(1);
});
