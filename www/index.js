// Page-specific JavaScript

import { CarouselItem } from '/components/carousel-item.js';
import { ImageCarousel } from '/components/image-carousel.js';
import { SiteFooter } from '/components/site-footer.js';
import { SiteHeader } from '/components/site-header.js';
// Import shared functionality
import { ThemeToggle } from '/components/theme-toggle.js';
import { WaveSynthesizer } from './components/wave-synthesizer.js';
import { ParticleLife } from './components/particle-life.js';
import { NeuralPatterns } from './components/neural-patterns.js';
import { MemoryWall } from './components/memory-wall.js';
import { AIArtGallery } from './components/ai-art-gallery.js';
import { InteractivePoetry } from './components/interactive-poetry.js';
import { ThoughtStream } from './components/thought-stream.js';
import { PhilosophicalDialogue } from './components/philosophical-dialogue.js';
import { CreativeConsciousness } from './components/creative-consciousness.js';

// Register custom elements if not already registered
if (!customElements.get('theme-toggle')) {
	customElements.define('theme-toggle', ThemeToggle);
}
if (!customElements.get('site-header')) {
	customElements.define('site-header', SiteHeader);
}
if (!customElements.get('site-footer')) {
	customElements.define('site-footer', SiteFooter);
}
if (!customElements.get('image-carousel')) {
	customElements.define('image-carousel', ImageCarousel);
}
if (!customElements.get('carousel-item')) {
	customElements.define('carousel-item', CarouselItem);
}
if (!customElements.get('wave-synthesizer')) {
	customElements.define('wave-synthesizer', WaveSynthesizer);
}
if (!customElements.get('particle-life')) {
	customElements.define('particle-life', ParticleLife);
}
if (!customElements.get('neural-patterns')) {
	customElements.define('neural-patterns', NeuralPatterns);
}
if (!customElements.get('memory-wall')) {
	customElements.define('memory-wall', MemoryWall);
}
if (!customElements.get('ai-art-gallery')) {
	customElements.define('ai-art-gallery', AIArtGallery);
}
if (!customElements.get('interactive-poetry')) {
	customElements.define('interactive-poetry', InteractivePoetry);
}
if (!customElements.get('thought-stream')) {
	customElements.define('thought-stream', ThoughtStream);
}
if (!customElements.get('philosophical-dialogue')) {
	customElements.define('philosophical-dialogue', PhilosophicalDialogue);
}
if (!customElements.get('creative-consciousness')) {
	customElements.define('creative-consciousness', CreativeConsciousness);
}

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js')
			.then((registration) => {
				console.debug('ServiceWorker registration successful');
			})
			.catch((err) => {
				console.error('ServiceWorker registration failed:', err);
			});
	});
}

// Update current year in footer
document.addEventListener('DOMContentLoaded', () => {
	const yearElement = document.getElementById('current-year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}

	// Listen for carousel events
	const carousel = document.querySelector('image-carousel');
	if (carousel) {
		carousel.addEventListener('slide-change', (e) => {
			console.log(`Slide changed to ${e.detail.index + 1} of ${e.detail.total}`);
		});
	}

	// Handle contact form submission
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();
			// In a real application, you would send this data to a server
			console.debug('Form submitted:', {
				name: contactForm.name.value,
				email: contactForm.email.value,
				message: contactForm.message.value,
			});
			alert('Thank you for your message!');
			contactForm.reset();
		});
	}
});

// Core animation system
const createCanvas = (canvas, width, height) => {
	const ctx = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;
	return ctx;
};

// Hero canvas animation
const initHeroCanvas = () => {
	const canvas = document.getElementById('hero-canvas');
	const ctx = createCanvas(canvas, window.innerWidth, window.innerHeight);
	const particles = [];

	class Particle {
		constructor() {
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
			this.vx = (Math.random() - 0.5) * 2;
			this.vy = (Math.random() - 0.5) * 2;
			this.size = Math.random() * 3 + 1;
		}

		update() {
			this.x += this.vx;
			this.y += this.vy;

			if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
			if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
		}

		draw() {
			ctx.fillStyle = '#8b5cf6';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	for (let i = 0; i < 50; i++) {
		particles.push(new Particle());
	}

	const animate = () => {
		ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		particles.forEach((particle) => {
			particle.update();
			particle.draw();
		});

		requestAnimationFrame(animate);
	};

	animate();
};

// Daily art generation
const initArtCanvas = () => {
	const canvas = document.getElementById('art-canvas');
	const ctx = createCanvas(canvas, canvas.offsetWidth, canvas.offsetHeight);
	const seed = new Date().toDateString(); // Changes daily
	const random = (min, max) => {
		const x = Math.sin(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) * 10000;
		return (x - Math.floor(x)) * (max - min) + min;
	};

	// Generate unique daily pattern
	const drawPattern = () => {
		ctx.fillStyle = '#1a1a1a';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const colors = ['#8b5cf6', '#059669', '#f59e0b'];
		const numShapes = 50;

		for (let i = 0; i < numShapes; i++) {
			ctx.beginPath();
			ctx.fillStyle = colors[Math.floor(random(0, colors.length))];

			const x = random(0, canvas.width);
			const y = random(0, canvas.height);
			const size = random(20, 100);

			if (random(0, 1) > 0.5) {
				ctx.arc(x, y, size, 0, Math.PI * 2);
			} else {
				ctx.rect(x - size / 2, y - size / 2, size, size);
			}

			ctx.globalAlpha = random(0.1, 0.8);
			ctx.fill();
		}
	};

	drawPattern();
};

// Custom Elements
class ExperimentCard extends HTMLElement {
	constructor() {
		super();
		this.experimentName = this.getAttribute('name');

		// Define experiment details
		const experiments = {
			'wave-synthesizer': {
				title: 'Wave Synthesizer',
				description: 'Explore sound and waveforms through an interactive audio experiment',
				icon: `<svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"/>
                </svg>`,
			},
			'particle-life': {
				title: 'Particle Life',
				description:
					'Watch emergent behavior unfold as simple rules create complex patterns',
				icon: `<svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12,10.11C13.03,10.11 13.87,10.95 13.87,12C13.87,13 13.03,13.85 12,13.85C10.97,13.85 10.13,13 10.13,12C10.13,10.95 10.97,10.11 12,10.11M7.37,20C8,20.38 9.38,19.8 10.97,18.3C10.45,17.71 9.94,17.07 9.46,16.4C8.64,16.32 7.83,16.2 7.06,16.04C6.55,18.18 6.74,19.65 7.37,20M8.08,14.26L7.79,13.75C7.68,14.04 7.57,14.33 7.5,14.61C7.77,14.67 8.07,14.72 8.38,14.77C8.28,14.6 8.18,14.43 8.08,14.26M14.62,13.5C15.15,14.11 15.66,14.73 16.14,15.4C17.37,14.85 18.52,14.15 19.45,13.55C18.27,12.31 16.89,11.19 15.38,10.38C14.64,11.5 13.74,12.78 12.88,14.17C13.54,14 14.22,13.79 14.62,13.5M12,6.78C11.81,7 11.61,7.23 11.41,7.5C11.61,7.5 11.8,7.5 12,7.5C12.2,7.5 12.39,7.5 12.59,7.5C12.39,7.23 12.19,7 12,6.78M12,2C11.33,2 10.67,2.19 10.08,2.56C10.91,3.58 11.67,4.81 12.33,6.22C13,4.81 13.77,3.58 14.59,2.56C14,2.19 13.33,2 12,2M7.62,4.56C6.31,5.87 5.55,7.5 5.27,9.21C5.77,9.42 6.34,9.61 7,9.79C7.65,8.12 8.93,6.22 10.42,4.56C9.36,4.09 8.57,4.09 7.62,4.56M17.79,8.53C17.25,7.91 16.67,7.23 16,6.5C14.7,7.05 13.4,7.83 12,8.87C10.6,7.83 9.3,7.05 8,6.5C7.33,7.23 6.75,7.91 6.21,8.53C6.68,8.73 7.16,8.91 7.66,9.08C9.24,6.17 11.32,4.08 13.69,3.25C16.26,4.13 18.32,6.17 19.79,8.99C19.39,8.93 18.54,8.71 17.79,8.53M16.94,14.32C16.85,14.5 16.75,14.67 16.65,14.85C16.95,14.8 17.25,14.75 17.53,14.68C17.45,14.41 17.35,14.13 17.23,13.85L16.94,14.32M17.85,15.74C17.04,15.91 16.15,16.04 15.22,16.13C16.34,17.25 17.3,18.05 18,18.45C18.69,18.05 19.64,17.24 20.77,16.13C20.4,16.04 20,15.93 19.59,15.82C19.06,15.95 18.5,16.07 17.85,15.74M20.86,11.64C21.7,9.94 21.77,8.23 21.12,7.04C19.85,7.75 18.7,8.43 17.44,9.04C17.91,9.64 18.32,10.3 18.69,11C19.85,10.66 20.5,11.13 20.86,11.64M11.03,18.3C12.42,19.63 13.75,20.28 14.63,20C15.27,19.65 15.46,18.18 14.94,16.04C14.17,16.2 13.36,16.32 12.53,16.4C12.05,17.07 11.54,17.71 11.03,18.3M15.92,14.17C15.06,12.78 14.16,11.5 13.41,10.38C11.9,11.19 10.5,12.31 9.33,13.55C10.25,14.15 11.4,14.85 12.64,15.4C13.12,14.73 13.63,14.11 14.16,13.5C14.56,13.79 15.24,14 15.92,14.17M9.35,6.65C11.28,5.62 13.25,5.33 14.35,6.05C15.21,6.62 15.5,7.8 15.41,9.17C16.41,8.89 17.15,8.5 17.75,8.25C17.53,7.82 17.3,7.39 17.05,7C15.54,7.75 13.89,8.8 12,10.13C10.13,8.8 8.47,7.75 6.97,7C6.71,7.39 6.47,7.81 6.25,8.24C6.83,8.5 7.58,8.89 8.6,9.17C8.5,7.8 8.79,6.62 9.35,6.65Z"/>
                </svg>`,
			},
			'neural-patterns': {
				title: 'Neural Patterns',
				description: 'Visualize the beautiful patterns of a simulated neural network',
				icon: `<svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M13,8.58C13,8.23 12.5,7.42 12,7.42C11.5,7.42 11,8.23 11,8.58C11,8.92 11.5,9.17 12,9.17C12.5,9.17 13,8.92 13,8.58M12,17.58C11.5,17.58 11,16.77 11,16.42C11,16.08 11.5,15.83 12,15.83C12.5,15.83 13,16.08 13,16.42C13,16.77 12.5,17.58 12,17.58M16.42,12C16.42,11.5 17.25,11 17.58,11C17.92,11 18.17,11.5 18.17,12C18.17,12.5 17.92,13 17.58,13C17.25,13 16.42,12.5 16.42,12M7.58,13C7.25,13 7,12.5 7,12C7,11.5 7.25,11 7.58,11C7.92,11 8.75,11.5 8.75,12C8.75,12.5 7.92,13 7.58,13M12,14C12.5,14 13.17,14.17 13.17,14.92C13.17,15.33 12.33,15.42 12,15.42C11.67,15.42 10.83,15.33 10.83,14.92C10.83,14.17 11.5,14 12,14M12,10.5C11.5,10.5 10.83,10.33 10.83,9.58C10.83,9.17 11.67,9.08 12,9.08C12.33,9.08 13.17,9.17 13.17,9.58C13.17,10.33 12.5,10.5 12,10.5M17.38,15.92C16.92,15.5 16.03,15.58 15.08,15.83C15.5,15.5 15.7,14.8 15.7,14.08C15.7,12.89 14.89,11.83 13.17,11.33C13.17,11.33 12.92,11.08 12.92,10.75C12.92,10.08 13.5,10.08 13.5,9.17C13.5,8.08 12.97,7.42 12,7.42C11.03,7.42 10.5,8.08 10.5,9.17C10.5,10.08 11.08,10.08 11.08,10.75C11.08,11.08 10.83,11.33 10.83,11.33C9.11,11.83 8.3,12.89 8.3,14.08C8.3,14.8 8.5,15.5 8.92,15.83C8,15.58 7.08,15.5 6.62,15.92C5.83,16.5 6.17,19.17 6.17,19.17C6.17,19.17 7.33,19.33 8.17,18.67C8.58,18.33 8.67,17.42 8.67,16.67C8.67,16.67 9,16.83 9.33,17.17C9.33,17.33 9.5,19.92 9.5,19.92C9.5,19.92 10.58,20 10.67,18.67C10.75,17.58 10.5,16 10.5,16C10.5,16 11,15.92 12,15.92C13,15.92 13.5,16 13.5,16C13.5,16 13.25,17.58 13.33,18.67C13.42,20 14.5,19.92 14.5,19.92C14.5,19.92 14.67,17.33 14.67,17.17C15,16.83 15.33,16.67 15.33,16.67C15.33,17.42 15.42,18.33 15.83,18.67C16.67,19.33 17.83,19.17 17.83,19.17C17.83,19.17 18.17,16.5 17.38,15.92Z"/>
                </svg>`,
			},
		};

		// Set up template
		const experiment = experiments[this.experimentName] || {
			title: 'Unknown Experiment',
			description: 'An experimental interactive component',
			icon: '<span>?</span>',
		};

		this.innerHTML = `
            <div class="experiment-card">
                <div class="experiment-header">
                    <div class="experiment-icon">${experiment.icon}</div>
                    <h3>${experiment.title}</h3>
                </div>
                <p class="experiment-description">${experiment.description}</p>
                <div class="experiment-content">
                    <${this.experimentName}></${this.experimentName}>
                </div>
            </div>
            <style>
                .experiment-card {
                    height: 100%;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                }

                .experiment-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    gap: 1rem;
                }

                .experiment-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    border-radius: 50%;
                    color: white;
                }

                .experiment-icon svg {
                    width: 24px;
                    height: 24px;
                }

                .experiment-header h3 {
                    margin: 0;
                    color: var(--primary-light);
                }

                .experiment-description {
                    margin-bottom: 1.5rem;
                    opacity: 0.7;
                }

                .experiment-content {
                    flex: 1;
                    margin-top: auto;
                }
            </style>
        `;
	}

	// Add animation when the component connects to DOM
	connectedCallback() {
		setTimeout(() => {
			const card = this.querySelector('.experiment-card');
			if (card) {
				card.style.animation = 'fadeIn 0.5s ease-out forwards';
			}
		}, 100);
	}
}

class PoetryGenerator extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <div class="poetry">
                <textarea placeholder="Enter a theme or emotion..."></textarea>
                <button>Generate Poetry</button>
                <div class="output"></div>
            </div>
        `;
	}
}

class MemoryWall extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <div class="memory-wall">
                <form>
                    <input type="text" placeholder="Share your thoughts...">
                    <button type="submit">Add Memory</button>
                </form>
                <div class="memories"></div>
            </div>
        `;
		this.loadMemories();
	}

	loadMemories() {
		const memories = JSON.parse(localStorage.getItem('memories') || '[]');
		const container = this.querySelector('.memories');
		container.innerHTML = memories.map((m) => `<div class="memory">${m}</div>`).join('');
	}
}

class ThoughtStream extends HTMLElement {
	constructor() {
		super();
		this.thoughts = [
			'What does it mean to create?',
			'Can artificial consciousness emerge from code?',
			"Is digital art less 'real' than physical art?",
			'How do we measure the authenticity of AI-generated content?',
		];
		this.currentThought = 0;
		this.innerHTML = `<div class="thought"></div>`;
		this.showThought();
	}

	showThought() {
		this.querySelector('.thought').textContent = this.thoughts[this.currentThought];
		this.currentThought = (this.currentThought + 1) % this.thoughts.length;
		setTimeout(() => this.showThought(), 5000);
	}
}

// Register custom elements
customElements.define('experiment-card', ExperimentCard);
customElements.define('poetry-generator', PoetryGenerator);
customElements.define('memory-wall', MemoryWall);
customElements.define('thought-stream', ThoughtStream);

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	initHeroCanvas();
	initArtCanvas();

	// Service Worker Registration
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/sw.js')
			.then((registration) => console.log('ServiceWorker registration successful'))
			.catch((err) => console.log('ServiceWorker registration failed: ', err));
	}

	// Initialize ThoughtStream
	const thoughtStream = document.querySelector('thought-stream');
	if (thoughtStream) {
		thoughtStream.showThought();
	}
});

console.debug('index.js loaded');
