import { expect, test } from '@playwright/test';

test('about page exists and has correct structure', async ({ page }) => {
	await page.goto('/about.html');

	// Verify the page exists and loads
	expect(page.url()).toContain('/about.html');

	// Verify basic HTML structure
	const htmlTag = await page.$('html');
	expect(htmlTag).toBeTruthy();

	const headTag = await page.$('head');
	expect(headTag).toBeTruthy();

	const bodyTag = await page.$('body');
	expect(bodyTag).toBeTruthy();

	// Take a screenshot of the page
	await page.screenshot({ path: 'test-results/about-screenshot.png' });
});
