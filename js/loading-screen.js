/**
 * Loading Screen Manager
 * Manages the loading screen while NASA APIs are being initialized
 */

class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingMessage = document.getElementById('loading-message');
        this.loadingBar = document.getElementById('loading-bar');
        this.loadingDetails = document.getElementById('loading-details');
        this.container = document.querySelector('.container');
        
        this.progress = 0;
        this.tasks = [
            { name: 'Initializing NASA APIs...', duration: 1000 },
            { name: 'Loading NEO Feed API...', duration: 1500 },
            { name: 'Connecting to SBDB...', duration: 2000 },
            { name: 'Fetching asteroid database...', duration: 3000 },
            { name: 'Preparing simulation engine...', duration: 1000 },
        ];
    }
    
    updateProgress(percentage, message, details = '') {
        this.progress = Math.min(percentage, 100);
        this.loadingBar.style.width = `${this.progress}%`;
        
        if (message) {
            this.loadingMessage.textContent = message;
        }
        
        if (details) {
            this.loadingDetails.textContent = details;
        }
    }
    
    async simulateLoading() {
        let totalProgress = 0;
        const progressPerTask = 100 / this.tasks.length;
        
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            this.updateProgress(totalProgress, task.name, `Step ${i + 1}/${this.tasks.length}`);
            
            await new Promise(resolve => setTimeout(resolve, task.duration));
            totalProgress += progressPerTask;
        }
        
        this.updateProgress(100, '✅ System Ready', 'All systems operational');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    async hide() {
        // Fade out loading screen
        this.loadingScreen.classList.add('fade-out');
        
        // Fade in main container
        if (this.container) {
            this.container.style.opacity = '1';
        }
        
        // Remove loading screen after animation
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.loadingScreen && this.loadingScreen.parentNode) {
            this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
    }
    
    async waitForAPIs() {
        try {
            // Wait for NASA APIs to be ready
            const promises = [];
            
            // Check if SBDB is loading
            const checkSBDB = new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    const meteorSelect = document.getElementById('meteor-select');
                    if (meteorSelect && meteorSelect.options.length > 1) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                
                // Timeout after 15 seconds
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve();
                }, 15000);
            });
            
            promises.push(checkSBDB);
            
            // Update progress while waiting
            const progressInterval = setInterval(() => {
                if (this.progress < 90) {
                    this.updateProgress(
                        this.progress + 2,
                        'Loading asteroid database...',
                        `${this.progress.toFixed(0)}% complete`
                    );
                }
            }, 100);
            
            // Wait for all APIs
            await Promise.all(promises);
            clearInterval(progressInterval);
            
            // Finish loading
            this.updateProgress(100, '✅ All data loaded', 'System ready');
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (error) {
            console.error('Error waiting for APIs:', error);
            this.updateProgress(100, '⚠️ System ready (partial data)', 'Some APIs unavailable');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    async start() {
        // Start loading process
        this.updateProgress(10, 'Initializing NASA APIs...', 'Connecting to servers...');
        
        // Wait for APIs to load
        await this.waitForAPIs();
        
        // Hide loading screen
        await this.hide();
        
        console.log('✅ Loading screen completed');
    }
}

// Initialize loading screen when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const loadingScreen = new LoadingScreen();
        loadingScreen.start();
    });
} else {
    const loadingScreen = new LoadingScreen();
    loadingScreen.start();
}

export default LoadingScreen;
