/**
 * Responsive Script for Mobile Version
 * Handles mobile menu, section navigation, and mobile-specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    const mobileExploreBtns = document.querySelectorAll('.mobile-explore-btn');
    const mobileBackBtns = document.querySelectorAll('.mobile-section-back');
    const mobileSections = document.querySelectorAll('.mobile-section');
    const serviceFullSection = document.getElementById('serviceFullSection');
    const personFullSection = document.getElementById('personFullSection');
    const brandsFullSection = document.getElementById('brandsFullSection');
    const contactFullSection = document.getElementById('contactFullSection');
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Mobile menu item click
    if (mobileMenuItems.length > 0) {
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                
                // Update active menu item
                mobileMenuItems.forEach(mi => mi.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                mobileMenu.classList.remove('active');
                
                // Handle navigation
                if (section === 'home') {
                    // Scroll to top of mobile sections
                    document.querySelector('.mobile-sections').scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else if (section === 'service') {
                    serviceFullSection.classList.add('active');
                } else if (section === 'person') {
                    personFullSection.classList.add('active');
                } else if (section === 'brands') {
                    brandsFullSection.classList.add('active');
                } else if (section === 'contact') {
                    contactFullSection.classList.add('active');
                }
            });
        });
    }
    
    // Mobile section explore buttons
    if (mobileExploreBtns.length > 0) {
        mobileExploreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                
                if (section === 'service') {
                    serviceFullSection.classList.add('active');
                } else if (section === 'person') {
                    personFullSection.classList.add('active');
                } else if (section === 'brands') {
                    brandsFullSection.classList.add('active');
                }
            });
        });
    }
    
    // Mobile back buttons
    if (mobileBackBtns.length > 0) {
        mobileBackBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const fullSection = this.closest('.mobile-fullscreen-section');
                if (fullSection) {
                    fullSection.classList.remove('active');
                }
            });
        });
    }
    
    // Swipe detection for mobile sections
    if (mobileSections.length > 0) {
        mobileSections.forEach(section => {
            let touchStartY = 0;
            let touchEndY = 0;
            
            section.addEventListener('touchstart', function(e) {
                touchStartY = e.changedTouches[0].screenY;
            });
            
            section.addEventListener('touchend', function(e) {
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            });
            
            function handleSwipe() {
                const threshold = 50;
                const swipeDistance = touchEndY - touchStartY;
                
                if (swipeDistance < -threshold) {
                    // Swipe up - go to next section
                    const nextSection = section.nextElementSibling;
                    if (nextSection && nextSection.classList.contains('mobile-section')) {
                        nextSection.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (swipeDistance > threshold) {
                    // Swipe down - go to previous section
                    const prevSection = section.previousElementSibling;
                    if (prevSection && prevSection.classList.contains('mobile-section')) {
                        prevSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    }
    
    // Initialize gallery button
    const projectGalleryBtn = document.getElementById('projectGalleryBtn');
    if (projectGalleryBtn) {
        projectGalleryBtn.addEventListener('click', function() {
            // Open the gallery modal if it exists
            const galleryModal = document.getElementById('galleryModal');
            if (galleryModal) {
                galleryModal.classList.add('active');
            }
        });
    }
    
    // Function to initialize lazy loading for images
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(function(img) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }
    }
    
    // Handle section visibility based on screen size
    function handleResponsiveLayout() {
        // This function can be expanded for additional responsive behavior
        
        // Check if device orientation changes, refresh lazy loading
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                initLazyLoading();
            }, 300);
        });
    }
    
    // Initialize responsive layout handling
    handleResponsiveLayout();
    
    // Scroll indicators for mobile
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => {
            const currentSection = indicator.closest('.mobile-section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection && nextSection.classList.contains('mobile-section')) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}); 