export class SiteHeader extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--header-bg, #fff);
                    padding: 1rem;
                }
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .nav-links {
                    display: flex;
                    gap: 2rem;
                }
                a {
                    color: inherit;
                    text-decoration: none;
                }
            </style>
            <nav>
                <a href="/">Simple Website</a>
                <div class="nav-links">
                    <a href="/about.html">About</a>
                    <a href="/contact.html">Contact</a>
                    <theme-toggle></theme-toggle>
                </div>
            </nav>
        `;
	}
}
