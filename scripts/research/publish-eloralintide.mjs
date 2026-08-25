#!/usr/bin/env node
/**
 * Publishes the Eloralintide compound (2026-08-25), following the
 * exact same rules the real admin UI's Publish action enforces
 * (src/lib/admin/validation.ts's checkPublishReadiness,
 * src/pages/admin/compounds/[id].astro's transition table: draft ->
 * in_review -> published) — every claim must have a citation, every
 * regulatory record must have a source. Mirrors
 * scripts/research/publish-batch.mjs (the 2026-08-19 batch's publish
 * script) exactly, scoped to this one compound. Re-verifies readiness
 * before writing anything; aborts (no partial publish) if it still
 * fails.
 *
 * Sets claims.status='published' too — the public profile page
 * (CompoundProfileBody.astro) filters claims by their OWN status
 * independently of the compound's, so publishing the compound alone
 * would render an empty page.
 *
 * Idempotent: no-ops if already published.
 * Run manually: node scripts/research/publish-eloralintide.mjs
 */
import { getServiceClient } from './lib/import-helpers.mjs';

async function main() {
  const client = getServiceClient();
  const { data: c, error } = await client
    .from('compounds')
    .select('id, slug, name, status')
    .eq('slug', 'eloralintide')
    .single();
  if (error) throw error;

  if (c.status === 'published') {
    console.log(`${c.slug}: already published, nothing to do.`);
    return;
  }

  const { data: claims } = await client
    .from('claims')
    .select('id, evidence_quality, quality_rationale, claim_sources(source_id)')
    .eq('compound_id', c.id);
  const uncited = (claims ?? []).filter((cl) => (cl.claim_sources?.length ?? 0) === 0);
  const missingRationale = (claims ?? []).filter(
    (cl) => cl.evidence_quality && cl.evidence_quality !== 'not_assessed' && !cl.quality_rationale,
  );
  const { data: regRecords } = await client
    .from('regulatory_records')
    .select('id, source_id')
    .eq('compound_id', c.id);
  const regMissingSource = (regRecords ?? []).filter((r) => !r.source_id);

  if (uncited.length || missingRationale.length || regMissingSource.length) {
    console.error(
      `BLOCKED: uncited claims: ${uncited.length}, missing rationale: ${missingRationale.length}, regulatory records missing source: ${regMissingSource.length}`,
    );
    console.error('\nAborting — no partial publish performed.');
    process.exit(1);
  }
  console.log(
    `Readiness check passed (${claims.length} claims, ${regRecords.length} regulatory records).\n`,
  );

  const now = new Date().toISOString();
  const { error: claimsErr } = await client
    .from('claims')
    .update({ status: 'published' })
    .eq('compound_id', c.id);
  if (claimsErr) throw claimsErr;

  const { error: compoundErr } = await client
    .from('compounds')
    .update({ status: 'published', last_reviewed_at: now })
    .eq('id', c.id);
  if (compoundErr) throw compoundErr;

  console.log(`${c.slug}: published.`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
