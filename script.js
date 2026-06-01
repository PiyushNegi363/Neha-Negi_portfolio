// Mobile Navigation Toggle with Touch Support
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Enhanced mobile navigation with touch events
function toggleMobileNav() {
    // Toggle visual state
    const becameActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    // Reflect state to assistive tech
    if (hamburger && hamburger.setAttribute) {
        hamburger.setAttribute('aria-expanded', String(becameActive));
    }
}

// Add both click and touch events for better mobile support
if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);

    // Touch handler (preserve existing behavior)
    hamburger.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleMobileNav();
    }, { passive: false });

    // Keyboard support: Enter and Space
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggleMobileNav();
        }
    });
}

// Close mobile menu when clicking on a link with touch support
document.querySelectorAll('.nav-link').forEach(n => {
    n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (hamburger && hamburger.setAttribute) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    n.addEventListener('touchend', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (hamburger && hamburger.setAttribute) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Make elements with role="button" or explicit tabindex keyboard-activatable
function enableKeyboardActivation() {
    const selector = '[role="button"], [tabindex="0"]';
    const elems = document.querySelectorAll(selector);
    elems.forEach(el => {
        // Avoid binding multiple times
        if (el.dataset.keyboardBound) return;

        el.addEventListener('keydown', (e) => {
            const key = e.key || e.code;
            if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
                // Allow the element to respond as if clicked
                e.preventDefault();
                // Some elements may not be naturally clickable; trigger click handler
                try { el.click(); } catch (err) { /* ignore */ }
            }
        });

        el.dataset.keyboardBound = '1';
    });
}

// Initialize keyboard activation support once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    enableKeyboardActivation();
});

// Swipe gesture for mobile navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;

    // Swipe right to open menu
    if (swipeDistance > swipeThreshold && !navMenu.classList.contains('active')) {
        toggleMobileNav();
    }
    // Swipe left to close menu
    else if (swipeDistance < -swipeThreshold && navMenu.classList.contains('active')) {
        toggleMobileNav();
    }
}

// Smooth scrolling for navigation links
// Smooth scrolling for navigation links with customizable duration (slow motion)
function smoothScrollTo(target, duration = 1400) {
    const startY = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetRect = target.getBoundingClientRect();
    // Compute target Y so the target sits just below the navbar
    const targetY = startY + targetRect.top - navbarHeight - 10;
    const distance = targetY - startY;
    let startTime = null;

    // easeInOutQuad
    function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const time = timestamp - startTime;
        const progress = Math.min(time / duration, 1);
        const eased = ease(progress);
        window.scrollTo(0, Math.round(startY + distance * eased));

        if (time < duration) {
            requestAnimationFrame(step);
        } else {
            // Ensure element can be focused for accessibility
            try {
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            } catch (e) {
                // ignore focus errors
            }
            // Update the URL hash without jumping
            if (target.id) history.replaceState(null, '', `#${target.id}`);
        }
    }

    requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle same-page hash links
        if (!href || href.charAt(0) !== '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        // Use a longer duration for slow-motion feel (1400ms)
        smoothScrollTo(target, 1400);
    });
});

// Navbar background change on scroll (Pill Mode)
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.12)';
        navbar.style.padding = '0.6rem 1.5rem'; // Shrink slightly on scroll
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.6)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
        navbar.style.padding = '0.8rem 1.5rem';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Enhanced Intersection Observer for scroll animations and lazy loading
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Lazy loading observer for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // Use decode() when available so we don't rely on the browser's load event
            // (some browsers defer load events for lazy images under certain privacy settings).
            if (img.decode) {
                img.decode().then(() => {
                    img.classList.add('loaded', 'fade-in', 'visible');
                    imageObserver.unobserve(img);
                }).catch(() => {
                    // If decode() fails, still show the image
                    img.classList.add('loaded', 'fade-in', 'visible');
                    imageObserver.unobserve(img);
                });
            } else {
                // Fallback when decode() is not available
                img.classList.add('loaded', 'fade-in', 'visible');
                imageObserver.unobserve(img);
            }
        }
    });
}, { threshold: 0.1 });

// Observe all lazy loading images
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.classList.add('fade-in');
    imageObserver.observe(img);
});

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-card, .service-item, .project-card, .education-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Add hover effects to cards
document.querySelectorAll('.skill-card, .service-item, .project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add active state to navigation links
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Highlight active link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active navigation state
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeNavStyle);

// Mouse Cursor Effects (Desktop Only)
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.cursor-follower, .cursor-dot');

// Only initialize cursor effects on non-touch devices
if (!('ontouchstart' in window)) {
    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });
} else {
    // Hide cursor elements on touch devices
    circles.forEach(circle => {
        circle.style.display = 'none';
    });
}

// EmailJS initialization (secure usage)
// NOTE: Do NOT hardcode EmailJS public keys or service/template IDs in committed client-side files.
// Secure options:
// 1) Preferred: Move email sending to a server endpoint (e.g., /send-email) and keep keys secret on the server.
// 2) If you must use EmailJS client-side, store only a public key and service/template IDs in a non-committed config
//    (or set them via environment during build). This code will attempt to read meta tags and initialize EmailJS
//    only if those meta tags are present. If not present, the contact form will show a friendly message.

const emailjsServiceMeta = document.querySelector('meta[name="emailjs-service-id"]');
const emailjsTemplateMeta = document.querySelector('meta[name="emailjs-template-id"]');
const emailjsKeyMeta = document.querySelector('meta[name="emailjs-key"]');

// Track whether client-side EmailJS sending is available.
// This prevents noisy console warnings on pages where EmailJS isn't intentionally configured.
let emailSendingAvailable = false;
if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function' && emailjsKeyMeta && emailjsServiceMeta && emailjsTemplateMeta) {
    try {
        // Initialize EmailJS with a public key provided via a meta tag (not recommended for secrets)
        emailjs.init(emailjsKeyMeta.content);
        emailSendingAvailable = true;
        console.log('EmailJS initialized (client-side send enabled).');
    } catch (err) {
        // Initialization failed; fall back to demo mode without noisy warnings.
        emailSendingAvailable = false;
        console.info('EmailJS initialization failed; contact form will use demo fallback.');
    }
} else {
    // Do not warn loudly — many deployments intentionally don't enable client-side EmailJS.
    emailSendingAvailable = false;
    console.info('Email sending not configured for this site; contact form will use demo fallback or a server-side endpoint.');
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Prepare email parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Neha Negi'
        };

        // Send email using EmailJS if it was successfully initialized and configured.
        if (emailSendingAvailable) {
            emailjs.send(emailjsServiceMeta.content, emailjsTemplateMeta.content, templateParams)
                .then(function (response) {
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                    contactForm.reset();
                }, function (error) {
                    let errorMsg = 'Sorry, there was an error sending your message.';
                    if (error.status === 401) {
                        errorMsg = 'Email service configuration error. Please try again later.';
                    } else if (error.status === 0) {
                        errorMsg = 'Network error. Please check your internet connection.';
                    }
                    showNotification(errorMsg, 'error');
                })
                .finally(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                });
        } else {
            // Friendly demo/send-simulation fallback
            setTimeout(() => {
                showNotification('Thank you for your message! (Demo mode) I will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 1500);
        }
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    // Accessibility: announce via screen readers
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

    const iconClass = type === 'success' ? 'fas fa-check-circle' :
        type === 'error' ? 'fas fa-exclamation-circle' :
            'fas fa-info-circle';

    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${iconClass}" aria-hidden="true"></i>
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('active');
    });

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    const closeNotification = () => {
        notification.classList.remove('active');
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 500);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeNotification);
    }

    // Escape key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeNotification();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Auto remove after 5 seconds
    const autoRemoveTimeout = setTimeout(() => {
        closeNotification();
    }, 5000);

    // Clear timeout if manually closed
    if (closeBtn) {
        closeBtn.addEventListener('click', () => clearTimeout(autoRemoveTimeout));
    }
}


/* -----------------------
   Contact section enhancements
   - Auto-resize textarea
   - Copy-to-clipboard for contact email
   - Inline validation visual states
   - Submit button loading affordance (visual)
   ----------------------- */

function setupContactEnhancements() {
    // Auto-resize textarea
    const textarea = document.querySelector('#message');
    if (textarea) {
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        ['input', 'change'].forEach(ev => textarea.addEventListener(ev, resize));
        // Initialize size
        resize();
    }

    // Copy-to-clipboard for the email shown in contact-info
    const emailNode = document.querySelector('.contact-info p');
    if (emailNode) {
        // Try to find the email text inside
        const emailText = emailNode.textContent.trim();
        // Create a small copy button next to the email
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copy-email-btn';
        copyBtn.setAttribute('aria-label', 'Copy email to clipboard');
        // Use inline SVG icon for copy to avoid reliance on Font Awesome
        copyBtn.innerHTML = '' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<rect x="9" y="9" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.2"/>' +
            '<path d="M15 7H7a1 1 0 00-1 1v8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>';
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(emailText);
                showNotification('Email address copied to clipboard', 'success');
            } catch (err) {
                // Fallback: select text and prompt
                const tmp = document.createElement('textarea');
                tmp.value = emailText;
                document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand('copy'); showNotification('Email address copied to clipboard', 'success'); }
                catch (e) { showNotification('Could not copy email. Please select it manually.', 'error'); }
                document.body.removeChild(tmp);
            }
        });

        // Append copy button after the email paragraph
        emailNode.style.position = 'relative';
        emailNode.appendChild(copyBtn);
    }

    // Inline validation visual states for inputs
    const inputs = document.querySelectorAll('#contactForm input[required], #contactForm textarea[required]');
    inputs.forEach(input => {
        const setValidationState = () => {
            if (input.value.trim() === '') {
                input.style.borderColor = 'var(--border-color)';
                input.classList.remove('invalid', 'valid');
            } else if (!input.checkValidity()) {
                input.classList.add('invalid');
                input.classList.remove('valid');
                input.style.borderColor = 'var(--accent-color)';
            } else {
                input.classList.add('valid');
                input.classList.remove('invalid');
                input.style.borderColor = 'var(--primary-color)';
            }
        };
        input.addEventListener('input', setValidationState);
        input.addEventListener('blur', setValidationState);
    });

    // Enhance submit button with small spinner when submitting (visual only)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.classList.add('loading');
            }
            // Remove loading class after simulated max time to ensure UI returns
            setTimeout(() => { if (btn) btn.classList.remove('loading'); }, 3000);
        });
    }
}

// Initialize contact enhancements on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupContactEnhancements();
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        if (this.type === 'submit') return; // Don't animate submit buttons

        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Scroll-Triggered Animations
const scrollObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Immediate animation trigger for faster response
            entry.target.classList.add('animate');
            entry.target.classList.add('visible');

            // Add staggered delay only for elements with stagger class
            if (entry.target.classList.contains('scroll-animate-stagger')) {
                const delay = index * 100; // Reduced from 150ms to 100ms
                entry.target.style.animationDelay = `${delay}ms`;
            }
        }
    });
}, scrollObserverOptions);

// Observe all scroll-animate elements
document.addEventListener('DOMContentLoaded', () => {
    // Observe elements for scroll animations
    document.querySelectorAll('.scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-stagger, .scroll-animate-rotate').forEach(el => {
        scrollObserver.observe(el);
    });

    // Performance: Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate any layout-dependent values
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.transition = 'none';
                setTimeout(() => {
                    navbar.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                }, 100);
            }
        }, 250);
    });

    // Optimize scroll performance with passive listeners
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalImages = ['photo.jpg'];
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Initialize performance optimizations
    preloadCriticalResources();

    // Add touch-friendly hover states for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});

// Smooth reveal for section titles
const sectionTitles = document.querySelectorAll('.section-title');
sectionTitles.forEach(title => {
    title.classList.add('scroll-animate');
    scrollObserver.observe(title);
});

// Add scroll animation to contact form
const contactFormElement = document.querySelector('.contact-form');
if (contactFormElement) {
    contactFormElement.classList.add('scroll-animate-scale');
    scrollObserver.observe(contactFormElement);
}

// Add scroll animation to footer sections
const footerSections = document.querySelectorAll('.footer-section');
footerSections.forEach((section, index) => {
    section.classList.add('scroll-animate-stagger');
    scrollObserver.observe(section);
});


/* ----------------------------------------------------------------
   BENTO CARD COLOR CYCLER
   Directly sets border-color + box-shadow on each card via JS.
   CSS transition (2s ease) on those properties makes it silky smooth.
   Staggered phase offset (cardIndex * stepOffset) creates a wave.
   ---------------------------------------------------------------- */
(function initBentoColorCycle() {
    // Color stops: [r, g, b]
    const colors = [
        [99,  102, 241],   // Indigo
        [168, 85,  247],   // Violet
        [236, 72,  153],   // Rose
        [20,  184, 166],   // Teal
        [245, 158, 11],    // Amber
    ];

    // Duration per full cycle (ms)
    const cycleDuration = 10000;
    // How many ms between each card's phase start (wave effect)
    const phaseStep = 1200;

    /**
     * Linearly interpolate between two values
     */
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Given a progress value 0-1 over the full cycle,
     * return the interpolated [r, g, b] across the color stops.
     */
    function getColor(progress) {
        const total = colors.length;
        const scaled = progress * total;
        const idx = Math.floor(scaled) % total;
        const next = (idx + 1) % total;
        const t = scaled - Math.floor(scaled);
        return [
            Math.round(lerp(colors[idx][0], colors[next][0], t)),
            Math.round(lerp(colors[idx][1], colors[next][1], t)),
            Math.round(lerp(colors[idx][2], colors[next][2], t)),
        ];
    }

    /**
     * Apply the color to a card element by updating CSS custom properties.
     * The CSS handles combining these with alpha values for border and glow.
     */
    function applyColor(card, rgb) {
        const [r, g, b] = rgb;
        card.style.setProperty('--bcr', r);
        card.style.setProperty('--bcg', g);
        card.style.setProperty('--bcb', b);
    }

    /**
     * Main tick — called on each rAF frame.
     * Only updates cards that are hovering (paused) or not.
     */
    function tick(cards, featureFlags, startTime, now) {
        const elapsed = now - startTime;

        cards.forEach(function(card, i) {
            // Skip if user is hovering (pause effect)
            if (card.matches(':hover')) return;

            // Each card has a phase offset so they cycle at different times
            const phase = (elapsed + i * phaseStep) % cycleDuration;
            const progress = phase / cycleDuration;
            const rgb = getColor(progress);
            applyColor(card, rgb);
        });

        requestAnimationFrame(function(t) { tick(cards, featureFlags, startTime, t); });
    }

    function start() {
        const selectors = [
            '.exp-bento-card',
            '.skill-bento-card',
            '.svc-bento-card',
            '.proj-bento-card',
        ];

        const featuredClasses = ['exp-featured', 'svc-featured', 'proj-featured'];

        const cards = Array.from(
            document.querySelectorAll(selectors.join(','))
        );

        if (!cards.length) return;

        // Pre-tag each card as featured or not
        const featureFlags = cards.map(function(c) {
            return featuredClasses.some(function(cls) { return c.classList.contains(cls); });
        });

        requestAnimationFrame(function(now) {
            tick(cards, featureFlags, now, now);
        });
    }

    // Start after DOM is ready (cards may not exist yet on first parse)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

/* ----------------------------------------------------------------
   DYNAMIC PIXEL DIVIDER
   Generates a row of pixel blocks for the section transition
   ---------------------------------------------------------------- */
function initPixelDividers() {
    const sections = Array.from(document.querySelectorAll('section'));
    if (sections.length < 2) return;

    // Remove any manually added pixel dividers in HTML
    document.querySelectorAll('.pixel-divider').forEach(el => el.remove());

    const blockSize = 30; // 30x30 pixels
    const rows = 4;
    const height = rows * blockSize;
    const dividers = [];

    sections.forEach((section, index) => {
        if (index === 0) return; // Skip the first section (hero)

        const divider = document.createElement('div');
        divider.className = 'pixel-divider';
        section.insertBefore(divider, section.firstChild);
        
        // Ensure section has relative positioning to contain absolute divider
        section.style.position = 'relative';

        dividers.push({
            element: divider,
            prevSection: sections[index - 1]
        });
    });

    function generateGrids() {
        const cols = Math.ceil(window.innerWidth / blockSize);
        // Probability of a block matching the previous section's color for each row
        const whiteProb = [0.95, 0.70, 0.35, 0.05];

        dividers.forEach(item => {
            const { element, prevSection } = item;
            element.innerHTML = '';
            
            // Get computed background color of previous section
            const prevBg = window.getComputedStyle(prevSection).backgroundColor;
            
            element.style.display = 'grid';
            element.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            element.style.gridTemplateRows = `repeat(${rows}, ${blockSize}px)`;
            element.style.height = `${height}px`;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const block = document.createElement('div');
                    block.className = 'pixel-cell';
                    
                    // 20% of blocks animate to give an "alive" feel
                    const isAnimated = Math.random() < 0.20;
                    
                    if (isAnimated) {
                        const animTypes = ['pixel-anim-1', 'pixel-anim-2', 'pixel-anim-3'];
                        const animClass = animTypes[Math.floor(Math.random() * animTypes.length)];
                        block.classList.add(animClass);
                        block.style.animationDelay = `-${Math.random() * 5}s`;
                    } else {
                        const isSolid = Math.random() < whiteProb[r];
                        if (isSolid) {
                            block.style.backgroundColor = prevBg;
                        }
                    }
                    
                    // Provide the previous background color as a CSS var for keyframe animations
                    block.style.setProperty('--block-color', prevBg);
                    element.appendChild(block);
                }
            }
        });
    }

    generateGrids();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(generateGrids, 250);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPixelDividers);
} else {
    initPixelDividers();
}