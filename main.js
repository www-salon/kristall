// Navigation active link for RTL
function updateActiveNavForRTL() {
    if (document.documentElement.dir === 'rtl') {
        // Adjust any navigation-specific RTL behaviors
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.textAlign = 'right';
        });
    }
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initial RTL adjustment
    updateActiveNavForRTL();
    
    // Re-run RTL adjustments when language changes
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            setTimeout(updateActiveNavForRTL, 100);
        });
    }

    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(event.target) && 
                    !hamburger.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
    
    // ===== NAVBAR SCROLL EFFECT =====
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        }
    });
    
    // ===== GALLERY FUNCTIONALITY =====
    const galleryThumbnails = document.querySelectorAll('.thumbnail');
    const mainGalleryImage = document.getElementById('main-gallery-image');
    
    if (galleryThumbnails.length > 0 && mainGalleryImage) {
        galleryThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                galleryThumbnails.forEach(thumb => {
                    thumb.classList.remove('active');
                });
                
                this.classList.add('active');
                
                const newImageSrc = this.getAttribute('data-image');
                if (newImageSrc) {
                    mainGalleryImage.src = newImageSrc;
                    
                    mainGalleryImage.style.opacity = '0';
                    setTimeout(() => {
                        mainGalleryImage.style.opacity = '1';
                    }, 200);
                }
            });
            
            // Add touch support for mobile
            thumbnail.addEventListener('touchstart', function(e) {
                if (window.innerWidth <= 768) {
                    galleryThumbnails.forEach(thumb => {
                        thumb.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    
                    const newImageSrc = this.getAttribute('data-image');
                    if (newImageSrc) {
                        mainGalleryImage.src = newImageSrc;
                        
                        mainGalleryImage.style.opacity = '0';
                        setTimeout(() => {
                            mainGalleryImage.style.opacity = '1';
                        }, 200);
                    }
                    e.preventDefault();
                }
            });
        });
    }
    
    // ===== SERVICE CARDS ANIMATION =====
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        serviceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // ===== CRYSTAL ANIMATIONS =====
    function createFloatingCrystals() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // Only create crystals on desktop for performance
        if (window.innerWidth > 768) {
            // Clear existing crystals
            const existingCrystals = document.querySelectorAll('.floating-crystal');
            existingCrystals.forEach(crystal => crystal.remove());
            
            // Create new floating crystals
            for (let i = 0; i < 6; i++) {
                const crystal = document.createElement('div');
                crystal.className = 'floating-crystal';
                
                // Random properties
                const size = Math.random() * 10 + 5;
                const posX = Math.random() * 90 + 5;
                const posY = Math.random() * 90 + 5;
                const delay = Math.random() * 5;
                const duration = Math.random() * 8 + 8;
                
                // Apply styles
                crystal.style.width = `${size}px`;
                crystal.style.height = `${size}px`;
                crystal.style.left = `${posX}%`;
                crystal.style.top = `${posY}%`;
                crystal.style.animationDelay = `${delay}s`;
                crystal.style.animationDuration = `${duration}s`;
                crystal.style.opacity = Math.random() * 0.2 + 0.1;
                
                heroSection.appendChild(crystal);
            }
        }
    }
    
    // Initialize floating crystals
    createFloatingCrystals();
    
    // Recreate crystals on resize (only on desktop)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createFloatingCrystals();
        }, 250);
    });
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset based on screen size
                let offset = 80;
                if (window.innerWidth <= 768) {
                    offset = 70; 
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== CONTACT FORM SIMULATION =====
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && ctaButton.getAttribute('href') === '#contact') {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            let offset = 80;
            if (window.innerWidth <= 768) {
                offset = 70;
            }
            
            window.scrollTo({
                top: document.getElementById('contact').offsetTop - offset,
                behavior: 'smooth'
            });
            
            const contactSection = document.getElementById('contact');
            contactSection.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.3)';
            
            setTimeout(() => {
                contactSection.style.boxShadow = 'none';
            }, 2000);
        });
    }
    
    // ===== IMAGE LAZY LOADING =====
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== MAP INTERACTION =====
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        // Only add hover effects on desktop
        if (window.innerWidth > 768) {
            mapContainer.addEventListener('mouseenter', function() {
                this.style.borderColor = 'rgba(184, 134, 11, 0.5)';
                const mapPin = this.querySelector('.map-pin');
                if (mapPin) {
                    mapPin.style.transform = 'scale(1.2)';
                }
            });
            
            mapContainer.addEventListener('mouseleave', function() {
                this.style.borderColor = 'rgba(184, 134, 11, 0.3)';
                const mapPin = this.querySelector('.map-pin');
                if (mapPin) {
                    mapPin.style.transform = 'scale(1)';
                }
            });
        }
    }
    
    // ===== CURRENT YEAR IN FOOTER =====
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // ===== GO TO TOP BUTTON =====
    const goTopBtn = document.getElementById('goTopBtn');
    
    if (goTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                goTopBtn.classList.add('visible');
            } else {
                goTopBtn.classList.remove('visible');
            }
        });
        
        goTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Touch support for mobile
        goTopBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    function updateActiveNav() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust offset based on screen size
            let offset = 150;
            if (window.innerWidth <= 768) {
                offset = 100;
            }
            
            if (window.scrollY >= (sectionTop - offset)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
}); 

// ===== ADDITIONAL CRYSTAL STYLES =====
document.head.insertAdjacentHTML('beforeend', `
<style>
    .floating-crystal {
        position: absolute;
        background: rgba(184, 134, 11, 0.15);
        transform: rotate(45deg);
        pointer-events: none;
        z-index: 1;
        animation: floatCrystal linear infinite;
        display: none;
    }
    
    .floating-crystal:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 50%;
        background: rgba(10, 10, 10, 0.8);
        transform: translate(-50%, -50%) rotate(45deg);
    }
    
    @keyframes floatCrystal {
        0%, 100% {
            transform: rotate(45deg) translateY(0) translateX(0);
        }
        25% {
            transform: rotate(45deg) translateY(-15px) translateX(8px);
        }
        50% {
            transform: rotate(45deg) translateY(-8px) translateX(15px);
        }
        75% {
            transform: rotate(45deg) translateY(-20px) translateX(-8px);
        }
    }
    
    @media (min-width: 769px) {
        .floating-crystal {
            display: block;
        }
    }
</style>
`);

