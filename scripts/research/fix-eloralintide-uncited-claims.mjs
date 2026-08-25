#!/usr/bin/env node
/**
 * Pre-publish fix, mirroring the exact established pattern from the
 * 2026-08-19 batch (scripts/research/fix-boilerplate-claim-sources.mjs
 * + fix-uncited-claims.mjs): checkPublishReadiness (src/lib/admin/
 * validation.ts) blocks publishing while ANY claim has zero cited
 * sources, regardless of the claim's own evidence_quality. Eloralintide
 * has 7 such claims:
 *
 *  - 5 standard editorial/site-policy claims (standardBoilerplateClaims()
 *    in scripts/research/lib/import-helpers.mjs) — attached to the same
 *    real, already-live "Cloud Peptides Research Use Policy" source
 *    every other published compound's boilerplate claims use (reused by
 *    URL, not a new/duplicate source row).
 *  - 2 compound-specific negative-finding/context claims, each attached
 *    to a real source ALREADY cited elsewhere on this same profile,
 *    with relationship 'provides_context' (honest about what the link
 *    represents — not evidence directly supporting the claim's content,
 *    but the source whose absence of a given finding, or whose own
 *    comparative framing, the claim is describing).
 *
 * Idempotent: the shared source is looked up/reused by URL; each
 * (claim_id, source_id) link is skipped if it already exists.
 * Run manually: node scripts/research/fix-eloralintide-uncited-claims.mjs
 */
import { getServiceClient, upsertSource } from './lib/import-helpers.mjs';

const BOILERPLATE_PREFIXES = [
  'Q: Does Cloud Peptides provide dosage information?',
  'Cloud Peptides does not provide medical advice',
  'Q: Is Eloralintide approved for medical use?',
  'All products are intended strictly for laboratory research',
  'This page summarizes publicly available scientific literature',
];

const POLICY_LOCATOR_NOTE =
  "This is Cloud Peptides' own editorial/site-policy statement, not a scientific claim about the compound — linked to the site's own Research Use Policy page rather than a scientific source.";

// Compound-specific fixes: each maps a claim (matched by its statement's
// distinctive opening) to the URL of a source already cited elsewhere
// on this profile that the claim is genuinely describing.
const CONTEXT_FIXES = [
  {
    statementPrefix: 'Long-term safety and efficacy beyond 48 weeks',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/41207310/', // The Lancet Phase 2 paper — the 48-week trial this claim is contrasting against
    locatorNote:
      "Describes the absence of any published finding beyond this source's own 48-week observation window — not evidence for the claim's content itself.",
  },
  {
    statementPrefix: 'Q: Is eloralintide the same thing as cagrilintide',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/41109426/', // Molecular Metabolism discovery paper — the source that draws the eloralintide/cagrilintide mechanistic comparison this FAQ answer restates
    locatorNote:
      'Source of the mechanistic AMY1R-selective-vs-non-selective comparison this FAQ answer restates in plain language.',
  },
];

async function main() {
  const client = getServiceClient();

  const { id: policySourceId } = await upsertSource(client, {
    sourceType: 'other',
    title: 'Cloud Peptides Research Use Policy',
    url: 'https://cloudpeptides.org/research-use-policy',
    publisherOrAgency: 'Cloud Peptides',
    retrievedDate: '2026-08-25',
  });
  console.log(`Research Use Policy source: ${policySourceId}`);

  const { data: compound } = await client
    .from('compounds')
    .select('id')
    .eq('slug', 'eloralintide')
    .single();

  const { data: claims } = await client
    .from('claims')
    .select('id, statement, claim_sources(source_id)')
    .eq('compound_id', compound.id);

  let linked = 0;
  for (const claim of claims) {
    if ((claim.claim_sources?.length ?? 0) > 0) continue; // already cited

    let sourceId = null;
    let locator = null;
    if (BOILERPLATE_PREFIXES.some((p) => claim.statement.startsWith(p))) {
      sourceId = policySourceId;
      locator = POLICY_LOCATOR_NOTE;
    } else {
      const fix = CONTEXT_FIXES.find((f) => claim.statement.startsWith(f.statementPrefix));
      if (fix) {
        const { data: src } = await client
          .from('sources')
          .select('id')
          .eq('url', fix.sourceUrl)
          .single();
        sourceId = src?.id ?? null;
        locator = fix.locatorNote;
      }
    }

    if (!sourceId) {
      console.error(`  ! no fix defined for uncited claim: "${claim.statement.slice(0, 70)}..."`);
      continue;
    }

    const { error } = await client
      .from('claim_sources')
      .insert({
        claim_id: claim.id,
        source_id: sourceId,
        relationship: 'provides_context',
        locator,
      })
      .select()
      .single();
    if (error && error.code !== '23505') {
      // 23505 = unique violation = already linked, fine (idempotent)
      console.error(`  ! failed to link claim ${claim.id}:`, error.message);
      continue;
    }
    linked++;
    console.log(`  linked: "${claim.statement.slice(0, 60)}..." -> ${sourceId}`);
  }
  console.log(`\n${linked} claim(s) linked.`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
