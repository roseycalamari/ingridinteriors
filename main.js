function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const cover = document.createElement('div');
    cover.className = 'project-cover';
    
    const img = document.createElement('img');
    img.className = 'project-cover-image';
    img.loading = 'lazy';
    img.src = project.image;
    img.alt = project.title;
    
    const info = document.createElement('div');
    info.className = 'project-info';
    
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    
    const location = document.createElement('p');
    location.className = 'project-location';
    location.textContent = project.location;
    
    const button = document.createElement('button');
    button.className = 'view-project-btn';
    button.textContent = 'View Project';
    
    // Add click handler for project card
    card.addEventListener('click', () => {
        // Add smooth transition effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
            // Open project details or navigate to project page
            window.location.href = project.url || '#';
        }, 150);
    });
    
    // Add hover effect for the button
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
    
    cover.appendChild(img);
    info.appendChild(title);
    info.appendChild(location);
    info.appendChild(button);
    card.appendChild(cover);
    card.appendChild(info);
    
    return card;
}

function initializePortfolioAndTeam() {
    const projects = [
        {
            image: 'images/projects/luxury-penthouse.jpg',
            title: 'Luxury Penthouse',
            location: 'New York, NY',
            url: '#'
        },
        {
            image: 'images/projects/coastal-retreat.jpg',
            title: 'Coastal Retreat',
            location: 'Malibu, CA',
            url: '#'
        },
        {
            image: 'images/projects/mountain-lodge.jpg',
            title: 'Mountain Lodge',
            location: 'Aspen, CO',
            url: '#'
        },
        {
            image: 'images/projects/urban-loft.jpg',
            title: 'Urban Loft',
            location: 'Chicago, IL',
            url: '#'
        },
        {
            image: 'images/projects/country-estate.jpg',
            title: 'Country Estate',
            location: 'Napa Valley, CA',
            url: '#'
        },
        {
            image: 'images/projects/boutique-hotel.jpg',
            title: 'Boutique Hotel',
            location: 'Miami, FL',
            url: '#'
        }
    ];
    
    const container = document.querySelector('.project-cards-container');
    if (container) {
        // Clear existing content
        container.innerHTML = '';
        
        // Add fade-in animation for each card
        projects.forEach((project, index) => {
            const card = createProjectCard(project);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            container.appendChild(card);
            
            // Stagger the animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Add click handlers for view project buttons
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            const projectId = btn.getAttribute('data-project');
            openProjectDetail(projectId);
        });
    });
}

function openProjectDetail(projectId) {
    const popup = document.querySelector('.project-detail-popup');
    const popupBackground = document.querySelector('.project-popup-background');
    const closeBtn = document.querySelector('.close-project-detail');
    
    if (popup && popupBackground && closeBtn) {
        // Show the popup
        popup.classList.add('active');
        popupBackground.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Initialize carousel
        initializeCarousel();
        
        // Add click handler for close button
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            popupBackground.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Close when clicking outside
        popupBackground.addEventListener('click', () => {
            popup.classList.remove('active');
            popupBackground.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                popup.classList.remove('active');
                popupBackground.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
}

function initializeCarousel() {
    const carousel = document.querySelector('.adaptive-carousel');
    const mainImage = carousel.querySelector('.carousel-main-image');
    const prevBtn = carousel.querySelector('.carousel-prev-btn');
    const nextBtn = carousel.querySelector('.carousel-next-btn');
    const indicators = carousel.querySelector('.carousel-indicators');
    const imageList = document.querySelectorAll('.carousel-image-list img');
    let currentIndex = 0;
    
    // Create indicators
    imageList.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator${index === 0 ? ' active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    // Update buttons state
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === imageList.length - 1;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= imageList.length) return;
        
        // Update image with fade effect
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = imageList[index].src;
            mainImage.style.opacity = '1';
        }, 300);
        
        // Update indicators
        indicators.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
        updateButtons();
    }
    
    // Add click handlers for navigation buttons
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // Initialize first slide
    updateButtons();
}

// Mobile-specific functions
function initializeMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    const sections = document.querySelectorAll('.mobile-section');
    
    // Function to toggle mobile menu
    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Open menu when clicking menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking anywhere in the menu (as a fallback)
    if (mobileNav) {
        mobileNav.addEventListener('click', function(e) {
            // Only close if clicking directly on the menu background, not on menu items
            if (e.target === mobileNav) {
                toggleMobileMenu();
            }
        });
    }
    
    // Handle menu item clicks
    if (menuItems) {
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get the target section ID from the href attribute
                const targetId = item.getAttribute('href');
                
                // If it's a panel section within home, scroll to it
                if (targetId.includes('section') && document.querySelector(targetId)) {
                    const targetSection = document.querySelector(targetId);
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update the active dot
                    if (targetId.includes('section')) {
                        const sectionId = targetId.substring(1); // Remove the # symbol
                        const dots = document.querySelectorAll('.scroll-dot');
                        
                        dots.forEach(dot => {
                            const dotSection = dot.getAttribute('data-section');
                            dot.classList.toggle('active', dotSection === sectionId);
                        });
                    }
                    
                    // Close the mobile menu
                    toggleMobileMenu();
                    return;
                }
                
                // Hide all sections
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the target section
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // Update active menu item
                    menuItems.forEach(menuItem => {
                        menuItem.classList.remove('active');
                    });
                    item.classList.add('active');
                    
                    // Close the mobile menu
                    toggleMobileMenu();
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }
    
    // Initialize Panel Buttons and Details
    initializeDetailPanels();
    
    // Initialize Scroll Indicators
    initializeScrollIndicators();
    
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('.mobile-btn, .mobile-menu-item, .panel-button');
    if (buttons) {
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.classList.add('touch-active');
            });
            
            button.addEventListener('touchend', () => {
                button.classList.remove('touch-active');
            });
        });
    }
    
    // Handle gallery and project info buttons
    const galleryBtn = document.querySelector('.view-gallery-btn');
    const projectInfoBtn = document.querySelector('.project-info-btn');
    
    if (galleryBtn) {
        galleryBtn.addEventListener('click', () => {
            // Placeholder for gallery functionality
            alert('Gallery functionality will be implemented here');
        });
    }
    
    if (projectInfoBtn) {
        projectInfoBtn.addEventListener('click', () => {
            // Placeholder for project info functionality
            alert('Project info functionality will be implemented here');
        });
    }
    
    // Check if device is in landscape mode
    function checkOrientation() {
        if (window.innerHeight < window.innerWidth) {
            document.body.classList.add('landscape');
        } else {
            document.body.classList.remove('landscape');
        }
    }
    
    // Check orientation on load and resize
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
}

// Initialize Scroll Indicators with smooth scrolling
function initializeScrollIndicators() {
    const panels = document.querySelectorAll('.mobile-fullscreen-panel');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const homeSection = document.getElementById('home');
    
    // Force check the visible panel immediately on page load
    function checkVisiblePanelOnLoad() {
        // Short delay to ensure DOM is ready
        setTimeout(() => {
            // Find which panel is currently in view
            panels.forEach((panel, index) => {
                const rect = panel.getBoundingClientRect();
                // If panel is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Update active dot
                    scrollDots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                }
            });
        }, 100);
    }
    
    // Call on page load
    checkVisiblePanelOnLoad();
    
    // Manual scroll detection (works alongside IntersectionObserver)
    function checkVisiblePanelOnScroll() {
        // Find which panel is most visible
        let mostVisiblePanel = null;
        let maxVisibleArea = 0;
        
        panels.forEach((panel) => {
            const rect = panel.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibleArea = Math.max(0, visibleHeight) / panel.offsetHeight;
            
            if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                mostVisiblePanel = panel;
            }
        });
        
        if (mostVisiblePanel) {
            const index = Array.from(panels).indexOf(mostVisiblePanel);
            // Update active dot
            scrollDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }
    
    // Add scroll event listener to detect natural scrolling
    if (homeSection) {
        homeSection.addEventListener('scroll', checkVisiblePanelOnScroll, { passive: true });
        // Also add to window for backup
        window.addEventListener('scroll', checkVisiblePanelOnScroll, { passive: true });
    }
    
    // Use IntersectionObserver for better performance
    if ('IntersectionObserver' in window && panels.length > 0) {
        const options = {
            root: homeSection,
            rootMargin: '-10% 0px -10% 0px', // Adjusted for better accuracy
            threshold: [0.3, 0.6, 0.9] // Multiple thresholds for more responsive updates
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Find the index of the visible panel
                    const visiblePanelIndex = Array.from(panels).indexOf(entry.target);
                    
                    // Update the active dot
                    scrollDots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === visiblePanelIndex);
                    });
                    
                    // Update URL hash for deep linking (optional)
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        history.replaceState(null, null, '#' + sectionId);
                    }
                }
            });
        }, options);
        
        // Observe all panels
        panels.forEach(panel => {
            observer.observe(panel);
        });
    }
    
    // Enable smooth scrolling with momentum effect
    let isScrolling = false;
    
    // Add click event to scroll dots
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isScrolling) return; // Prevent multiple scrolls
            
            const targetId = dot.getAttribute('data-section');
            const targetPanel = document.getElementById(targetId);
            
            if (targetPanel) {
                isScrolling = true;
                
                // Update active dot immediately for better UX
                scrollDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Smoothly scroll to the target panel
                targetPanel.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
                
                // Reset isScrolling after animation completes
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        });
    });
    
    // Add swipe navigation for touch devices
    if (homeSection && 'ontouchstart' in window) {
        let touchStartY = 0;
        let touchEndY = 0;
        let currentPanelIndex = 0;
        
        homeSection.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        homeSection.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            if (isScrolling) return;
            
            const swipeDistance = touchStartY - touchEndY;
            const threshold = 50; // Minimum swipe distance
            
            // Find current panel
            panels.forEach((panel, index) => {
                const rect = panel.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    currentPanelIndex = index;
                }
            });
            
            if (Math.abs(swipeDistance) > threshold) {
                isScrolling = true;
                
                // Swipe down -> previous panel
                if (swipeDistance < 0 && currentPanelIndex > 0) {
                    scrollToPanel(currentPanelIndex - 1);
                }
                // Swipe up -> next panel
                else if (swipeDistance > 0 && currentPanelIndex < panels.length - 1) {
                    scrollToPanel(currentPanelIndex + 1);
                }
                
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        }
        
        function scrollToPanel(index) {
            if (panels[index]) {
                // Update active dot
                scrollDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                // Scroll to panel
                panels[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            }
        }
    }
}

// Initialize Panel Details with enhanced animations
function initializeDetailPanels() {
    const panelButtons = document.querySelectorAll('.panel-button');
    const closeButtons = document.querySelectorAll('.close-detail');
    const detailContainers = document.querySelectorAll('.detail-container');
    
    // Add click event to panel buttons with enhanced animation
    panelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetDetail = document.getElementById(targetId);
            
            if (targetDetail) {
                // Add button animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 200);
                
                // Open detail panel with smooth animation
                targetDetail.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });
    
    // Add click event to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const detailContainer = button.closest('.detail-container');
            
            if (detailContainer) {
                // Close the detail panel
                detailContainer.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Close when clicking outside of content (for specific areas)
    detailContainers.forEach(container => {
        container.addEventListener('click', (e) => {
            // Only close if clicking directly on the container background
            if (e.target === container) {
                container.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeDetail = document.querySelector('.detail-container.active');
            if (activeDetail) {
                activeDetail.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
}

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Close mobile menu when close button is clicked
    const closeBtn = document.querySelector('.mobile-close-btn');
    if (closeBtn && mobileNav) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Scroll dots navigation for mobile
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const panels = document.querySelectorAll('.mobile-fullscreen-panel');
    
    if (scrollDots.length && panels.length) {
        // Initialize Intersection Observer to detect which panel is visible
        const panelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(panels).indexOf(entry.target);
                    updateActiveDot(index);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe all panels
        panels.forEach(panel => panelObserver.observe(panel));
        
        // Update active dot based on index
        function updateActiveDot(index) {
            scrollDots.forEach(dot => dot.classList.remove('active'));
            if (scrollDots[index]) {
                scrollDots[index].classList.add('active');
            }
        }
        
        // Add click event for each scroll dot
        scrollDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                panels[index].scrollIntoView({ behavior: 'smooth' });
                updateActiveDot(index);
            });
        });
    }
    
    // Detail panel toggle for mobile
    const panelButtons = document.querySelectorAll('.panel-button');
    const closeDetailButtons = document.querySelectorAll('.close-detail');
    const backHomeButtons = document.querySelectorAll('.service-back-home-btn, .about-back-home-btn, .brands-back-home-btn');
    
    panelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });
    
    closeDetailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const detailPanel = button.closest('.detail-container');
            if (detailPanel) {
                detailPanel.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    backHomeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const detailPanel = button.closest('.detail-container');
            if (detailPanel) {
                detailPanel.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Handle hover effects for mobile devices
    if ('ontouchstart' in window) {
        const mobilePanels = document.querySelectorAll('.mobile-fullscreen-panel');
        mobilePanels.forEach(panel => {
            panel.addEventListener('touchstart', () => {
                panel.classList.add('hover-effect');
            });
            
            panel.addEventListener('touchend', () => {
                setTimeout(() => {
                    panel.classList.remove('hover-effect');
                }, 500);
            });
        });
    }
    
    // Add animation classes when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.mobile-fullscreen-panel, .service-card, .brand-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Run on scroll and on load
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        if (window.orientation === 90 || window.orientation === -90) {
            document.body.classList.add('landscape');
        } else {
            document.body.classList.remove('landscape');
        }
    });
    
    // Check initial orientation
    if (window.orientation === 90 || window.orientation === -90) {
        document.body.classList.add('landscape');
    }
});

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio and team if on desktop
    if (!window.location.href.includes('mobile.html')) {
        initializePortfolioAndTeam();
    }
    
    // Initialize mobile navigation if on mobile
    if (window.location.href.includes('mobile.html') || document.querySelector('.mobile-nav')) {
        initializeMobileNavigation();
    }
});

// Gallery and project modals functionality
document.addEventListener('DOMContentLoaded', function() {
    // Define gallery images for the California project
    const galleryImages = [
        'images/CA project done/IBICali2019-30.jpg',
        'images/CA project done/IBICali2019-31.jpg',
        'images/CA project done/IBICali2019-33.jpg',
        'images/CA project done/IBICali2019-38.jpg',
        'images/CA project done/IBICali2019-41.jpg',
        'images/CA project done/IBICali2019-47.jpg',
        'images/CA project done/IBICali2019-48.jpg',
        'images/CA project done/IBICali2019-54.jpg'
    ];
    
    let currentSlide = 0;
    
    // Gallery Button
    const galleryBtn = document.getElementById('galleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryBtn = document.getElementById('closeGalleryBtn');
    const gallerySlider = document.getElementById('gallerySlider');
    const galleryIndicators = document.getElementById('galleryIndicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Project Info Button
    const projectInfoBtn = document.getElementById('projectInfoBtn');
    const projectDescriptionModal = document.getElementById('projectDescriptionModal');
    const closeProjectDescriptionBtn = document.getElementById('closeProjectDescriptionBtn');
    
    // Initialize the gallery if the elements exist
    if (galleryBtn && galleryModal) {
        // Create slides for the gallery
        galleryImages.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('gallery-slide');
            if (index === 0) slide.classList.add('active');
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `California Project Image ${index + 1}`;
            img.loading = 'lazy';
            
            slide.appendChild(img);
            gallerySlider.appendChild(slide);
            
            // Create indicator for this slide
            const indicator = document.createElement('div');
            indicator.classList.add('gallery-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            galleryIndicators.appendChild(indicator);
        });
        
        // Gallery navigation
        function goToSlide(n) {
            const slides = gallerySlider.querySelectorAll('.gallery-slide');
            const indicators = galleryIndicators.querySelectorAll('.gallery-indicator');
            
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }
        
        // Previous and Next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        }
        
        // Open gallery modal
        galleryBtn.addEventListener('click', function() {
            galleryModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        // Close gallery modal
        closeGalleryBtn.addEventListener('click', function() {
            galleryModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Project description modal
    if (projectInfoBtn && projectDescriptionModal) {
        // Open project description modal
        projectInfoBtn.addEventListener('click', function() {
            projectDescriptionModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        // Close project description modal
        closeProjectDescriptionBtn.addEventListener('click', function() {
            projectDescriptionModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Video player functionality
    const video = document.getElementById('collections-video');
    if (video) {
        const playBtn = document.querySelector('.video-play-btn');
        const volumeBtn = document.querySelector('.video-volume-btn');
        const fullscreenBtn = document.querySelector('.video-fullscreen-btn');
        const progressBar = document.querySelector('.video-progress-bar');
        const progress = document.querySelector('.video-progress');
        const currentTimeEl = document.querySelector('.video-current-time');
        const durationEl = document.querySelector('.video-duration');
        
        // Format time in minutes and seconds
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        
        // Update progress bar
        function updateProgress() {
            if (video.currentTime > 0) {
                const percent = (video.currentTime / video.duration) * 100;
                progress.style.width = `${percent}%`;
                currentTimeEl.textContent = formatTime(video.currentTime);
            }
        }
        
        // Set video time when clicking on progress bar
        if (progressBar) {
            progressBar.addEventListener('click', function(e) {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                video.currentTime = percent * video.duration;
                updateProgress();
            });
        }
        
        // Play/Pause video
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
        
        // Toggle volume
        if (volumeBtn) {
            volumeBtn.addEventListener('click', function() {
                video.muted = !video.muted;
                if (video.muted) {
                    this.innerHTML = '<i class="fas fa-volume-mute"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            });
        }
        
        // Toggle fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            });
        }
        
        // Update time display
        video.addEventListener('loadedmetadata', function() {
            durationEl.textContent = formatTime(video.duration);
        });
        
        video.addEventListener('timeupdate', updateProgress);
    }
    
    // Return home buttons functionality
    const returnButtons = document.querySelectorAll('.service-back-home-btn, .about-back-home-btn, .brands-back-home-btn');
    returnButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailContainer = this.closest('.detail-container');
            if (detailContainer) {
                detailContainer.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
}); 