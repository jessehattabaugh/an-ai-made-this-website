// Basic test for index.html
import { expect, test } from '@playwright/test';

import fs from 'fs';
import path from 'path';

test('basic page structure', async ({ page }) => {
	await page.goto('/');

	// Check if page has the correct title
	await expect(page).toHaveTitle('Simple Website');

	// Check if page contains the Hello World text
	const content = await page.textContent('body');
	expect(content).toContain('Hello World');

	// Verify minimal document structure
	const htmlTag = await page.$('html');
	expect(htmlTag).toBeTruthy();

	const headTag = await page.$('head');
	expect(headTag).toBeTruthy();

	const bodyTag = await page.$('body');
	expect(bodyTag).toBeTruthy();
});

test('sitemap.xml exists and contains at least one page', async ({ page }) => {
	await page.goto('/sitemap.xml');

	// Verify that sitemap.xml loads and contains XML content
	const content = await page.content();
	expect(content).toContain('<?xml');
	expect(content).toContain('<urlset');

	// Check that sitemap has at least one URL entry
	expect(content).toContain('<url>');
	expect(content).toContain('<loc>');

	// Take a screenshot of the sitemap
	await page.screenshot({ path: 'test-results/sitemap-screenshot.png' });
});