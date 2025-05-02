/**
 * Mobile website functionality
 * Simplified JavaScript for the mobile version
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Hide the loader after a short delay
        setTimeout(function() {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.classList.add('loader-hidden');
                document.body.classList.add('loaded');
                
                // Remove the loader from the DOM after the transition
                setTimeout(function() {
                    loader.remove();
                }, 700);
            }
        }, 500);
    });
    
    // Initialize navigation
    initMobileNavigation();
    
    // Initialize section navigation
    initSectionNavigation();
    
    // Initialize modals
    initModals();
    
    // Initialize gallery
    initGallery();
    
    // Handle contact form submission
    initContactForm();
    
    // Initialize language switching
    initLanguageSwitcher();
    
    // Handle lazy loading of images
    initLazyLoading();
});

/**
 * Initialize the mobile navigation menu
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!menuToggle || !mobileNav) return;
    
    // Toggle the menu when the button is clicked
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close the menu when clicking a menu item
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close the menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Initialize section navigation
 */
function initSectionNavigation() {
    const sections = document.querySelectorAll('.mobile-section');
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    // Show the initial section (home)
    const initialSection = document.getElementById('home');
    if (initialSection) {
        initialSection.classList.add('active');
    }
    
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (!targetSection) return;
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            targetSection.classList.add('active');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Scroll to top of the section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Handle buttons that navigate to sections
    const sectionButtons = document.querySelectorAll('.mobile-btn[href^="#"]');
    sectionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const targetNavLink = document.querySelector(`.mobile-nav-link[href="#${targetId}"]`);
            
            if (!targetSection) return;
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            targetSection.classList.add('active');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            if (targetNavLink) {
                targetNavLink.classList.add('active');
            }
            
            // Scroll to top of the section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Initialize modals (gallery and project description)
 */
function initModals() {
    // Gallery modal
    const galleryBtn = document.querySelector('.view-gallery-btn');
    const galleryModal = document.querySelector('.mobile-gallery-modal');
    const closeGalleryBtn = document.querySelector('.mobile-close-gallery');
    
    if (galleryBtn && galleryModal && closeGalleryBtn) {
        galleryBtn.addEventListener('click', function() {
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeGalleryBtn.addEventListener('click', function() {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Project modal
    const projectBtn = document.querySelector('.view-project-btn');
    const projectModal = document.querySelector('.mobile-project-modal');
    const closeProjectBtn = document.querySelector('.mobile-close-project');
    
    if (projectBtn && projectModal && closeProjectBtn) {
        projectBtn.addEventListener('click', function() {
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeProjectBtn.addEventListener('click', function() {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

/**
 * Initialize the gallery slider
 */
function initGallery() {
    const galleryImages = [
        'images/CA project done/IBICali2019-30.jpg',
        'images/CA project done/IBICali2019-26.jpg',
        'images/CA project done/IBICali2019-32.jpg',
        'images/CA project done/IBICali2019-29.jpg',
        'images/CA project done/IBICali2019-31.jpg'
    ];
    
    const gallerySlider = document.querySelector('.mobile-gallery-slider');
    const galleryDots = document.querySelector('.mobile-gallery-dots');
    const prevBtn = document.querySelector('.mobile-gallery-prev');
    const nextBtn = document.querySelector('.mobile-gallery-next');
    
    if (!gallerySlider || !galleryDots || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    
    // Create gallery slides
    galleryImages.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `mobile-gallery-slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Gallery image ${index + 1}`;
        
        slide.appendChild(img);
        gallerySlider.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = `mobile-gallery-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-slide', index);
        
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.getAttribute('data-slide')));
        });
        
        galleryDots.appendChild(dot);
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
    });
    
    // Swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallerySlider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    gallerySlider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            goToSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            goToSlide(currentSlide - 1);
        }
    }
    
    function goToSlide(index) {
        const slides = document.querySelectorAll('.mobile-gallery-slide');
        const dots = document.querySelectorAll('.mobile-gallery-dot');
        
        // Handle wrapping
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        // Update slides
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        
        // Update dots
        dots[currentSlide].classList.remove('active');
        dots[index].classList.add('active');
        
        // Update current slide
        currentSlide = index;
    }
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('mobileContactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        // Send form data to Formspree
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                // Show error message
                alert('Oops! There was a problem submitting your form. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! There was a problem submitting your form. Please try again.');
        });
    });
}

/**
 * Initialize language switcher
 */
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (!langButtons.length) return;
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            
            // Skip if already active
            if (this.classList.contains('active')) return;
            
            // Update active button
            langButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // TODO: Implement translation logic
            // For now, just show a message
            console.log(`Switching to ${language} language`);
            
            // In a real implementation, you would load translations from a JSON file
            // and update the text content of elements
        });
    });
}

/**
 * Initialize lazy loading of images
 */
function initLazyLoading() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
} 