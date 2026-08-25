#!/usr/bin/env node
/**
 * RLS verification for shop_product_research_summaries (2026-08-25),
 * against the real live shared Supabase project — same convention as
 * this directory's other verify-*.mjs scripts. Written after a real
 * bug was found live (the table's first migration accidentally granted
 * anon SELECT, contradicting the mandatory researcher-gate posture
 * every other table follows — fixed by
 * 20260825120001_shop_research_summaries_anon_revoke_fix.sql) —
 * exists specifically so that regression can never silently return.
 *
 * Run manually: node scripts/migration/verify-shop-research-summaries-rls.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { getServiceClient, loadEnv } from '../research/lib/import-helpers.mjs';

const env = loadEnv();
const admin = getServiceClient();
const anon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const results = [];
function record(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? ` (${detail})` : ''}`);
}

async function main() {
  // Behavioral checks against the real anon key — this IS how the
  // original bug was actually caught (not by reading policy
  // definitions, which can look correct on paper while grants tell a
  // different story), so it's the most reliable regression guard.
  // information_schema.table_privileges would give a second,
  // structural confirmation, but PostgREST doesn't expose that schema
  // by default in this project and adding it isn't worth a schema
  // config change just for this check.
  const { error: anonSelectErr } = await anon
    .from('shop_product_research_summaries')
    .select('*')
    .limit(1);
  record('anon SELECT is rejected (permission denied)', !!anonSelectErr, anonSelectErr?.message);

  const { error: anonInsertErr } = await anon
    .from('shop_product_research_summaries')
    .insert({ product_slug: 'rls-check-should-never-persist', preview_text: 'x', full_text: 'y' });
  record('anon INSERT is rejected', !!anonInsertErr, anonInsertErr?.message);

  // Cleanup safety net: if either anon call above somehow DID persist
  // a row (i.e. this test itself caught a real hole), remove it via
  // the service-role client so this verification script never leaves
  // test data behind.
  await admin
    .from('shop_product_research_summaries')
    .delete()
    .eq('product_slug', 'rls-check-should-never-persist');

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('shop_product_research_summaries RLS verification crashed:', err);
  process.exit(1);
});
