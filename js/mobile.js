/**
 * Mobile-First JavaScript for Premium Interior Design Website
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.querySelector('body');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    const mobileSections = document.querySelectorAll('.mobile-section');
    const mobileForms = document.querySelectorAll('form');
    const portfolioItems = document.querySelectorAll('.mobile-portfolio-item');
    
    // Initial page load
    window.addEventListener('load', () => {
        // Hide loader if exists
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
        }
        
        // Show home section by default
        showSection('home');
        
        // Add active class to home menu item
        document.querySelector('a[href="#home"]').classList.add('active');
    });
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }
    
    // Show selected section
    function showSection(sectionId) {
        // Hide all sections
        mobileSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Smooth scroll to top of section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    // Update active menu item
    function updateActiveMenuItem(menuItem) {
        // Remove active class from all menu items
        mobileMenuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked menu item
        menuItem.classList.add('active');
    }
    
    // Handle navigation click events
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            
            // Get target section id from href
            const targetId = item.getAttribute('href').substring(1);
            
            // Close mobile menu
            toggleMobileMenu();
            
            // Update active menu item
            updateActiveMenuItem(item);
            
            // Show target section
            showSection(targetId);
        });
    });
    
    // Toggle mobile menu events
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileCloseBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', e => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Form submission
    mobileForms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission with delay
            setTimeout(() => {
                // Show success message
                const formWrapper = form.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! We\'ll get back to you soon.';
                
                // Replace form with success message
                formWrapper.innerHTML = '';
                formWrapper.appendChild(successMessage);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        });
    });
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
    
    // Handle orientation changes
    function handleOrientationChange() {
        if (window.innerHeight < window.innerWidth) {
            // Landscape mode
            body.classList.add('landscape');
        } else {
            // Portrait mode
            body.classList.remove('landscape');
        }
    }
    
    // Initial orientation check
    handleOrientationChange();
    
    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Add touch feedback for mobile interactions
    const touchElements = document.querySelectorAll('a, button');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            element.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Portfolio items click behavior
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            // Simplified view - just show overlay
            const overlay = item.querySelector('.mobile-portfolio-overlay');
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0.7)';
            
            // Reset after delay
            setTimeout(() => {
                overlay.style.height = '';
                overlay.style.background = '';
            }, 2000);
        });
    });
}); 