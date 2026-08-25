// Applies one supabase/migrations/*.sql file directly via
// PROD_DATABASE_URL and records it in supabase_migrations.schema_migrations
// so `supabase migration list`/`db push` recognize it as already
// applied. Exists because the Supabase CLI installed in this
// environment (2.111.0) rejects the newer-format token in
// .env.local's SUPABASE_ACCESS_TOKEN as invalid ("LegacyInvalidAccessTokenError")
// even though the token itself works fine for the ordinary
// service-role/JS-client access every other script in this repo uses —
// a CLI-version/token-format mismatch, not a credential problem. Using
// this script is a workaround for that, not a replacement for fixing
// the underlying CLI auth in a future session.
//
// Usage: node scripts/migration/apply-migration.mjs <path-to-migration.sql>
//
// Requires explicit chat approval before use against the live shared
// project per CLAUDE.md §9 (destructive/production database access) —
// this script does not gate that itself, the operator must.
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import pg from 'pg';

function loadEnv() {
  const envText = readFileSync('.env.local', 'utf8');
  const env = {};
  for (const rawLine of envText.split(/\r?\n/)) {
    const line = rawLine.trim();
    const m = line.match(/^([A-Za-z0-9_ ]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error('Usage: node scripts/migration/apply-migration.mjs <path-to-migration.sql>');
  process.exit(1);
}

const match = basename(migrationPath).match(/^(\d{14})_(.+)\.sql$/);
if (!match) {
  console.error("Migration filename must match supabase's <timestamp>_<name>.sql convention.");
  process.exit(1);
}
const [, version, name] = match;

const env = loadEnv();
const client = new pg.Client({
  connectionString: env.PROD_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
try {
  const sql = readFileSync(migrationPath, 'utf8');
  await client.query('begin');
  await client.query(sql);
  await client.query(
    `insert into supabase_migrations.schema_migrations (version, name, statements)
     values ($1, $2, $3)
     on conflict (version) do nothing`,
    [version, name, [sql]],
  );
  await client.query('commit');
  console.log(`Applied and recorded ${version}_${name}.`);
} catch (err) {
  await client.query('rollback');
  console.error('FAILED, rolled back:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
