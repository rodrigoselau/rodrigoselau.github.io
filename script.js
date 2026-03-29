document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Add styling for active mobile menu if not in CSS
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(15, 23, 42, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.textAlign = 'center';
            navLinks.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            navLinks.style.display = '';
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            navLinks.style.display = '';
        });
    });

    // Scroll Reveal Simulation (Subtle)
    const revealElements = document.querySelectorAll('.section, .project-card, .skill-category');

    const reveal = () => {
        revealElements.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
    });

    window.addEventListener('scroll', reveal);
    reveal(); // Run once on load
});
