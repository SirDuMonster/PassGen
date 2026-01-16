/**
 * PassGen Navigation Controller
 * Handles mobile menu, dropdowns, and active states
 */

(function() {
    'use strict';

    // DOM Elements
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const mobileMenu = document.querySelector('.nav-mobile-menu');
    const mobileBackdrop = document.querySelector('.nav-mobile-backdrop');
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    const allNavLinks = document.querySelectorAll('.nav-link, .nav-mobile-link, .section-tab, .dropdown-link');

    /**
     * Initialize navigation
     */
    function init() {
        setupMobileMenu();
        setupDropdowns();
        setActiveStates();
        setupKeyboardNav();
    }

    /**
     * Mobile Menu Toggle
     */
    function setupMobileMenu() {
        if (!mobileToggle) return;

        mobileToggle.addEventListener('click', toggleMobileMenu);

        if (mobileBackdrop) {
            mobileBackdrop.addEventListener('click', closeMobileMenu);
        }

        // Close on resize to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && document.body.classList.contains('nav-mobile-open')) {
                    closeMobileMenu();
                }
            }, 250);
        });
    }

    function toggleMobileMenu() {
        document.body.classList.toggle('nav-mobile-open');

        const isOpen = document.body.classList.contains('nav-mobile-open');
        mobileToggle.setAttribute('aria-expanded', isOpen);

        if (isOpen && mobileMenu) {
            // Focus first link in mobile menu
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    }

    function closeMobileMenu() {
        document.body.classList.remove('nav-mobile-open');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Dropdown Menu Interactions
     */
    function setupDropdowns() {
        dropdownItems.forEach(item => {
            const toggle = item.querySelector('.nav-dropdown-toggle');

            if (!toggle) return;

            // Click to toggle on mobile/touch
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 || 'ontouchstart' in window) {
                    e.preventDefault();
                    toggleDropdown(item);
                }
            });

            // Hover for desktop
            item.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768 && !('ontouchstart' in window)) {
                    openDropdown(item);
                }
            });

            item.addEventListener('mouseleave', function() {
                if (window.innerWidth > 768 && !('ontouchstart' in window)) {
                    closeDropdown(item);
                }
            });

            // Focus management
            item.addEventListener('focusin', function() {
                if (window.innerWidth > 768) {
                    openDropdown(item);
                }
            });

            item.addEventListener('focusout', function(e) {
                if (!item.contains(e.relatedTarget)) {
                    closeDropdown(item);
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item.has-dropdown')) {
                closeAllDropdowns();
            }
        });
    }

    function toggleDropdown(item) {
        const isOpen = item.classList.contains('dropdown-open');
        closeAllDropdowns();
        if (!isOpen) {
            openDropdown(item);
        }
    }

    function openDropdown(item) {
        item.classList.add('dropdown-open');
        const toggle = item.querySelector('.nav-dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeDropdown(item) {
        item.classList.remove('dropdown-open');
        const toggle = item.querySelector('.nav-dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    }

    function closeAllDropdowns() {
        dropdownItems.forEach(closeDropdown);
    }

    /**
     * Set Active States Based on URL
     */
    function setActiveStates() {
        const currentPath = window.location.pathname;

        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            // Normalize paths for comparison
            const linkPath = new URL(href, window.location.origin).pathname;

            // Check for exact match or if current path starts with link path
            const isActive = currentPath === linkPath ||
                (linkPath !== '/' && currentPath.startsWith(linkPath));

            if (isActive) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');

                // If it's in a dropdown, also mark parent as active
                const parentItem = link.closest('.nav-item.has-dropdown');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-dropdown-toggle');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        });

        // Set section tabs active state
        const sectionTabs = document.querySelectorAll('.section-tab');
        sectionTabs.forEach(tab => {
            const href = tab.getAttribute('href');
            if (!href) return;

            const tabPath = new URL(href, window.location.origin).pathname;

            // Exact match for section tabs
            if (currentPath === tabPath ||
                (currentPath.endsWith('/') && currentPath.slice(0, -1) === tabPath) ||
                (tabPath.endsWith('/') && tabPath.slice(0, -1) === currentPath)) {
                tab.classList.add('active');
                tab.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Keyboard Navigation
     */
    function setupKeyboardNav() {
        document.addEventListener('keydown', function(e) {
            // ESC to close menus
            if (e.key === 'Escape') {
                closeMobileMenu();
                closeAllDropdowns();
            }

            // Arrow keys in dropdowns
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const activeDropdown = document.querySelector('.nav-item.dropdown-open .nav-dropdown');
                if (activeDropdown) {
                    e.preventDefault();
                    navigateDropdown(activeDropdown, e.key === 'ArrowDown' ? 1 : -1);
                }
            }
        });
    }

    function navigateDropdown(dropdown, direction) {
        const links = dropdown.querySelectorAll('.dropdown-link');
        const currentIndex = Array.from(links).indexOf(document.activeElement);
        let newIndex = currentIndex + direction;

        if (newIndex < 0) newIndex = links.length - 1;
        if (newIndex >= links.length) newIndex = 0;

        links[newIndex].focus();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
