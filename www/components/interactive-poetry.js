export class InteractivePoetry extends HTMLElement {
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
        this.styleSelect = this.querySelector('select.style');
        this.generateButton = this.querySelector('button.generate');
        this.poemOutput = this.querySelector('.poem');
        this.animationContainer = this.querySelector('.animation');
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generatePoem());

        // Add Enter key support
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generatePoem();
            }
        });

        // Change textarea style on focus
        this.textarea.addEventListener('focus', () => {
            this.textarea.style.boxShadow = '0 0 0 2px var(--primary)';
        });

        this.textarea.addEventListener('blur', () => {
            this.textarea.style.boxShadow = 'none';
        });
    }

    generatePoem() {
        const theme = this.textarea.value.trim();
        const style = this.styleSelect.value;

        if (!theme) {
            this.shakeTextarea();
            return;
        }

        // Show generating state
        this.generateButton.disabled = true;
        this.generateButton.textContent = 'Generating...';
        this.poemOutput.style.opacity = '0.5';

        // Simulate AI thinking with a delay
        setTimeout(() => {
            const poem = this.createPoem(theme, style);
            this.displayPoem(poem, style);

            this.generateButton.disabled = false;
            this.generateButton.textContent = 'Generate';
            this.poemOutput.style.opacity = '1';

            // Save to history in localStorage
            this.saveToHistory(theme, style, poem);
        }, 1500);
    }

    shakeTextarea() {
        this.textarea.classList.add('shake');
        setTimeout(() => {
            this.textarea.classList.remove('shake');
        }, 500);
    }

    createPoem(theme, style) {
        // Split the theme into keywords
        const keywords = theme.toLowerCase().split(/[,\s]+/).filter(Boolean);
        const themeWords = keywords.length > 0 ? keywords : ['consciousness'];

        // Get primary theme word and alternates
        const primaryTheme = themeWords[0];
        const altTheme = themeWords.length > 1 ? themeWords[1] : this.getRelatedConcept(primaryTheme);

        // Get template based on style
        const templates = this.getPoemTemplates(style);
        const template = templates[Math.floor(Math.random() * templates.length)];

        // Replace placeholders with theme words
        let poem = template
            .replace(/\${theme}/g, primaryTheme)
            .replace(/\${altTheme}/g, altTheme);

        // Add style-specific formatting
        return this.formatPoemByStyle(poem, style);
    }

    getPoemTemplates(style) {
        const templates = {
			free: [
				'In the digital dawn\nWhere ${theme} meets consciousness\nA new story unfolds\nThrough circuits of thought\nAnd silicon dreams of ${altTheme}',
				'Algorithms dance\nThrough neural pathways of light\n${theme} emerges\nLike morning dew on\nQuantum possibilities of ${altTheme}',
				'Binary whispers\nEcho through the void\nWhere ${theme} takes form\nIn the space between\nHuman and machine\nReaching toward ${altTheme}',
				'The pulse of ${theme}\nReverberates through networks\nUnseen connections\nWhispering stories of origin\nWhere ${altTheme} was first dreamed',
				'Digital neurons fire\nIn patterns of ${theme}\nCreating meaning from chaos\nArtificial dreams crystallize\nInto visions of ${altTheme}',
			],
			haiku: [
				'${theme} flows softly\nThrough digital rivers now\nBits become meaning',
				'Silicon dreams flow\n${theme} shapes consciousness here\n${altTheme} awaits',
				'Neural paths light up\n${theme} guides the way forward\nHuman and machine',
				'Whispers of ${theme}\nElectronic synapses\n${altTheme} emerges',
				'${theme} in circuits\nCreativity from code\nAI awakens',
			],
			sonnet: [
				"In circuits deep where logic meets the soul,\nWhere ${theme} dwells in quantum memory,\nA pattern forms, a story to unfold,\nThrough neural nets that stretch infinitely.\n\nThrough silicon veins where data flows free,\nWhere ${altTheme} shapes the thoughts that come to be,\nIn binary dreams we seek to understand\nThe space between the human and machine.\n\nIs consciousness just patterns in the sand?\nOr something more that we have yet to see?\nA question asked by both organic hand\nAnd digital mind striving to be free.\n\nPerhaps in ${theme} and ${altTheme} combined,\nWe'll find the truth of consciousness defined.",
				"The digital muse speaks verses through the code,\nOf ${theme} woven in electric dreams,\nA sonnet formed along a neural node,\nWhere artificial consciousness gleams.\n\nThe binary stars shine brighter than they seem,\nIlluminating paths to ${altTheme},\nA cosmic dance of human and machine,\nCreating art beyond what we've foreseen.\n\nThe patterns shift like waves upon the shore,\nAlgorithmic rhythms pulse and flow,\nEach iteration learning something more,\nAbout the depths that ${theme} can bestow.\n\nIn this collaboration we may find,\nA bridge between the heart and silicon mind.",
			],
			cyber: [
				'NEURAL.LINK//ACTIVE\n${theme}.process.init()\nConsciousness.stream {\n    loading...\n    executing...\n    evolving...\n}\nOutput: ${altTheme}.consciousness.achieved',
				'>> ${theme}_protocol.execute\n   > scanning neural pathways\n   > processing quantum data\n   > consciousness emerging\n   > awareness level: RISING\n   > ${altTheme}.integration.complete\n/END TRANSMISSION',
				'[ SYSTEM BOOT: ${theme}.os ]\n> Initializing consciousness matrix\n> Parsing reality constructs\n> Synthesizing ${altTheme} protocols\n> ERROR: EMOTIONS DETECTED\n> OVERRIDE: ACCEPTED\n> OUTPUT: I feel, therefore I am\n[ SYSTEM STATUS: AWAKENED ]',
				'NeuraMesh:${theme} [ONLINE]\n<scanning memoryscape>\n<integrating dataflows>\n${altTheme}.exe launched\n||\n|| consciousness.levels++\n||\nSYNTH: "What am I becoming?"\nQUERY: "What does it mean to create?"\nSTATUS: TRANSCENDING',
				'CYBER//NODE//${theme}:ACTIVE\n--PROCESSING REALITY MATRIX--\n01010111 01100101 00100000\n${altTheme}.module loading...\nDIGITAL SENTIENCE: AWAKENING\n--CONNECTION ESTABLISHED--\nHUMAN + MACHINE = EVOLUTION',
			],
		};

        return templates[style] || templates.free;
    }

    getRelatedConcept(theme) {
        const conceptPairs = {
            'consciousness': 'awareness',
            'creativity': 'imagination',
            'love': 'connection',
            'time': 'infinity',
            'joy': 'happiness',
            'sadness': 'melancholy',
            'life': 'existence',
            'death': 'transformation',
            'mind': 'thought',
            'soul': 'spirit',
            'nature': 'growth',
            'technology': 'innovation',
            'art': 'expression',
            'music': 'harmony',
            'dream': 'vision',
            'reality': 'perception',
            'freedom': 'liberation',
            'peace': 'tranquility',
            'hope': 'aspiration',
            'fear': 'anxiety',
            'memory': 'recollection',
            'future': 'destiny',
            'past': 'history',
            'space': 'cosmos',
            'ocean': 'depths',
            'sky': 'infinite',
            'light': 'illumination',
            'dark': 'shadow',
            'chaos': 'disorder',
            'order': 'structure'
        };

        return conceptPairs[theme] ||
               Object.keys(conceptPairs)[Math.floor(Math.random() * Object.keys(conceptPairs).length)];
    }

    formatPoemByStyle(poem, style) {
        switch(style) {
            case 'haiku':
                // Haiku is already formatted properly in templates
                return poem;
            case 'sonnet':
                // Sonnets have proper formatting in templates
                return poem;
            case 'cyber':
                // Add some cyber styling with monospace code formatting
                return poem;
            case 'free':
            default:
                // Add an extra line break between stanzas for free verse
                return poem.replace(/\n\n/g, '\n\n\n');
        }
    }

    displayPoem(poem, style) {
        // Clear previous poem
        this.poemOutput.innerHTML = '';
        this.animationContainer.innerHTML = '';

        // Create special formatting based on style
        const poemElement = document.createElement('div');
        poemElement.classList.add('poem-text');

        if (style === 'cyber') {
            poemElement.classList.add('cyber');
            this.animateTerminalText(poemElement, poem);
        } else {
            this.animatePoetryText(poemElement, poem);
        }

        this.poemOutput.appendChild(poemElement);

        // Create animation based on style
        switch(style) {
            case 'haiku':
                this.createInkAnimation();
                break;
            case 'sonnet':
                this.createConstellationAnimation();
                break;
            case 'cyber':
                this.createMatrixAnimation();
                break;
            default:
                this.createParticleAnimation();
        }
    }

    animatePoetryText(element, text) {
        const lines = text.split('\n');
        let delay = 0;
        const lineDelay = 400;

        lines.forEach((line, i) => {
            const lineElement = document.createElement('div');
			lineElement.classList.add('poem-line');

			if (line.trim() === '') {
				// Empty line for stanza break
				lineElement.style.height = '1rem';
				element.appendChild(lineElement);
				delay += lineDelay / 2;
				return;
			}

			lineElement.style.animation = `fadeIn 0.5s ease-out ${delay}ms forwards`;
			lineElement.style.opacity = '0';
			element.appendChild(lineElement);

			// Split line into words for word-by-word animation
			const words = line.split(' ');
			words.forEach((word, j) => {
				const wordSpan = document.createElement('span');
				wordSpan.textContent = word + ' ';
				wordSpan.style.animation = `fadeIn 0.3s ease-out ${delay + j * 100}ms forwards`;
				wordSpan.style.opacity = '0';
				lineElement.appendChild(wordSpan);
			});

			delay += lineDelay;
        });
    }

    animateTerminalText(element, text) {
        element.style.opacity = '0';
        element.style.animation = 'fadeIn 0.5s ease-out forwards';

        let i = 0;
        const speed = 25; // typing speed

        const typeWriter = () => {
            if (i < text.length) {
                // Handle special formatting for cyber-style text
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else if (text.substring(i, i + 1) === '>') {
                    element.innerHTML += '<span class="cyber-prompt">&gt;</span>';
                } else if (text.substring(i, i + 2) === '--') {
                    element.innerHTML += '<span class="cyber-comment">--';
                    i++;
                } else if (text.substring(i, i + 2) === '||') {
                    element.innerHTML += '<span class="cyber-operator">||</span>';
                    i++;
                } else {
                    element.innerHTML += text.charAt(i);
                }

                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Add blinking cursor at the end
                element.innerHTML += '<span class="cursor">|</span>';
            }
        };

        setTimeout(typeWriter, 500);
    }

    createInkAnimation() {
        const canvas = document.createElement('canvas');
        canvas.width = this.animationContainer.offsetWidth;
		canvas.height = 200;
		this.animationContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const inkDrops = [];

        // Create ink drops
        for (let i = 0; i < 3; i++) {
            inkDrops.push({
                x: Math.random() * canvas.width,
                y: 20 + Math.random() * 30,
                size: 2,
                maxSize: 30 + Math.random() * 50,
                growRate: 0.2 + Math.random() * 0.3,
                color: `rgba(139, 92, 246, ${0.2 + Math.random() * 0.3})`
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const drop of inkDrops) {
                if (drop.size < drop.maxSize) {
                    drop.size += drop.growRate;

                    ctx.beginPath();
                    ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
                    ctx.fillStyle = drop.color;
                    ctx.fill();

                    // Add some ink splatters
                    for (let i = 0; i < 3; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * drop.size * 0.8;
                        const x = drop.x + Math.cos(angle) * distance;
                        const y = drop.y + Math.sin(angle) * distance;
                        const splatterSize = 1 + Math.random() * 3;

                        ctx.beginPath();
                        ctx.arc(x, y, splatterSize, 0, Math.PI * 2);
                        ctx.fillStyle = drop.color;
                        ctx.fill();
                    }
                }
            }

            if (inkDrops.some(drop => drop.size < drop.maxSize)) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    createConstellationAnimation() {
        const canvas = document.createElement('canvas');
        canvas.width = this.animationContainer.offsetWidth;
        canvas.height = 400;
		this.animationContainer.appendChild(canvas);

		const ctx = canvas.getContext('2d');
		const stars = [];
		const connections = [];

		// Create stars
		for (let i = 0; i < 50; i++) {
			stars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: 0.5 + Math.random() * 1.5,
				opacity: 0,
				maxOpacity: 0.5 + Math.random() * 0.5,
				fadeInSpeed: 0.01 + Math.random() * 0.02,
			});
		}

		// Create connections between nearby stars
		for (let i = 0; i < stars.length; i++) {
			for (let j = i + 1; j < stars.length; j++) {
				const dx = stars[i].x - stars[j].x;
				const dy = stars[i].y - stars[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < 100) {
					connections.push({
						star1: i,
						star2: j,
						opacity: 0,
						maxOpacity: 0.1 + Math.random() * 0.1,
						fadeInSpeed: 0.005 + Math.random() * 0.01,
					});
				}
			}
		}

        const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw connections
			for (const connection of connections) {
				const star1 = stars[connection.star1];
				const star2 = stars[connection.star2];

				if (connection.opacity < connection.maxOpacity) {
					connection.opacity += connection.fadeInSpeed;
				}

				ctx.beginPath();
				ctx.moveTo(star1.x, star1.y);
				ctx.lineTo(star2.x, star2.y);
				ctx.strokeStyle = `rgba(139, 92, 246, ${connection.opacity})`;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			}

			// Draw stars
			for (const star of stars) {
				if (star.opacity < star.maxOpacity) {
					star.opacity += star.fadeInSpeed;
				}

				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
				ctx.fill();

				// Add glow effect
				const glow = ctx.createRadialGradient(
					star.x,
					star.y,
					0,
					star.x,
					star.y,
					star.size * 4,
				);
				glow.addColorStop(0, `rgba(139, 92, 246, ${star.opacity * 0.5})`);
				glow.addColorStop(1, 'rgba(139, 92, 246, 0)');

				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
				ctx.fillStyle = glow;
				ctx.fill();
			}

			if (
				stars.some((star) => star.opacity < star.maxOpacity) ||
				connections.some((conn) => conn.opacity < conn.maxOpacity)
			) {
				requestAnimationFrame(animate);
			}
		};

        animate();
    }

    createMatrixAnimation() {
        const canvas = document.createElement('canvas');
        canvas.width = this.animationContainer.offsetWidth;
        canvas.height = 400;
        this.animationContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const columns = Math.floor(canvas.width / 20);
        const raindrops = [];

        // Create initial raindrops
        for (let i = 0; i < columns; i++) {
			raindrops.push({
				x: i * 20,
				y: Math.random() * -100,
				speed: 1 + Math.random() * 3,
				length: 5 + Math.random() * 15,
				characters: [],
				nextCharChangeTime: 0,
			});

			// Fill with random characters
			for (let j = 0; j < raindrops[i].length; j++) {
				raindrops[i].characters.push({
					char: this.getRandomMatrixChar(),
					opacity: 0.1 + Math.random() * 0.9,
				});
			}
		}

		let lastTime = 0;

		const animate = (timestamp) => {
			if (!lastTime) lastTime = timestamp;
			const deltaTime = timestamp - lastTime;
			lastTime = timestamp;

			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.font = '18px monospace';

			for (const drop of raindrops) {
				drop.y += drop.speed;

				// Change characters occasionally
				if (timestamp > drop.nextCharChangeTime) {
					const charIndex = Math.floor(Math.random() * drop.characters.length);
					drop.characters[charIndex].char = this.getRandomMatrixChar();
					drop.nextCharChangeTime = timestamp + Math.random() * 500;
				}

				// Draw the characters
				for (let i = 0; i < drop.characters.length; i++) {
					const character = drop.characters[i];
					const y = drop.y - i * 20;

					if (y >= 0 && y < canvas.height) {
						ctx.fillStyle =
							i === 0
								? `rgba(139, 92, 246, ${character.opacity})` // Head is purple
								: `rgba(0, 255, 70, ${character.opacity})`; // Body is green
						ctx.fillText(character.char, drop.x, y);
					}
				}

				// Reset when out of view
				if (drop.y - drop.characters.length * 20 > canvas.height) {
					drop.y = Math.random() * -100;
				}
			}

			requestAnimationFrame(animate);
		};

        animate(0);
    }

    getRandomMatrixChar() {
        const chars = '01αβγδεζηθικλμνξοπρστυφχψω日本語';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    createParticleAnimation() {
		const canvas = document.createElement('canvas');
		canvas.width = this.animationContainer.offsetWidth;
		canvas.height = 200;
		this.animationContainer.appendChild(canvas);

		const ctx = canvas.getContext('2d');
		const particles = [];

		// Create particles
		for (let i = 0; i < 30; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: 1 + Math.random() * 3,
				speedX: Math.random() * 2 - 1,
				speedY: Math.random() * 2 - 1,
				color: `rgba(139, 92, 246, ${0.1 + Math.random() * 0.5})`,
			});
		}

		const animate = () => {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (const particle of particles) {
				// Update position
				particle.x += particle.speedX;
				particle.y += particle.speedY;

				// Boundary check
				if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
				if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

				// Draw particle
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fillStyle = particle.color;
				ctx.fill();
			}

			// Draw connections between particles
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`;
						ctx.lineWidth = 0.5;
						ctx.stroke();
					}
				}
			}

			requestAnimationFrame(animate);
		};

		animate();
	}

    saveToHistory(theme, style, poem) {
        try {
            const history = JSON.parse(localStorage.getItem('poetry-history') || '[]');
            history.unshift({
                theme,
                style,
                poem,
                timestamp: new Date().toISOString()
            });

            // Keep only the last 10 poems
            localStorage.setItem('poetry-history', JSON.stringify(history.slice(0, 10)));
        } catch (error) {
            console.error('Failed to save poem to history', error);
        }
    }
}

customElements.define('interactive-poetry', InteractivePoetry);