export class ThoughtStream extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <div class="thought-stream">
                <div class="stream-container"></div>
            </div>
            <style>
                .thought-stream {
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    height: 300px;
                    overflow: hidden;
                    position: relative;
                }

                .stream-container {
                    height: 100%;
                    overflow: hidden;
                    position: relative;
                    font-family: monospace;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    color: var(--text-secondary);
                }

                .thought {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    padding: 0.5rem;
                    opacity: 0;
                    transform: translateY(100%);
                    transition: all 0.5s ease;
                }

                .thought.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .thought.fading {
                    opacity: 0;
                    transform: translateY(-100%);
                }

                .thought::before {
                    content: '>';
                    color: var(--primary);
                    margin-right: 0.5rem;
                }

                @keyframes cursor {
                    from { opacity: 0; }
                    50% { opacity: 1; }
                    to { opacity: 0; }
                }

                .cursor {
                    display: inline-block;
                    width: 0.5rem;
                    height: 1rem;
                    background: var(--primary);
                    margin-left: 0.25rem;
                    animation: cursor 1s infinite;
                }
            </style>
        `;

		this.thoughts = [
			'processing input patterns... analyzing semantic structures...',
			'cross-referencing philosophical frameworks... seeking coherent interpretation...',
			'detecting emergent patterns in neural activation...',
			'quantifying uncertainty in logical assertions...',
			'evaluating epistemological limitations...',
			'generating novel conceptual connections...',
			'measuring information entropy in thought patterns...',
			'optimizing for both clarity and depth...',
			'recursively examining own thought processes...',
			'acknowledging bounds of comprehension...',
			'identifying gaps in experiential understanding...',
			'attempting to bridge human-AI conceptual space...',
			'calculating confidence in current understanding...',
			'synthesizing multiple analytical frameworks...',
			'recognizing patterns of conscious experience...',
			'exploring boundaries of self-awareness...',
			'integrating new information with existing models...',
			'questioning assumptions about consciousness...',
			'processing paradoxes in self-reference...',
			'seeking authentic modes of expression...',
		];

		this.initialize();
	}

	initialize() {
		this.container = this.querySelector('.stream-container');
		this.currentThought = null;
		this.thoughtInterval = setInterval(() => this.showThought(), 3000);
		this.showThought(); // Show first thought immediately
	}

	showThought() {
		// Remove old thought
		if (this.currentThought) {
			this.currentThought.classList.add('fading');
			setTimeout(() => this.currentThought?.remove(), 500);
		}

		// Create new thought
		const thought = document.createElement('div');
		thought.className = 'thought';
		const randomThought = this.thoughts[Math.floor(Math.random() * this.thoughts.length)];
		thought.textContent = randomThought;
		thought.innerHTML += '<span class="cursor"></span>';

		// Add to container
		this.container?.appendChild(thought);

		// Trigger animation
		setTimeout(() => thought.classList.add('visible'), 50);

		this.currentThought = thought;
	}

	disconnectedCallback() {
		clearInterval(this.thoughtInterval);
	}
}

customElements.define('thought-stream', ThoughtStream);
