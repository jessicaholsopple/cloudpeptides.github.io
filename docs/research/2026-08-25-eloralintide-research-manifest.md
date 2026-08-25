# Eloralintide (LY3841136) — research manifest

**Date of this research pass:** 2026-08-25
**Researched by:** Claude (Sonnet 5), per explicit task request this session
**Pre-import duplicate check:** `scripts/research/check-eloralintide.mjs`, run against the live shared
Supabase project (staging = production, `riuxojncmnhogclrhoys`) 2026-08-25 — **no existing compound or
alias** matched "eloralintide," "LY3841136" (with/without hyphen/space), "amylin receptor agonist,"
"selective amylin," or "long-acting amylin" in `public.compounds`/`public.compound_aliases` (74
compounds total in the library at time of check). **No duplicate exists. This is a new profile**,
inserted as `status='draft'` per CLAUDE.md's draft → in_review → published workflow — not published,
not linked to any shop product.

## Search terms used

- eloralintide
- LY3841136 / LY-3841136 / LY 3841136
- selective amylin receptor agonist
- long-acting amylin receptor agonist
- AMY1R agonist obesity
- Eli Lilly amylin obesity Phase 3
- eloralintide tirzepatide combination
- eloralintide macupatide combination
- eloralintide FDA breakthrough therapy / fast track
- eloralintide WHO ICTRP / EudraCT / EU CTIS

## Databases / registries searched

- **ClinicalTrials.gov** — queried directly via its public API (`clinicaltrials.gov/api/v2/studies/{NCT}`
  for each known ID, plus a full-text search `query.term=eloralintide OR LY3841136` to find studies
  beyond the seven supplied starting identifiers). This is also Lilly's own official trial registry
  entry point — Lilly does not maintain a separate public registry outside ClinicalTrials.gov/CTIS.
- **PubMed / PubMed Central** — via NCBI E-utilities (`esearch`/`esummary`/`efetch`) and direct PMC
  full-text fetch for open-access articles.
- **CrossRef** — used to independently resolve the ADA conference-abstract DOI or listed in a WebFetch
  bot-wall.
- **EU CTIS** — not queried directly via its own portal (see Limitations below); every EU CTIS number
  found was captured as a secondary identifier submitted by the sponsor directly into the
  ClinicalTrials.gov record, which is itself a WHO ICTRP-recognized primary registry.
- **WHO ICTRP** — not queried as a separate portal; ClinicalTrials.gov is a WHO ICTRP primary partner
  registry, and no separate WHO ICTRP-only record was identified in search results.
- **FDA** — searched for breakthrough-therapy/fast-track designation; none found. No FDA approval,
  NDA, or public FDA-specific record exists for an investigational compound at this development stage,
  which is expected and not itself a limitation.
- **EMA** — no EMA-specific record found (expected; no EU marketing application at this stage).
- General web search — used to locate the above and to find the sponsor press release / manufacturer
  explainer page (used only as labeled sponsor-reported context, never as scientific evidence).

## Included sources (12 unique sources; 25 unique trial registrations found, 3 of which have a
matched peer-reviewed/conference-abstract publication)

### Peer-reviewed publications (3)

| # | Title | Authors (first/last) | Journal | Date | DOI | PMID | PMCID | Matched NCT |
|---|---|---|---|---|---|---|---|---|
| 1 | Eloralintide (LY3841136), a novel amylin receptor agonist for the treatment of obesity: From discovery to clinical proof of concept | Briere DA … Bhattachar SN (18 authors, all Lilly) | Molecular Metabolism, vol 102, art 102271 | Epub 2025-10-16; print Dec 2025 | 10.1016/j.molmet.2025.102271 | 41109426 | PMC12640043 (open access) | NCT05295940 (Part A — single-ascending-dose) + preclinical in vitro/rat/monkey studies (no separate registration; preclinical, not human-subjects research) |
| 2 | Eloralintide, a selective, long-acting amylin receptor agonist for treatment of obesity: Phase 1 proof of concept | Bhattachar S … Pratt E (9 authors, all Lilly) | Diabetes, Obesity and Metabolism, 28(4):2651–2660 | Epub 2026-01-20; print Apr 2026 | 10.1111/dom.70439 | 41559929 | PMC12992164 (open access) | NCT05295940 (Part B — multiple-ascending-dose) |
| 3 | Eloralintide, a selective amylin receptor agonist for the treatment of obesity: a 48-week phase 2, multicentre, double-blind, randomised, placebo-controlled trial | Billings LK … Coskun T (10 authors; 3 independent academic/clinical-site first authors + 7 Lilly) | The Lancet, 406(10520):2631–2643 | Epub 2025-11-06; print 2025-12-06 | 10.1016/S0140-6736(25)02155-5 | 41207310 | not found open-access at time of check | NCT06230523 |

### Conference abstract (1) — dedup note: preliminary presentation of the same study as publication #2 above

| # | Title | Authors | Venue | Date | DOI | Matched NCT |
|---|---|---|---|---|---|---|
| 4 | 882-P: Eloralintide, a Selective, Long-Acting Amylin Receptor Agonist for Obesity—Phase 1 Proof of Concept | Bhattachar SN, Tham L, Tidemann-Miller B, Briere DA, Qu H, Haupt A, Pratt EJ, Mather KJ | American Diabetes Association 85th Scientific Sessions; Diabetes 74(Supplement_1) | 2025-06-20 | 10.2337/db25-882-P | NCT05295940 (Part B) |

**Dedup determination:** Abstract #4's numbers (LS-mean % body-weight change −2.6% to −11.3% at week 12;
same 100-participant, 44-year mean age, 29%-female, 5-cohort MAD design) match publication #2's final
numbers essentially exactly (2.6%–11.3%, same population) — abstract #4 is the June 2025 ADA
conference presentation of the same underlying trial data later published in full as #2 (January
2026). **Not counted as an additional/independent study** — one underlying study (NCT05295940 Part B),
two publications about it, both retained as separate `sources` rows (both are independently citable
artifacts with their own dates/venues) but explicitly cross-referenced here.

### ClinicalTrials.gov registrations (21 unique studies directly involving eloralintide, all sponsored
by Eli Lilly and Company; found via full-text registry search, not just the 7 supplied starting IDs)

| NCT | Title (short) | Phase | Status (as of 2026-08-25) | Results posted? | Matched publication |
|---|---|---|---|---|---|
| NCT05295940 | Safety/tolerability/PK in healthy & overweight participants (2-part: A=SAD, B=MAD) | 1 | Completed | No (registry) | Yes — #1 (Part A) + #2/#4 (Part B) |
| NCT06230523 | LY3841136 vs placebo, adults with obesity/overweight | 2 | Completed | **Yes** — full structured results on the registry | Yes — #3 |
| NCT06916065 | Eloralintide, and eloralintide + tirzepatide — safety/tolerability/relative bioavailability | 1 | Completed | No | No publication found |
| NCT06345066 | Tirzepatide + LY3841136 combination — safety/tolerability | 1 | Completed | No | No publication found |
| NCT06297616 | LY3841136 monotherapy and + tirzepatide, Japanese participants | 1 | Completed | No | No publication found |
| NCT06916091 | Eloralintide, Chinese participants | 1 | Completed | No | No publication found |
| NCT06603571 | LY3841136 + tirzepatide, obesity/overweight with T2D | 2 | Active, not recruiting | No | No publication found |
| NCT07589608 | Macupatide + eloralintide, alone or combined | 2 (2b) | Recruiting | No | No publication found |
| NCT07215559 | Macupatide + eloralintide, alone or combined, with T2D | 2 | Recruiting | No | No publication found |
| NCT07765511 | Macupatide ± eloralintide, Japanese participants | 1 | Not yet recruiting | No | No publication found — primarily a macupatide (LY3532226) trial; eloralintide is a secondary combination arm only |
| NCT07282600 | Eloralintide, obesity/overweight + T2D | 3 | Recruiting | No | No publication (trial ongoing) |
| NCT07321886 | Eloralintide, obesity/overweight without T2D | 3 | Recruiting | No | No publication (trial ongoing) |
| NCT07392190 | Eloralintide, persistent obesity on a weekly incretin | 3 | Recruiting | No | No publication (trial ongoing) |
| NCT07353931 | Eloralintide, osteoarthritis knee pain + obesity/overweight | 3 | Recruiting | No | No publication (trial ongoing) |
| NCT07369011 | Eloralintide, obstructive sleep apnea + obesity/overweight | 3 | Recruiting | No | No publication (trial ongoing) |
| NCT07701083 | Eloralintide, two solutions, healthy participants (PK) | 1 | Recruiting | No | No publication (trial ongoing) |
| NCT07738614 | Eloralintide, gastric-emptying delay + PK, obesity/overweight | 1 | Recruiting | No | No publication (trial ongoing) |
| NCT07665879 | Eloralintide, insulin sensitivity (hyperinsulinemic clamp) | 1 | Recruiting | No | No publication (trial ongoing) |
| NCT07401862 | Eloralintide, hepatic impairment PK | 1 | Recruiting | No | No publication (trial ongoing) |
| NCT07426380 | Eloralintide, renal impairment PK | 1 | Active, not recruiting | No | No publication (trial ongoing) |
| NCT06143956 | Master protocol (CWMM) — multiple weight-management interventions incl. LY3841136 as one intervention-specific appendix | 2 | Recruiting | No | Umbrella protocol; the individual ISAs above (e.g. NCT06230523's "W8M-MC-LAA1") run under it — not double-counted as a separate result-bearing study |

All 21 are recorded as `sources` rows (`source_type='clinicaltrials_gov'`) with the NCT number as a
`source_identifiers` row and the EU CTIS number also recorded where the registry itself lists one
(NCT07282600, NCT07321886, NCT07392190, NCT07353931, NCT07369011, NCT07665879, NCT07401862 each carry
a `2025-5236xx-xx-00`-format CTIS secondary ID, captured verbatim from the ClinicalTrials.gov record).

### Sponsor-reported, non-peer-reviewed sources (2) — used only for labeled sponsor context, never as
scientific evidence for a claim

| # | Title | Publisher | Date | URL |
|---|---|---|---|---|
| 5 | "Lilly's selective amylin agonist, eloralintide, demonstrated meaningful weight loss and favorable tolerability in a Phase 2 study of adults with obesity or overweight" | Eli Lilly and Company (investor relations release, distributed via PR Newswire) | 2025-11-06 | https://investor.lilly.com/news-releases/news-release-details/lillys-selective-amylin-agonist-eloralintide-demonstrated |
| 6 | "What to know about eloralintide" | Eli Lilly and Company (corporate news/explainer page) | undated (accessed 2026-08-25) | https://www.lilly.com/news/stories/what-to-know-about-eloralintide |

## Excluded sources (vendor listings / aggregators / secondary journalism — not used as evidence)

- MedChemExpress product page (`medchemexpress.com/eloralintide.html`) — reagent/chemical vendor
  listing, not a scientific source (matches CLAUDE.md's "never sourced only from vendor websites").
- Kalios Health compound page, peptibase.dev, Synapse (PatSnap) drug page — third-party aggregator/
  database sites that restate primary-source data without adding independent evidence; excluded as
  citable sources, though cross-checking against them did not surface anything the primary sources
  above didn't already establish.
- Applied Clinical Trials Online, Drug Topics, Clinical Trials Arena, Yahoo Finance — trade-press
  secondary coverage of the same Lancet/press-release results; not cited as evidence sources since the
  primary Lancet paper and registry results are directly available and preferred. One exception: these
  outlets' use of the informal Phase 3 program name "ENLIGHTEN" is noted in a claim as attributed
  trade-press framing, not asserted as an official registry-confirmed program name (no primary source
  independently confirms "ENLIGHTEN" as the official umbrella name).

## A caught error worth recording

An initial general web-search synthesis (not a primary source — an AI-generated summary of search
results) asserted eloralintide causes "prolonged plasma calcium reduction" in preclinical studies.
Targeted re-verification directly against the open-access primary-source full text (Molecular
Metabolism, PMC12640043) found **no mention of calcium, hypercalcemia, pancreatitis, amylase, lipase,
or bone-density findings anywhere in that paper**. This claim was **not included** in the imported
profile — per this task's explicit instruction to never invent inaccessible data, an unverifiable
claim is omitted rather than asserted on the strength of a secondary AI-generated summary alone. Any
future reviewer who finds a primary source that does support a calcium-related preclinical finding
should add it as its own separately-cited claim.

## Evidence limitations (recorded here, and echoed in the compound's own overview fields)

- Every human trial identified is sponsored by Eli Lilly and Company; the two full papers' academic
  first authors (Lancet: Billings, Hsia, Bays) are independent clinical investigators, but all
  co-authors from Lilly are also company shareholders, and the Molecular Metabolism and DOM papers are
  entirely Lilly-authored. No independent (non-sponsor) replication has been published.
- No Phase 3 trial has reported results as of this review — every efficacy claim above 48 weeks'
  duration, every claim involving participants with type 2 diabetes at Phase 3 scale, and every
  combination-therapy efficacy/safety claim (with tirzepatide or macupatide) is **not yet answerable**
  from published data; six completed/active Phase 1–2 combination and international-bridging studies
  have no posted results yet.
- The Lancet abstract's per-arm percentages ("efficacy estimand," e.g. −9% at 1 mg) and the raw
  ClinicalTrials.gov posted-results numbers (e.g. −9.4% at 1 mg) differ by rounding/estimand
  methodology (likely a different statistical estimand — efficacy vs. treatment-policy/hypothetical) —
  both are recorded as separate claims tied to their own source, not silently reconciled into one
  number, so a reader can see they come from methodologically distinct analyses of the same trial.
- EU CTIS numbers were verified only as submitted by the sponsor into the ClinicalTrials.gov record,
  not independently cross-checked against the EU CTIS public portal itself (that portal's own search
  interface was not directly queried in this pass) — noted as a followup item, not asserted as
  independently EU-confirmed.
- No FDA breakthrough-therapy, fast-track, priority-review, or any other special designation was
  found for eloralintide in this search; absence of evidence is recorded as "not found," not asserted
  as "does not have."
- "Macupatide" (LY3532226) is a distinct Lilly investigational compound that appears only as a
  combination-study partner in several of the trials above; it was not independently researched or
  profiled in this pass (out of scope for this task) — combination-study claims describe it only as
  "a separate Lilly investigational compound," not compare its own evidence base.

## Identity conflicts requiring human review

**None.** Every primary source (25 registry entries + 2 full papers + 1 conference abstract) uses
"Eloralintide" and "LY3841136" interchangeably and consistently to refer to one compound, with Eli
Lilly and Company as the consistent sole sponsor/manufacturer across every source. `identity_confidence`
is set to `'verified'` in the imported profile (unlike, e.g., the AOD-9604/"AOD 9064"/"AOD9605" cluster
handled in the 2026-08-19 batch, which required an `alias_added`/held-conflict resolution) — no
disambiguation was needed here.

## Import

`scripts/research/import-eloralintide.mjs` (idempotent, reuses `scripts/research/lib/import-helpers.mjs`
— existence-checked by slug before insert, safe to re-run). Inserted as a single `compounds` row with
`status='draft'`, `identity_confidence='verified'`, `entity_kind='peptide'`, plus aliases, 25 `sources`
rows (with `source_identifiers` for every DOI/PMID/PMCID/NCT/CTIS number recorded above), 3 `studies`
rows (Phase 1 SAD, Phase 1 MAD, Phase 2), the standard boilerplate safety/FAQ claims, and every
compound-specific claim described above — each individually tied to its own source(s) via
`claim_sources`, with `evidence_quality` and `interpretation_status` set per claim and never conflated
with each other. One `regulatory_records` row (FDA, United States, `investigational`). **Not published,
not linked to any shop product or SKU** — awaiting the ordinary admin editorial review documented in
CLAUDE.md §6/§3.
