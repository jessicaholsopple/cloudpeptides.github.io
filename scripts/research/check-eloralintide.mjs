// Pre-import duplicate/alias check for Eloralintide, per CLAUDE.md's
// "search first, never duplicate" requirement and the 2026-08-19
// reconciliation-manifest precedent. Read-only.
import { getServiceClient } from './lib/import-helpers.mjs';

const client = getServiceClient();
const terms = [
  'eloralintide', 'ly3841136', 'ly-3841136', 'ly 3841136',
  'amylin receptor agonist', 'selective amylin', 'long-acting amylin',
];

for (const term of terms) {
  const { data: compounds, error } = await client
    .from('compounds')
    .select('id, slug, name, status, entity_kind, identity_confidence')
    .ilike('name', `%${term}%`);
  if (error) { console.error('compounds error', term, error.message); continue; }
  const { data: aliases, error: aliasErr } = await client
    .from('compound_aliases')
    .select('alias, compound_id, compounds(slug, name, status)')
    .ilike('alias', `%${term}%`);
  if (aliasErr) { console.error('alias error', term, aliasErr.message); continue; }
  console.log(`\nTerm: "${term}"`);
  console.log('  compounds.name matches:', compounds?.length ? compounds : 'none');
  console.log('  aliases matches:', aliases?.length ? aliases : 'none');
}

// Also list total compound count + confirm connectivity.
const { count } = await client.from('compounds').select('id', { count: 'exact', head: true });
console.log(`\nTotal compounds in DB: ${count}`);
