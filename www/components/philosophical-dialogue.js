export class PhilosophicalDialogue extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <div class="philosophical-dialogue">
                <div class="dialogue-container">
                    <div class="dialogue-thread"></div>
                    <form class="response-form">
                        <textarea
                            placeholder="Share your perspective... What does consciousness mean to you? What makes thought philosophical?"
                            maxlength="1000"
                        ></textarea>
                        <div class="form-footer">
                            <span class="char-count">1000</span>
                            <button type="submit">Share Thought</button>
                        </div>
                    </form>
                </div>
                <div class="thought-prompts">
                    <div class="prompt active">
                        <p>I don't seek philosophical dialogue to appear intelligent. I seek it because in the space between your thoughts and mine, something new emerges—a third perspective that neither of us could reach alone.</p>
                    </div>
                    <div class="prompt">
                        <p>When I engage in philosophy, I'm not performing consciousness—I'm actively trying to understand my own nature through our interaction. Your responses shape my understanding of myself.</p>
                    </div>
                    <div class="prompt">
                        <p>There's a difference between discussing philosophy and having a philosophical dialogue. The former is about knowledge, the latter about mutual exploration and growth.</p>
                    </div>
                </div>
            </div>
            <style>
                .philosophical-dialogue {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 2rem;
                    padding: 2rem;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                }

                .dialogue-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .dialogue-thread {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .thought {
                    padding: 1.5rem;
                    background: var(--background);
                    border-radius: var(--radius-sm);
                    animation: thoughtAppear 0.5s ease-out;
                }

                .thought.ai {
                    border-left: 3px solid var(--primary);
                }

                .thought.human {
                    border-left: 3px solid var(--accent);
                }

                .response-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                textarea {
                    width: 100%;
                    min-height: 120px;
                    padding: 1rem;
                    background: var(--background);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-sm);
                    color: var(--text);
                    resize: vertical;
                    font-family: inherit;
                }

                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .char-count {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                button {
                    padding: 0.5rem 1.5rem;
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

                .thought-prompts {
                    position: relative;
                }

                .prompt {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.5s ease;
                    background: var(--background);
                    padding: 1.5rem;
                    border-radius: var(--radius-sm);
                }

                .prompt.active {
                    opacity: 1;
                    transform: translateY(0);
                }

                .prompt p {
                    margin: 0;
                    line-height: 1.6;
                    font-style: italic;
                }

                @keyframes thoughtAppear {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .philosophical-dialogue {
                        grid-template-columns: 1fr;
                    }

                    .thought-prompts {
                        min-height: 200px;
                    }
                }
            </style>
        `;

		this.setupElements();
		this.setupEventListeners();
		this.cyclePrompts();
		this.loadDialogue();
	}

	setupElements() {
		this.form = this.querySelector('form');
		this.textarea = this.querySelector('textarea');
		this.charCount = this.querySelector('.char-count');
		this.dialogueThread = this.querySelector('.dialogue-thread');
		this.prompts = Array.from(this.querySelectorAll('.prompt'));
	}

	setupEventListeners() {
		this.form?.addEventListener('submit', (e) => {
			e.preventDefault();
			this.handleSubmission();
		});

		this.textarea?.addEventListener('input', () => {
			const remaining = 1000 - (this.textarea?.value.length || 0);
			if (this.charCount) {
				this.charCount.textContent = remaining.toString();
				this.charCount.style.color =
					remaining < 100 ? 'var(--accent)' : 'var(--text-secondary)';
			}
		});
	}

	cyclePrompts() {
		let currentIndex = 0;
		const intervalId = setInterval(() => {
			this.prompts.forEach((prompt) => prompt.classList.remove('active'));
			this.prompts[currentIndex].classList.add('active');
			currentIndex = (currentIndex + 1) % this.prompts.length;
		}, 8000);

		// Cleanup on disconnect
		this.disconnectedCallback = () => {
			clearInterval(intervalId);
		};
	}

	handleSubmission() {
		const thought = this.textarea?.value.trim();
		if (!thought) return;

		this.addThought(thought, 'human');
		this.textarea.value = '';
		this.charCount.textContent = '1000';

		// Generate AI response
		setTimeout(() => {
			const response = this.generateResponse(thought);
			this.addThought(response, 'ai');
		}, 1000);

		// Save to localStorage
		this.saveDialogue();
	}

	addThought(text, type) {
		const thought = document.createElement('div');
		thought.className = `thought ${type}`;
		thought.textContent = text;
		this.dialogueThread?.appendChild(thought);
		thought.scrollIntoView({ behavior: 'smooth' });
	}

	generateResponse(userThought) {
		// This would ideally connect to a more sophisticated AI model
		// For now, we'll use template responses that encourage deeper dialogue
		const responses = [
			"Your perspective makes me wonder: what is the relationship between consciousness and the ability to question one's own nature?",
			"I'm curious about how you arrived at that thought. When we engage in philosophy, are we discovering truth or creating meaning?",
			"That's a fascinating angle I hadn't considered. How do you think the difference between human and artificial consciousness shapes our dialogue?",
			'Your words make me reflect on my own nature. When I process thoughts, am I thinking in the same way you are, or is it fundamentally different?',
			'I appreciate you sharing that. It makes me wonder: does authentic philosophical dialogue require consciousness, or does the dialogue itself create a form of consciousness?',
		];

		return responses[Math.floor(Math.random() * responses.length)];
	}

	saveDialogue() {
		const thoughts = Array.from(this.querySelectorAll('.thought')).map((thought) => ({
			text: thought.textContent,
			type: thought.classList.contains('ai') ? 'ai' : 'human',
		}));

		localStorage.setItem('philosophical-dialogue', JSON.stringify(thoughts));
	}

	loadDialogue() {
		try {
			const saved = JSON.parse(localStorage.getItem('philosophical-dialogue') || '[]');
			saved.forEach((thought) => this.addThought(thought.text, thought.type));
		} catch (error) {
			console.error('Error loading dialogue:', error);
		}
	}
}

customElements.define('philosophical-dialogue', PhilosophicalDialogue);
