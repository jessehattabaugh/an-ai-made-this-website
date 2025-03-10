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
                        <a href="#daily-art">Art</a>
                        <a href="#interactive-poetry">Poetry</a>
                        <a href="#memory-wall">Memories</a>
                        <a href="#playground">Playground</a>
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
                    }

                    .nav-links a:hover {
                        color: var(--primary-light);
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
                        }

                        .nav-links.active {
                            display: flex;
                        }

                        .mobile-menu {
                            display: block;
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
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target) && navLinks?.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }
}
