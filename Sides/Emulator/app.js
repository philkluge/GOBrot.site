/* GOBrot — Emulator — app.js */

/* ── Starfield background (identisch zum Rest der Seite) ── */
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        const count = Math.floor((this.canvas.width * this.canvas.height) / 9000);
        this.stars = [];

        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 0.9 + 0.4,
                alpha: Math.random() * 0.25 + 0.12,
                vy: Math.random() * 0.01 + 0.004,
            });
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const star of this.stars) {
            star.y += star.vy;
            if (star.y > this.canvas.height) star.y = 0;

            ctx.fillStyle = `rgba(231, 233, 239, ${star.alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(() => this.draw());
    }

    start() {
        requestAnimationFrame(() => this.draw());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starsCanvas');
    if (canvas) new Starfield(canvas).start();
});

/* ── EmulatorJS Integration ── */

const EJS_DATA_PATH = 'https://cdn.emulatorjs.org/stable/data/';

const systemSelect = document.getElementById('systemSelect');
const romInput = document.getElementById('romInput');
const fileDropLabel = document.getElementById('fileDropLabel');
const fileDropText = document.getElementById('fileDropText');
const startBtn = document.getElementById('startBtn');
const setupPanel = document.getElementById('setupPanel');
const emuPanel = document.getElementById('emuPanel');
const emuBarTitle = document.getElementById('emuBarTitle');
const resetBtn = document.getElementById('resetBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let selectedFile = null;

romInput.addEventListener('change', () => {
    if (romInput.files && romInput.files[0]) {
        selectedFile = romInput.files[0];
        fileDropText.textContent = selectedFile.name;
        startBtn.disabled = false;
    }
});

// Drag & Drop
['dragover', 'dragenter'].forEach(evt => {
    fileDropLabel.addEventListener(evt, (e) => {
        e.preventDefault();
        fileDropLabel.classList.add('dragover');
    });
});

['dragleave', 'dragend'].forEach(evt => {
    fileDropLabel.addEventListener(evt, () => {
        fileDropLabel.classList.remove('dragover');
    });
});

fileDropLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropLabel.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        selectedFile = e.dataTransfer.files[0];
        romInput.files = e.dataTransfer.files;
        fileDropText.textContent = selectedFile.name;
        startBtn.disabled = false;
    }
});

startBtn.addEventListener('click', () => {
    if (!selectedFile) return;
    startEmulator(selectedFile, systemSelect.value);
});

resetBtn.addEventListener('click', () => {
    location.reload();
});

fullscreenBtn.addEventListener('click', () => {
    const gameEl = document.getElementById('game');
    if (gameEl.requestFullscreen) {
        gameEl.requestFullscreen();
    } else if (gameEl.webkitRequestFullscreen) {
        gameEl.webkitRequestFullscreen();
    }
});

function startEmulator(file, core) {
    setupPanel.hidden = true;
    emuPanel.hidden = false;
    emuBarTitle.textContent = file.name;

    const objectUrl = URL.createObjectURL(file);

    // EmulatorJS globale Konfiguration
    window.EJS_player = '#game';
    window.EJS_core = core;
    window.EJS_gameName = file.name;
    window.EJS_gameUrl = objectUrl;
    window.EJS_pathtodata = EJS_DATA_PATH;
    window.EJS_startOnLoaded = true;
    window.EJS_backgroundColor = '#05060a';
    window.EJS_language = 'de-DE';

    const loader = document.createElement('script');
    loader.src = EJS_DATA_PATH + 'loader.js';
    document.body.appendChild(loader);
}
