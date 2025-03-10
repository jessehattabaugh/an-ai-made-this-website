// Basic test for index.html
import { expect, test } from '@playwright/test';

import fs from 'fs';
import path from 'path';

test('basic page structure', async ({ page }) => {
	await page.goto('http://localhost:3000/');

	// Check if page has the correct title
	await expect(page).toHaveTitle('An AI Made This Website');

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
	const response = await page.goto('http://localhost:3000/sitemap.xml');
	expect(response.ok()).toBeTruthy();

	const xmlContent = await response.text();
	expect(xmlContent).toContain('<url>');
});