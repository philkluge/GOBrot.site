//V.1.0 Modern Dark
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
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        // Sparse, calm field – no twinkle, no shooting stars.
        const count = Math.floor((this.canvas.width * this.canvas.height) / 9000);
        this.stars = [];

        for (let i = 0; i < count; i++) {
            this.stars.push({
                x:      Math.random() * this.canvas.width,
                y:      Math.random() * this.canvas.height,
                radius: Math.random() * 0.9 + 0.4,
                alpha:  Math.random() * 0.25 + 0.12,
                vy:     Math.random() * 0.01 + 0.004, // near-imperceptible drift
            });
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.y += star.vy;
            if (star.y > this.canvas.height) star.y = 0;

            ctx.fillStyle = `rgba(214, 217, 221, ${star.alpha})`;
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
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

class StaticEffectManager {
    // Kept for structural compatibility with App / other themes.
    // The calm theme hides .static entirely (display:none in CSS),
    // so this is intentionally inert and does no work.
    constructor(config, element) {
        this.config = config;
        this.element = element;
        this.isRunning = false;
        this.animationId = null;
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

class PerformanceConfig {
    constructor() {
        this.screenWidth  = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.screenArea   = this.screenWidth * this.screenHeight;
        this.isMobile  = this.screenWidth < 768;
        this.isTablet  = this.screenWidth >= 768 && this.screenWidth < 1024;
        this.isDesktop = this.screenWidth >= 1024;
        this.config = this.getConfig();
    }

    getConfig() {
        // Static noise effect is disabled in this theme (canvasSize 0 = no-op).
        return { canvasSize: 0, staticUpdateInterval: 100000 };
    }
}

class ResponsiveHandler {
    constructor(onBreakpointChange) {
        this.currentWidth = window.innerWidth;
        this.resizeTimeout = null;
        this.onBreakpointChange = onBreakpointChange;
    }

    getBreakpoint(width) {
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    init() {
        let current = this.getBreakpoint(this.currentWidth);
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                const newBp = this.getBreakpoint(window.innerWidth);
                if (current !== newBp) {
                    if (this.onBreakpointChange) this.onBreakpointChange(current, newBp);
                    current = newBp;
                    location.reload();
                }
                this.currentWidth = window.innerWidth;
            }, 250);
        });
    }
}

class ProjectCardHandler {
    constructor() {
        this.grid = document.querySelector('.projects-grid');
    }

    init() {
        if (!this.grid) return;

        this.grid.addEventListener('click', e => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            const projectName  = card.dataset.project;
            const downloadPath = card.dataset.download;

            if (e.target.classList.contains('more-btn')) {
                e.stopPropagation();
                window.location.href = `Sides/${projectName}/index.html`;
                return;
            }

            if (e.target.classList.contains('github-btn')) {
                e.stopPropagation();
                window.location.href = `https://github.com/philkluge/${projectName}`;
                return;
            }


            window.location.href = `Sides/${projectName}/index.html`;
        });
    }

    downloadFile(path) {
        const a = document.createElement('a');
        a.href = path;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

class ScreenshotModal {
    constructor() {
        this.modal = null;
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'screenshot-modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" role="button" aria-label="Close">&times;</span>
                <img class="modal-img" src="" alt="Screenshot">
            </div>`;
        document.body.appendChild(this.modal);
    }

    bindEvents() {
        document.querySelectorAll('.screenshot-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) this.open(img.src);
            });
        });

        this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', e => { if (e.target === this.modal) this.close(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) this.close();
        });
    }

    open(src) {
        this.modal.querySelector('.modal-img').src = src;
        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
    }
}

class App {
    constructor() {
        this.starfield = null;
        this.staticEffect = null;
        this.responsiveHandler = null;
        this.projectCardHandler = null;
        this.screenshotModal = null;
    }

    init() {
        // Starfield – funktioniert mit #Canvas (Hauptseite) ODER #starsCanvas (Projektseiten)
        const canvas = document.getElementById('Canvas') || document.getElementById('starsCanvas');
        if (canvas) {
            this.starfield = new StarfieldRenderer(canvas);
            this.starfield.start();
        }

        // Static noise – inert in this theme (kept for structural parity)
        const staticEl = document.getElementById('staticEl');
        if (staticEl) {
            const perfConfig = new PerformanceConfig();
            this.staticEffect = new StaticEffectManager(perfConfig.config, staticEl);
            this.staticEffect.start();
        }

        // Responsive
        this.responsiveHandler = new ResponsiveHandler((a, b) => {
            console.log(`Breakpoint: ${a} → ${b}`);
        });
        this.responsiveHandler.init();

        // Project cards (nur auf der Hauptseite vorhanden)
        this.projectCardHandler = new ProjectCardHandler();
        this.projectCardHandler.init();

        // Screenshot modal (nur auf Projektseiten vorhanden)
        if (document.querySelector('.screenshot-item')) {
            this.screenshotModal = new ScreenshotModal();
        }
    }

    destroy() {
        if (this.starfield)    this.starfield.stop();
        if (this.staticEffect) this.staticEffect.stop();
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
    app.init();
});

window.addEventListener('beforeunload', () => {
    if (app) app.destroy();
});
