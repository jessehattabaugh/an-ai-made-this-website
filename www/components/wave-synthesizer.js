export class WaveSynthesizer extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="synthesizer">
                <canvas class="waveform"></canvas>
                <div class="controls">
                    <div class="control-group">
                        <label>
                            Waveform
                            <select class="wave-type">
                                <option value="sine">Sine</option>
                                <option value="square">Square</option>
                                <option value="sawtooth">Sawtooth</option>
                                <option value="triangle">Triangle</option>
                            </select>
                        </label>
                        <label>
                            Frequency
                            <input type="range" class="frequency" min="20" max="2000" value="440" step="1">
                            <span class="frequency-value">440 Hz</span>
                        </label>
                    </div>
                    <div class="control-group">
                        <label>
                            Volume
                            <input type="range" class="volume" min="0" max="1" value="0.5" step="0.01">
                        </label>
                        <label>
                            Filter Cutoff
                            <input type="range" class="filter" min="20" max="20000" value="20000" step="1">
                        </label>
                    </div>
                    <button class="toggle">Start</button>
                </div>
            </div>
            <style>
                .synthesizer {
                    width: 100%;
                    padding: 1rem;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                }

                .waveform {
                    width: 100%;
                    height: 200px;
                    background: var(--background);
                    border-radius: var(--radius-sm);
                    margin-bottom: 1rem;
                }

                .controls {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .control-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                label {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                select, input[type="range"] {
                    width: 100%;
                }

                .frequency-value {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                button {
                    padding: 0.5rem 1rem;
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
            </style>
        `;

        this.setupAudioContext();
        this.setupEventListeners();
    }

    setupAudioContext() {
        this.audioCtx = null;
        this.oscillator = null;
        this.gainNode = null;
        this.filterNode = null;
        this.analyser = null;
        this.isPlaying = false;
        this.canvas = this.querySelector('.waveform');
        this.canvasCtx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        const toggleButton = this.querySelector('.toggle');
        const waveTypeSelect = this.querySelector('.wave-type');
        const frequencyInput = this.querySelector('.frequency');
        const volumeInput = this.querySelector('.volume');
        const filterInput = this.querySelector('.filter');
        const frequencyValue = this.querySelector('.frequency-value');

        toggleButton?.addEventListener('click', () => this.toggleSound());
        waveTypeSelect?.addEventListener('change', (e) => this.setWaveType(e.target.value));
        frequencyInput?.addEventListener('input', (e) => {
            const value = e.target.value;
            this.setFrequency(value);
            frequencyValue.textContent = `${value} Hz`;
        });
        volumeInput?.addEventListener('input', (e) => this.setVolume(e.target.value));
        filterInput?.addEventListener('input', (e) => this.setFilter(e.target.value));
    }

    initializeAudio() {
        if (this.audioCtx) return;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.analyser = this.audioCtx.createAnalyser();

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.filterNode);
        this.filterNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(20000, this.audioCtx.currentTime);

        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.oscillator.start();
        this.drawWaveform();
    }

    drawWaveform() {
        if (!this.isPlaying) return;

        const width = this.canvas.width = this.canvas.offsetWidth;
        const height = this.canvas.height = this.canvas.offsetHeight;

        this.analyser.getByteTimeDomainData(this.dataArray);

        this.canvasCtx.fillStyle = 'var(--background)';
        this.canvasCtx.fillRect(0, 0, width, height);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'var(--primary-light)';
        this.canvasCtx.beginPath();

        const sliceWidth = width / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(width, height / 2);
        this.canvasCtx.stroke();

        requestAnimationFrame(() => this.drawWaveform());
    }

    toggleSound() {
        if (!this.audioCtx) {
            this.initializeAudio();
        }

        const button = this.querySelector('.toggle');
        if (this.isPlaying) {
            this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
            this.isPlaying = false;
            button.textContent = 'Start';
        } else {
            this.gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
            this.isPlaying = true;
            button.textContent = 'Stop';
            this.drawWaveform();
        }
    }

    setWaveType(type) {
        if (this.oscillator) {
            this.oscillator.type = type;
        }
    }

    setFrequency(value) {
        if (this.oscillator) {
            this.oscillator.frequency.setValueAtTime(value, this.audioCtx.currentTime);
        }
    }

    setVolume(value) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(value, this.audioCtx.currentTime);
        }
    }

    setFilter(value) {
        if (this.filterNode) {
            this.filterNode.frequency.setValueAtTime(value, this.audioCtx.currentTime);
        }
    }

    disconnectedCallback() {
        if (this.audioCtx) {
            this.oscillator?.stop();
            this.audioCtx.close();
        }
    }
}