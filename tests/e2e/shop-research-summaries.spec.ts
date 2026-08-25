import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// 2026-08-25 — plain-English shop research summaries (equal-height
// cards + "What researchers are studying" expandable section).

test.describe('shop research summaries — collapsed card layout', () => {
  test('every product card renders a preview and stays equal height across the grid', async ({
    page,
  }) => {
    await page.goto('/shop');
    const cards = page.locator('[data-shop-item]');
    const count = await cards.count();
    expect(count).toBe(47);

    // Sample a spread of cards with very different preview-text
    // lengths (a short generic one vs. long ones) and confirm their
    // rendered heights are identical — the whole point of the
    // line-clamp approach over relying on grid stretch alone.
    const shortSlugCard = page.locator('[data-shop-item][data-id="cp-s1"]');
    const longSlugCard = page.locator('[data-shop-item][data-id="thymalin-thymulin"]');
    await expect(shortSlugCard).toBeVisible();
    await expect(longSlugCard).toBeVisible();
    const shortBox = await shortSlugCard.boundingBox();
    const longBox = await longSlugCard.boundingBox();
    expect(shortBox).not.toBeNull();
    expect(longBox).not.toBeNull();
    // Same row (both start collapsed) => same card height, regardless
    // of how much longer one product's preview text is than another's.
    expect(Math.abs((shortBox?.height ?? 0) - (longBox?.height ?? 0))).toBeLessThan(2);
  });

  test('the research disclosure starts collapsed on page load', async ({ page }) => {
    await page.goto('/shop');
    const details = page.locator('[data-shop-item][data-id="ghk-cu"] details');
    await expect(details).not.toHaveAttribute('open', '');
  });
});

test.describe('shop research summaries — expand/collapse behavior', () => {
  test('clicking "What researchers are studying" expands the full explanation without navigating away', async ({
    page,
  }) => {
    await page.goto('/shop');
    const card = page.locator('[data-shop-item][data-id="ghk-cu"]');
    const summary = card.getByText('What researchers are studying');
    await summary.click();
    await expect(card.locator('details')).toHaveAttribute('open', '');
    await expect(card.locator('details p')).toContainText('GHK-Cu');
    // Still on the shop listing — the disclosure toggle must never
    // trigger the card's own product link.
    await expect(page).toHaveURL(/\/shop\/?$/);

    // Clicking again collapses it.
    await summary.click();
    await expect(card.locator('details')).not.toHaveAttribute('open', '');
  });

  test('the product name/price link still navigates to the product page', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('[data-shop-item][data-id="ghk-cu"] a.cp-product-card__link').click();
    await expect(page).toHaveURL('/shop/ghk-cu');
  });
});

test.describe('shop research summaries — keyboard accessibility', () => {
  test('the disclosure can be opened and closed with the keyboard alone', async ({ page }) => {
    await page.goto('/shop');
    const summary = page.locator('[data-shop-item][data-id="ghk-cu"] summary');
    await summary.focus();
    await expect(summary).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-shop-item][data-id="ghk-cu"] details')).toHaveAttribute(
      'open',
      '',
    );
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-shop-item][data-id="ghk-cu"] details')).not.toHaveAttribute(
      'open',
      '',
    );
    // Space toggles too (native <summary> behavior).
    await page.keyboard.press(' ');
    await expect(page.locator('[data-shop-item][data-id="ghk-cu"] details')).toHaveAttribute(
      'open',
      '',
    );
  });
});

test.describe('shop research summaries — accessibility scan', () => {
  test('the shop grid has no detectable automated accessibility violations with a disclosure expanded', async ({
    page,
  }) => {
    await page.goto('/shop');
    await page.locator('[data-shop-item][data-id="ghk-cu"] summary').click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('the product detail page research section has no detectable accessibility violations', async ({
    page,
  }) => {
    await page.goto('/shop/ghk-cu');
    await expect(page.getByRole('heading', { name: 'What researchers are studying' })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('shop research summaries — mobile layout', () => {
  test('cards stack to a single column and the disclosure still works at a phone-sized viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/shop');
    const grid = page.locator('[data-shop-grid]');
    await expect(grid).toBeVisible();

    // AHK-CU sorts alphabetically before GHK-CU (the live grid orders
    // by name), so rather than assume a specific render order, confirm
    // the single-column signal directly: every card shares the same
    // left edge (x) — a multi-column grid would not.
    const firstCard = page.locator('[data-shop-item][data-id="ghk-cu"]');
    const secondCard = page.locator('[data-shop-item][data-id="ahk-cu"]');
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    expect(Math.abs((firstBox?.x ?? 0) - (secondBox?.x ?? -1))).toBeLessThan(2);

    await firstCard.locator('summary').click();
    await expect(firstCard.locator('details')).toHaveAttribute('open', '');
  });
});

test.describe('shop research summaries — reuse across strengths', () => {
  test('a multi-strength product (CP-T2, 6 mg options) shows exactly one research summary', async ({
    page,
  }) => {
    await page.goto('/shop/cp-t2');
    const headings = page.getByRole('heading', { name: 'What researchers are studying' });
    await expect(headings).toHaveCount(1);
    // The option selector still offers every mg strength — the summary
    // is shared, not tied to (or duplicated per) any one option.
    const options = page.locator('#optionSelect option');
    await expect(options).toHaveCount(6);
  });
});

test.describe('shop research summaries — CP-S1/CP-T2/CP-R3 identity protection', () => {
  for (const slug of ['cp-s1', 'cp-t2', 'cp-r3']) {
    test(`${slug}'s product page links to no specific protected research profile`, async ({
      page,
    }) => {
      // General sitewide nav/footer links into /research or
      // /research/compounds (the directory index) are expected on
      // every page, including this one — what must never exist is a
      // DIRECT link to one of the three protected compound profiles
      // themselves (CLAUDE.md §7).
      await page.goto(`/shop/${slug}`);
      for (const protectedSlug of ['semaglutide', 'tirzepatide', 'retatrutide']) {
        const link = page.locator(`a[href^="/research/compounds/${protectedSlug}"]`);
        await expect(link).toHaveCount(0);
      }
    });

    test(`${slug}'s rendered page never mentions a protected research-compound name`, async ({
      page,
    }) => {
      await page.goto(`/shop/${slug}`);
      const bodyText = (await page.locator('body').innerText()).toLowerCase();
      for (const term of ['semaglutide', 'tirzepatide', 'retatrutide']) {
        expect(bodyText.includes(term)).toBe(false);
      }
    });
  }
});
