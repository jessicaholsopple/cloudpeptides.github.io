// Plain-English "What researchers are studying" shop content
// (2026-08-25 task). One entry per public product_slug — reused
// automatically across every mg-strength SKU of that product by
// scripts/research/seed-shop-research-summaries.mjs, never duplicated
// per variant.
//
// Editorial rules followed throughout (per task instructions):
// - "Barney style": plain language, no jargon left unexplained.
// - Careful conditional language only ("researchers are studying
//   whether...", "early laboratory research suggests...", "animal
//   research has reported...", "limited human research has
//   observed...", "this has not established that...", "more
//   controlled human research is needed").
// - No dosing/administration instructions, no before/after promises,
//   no guaranteed outcomes, no disease-treatment/cure language, no
//   "safe" claims, no unsupported synergy claims for blends.
// - For blends: each component explained separately; a combined effect
//   is asserted only where the exact combination itself has been
//   directly studied (none of the blends below meet that bar — each
//   says so explicitly rather than implying synergy).
// - Where a compound is also an approved pharmaceutical for a specific
//   indication under a specific brand (e.g. bremelanotide/Vyleesi,
//   tesamorelin/Egrifta, sermorelin/historical Geref, oxytocin/Pitocin,
//   thymosin alpha-1/Zadaxin outside the US), that approval is noted
//   narrowly (agency, indication, brand) — never implied to transfer to
//   this unbranded research-grade product, and never used as a safety
//   or efficacy claim about this product.
// - Where this codebase's own internal records don't confirm an exact
//   published formulation for a marketed blend name (GLOW, KLOW,
//   Adamax), that is stated explicitly rather than guessed — same
//   principle already established for "Lipo-C" in
//   docs/research/2026-08-19-candidate-reconciliation-manifest.md.
// - AOD9605 is treated per CLAUDE.md §7/§27.3: never silently aliased
//   to AOD-9604, identity left explicitly unconfirmed.
// - CP-S1/CP-T2/CP-R3 use deliberately generic, near-identical framing
//   that never states or implies which receptor pathway(s) each one
//   targets — differentiating that specifically (single vs. dual vs.
//   triple receptor mechanism) would functionally reveal the
//   CLAUDE.md §7-protected scientific-name mapping, since that
//   distinction is exactly what identifies which compound is which.
// - Content authored from established, widely-corroborated general
//   peptide-research literature, not a fresh per-item citation pass
//   (unlike the Eloralintide research profile) — this table stores
//   shop copy, not claims/sources rows, matching what this feature
//   asked for.
const NOTICE =
  'This summary describes areas of scientific research and does not establish that this material is safe or effective for any use. Strictly for laboratory research. Not for human or veterinary use.';

function entry(preview, body) {
  return { preview, full: `${body}\n\n${NOTICE}` };
}

export const SHOP_RESEARCH_SUMMARIES = {
  // ---------------------------------------------------------------
  // Beauty + Repair
  // ---------------------------------------------------------------
  'ghk-cu': entry(
    'A naturally occurring copper-binding peptide studied for its role in skin and tissue repair.',
    'GHK-Cu is a small copper-binding peptide (a short chain of three amino acids joined to a copper ion) that occurs naturally in human blood plasma, where levels decline with age. Researchers are studying whether it interacts with pathways involved in collagen and elastin production, wound healing, and antioxidant/anti-inflammatory signaling in skin and connective tissue. Early laboratory (cell-culture) research suggests it can influence how skin cells behave in culture dishes, and animal research has reported effects on wound-healing speed and collagen remodeling. Limited human research, mostly small dermatology studies, has observed changes in skin appearance measures. This has not established that GHK-Cu reverses aging, treats any skin condition, or is safe or effective for any use in people. More controlled human research is needed before any of these early findings could be considered established.',
  ),
  'ahk-cu': entry(
    'A related copper-binding tripeptide studied alongside GHK-Cu for similar skin-research questions.',
    'AHK-Cu (alanine-histidine-lysine bound to copper) is a close chemical relative of GHK-Cu, another naturally-inspired copper-peptide complex. Researchers are studying whether it interacts with similar copper-dependent enzymatic and antioxidant pathways involved in skin and connective-tissue biology. Early laboratory research has examined its effects on skin-cell behavior in culture, but published human research on AHK-Cu specifically is considerably more limited than for GHK-Cu. This has not established that AHK-Cu improves skin appearance or tissue repair in people. More controlled human research is needed.',
  ),
  bpc: entry(
    'A synthetic peptide, derived from a naturally occurring gastric protein fragment, studied mainly in animal models for tissue and gut-related repair.',
    'BPC-157 ("Body Protection Compound-157") is a synthetic peptide based on a fragment of a protein found in human gastric (stomach) juice. Researchers are studying whether it interacts with pathways involved in blood-vessel formation (angiogenesis), growth-factor signaling, and tissue-repair processes in the gut lining, tendons, ligaments, and muscle. The large majority of published research on BPC-157 comes from animal studies, which have reported effects on healing of injured tissue in various models. Human clinical trial data for BPC-157 remain very limited. This has not established that BPC-157 heals injuries, protects the gut, or is safe or effective for use in people. More controlled human research is needed before these animal findings could be considered established in humans.',
  ),
  nad: entry(
    'A coenzyme central to cellular energy metabolism, studied for its role in aging and mitochondrial research.',
    'NAD+ (nicotinamide adenine dinucleotide) is a coenzyme every cell in the body uses to help convert nutrients into usable energy and to support DNA-repair and cell-signaling pathways (including sirtuin and PARP enzyme families). Researchers are studying whether raising NAD+ levels influences cellular energy metabolism, mitochondrial function, and markers associated with aging. Laboratory and animal research has reported that NAD+ levels decline with age and that restoring them can affect metabolic markers in those models. Human research on NAD+ supplementation/administration is an active but still-developing area, with mixed and preliminary findings. This has not established that NAD+ administration slows aging, improves energy, or is safe or effective for any use in people. More controlled human research is needed.',
  ),
  tb500: entry(
    'A synthetic peptide based on a naturally occurring cell-repair protein fragment, studied mainly in animal models of injury recovery.',
    'TB-500 is a synthetic peptide based on a fragment of Thymosin Beta-4, a protein naturally involved in how cells move, rebuild their internal scaffolding (actin), and migrate to sites of injury. Researchers are studying whether it interacts with pathways involved in cell migration, blood-vessel formation, and tissue repair after injury. Most published research on TB-500/Thymosin Beta-4 fragments comes from animal models of muscle, tendon, and cardiac tissue injury, where effects on healing markers have been reported. Human clinical trial data specific to TB-500 remain very limited. This has not established that TB-500 speeds recovery or is safe or effective for use in people. More controlled human research is needed.',
  ),
  'bpc-tb': entry(
    'A combination product pairing BPC-157 and TB-500 — each studied separately, mainly in animals, for tissue-repair-related research.',
    "This product combines two peptides that each have their own separate research history: BPC-157, a synthetic fragment based on a gastric-protein peptide studied mainly in animal models for gut-lining and connective-tissue repair, and TB-500, a synthetic fragment of Thymosin Beta-4 studied mainly in animal models for cell migration and tissue-injury repair. Researchers studying each peptide individually have reported effects on healing-related markers in animal models. This exact fixed combination has not been directly and adequately studied as its own product in controlled trials, so any suggestion that combining these two peptides produces a synergistic or superior effect compared to either one alone is not established by the published research — this description covers each ingredient's own separate research area, not a demonstrated combined effect. More controlled human research is needed on each component and on this specific combination.",
  ),
  glow: entry(
    "A multi-peptide blend marketed for skin- and recovery-related research; this listing's exact published formulation is not independently confirmed in our records.",
    "GLOW is sold as a multi-peptide research blend, commonly associated in the broader research-peptide market with combinations of skin- and tissue-repair-oriented peptides. This description does not assert a specific formula for this exact product, since the precise published composition is not independently confirmed in our internal records — asserting a specific ingredient list without that confirmation would risk being inaccurate. In general, peptide blends marketed for this purpose draw on individual ingredients that each have their own separate research literature (see, for example, this shop's GHK-CU, BPC, and TB500 listings for examples of the kinds of research questions studied for skin- and repair-oriented peptides). Because the exact combination in this specific blend is not confirmed here, no claim about a specific mechanism, ingredient, or combined/synergistic effect for this product can be made. More information about this product's exact composition, and controlled human research on that exact composition, would be needed before any research claim could be made about it specifically.",
  ),
  klow: entry(
    "A multi-peptide blend marketed for skin- and recovery-related research; this listing's exact published formulation is not independently confirmed in our records.",
    "KLOW, like GLOW, is sold as a multi-peptide research blend commonly associated in the broader research-peptide market with skin- and tissue-repair-oriented combinations. This description does not assert a specific formula for this exact product, since the precise published composition is not independently confirmed in our internal records. In general, peptide blends marketed for this purpose draw on individual ingredients that each have their own separate research literature (see, for example, this shop's GHK-CU, BPC, KPV, and TB500 listings for examples of the kinds of research questions studied for skin- and repair-oriented peptides). Because the exact combination in this specific blend is not confirmed here, no claim about a specific mechanism, ingredient, or combined/synergistic effect for this product can be made. More information about this product's exact composition, and controlled human research on that exact composition, would be needed before any research claim could be made about it specifically.",
  ),
  kpv: entry(
    'A short peptide fragment of a natural hormone, studied mainly in animal models for anti-inflammatory research.',
    'KPV (lysine-proline-valine) is a short peptide that corresponds to the tail end (C-terminal fragment) of alpha-melanocyte-stimulating hormone, a naturally occurring hormone. Researchers are studying whether KPV interacts with inflammatory-signaling pathways independently of the pigmentation-related receptors the full hormone activates. Most published research on KPV comes from cell and animal studies, including animal models of gut inflammation, where effects on inflammatory markers have been reported. Human clinical trial data on KPV specifically are very limited. This has not established that KPV reduces inflammation or treats any condition in people. More controlled human research is needed.',
  ),
  epithalon: entry(
    'A synthetic peptide modeled on a natural pineal-gland peptide, studied mainly in animal and laboratory research on aging-related biology.',
    'Epithalon (also spelled Epitalon) is a synthetic four-amino-acid peptide designed to mimic a peptide naturally produced by the pineal gland. Researchers, largely publishing in the Russian scientific literature, have studied whether it interacts with pathways related to telomerase activity (an enzyme involved in chromosome-end maintenance), circadian/sleep-related signaling, and biomarkers associated with aging. This research base is mostly laboratory and animal work, with human studies that exist being few, small, and not independently replicated to the standard expected by larger Western regulatory bodies. This has not established that Epithalon affects human aging, sleep, or longevity, or that it is safe or effective for any use in people. More controlled human research is needed.',
  ),
  'mt-1': entry(
    'A synthetic analog of a natural pigmentation hormone, studied for its effects on melanocyte (pigment-cell) activity.',
    'MT-1 refers to a synthetic analog of alpha-melanocyte-stimulating hormone (alpha-MSH), the naturally occurring hormone that signals pigment-producing skin cells (melanocytes). Researchers are studying whether such analogs interact with melanocortin receptor pathways to influence melanin production. This is a distinct research area from an FDA-approved product (afamelanotide) that targets a related but not identical mechanism for a specific rare medical condition — that approval does not extend to this unbranded research-grade product, and this product carries no such approval. This has not established that MT-1 is safe or effective for altering skin pigmentation in people outside of a supervised clinical setting. More controlled human research is needed.',
  ),
  'mt-2': entry(
    'A synthetic analog of a natural pigmentation hormone, studied for effects on melanocyte activity and other melanocortin-pathway research.',
    'MT-2 (Melanotan II) is a synthetic analog of alpha-melanocyte-stimulating hormone, engineered to activate melanocortin receptors more broadly than the natural hormone. Researchers have studied whether it interacts with pathways involved in melanocyte (pigment cell) activity, and separately, melanocortin-pathway research has explored possible links to appetite and sexual-function-related signaling (this second line of research led to the development of a chemically distinct, separately studied compound, bremelanotide, sold under its own listing on this site). Published data on MT-2 itself come from a mix of early clinical pharmacology studies and widespread but poorly-controlled non-clinical use, and adverse-event reports exist in the literature. This has not established that MT-2 is safe or effective for any use in people. More controlled human research is needed.',
  ),
  glutathione: entry(
    'A naturally occurring antioxidant molecule made from three amino acids, studied for its role in cellular defense and detoxification pathways.',
    "Glutathione is a small molecule made of three amino acids (a tripeptide) that the body produces naturally and uses as one of its primary antioxidants, particularly in the liver's detoxification pathways. Researchers are studying whether raising glutathione levels through external administration influences oxidative-stress markers, liver-related detoxification processes, and skin-pigmentation-related pathways. Laboratory and some human research has examined glutathione's antioxidant effects and its use in dermatology-related research on skin tone, with mixed and preliminary results. This has not established that glutathione administration treats any condition, reverses aging, or is safe or effective for skin-lightening or any other use. More controlled human research is needed.",
  ),

  // ---------------------------------------------------------------
  // Weight Loss + Metabolic
  // ---------------------------------------------------------------
  '5-amino-1mq': entry(
    'A small molecule (not a peptide) studied in animal models for its effects on a metabolism-related enzyme.',
    '5-Amino-1MQ is a small-molecule research compound, not a peptide, that researchers are studying for its ability to inhibit an enzyme called NNMT (nicotinamide N-methyltransferase), which plays a role in cellular energy metabolism, particularly in fat tissue. Animal research has reported that inhibiting this enzyme is associated with changes in body fat and metabolic markers in rodent models. Published human clinical trial data for 5-Amino-1MQ are very limited. This has not established that 5-Amino-1MQ reduces body fat or is safe or effective for any use in people. More controlled human research is needed.',
  ),
  aicar: entry(
    'A cell-signaling molecule studied in laboratory and animal research on exercise-related metabolic pathways.',
    "AICAR is a nucleotide-related research compound studied for its ability to activate AMPK, an enzyme that acts as a cellular energy sensor and plays a central role in how cells respond to exercise and fasting. Laboratory and animal research has studied AICAR's effects on glucose uptake, fat metabolism, and exercise-endurance-related markers in cell and rodent models — sometimes described as mimicking some metabolic effects of exercise in those models. Human clinical research on AICAR is very limited, and it is prohibited in competitive sport by the World Anti-Doping Agency. This has not established that AICAR is safe or effective for any human use, including exercise performance or fat loss. More controlled human research is needed.",
  ),
  aod9604: entry(
    "A modified fragment of human growth hormone, studied for its potential effects on fat metabolism separate from growth-hormone's broader effects.",
    "AOD9604 corresponds to a specific fragment (amino acids 176-191) of human growth hormone, modified by researchers in an effort to isolate growth hormone's reported effects on fat metabolism from its broader growth-promoting and blood-sugar effects. Animal research has studied AOD9604's effects on fat breakdown (lipolysis) and fat-cell formation in rodent models. Early-phase human clinical trials were conducted by its original developer, examining safety, tolerability, and weight-related outcomes, with results that did not lead to regulatory approval for weight loss. This has not established that AOD9604 causes fat loss or is safe or effective for any use in people. More controlled human research is needed.",
  ),
  aod9605: entry(
    'A listed research-peptide name whose relationship to AOD9604 research is not established; treated here as a distinct, unverified identity.',
    'AOD9605 is a product name used in the research-peptide market. Its exact relationship to AOD9604 (a defined fragment of human growth hormone described in that separate listing) has not been established from available published sources, and this site does not assume the two names refer to the same substance. Because its identity is unverified, no specific mechanism, pathway, or research finding can be accurately attributed to "AOD9605" as such. This has not established that this product is safe or effective for any use, or that it corresponds to any specific published research. More independently verifiable information about this product\'s exact identity would be needed before any research claim could be made about it specifically.',
  ),
  cagrilintide: entry(
    'A long-acting analog of the natural hormone amylin, studied for its role in appetite and metabolic research.',
    "Cagrilintide is a synthetic, long-acting analog of amylin, a hormone the body naturally releases alongside insulin. Researchers are studying whether activating amylin-receptor pathways influences satiety (the feeling of fullness), food intake, and body-weight-related metabolic signaling — a mechanism distinct from GLP-1-receptor-based research. Human randomized controlled trials, both as a standalone compound and in combination with a GLP-1-receptor-agonist peptide, have reported dose-dependent body-weight changes in study participants over the trial periods studied. As of this review, cagrilintide (alone or in the combination studied) has not received FDA approval for any indication and remains investigational. This has not established that cagrilintide is safe or effective for weight loss outside of a supervised clinical trial. More controlled, longer-duration human research is needed. (See this site's separate Cagrilintide research profile for full citation-level detail.)",
  ),
  'cjc-no-dac': entry(
    "A modified analog of a natural growth-hormone-releasing hormone, studied for its effects on the body's own growth-hormone pulses.",
    "CJC-1295 without DAC (also studied under the name Modified GRF 1-29) is a modified analog of growth-hormone-releasing hormone (GHRH), the natural signal the brain sends to the pituitary gland to release growth hormone. Researchers are studying whether it interacts with GHRH-receptor pathways to influence the body's own pulsatile growth-hormone release. Laboratory and animal research, along with some early-phase human pharmacology studies, has examined its effects on growth-hormone and IGF-1 blood levels over short observation windows. This has not established long-term safety or effectiveness for any use in people, and it has not been approved by the FDA for any indication. More controlled human research is needed.",
  ),
  'cjc-no-dac-ipa': entry(
    "A combination product pairing a GHRH analog (CJC-1295 without DAC) with a growth-hormone secretagogue (Ipamorelin) — each studied separately for its effects on the body's growth-hormone axis.",
    "This product combines two peptides researchers have each studied for related but mechanistically distinct roles in growth-hormone regulation: CJC-1295 without DAC, a modified analog of growth-hormone-releasing hormone, and Ipamorelin, a selective growth-hormone secretagogue that interacts with the ghrelin receptor. Researchers have studied each peptide's individual effects on growth-hormone pulses in laboratory and early human pharmacology research, and the two mechanisms are sometimes discussed together conceptually because they act on different steps of the same signaling pathway. This exact fixed combination has not been directly and adequately studied as its own product in controlled human trials, so any specific claim about a combined or synergistic effect beyond each ingredient's own separately-studied mechanism is not established by the published research. More controlled human research is needed on each component and on this specific combination.",
  ),
  ipamorelin: entry(
    'A growth-hormone secretagogue peptide studied for its relatively selective effects on growth-hormone release.',
    'Ipamorelin is a synthetic peptide that researchers are studying for its ability to stimulate growth-hormone release by activating the ghrelin receptor, a mechanism distinct from GHRH-analog peptides. Early laboratory and animal research reported that, compared with some earlier growth-hormone secretagogues, Ipamorelin appeared more selective for growth-hormone release with comparatively less effect on cortisol and prolactin in those study models. Human data remain limited to early-phase pharmacology research. This has not established that Ipamorelin is safe or effective for any use in people, and it has not been approved by the FDA for any indication. More controlled human research is needed.',
  ),
  'igf-1-lr3': entry(
    'A modified, longer-acting analog of a natural growth factor, studied mainly in cell and animal research on tissue growth pathways.',
    'IGF-1 LR3 (Long-Arg3-IGF-1) is a modified analog of insulin-like growth factor 1 (IGF-1), a hormone naturally involved in cell growth and repair signaling; the modification is designed to extend how long it remains active by reducing its binding to certain carrier proteins. Researchers are studying whether it interacts with IGF-1-receptor pathways to influence cell proliferation and tissue-growth-related signaling, primarily in cell-culture and animal models. Published human clinical trial data specific to IGF-1 LR3 are very limited. This has not established that IGF-1 LR3 is safe or effective for any use in people, including muscle growth. More controlled human research is needed.',
  ),
  'mots-c': entry(
    'A peptide encoded by mitochondrial DNA, studied for its role in cellular energy and metabolic-signaling research.',
    "MOTS-c is a small peptide that researchers discovered is encoded within mitochondrial DNA (the cell's energy-producing structures) rather than the main cell nucleus, distinguishing it from most other studied peptides. Researchers are studying whether it interacts with AMPK-related metabolic-signaling pathways to influence cellular energy regulation and exercise-related metabolic adaptation. This research is still largely in the laboratory and animal-study stage, with reported effects on metabolic markers in those models. Human clinical trial data on MOTS-c remain limited. This has not established that MOTS-c improves metabolism or exercise capacity, or is safe or effective for any use, in people. More controlled human research is needed.",
  ),
  sermorelin: entry(
    'A shortened analog of growth-hormone-releasing hormone, historically studied and used in a now-discontinued approved pharmaceutical for a specific medical purpose.',
    "Sermorelin corresponds to the first 29 amino acids of growth-hormone-releasing hormone (GHRH), the natural signal that prompts the pituitary gland to release growth hormone. A pharmaceutical version of sermorelin was previously FDA-approved (marketed as Geref) for diagnostic testing and pediatric growth-hormone-deficiency treatment before being discontinued for business reasons unrelated to safety findings reported at the time. Researchers continue to study sermorelin's effects on the body's own growth-hormone pulses. This research-grade product is not the approved pharmaceutical, is not evaluated or approved by the FDA for any current use, and this description does not represent a treatment recommendation. More controlled human research would be needed to characterize any current research use.",
  ),
  tesa: entry(
    'A growth-hormone-releasing hormone analog, approved as a pharmaceutical for a specific medical indication under its own brand name.',
    "Tesamorelin is a modified analog of growth-hormone-releasing hormone (GHRH). A pharmaceutical form is FDA-approved (marketed as Egrifta) specifically for reducing excess abdominal fat in HIV-associated lipodystrophy, under medical supervision. Researchers more broadly study GHRH analogs, including tesamorelin, for their effects on the body's own growth-hormone pulses and downstream metabolic markers. This listing is a research-grade product, not the approved pharmaceutical, and this description is not a treatment recommendation or dosing guidance for any use, including for the condition tesamorelin is approved to treat under its own brand.",
  ),
  'lemon-bottle': entry(
    'An injectable aesthetic/lipolysis-marketed product; not a peptide, and this listing does not confirm its exact formulation.',
    'Lemon Bottle is a product name used in the aesthetic/cosmetic injectable market for solutions marketed toward localized fat-reduction ("fat dissolving") research and use. It is not a peptide and is chemically distinct from the peptide compounds described elsewhere in this shop. This description does not assert this specific product\'s exact formulation, as it is not independently confirmed in our internal records. Products in this general aesthetic-injectable category have drawn regulatory and public-health scrutiny in some markets, including public warnings about unauthorized or unapproved formulations sold under similar product names; this description does not restate specific regulatory findings that were not independently re-verified as part of this content pass. This has not established that this product is safe or effective for any use. More independently verifiable information about this specific product would be needed before any research claim could be made about it.',
  ),

  // ---------------------------------------------------------------
  // CP-S1 / CP-T2 / CP-R3 — deliberately generic, identity-protected
  // (CLAUDE.md §7). Do not add any wording that differentiates one
  // from another by receptor count/mechanism specificity — that
  // differentiation is exactly what would reveal which scientific-name
  // compound each corresponds to.
  // ---------------------------------------------------------------
  'cp-s1': entry(
    'A research compound studied in the broader area of metabolic and body-weight-related signaling.',
    "CP-S1 is sold as a research compound within Cloud Peptides' Weight Loss + Metabolic category. Compounds in this broad research area are commonly studied for their interaction with hormone-signaling pathways involved in appetite, food intake, and metabolic regulation. This description intentionally does not specify an exact receptor target or mechanism, and does not identify this product with any named compound profile in this site's research library. Any specific mechanism, study finding, or evidence level would need to be confirmed for this exact product before it could be described here; none is asserted. This has not established that CP-S1 is safe or effective for any use in people. More information, and controlled human research on this specific product, would be needed before any such claim could be made.",
  ),
  'cp-t2': entry(
    'A research compound studied in the broader area of metabolic and body-weight-related signaling.',
    "CP-T2 is sold as a research compound within Cloud Peptides' Weight Loss + Metabolic category. Compounds in this broad research area are commonly studied for their interaction with hormone-signaling pathways involved in appetite, food intake, and metabolic regulation. This description intentionally does not specify an exact receptor target or mechanism, and does not identify this product with any named compound profile in this site's research library. Any specific mechanism, study finding, or evidence level would need to be confirmed for this exact product before it could be described here; none is asserted. This has not established that CP-T2 is safe or effective for any use in people. More information, and controlled human research on this specific product, would be needed before any such claim could be made.",
  ),
  'cp-r3': entry(
    'A research compound studied in the broader area of metabolic and body-weight-related signaling.',
    "CP-R3 is sold as a research compound within Cloud Peptides' Weight Loss + Metabolic category. Compounds in this broad research area are commonly studied for their interaction with hormone-signaling pathways involved in appetite, food intake, and metabolic regulation. This description intentionally does not specify an exact receptor target or mechanism, and does not identify this product with any named compound profile in this site's research library. Any specific mechanism, study finding, or evidence level would need to be confirmed for this exact product before it could be described here; none is asserted. This has not established that CP-R3 is safe or effective for any use in people. More information, and controlled human research on this specific product, would be needed before any such claim could be made.",
  ),

  // ---------------------------------------------------------------
  // Repair + Other
  // ---------------------------------------------------------------
  adamax: entry(
    'A product name used in the research-peptide market; this listing does not confirm its exact formulation.',
    "Adamax is sold as a research compound; its exact published formulation and mechanism are not independently confirmed in our internal records. This description does not assert a specific ingredient, pathway, or mechanism for this product, since doing so without confirmation would risk being inaccurate. This has not established that Adamax is safe or effective for any use. More independently verifiable information about this specific product's composition would be needed before any research claim could be made about it.",
  ),
  ara290: entry(
    "A modified analog of erythropoietin, studied for tissue-protective effects separate from erythropoietin's better-known role in red-blood-cell production.",
    "ARA290 (also studied under the name cibinetide) is a synthetic peptide derived from erythropoietin (EPO), a hormone best known for stimulating red blood cell production. Researchers engineered ARA290 in an effort to retain EPO's reported tissue-protective and anti-inflammatory signaling while minimizing its blood-cell-stimulating effects. Laboratory and animal research has studied its interaction with the innate repair receptor pathway associated with these tissue-protective effects, and early-phase human clinical trials have examined its effects in a small number of specific research contexts, including nerve-related and inflammatory-marker outcomes. This has not established that ARA290 is safe or effective for any use in people, and it has not been approved by the FDA for any indication. More controlled human research is needed.",
  ),
  'botulinum-toxin': entry(
    'A well-characterized neurotoxin whose mechanism of blocking nerve-to-muscle signaling is established; this listing is an unbranded research-grade product, not an approved pharmaceutical.',
    'Botulinum toxin is a well-studied neurotoxin produced by the bacterium Clostridium botulinum. Its mechanism — blocking the release of a nerve-signaling chemical (acetylcholine) at the junction between nerves and muscles — is well established in the scientific literature and underlies several FDA-approved pharmaceutical products (sold under specific brand names) for particular cosmetic and medical indications. This listing is an unbranded, research-grade product, is not one of those approved pharmaceuticals, and has not itself been evaluated or approved by the FDA for any use. This description is not a treatment recommendation and does not establish that this specific product is safe or effective for any use. Handling and use of botulinum toxin carries recognized serious risks described extensively in the pharmacological literature for the approved drug class; this listing does not restate that literature as evidence about this specific unbranded product.',
  ),
  cartalax: entry(
    'A short synthetic peptide studied, mostly in early and preclinical research, for cartilage- and joint-tissue-related biology.',
    'Cartalax is a short synthetic peptide developed within a research tradition (originating largely in Russian peptide-bioregulator research) studying short peptides for tissue-specific regulatory effects — in this case, cartilage and joint-tissue biology. Published research is limited in volume and mostly preclinical or early-stage, without the large controlled human trials that would be needed to establish clinical effects. This has not established that Cartalax affects joint or cartilage health, or is safe or effective for any use, in people. More controlled human research is needed.',
  ),
  cerebrolysin: entry(
    'A peptide preparation derived from processed brain tissue, studied — mainly outside the United States — in neurological research contexts.',
    'Cerebrolysin is a preparation containing a mixture of small peptides and free amino acids derived from processing porcine (pig) brain tissue. Researchers, particularly in countries where it is used as an approved pharmaceutical for certain neurological indications (it is not FDA-approved in the United States), have studied its effects on markers related to nerve-cell signaling and neuroprotection. Clinical research quality and results in the published literature are mixed, with some studies reporting benefits on specific outcome measures and others finding no significant effect. This has not established that Cerebrolysin treats any neurological condition or is safe or effective for any use as sold here. More controlled, independently-replicated human research is needed.',
  ),
  dsip: entry(
    'A peptide originally identified for its association with sleep-related brain activity, studied for sleep- and stress-related research.',
    'DSIP (Delta Sleep-Inducing Peptide) was first identified in research examining substances associated with slow-wave ("delta") sleep brain-wave activity. Researchers have studied whether it interacts with pathways related to sleep regulation, circadian rhythm, and the body\'s stress-hormone (cortisol) response, primarily in animal and small early-phase human pharmacology studies conducted decades ago. This research base is comparatively old and limited by modern trial standards, and has not been extended by large modern controlled trials. This has not established that DSIP improves sleep or is safe or effective for any use in people. More controlled human research is needed.',
  ),
  hcg: entry(
    'A naturally occurring reproductive hormone, approved as a pharmaceutical for specific fertility-related indications; studied more broadly for its effects on the reproductive hormone axis.',
    "Human Chorionic Gonadotropin (hCG) is a hormone naturally produced during pregnancy. Pharmaceutical hCG is FDA-approved for specific indications, including certain fertility treatments and diagnostic uses, under physician supervision. Separately, researchers have studied hCG's broader effects on the hypothalamic-pituitary-gonadal (reproductive hormone) axis, including in contexts unrelated to its approved indications. This listing is a research-grade product, not a prescribed pharmaceutical, and this description is not a treatment recommendation or dosing guidance. Any specific research use beyond hCG's approved indications remains an area of ongoing scientific and clinical discussion rather than an established, approved use.",
  ),
  'kisspeptin-10': entry(
    'A fragment of a natural hormone that regulates the reproductive hormone axis, studied in reproductive endocrinology research.',
    "Kisspeptin-10 is a short, active fragment of kisspeptin, a naturally occurring hormone that plays a central role in triggering the release of gonadotropin-releasing hormone (GnRH), the top-level signal in the body's reproductive hormone axis. Researchers are studying whether kisspeptin-10 administration can be used as a tool to probe or influence this axis in reproductive endocrinology research, including early-phase human pharmacology studies examining hormone-level responses. This has not established that kisspeptin-10 treats any reproductive or fertility condition, or is safe or effective for any use in people. More controlled human research is needed.",
  ),
  'oxytocin-acetate': entry(
    'A well-known naturally occurring hormone, approved as a pharmaceutical for a specific obstetric indication; studied more broadly for social- and physiological-signaling research.',
    "Oxytocin is a hormone naturally produced by the body, best known for its role in labor and lactation; a pharmaceutical form is FDA-approved (under specific brand and generic names) for inducing or strengthening labor contractions under medical supervision. Separately, researchers have studied oxytocin's broader roles in social bonding, stress response, and other physiological signaling, primarily through controlled laboratory and small clinical studies. Oxytocin acetate is the salt form of oxytocin. This listing is a research-grade product, not the prescribed obstetric pharmaceutical, and this description is not a treatment recommendation or dosing guidance for any use.",
  ),
  'pe-22-28': entry(
    'A synthetic peptide fragment studied, so far mainly in animal models, for its interaction with a specific brain ion-channel pathway.',
    "PE-22-28 is a synthetic peptide related to spadin, a peptide studied for its ability to block the TREK-1 potassium channel, a target of interest in mood- and stress-related neuroscience research. Animal research has reported effects on behavioral measures used as proxies for mood-related states in those models. Published human clinical research on PE-22-28 is essentially absent at this stage. This has not established that PE-22-28 affects mood or is safe or effective for any use in people. More controlled research, including basic human safety data, is needed before this compound's effects in people could be characterized at all.",
  ),
  'pe-22-29': entry(
    'A peptide closely related to PE-22-28; published research specifically distinguishing it is very limited.',
    'PE-22-29 is closely related to PE-22-28 (a synthetic peptide related to spadin, studied for interaction with the TREK-1 potassium channel implicated in mood- and stress-related neuroscience research). Publicly available research that specifically and separately characterizes "PE-22-29," as distinct from PE-22-28, is very limited, and this description does not assert findings unique to this specific naming that have not been independently confirmed. Readers researching this compound should treat published data under either name with the understanding that the two are closely related but not confirmed here to be studied identically. This has not established that PE-22-29 is safe or effective for any use in people. More controlled research is needed.',
  ),
  pinealon: entry(
    'A short synthetic peptide studied, mostly in early and preclinical research, for neuroprotection-related biology.',
    'Pinealon is a short synthetic peptide from the same general research tradition as Cartalax and other short peptide "bioregulators" (originating largely in Russian peptide research), here studied in the context of nervous-system and neuroprotection-related biology. Published research is limited in volume and mostly preclinical, without large controlled human trials. This has not established that Pinealon affects cognitive function, neuroprotection, or is safe or effective for any use, in people. More controlled human research is needed.',
  ),
  pt141: entry(
    'A melanocortin-receptor-activating peptide; a closely related compound is FDA-approved for a specific indication under its own brand name.',
    'PT-141 (bremelanotide) is a synthetic peptide that activates melanocortin receptors in the brain. Researchers have studied its effects on sexual-arousal-related signaling pathways; a pharmaceutical form of bremelanotide is FDA-approved (marketed as Vyleesi) specifically for hypoactive sexual desire disorder in premenopausal women, administered under specific prescribing guidance. This listing is an unbranded, research-grade product, is not the approved pharmaceutical, and has not itself been evaluated or approved by the FDA for any use. This description is not a treatment recommendation, is not dosing guidance, and does not establish that this specific product is safe or effective for any use.',
  ),
  selank: entry(
    'A synthetic peptide related to a natural immune-signaling fragment, studied — mostly outside the United States — for anxiety- and cognition-related research.',
    'Selank is a synthetic peptide designed as an analog of a fragment of tuftsin, a naturally occurring immune-system peptide. Researchers, largely publishing in the Russian scientific literature where a pharmaceutical form is registered for specific uses, have studied whether Selank interacts with pathways related to anxiety-like behavior and cognitive-performance measures in animal models, along with some small human studies. This research base has not been independently replicated at the scale expected by larger Western regulatory agencies, and Selank is not FDA-approved for any use. This has not established that Selank reduces anxiety or improves cognition, or is safe or effective for any use, in people. More controlled human research is needed.',
  ),
  semax: entry(
    'A synthetic peptide related to a fragment of a natural hormone, studied — mostly outside the United States — for neuroprotection- and cognition-related research.',
    "Semax is a synthetic peptide designed as an analog of a fragment of adrenocorticotropic hormone (ACTH), engineered without ACTH's hormonal effects on the adrenal glands. Researchers, largely publishing in the Russian scientific literature where a pharmaceutical nasal-spray form is registered for specific uses, have studied whether Semax interacts with pathways related to neuroprotection, brain-derived neurotrophic factor (BDNF) signaling, and cognitive-performance measures, in animal and some human studies. This research base has not been independently replicated at the scale expected by larger Western regulatory agencies, and Semax is not FDA-approved for any use. This has not established that Semax improves cognition or protects the brain, or is safe or effective for any use, in people. More controlled human research is needed.",
  ),
  'ss-31': entry(
    'A peptide designed to target mitochondria, studied in human clinical trials for several research contexts related to mitochondrial and muscle function.',
    'SS-31 (also studied under the name elamipretide) is a synthetic peptide designed to concentrate inside mitochondria, the energy-producing structures within cells, where researchers are studying whether it interacts with pathways related to mitochondrial membrane function and oxidative stress. Unlike many compounds on this list, SS-31/elamipretide has been studied in a number of registered human clinical trials examining outcomes related to mitochondrial dysfunction, muscle function, and cardiac-related measures in specific patient populations; this description does not restate specific trial results or current regulatory-designation status, which were not independently re-verified as part of this content pass. This has not established that SS-31 is FDA-approved, or safe or effective for any use as sold here. More information about current trial results and regulatory status would be needed before any specific claim could be made.',
  ),
  'thymalin-thymulin': entry(
    'Two related but distinct thymus-derived research peptides, studied for immune-system-regulation research.',
    'This listing covers thymic-origin peptide research: Thymalin, a peptide-extract preparation from the Russian peptide-bioregulator research tradition, and Thymulin, a distinct, well-characterized nine-amino-acid hormone naturally produced by the thymus gland. Both are studied by researchers for their roles in regulating immune-cell (particularly T-cell) development and function, though they are chemically distinct substances with separate research literatures, not one single peptide. Published human clinical trial data, especially at the scale expected by larger Western regulatory agencies, remain limited for both. This has not established that either compound is safe or effective for any use in people. More controlled human research is needed on each.',
  ),
  'thymosin-alpha-1': entry(
    'An immune-modulating peptide naturally produced by the thymus gland, approved as a pharmaceutical in some countries outside the United States for specific indications.',
    "Thymosin Alpha-1 is a peptide naturally produced by the thymus gland that plays a role in regulating immune-cell function. A pharmaceutical form (marketed as Zadaxin) is approved in a number of countries — though not by the FDA in the United States — for specific indications including certain immune-related and infectious-disease contexts, under medical supervision in those jurisdictions. Researchers more broadly study Thymosin Alpha-1's effects on immune-system signaling. This listing is a research-grade product, not the approved pharmaceutical available in other countries, and this description is not a treatment recommendation or dosing guidance for any use.",
  ),
};
