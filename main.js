class DigitalCraftWebsite {
    constructor() {
        // Core elements
        this.header = document.getElementById('header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.scrollToTopBtn = document.getElementById('scrollToTop');

        // Modal elements
        this.quoteButtons = document.querySelectorAll('.get-quote');
        this.modal = document.getElementById('bookingModal');

        // Portfolio elements
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');

        // Form elements
        this.contactForm = document.getElementById('contactForm');

        this.init();
    }

    init() {
        this.bindEvents();
        this.animateOnScroll();
    }

    bindEvents() {
        // --- Navigation ---
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

        // --- Modal ---
        this.quoteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const service = e.target.getAttribute('data-service');
                this.showBookingModal(service);
            });
        });

        document.getElementById('callNow').addEventListener('click', () => this.handleCall());
        document.getElementById('whatsappNow').addEventListener('click', () => this.handleWhatsApp());
        document.getElementById('closeModal').addEventListener('click', () => this.hideBookingModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideBookingModal();
        });

        // --- Form Validation ---
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // --- Portfolio Filter ---
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.filterPortfolio(e));
        });

        // --- General Listeners ---
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.scrollToTopBtn.addEventListener('click', () => this.scrollToTop());
    }

    // --- SCROLL & RESIZE HANDLING ---
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.header.classList.toggle('scrolled', scrolled);
        this.toggleScrollToTopButton();
        this.updateActiveSection();
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (this.modal.classList.contains('active')) this.hideBookingModal();
            const navMenu = document.getElementById('navMenu');
            if (navMenu.classList.contains('active')) this.closeMobileMenu();
        }
    }

    // --- NAVIGATION & SMOOTH SCROLL ---
    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
        this.closeMobileMenu();
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = this.header.offsetHeight;
            const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: sectionTop, behavior: 'smooth' });
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleScrollToTopButton() {
        this.scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }

    updateActiveSection() {
        let currentSectionId = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - this.header.offsetHeight - 50;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // --- MOBILE MENU ---
    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.contains('active') ? this.closeMobileMenu() : this.openMobileMenu();
    }

    openMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.add('active');
        this.mobileToggle.classList.add('active');
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // --- MODAL ---
    showBookingModal(service = null) {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const modalText = this.modal.querySelector('p');
        if (service) {
            modalText.textContent = `Ready to get a quote for ${service}? Choose your preferred way to get in touch.`;
        } else {
            modalText.textContent = `Ready to start your project? Choose your preferred way to get in touch.`;
        }
    }

    hideBookingModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleCall() {
        const phoneNumber = '+94703584172';
        this.showNotification('📞 Opening phone dialer...', 'success');
        setTimeout(() => { window.location.href = `tel:${phoneNumber}`; }, 500);
        this.hideBookingModal();
    }

    handleWhatsApp() {
        const phoneNumber = '+94703584172';
        const message = "Hi! I'm interested in your services at DigitalCraft Solutions and would like to get a quote.";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        this.showNotification('💬 Opening WhatsApp...', 'success');
        setTimeout(() => { window.open(whatsappUrl, '_blank'); }, 500);
        this.hideBookingModal();
    }

    // --- PORTFOLIO FILTER ---
    filterPortfolio(e) {
        const filterValue = e.target.dataset.filter;

        // Update active button state
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Show/hide portfolio items
        this.portfolioItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (filterValue === 'all' || itemCategory === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // --- FORM VALIDATION ---
    handleFormSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const message = document.getElementById('contactMessage');
        let isValid = true;

        if (name.value.trim() === '') {
            this.showNotification('Please enter your name.', 'error');
            isValid = false;
        } else if (!this.isValidEmail(email.value)) {
            this.showNotification('Please enter a valid email address.', 'error');
            isValid = false;
        } else if (message.value.trim() === '') {
            this.showNotification('Please enter a message.', 'error');
            isValid = false;
        }

        if (isValid) {
            this.showNotification('✅ Thank you! Your message has been sent.', 'success');
            this.contactForm.reset();
        }
    }

    isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // --- UI & ANIMATIONS ---
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .about-content, .about-visual, .contact-info, .contact-form');
        animatedElements.forEach(el => observer.observe(el));
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        let backgroundColor = 'var(--primary-indigo)';
        if (type === 'success') backgroundColor = 'var(--accent-emerald)';
        if (type === 'error') backgroundColor = 'var(--accent-rose)';

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: var(--warm-white);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-medium);
            z-index: 10001;
            font-weight: 600;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
            font-size: 15px;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    new DigitalCraftWebsite();

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Add keyframe animations to head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(120%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});