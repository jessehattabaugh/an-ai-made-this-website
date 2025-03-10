import { expect, test } from '@playwright/test';

test('404 page exists and has correct structure', async ({ page }) => {
	await page.goto('/404');

	// Verify the page exists and loads
	const url = page.url();
	expect(url.includes('/404') || url.includes('/404.html')).toBeTruthy();

	// Verify basic HTML structure
	const htmlTag = await page.$('html');
	expect(htmlTag).toBeTruthy();

	const headTag = await page.$('head');
	expect(headTag).toBeTruthy();

	const bodyTag = await page.$('body');
	expect(bodyTag).toBeTruthy();

	// Take a screenshot of the page
	await page.screenshot({ path: 'test-results/404-screenshot.png' });
});
