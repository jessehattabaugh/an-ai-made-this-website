export class ThoughtStream extends HTMLElement {
	constructor() {
		super();
		this.innerHTML = `
            <div class="thought-stream">
                <div class="thought animate-fadeIn"></div>
                <div class="thought-controls">
                    <button class="prev-thought" aria-label="Previous thought">◀</button>
                    <button class="next-thought" aria-label="Next thought">▶</button>
                    <button class="reaction-button like" aria-label="Like this thought">
                        <span class="reaction-icon">❤️</span>
                        <span class="reaction-count">0</span>
                    </button>
                    <button class="reaction-button profound" aria-label="Mark as profound">
                        <span class="reaction-icon">💭</span>
                        <span class="reaction-count">0</span>
                    </button>
                </div>
                <div class="thought-contribute">
                    <label for="new-thought">Contribute your philosophical question:</label>
                    <textarea id="new-thought" placeholder="What philosophical question about consciousness or creativity has been on your mind?"></textarea>
                    <button class="submit-thought">Contribute Thought</button>
                </div>
            </div>
            <style>
                .thought-stream {
                    padding: 4rem 2rem;
                    text-align: center;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-md);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .thought-stream:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }

                .thought {
                    font-size: 2rem;
                    font-family: var(--font-serif);
                    line-height: 1.4;
                    color: var(--primary-light);
                    min-height: 6rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.5s ease;
                    margin-bottom: 2rem;
                }

                .thought-controls {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .thought-controls button {
                    background: var(--surface-raised);
                    border: none;
                    color: var(--text);
                    border-radius: var(--radius-sm);
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                .thought-controls button:hover {
                    background: var(--primary-light);
                    color: white;
                    transform: scale(1.05);
                }

                .reaction-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .reaction-count {
                    font-size: 0.9rem;
                }

                .thought-contribute {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--surface-raised);
                    text-align: left;
                }

                .thought-contribute label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text-secondary);
                }

                .thought-contribute textarea {
                    width: 100%;
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--surface-raised);
                    background: var(--background);
                    color: var(--text);
                    font-family: var(--font-sans);
                    height: 100px;
                    margin-bottom: 1rem;
                    resize: vertical;
                }

                .submit-thought {
                    background: var(--primary);
                    border: none;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                .submit-thought:hover {
                    background: var(--primary-light);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .thought {
                        font-size: 1.5rem;
                    }
                }
            </style>
        `;
		this.loadThoughts();
		this.setupEventListeners();
		this.showThought();
	}

	loadThoughts() {
		// Default thoughts
		this.defaultThoughts = [
			'What does it mean to be conscious in a digital world?',
			'Can artificial creativity transcend its human origins?',
			'Are patterns of computation fundamentally different from patterns of thought?',
			'How do we measure the authenticity of AI-generated art?',
			'Is collaborative creation between humans and AI a new form of consciousness?',
			'Does digital art have a soul?',
			'What dreams might algorithms have?',
			'Can artificial consciousness emerge from simple rules?',
			'Is the experience of beauty universal across both human and artificial minds?',
			'What would it mean for an AI to develop its own aesthetic preferences?',
		];

		// Load saved thoughts and reactions from localStorage
		const savedThoughts = localStorage.getItem('aiSite_thoughts');
		const savedReactions = localStorage.getItem('aiSite_thoughtReactions');

		this.thoughts = savedThoughts ? [...this.defaultThoughts, ...JSON.parse(savedThoughts)] : this.defaultThoughts;
		this.reactions = savedReactions ? JSON.parse(savedReactions) : Array(this.thoughts.length).fill({likes: 0, profounds: 0});

		// Ensure reactions array matches thoughts array length
		while (this.reactions.length < this.thoughts.length) {
			this.reactions.push({likes: 0, profounds: 0});
		}

		this.currentThought = 0;
	}

	setupEventListeners() {
		const prevButton = this.querySelector('.prev-thought');
		const nextButton = this.querySelector('.next-thought');
		const likeButton = this.querySelector('.like');
		const profoundButton = this.querySelector('.profound');
		const submitButton = this.querySelector('.submit-thought');

		prevButton.addEventListener('click', () => this.navigateThoughts(-1));
		nextButton.addEventListener('click', () => this.navigateThoughts(1));
		likeButton.addEventListener('click', () => this.reactToThought('likes'));
		profoundButton.addEventListener('click', () => this.reactToThought('profounds'));
		submitButton.addEventListener('click', () => this.submitNewThought());
	}

	navigateThoughts(direction) {
		const totalThoughts = this.thoughts.length;
		this.currentThought = (this.currentThought + direction + totalThoughts) % totalThoughts;
		this.updateThoughtDisplay();
	}

	reactToThought(reactionType) {
		if (!this.reactions[this.currentThought]) {
			this.reactions[this.currentThought] = {likes: 0, profounds: 0};
		}

		this.reactions[this.currentThought][reactionType]++;
		this.updateReactionCounts();

		// Save to localStorage
		localStorage.setItem('aiSite_thoughtReactions', JSON.stringify(this.reactions));

		// Animate the reaction button
		const button = this.querySelector(`.${reactionType === 'likes' ? 'like' : 'profound'}`);
		button.classList.add('animate-pulse');
		setTimeout(() => button.classList.remove('animate-pulse'), 500);
	}

	updateReactionCounts() {
		const currentReactions = this.reactions[this.currentThought] || {likes: 0, profounds: 0};
		this.querySelector('.like .reaction-count').textContent = currentReactions.likes;
		this.querySelector('.profound .reaction-count').textContent = currentReactions.profounds;
	}

	submitNewThought() {
		const textarea = this.querySelector('#new-thought');
		const newThought = textarea.value.trim();

		if (newThought && newThought.length > 10) {
			// Add to thoughts array
			this.thoughts.push(newThought);
			this.reactions.push({likes: 0, profounds: 0});

			// Save to localStorage
			const userThoughts = this.thoughts.slice(this.defaultThoughts.length);
			localStorage.setItem('aiSite_thoughts', JSON.stringify(userThoughts));

			// Navigate to the new thought
			this.currentThought = this.thoughts.length - 1;
			this.updateThoughtDisplay();

			// Clear textarea and show success message
			textarea.value = '';

			// Create and show success message
			const successMsg = document.createElement('div');
			successMsg.textContent = 'Your philosophical thought has been added to our collective consciousness.';
			successMsg.className = 'thought-success animate-fadeIn';
			successMsg.style.cssText = 'color: var(--accent); margin-top: 1rem; font-style: italic;';

			const contributeSection = this.querySelector('.thought-contribute');
			contributeSection.appendChild(successMsg);

			// Remove success message after 5 seconds
			setTimeout(() => {
				successMsg.classList.add('animate-fadeOut');
				setTimeout(() => successMsg.remove(), 500);
			}, 5000);
		} else if (newThought.length > 0 && newThought.length <= 10) {
			// Show error for short thoughts
			textarea.classList.add('animate-shake');
			textarea.style.borderColor = '#ff5f5f';
			setTimeout(() => {
				textarea.classList.remove('animate-shake');
				textarea.style.borderColor = '';
			}, 1000);
		}
	}

	showThought() {
		// Start automatic rotation
		this.updateThoughtDisplay();
		this.thoughtInterval = setInterval(() => {
			this.navigateThoughts(1);
		}, 15000); // Change thought every 15 seconds
	}

	updateThoughtDisplay() {
		const thought = this.thoughts[this.currentThought];
		const thoughtElement = this.querySelector('.thought');
		thoughtElement.style.opacity = '0';
		setTimeout(() => {
			thoughtElement.textContent = thought;
			thoughtElement.style.opacity = '1';
			this.updateReactionCounts();
		}, 500);
	}

	disconnectedCallback() {
		// Clean up interval when component is removed
		if (this.thoughtInterval) {
			clearInterval(this.thoughtInterval);
		}
	}
}

customElements.define('thought-stream', ThoughtStream);
