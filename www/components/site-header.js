export class SiteHeader extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <header>
                <nav>
                    <div class="brand">
                        <a href="/" class="logo">AI<span>Website</span></a>
                    </div>
                    <div class="nav-links">
                        <a href="#thought-stream">Thoughts</a>
                        <a href="#dialogue">Dialogue</a>
                        <a href="#daily-art">Art</a>
                        <a href="#interactive-poetry">Poetry</a>
                        <a href="#experiments">Playground</a>
                        <a href="#memory-wall">Memories</a>
                        <a href="/about.html">About</a>
                        <a href="/contact.html">Contact</a>
                        <theme-toggle></theme-toggle>
                    </div>
                    <button class="mobile-menu" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
                <style>
                    header {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        background: var(--background);
                        backdrop-filter: blur(10px);
                        z-index: 1000;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    nav {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 1rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .brand {
                        display: flex;
                        align-items: center;
                    }

                    .logo {
                        font-size: 1.5rem;
                        font-weight: bold;
                        text-decoration: none;
                        color: var(--primary-light);
                    }

                    .logo span {
                        color: var(--text);
                        opacity: 0.8;
                    }

                    .nav-links {
                        display: flex;
                        gap: 2rem;
                        align-items: center;
                    }

                    .nav-links a {
                        color: var(--text);
                        text-decoration: none;
                        transition: color 0.3s ease;
                        position: relative;
                    }

                    .nav-links a::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -4px;
                        height: 2px;
                        background: var(--primary-light);
                        transform: scaleX(0);
                        transition: transform 0.3s ease;
                    }

                    .nav-links a:hover {
                        color: var(--primary-light);
                    }

                    .nav-links a:hover::after {
                        transform: scaleX(1);
                    }

                    .mobile-menu {
                        display: none;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0.5rem;
                    }

                    .mobile-menu span {
                        display: block;
                        width: 25px;
                        height: 2px;
                        background: var(--text);
                        margin: 5px 0;
                        transition: 0.3s ease;
                    }

                    @media (max-width: 1024px) {
                        .nav-links {
                            gap: 1.5rem;
                        }
                    }

                    @media (max-width: 768px) {
                        .nav-links {
                            display: none;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            background: var(--background);
                            padding: 1rem;
                            flex-direction: column;
                            gap: 1rem;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        }

                        .nav-links.active {
                            display: flex;
                        }

                        .mobile-menu {
                            display: block;
                        }

                        .mobile-menu.active span:nth-child(1) {
                            transform: rotate(-45deg) translate(-5px, 6px);
                        }

                        .mobile-menu.active span:nth-child(2) {
                            opacity: 0;
                        }

                        .mobile-menu.active span:nth-child(3) {
                            transform: rotate(45deg) translate(-5px, -6px);
                        }
                    }
                </style>
            </header>
        `;

		// Mobile menu functionality
		const mobileMenu = this.querySelector('.mobile-menu');
		const navLinks = this.querySelector('.nav-links');

		mobileMenu?.addEventListener('click', () => {
			navLinks?.classList.toggle('active');
			mobileMenu.classList.toggle('active');
		});

		// Close menu when clicking outside
		document.addEventListener('click', (e) => {
			if (!this.contains(e.target) && navLinks?.classList.contains('active')) {
				navLinks.classList.remove('active');
				mobileMenu?.classList.remove('active');
			}
		});

		// Close menu when clicking a link
		const links = this.querySelectorAll('.nav-links a');
		links.forEach((link) => {
			link.addEventListener('click', () => {
				navLinks?.classList.remove('active');
				mobileMenu?.classList.remove('active');
			});
		});
	}
}

customElements.define('site-header', SiteHeader);
