document.addEventListener('DOMContentLoaded', function() {
    // Collapsible sections
    document.querySelectorAll('.collapsible-section .section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.collapsible-section');
            const isExpanded = section.getAttribute('data-expanded') === 'true';
            section.setAttribute('data-expanded', String(!isExpanded));
            header.setAttribute('aria-expanded', String(!isExpanded));
        });
    });

    // Make entire project cards clickable
    document.querySelectorAll('.project[data-link]').forEach(project => {
        project.setAttribute('tabindex', '0');
        project.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                return;
            }
            const link = project.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });

        project.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const link = project.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            }
        });
    });

    // Resume accordion
    document.querySelectorAll('.resume-item').forEach(item => {
        const summary = item.querySelector('.resume-summary');
        const details = item.querySelector('.resume-details');

        if (!summary || !details) {
            return;
        }

        summary.addEventListener('click', () => {
            const isExpanded = item.getAttribute('data-expanded') === 'true';
            item.setAttribute('data-expanded', String(!isExpanded));
            summary.setAttribute('aria-expanded', String(!isExpanded));
            details.hidden = isExpanded;
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const sections = document.querySelectorAll('section');
    const projects = document.querySelectorAll('.project');
    const cards = document.querySelectorAll('.publication, .resume-item, .skill-category');
    
    [sections, projects, cards].forEach(nodeList => {
        nodeList.forEach(element => {
            element.classList.add('reveal-on-scroll');
            observer.observe(element);
        });
    });
});
