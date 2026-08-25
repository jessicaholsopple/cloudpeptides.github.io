-- Shop plain-English research-summary content (2026-08-25 task) —
-- one normalized row per PUBLIC product identity (product_slug),
-- reused automatically across every mg-strength/SKU variant of that
-- product rather than duplicated per shop_products row. Deliberately a
-- separate table, not new columns on shop_products: shop_products is
-- one row per SKU (many rows can share a product_slug), so a
-- per-SKU column would either duplicate the same text across every
-- strength or require picking one arbitrary "representative" row —
-- both wrong. product_slug is already the established public grouping
-- key (see shop_products.product_slug's own comment,
-- 20260810120000_shop_products_public_slug.sql).
--
-- Deliberately NOT linked to compounds/compound_id in any way, even
-- admin-side — CLAUDE.md §7's research/shop structural separation and
-- the CP-S1/CP-T2/CP-R3 identity-protection requirement (§27.3-style
-- policy reaffirmed 2026-08-25 task) both mean this table's content
-- must stand on its own, authored to never reveal or imply which
-- research compound (if any) a shop product corresponds to. No FK to
-- compounds exists here to enforce that structurally, not just
-- editorially: there is nothing to accidentally join or leak.
create table public.shop_product_research_summaries (
  -- Natural primary key (no synthetic id) — product_slug is already
  -- the established public grouping key, one row per product identity.
  -- "Reuse one normalized description for multiple strengths" is
  -- enforced structurally by this being the join key every SKU variant
  -- resolves to, not a convention. Same format already enforced on
  -- shop_products.product_slug, kept identical for consistency.
  product_slug text primary key check (product_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  -- Short, equal-height-friendly preview shown on every shop card
  -- (1-2 plain sentences by editorial convention; no length constraint
  -- in the DB itself — the UI enforces equal card height via CSS
  -- line-clamping, not by truncating stored text).
  preview_text text not null,
  -- Full "What researchers are studying" expandable content. Authored
  -- as plain-language prose (not structured JSON) so the required
  -- elements (compound type, pathway, what it's studied for, careful
  -- conditional "may influence" language, evidence basis, limitations)
  -- read as one coherent explanation rather than a form; the standard
  -- closing research-only notice is included as the final paragraph of
  -- this text by editorial convention, not a separate column, so it
  -- can never be displayed without the content it qualifies.
  full_text text not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger shop_product_research_summaries_set_updated_at before update on public.shop_product_research_summaries for each row
execute function public.set_updated_at ();

-- Same RLS posture as shop_products/product_categories: public read
-- (this content never carries anything private — no price, no
-- compound identity — so anon/authenticated read is safe by
-- construction), admin-only write. Matches the visitor-token-only
-- access pattern src/lib/public-shop.ts already uses for every other
-- shop read (CLAUDE.md §8's mandatory-researcher-gate posture — `anon`
-- has no live grant on any table since the 2026-08-13 gate migration,
-- so the anon grant below is future-proofing consistent with
-- shop_products' own anon grant, not an active hole today).
alter table public.shop_product_research_summaries enable row level security;

alter table public.shop_product_research_summaries force row level security;

create policy "shop_research_summaries_select_all" on public.shop_product_research_summaries for select to anon, authenticated using (true);

create policy "shop_research_summaries_all_admin" on public.shop_product_research_summaries for all to authenticated using (public.has_min_role ('admin'))
with
  check (public.has_min_role ('admin'));

grant select on public.shop_product_research_summaries to anon;

grant
select
,
insert,
update,
delete on public.shop_product_research_summaries to authenticated;

comment on table public.shop_product_research_summaries is 'Plain-English "what researchers are studying" shop content (2026-08-25). One row per product_slug, reused across every mg-strength SKU. No FK to compounds — must never reveal or imply the CP-S1/CP-T2/CP-R3 scientific-name mapping (CLAUDE.md §7).';
