#!/usr/bin/env node

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Custom build script for Netlify deployment
 * - Copies files from www/ to dist/
 * - Processes assets as needed
 * - Generates service worker
 */
async function build() {
	console.log('🚀 Starting build process...');

	try {
		// Ensure dist directory exists
		await fs.mkdir(path.join(projectRoot, 'dist'), { recursive: true });

		// Copy all files from www to dist
		console.log('📁 Copying files from www/ to dist/...');
		await execCommand(
			`cp -r ${path.join(projectRoot, 'www')}/* ${path.join(projectRoot, 'dist')}/`,
		);

		// Generate service worker
		console.log('🔧 Generating service worker...');
		await execCommand(
			`node --experimental-json-modules ${path.join(
				projectRoot,
				'node_modules/.bin/workbox',
			)} generateSW ${path.join(projectRoot, 'workbox-config.js')}`,
		);

		console.log('✅ Build completed successfully!');
	} catch (error) {
		console.error('❌ Build failed:', error);
		process.exit(1);
	}
}

/**
 * Execute a command and return a promise
 */
function execCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing command: ${error.message}`);
				console.error(`stderr: ${stderr}`);
				return reject(error);
			}
			if (stdout) console.log(stdout);
			resolve();
		});
	});
}

// Execute build process
build();
