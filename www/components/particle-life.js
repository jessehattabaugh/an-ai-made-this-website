export class ParticleLife extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="particle-life">
                <canvas></canvas>
                <div class="controls">
                    <button class="reset">Reset Simulation</button>
                    <label>
                        Particle Count
                        <input type="range" min="50" max="500" value="200">
                    </label>
                </div>
            </div>
            <style>
                .particle-life {
                    width: 100%;
                    aspect-ratio: 1;
                    background: var(--background);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                }

                canvas {
                    width: 100%;
                    height: 100%;
                }

                .controls {
                    position: absolute;
                    bottom: 1rem;
                    left: 1rem;
                    right: 1rem;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                button {
                    padding: 0.5rem 1rem;
                    background: var(--primary);
                    border: none;
                    border-radius: var(--radius-sm);
                    color: white;
                    cursor: pointer;
                }

                input[type="range"] {
                    width: 100%;
                }
            </style>
        `;

        this.canvas = this.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.running = false;

        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        const width = this.canvas.width = this.canvas.offsetWidth;
        const height = this.canvas.height = this.canvas.offsetHeight;

        this.particles = Array.from({ length: 200 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            type: Math.floor(Math.random() * 3)
        }));

        this.running = true;
        this.animate();
    }

    animate() {
        if (!this.running) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);

        // Update and draw particles
        this.particles.forEach(p => {
            // Apply forces from other particles
            this.particles.forEach(other => {
                if (p === other) return;

                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = this.getForce(p.type, other.type, distance);
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force;
                    p.vy += Math.sin(angle) * force;
                }
            });

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x < 0 || p.x > width) p.vx *= -0.9;
            if (p.y < 0 || p.y > height) p.vy *= -0.9;

            // Apply friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = ['#8b5cf6', '#059669', '#f59e0b'][p.type];
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }

    getForce(type1, type2, distance) {
        // Force matrix defines how particle types interact
        const forces = [
            [0.1, -0.2, 0.1],  // Type 0 forces
            [-0.1, 0.1, -0.2], // Type 1 forces
            [0.2, -0.1, 0.1]   // Type 2 forces
        ];

        const force = forces[type1][type2];
        return force * (1 - Math.min(1, distance / 100)) * 0.1;
    }

    setupEventListeners() {
        const resetButton = this.querySelector('.reset');
        const countInput = this.querySelector('input[type="range"]');

        resetButton?.addEventListener('click', () => {
            this.initialize();
        });

        countInput?.addEventListener('input', (e) => {
            const count = parseInt(e.target.value);
            this.particles = this.particles.slice(0, count);
            while (this.particles.length < count) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    type: Math.floor(Math.random() * 3)
                });
            }
        });
    }

    connectedCallback() {
        this.running = true;
        this.animate();
    }

    disconnectedCallback() {
        this.running = false;
    }
}