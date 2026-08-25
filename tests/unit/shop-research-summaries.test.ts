import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../../src/lib/shop-products';
import { SHOP_RESEARCH_SUMMARIES as RAW_SUMMARIES } from '../../scripts/research/data/shop-research-summaries.mjs';

// TS infers an exact literal-key object type from the plain .mjs data
// file (no index signature) — every lookup in this file is
// deliberately by an arbitrary string (a product slug), so a single
// explicit re-typing here is clearer than casting at every call site.
const SHOP_RESEARCH_SUMMARIES: Record<string, { preview: string; full: string }> = RAW_SUMMARIES;

// Content-integrity tests for the 2026-08-25 shop research-summary
// copy. Deliberately fast, DB-free unit tests (the live-DB coverage
// check lives in scripts/research/seed-shop-research-summaries.mjs,
// which this file's coverage tests mirror against the static product
// catalog so drift is caught in CI too, not only at seed time).

const NOTICE =
  'This summary describes areas of scientific research and does not establish that this material is safe or effective for any use. Strictly for laboratory research. Not for human or veterinary use.';

// "proven"/"guarantee" are blanket-banned as bare substrings — this
// content never has a legitimate reason to use either word. "safe" is
// checked separately, sentence-by-sentence, below: this content
// legitimately says "is safe" only inside a negation ("has not
// established that X is safe"), so a bare substring match on "is safe"
// would false-positive on every single correctly-written entry.
const BLANKET_FORBIDDEN_PATTERNS: RegExp[] = [/\bproven\b/i, /\bguarantee/i];

/** Splits on sentence-ending punctuation; good enough for this
 * content's plain prose (no abbreviation edge cases like "Dr." appear
 * in any entry). */
function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/);
}

// CP-S1/CP-T2/CP-R3 must never reveal or imply the CLAUDE.md
// §7-protected scientific-name mapping. This list covers the three
// research compounds' names, their receptor-class terminology, and
// their development codes — none of these should ever appear in shop
// copy for these three slugs.
const PROTECTED_IDENTITY_TERMS = [
  'semaglutide',
  'tirzepatide',
  'retatrutide',
  'glp-1',
  'glp1',
  'gip',
  'glucagon',
  'incretin',
  'ly3298176', // Tirzepatide's development code
  'ly3437943', // Retatrutide's development code
];

describe('shop research summaries — catalog coverage', () => {
  const catalogSlugs = new Set(PRODUCTS.map((p) => p.id));
  const authoredSlugs = new Set(Object.keys(SHOP_RESEARCH_SUMMARIES));

  it('has exactly one authored summary per product in the static catalog', () => {
    const missing = [...catalogSlugs].filter((s) => !authoredSlugs.has(s));
    expect(missing).toEqual([]);
  });

  it('authors no summary for a slug that does not exist in the static catalog', () => {
    const extra = [...authoredSlugs].filter((s) => !catalogSlugs.has(s));
    expect(extra).toEqual([]);
  });
});

describe('shop research summaries — editorial guardrails', () => {
  for (const [slug, { preview, full }] of Object.entries(SHOP_RESEARCH_SUMMARIES)) {
    describe(slug, () => {
      it('has a non-empty preview and full explanation', () => {
        expect(preview.length).toBeGreaterThan(10);
        expect(full.length).toBeGreaterThan(preview.length);
      });

      it('ends with the standard research-only notice', () => {
        expect(full.trim().endsWith(NOTICE)).toBe(true);
      });

      it('never uses "proven" or "guarantee"', () => {
        for (const pattern of BLANKET_FORBIDDEN_PATTERNS) {
          expect(full).not.toMatch(pattern);
          expect(preview).not.toMatch(pattern);
        }
      });

      it('every sentence mentioning "safe" is a negation, never a bare safety claim', () => {
        for (const sentence of sentences(full)) {
          if (/\bsafe\b/i.test(sentence)) {
            expect(sentence).toMatch(/\bnot\b/i);
          }
        }
      });

      it('contains no dosing/administration instructions (mg-per-use or "take X" phrasing)', () => {
        expect(full).not.toMatch(/\btake\s+\d/i);
        expect(full).not.toMatch(/\binject\s+\d/i);
        expect(full).not.toMatch(/\bonce\s+(daily|weekly)\s+dose\s+of\s+\d/i);
      });
    });
  }
});

describe('shop research summaries — CP-S1/CP-T2/CP-R3 identity separation', () => {
  for (const slug of ['cp-s1', 'cp-t2', 'cp-r3']) {
    it(`${slug} never names or implies its underlying research-compound identity`, () => {
      const { preview, full } = SHOP_RESEARCH_SUMMARIES[slug];
      const haystack = `${preview} ${full}`.toLowerCase();
      for (const term of PROTECTED_IDENTITY_TERMS) {
        expect(haystack.includes(term)).toBe(false);
      }
    });
  }

  it('CP-S1, CP-T2, and CP-R3 use structurally identical generic framing (no differentiating mechanism detail)', () => {
    // Same paragraph shape/length band and no distinguishing receptor
    // vocabulary between the three — differentiating them by mechanism
    // specificity is exactly what would leak which is which.
    const lengths = ['cp-s1', 'cp-t2', 'cp-r3'].map((s) => SHOP_RESEARCH_SUMMARIES[s].full.length);
    const [a, b, c] = lengths;
    expect(Math.max(a, b, c) - Math.min(a, b, c)).toBeLessThan(20);
  });
});

describe('shop research summaries — blend wording', () => {
  for (const slug of ['bpc-tb', 'cjc-no-dac-ipa']) {
    it(`${slug} explains each component separately and does not assert unstudied synergy`, () => {
      const { full } = SHOP_RESEARCH_SUMMARIES[slug];
      expect(full).toMatch(/not been directly and adequately studied/i);
      expect(full).not.toMatch(/proven synerg/i);
      expect(full).not.toMatch(/guaranteed (combined|synergistic)/i);
    });
  }

  for (const slug of ['glow', 'klow', 'adamax']) {
    it(`${slug} (unconfirmed formulation) does not assert a specific ingredient list`, () => {
      const { full } = SHOP_RESEARCH_SUMMARIES[slug];
      expect(full).toMatch(/not independently confirmed/i);
    });
  }
});

describe('shop research summaries — AOD9605 identity caution (CLAUDE.md §7/§27.3)', () => {
  it('never aliases AOD9605 to AOD9604', () => {
    const { full } = SHOP_RESEARCH_SUMMARIES['aod9605'];
    expect(full).toMatch(/has not been established/i);
    expect(full).not.toMatch(/is the same as aod9604/i);
    expect(full).not.toMatch(/also known as aod9604/i);
  });
});
