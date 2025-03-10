export class ThemeToggle extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                button {
                    background: none;
                    border: 1px solid currentColor;
                    border-radius: 4px;
                    padding: 8px 16px;
                    cursor: pointer;
                }
            </style>
            <button part="button">
                <slot>Toggle Theme</slot>
            </button>
        `;
		this._button = this.shadowRoot.querySelector('button');
		this._button.addEventListener('click', () => this._toggleTheme());
	}

	_toggleTheme() {
		const isDark = document.documentElement.classList.toggle('dark-theme');
		this.dispatchEvent(
			new CustomEvent('theme-change', {
				detail: { isDark },
				bubbles: true,
			}),
		);
	}
}
