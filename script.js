document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const backButton = document.getElementById('backButton');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const footer = document.getElementById('mainFooter');

    // Navigation state
    let navigationHistory = [];
    let currentSection = 'home';

    initPage();

    // ===== EVENT LISTENERS =====
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    backButton.addEventListener('click', function (e) {
        e.preventDefault();
        goBack();
    });

    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('click', handleContactCardClick);
    });

    // Browser navigation
    window.addEventListener('popstate', function () {
        const hash = window.location.hash.substring(1) || 'home';
        showSection(hash);
    });

    // ===== FUNCTIONS =====

    function initPage() {
        const hash = window.location.hash.substring(1);
        const initialSection = hash || 'home';
        showSection(initialSection);
        navigationHistory = [initialSection];
        updateBackButton();
    }

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function navigateTo(sectionId) {
        if (!sectionId || sectionId === currentSection) return;
        navigationHistory.push(currentSection);
        showSection(sectionId);
        window.location.hash = sectionId;
        closeMobileMenu();
    }

    function goBack() {
        if (navigationHistory.length > 1) {
            navigationHistory.pop();
            const previousSection = navigationHistory[navigationHistory.length - 1];
            showSection(previousSection);
            window.location.hash = previousSection;
        } else {
            showSection('home');
            window.location.hash = '';
        }
        updateBackButton();
    }

    function showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            target.scrollIntoView({ behavior: 'smooth' });
        }

        currentSection = sectionId;
        updateActiveNavLink(sectionId);

        // Tampilkan atau sembunyikan footer
        if (footer) {
            footer.style.display = sectionId === 'home' ? 'block' : 'none';
        }
    }

    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    function updateBackButton() {
        backButton.classList.toggle('visible', navigationHistory.length > 1);
    }

    function handleContactCardClick(e) {
        const card = e.currentTarget;
        if (card.classList.contains('whatsapp-card')) {
            window.open('https://wa.me/6285158838350', '_blank');
        } else if (card.querySelector('.fa-envelope')) {
            window.location.href = 'mailto:ai.deep9077@gmail.com';
        } else if (card.querySelector('.fa-phone')) {
            window.open('tel:+6285158838350');
        } else if (card.querySelector('.fa-map-marker-alt')) {
            window.open('https://maps.google.com/?q=-7.996968,111.579440', '_blank');
        }
    }
});

