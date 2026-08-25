import { describe, expect, it } from 'vitest';
import { groupShopProductRows } from '../../src/lib/public-shop';

// Batch 4 (2026-08-10) — the function that lets the public shop pages
// move from the static src/lib/shop-products.ts array to Supabase-
// sourced rows without changing the Product/ProductOption shape (and
// therefore without changing any of src/lib/shop.ts's pure functions
// or the page templates that consume them). These are the parity
// tests: identical results to what shop-products.ts already produced
// for the same real data (GHK-CU's two options), proving the cutover
// doesn't change observable behavior.

describe('groupShopProductRows', () => {
  it('groups multiple SKU rows sharing a product_slug into one product with multiple options', () => {
    const rows = [
      {
        code: 'CU50',
        name: 'GHK-CU',
        spec: '50mg',
        count: 10,
        price: 120,
        product_slug: 'ghk-cu',
        product_categories: { name: 'Beauty + Repair' },
      },
      {
        code: 'CU100',
        name: 'GHK-CU',
        spec: '100mg',
        count: 10,
        price: 170,
        product_slug: 'ghk-cu',
        product_categories: { name: 'Beauty + Repair' },
      },
    ];
    const products = groupShopProductRows(rows);
    expect(products).toHaveLength(1);
    expect(products[0]).toEqual({
      id: 'ghk-cu',
      name: 'GHK-CU',
      category: 'Beauty + Repair',
      options: [
        { code: 'CU50', spec: '50mg', count: 10, price: 120 },
        { code: 'CU100', spec: '100mg', count: 10, price: 170 },
      ],
      featured: false,
    });
  });

  it('keeps a single-option product as a one-option group (e.g. AHK-CU)', () => {
    const products = groupShopProductRows([
      {
        code: 'AU50',
        name: 'AHK-CU',
        spec: '50mg',
        count: 10,
        price: 110,
        product_slug: 'ahk-cu',
        product_categories: { name: 'Beauty + Repair' },
      },
    ]);
    expect(products).toEqual([
      {
        id: 'ahk-cu',
        name: 'AHK-CU',
        category: 'Beauty + Repair',
        options: [{ code: 'AU50', spec: '50mg', count: 10, price: 110 }],
        featured: false,
      },
    ]);
  });

  it('excludes a row with no product_slug — no public page to group it under', () => {
    const products = groupShopProductRows([
      {
        code: 'ADMIN1',
        name: 'Admin-only SKU',
        spec: '1mg',
        count: 1,
        price: 10,
        product_slug: null,
        product_categories: null,
      },
    ]);
    expect(products).toEqual([]);
  });

  it('falls back to an empty category name if the join is missing (never crashes)', () => {
    const products = groupShopProductRows([
      {
        code: 'X1',
        name: 'X',
        spec: '1mg',
        count: 1,
        price: 10,
        product_slug: 'x',
        product_categories: null,
      },
    ]);
    expect(products[0].category).toBe('');
  });

  // 2026-08-25 — plain-English shop research summaries. A summary row
  // is looked up by product_slug and merged onto the ALREADY-GROUPED
  // product, so one authored row is reused across however many SKU
  // rows (mg strengths) share that slug, never duplicated per SKU.
  it('reuses one research summary across every SKU variant sharing a product_slug', () => {
    const rows = [
      {
        code: 'CU50',
        name: 'GHK-CU',
        spec: '50mg',
        count: 10,
        price: 120,
        product_slug: 'ghk-cu',
        product_categories: { name: 'Beauty + Repair' },
      },
      {
        code: 'CU100',
        name: 'GHK-CU',
        spec: '100mg',
        count: 10,
        price: 170,
        product_slug: 'ghk-cu',
        product_categories: { name: 'Beauty + Repair' },
      },
    ];
    const summaryRows = [
      { product_slug: 'ghk-cu', preview_text: 'Preview text.', full_text: 'Full explanation.' },
    ];
    const products = groupShopProductRows(rows, summaryRows);
    expect(products).toHaveLength(1);
    expect(products[0].options).toHaveLength(2);
    expect(products[0].researchSummary).toEqual({
      preview: 'Preview text.',
      full: 'Full explanation.',
    });
  });

  it('leaves researchSummary undefined for a product with no authored summary row', () => {
    const products = groupShopProductRows(
      [
        {
          code: 'AU50',
          name: 'AHK-CU',
          spec: '50mg',
          count: 10,
          price: 110,
          product_slug: 'ahk-cu',
          product_categories: { name: 'Beauty + Repair' },
        },
      ],
      [],
    );
    expect(products[0].researchSummary).toBeUndefined();
  });

  it('ignores a summary row whose product_slug matches no grouped product', () => {
    const products = groupShopProductRows(
      [
        {
          code: 'AU50',
          name: 'AHK-CU',
          spec: '50mg',
          count: 10,
          price: 110,
          product_slug: 'ahk-cu',
          product_categories: { name: 'Beauty + Repair' },
        },
      ],
      [{ product_slug: 'no-such-product', preview_text: 'x', full_text: 'y' }],
    );
    expect(products[0].researchSummary).toBeUndefined();
  });

  it('preserves distinct products separately, not merged by name', () => {
    const products = groupShopProductRows([
      {
        code: 'A1',
        name: 'Product A',
        spec: '1mg',
        count: 10,
        price: 50,
        product_slug: 'product-a',
        product_categories: { name: 'Repair + Other' },
      },
      {
        code: 'B1',
        name: 'Product B',
        spec: '1mg',
        count: 10,
        price: 60,
        product_slug: 'product-b',
        product_categories: { name: 'Repair + Other' },
      },
    ]);
    expect(products.map((p) => p.id).sort()).toEqual(['product-a', 'product-b']);
  });
});
