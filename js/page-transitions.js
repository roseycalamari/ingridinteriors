/**
 * Advanced Page Transitions System
 * Creates ultra-smooth transitions between pages with optimized performance
 * Mobile-optimized with intelligent handling of different navigation patterns
 */

document.addEventListener('DOMContentLoaded', () => {
    // The transition overlay element
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    
    // All links that should trigger page transitions
    const pageTransitionLinks = document.querySelectorAll('[data-page-transition]');
    
    // Cache current page for intelligent transitions
    const currentPage = {
        path: window.location.pathname,
        isHome: window.location.pathname === '/' || 
                window.location.pathname.endsWith('/') || 
                window.location.pathname.endsWith('index.html'),
        type: window.location.pathname.includes('service') ? 'service' :
              window.location.pathname.includes('person') ? 'person' :
              window.location.pathname.includes('brands') ? 'brands' :
              window.location.pathname.includes('contact') ? 'contact' : 'home'
    };

    /**
     * Get transition type based on navigation path
     * @param {string} targetUrl - Target URL
     * @param {boolean} isBackNavigation - Whether this is a back button navigation
     * @returns {Object} - Transition settings including type, duration, and easing
     */
    const getTransitionType = (targetUrl, isBackNavigation = false) => {
        // Determine if this is a return to homepage
        const isHomepageReturn = targetUrl === 'index.html' || 
                                targetUrl.endsWith('/index.html') || 
                                targetUrl === '/' || 
                                targetUrl.endsWith('/');
        
        // Determine target page type
        const targetType = targetUrl.includes('service') ? 'service' :
                          targetUrl.includes('person') ? 'person' :
                          targetUrl.includes('brands') ? 'brands' :
                          targetUrl.includes('contact') ? 'contact' : 'home';
        
        // Optimized transition values
        let transitionType = 'slide';
        let transitionDuration = 600;
        let transitionEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Adjust transition type based on navigation pattern
        if (isHomepageReturn) {
            transitionType = 'fade';
            transitionDuration = 500;
        } else if (isBackNavigation) {
            transitionType = 'slideBack';
            transitionDuration = 550;
        } else if (currentPage.type === 'home' && targetType !== 'home') {
            transitionType = 'zoomOut';
            transitionDuration = 650;
        } else if (currentPage.type !== 'home' && targetType !== 'home') {
            transitionType = 'crossfade';
            transitionDuration = 500;
        }
        
        return {
            type: transitionType,
            duration: transitionDuration,
            easing: transitionEasing
        };
    };
    
    /**
     * Handles the transition to a new page
     * @param {string} targetUrl - The URL to navigate to
     * @param {boolean} isBackNavigation - Whether this is a back button navigation
     * @param {boolean} isFadeTransition - Whether to force fade transition
     */
    const handlePageTransition = (targetUrl, isBackNavigation = false, isFadeTransition = false) => {
        // If there's no url or it's the current page, do nothing
        if (!targetUrl || targetUrl === window.location.href) return;
        
        // Stop video if it's playing when closing brands section
        const video = document.getElementById('collections-video');
        if (video && !video.paused) {
            video.pause();
            video.currentTime = 0;
            const videoWrapper = document.querySelector('.luxury-video-wrapper');
            if (videoWrapper) {
                videoWrapper.classList.remove('video-playing');
            }
            const playButton = document.querySelector('.video-play-btn');
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        // Resolve relative URLs
        let resolvedUrl = targetUrl;
        if (!targetUrl.startsWith('http') && !targetUrl.startsWith('/')) {
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            resolvedUrl = baseUrl + targetUrl;
        }
        
        // Check if it's the same page with different hash
        const currentUrlWithoutHash = window.location.href.split('#')[0];
        const targetUrlWithoutHash = resolvedUrl.split('#')[0];
        if (currentUrlWithoutHash === targetUrlWithoutHash) {
            window.location.href = resolvedUrl;
            return;
        }
        
        // Add transition class to body
        document.body.classList.add('page-transition-active');
        
        // Get transition settings
        const transition = isFadeTransition ? 
            { type: 'fade', duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' } : 
            getTransitionType(targetUrl, isBackNavigation);
        
        // Apply transition settings to the overlay
        if (transitionOverlay) {
            transitionOverlay.style.visibility = 'visible';
            
            // Apply CSS variables for transition
            document.documentElement.style.setProperty('--page-transition-duration', `${transition.duration}ms`);
            document.documentElement.style.setProperty('--page-transition-easing', transition.easing);
            
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
                // Apply appropriate transition styles based on type
                switch(transition.type) {
                    case 'fade':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0)';
                        transitionOverlay.classList.add('fade-transition');
                        break;
                    case 'slideBack':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(-100%)';
                        break;
                    case 'zoomOut':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0) scale(1.05)';
                        transitionOverlay.classList.add('zoom-transition');
                        break;
                    case 'crossfade':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0)';
                        transitionOverlay.classList.add('crossfade-transition');
                        break;
                    default:  // Default 'slide'
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0)';
                        break;
                }
            });
        }
        
        // Wait for transition to complete then navigate
        setTimeout(() => {
            // Save current scroll position for back navigation
            const scrollPos = window.scrollY;
            sessionStorage.setItem('scrollPosition_' + window.location.pathname, scrollPos);
            
            // Save transition type for entry animation
            sessionStorage.setItem('lastTransition', transition.type);
            
            // Navigate to the new URL
            window.location.href = resolvedUrl;
        }, transition.duration - 100); // Increased buffer for smoother transition
    };
    
    /**
     * Handle entering the page with proper animation
     */
    const handlePageEnter = () => {
        // Get the transition type used to navigate to this page
        const lastTransition = sessionStorage.getItem('lastTransition') || 'slide';
        
        // If we're coming from a page transition, animate the overlay out
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            if (transitionOverlay) {
                // Set the initial position for the overlay
                transitionOverlay.style.visibility = 'visible';
                transitionOverlay.style.opacity = '1';
                
                // Add appropriate transition class
                if (lastTransition === 'fade' || lastTransition === 'crossfade') {
                    transitionOverlay.classList.add('fade-transition');
                } else if (lastTransition === 'zoomOut') {
                    transitionOverlay.classList.add('zoom-transition');
                }
                
                // Check if this is a return to homepage
                const isHomepageReturn = window.location.pathname === '/' || 
                                        window.location.pathname.endsWith('/') || 
                                        window.location.pathname.endsWith('index.html');
                
                // Different animation for homepage returns
                if (isHomepageReturn && (lastTransition === 'fade' || transitionOverlay.classList.contains('fade-transition'))) {
                    // Fade out for homepage returns
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.opacity = '0';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            transitionOverlay.classList.remove('fade-transition');
                            transitionOverlay.classList.remove('zoom-transition');
                            transitionOverlay.classList.remove('crossfade-transition');
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                            
                            // Reinitialize navigation elements after transition
                            if (isHomepageReturn) {
                                // Reinitialize logo and navigation elements
                                const logoTrigger = document.querySelector('.logo-container');
                                const navHint = document.querySelector('.nav-hint');
                                const contactBtn = document.querySelector('.contact-btn');
                                
                                if (logoTrigger) {
                                    logoTrigger.style.display = 'block';
                                    logoTrigger.style.opacity = '1';
                                }
                                if (navHint) {
                                    navHint.style.display = 'block';
                                    navHint.style.opacity = '1';
                                }
                                if (contactBtn) {
                                    contactBtn.style.display = 'block';
                                    contactBtn.style.opacity = '1';
                                }
                                
                                // Reinitialize navigation system
                                if (typeof window.navigationSystem !== 'undefined') {
                                    window.navigationSystem.initNavigation();
                                }
                            }
                        }, 700);
                    }, 100);
                } else if (lastTransition === 'zoomOut') {
                    // Zoom in animation
                    transitionOverlay.style.transform = 'translateY(0) scale(1.05)';
                    
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.opacity = '0';
                        transitionOverlay.style.transform = 'translateY(0) scale(1.1)';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            transitionOverlay.classList.remove('zoom-transition');
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 1000);
                    }, 100);
                } else if (lastTransition === 'crossfade') {
                    // Cross-fade animation
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.opacity = '0';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            transitionOverlay.classList.remove('crossfade-transition');
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 800);
                    }, 100);
                } else {
                    // Standard slide transition
                    transitionOverlay.style.transform = 'translateY(0)';
                    
                    // Add complete class to animate out
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.transform = 'translateY(-100%)';
                        transitionOverlay.style.opacity = '0';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 1000);
                    }, 100);
                }
            }
            
            // Restore scroll position if navigating back
            if (performance.navigation.type === 2) { // Back button navigation
                const savedScrollPos = sessionStorage.getItem('scrollPosition_' + window.location.pathname);
                if (savedScrollPos) {
                    setTimeout(() => {
                        window.scrollTo(0, parseInt(savedScrollPos));
                    }, 200);
                }
            }
        }
    };
    
    /**
     * Setup event listeners for transition links
     */
    const setupTransitionLinks = () => {
        pageTransitionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                
                // For overlays, close them first with a slight delay
                const overlay = link.closest('.fullscreen-overlay');
                if (overlay && overlay.classList.contains('overlay-active')) {
                    overlay.classList.remove('overlay-active');
                    setTimeout(() => {
                        handlePageTransition(targetUrl);
                    }, 400);
                } else {
                    handlePageTransition(targetUrl);
                }
            });
        });
    };
    
    /**
     * Handle browser back button with custom transition
     */
    const handleBrowserNavigation = () => {
        window.addEventListener('popstate', (e) => {
            // Prevent default behavior only if we want to handle it ourselves
            if (document.body.classList.contains('page-transition-active')) {
                e.preventDefault();
                return;
            }
            
            // Handle back button with a special transition
            handlePageTransition(document.location.href, true);
        });
    };
    
    /**
     * Setup The Person button to properly navigate or show about section
     */
    const setupPersonLink = () => {
        const aboutBtn = document.querySelector('.about-btn');
        
        if (aboutBtn) {
            aboutBtn.addEventListener('click', (e) => {
                // First check if openAboutSection function exists
                if (typeof window.openAboutSection === 'function') {
                    // Use the existing function if we're on the homepage
                    const path = window.location.pathname;
                    if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
                        window.openAboutSection();
                    } else {
                        // Navigate to the person page otherwise
                        handlePageTransition('the-person.html');
                    }
                } else {
                    // Navigate to the person page if function doesn't exist
                    handlePageTransition('the-person.html');
                }
            });
        }
    };
    
    /**
     * Enhance the homepage return button behavior to use page transitions
     */
    const enhanceReturnButtons = () => {
        // For the about section on the homepage
        const aboutBackHomeBtn = document.querySelector('.about-back-home-btn');
        if (aboutBackHomeBtn) {
            const path = window.location.pathname;
            // Only add transition behavior if we're not on homepage
            if (!path.endsWith('index.html') && path !== '/' && !path.endsWith('/')) {
                aboutBackHomeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handlePageTransition('index.html', false, true); // Use fade transition
                });
            }
        }
        
        // For direct homepage return buttons on other pages
        const homeReturnBtns = document.querySelectorAll('.return-home-btn, .back-to-home-btn');
        homeReturnBtns.forEach(btn => {
            // Only add if it doesn't already have the data-page-transition attribute
            if (!btn.hasAttribute('data-page-transition')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Ensure consistent animation for all return buttons
                    // Use fade transition for smoother experience
                    handlePageTransition('index.html', false, true);
                });
            }
        });
    };
    
    /**
     * Optimize transitions for mobile devices
     */
    const optimizeMobileTransitions = () => {
        // Add active state for touch interactions
        pageTransitionLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
            }, { passive: true });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('touch-active');
                }, 300);
            }, { passive: true });
        });
        
        // Add class to body for mobile-specific styles
        document.body.classList.add('touch-device');
    };
    
    /**
     * Handle orientation changes for smooth transitions
     */
    const handleOrientationChanges = () => {
        window.addEventListener('orientationchange', () => {
            // Add a class to temporarily disable transitions during orientation change
            document.documentElement.classList.add('orientation-change');
            
            // Remove the class after orientation change is complete
            setTimeout(() => {
                document.documentElement.classList.remove('orientation-change');
            }, 500);
        });
    };
    
    /**
     * Optimize brand images loading
     */
    const optimizeBrandImages = () => {
        const brandImages = document.querySelectorAll('.brand-image');
        
        brandImages.forEach(img => {
            // Add loading class
            img.classList.add('loading');
            
            // Create a new image to preload
            const preloadImage = new Image();
            
            // When the image is loaded, remove loading class and set src
            preloadImage.onload = () => {
                img.classList.remove('loading');
                img.src = preloadImage.src;
            };
            
            // Start loading the image
            preloadImage.src = img.dataset.src || img.src;
        });
    };
    
    /**
     * Initialize the video player functionality
     */
    const initializeVideoPlayer = () => {
        const videoWrapper = document.querySelector('.luxury-video-wrapper');
        const video = document.getElementById('collections-video');
        const playButton = document.querySelector('.video-play-btn');
        const progressBar = document.querySelector('.video-progress-bar');
        const progress = document.querySelector('.video-progress');
        const progressHandle = document.querySelector('.video-progress-handle');
        const currentTimeDisplay = document.querySelector('.video-current-time');
        const durationDisplay = document.querySelector('.video-duration');
        const volumeButton = document.querySelector('.video-volume-btn');
        const fullscreenButton = document.querySelector('.video-fullscreen-btn');
        
        if (!videoWrapper || !video) return;
        
        // Format time in minutes and seconds
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        };
        
        // Update video progress
        const updateProgress = () => {
            if (!video.duration) return;
            
            const percentage = (video.currentTime / video.duration) * 100;
            if (progress) progress.style.width = `${percentage}%`;
            if (progressHandle) progressHandle.style.left = `${percentage}%`;
            
            if (currentTimeDisplay) {
                currentTimeDisplay.textContent = formatTime(video.currentTime);
            }
        };
        
        // Set video time based on progress bar click
        const setVideoProgress = (e) => {
            if (!progressBar || !video.duration) return;
            
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        };
        
        // Toggle fullscreen
        const toggleFullscreen = () => {
            if (!videoWrapper) return;
            
            if (!document.fullscreenElement) {
                if (videoWrapper.requestFullscreen) {
                    videoWrapper.requestFullscreen();
                } else if (videoWrapper.webkitRequestFullscreen) {
                    videoWrapper.webkitRequestFullscreen();
                } else if (videoWrapper.msRequestFullscreen) {
                    videoWrapper.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        };
        
        // Toggle mute
        const toggleMute = () => {
            if (!video || !volumeButton) return;
            
            video.muted = !video.muted;
            volumeButton.innerHTML = video.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        };
        
        // Play/pause functionality
        const togglePlay = () => {
            if (video.paused || video.ended) {
                video.play()
                    .then(() => {
                        videoWrapper.classList.add('video-playing');
                        playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    })
                    .catch(error => {
                        console.error('Error playing video:', error);
                    });
            } else {
                video.pause();
                videoWrapper.classList.remove('video-playing');
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        };
        
        // Set up event listeners
        if (playButton) {
            playButton.addEventListener('click', togglePlay);
        }
        
        if (video) {
            // Load metadata to get duration
            video.addEventListener('loadedmetadata', () => {
                if (durationDisplay) {
                    durationDisplay.textContent = formatTime(video.duration);
                }
            });
            
            // Update progress as video plays
            video.addEventListener('timeupdate', updateProgress);
            
            // Click on video to toggle play
            video.addEventListener('click', () => {
                if (videoWrapper.classList.contains('video-playing')) {
                    togglePlay();
                }
            });
            
            // When video ends
            video.addEventListener('ended', () => {
                videoWrapper.classList.remove('video-playing');
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                video.currentTime = 0;
            });
        }
        
        // Progress bar click handler
        if (progressBar) {
            progressBar.addEventListener('click', setVideoProgress);
        }
        
        // Volume button click handler
        if (volumeButton) {
            volumeButton.addEventListener('click', toggleMute);
        }
        
        // Fullscreen button click handler
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', toggleFullscreen);
        }
        
        // Add touch handling
        if (videoWrapper) {
            videoWrapper.addEventListener('touchstart', () => {
                if (videoWrapper.classList.contains('video-playing')) {
                    videoWrapper.classList.add('controls-visible');
                    
                    // Hide controls after 3 seconds
                    setTimeout(() => {
                        videoWrapper.classList.remove('controls-visible');
                    }, 3000);
                }
            }, { passive: true });
        }
    };
    
    // Expose the handlePageTransition function globally
    window.handlePageTransition = handlePageTransition;
    
    // Initialize the page transitions system
    const init = () => {
        setupTransitionLinks();
        handleBrowserNavigation();
        setupPersonLink();
        enhanceReturnButtons();
        optimizeBrandImages();
        initializeVideoPlayer();
        
        // Handle page enter animation
        handlePageEnter();
    };
    
    // Start initialization
    init();
});

// Project Gallery Functionality
document.addEventListener('DOMContentLoaded', () => {
    const galleryPopup = document.querySelector('.gallery-popup');
    const closeGalleryBtn = document.querySelector('.close-gallery');
    const galleryMainImage = document.querySelector('.gallery-main-image');
    const galleryThumbnailsContainers = document.querySelectorAll('.gallery-thumbnails-container');
    const projectThumbnails = document.querySelectorAll('.project-thumbnail');
    const prevBtn = document.querySelector('.gallery-prev-btn');
    const nextBtn = document.querySelector('.gallery-next-btn');
    
    // Check if gallery elements exist
    if (!galleryPopup || !projectThumbnails.length) {
        console.log('Gallery elements not found in DOM');
        return;
    }
    
    console.log('Gallery initialized with', projectThumbnails.length, 'project thumbnails');
    
    let currentProject = '';
    let currentImageIndex = 0;
    let thumbnails = [];
    
    // Open gallery when clicking on project thumbnail
    projectThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            console.log('Thumbnail clicked, project:', thumbnail.getAttribute('data-project'));
            const project = thumbnail.getAttribute('data-project');
            openGallery(project);
        });
    });
    
    // Close gallery
    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', closeGallery);
    }
    
    // Close gallery with escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && galleryPopup.classList.contains('active')) {
            closeGallery();
        }
    });
    
    // Navigation with arrow keys
    document.addEventListener('keydown', e => {
        if (!galleryPopup.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            navigateGallery(1);
        }
    });
    
    // Navigation with buttons
    if (prevBtn) prevBtn.addEventListener('click', () => navigateGallery(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateGallery(1));
    
    function openGallery(project) {
        currentProject = project;
        console.log('Opening gallery for project:', project);
        
        // Show correct thumbnails container
        galleryThumbnailsContainers.forEach(container => {
            if (container.getAttribute('data-project') === project) {
                container.classList.add('active');
                
                // Get thumbnails for this project
                thumbnails = container.querySelectorAll('.gallery-thumbnail');
                console.log('Found', thumbnails.length, 'thumbnails for project');
                
                // Set first image as active
                setActiveImage(0);
            } else {
                container.classList.remove('active');
            }
        });
        
        // Display popup
        galleryPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeGallery() {
        galleryPopup.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            galleryThumbnailsContainers.forEach(container => {
                container.classList.remove('active');
            });
        }, 500);
    }
    
    function setActiveImage(index) {
        if (!thumbnails.length) return;
        
        if (index < 0) index = thumbnails.length - 1;
        if (index >= thumbnails.length) index = 0;
        
        currentImageIndex = index;
        
        // Update main image
        const src = thumbnails[index].querySelector('img').getAttribute('src');
        galleryMainImage.setAttribute('src', src);
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    function navigateGallery(direction) {
        setActiveImage(currentImageIndex + direction);
    }
    
    // Add click event to thumbnails
    galleryThumbnailsContainers.forEach(container => {
        const thumbs = container.querySelectorAll('.gallery-thumbnail');
        
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                setActiveImage(index);
            });
        });
    });
});

// Project Carousel Functionality
function openProjectCarousel(projectId) {
    const modal = document.getElementById('projectCarouselModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Here you would load the appropriate images based on projectId
        console.log('Opening carousel for project:', projectId);
        
        // This will be populated with actual images later
    }
}

// Close carousel when clicking the close button
document.addEventListener('DOMContentLoaded', function() {
    const closeCarouselBtn = document.querySelector('.close-carousel');
    if (closeCarouselBtn) {
        closeCarouselBtn.addEventListener('click', function() {
            const modal = document.getElementById('projectCarouselModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    // Close carousel when clicking outside the content
    const carouselModal = document.getElementById('projectCarouselModal');
    if (carouselModal) {
        carouselModal.addEventListener('click', function(e) {
            if (e.target === carouselModal) {
                carouselModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    // Close carousel with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('projectCarouselModal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
});

// Handle Read More functionality for project descriptions
document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        const description = button.previousElementSibling;
        
        // Check if the text is overflowing and needs a Read More button
        if (description && description.scrollHeight > description.clientHeight) {
            button.style.display = 'inline-block';
        } else {
            button.style.display = 'none';
        }
        
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the carousel
            
            if (description.classList.contains('expanded')) {
                description.classList.remove('expanded');
                button.textContent = 'Read More';
            } else {
                description.classList.add('expanded');
                button.textContent = 'Read Less';
            }
        });
    });
});