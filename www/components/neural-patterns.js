// Define types
/** @typedef {{ x: number, y: number, vx: number, vy: number, connections: Set<number> }} Node */
/** @typedef {{ from: number, to: number, strength: number, pulseOffset: number }} Connection */

export class NeuralPatterns extends HTMLElement {
	constructor() {
		super();
		/** @type {Node[]} */
		this.nodes = [];
		/** @type {Connection[]} */
		this.connections = [];
		this.time = 0;
		this.speed = 0.5;
		this.complexity = 20;
		this.running = false;
		this.animationFrame = null;

		this.innerHTML = `
            <div class="neural-patterns">
                <canvas></canvas>
                <div class="controls">
                    <label>
                        Complexity
                        <input type="range" class="complexity" min="5" max="50" value="20" step="1">
                    </label>
                    <label>
                        Animation Speed
                        <input type="range" class="speed" min="1" max="100" value="50" step="1">
                    </label>
                    <button class="reset">Reset Pattern</button>
                </div>
            </div>
            <style>
                .neural-patterns {
                    width: 100%;
                    aspect-ratio: 1;
                    background: var(--background);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    position: relative;
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
                    flex-wrap: wrap;
                    gap: 1rem;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    backdrop-filter: blur(10px);
                }

                label {
                    flex: 1;
                    min-width: 150px;
                    color: white;
                }

                input[type="range"] {
                    width: 100%;
                    margin-top: 0.5rem;
                }

                button {
                    padding: 0.5rem 1rem;
                    background: var(--primary);
                    border: none;
                    border-radius: var(--radius-sm);
                    color: white;
                    cursor: pointer;
                }

                button:hover {
                    background: var(--primary-light);
                }
            </style>
        `;
	}

	initialize() {
		if (!this.canvas || !this.ctx) return;

		const width = (this.canvas.width = this.canvas.offsetWidth);
		const height = (this.canvas.height = this.canvas.offsetHeight);

		// Create nodes
		this.nodes = Array.from({ length: this.complexity }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			connections: new Set(),
		}));

		// Create connections
		this.connections = [];
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			const connectionCount = Math.floor(Math.random() * 3) + 1;

			for (let j = 0; j < connectionCount; j++) {
				const targetIndex = Math.floor(Math.random() * this.nodes.length);
				if (targetIndex !== i && !node.connections.has(targetIndex)) {
					node.connections.add(targetIndex);
					this.connections.push({
						from: i,
						to: targetIndex,
						strength: Math.random(),
						pulseOffset: Math.random() * Math.PI * 2,
					});
				}
			}
		}
	}

	startAnimation() {
		if (!this.canvas || !this.ctx) return;

		const animate = () => {
			if (!this.running || !this.canvas || !this.ctx) return;

			const width = this.canvas.width;
			const height = this.canvas.height;

			// Clear canvas with fade effect
			this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
			this.ctx.fillRect(0, 0, width, height);

			// Update and draw connections
			this.ctx.lineWidth = 2;
			this.connections.forEach((connection) => {
				const fromNode = this.nodes[connection.from];
				const toNode = this.nodes[connection.to];

				// Calculate pulse effect
				const pulse = Math.sin(this.time + connection.pulseOffset);
				const alpha = ((pulse + 1) / 2) * 0.5 + 0.1;

				// Draw connection
				this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
				this.ctx.beginPath();
				this.ctx.moveTo(fromNode.x, fromNode.y);
				this.ctx.lineTo(toNode.x, toNode.y);
				this.ctx.stroke();

				// Draw pulse
				const midX = (fromNode.x + toNode.x) / 2;
				const midY = (fromNode.y + toNode.y) / 2;
				const gradient = this.ctx.createRadialGradient(midX, midY, 0, midX, midY, 10);
				gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
				gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
				this.ctx.fillStyle = gradient;
				this.ctx.beginPath();
				this.ctx.arc(midX, midY, 10, 0, Math.PI * 2);
				this.ctx.fill();
			});

			// Update and draw nodes
			this.nodes.forEach((node) => {
				// Update position
				node.x += node.vx * this.speed;
				node.y += node.vy * this.speed;

				// Bounce off walls
				if (node.x < 0 || node.x > width) node.vx *= -1;
				if (node.y < 0 || node.y > height) node.vy *= -1;

				// Draw node
				const gradient = this.ctx.createRadialGradient(
					node.x,
					node.y,
					0,
					node.x,
					node.y,
					5,
				);
				gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
				gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
				this.ctx.fillStyle = gradient;
				this.ctx.beginPath();
				this.ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
				this.ctx.fill();
			});

			this.time += 0.02 * this.speed;
			this.animationFrame = requestAnimationFrame(animate);
		};

		animate();
	}

	setupEventListeners() {
		const complexityInput = this.querySelector('.complexity');
		const speedInput = this.querySelector('.speed');
		const resetButton = this.querySelector('.reset');

		complexityInput?.addEventListener('input', (e) => {
			if (e.target instanceof HTMLInputElement) {
				this.complexity = parseInt(e.target.value);
				this.initialize();
			}
		});

		speedInput?.addEventListener('input', (e) => {
			if (e.target instanceof HTMLInputElement) {
				this.speed = parseInt(e.target.value) / 50;
			}
		});

		resetButton?.addEventListener('click', () => {
			this.initialize();
		});
	}

	connectedCallback() {
		requestAnimationFrame(() => {
			this.canvas = this.querySelector('canvas');
			this.ctx = this.canvas?.getContext('2d');
			if (this.canvas && this.ctx) {
				// Set up resize observer to handle container size changes
				const resizeObserver = new ResizeObserver(() => {
					this.canvas.width = this.canvas.offsetWidth;
					this.canvas.height = this.canvas.offsetHeight;
					this.initialize();
				});
				resizeObserver.observe(this.canvas);

				this.running = true;
				this.setupEventListeners();
				this.initialize();
				this.startAnimation();
			}
		});
	}

	disconnectedCallback() {
		this.running = false;
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
		}
	}
}
