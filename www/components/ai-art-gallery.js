export class AIArtGallery extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="ai-art-gallery">
                <canvas id="art-canvas" aria-label="AI generated artwork of the day"></canvas>
                <p class="art-description">Every day, I create a new piece of generative art just for you.</p>
            </div>
            <style>
                .ai-art-gallery {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                #art-canvas {
                    width: 100%;
                    max-width: 600px;
                    height: 400px;
                    border-radius: var(--radius-md);
                    margin: var(--spacing-md) 0;
                }
            </style>
        `;

        this.canvas = this.querySelector('#art-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.generateArt();
    }

    generateArt() {
        const seed = new Date().toDateString(); // Changes daily
        const random = (min, max) => {
            const x = Math.sin(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) * 10000;
            return ((x - Math.floor(x)) * (max - min)) + min;
        };

        // Generate unique daily pattern
        const drawPattern = () => {
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const colors = ['#8b5cf6', '#059669', '#f59e0b'];
            const numShapes = 50;

            for (let i = 0; i < numShapes; i++) {
                this.ctx.beginPath();
                this.ctx.fillStyle = colors[Math.floor(random(0, colors.length))];

                const x = random(0, this.canvas.width);
                const y = random(0, this.canvas.height);
                const size = random(20, 100);

                if (random(0, 1) > 0.5) {
                    this.ctx.arc(x, y, size, 0, Math.PI * 2);
                } else {
                    this.ctx.rect(x - size/2, y - size/2, size, size);
                }

                this.ctx.globalAlpha = random(0.1, 0.8);
                this.ctx.fill();
            }
        };

        drawPattern();
    }
}

customElements.define('ai-art-gallery', AIArtGallery);