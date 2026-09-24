//V.1.1 Modern Dark
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        const count = Math.floor((this.canvas.width * this.canvas.height) / 9000);
        this.stars = [];

        for (let i = 0; i < count; i++) {
            this.stars.push({
                x:      Math.random() * this.canvas.width,
                y:      Math.random() * this.canvas.height,
                radius: Math.random() * 0.9 + 0.4,
                alpha:  Math.random() * 0.25 + 0.12,
                vy:     Math.random() * 0.01 + 0.004,
            });
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const star of this.stars) {
            star.y += star.vy;
            if (star.y > this.canvas.height) star.y = 0;

            ctx.fillStyle = `rgba(214, 217, 221, ${star.alpha})`;
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
    const canvas = document.getElementById('starfield');
    if (canvas) new Starfield(canvas).start();
});
