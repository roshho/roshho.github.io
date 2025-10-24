// Smooth Parallax Scrolling Effect
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    // Parallax effect on scroll
    function handleParallax() {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const section = element.closest('.parallax-section');
            
            if (section) {
                const rect = section.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                // Only apply parallax when section is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = (scrolled - sectionTop) * speed;
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            }
        });
    }

    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    const cards = document.querySelectorAll('.project-card, .research-card');
    cards.forEach(card => {
        observer.observe(card);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect enhancement for cards
    const allCards = document.querySelectorAll('.project-card, .research-card');
    
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.4s ease';
        });
    });

    // Parallax mouse effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                const moveX = (mouseX - 0.5) * 20;
                const moveY = (mouseY - 0.5) * 20;
                
                heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
                heroContent.style.transition = 'transform 0.3s ease-out';
            }
        });
        
        hero.addEventListener('mouseleave', function() {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = 'translate(0, 0)';
            }
        });
    }

    // Add dynamic gradient animation
    function animateGradients() {
        const sections = document.querySelectorAll('.parallax-section');
        let scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight && scrollPosition <= sectionBottom) {
                const progress = (scrollPosition - sectionTop + window.innerHeight) / (sectionHeight + window.innerHeight);
                const opacity = Math.sin(progress * Math.PI);
                
                const parallaxBg = section.querySelector('.parallax-bg');
                if (parallaxBg) {
                    parallaxBg.style.opacity = 0.3 + (opacity * 0.4);
                }
            }
        });
    }

    // Run gradient animation on scroll
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                animateGradients();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initialize
    handleParallax();
    animateGradients();

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add subtle floating animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        let floatDirection = 1;
        let floatPosition = 0;
        
        setInterval(function() {
            floatPosition += 0.5 * floatDirection;
            
            if (floatPosition > 5 || floatPosition < -5) {
                floatDirection *= -1;
            }
            
            ctaButton.style.transform = `translateY(${floatPosition}px)`;
        }, 50);
    }

    // Performance optimization: Reduce animations on mobile
    if (window.innerWidth < 768) {
        parallaxElements.forEach(element => {
            element.dataset.speed = parseFloat(element.dataset.speed || 0.5) * 0.5;
        });
    }

    // Add resize handler to recalculate positions
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleParallax();
            
            // Adjust parallax speed for mobile
            if (window.innerWidth < 768) {
                parallaxElements.forEach(element => {
                    const originalSpeed = parseFloat(element.dataset.speed || 0.5);
                    element.dataset.speed = originalSpeed * 0.5;
                });
            }
        }, 250);
    });
});
