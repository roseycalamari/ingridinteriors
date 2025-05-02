/**
 * Mobile-First JavaScript for Ingrid Bergman Interiors
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.querySelector('body');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    const mobileSections = document.querySelector('.mobile-sections');
    const sectionElements = document.querySelectorAll('.mobile-section');
    const exploreButtons = document.querySelectorAll('.mobile-explore-btn');
    const backButtons = document.querySelectorAll('.mobile-section-back');
    const fullScreenSections = document.querySelectorAll('.mobile-fullscreen-section');
    
    // Current section index for swipe navigation
    let currentSectionIndex = 0;
    const totalSections = sectionElements.length;

    // Page loader
    window.addEventListener('load', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800);
        }
        initLazyLoading();
        addSwipeIndicators();
    });
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });
    
    // Menu item click handler
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get target section
            const sectionId = item.getAttribute('data-section');
            
            // Close mobile menu
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('no-scroll');
            
            // Update active menu item
            mobileMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
            item.classList.add('active');
            
            if (sectionId === 'contact') {
                // Show contact fullscreen section
                showFullSection('contactFullSection');
            } else if (sectionId === 'home') {
                // Scroll to first section
                scrollToSection(0);
            } else {
                // Scroll to corresponding section
                const sectionIndex = Array.from(sectionElements).findIndex(
                    section => section.id === `${sectionId}Section`
                );
                if (sectionIndex !== -1) {
                    scrollToSection(sectionIndex);
                }
            }
        });
    });
    
    // Explore button click handler
    exploreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId) {
                showFullSection(`${sectionId}FullSection`);
            }
        });
    });
    
    // Back button click handler
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.mobile-fullscreen-section');
            if (section) {
                section.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    });
    
    // Function to show a fullscreen section
    function showFullSection(sectionId) {
        // Hide all fullscreen sections
        fullScreenSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            body.classList.add('no-scroll');
            
            // Scroll to top of section
            targetSection.scrollTop = 0;
        }
    }
    
    // Function to scroll to a specific section
    function scrollToSection(index) {
        if (index >= 0 && index < totalSections) {
            // Update current section index
            currentSectionIndex = index;
            
            // Smooth scroll to the section
            sectionElements[index].scrollIntoView({ behavior: 'smooth' });
            
            // Update active menu item
            updateActiveMenuItem();
        }
    }
    
    // Function to update active menu item based on current section
    function updateActiveMenuItem() {
        const currentSection = sectionElements[currentSectionIndex];
        const sectionId = currentSection.id.replace('Section', '');
        
        // Update menu items
        mobileMenuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    }
    
    // Function to handle scroll events for section snap
    mobileSections.addEventListener('scroll', debounce(() => {
        // Get current scroll position
        const scrollPosition = mobileSections.scrollTop;
        
        // Calculate current section based on scroll position
        const sectionHeight = window.innerHeight;
        const newIndex = Math.round(scrollPosition / sectionHeight);
        
        if (newIndex !== currentSectionIndex && newIndex >= 0 && newIndex < totalSections) {
            currentSectionIndex = newIndex;
            updateActiveMenuItem();
        }
    }, 100));
    
    // Add swipe indicators to sections
    function addSwipeIndicators() {
        sectionElements.forEach((section, index) => {
            // Only add left indicator if not the first section
            if (index > 0) {
                const leftIndicator = document.createElement('div');
                leftIndicator.className = 'swipe-indicator left';
                leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
                leftIndicator.addEventListener('click', () => scrollToSection(index - 1));
                section.appendChild(leftIndicator);
            }
            
            // Only add right indicator if not the last section
            if (index < totalSections - 1) {
                const rightIndicator = document.createElement('div');
                rightIndicator.className = 'swipe-indicator right';
                rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
                rightIndicator.addEventListener('click', () => scrollToSection(index + 1));
                section.appendChild(rightIndicator);
            }
        });
    }
    
    // Swipe detection
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Functions for handling touch events
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
    
    function handleTouchMove(event) {
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
    }
    
    function handleTouchEnd() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only detect horizontal swipe if it's stronger than vertical movement
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - go to previous section
                scrollToSection(currentSectionIndex - 1);
            } else {
                // Swipe left - go to next section
                scrollToSection(currentSectionIndex + 1);
            }
        }
        
        // Reset values
        touchStartX = 0;
        touchEndX = 0;
        touchStartY = 0;
        touchEndY = 0;
    }
    
    // Add touch event listeners to all sections
    sectionElements.forEach(section => {
        section.addEventListener('touchstart', handleTouchStart, { passive: true });
        section.addEventListener('touchmove', handleTouchMove, { passive: true });
        section.addEventListener('touchend', handleTouchEnd);
    });
    
    // Lazy loading for images
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add loading placeholder
                        if (!img.parentElement.querySelector('.shimmer-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'shimmer-placeholder';
                            placeholder.style.width = img.width + 'px';
                            placeholder.style.height = img.height + 'px';
                            img.parentElement.insertBefore(placeholder, img);
                        }
                        
                        // Load the image
                        const newImg = new Image();
                        newImg.src = img.dataset.src;
                        newImg.onload = () => {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            
                            // Remove placeholder
                            const placeholder = img.parentElement.querySelector('.shimmer-placeholder');
                            if (placeholder) {
                                placeholder.remove();
                            }
                        };
                        
                        // Remove the data-src attribute
                        img.removeAttribute('data-src');
                        
                        // Stop observing the current element
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '0px 0px 200px 0px' // Load images 200px before they come into view
            });
            
            lazyImages.forEach(img => {
                img.classList.add('lazy-image');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Gallery project button handler
    const projectGalleryBtn = document.getElementById('projectGalleryBtn');
    if (projectGalleryBtn) {
        projectGalleryBtn.addEventListener('click', () => {
            showFullSection('galleryFullSection');
        });
    }
    
    // Form submission handler with feedback
    const contactForm = document.querySelector('.mobile-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const formElements = contactForm.elements;
            
            // Disable form and show loading state
            submitBtn.disabled = true;
            
            // Add loading indicator
            const loadingIndicator = document.createElement('span');
            loadingIndicator.className = 'loading-indicator';
            submitBtn.prepend(loadingIndicator);
            submitBtn.querySelector('span').textContent = 'Sending...';
            
            // Prepare form data
            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');
            
            // Simulate form submission (replace with actual submission code)
            setTimeout(() => {
                // Show success message
                const formContainer = contactForm.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i><p>Thank you for your message!</p><p>We\'ll get back to you soon.</p>';
                
                // Replace form with success message
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
            }, 1500);
        });
    }
    
    // Helper function: Debounce
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Handle orientation changes
    window.addEventListener('resize', debounce(() => {
        // Reset scroll position to current section
        scrollToSection(currentSectionIndex);
    }, 150));
}); 