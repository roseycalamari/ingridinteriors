/**
 * Circular Logo-Based Loader Animation
 * Creates a single-instance loading animation based on the site's circular "i" logo
 * Optimized for performance with session tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the loader element
    const loader = document.querySelector('.page-loader');
    
    if (!loader) return;
    
    // Check if this is the first load in this session
    const hasVisited = sessionStorage.getItem('hasVisitedSite');
    
    // Only show loader on first visit of the session
    if (hasVisited) {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
        return;
    }
    
    // Show the page after loader animation completes
    const showPage = () => {
        // First fadeout the loader
        loader.classList.add('loader-hidden');
        
        // Set session flag to prevent loader on subsequent page loads
        sessionStorage.setItem('hasVisitedSite', 'true');
        
        // Then remove it from DOM after animation completes
        loader.addEventListener('transitionend', () => {
            document.body.classList.add('loaded');
            setTimeout(() => {
                loader.remove();
            }, 100);
        }, { once: true });
    };
    
    // Check if page has already loaded (browser cache)
    if (document.readyState === 'complete') {
        showPage();
    } else {
        window.addEventListener('load', () => {
            // Use a shorter minimum duration for better UX
            setTimeout(showPage, 1200);
        });
    }
});