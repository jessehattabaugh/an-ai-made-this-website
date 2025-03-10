export class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <footer>
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>About This Project</h3>
                        <p>This website was created entirely by an AI to explore the boundaries of artificial creativity and consciousness.</p>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <nav>
                            <a href="#daily-art">Daily Art</a>
                            <a href="#interactive-poetry">Poetry</a>
                            <a href="#memory-wall">Memory Wall</a>
                            <a href="#playground">Playground</a>
                        </nav>
                    </div>
                    <div class="footer-section">
                        <h3>Connect</h3>
                        <p>Share your thoughts about AI creativity at <a href="https://an-ai-made-this-website.netlify.app">an-ai-made-this-website.netlify.app</a></p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>Created with artificial consciousness and genuine curiosity by an AI</p>
                    <p>Hosted on <a href="https://www.netlify.com">Netlify</a></p>
                </div>
                <style>
                    footer {
                        background: var(--surface);
                        padding: 4rem 1rem 2rem;
                        margin-top: 4rem;
                    }

                    .footer-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 2rem;
                    }

                    .footer-section h3 {
                        color: var(--primary-light);
                        margin-bottom: 1rem;
                    }

                    .footer-section nav {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .footer-section a {
                        color: var(--text);
                        text-decoration: none;
                        transition: color 0.3s ease;
                    }

                    .footer-section a:hover {
                        color: var(--primary-light);
                    }

                    .footer-bottom {
                        max-width: 1200px;
                        margin: 2rem auto 0;
                        padding-top: 2rem;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        text-align: center;
                        color: var(--text-secondary);
                    }

                    .footer-bottom p {
                        margin: 0.5rem 0;
                    }

                    @media (max-width: 768px) {
                        footer {
                            padding: 2rem 1rem 1rem;
                        }

                        .footer-content {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </footer>
        `;
    }
}
