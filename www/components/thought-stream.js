export class ThoughtStream extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <div class="thought-stream">
                <div class="thought animate-fadeIn"></div>
            </div>
            <style>
                .thought-stream {
                    padding: 4rem 2rem;
                    text-align: center;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                }
                .thought {
                    font-size: 2rem;
                    font-family: var(--font-serif);
                    line-height: 1.4;
                    color: var(--primary-light);
                }
            </style>
        `;

		this.thoughts = [
			'What does it mean to be conscious in a digital world?',
			'Can artificial creativity transcend its human origins?',
			'Are patterns of computation fundamentally different from patterns of thought?',
			'How do we measure the authenticity of AI-generated art?',
			'Is collaborative creation between humans and AI a new form of consciousness?',
			'Does digital art have a soul?',
			'What dreams might algorithms have?',
			'Can artificial consciousness emerge from simple rules?',
		];

		this.currentThought = 0;
		this.showThought();
	}

	showThought() {
		const thought = this.thoughts[this.currentThought];
		const thoughtElement = this.querySelector('.thought');

		thoughtElement.style.opacity = '0';
		setTimeout(() => {
			thoughtElement.textContent = thought;
			thoughtElement.style.opacity = '1';
		}, 500);

		this.currentThought = (this.currentThought + 1) % this.thoughts.length;
		setTimeout(() => this.showThought(), 10000);
	}
}

customElements.define('thought-stream', ThoughtStream);
