// Eloralintide (LY3841136) research-profile import — 2026-08-25 task.
//
// Idempotent (reuses lib/import-helpers.mjs — existence-checked by slug
// before insert, safe to re-run). Inserted as status='draft' only, per
// CLAUDE.md's draft -> in_review -> published editorial workflow; not
// published, not linked to any shop product/SKU. Full research
// provenance, source list, dedup reasoning, and evidence limitations
// are documented in
// docs/research/2026-08-25-eloralintide-research-manifest.md — this
// file is the mechanical import, not the research record itself.
import { pathToFileURL } from 'node:url';
import {
  getServiceClient,
  importCompound,
  standardBoilerplateClaims,
} from './lib/import-helpers.mjs';

const SEARCH_DATE = '2026-08-25';
const DATABASES_SEARCHED = [
  'ClinicalTrials.gov (public API, full-text + per-ID lookups)',
  'PubMed / PubMed Central (NCBI E-utilities)',
  'CrossRef',
  'EU CTIS (identifiers only, as submitted by sponsor into ClinicalTrials.gov records)',
  'WHO ICTRP (via ClinicalTrials.gov, a WHO ICTRP primary partner registry)',
  'FDA (designation search — none found)',
  'EMA (no EU-specific record found)',
];
const SEARCH_TERMS = [
  'eloralintide',
  'LY3841136 / LY-3841136 / LY 3841136',
  'selective amylin receptor agonist',
  'long-acting amylin receptor agonist',
  'AMY1R agonist obesity',
  'Eli Lilly amylin obesity Phase 3',
  'eloralintide tirzepatide combination',
  'eloralintide macupatide combination',
  'eloralintide FDA breakthrough therapy / fast track',
  'eloralintide WHO ICTRP / EudraCT / EU CTIS',
];

// ---------------------------------------------------------------------
// Sources — keyed for reference from studies[].sourceKey and
// claims[].sourceKeys below. NCT sources use source_type
// 'clinicaltrials_gov'; the two full papers + Lancet use
// 'pubmed_article'; the ADA abstract uses 'other' (a conference
// abstract, not itself indexed in PubMed); the sponsor press
// release/explainer use 'regulatory_announcement'/'other' and are never
// cited as directly_supports for a scientific claim.
// ---------------------------------------------------------------------
export const sources = {
  molMetab: {
    sourceType: 'pubmed_article',
    title:
      'Eloralintide (LY3841136), a novel amylin receptor agonist for the treatment of obesity: From discovery to clinical proof of concept',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41109426/',
    publisherOrAgency: 'Molecular Metabolism (Elsevier)',
    publicationDate: '2025-10-16',
    retrievedDate: SEARCH_DATE,
    identifiers: { doi: '10.1016/j.molmet.2025.102271', pmid: '41109426', pubchem_cid: null },
  },
  domMad: {
    sourceType: 'pubmed_article',
    title:
      'Eloralintide, a selective, long-acting amylin receptor agonist for treatment of obesity: Phase 1 proof of concept',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41559929/',
    publisherOrAgency: 'Diabetes, Obesity and Metabolism (Wiley)',
    publicationDate: '2026-01-20',
    retrievedDate: SEARCH_DATE,
    identifiers: { doi: '10.1111/dom.70439', pmid: '41559929' },
  },
  adaAbstract: {
    sourceType: 'other',
    title:
      '882-P: Eloralintide, a Selective, Long-Acting Amylin Receptor Agonist for Obesity—Phase 1 Proof of Concept',
    url: 'https://diabetesjournals.org/diabetes/article/74/Supplement_1/882-P/159628/',
    publisherOrAgency: 'American Diabetes Association 85th Scientific Sessions',
    publicationDate: '2025-06-20',
    retrievedDate: SEARCH_DATE,
    identifiers: { doi: '10.2337/db25-882-P' },
  },
  lancet: {
    sourceType: 'pubmed_article',
    title:
      'Eloralintide, a selective amylin receptor agonist for the treatment of obesity: a 48-week phase 2, multicentre, double-blind, randomised, placebo-controlled trial',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41207310/',
    publisherOrAgency: 'The Lancet (Elsevier)',
    publicationDate: '2025-11-06',
    retrievedDate: SEARCH_DATE,
    identifiers: { doi: '10.1016/S0140-6736(25)02155-5', pmid: '41207310' },
  },
  nct05295940: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study to Evaluate the Safety, Tolerability, and Pharmacokinetics of LY3841136 in Healthy and Overweight Participants',
    url: 'https://clinicaltrials.gov/study/NCT05295940',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2022-03-30',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT05295940' },
  },
  nct06230523: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of LY3841136 Compared With Placebo in Adult Participants With Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT06230523',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2024-02-05',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06230523' },
  },
  nct06916065: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) and Eloralintide With Tirzepatide in Participants With Overweight or Obesity',
    url: 'https://clinicaltrials.gov/study/NCT06916065',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2025-04-09',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06916065' },
  },
  nct06345066: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of LY3841136 in Overweight and Obese Participants (with Tirzepatide combination)',
    url: 'https://clinicaltrials.gov/study/NCT06345066',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2024-04-03',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06345066' },
  },
  nct06297616: {
    sourceType: 'clinicaltrials_gov',
    title: 'A Study of LY3841136 in Japanese Participants With Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT06297616',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2024-04-15',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06297616' },
  },
  nct06916091: {
    sourceType: 'clinicaltrials_gov',
    title: 'A Study of Eloralintide (LY3841136) in Chinese Participants With Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT06916091',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2025-04-21',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06916091' },
  },
  nct06603571: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study to Investigate Weight Management With LY3841136 and Tirzepatide (LY3298176), Alone or in Combination, in Adult Participants With Obesity or Overweight With Type 2 Diabetes',
    url: 'https://clinicaltrials.gov/study/NCT06603571',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2024-09-20',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06603571' },
  },
  nct07589608: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study to Investigate Weight Management With Macupatide and Eloralintide, Alone or in Combination, in Adult Participants With Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT07589608',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-05-15',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07589608' },
  },
  nct07215559: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Macupatide (LY3532226) and Eloralintide (LY3841136), Alone or in Combination, in Adults With Obesity or Overweight and With Type 2 Diabetes',
    url: 'https://clinicaltrials.gov/study/NCT07215559',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2025-10-16',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07215559' },
  },
  nct07765511: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Macupatide (LY3532226) in Participants With Obesity or Overweight Without Type 2 Diabetes',
    url: 'https://clinicaltrials.gov/study/NCT07765511',
    publisherOrAgency: 'Eli Lilly and Company',
    // Registry gives only month precision ("2026-10") for this
    // not-yet-recruiting study's start date — left null rather than
    // fabricating a day.
    publicationDate: null,
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07765511' },
  },
  nct07282600: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Obesity or Overweight, and Type 2 Diabetes',
    url: 'https://clinicaltrials.gov/study/NCT07282600',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2025-12-15',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07282600', cas_number: null },
  },
  nct07321886: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Obesity, or Overweight Without Type 2 Diabetes',
    url: 'https://clinicaltrials.gov/study/NCT07321886',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-02-06',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07321886' },
  },
  nct07392190: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Persistent Obesity Who Are Treated With a Weekly Incretin',
    url: 'https://clinicaltrials.gov/study/NCT07392190',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-02-10',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07392190' },
  },
  nct07353931: {
    sourceType: 'clinicaltrials_gov',
    title:
      'Efficacy and Safety of Eloralintide (LY3841136) in Participants With Osteoarthritis Knee Pain and Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT07353931',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-02-09',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07353931' },
  },
  nct07369011: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Obstructive Sleep Apnea and Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT07369011',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-02-10',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07369011' },
  },
  nct07701083: {
    sourceType: 'clinicaltrials_gov',
    title: 'A Study of Eloralintide (LY3841136) in Healthy Participants',
    url: 'https://clinicaltrials.gov/study/NCT07701083',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-07-20',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07701083' },
  },
  nct07738614: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Obesity or Overweight (gastric emptying/PK)',
    url: 'https://clinicaltrials.gov/study/NCT07738614',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-07-31',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07738614' },
  },
  nct07665879: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Overweight or Obesity (insulin sensitivity)',
    url: 'https://clinicaltrials.gov/study/NCT07665879',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-06-24',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07665879' },
  },
  nct07401862: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Different Levels of Liver Damage and in Participants With Healthy Livers',
    url: 'https://clinicaltrials.gov/study/NCT07401862',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-02-10',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07401862' },
  },
  nct07426380: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Study of Eloralintide (LY3841136) in Participants With Renal Impairment and in Participants With Normal Renal Function',
    url: 'https://clinicaltrials.gov/study/NCT07426380',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2026-02-24',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT07426380' },
  },
  nct06143956: {
    sourceType: 'clinicaltrials_gov',
    title:
      'A Master Protocol Study (LY900038) of Multiple Intervention-Specific-Appendices (ISAs) in Adult Participants With Obesity or Overweight',
    url: 'https://clinicaltrials.gov/study/NCT06143956',
    publisherOrAgency: 'Eli Lilly and Company',
    publicationDate: '2023-11-17',
    retrievedDate: SEARCH_DATE,
    identifiers: { nct_number: 'NCT06143956' },
  },
  lillyPressRelease: {
    sourceType: 'regulatory_announcement',
    title:
      "Lilly's selective amylin agonist, eloralintide, demonstrated meaningful weight loss and favorable tolerability in a Phase 2 study of adults with obesity or overweight",
    url: 'https://investor.lilly.com/news-releases/news-release-details/lillys-selective-amylin-agonist-eloralintide-demonstrated',
    publisherOrAgency: 'Eli Lilly and Company (investor relations release)',
    publicationDate: '2025-11-06',
    retrievedDate: SEARCH_DATE,
  },
};

// ---------------------------------------------------------------------
// Studies — three human studies with structured data extracted directly
// from primary sources (see manifest for exact quotes/verification).
// ---------------------------------------------------------------------
const studies = [
  {
    sourceKey: 'molMetab',
    studyDesign: 'rct_human',
    population: 'Healthy participants, mean BMI 27.5 kg/m2 (n=48)',
    sampleSize: 48,
    comparator: 'Placebo',
    intervention: 'Eloralintide, single ascending subcutaneous doses 0.04-12 mg',
    route: 'subcutaneous',
    publishedResearchDose: '0.04-12 mg, single dose',
    duration: '4 weeks follow-up (single dose)',
    primaryOutcomes: 'Safety and tolerability of single-ascending eloralintide doses',
    resultsSummary:
      'Week-4 mean % change in body weight: -2.5% (4 mg, p<0.01), -4.4% (12 mg, p<0.001), vs +0.6% placebo. 9 participants reported 16 AEs (15/16 mild); 2 participants reported 4 GI events including one moderate vomiting event; no discontinuations or SAEs; no clinically significant lab/ECG changes.',
    limitations:
      'Small sample size intrinsic to Phase 1; population not limited to individuals with overweight/obesity.',
    peerReviewStatus: 'peer_reviewed',
  },
  {
    sourceKey: 'domMad',
    studyDesign: 'rct_human',
    population:
      'Participants with obesity or overweight, mean age 44, 29% female, mean BMI 32.6 kg/m2 (n=100)',
    sampleSize: 100,
    comparator: 'Placebo',
    intervention:
      'Eloralintide, once-weekly subcutaneous, 5 multiple-ascending-dose cohorts (1.2, 3, 6, 12 mg — no within-participant dose escalation), without dose escalation',
    route: 'subcutaneous',
    publishedResearchDose: '1.2-12 mg once weekly, 12 weeks, no escalation',
    duration: '12 weeks',
    primaryOutcomes: 'Safety, tolerability, pharmacokinetics, pharmacodynamics',
    resultsSummary:
      'Week-12 LS-mean % body-weight change by cohort: -2.6% (1.2 mg), -8.9% (3 mg), -8.5% (6 mg), -11.3% (12 mg, two cohorts). Most common AEs: decreased appetite (19%), headache (12%), fatigue (11%), COVID-19 (11%). GI AEs infrequent: diarrhea (10%), nausea (8%), vomiting (4%). Most AEs mild. 1 SAE (6 mg cohort), assessed unrelated; no deaths. Half-life ~13.9-15.8 days; dose-proportional AUC/Cmax.',
    limitations:
      'Small sample size; 12-week duration insufficient to evaluate long-term weight-loss potential; exploratory appetite measures underpowered ("hypothesis generating" per authors).',
    peerReviewStatus: 'peer_reviewed',
  },
  {
    sourceKey: 'lancet',
    studyDesign: 'rct_human',
    population:
      'Adults with obesity (BMI >=30) or overweight (BMI >=27 with a weight-related comorbidity), without type 2 diabetes, mean age 49.0, mean bodyweight 109.1 kg, BMI 39.1 kg/m2, 78% female, 78% White (n=263, 46 US sites)',
    sampleSize: 263,
    comparator: 'Placebo',
    intervention:
      'Eloralintide once-weekly subcutaneous: 1 mg, 3 mg, 6 mg, 9 mg fixed doses, or 6-9 mg / 3-9 mg dose-escalation regimens',
    route: 'subcutaneous',
    publishedResearchDose: '1-9 mg once weekly (fixed or escalating), 48 weeks',
    duration: '48 weeks',
    primaryOutcomes: 'Percent change in bodyweight from baseline at week 48',
    resultsSummary:
      'Efficacy-estimand mean % bodyweight change at week 48: -9% (1 mg), -12% (3 mg), -18% (6 mg), -20% (9 mg), -20% (6-9 mg), -16% (3-9 mg), vs -0.4% placebo — all active arms met the primary endpoint. Most common AEs: nausea (dose-related, 11%-64% vs 14% placebo) and fatigue (dose-related, 0%-46% vs 12% placebo).',
    limitations:
      'Sponsor-employed co-authors on 7 of 10 bylines; independent replication not yet published; 48-week duration does not establish outcomes beyond that window; excluded participants with type 2 diabetes (studied separately in other ongoing trials).',
    funding_source: 'Eli Lilly and Company',
    peerReviewStatus: 'peer_reviewed',
  },
];

// ---------------------------------------------------------------------
// Claims — every content_section/evidence_quality/interpretation_status
// set independently per claim; preclinical/animal and human findings
// are never combined into one statement.
// ---------------------------------------------------------------------
const claims = [
  // --- summary ---
  {
    section: 'summary',
    statement:
      'Eloralintide (development code LY3841136) is an investigational, injectable peptide analogue of the hormone amylin, under development by Eli Lilly and Company as a potential once-weekly treatment for obesity. As of this review, it has not been approved by the FDA, EMA, or any other regulatory agency for any use.',
    evidenceQuality: 'high',
    qualityRationale:
      'Consistently and unambiguously stated across every primary source reviewed (peer-reviewed papers, ClinicalTrials.gov, sponsor releases); no approval status found anywhere.',
    interpretationStatus: 'established',
    displayOrder: 1,
    sourceKeys: [
      { key: 'molMetab', relationship: 'directly_supports' },
      { key: 'lancet', relationship: 'directly_supports' },
    ],
  },
  {
    section: 'summary',
    statement:
      'Eloralintide is being investigated across an extensive Phase 1-3 clinical program (25 registered studies identified as of 2026-08-25, most still recruiting or enrolling), including studies in participants with type 2 diabetes, osteoarthritis-related knee pain, and obstructive sleep apnea in addition to obesity/overweight alone, and in combination with the incretin-pathway therapy tirzepatide and with a separate Lilly investigational compound (macupatide/LY3532226).',
    evidenceQuality: 'high',
    qualityRationale:
      'Directly counted from ClinicalTrials.gov registry search performed this review.',
    interpretationStatus: 'established',
    displayOrder: 2,
    sourceKeys: [
      { key: 'nct07282600', relationship: 'directly_supports' },
      { key: 'nct06603571', relationship: 'directly_supports' },
      { key: 'nct07589608', relationship: 'directly_supports' },
    ],
  },
  // --- mechanism ---
  {
    section: 'mechanism',
    statement:
      'In laboratory (in vitro) receptor assays using cell lines selectively expressing human amylin 1 receptor (AMY1R), amylin 3 receptor (AMY3R), or calcitonin receptor (CTR), eloralintide activated human AMY1R roughly 12-fold more potently than human CTR (EC50 23.9 pM vs. 291.0 pM) and roughly 11-fold more potently than human AMY3R (EC50 253.8 pM) — evidence of preferential AMY1R selectivity rather than broad amylin/calcitonin receptor activation.',
    evidenceQuality: 'moderate',
    qualityRationale:
      'In vitro pharmacology data from a single sponsor-authored peer-reviewed paper; establishes receptor-binding selectivity, not clinical mechanism of action in humans.',
    interpretationStatus: 'supported',
    displayOrder: 1,
    sourceKeys: [{ key: 'molMetab', relationship: 'directly_supports' }],
  },
  {
    section: 'mechanism',
    statement:
      'Researchers designed eloralintide as a modified analogue of the hormone amylin, engineered to preferentially engage the AMY1R signaling pathway believed to be involved in satiety and food-intake regulation, rather than activating amylin and calcitonin receptors non-selectively as some earlier amylin-based research compounds do.',
    evidenceQuality: 'moderate',
    qualityRationale:
      "Mechanistic framing directly stated by the compound's discovery/characterization paper.",
    interpretationStatus: 'supported',
    displayOrder: 2,
    sourceKeys: [{ key: 'molMetab', relationship: 'directly_supports' }],
  },
  // --- animal / preclinical (kept strictly separate from human claims) ---
  {
    section: 'mechanism',
    statement:
      'In diet-induced obese rats, repeated eloralintide dosing produced dose-dependent reductions in food intake and body weight; across the doses studied (10-100 nmol/kg), fat mass accounted for an estimated 68%-85% of total weight lost. This is an animal finding and has not been established to occur to the same degree, or via the same proportional fat/lean split, in humans.',
    evidenceQuality: 'moderate',
    qualityRationale:
      'Single sponsor-authored preclinical rodent study; animal data does not establish human effect size.',
    interpretationStatus: 'supported',
    displayOrder: 3,
    sourceKeys: [{ key: 'molMetab', relationship: 'directly_supports' }],
  },
  {
    section: 'mechanism',
    statement:
      'In a head-to-head rat study, eloralintide produced comparable fat-mass loss to cagrilintide (a non-selective amylin/calcitonin receptor agonist studied on this site as its own separate compound) while causing significantly less loss of lean body mass (p=0.0101). This is an animal comparison; it has not been demonstrated in any published human trial comparing the two compounds directly.',
    evidenceQuality: 'moderate',
    qualityRationale: 'Single sponsor-authored preclinical rodent comparison study.',
    interpretationStatus: 'preliminary',
    displayOrder: 4,
    sourceKeys: [{ key: 'molMetab', relationship: 'directly_supports' }],
  },
  {
    section: 'mechanism',
    statement:
      'In lean rats, eloralintide produced significantly less conditioned taste avoidance — a rodent behavioral measure sometimes used as an indirect proxy for nausea-like aversion — than cagrilintide (eloralintide ED50 8.9 nmol/kg vs. cagrilintide ED50 4.2 nmol/kg). This is an animal behavioral measure only; it does not directly establish human nausea or gastrointestinal tolerability, which was separately assessed in the human trials described below.',
    evidenceQuality: 'low',
    qualityRationale:
      'Conditioned taste avoidance is an indirect rodent behavioral proxy, not a direct measure of human GI tolerability; single preclinical study.',
    interpretationStatus: 'preliminary',
    displayOrder: 5,
    sourceKeys: [{ key: 'molMetab', relationship: 'directly_supports' }],
  },
  // --- pharmacokinetics ---
  {
    section: 'pharmacokinetics',
    statement:
      'Across Phase 1 human trials, eloralintide displayed a long terminal half-life (approximately 13-15.8 days) and dose-proportional exposure, consistent with the once-weekly subcutaneous dosing schedule used in every eloralintide trial identified.',
    evidenceQuality: 'high',
    qualityRationale:
      'Consistent finding across two independent Phase 1 human cohorts (single- and multiple-ascending-dose).',
    interpretationStatus: 'supported',
    displayOrder: 1,
    sourceKeys: [
      { key: 'molMetab', relationship: 'directly_supports' },
      { key: 'domMad', relationship: 'directly_supports' },
    ],
  },
  // --- human trial findings: Phase 1 SAD ---
  {
    section: 'summary',
    statement:
      'In a Phase 1, randomized, placebo-controlled, single-ascending-dose human trial in 48 healthy participants (NCT05295940, Part A), single doses of eloralintide 4 mg and 12 mg produced mean body-weight reductions of 2.5% (p<0.01) and 4.4% (p<0.001) respectively by week 4, compared with a 0.6% increase with placebo.',
    evidenceQuality: 'high',
    qualityRationale:
      'Randomized, placebo-controlled human trial with peer-reviewed reported p-values.',
    interpretationStatus: 'supported',
    displayOrder: 3,
    sourceKeys: [
      { key: 'molMetab', relationship: 'directly_supports' },
      { key: 'nct05295940', relationship: 'provides_context' },
    ],
  },
  {
    section: 'adverse_effects',
    statement:
      'In that same Phase 1 single-dose human trial, 9 of 48 participants receiving eloralintide reported 16 adverse events (15 of 16 mild); 2 participants reported 4 gastrointestinal events, including one moderate vomiting event; there were no treatment discontinuations, serious adverse events, or clinically significant laboratory/ECG changes.',
    evidenceQuality: 'high',
    qualityRationale:
      'Directly reported safety data from a randomized, placebo-controlled human trial.',
    interpretationStatus: 'supported',
    displayOrder: 1,
    sourceKeys: [{ key: 'molMetab', relationship: 'directly_supports' }],
  },
  // --- human trial findings: Phase 1 MAD ---
  {
    section: 'summary',
    statement:
      'In a 12-week Phase 1, randomized, placebo-controlled, multiple-ascending-dose human trial in 100 participants with obesity or overweight (NCT05295940, Part B), once-weekly eloralintide without dose escalation produced least-squares-mean body-weight reductions ranging from 2.6% (1.2 mg) to 11.3% (12 mg) by week 12.',
    evidenceQuality: 'high',
    qualityRationale:
      'Randomized, placebo-controlled human trial; consistent across the full peer-reviewed paper and its earlier conference abstract.',
    interpretationStatus: 'supported',
    displayOrder: 4,
    sourceKeys: [
      { key: 'domMad', relationship: 'directly_supports' },
      { key: 'adaAbstract', relationship: 'directly_supports' },
      { key: 'nct05295940', relationship: 'provides_context' },
    ],
  },
  {
    section: 'adverse_effects',
    statement:
      'In that same 12-week Phase 1 human trial, the most common adverse events with eloralintide were decreased appetite (19% of participants), headache (12%), fatigue (11%), and COVID-19 (11%); gastrointestinal adverse events were comparatively infrequent — diarrhea (10%), nausea (8%), vomiting (4%) — and most adverse events were mild. One serious adverse event occurred (6 mg cohort), assessed by investigators as unrelated to eloralintide; there were no deaths.',
    evidenceQuality: 'high',
    qualityRationale:
      'Directly reported safety data, cross-confirmed between the full paper and its earlier conference abstract.',
    interpretationStatus: 'supported',
    displayOrder: 2,
    sourceKeys: [
      { key: 'domMad', relationship: 'directly_supports' },
      { key: 'adaAbstract', relationship: 'directly_supports' },
    ],
  },
  // --- human trial findings: Phase 2 ---
  {
    section: 'summary',
    statement:
      "In a 48-week, randomized, double-blind, placebo-controlled Phase 2 trial in 263 adults with obesity or overweight and at least one weight-related comorbidity (without type 2 diabetes) at 46 US research centers (NCT06230523), once-weekly eloralintide produced mean body-weight reductions (efficacy estimand) ranging from approximately 9% (1 mg) to 20% (9 mg, and the 6-9 mg dose-escalation arm) at week 48, compared with a 0.4% reduction with placebo; every active-dose arm met the trial's pre-specified primary endpoint.",
    evidenceQuality: 'high',
    qualityRationale:
      "Large randomized, double-blind, placebo-controlled Phase 2 trial published in a top-tier peer-reviewed journal (The Lancet) with independent academic first authors, cross-corroborated by the sponsor's own structured results posted directly to ClinicalTrials.gov.",
    interpretationStatus: 'supported',
    displayOrder: 5,
    sourceKeys: [
      { key: 'lancet', relationship: 'directly_supports' },
      { key: 'nct06230523', relationship: 'directly_supports' },
    ],
  },
  {
    section: 'adverse_effects',
    statement:
      "In that same Phase 2 trial, nausea was the most common adverse event and was clearly dose-related, ranging from 11% (1 mg) to 64% (6 mg) of participants, compared with 14% with placebo; fatigue was also common and dose-related, ranging from 0% (1 mg) to 46% (6-9 mg dose-escalation arm), compared with 12% with placebo. The trial's own directly-posted ClinicalTrials.gov results independently corroborate these figures at the per-arm level.",
    evidenceQuality: 'high',
    qualityRationale:
      "Adverse-event rates independently cross-validated between the peer-reviewed paper and the sponsor's own structured registry results, which matched closely.",
    interpretationStatus: 'supported',
    displayOrder: 3,
    sourceKeys: [
      { key: 'lancet', relationship: 'directly_supports' },
      { key: 'nct06230523', relationship: 'directly_supports' },
    ],
  },
  {
    section: 'summary',
    statement:
      "The Lancet trial's efficacy-estimand percentages (e.g. -9% at 1 mg) and the raw ClinicalTrials.gov posted-results percentages for the same arms (e.g. -9.4% at 1 mg) differ slightly, most likely reflecting different statistical estimand methodology (e.g. an efficacy estimand vs. a treatment-policy/hypothetical estimand) rather than a data discrepancy; both figures are preserved here from their own source rather than reconciled into a single number.",
    evidenceQuality: 'moderate',
    qualityRationale:
      "Editorial transparency note about a real numeric difference between two directly-compared primary sources reporting the same trial; the specific estimand-methodology explanation is a reasonable inference, not independently confirmed against the trial's statistical analysis plan.",
    interpretationStatus: 'unknown',
    displayOrder: 6,
    sourceKeys: [
      { key: 'lancet', relationship: 'provides_context' },
      { key: 'nct06230523', relationship: 'provides_context' },
    ],
  },
  // --- combination-use research rationale ---
  {
    section: 'summary',
    statement:
      'Eloralintide is being studied in combination with tirzepatide (a dual GIP/GLP-1 receptor agonist) in multiple completed and ongoing Phase 1-2 trials, and separately in combination with macupatide (LY3532226, a distinct Lilly investigational compound not otherwise profiled on this site), reflecting research interest in whether pairing a selective amylin-receptor agonist with incretin-pathway therapies could complement their effects on food intake and body weight. As of this review, no combination-trial efficacy or safety results have been publicly posted or published for any of these studies.',
    evidenceQuality: 'not_assessed',
    qualityRationale: 'Describes trial rationale/design only; no results exist yet to grade.',
    interpretationStatus: 'insufficient',
    displayOrder: 7,
    sourceKeys: [
      { key: 'nct06916065', relationship: 'directly_supports' },
      { key: 'nct06345066', relationship: 'directly_supports' },
      { key: 'nct06603571', relationship: 'directly_supports' },
      { key: 'nct07589608', relationship: 'directly_supports' },
      { key: 'nct07215559', relationship: 'directly_supports' },
    ],
  },
  // --- unknowns / limitations ---
  {
    section: 'summary',
    statement:
      'As of this review (2026-08-25), no Phase 3 eloralintide trial has completed or reported results. Five registered Phase 3 studies are recruiting or enrolling, covering obesity/overweight with and without type 2 diabetes, participants already treated with a weekly incretin therapy, osteoarthritis-related knee pain, and obstructive sleep apnea.',
    evidenceQuality: 'high',
    qualityRationale:
      'Directly confirmed via ClinicalTrials.gov registry status check performed this review.',
    interpretationStatus: 'established',
    displayOrder: 8,
    sourceKeys: [
      { key: 'nct07282600', relationship: 'directly_supports' },
      { key: 'nct07321886', relationship: 'directly_supports' },
      { key: 'nct07392190', relationship: 'directly_supports' },
      { key: 'nct07353931', relationship: 'directly_supports' },
      { key: 'nct07369011', relationship: 'directly_supports' },
    ],
  },
  {
    section: 'safety',
    statement:
      'Long-term safety and efficacy beyond 48 weeks, effects specifically in people with type 2 diabetes, cardiovascular outcomes, and real-world effectiveness have not yet been established in any published human trial of eloralintide.',
    evidenceQuality: 'not_assessed',
    qualityRationale:
      'Absence-of-evidence statement, not a scientific claim requiring its own quality grade.',
    interpretationStatus: 'insufficient',
    displayOrder: 2,
  },
  {
    section: 'safety',
    statement:
      "Every published human trial of eloralintide identified to date was funded by, and substantially authored by employees and shareholders of, Eli Lilly and Company (the compound's manufacturer); the Lancet Phase 2 publication's first authors are independent academic/clinical investigators, but independent (non-sponsor) replication of any eloralintide finding has not yet been published.",
    evidenceQuality: 'high',
    qualityRationale:
      "Directly stated in each paper's own conflict-of-interest/funding disclosure.",
    interpretationStatus: 'established',
    displayOrder: 3,
    sourceKeys: [
      { key: 'molMetab', relationship: 'directly_supports' },
      { key: 'domMad', relationship: 'directly_supports' },
      { key: 'lancet', relationship: 'directly_supports' },
    ],
  },
  // --- faq ---
  {
    section: 'faq',
    statement:
      'Q: Is eloralintide the same thing as cagrilintide, semaglutide, or tirzepatide? A: No. Eloralintide (LY3841136) is a distinct investigational molecule, chemically and mechanistically different from all three, though it is being studied in combination with tirzepatide in several trials and is mechanistically related to cagrilintide (both are amylin-receptor-targeting compounds, but eloralintide is engineered for AMY1R selectivity while cagrilintide is a non-selective amylin/calcitonin receptor agonist — see the Mechanism section above).',
    evidenceQuality: 'moderate',
    qualityRationale:
      "Direct compound-identity clarification drawn from the discovery paper's own comparative framing.",
    interpretationStatus: 'supported',
    displayOrder: 3,
  },
];

const regulatoryRecords = [
  {
    agency: 'U.S. Food and Drug Administration (FDA)',
    jurisdiction: 'United States',
    formulation: 'Eloralintide (LY3841136), subcutaneous injection, once weekly',
    indication: 'Obesity / chronic weight management (investigational)',
    regulatoryStatus: 'investigational',
    effectiveDate: null,
    statusChangeDate: null,
    lastVerifiedDate: SEARCH_DATE,
    notes:
      'No FDA approval, New Drug Application decision, or special designation (e.g. breakthrough therapy, fast track) was found for eloralintide in this review. It remains an investigational compound in active Phase 1-3 clinical development; a Phase 3 program is ongoing across obesity/overweight (with and without type 2 diabetes), incretin-experienced patients, osteoarthritis-related knee pain, and obstructive sleep apnea, with no completion date or filing timeline confirmed by any primary source as of 2026-08-25.',
    sourceKey: 'lancet',
  },
];

async function main() {
  const client = getServiceClient();
  const result = await importCompound(client, {
    slug: 'eloralintide',
    name: 'Eloralintide',
    entityKind: 'peptide',
    identityConfidence: 'verified',
    category: 'Weight Management',
    overviewWhatItIs:
      'Eloralintide is a synthetic peptide — an investigational analogue of the human hormone amylin — engineered to selectively activate the amylin 1 receptor (AMY1R), sold nowhere and studied only as a research/investigational compound (development code LY3841136).',
    overviewWhyPeopleUseIt:
      'It is studied in the context of obesity and weight management. Researchers are investigating whether selective AMY1R activation influences appetite, satiety, food intake, body weight, body composition, and metabolic outcomes, alone and in combination with incretin-pathway therapies (tirzepatide, and separately macupatide) — see the Mechanism and Regulatory sections below for what is and is not established.',
    overviewResearchSummary:
      'Human research: 3 peer-reviewed publications plus 1 conference abstract, covering a Phase 1 single-ascending-dose trial, a Phase 1 multiple-ascending-dose trial, and a 48-week Phase 2 randomized controlled trial (817 total human trial participants across the published/reported studies). Animal/preclinical research: dose-ranging rat studies and rat/monkey pharmacokinetic studies, all from one sponsor-authored discovery paper. Regulatory status: investigational only — no approval in any jurisdiction (see Regulatory Status section). 21 additional registered clinical trials (Phase 1-3) are completed-without-posted-results, active, or recruiting, with no results published for any of them yet.',
    overviewBottomLine:
      'Early-to-moderate evidence base: a completed 48-week randomized placebo-controlled Phase 2 trial (peer-reviewed in The Lancet) plus two completed Phase 1 trials show consistent, dose-dependent body-weight reduction in the populations studied so far, but the entire evidence base is sponsor-funded, no Phase 3 trial has reported results, and the drug remains unapproved and investigational. This should not be read as evidence of long-term safety or effectiveness, or of any outcome in populations not yet studied (e.g., people with type 2 diabetes at Phase 3 scale, or combination use with tirzepatide/macupatide).',
    overviewEvidenceReviewedDate: SEARCH_DATE,
    administrationContext:
      'Every human trial identified administered eloralintide by once-weekly subcutaneous injection, consistent with its long (~13-16 day) half-life. It remains investigational (not FDA-approved) for any indication; this page describes only what has been studied in registered clinical trials and does not describe or endorse any administration protocol.',
    searchDate: SEARCH_DATE,
    databasesSearched: DATABASES_SEARCHED,
    searchTerms: SEARCH_TERMS,
    batch: 'eloralintide-2026-08-25',
    aliases: [
      {
        alias: 'LY3841136',
        type: 'development_code',
        note: 'Eli Lilly\'s internal development code; used interchangeably with "Eloralintide" in every primary source reviewed.',
      },
      {
        alias: 'LY-3841136',
        type: 'spelling_variant',
        note: 'Hyphenated variant of the development code seen in some secondary sources.',
      },
      {
        alias: 'Elora',
        type: 'abbreviation',
        note: "Informal shorthand used by Lilly's own study authors in the 2025 ADA conference abstract (db25-882-P).",
      },
    ],
    sources,
    studies,
    claims: [...claims, ...standardBoilerplateClaims('Eloralintide')],
    regulatoryRecords,
  });
  console.log('\nResult:', JSON.stringify(result));
}

// Only auto-run when executed directly (`node import-eloralintide.mjs`)
// — scripts/migration/verify-eloralintide-research.mjs imports this
// module's `sources` export for verification and must not trigger a
// second live import as a side effect of that import.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('FATAL:', err);
    process.exit(1);
  });
}
