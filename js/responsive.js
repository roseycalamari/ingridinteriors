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
    const mobilePaginationDots = document.querySelectorAll('.mobile-pagination-dot');
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Update menu icon animation
            const menuIcon = this.querySelector('.menu-icon');
            if (menuIcon) {
                if (mobileMenu.classList.contains('active')) {
                    this.style.backgroundColor = 'var(--color-secondary)';
                } else {
                    this.style.backgroundColor = 'var(--color-primary)';
                }
            }
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
    
    // Mobile pagination dots
    if (mobilePaginationDots.length > 0) {
        mobilePaginationDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const sectionIndex = parseInt(this.getAttribute('data-section'));
                
                // Update active dot
                mobilePaginationDots.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to corresponding section
                if (mobileSections[sectionIndex]) {
                    mobileSections[sectionIndex].scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Enhanced scroll detection for mobile sections
    let currentSectionIndex = 0;
    
    // IntersectionObserver to detect active section
    if ('IntersectionObserver' in window && mobileSections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const section = entry.target;
                        currentSectionIndex = Array.from(mobileSections).indexOf(section);
                        
                        // Update pagination dots
                        updateActivePaginationDot(currentSectionIndex);
                        
                        // Add active class to current section for parallax effect
                        mobileSections.forEach((s, i) => {
                            if (i === currentSectionIndex) {
                                s.classList.add('active');
                            } else {
                                s.classList.remove('active');
                            }
                        });
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            }
        );
        
        mobileSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    function updateActivePaginationDot(index) {
        mobilePaginationDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
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
    
    // Enhanced scroll indicators for mobile
    document.querySelectorAll('.scroll-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const currentSection = indicator.closest('.mobile-section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection && nextSection.classList.contains('mobile-section')) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update pagination dots
                const nextIndex = Array.from(mobileSections).indexOf(nextSection);
                updateActivePaginationDot(nextIndex);
            }
        });
        
        // Add dynamic text to indicate section name
        const indicatorText = indicator.querySelector('.scroll-indicator-text');
        if (indicatorText && index < mobileSections.length - 1) {
            const nextSection = mobileSections[index + 1];
            const nextSectionTitle = nextSection.querySelector('.mobile-section-title');
            if (nextSectionTitle) {
                indicatorText.textContent = 'Scroll to ' + nextSectionTitle.textContent;
            }
        }
    });
    
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
        // Check if device orientation changes, refresh lazy loading
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                initLazyLoading();
            }, 300);
        });
        
        // Add glassmorphism effects to mobile elements by adding appropriate classes
        document.querySelectorAll('.mobile-section-content').forEach(content => {
            content.classList.add('glassmorphism');
        });
    }
    
    // Initialize responsive layout handling
    handleResponsiveLayout();
    
    // Add mobile detection and redirect notice for first time visitors
    if (window.innerWidth < 768 && !sessionStorage.getItem('mobileNoticeShown')) {
        showMobileWelcomeMessage();
        sessionStorage.setItem('mobileNoticeShown', 'true');
    }
    
    function showMobileWelcomeMessage() {
        // Create a welcome message with scrolling instruction
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'mobile-welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-content">
                <h3>Welcome to Ingrid Bergman Interiors</h3>
                <p>Scroll down to explore our services</p>
                <div class="welcome-arrow">↓</div>
                <button class="welcome-close">Got it</button>
            </div>
        `;
        document.body.appendChild(welcomeMessage);
        
        // Add styles for the welcome message
        const style = document.createElement('style');
        style.textContent = `
            .mobile-welcome-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.5s ease;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }
            
            .welcome-content {
                background-color: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                max-width: 80%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            
            .welcome-content h3 {
                margin-bottom: 20px;
                color: var(--color-tertiary);
            }
            
            .welcome-arrow {
                font-size: 32px;
                margin: 20px 0;
                animation: bounce 2s infinite;
                color: var(--color-tertiary);
            }
            
            .welcome-close {
                background-color: var(--color-primary);
                color: white;
                border: none;
                padding: 10px 25px;
                border-radius: 30px;
                font-size: 16px;
                margin-top: 20px;
                cursor: pointer;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Handle close button
        const closeButton = welcomeMessage.querySelector('.welcome-close');
        closeButton.addEventListener('click', function() {
            welcomeMessage.style.opacity = '0';
            setTimeout(() => {
                welcomeMessage.remove();
                style.remove();
            }, 500);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(welcomeMessage)) {
                welcomeMessage.style.opacity = '0';
                setTimeout(() => {
                    welcomeMessage.remove();
                    style.remove();
                }, 500);
            }
        }, 5000);
    }
}); 