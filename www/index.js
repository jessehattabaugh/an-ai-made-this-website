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

console.debug('index.js loaded');
