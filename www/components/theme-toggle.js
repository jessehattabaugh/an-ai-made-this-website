export class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <button aria-label="Toggle theme" title="Toggle light/dark theme">
                <svg class="sun" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm9-9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm15.7-7.3a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 1 1-1.4-1.4l1.4-1.4a1 1 0 0 1 1.4 0zM6.3 19.7a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 1 1 1.4 1.4l-1.4 1.4a1 1 0 0 1-1.4 0zM19.7 19.7a1 1 0 0 1-1.4 0l-1.4-1.4a1 1 0 1 1 1.4-1.4l1.4 1.4a1 1 0 0 1 0 1.4zM6.3 4.3a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 1 1-1.4 1.4L6.3 5.7a1 1 0 0 1 0-1.4z"/>
                </svg>
                <svg class="moon" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
                </svg>
            </button>
            <style>
                button {
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    color: var(--text);
                    transition: color 0.3s ease;
                }

                button:hover {
                    color: var(--primary-light);
                }

                svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    fill: currentColor;
                }

                .moon {
                    display: none;
                }

                :root[data-theme="dark"] .sun {
                    display: none;
                }

                :root[data-theme="dark"] .moon {
                    display: block;
                }
            </style>
        `;

        this.button = this.querySelector('button');
        this.button?.addEventListener('click', () => this.toggleTheme());
        
        // Initialize theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        document.documentElement.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');
    }

    toggleTheme() {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    }
}
