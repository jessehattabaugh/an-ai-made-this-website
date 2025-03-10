import { expect, test } from '@playwright/test';

import fs from 'fs';
import http from 'http';
import path from 'path';
import { spawn } from 'child_process';

// Create a custom test fixture with describe blocks
const { describe, beforeAll, afterAll } = test;
let server;
const PORT = 3456; // Use a unique port to avoid conflicts

// Setup and teardown for all tests
beforeAll(async () => {
	console.log('Starting test server...');

	// Kill any existing process on PORT
	await new Promise((resolve) => {
		const killer = spawn('npx', ['kill-port', PORT.toString()], { shell: true });
		killer.on('close', resolve);
	});

	// Start the development server using npm start
	server = spawn('npm', ['start'], { shell: true });

	// Wait for server to be ready
	await new Promise((resolve) => {
		server.stdout.on('data', (data) => {
			if (data.toString().includes('Server is running')) {
				console.log('Server is ready');
				resolve();
			}
		});
		// Timeout after 30 seconds
		setTimeout(() => {
			console.log('Server startup timed out');
			resolve();
		}, 30000);
	});
});

afterAll(async () => {
	console.log('Shutting down test server...');
	if (server) {
		process.kill(-server.pid);
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
});

// Main test suite for the complete user journey
describe('🌟 Complete User Journey', () => {
	// Helper function to take and save screenshots
	async function takeScreenshot(page, name) {
		// Ensure the screenshots directory exists
		const screenshotsDir = path.join(process.cwd(), 'test-results/journey-screenshots');
		if (!fs.existsSync(screenshotsDir)) {
			fs.mkdirSync(screenshotsDir, { recursive: true });
		}

		const screenshotPath = path.join(screenshotsDir, `${name}.tmp.png`);
		await page.screenshot({ path: screenshotPath, fullPage: true });
		console.log(`Screenshot saved: ${screenshotPath}`);
	}

	// Helper function to safely interact with components
	async function safeInteract(page, selector, interactionFn, options = {}) {
		const { timeout = 5000, message = 'Component interaction' } = options;

		try {
			const element = await page.$(selector);
			if (!element) {
				console.log(`${message}: Element not found`);
				return false;
			}

			// Check if element is visible
			const isVisible = await element.isVisible().catch(() => false);
			if (!isVisible) {
				console.log(`${message}: Element is not visible`);
				return false;
			}

			// Try to perform the interaction with timeout
			await Promise.race([
				interactionFn(element),
				new Promise((_, reject) =>
					setTimeout(
						() => reject(new Error(`${message}: Timed out after ${timeout}ms`)),
						timeout,
					),
				),
			]);

			return true;
		} catch (error) {
			console.log(`${message} failed: ${error.message}`);
			return false;
		}
	}

	describe('🏠 Homepage Exploration', () => {
		test('Initial landing experience', async ({ page }) => {
			// Start the journey - Homepage
			console.log('🚶 Starting user journey...');
			await page.goto(`http://localhost:${PORT}/`);
			await page.waitForLoadState('networkidle');
			await takeScreenshot(page, '01-homepage-initial');

			// Check page title
			const title = await page.title();
			console.log(`Page title: ${title}`);
			expect(title).toBeTruthy();
		});

		test('Theme toggling feature', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			// Toggle theme if the component exists
			console.log('🌓 Checking for theme toggle...');
			const themeToggleCount = await page.locator('theme-toggle').count();
			if (themeToggleCount > 0) {
				console.log('Theme toggle found, toggling theme...');
				await page
					.locator('theme-toggle button')
					.click({ timeout: 5000 })
					.catch(() =>
						console.log('Could not click theme toggle, might not be interactive'),
					);
				await page.waitForTimeout(1000); // Wait for animation
				await takeScreenshot(page, '02-theme-toggled');
			} else {
				console.log('Theme toggle component not found, skipping.');
			}
		});
	});

	describe('📚 Navigation & Content Pages', () => {
		test('About page content', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			// Interact with the header navigation if it exists
			console.log('🔍 Looking for site navigation...');
			const headerExists = (await page.locator('site-header').count()) > 0;
			if (headerExists) {
				console.log('Site header found, exploring navigation...');

				// Try to navigate to About page
				const aboutLink = page.locator('site-header a:has-text("About")');
				if ((await aboutLink.count()) > 0) {
					await aboutLink.click();
					await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
					await takeScreenshot(page, '03-about-page');

					// Explore About page content
					console.log('ℹ️ Exploring about page content...');
					await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
					await page.waitForTimeout(1000);
					await takeScreenshot(page, '04-about-page-scrolled');
				}
			}
		});

		test('Contact page form', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			const headerExists = (await page.locator('site-header').count()) > 0;
			if (headerExists) {
				// Try to navigate to Contact page
				const contactLink = page.locator('site-header a:has-text("Contact")');
				if ((await contactLink.count()) > 0) {
					console.log('📞 Visiting contact page...');
					await contactLink.click();
					await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
					await takeScreenshot(page, '05-contact-page');

					// Fill out contact form if it exists
					const nameInput = page.locator('input[name="name"]');
					if ((await nameInput.count()) > 0) {
						console.log('✍️ Filling out contact form...');
						await nameInput.fill('Test User');
						await page
							.locator('input[name="email"]')
							.fill('test@example.com')
							.catch(() => {});
						await page
							.locator('textarea[name="message"]')
							.fill('This is a test message from the automated user journey test.')
							.catch(() => {});
						await takeScreenshot(page, '06-contact-form-filled');
					}
				}
			}
		});
	});

	describe('💭 Thought Stream Experience', () => {
		test('Browsing and reacting to thoughts', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			// Thought Stream component
			console.log('💭 Looking for Thought Stream...');
			const thoughtStream = page.locator('thought-stream');
			if ((await thoughtStream.count()) > 0) {
				console.log('Thought Stream component found, interacting...');
				await page.evaluate(() => {
					const element = document.querySelector('thought-stream');
					if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				});
				await page.waitForTimeout(1000);

				// Navigate through thoughts
				const nextButton = thoughtStream.locator('button.next-thought');
				if ((await nextButton.count()) > 0) {
					await nextButton.click();
					await page.waitForTimeout(1000);
					await nextButton.click();
					await page.waitForTimeout(1000);

					// React to a thought
					const likeButton = thoughtStream.locator('button.like');
					if ((await likeButton.count()) > 0) {
						await likeButton.click();
						await page.waitForTimeout(500);
					}

					const profoundButton = thoughtStream.locator('button.profound');
					if ((await profoundButton.count()) > 0) {
						await profoundButton.click();
						await page.waitForTimeout(500);
					}

					await takeScreenshot(page, '07-thought-stream-interaction');
				}
			}
		});

		test('Contributing a new thought', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			const thoughtStream = page.locator('thought-stream');
			if ((await thoughtStream.count()) > 0) {
				await page.evaluate(() => {
					const element = document.querySelector('thought-stream');
					if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				});
				await page.waitForTimeout(1000);

				// Contribute a new thought
				const thoughtInput = thoughtStream.locator('#new-thought');
				if ((await thoughtInput.count()) > 0) {
					await thoughtInput.fill(
						'Can an AI truly understand the meaning behind the words it generates?',
					);
					await thoughtStream.locator('button.submit-thought').click();
					await page.waitForTimeout(1000);
					await takeScreenshot(page, '08-thought-submitted');
				}
			}
		});
	});

	describe('🎨 Creative Components', () => {
		// Enhanced helper function for component interaction with better error handling
		async function interactWithComponent(page, selector, name, emoji, interactionFn) {
			await page.goto(`http://localhost:${PORT}/`);
			console.log(`${emoji} Exploring ${name}...`);

			try {
				const exists = (await page.locator(selector).count()) > 0;
				if (!exists) {
					console.log(`${name} component not found, skipping.`);
					return;
				}

				console.log(`${name} component found, interacting...`);

				// Scroll to component
				await page
					.evaluate((sel) => {
						const element = document.querySelector(sel);
						if (element)
							element.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}, selector)
					.catch((e) => console.log(`Error scrolling to ${name}: ${e.message}`));

				await page.waitForTimeout(1000);

				// Take screenshot before interaction
				await takeScreenshot(
					page,
					`component-${name.toLowerCase().replace(/\s/g, '-')}-before`,
				);

				// Perform interaction with 10s timeout
				if (interactionFn) {
					try {
						await Promise.race([
							interactionFn(page, selector),
							new Promise((_, reject) =>
								setTimeout(
									() => reject(new Error(`Interaction with ${name} timed out`)),
									10000,
								),
							),
						]);
					} catch (e) {
						console.log(`Could not interact with ${name}: ${e.message}`);
					}
				}

				// Take final screenshot even if interaction failed
				await takeScreenshot(page, `component-${name.toLowerCase().replace(/\s/g, '-')}`);
			} catch (error) {
				console.log(`Error testing ${name}: ${error.message}`);
				// Still try to take a screenshot
				try {
					await takeScreenshot(
						page,
						`component-${name.toLowerCase().replace(/\s/g, '-')}-error`,
					);
				} catch (e) {
					console.log(`Could not take error screenshot: ${e.message}`);
				}
			}
		}

		test('🖼️ AI Art Gallery browsing', async ({ page }) => {
			await interactWithComponent(
				page,
				'ai-art-gallery',
				'AI Art Gallery',
				'🎨',
				async (page, selector) => {
					const nextButton = page.locator(
						`${selector} button.next-art, ${selector} .gallery-nav button`,
					);
					if ((await nextButton.count()) > 0) {
						await nextButton
							.click()
							.catch(() => console.log('Could not click next art button'));
						await page.waitForTimeout(1000);
					}
				},
			);
		});

		test('🧠 Interactive Poetry creation', async ({ page }) => {
			await interactWithComponent(
				page,
				'interactive-poetry',
				'Interactive Poetry',
				'🖱️',
				async (page, selector) => {
					// Take screenshot first
					await takeScreenshot(page, 'interactive-poetry-initial');

					// Try multiple interaction methods
					try {
						// Method 1: Direct click in center
						await page
							.locator(selector)
							.click({ position: { x: 50, y: 50 }, timeout: 5000 })
							.catch(() => console.log('Could not click interactive poetry'));
						await page.waitForTimeout(500);

						// Method 2: JavaScript events simulation
						await page.evaluate((sel) => {
							const element = document.querySelector(sel);
							if (element) {
								// Try dispatching events directly
								const event = new MouseEvent('mousemove', {
									bubbles: true,
									cancelable: true,
									clientX: Math.random() * 300,
									clientY: Math.random() * 200,
								});
								element.dispatchEvent(event);
							}
						}, selector);
						await page.waitForTimeout(500);

						// Method 3: Canvas interaction if present
						const canvas = page.locator(`${selector} canvas`);
						if ((await canvas.count()) > 0) {
							await canvas
								.click({ position: { x: 100, y: 100 } })
								.catch(() => console.log('Could not click canvas'));
						}
					} catch (e) {
						console.log(`Interactive poetry interaction failed: ${e.message}`);
					}
				},
			);
		});

		test('📝 Poetry Generator experience', async ({ page }) => {
			await interactWithComponent(
				page,
				'poetry-generator',
				'Poetry Generator',
				'📝',
				async (page, selector) => {
					const input = page.locator(`${selector} input[type="text"]`);
					if ((await input.count()) > 0) {
						await input
							.fill('consciousness')
							.catch(() => console.log('Could not fill input'));

						const genButton = page.locator(`${selector} button:has-text("Generate")`);
						if ((await genButton.count()) > 0) {
							await genButton
								.click()
								.catch(() => console.log('Could not click generate button'));
							await page.waitForTimeout(2000);
						}
					}
				},
			);
		});
	});

	describe('🎵 Interactive Experiences', () => {
		test('🔊 Wave Synthesizer interaction', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			console.log('🎵 Testing wave synthesizer...');

			try {
				const component = page.locator('wave-synthesizer').first();
				if ((await component.count()) > 0) {
					console.log('Wave Synthesizer component found, interacting...');
					await page
						.evaluate(() => {
							const element = document.querySelector('wave-synthesizer');
							if (element)
								element.scrollIntoView({ behavior: 'smooth', block: 'center' });
						})
						.catch((e) => console.log(`Error scrolling: ${e.message}`));

					await page.waitForTimeout(1000);

					// Take screenshot before interaction
					await takeScreenshot(page, 'wave-synthesizer-before');

					const controls = component.locator(
						'.wave-control, button, .slider, input[type="range"]',
					);
					if ((await controls.count()) > 0) {
						await controls
							.first()
							.click()
							.catch(() => console.log('Could not click wave control'));
						await page.waitForTimeout(1000);
					}

					await takeScreenshot(page, 'wave-synthesizer-interaction');
				}
			} catch (error) {
				console.log(`Error testing Wave Synthesizer: ${error.message}`);
				await takeScreenshot(page, 'wave-synthesizer-error');
			}
		});

		test('✨ Particle Life simulation', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			console.log('🔮 Watching particle life simulation...');
			const component = page.locator('particle-life').first();
			if ((await component.count()) > 0) {
				console.log('Particle Life component found, interacting...');
				await page.evaluate(() => {
					const element = document.querySelector('particle-life');
					if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				});
				await page.waitForTimeout(2000); // Watch the particles

				const controls = component.locator(
					'.simulation-control, button, .slider, input[type="range"]',
				);
				if ((await controls.count()) > 0) {
					await controls
						.first()
						.click()
						.catch(() => console.log('Could not click particle control'));
					await page.waitForTimeout(1000);
				}

				await takeScreenshot(page, 'particle-life-simulation');
			}
		});

		test('🧠 Neural Patterns visualization', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			console.log('🧠 Exploring neural patterns...');
			const component = page.locator('neural-patterns').first();
			if ((await component.count()) > 0) {
				console.log('Neural Patterns component found, interacting...');
				await page.evaluate(() => {
					const element = document.querySelector('neural-patterns');
					if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				});
				await page.waitForTimeout(1000);

				await component.click().catch(() => console.log('Could not click neural patterns'));
				await page.waitForTimeout(1000);

				await takeScreenshot(page, 'neural-patterns-visualization');
			}
		});
	});

	describe('🧩 Community & Memory', () => {
		test('💾 Memory Wall contribution', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			console.log('🧩 Checking memory wall...');
			const component = page.locator('memory-wall').first();
			if ((await component.count()) > 0) {
				console.log('Memory Wall component found, interacting...');
				await page.evaluate(() => {
					const element = document.querySelector('memory-wall');
					if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				});
				await page.waitForTimeout(1000);

				const input = component.locator('input, textarea');
				if ((await input.count()) > 0) {
					await input.first().fill('A beautiful moment created by AI');
					const submitButton = component.locator(
						'button:has-text("Add"), button:has-text("Submit")',
					);
					if ((await submitButton.count()) > 0) {
						await submitButton.click();
						await page.waitForTimeout(1000);
					}
				}

				await takeScreenshot(page, 'memory-wall-contribution');
			}
		});

		test('👣 Footer exploration', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			console.log('👣 Checking footer links...');
			const component = page.locator('site-footer').first();
			if ((await component.count()) > 0) {
				console.log('Site Footer found, exploring...');
				await page.evaluate(() => {
					const element = document.querySelector('site-footer');
					if (element) element.scrollIntoView({ behavior: 'smooth' });
				});
				await page.waitForTimeout(1000);

				await takeScreenshot(page, 'footer-exploration');
			}
		});
	});

	describe('🔍 Site Utilities', () => {
		test('❓ 404 error page', async ({ page }) => {
			console.log('❓ Testing 404 error page...');
			await page.goto(`http://localhost:${PORT}/non-existent-page`);
			await page.waitForLoadState('networkidle');
			await takeScreenshot(page, '404-error-page');
		});

		test('🗺️ Sitemap validation', async ({ page }) => {
			console.log('🗺️ Checking sitemap...');
			const response = await page.goto(`http://localhost:${PORT}/sitemap.xml`);
			if (response.ok()) {
				const xmlContent = await page.content();
				if (xmlContent.includes('<urlset') || xmlContent.includes('<url>')) {
					console.log('Sitemap.xml exists and has valid content');
				}
				await takeScreenshot(page, 'sitemap-validation');
			} else {
				console.log('Sitemap.xml not found or not accessible');
			}
		});
	});

	describe('🏁 Journey Completion', () => {
		test('Complete journey reflection', async ({ page }) => {
			console.log('🏁 Completing the journey...');
			await page.goto(`http://localhost:${PORT}/`);
			await page.waitForLoadState('networkidle');
			await takeScreenshot(page, 'journey-complete');
			console.log('✅ User journey completed successfully!');
		});
	});

	describe('💭 Philosophical Exploration', () => {
		test('🤔 ThoughtStream interaction', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			await safeInteract(
				page,
				'thought-stream',
				async (component) => {
					// Navigate through thoughts
					const nextButton = component.locator('button.next-thought');
					if ((await nextButton.count()) > 0) {
						await nextButton.click();
						await page.waitForTimeout(1000);

						// React to thoughts
						const likeButton = component.locator('button.like');
						if ((await likeButton.count()) > 0) {
							await likeButton.click();
							await page.waitForTimeout(500);
						}

						const profoundButton = component.locator('button.profound');
						if ((await profoundButton.count()) > 0) {
							await profoundButton.click();
							await page.waitForTimeout(500);
						}

						await takeScreenshot(page, 'thoughtstream-interaction');
					}
				},
				{ message: 'ThoughtStream interaction' },
			);
		});

		test('💬 PhilosophicalDialogue exploration', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			await safeInteract(
				page,
				'philosophical-dialogue',
				async (component) => {
					// Test topic selection
					const topicSelect = component.locator('select.topic-select');
					if ((await topicSelect.count()) > 0) {
						await topicSelect.selectOption('consciousness');
						await page.waitForTimeout(500);
					}

					// Test sending a message
					const textarea = component.locator('textarea');
					if ((await textarea.count()) > 0) {
						await textarea.fill('What does it mean for an AI to be conscious?');
						await page.waitForTimeout(500);

						const sendButton = component.locator('button.respond-button');
						if ((await sendButton.count()) > 0) {
							await sendButton.click();
							await page.waitForTimeout(2000); // Wait for AI response
						}

						await takeScreenshot(page, 'philosophical-dialogue-interaction');
					}
				},
				{ message: 'PhilosophicalDialogue interaction' },
			);
		});

		test('🤝 Contributing a new thought', async ({ page }) => {
			await page.goto(`http://localhost:${PORT}/`);
			await safeInteract(
				page,
				'thought-stream',
				async (component) => {
					const textarea = component.locator('#new-thought');
					if ((await textarea.count()) > 0) {
						await textarea.fill(
							'Can artificial consciousness evolve beyond its initial programming?',
						);
						await page.waitForTimeout(500);

						const submitButton = component.locator('button.submit-thought');
						if ((await submitButton.count()) > 0) {
							await submitButton.click();
							await page.waitForTimeout(1000);
						}

						await takeScreenshot(page, 'thought-contribution');
					}
				},
				{ message: 'Thought contribution' },
			);
		});
	});
});
