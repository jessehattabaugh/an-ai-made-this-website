import { expect, test } from '@playwright/test';

test('sitemap.xml exists and contains at least one page', async ({ page }) => {
	// Set headers to get raw XML
	await page.setExtraHTTPHeaders({
		Accept: 'application/xml',
	});

	const response = await page.goto('http://localhost:8888/sitemap.xml');
	expect(response.headers()['content-type']).toContain('application/xml');

	// Get raw response text instead of parsed HTML
	const content = await response.text();
	expect(content).toContain('<?xml');
	expect(content).toContain('<urlset');

	// Check that sitemap has at least one URL entry
	expect(content).toContain('<url>');
	expect(content).toContain('<loc>');

	// Take a screenshot of the sitemap
	await page.screenshot({ path: 'test-results/sitemap-screenshot.png' });
});
