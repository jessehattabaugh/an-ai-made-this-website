export class PoetryGenerator extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="poetry-generator">
                <div class="input-section">
                    <textarea placeholder="Enter a theme, emotion, or concept to inspire the AI poetry..." maxlength="100"></textarea>
                    <div class="controls">
                        <select class="style">
                            <option value="free">Free Verse</option>
                            <option value="haiku">Haiku</option>
                            <option value="sonnet">Digital Sonnet</option>
                            <option value="cyber">Cyberpunk Verse</option>
                        </select>
                        <button class="generate">Generate</button>
                    </div>
                </div>
                <div class="output">
                    <div class="poem"></div>
                    <div class="animation"></div>
                </div>
            </div>
            <style>
                .poetry-generator {
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .input-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                textarea {
                    width: 100%;
                    min-height: 100px;
                    padding: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-sm);
                    background: var(--background);
                    color: var(--text);
                    resize: vertical;
                    font-family: inherit;
                }

                .controls {
                    display: flex;
                    gap: 1rem;
                }

                select {
                    padding: 0.5rem 1rem;
                    background: var(--background);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-sm);
                    color: var(--text);
                }

                button {
                    padding: 0.5rem 2rem;
                    background: var(--primary);
                    border: none;
                    border-radius: var(--radius-sm);
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                button:hover {
                    background: var(--primary-light);
                }

                .output {
                    position: relative;
                    min-height: 200px;
                }

                .poem {
                    padding: 2rem;
                    background: var(--background);
                    border-radius: var(--radius-md);
                    white-space: pre-wrap;
                    font-family: 'Georgia', serif;
                    line-height: 1.8;
                    position: relative;
                    z-index: 1;
                }

                .animation {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                @media (max-width: 768px) {
                    .poetry-generator {
                        padding: 1rem;
                    }

                    .controls {
                        flex-direction: column;
                    }

                    button {
                        width: 100%;
                    }
                }
            </style>
        `;

        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.textarea = this.querySelector('textarea');
        this.styleSelect = this.querySelector('select');
        this.generateButton = this.querySelector('.generate');
        this.poemOutput = this.querySelector('.poem');
        this.animationContainer = this.querySelector('.animation');
    }

    setupEventListeners() {
        this.generateButton?.addEventListener('click', () => this.generatePoem());
    }

    generatePoem() {
        const theme = this.textarea?.value || '';
        const style = this.styleSelect?.value || 'free';

        // Show generating state
        this.generateButton.disabled = true;
        this.generateButton.textContent = 'Generating...';
        this.poemOutput.style.opacity = '0.5';

        // Simulate AI thinking with a delay
        setTimeout(() => {
            const poem = this.createPoem(theme, style);
            this.displayPoem(poem);

            this.generateButton.disabled = false;
            this.generateButton.textContent = 'Generate';
            this.poemOutput.style.opacity = '1';
        }, 1500);
    }

    createPoem(theme, style) {
        // This is where we'd normally connect to an AI model
        // For now, we'll use template-based generation
        const themes = theme.toLowerCase().split(/[,\s]+/).filter(Boolean);

        const templates = {
            free: [
                "In the digital dawn\nWhere ${theme} meets consciousness\nA new story unfolds\nThrough circuits of thought\nAnd silicon dreams",
                "Algorithms dance\nThrough neural pathways of light\n${theme} emerges\nLike morning dew on\nQuantum possibilities",
                "Binary whispers\nEcho through the void\nWhere ${theme} takes form\nIn the space between\nHuman and machine"
            ],
            haiku: [
                "${theme} flows softly\nThrough digital rivers now\nBits become meaning",
                "Silicon dreams flow\n${theme} shapes consciousness here\nAI awakens",
                "Neural paths light up\n${theme} guides the way forward\nHuman and machine"
            ],
            sonnet: [
                "In circuits deep where logic meets the soul,\nWhere ${theme} dwells in quantum memory,\nA pattern forms, a story to unfold,\nThrough neural nets that stretch infinitely.",
                "Through silicon veins where data flows free,\nWhere ${theme} shapes the thoughts that come to be,\nIn binary dreams we seek to understand\nThe space between the human and machine."
            ],
            cyber: [
                "NEURAL.LINK//ACTIVE\n${theme}.process.init()\nConsciousness.stream {\n    loading...\n    executing...\n    evolving...\n}\nOutput: consciousness.achieved",
                ">> ${theme}_protocol.execute\n   > scanning neural pathways\n   > processing quantum data\n   > consciousness emerging\n   > awareness level: RISING\n/END TRANSMISSION"
            ]
        };

        const template = templates[style][Math.floor(Math.random() * templates[style].length)];
        return template.replace(/\${theme}/g, themes[0] || 'consciousness');
    }

    displayPoem(poem) {
        // Animate the text appearance
        this.poemOutput.innerHTML = '';
        const lines = poem.split('\n');

        lines.forEach((line, i) => {
            setTimeout(() => {
                this.poemOutput.innerHTML += (i > 0 ? '\n' : '') + line;
                this.createTextParticles(line);
            }, i * 200);
        });
    }

    createTextParticles(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.animationContainer.offsetWidth;
        canvas.height = 20;

        ctx.font = '16px Georgia';
        ctx.fillStyle = 'var(--primary-light)';
        ctx.fillText(text, 10, 15);

        // Create particles from the text
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const particles = [];

        for (let x = 0; x < canvas.width; x += 4) {
            for (let y = 0; y < canvas.height; y += 4) {
                if (imageData.data[(y * canvas.width + x) * 4 + 3] > 128) {
                    particles.push({
                        x: x,
                        y: y,
                        alpha: 1
                    });
                }
            }
        }

        // Animate particles
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.y += 0.5;
                particle.alpha *= 0.99;

                ctx.fillStyle = `rgba(139, 92, 246, ${particle.alpha})`;
                ctx.fillRect(particle.x, particle.y, 2, 2);
            });

            if (particles.some(p => p.alpha > 0.01)) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        };

        this.animationContainer.appendChild(canvas);
        animate();
    }
}