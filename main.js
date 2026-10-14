document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                icon.className = 'fa-solid fa-bars';
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars';
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Mobile Dropdowns Toggle ---
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.closest('.dropdown');
                
                // Close other dropdowns first
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('active');
                    }
                });
                
                parent.classList.toggle('active');
            }
        });
    });

    // --- Active Link Scroll Spy & Subpage Navigation ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const isSubpage = window.location.pathname.includes('about.html') || window.location.pathname.includes('services.html');

    if (sections.length > 0 && !isSubpage) {
        const spyObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -50% 0px',
            threshold: 0
        };

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href && (href === `#${activeId}` || href.endsWith(`#${activeId}`))) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, spyObserverOptions);

        sections.forEach(section => spyObserver.observe(section));
    } else {
        // Highlight active navbar tab based on current file location
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href) {
                if (currentPath.includes('about.html') && href.includes('about.html')) {
                    link.classList.add('active');
                } else if (currentPath.includes('services.html') && href.includes('services.html')) {
                    link.classList.add('active');
                }
            }
        });
    }

    // --- Scroll Reveal Animation ---
    // We add CSS reveal classes dynamically to avoid blank pages if JS is disabled
    const revealElements = document.querySelectorAll('.animate-fade-up');
    
    // Add transition style inline or prepare elements
    revealElements.forEach(el => {
        // Only target elements that are not in the hero section for scroll trigger
        if (!el.closest('.hero')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(35px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            // Reapply delays using transitions
            const delayClass = Array.from(el.classList).find(c => c.startsWith('delay-'));
            if (delayClass) {
                const delayMs = parseInt(delayClass.split('-')[1]) * 100 + 'ms';
                el.style.transitionDelay = delayMs;
            }
        }
    });

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                observer.unobserve(el); // Only animate once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    // --- Form Submission Handling ---
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Show a modern, custom feedback alert instead of default alert
                showToast(`Thank you! ${email} has been subscribed to Stancee updates.`, 'success');
                emailInput.value = '';
            }
        });
    }

    // --- Helper function for Premium Toast Notification ---
    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Apply toast styles dynamically (premium look)
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#0A2540',
            color: '#ffffff',
            padding: '16px 28px',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            borderLeft: '4px solid #C29553',
            zIndex: '9999',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '0.95rem',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease'
        });

        const iconEl = toast.querySelector('i');
        Object.assign(iconEl.style, {
            marginRight: '12px',
            color: '#C29553',
            fontSize: '1.1rem'
        });

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
});
