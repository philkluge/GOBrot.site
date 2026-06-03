// V00 Placeholder


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
        if (this.isMobile) {
            return { canvasSize: 80,  staticUpdateInterval: 200 };
        } else if (this.isTablet) {
            return { canvasSize: 150, staticUpdateInterval: 120 };
        } else {
            return { canvasSize: 300, staticUpdateInterval: 60 };
        }
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