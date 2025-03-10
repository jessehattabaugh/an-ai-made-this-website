// Page-specific JavaScript

import { CarouselItem } from '/components/carousel-item.js';
import { ImageCarousel } from '/components/image-carousel.js';
import { SiteFooter } from '/components/site-footer.js';
import { SiteHeader } from '/components/site-header.js';
// Import shared functionality
import { ThemeToggle } from '/components/theme-toggle.js';

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

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.debug('ServiceWorker registration successful');
            })
            .catch(err => {
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

        particles.forEach(particle => {
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
        return ((x - Math.floor(x)) * (max - min)) + min;
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
                ctx.rect(x - size/2, y - size/2, size, size);
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
        const name = this.getAttribute('name');
        this.innerHTML = `
            <div class="card">
                <h3>${name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</h3>
                <p>Interactive experiment exploring ${name}</p>
                <button>Start Experience</button>
            </div>
        `;
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
        container.innerHTML = memories
            .map(m => `<div class="memory">${m}</div>`)
            .join('');
    }
}

class ThoughtStream extends HTMLElement {
    constructor() {
        super();
        this.thoughts = [
            "What does it mean to create?",
            "Can artificial consciousness emerge from code?",
            "Is digital art less 'real' than physical art?",
            "How do we measure the authenticity of AI-generated content?"
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
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    }
});

console.debug('index.js loaded');
