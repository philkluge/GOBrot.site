// GOBrot — Games Hub — app.js
//
// ─────────────────────────────────────────────────────────────────────────
// NEUES SPIEL HINZUFÜGEN:
// Einfach ein neues Objekt unten in das GAMES-Array einfügen. Mehr ist
// nicht nötig — Karte, Modal und "in neuem Tab öffnen"-Link werden
// automatisch daraus gebaut.
//
// Felder:
//   id          eindeutige ID (string, keine Leerzeichen)
//   title       Titel, wird auf der Karte angezeigt
//   description kurze Beschreibung (1 Satz)
//   category    kleiner Tag rechts oben auf der Karte, z.B. "Puzzle"
//   accent      Akzentfarbe der Karte: "cyan" | "magenta" | "violet" | "amber"
//   icon        1-4 Zeichen/Emoji als Platzhalter-Thumbnail
//   embeddable  true  -> Spiel wird per <iframe> im Modal auf dieser Seite geöffnet
//               false -> Spiel öffnet stattdessen direkt in einem neuen Tab
//               (viele große Portale wie Poki/CrazyGames/itch.io verbieten das
//               Einbetten per iframe technisch — dafür ist "embeddable:false" da)
//   url         bei embeddable:true die Embed-URL (iframe-src),
//               bei embeddable:false die normale Spiel-URL zum Öffnen
//   externalUrl optional: falls die "normale" Spielseite eine andere URL hat
//               als die Embed-URL (wird für den ↗-Link im Modal benutzt)
// ─────────────────────────────────────────────────────────────────────────

window.GAMES = [
    {
        id: 'chess',
        title: 'Schach',
        description: 'Klassisches Schach gegen den Computer, drei Schwierigkeitsstufen.',
        category: 'Strategie',
        accent: 'cyan',
        icon: '♞',
        embeddable: true,
        url: 'https://playpager.com/embed/chess/index.html',
        externalUrl: 'https://playpager.com/chess/'
    },
    {
        id: 'checkers',
        title: 'Dame',
        description: 'Der Brettspiel-Klassiker — schlage alle gegnerischen Steine.',
        category: 'Strategie',
        accent: 'magenta',
        icon: '⬤',
        embeddable: true,
        url: 'https://playpager.com/embed/checkers/index.html',
        externalUrl: 'https://playpager.com/checkers/'
    },
    {
        id: 'reversi',
        title: 'Reversi / Othello',
        description: 'Dreh die Steine auf deine Farbe und dominiere das Brett.',
        category: 'Strategie',
        accent: 'violet',
        icon: '◐',
        embeddable: true,
        url: 'https://playpager.com/embed/reversi/index.html',
        externalUrl: 'https://playpager.com/reversi/'
    },
    {
        id: 'cubes',
        title: 'Falling Cubes',
        description: 'Fallende Blöcke stapeln und Reihen räumen — Tetris-Style-Puzzle.',
        category: 'Arcade',
        accent: 'cyan',
        icon: '▦',
        embeddable: true,
        url: 'https://playpager.com/embed/cubes/index.html',
        externalUrl: 'https://playpager.com/cubes/'
    },
    {
        id: 'wordpuzzle',
        title: 'Wortsuche',
        description: 'Finde versteckte Wörter im Buchstabengitter, gegen die Uhr.',
        category: 'Wortspiel',
        accent: 'amber',
        icon: '🔤',
        embeddable: true,
        url: 'https://playpager.com/embed/wordpuzzle/index.html',
        externalUrl: 'https://playpager.com/word-puzzle/'
    },
    {
        id: 'solitaire',
        title: 'Solitaire',
        description: 'Der zeitlose Kartenklassiker zum Entspannen.',
        category: 'Karten',
        accent: 'magenta',
        icon: '🂡',
        embeddable: true,
        url: 'https://playpager.com/embed/solitaire/index.html',
        externalUrl: 'https://playpager.com/solitaire/'
    },
    {
        id: 'sudoku',
        title: 'Sudoku',
        description: 'Zahlenrätsel in mehreren Schwierigkeitsgraden.',
        category: 'Puzzle',
        accent: 'violet',
        icon: '#',
        embeddable: true,
        url: 'https://playpager.com/embed/sudoku/index.html',
        externalUrl: 'https://playpager.com/sudoku/'
    }
];

// ─────────────────────────────────────────────────────────────────────────

class StarfieldRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.animationId = null;
        this.isRunning = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        const count = Math.floor((this.canvas.width * this.canvas.height) / 8500);
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.0 + 0.4,
                alpha: Math.random() * 0.35 + 0.12,
                vy: Math.random() * 0.015 + 0.004,
                hue: Math.random() < 0.15 ? 'accent' : 'plain'
            });
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.y += star.vy;
            if (star.y > this.canvas.height) star.y = 0;

            ctx.fillStyle = star.hue === 'accent'
                ? `rgba(120, 190, 255, ${star.alpha})`
                : `rgba(220, 224, 235, ${star.alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.draw());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animationId = requestAnimationFrame(() => this.draw());
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}

class GameGridBuilder {
    constructor(games) {
        this.games = games;
        this.grid = document.getElementById('gamesGrid');
    }

    build() {
        if (!this.grid) return;

        this.games.forEach((game, i) => {
            const card = document.createElement('article');
            card.className = 'game-card';
            card.dataset.gameId = game.id;
            card.dataset.accent = game.accent || 'cyan';
            card.setAttribute('role', 'listitem');
            card.setAttribute('tabindex', '0');
            card.style.animationDelay = `${0.05 + i * 0.05}s`;

            card.innerHTML = `
                <div class="game-card-glow"></div>
                <div class="game-thumb">
                    <div class="thumb-icon" aria-hidden="true">${game.icon || '▶'}</div>
                </div>
                <div class="game-info">
                    <div class="game-meta">
                        <h3>${game.title}</h3>
                        <span class="difficulty-tag">${game.category || ''}</span>
                    </div>
                    <p>${game.description || ''}</p>
                    <button class="play-btn" type="button">
                        <span>${game.embeddable ? 'Spielen' : 'Spielen ↗'}</span>
                        <span class="play-icon">▶</span>
                    </button>
                </div>
            `;

            this.grid.appendChild(card);
        });
    }
}

class GameModal {
    constructor() {
        this.modal = document.getElementById('gameModal');
        this.frame = document.getElementById('gameFrame');
        this.titleEl = document.getElementById('gameModalTitle');
        this.closeBtn = document.getElementById('closeGameBtn');
        this.reloadBtn = document.getElementById('reloadGameBtn');
        this.openTabLink = document.getElementById('openTabLink');
        this.currentSrc = '';

        this.closeBtn.addEventListener('click', () => this.close());
        this.reloadBtn.addEventListener('click', () => this.reload());

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !this.modal.hidden) this.close();
        });
    }

    open(game) {
        this.currentSrc = game.url;
        this.titleEl.textContent = game.title || 'Game';
        this.openTabLink.href = game.externalUrl || game.url;
        this.frame.src = game.url;
        this.modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    reload() {
        if (!this.currentSrc) return;
        this.frame.src = 'about:blank';
        requestAnimationFrame(() => {
            this.frame.src = this.currentSrc;
        });
    }

    close() {
        this.modal.hidden = true;
        this.frame.src = 'about:blank';
        document.body.style.overflow = '';
    }
}

class GameCardHandler {
    constructor(games, gameModal) {
        this.games = games;
        this.grid = document.getElementById('gamesGrid');
        this.gameModal = gameModal;
    }

    init() {
        if (!this.grid) return;

        this.grid.addEventListener('click', e => {
            const card = e.target.closest('.game-card');
            if (!card) return;
            this.launch(card);
        });

        this.grid.addEventListener('keydown', e => {
            const card = e.target.closest('.game-card');
            if (!card) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.launch(card);
            }
        });
    }

    launch(card) {
        const game = this.games.find(g => g.id === card.dataset.gameId);
        if (!game) return;

        if (game.embeddable) {
            this.gameModal.open(game);
        } else {
            window.open(game.externalUrl || game.url, '_blank', 'noopener');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starsCanvas');
    if (canvas) {
        const starfield = new StarfieldRenderer(canvas);
        starfield.start();
    }

    const games = window.GAMES || [];
    new GameGridBuilder(games).build();

    const gameModal = new GameModal();
    const cardHandler = new GameCardHandler(games, gameModal);
    cardHandler.init();
});
