-- Same-session bug fix, found by live RLS spot-checking (not just
-- assumed) immediately after 20260825120000_shop_research_summaries.sql
-- was applied: that migration granted anon SELECT and wrote a policy
-- "to anon, authenticated" reasoning (in its own comment) that this was
-- "future-proofing, not an active hole today" — a direct live check
-- with the real anon key proved that reasoning WRONG. The mandatory
-- researcher-account gate (20260813121000_gate_revoke_anon_access.sql)
-- really did strip anon's grant from every other table (confirmed live:
-- anon gets "permission denied" on both shop_products and compounds) —
-- shop_product_research_summaries was the one table in this pass that
-- still let anon read it, because its grant was added fresh, after that
-- revoke migration ran, and so was never swept by it. Every real
-- application read already goes through the visitor's own session
-- token (src/lib/public-shop.ts's createUserScopedClient, never a bare
-- anon-key client) — removing the anon grant here has zero functional
-- effect on the app and simply closes the gap.
revoke select on public.shop_product_research_summaries
from
  anon;

drop policy "shop_research_summaries_select_all" on public.shop_product_research_summaries;

create policy "shop_research_summaries_select_authenticated" on public.shop_product_research_summaries for select to authenticated using (true);
