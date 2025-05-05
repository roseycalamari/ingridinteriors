/**
 * Mobile Homepage Experience
 * Handles the mobile-specific UI for the homepage
 */
document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile devices
  if (window.innerWidth <= 767) {
    // Check if we're on the homepage (not in any section)
    if (!document.body.classList.contains('section-active') && 
        !document.body.classList.contains('about-section-active') && 
        !document.body.classList.contains('service-section-active') && 
        !document.body.classList.contains('brands-section-active') && 
        !document.body.classList.contains('contact-section-active')) {
      
      // Ensure correct ordering of the sections
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        const serviceSection = mainContent.querySelector('.section-left');
        const personSection = mainContent.querySelector('.portrait-container');
        const brandsSection = mainContent.querySelector('.section-right');
        
        // Force the correct order in the DOM for older browsers
        if (serviceSection && personSection && brandsSection) {
          // First, set default order for all children
          Array.from(mainContent.children).forEach(child => {
            child.style.order = '10';
          });
          
          // Set specific ordering
          serviceSection.style.order = '1';  // First - The Service
          personSection.style.order = '2';   // Second - The Person
          brandsSection.style.order = '3';   // Third - The Brands
        }
      }
      
      // Add navigation dots
      const navDots = document.createElement('div');
      navDots.className = 'nav-dots';
      
      // Create 3 dots (one for each section)
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === 0) dot.classList.add('active');
        navDots.appendChild(dot);
      }
      
      document.body.appendChild(navDots);
      
      // Add scroll hint
      const scrollHint = document.createElement('div');
      scrollHint.className = 'scroll-hint';
      scrollHint.innerHTML = '<div class="scroll-arrow"></div><span>Scroll</span>';
      document.body.appendChild(scrollHint);
      
      // Add section indicator
      const sectionIndicator = document.createElement('div');
      sectionIndicator.className = 'section-indicator';
      sectionIndicator.textContent = 'The Service'; // Default to first section
      document.body.appendChild(sectionIndicator);
      
      // Add mobile menu button
      const menuBtn = document.createElement('div');
      menuBtn.className = 'mobile-menu-btn';
      menuBtn.innerHTML = '<div class="mobile-menu-icon"></div>';
      document.body.appendChild(menuBtn);
      
      if (mainContent) {
        // Prevent original scroll behavior and implement smooth scrolling
        document.addEventListener('touchmove', function(e) {
          // Don't prevent scroll on the main content
          if (!e.target.closest('.main-content')) {
            e.preventDefault();
          }
        }, { passive: false });
        
        // Update active dot based on scroll position
        mainContent.addEventListener('scroll', function() {
          const scrollPosition = mainContent.scrollTop;
          const windowHeight = window.innerHeight;
          
          const sectionIndex = Math.round(scrollPosition / windowHeight);
          
          // Update active dot
          const dots = document.querySelectorAll('.nav-dot');
          dots.forEach((dot, index) => {
            if (index === sectionIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
          
          // Update section indicator text
          if (sectionIndex === 0) {
            sectionIndicator.textContent = 'The Service';
          } else if (sectionIndex === 1) {
            sectionIndicator.textContent = 'The Person';
          } else if (sectionIndex === 2) {
            sectionIndicator.textContent = 'The Brands';
          }
          
          // Hide scroll hint after user has scrolled
          if (scrollPosition > 10) {
            scrollHint.style.opacity = '0';
          }
        });
        
        // Add swipe detection for better mobile experience
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', function(e) {
          touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        document.addEventListener('touchend', function(e) {
          touchEndY = e.changedTouches[0].screenY;
          handleSwipe();
        }, false);
        
        function handleSwipe() {
          const currentSection = Math.round(mainContent.scrollTop / window.innerHeight);
          const swipeThreshold = 50;
          
          if (touchStartY - touchEndY > swipeThreshold) {
            // Swipe up - go to next section
            const nextSection = Math.min(2, currentSection + 1);
            scrollToSection(nextSection);
          } else if (touchEndY - touchStartY > swipeThreshold) {
            // Swipe down - go to previous section
            const prevSection = Math.max(0, currentSection - 1);
            scrollToSection(prevSection);
          }
        }
        
        function scrollToSection(index) {
          mainContent.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth'
          });
        }
        
        // Handle dot click for navigation
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
          dot.addEventListener('click', function() {
            scrollToSection(index);
          });
        });
        
        // Handle menu button click
        menuBtn.addEventListener('click', function() {
          const logoContainer = document.querySelector('.logo-container');
          if (logoContainer) {
            logoContainer.click(); // Use existing navigation logic
          }
        });
      }
    }
  }
  
  // Handle window resize to fix potential glitches
  window.addEventListener('resize', debounce(function() {
    if (window.innerWidth <= 767) {
      // Refresh scroll snapping by triggering a slight scroll
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        const currentPos = mainContent.scrollTop;
        const sectionIndex = Math.round(currentPos / window.innerHeight);
        mainContent.scrollTo({
          top: sectionIndex * window.innerHeight,
          behavior: 'auto'
        });
      }
    }
  }, 250));
  
  // Debounce function to limit resize event firing
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }
}); 