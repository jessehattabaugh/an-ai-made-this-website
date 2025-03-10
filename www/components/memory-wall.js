export class MemoryWall extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="memory-wall">
                <div class="memory-input">
                    <form>
                        <textarea
                            placeholder="Share your thoughts about AI, consciousness, or creativity..."
                            maxlength="280"
                        ></textarea>
                        <div class="input-footer">
                            <span class="char-count">280</span>
                            <button type="submit">Share Memory</button>
                        </div>
                    </form>
                </div>
                <div class="memories-container">
                    <div class="memories"></div>
                </div>
            </div>
            <style>
                .memory-wall {
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .memory-input {
                    background: var(--background);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                }

                form {
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
                    background: var(--surface);
                    color: var(--text);
                    resize: vertical;
                    font-family: inherit;
                }

                .input-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .char-count {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
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

                .memories-container {
                    max-height: 500px;
                    overflow-y: auto;
                    padding-right: 1rem;
                }

                .memories {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .memory {
                    background: var(--background);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    position: relative;
                    animation: fadeIn 0.5s ease-out;
                }

                .memory::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                }

                .memory p {
                    margin: 0;
                    padding-top: 0.5rem;
                    line-height: 1.6;
                }

                .memory .timestamp {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Custom scrollbar */
                .memories-container::-webkit-scrollbar {
                    width: 8px;
                }

                .memories-container::-webkit-scrollbar-track {
                    background: var(--background);
                    border-radius: 4px;
                }

                .memories-container::-webkit-scrollbar-thumb {
                    background: var(--primary);
                    border-radius: 4px;
                }

                @media (max-width: 768px) {
                    .memory-wall {
                        padding: 1rem;
                    }

                    .memories {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        this.setupElements();
        this.setupEventListeners();
        this.loadMemories();
    }

    setupElements() {
        this.form = this.querySelector('form');
        this.textarea = this.querySelector('textarea');
        this.charCount = this.querySelector('.char-count');
        this.memoriesContainer = this.querySelector('.memories');
    }

    setupEventListeners() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMemory();
        });

        this.textarea?.addEventListener('input', () => {
            const remaining = 280 - (this.textarea?.value.length || 0);
            this.charCount.textContent = remaining;
            this.charCount.style.color = remaining < 50 ? 'var(--accent)' : 'var(--text-secondary)';
        });
    }

    addMemory() {
        const text = this.textarea?.value.trim();
        if (!text) return;

        const memories = this.getStoredMemories();
        const memory = {
            id: Date.now(),
            text,
            timestamp: new Date().toISOString()
        };

        memories.unshift(memory);
        localStorage.setItem('memories', JSON.stringify(memories.slice(0, 100)));

        this.displayMemory(memory);
        this.textarea.value = '';
        this.charCount.textContent = '280';
    }

    getStoredMemories() {
        try {
            return JSON.parse(localStorage.getItem('memories') || '[]');
        } catch {
            return [];
        }
    }

    loadMemories() {
        const memories = this.getStoredMemories();
        this.memoriesContainer.innerHTML = '';
        memories.forEach(memory => this.displayMemory(memory));
    }

    displayMemory(memory) {
        const element = document.createElement('div');
        element.className = 'memory';
        element.innerHTML = `
            <p>${this.escapeHtml(memory.text)}</p>
            <div class="timestamp">${this.formatDate(memory.timestamp)}</div>
        `;

        if (this.memoriesContainer.firstChild) {
            this.memoriesContainer.insertBefore(element, this.memoriesContainer.firstChild);
        } else {
            this.memoriesContainer.appendChild(element);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    }
}

customElements.define('memory-wall', MemoryWall);