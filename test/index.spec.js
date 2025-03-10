// Basic test for index.html
import { test, expect } from '@playwright/test';

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