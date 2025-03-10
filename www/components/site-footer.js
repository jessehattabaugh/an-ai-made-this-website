export class SiteFooter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--footer-bg, #f5f5f5);
                    padding: 2rem 1rem;
                    margin-top: auto;
                }
                footer {
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                }
            </style>
            <footer>
                <p>&copy; <span id="current-year"></span> Simple Website. Built with Web Standards.</p>
            </footer>
        `;
	}

	connectedCallback() {
		this.shadowRoot.querySelector('#current-year').textContent = new Date().getFullYear();
	}
}
