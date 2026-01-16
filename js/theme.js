/**
 * PassGen - Theme Management Module
 * Handles dark/light mode with system preference detection
 */

const Theme = (function() {
    'use strict';

    const STORAGE_KEY = 'passgen-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    let currentTheme = LIGHT;

    /**
     * Get system color scheme preference
     * @returns {string} 'dark' or 'light'
     */
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK;
        }
        return LIGHT;
    }

    /**
     * Get saved theme from localStorage
     * @returns {string|null} Saved theme or null
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    /**
     * Save theme to localStorage
     * @param {string} theme - Theme to save
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // localStorage not available
        }
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme to apply
     */
    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === DARK ? '#000000' : '#ffffff');
        }
    }

    /**
     * Toggle between dark and light theme
     * @returns {string} New theme
     */
    function toggle() {
        const newTheme = currentTheme === DARK ? LIGHT : DARK;
        applyTheme(newTheme);
        saveTheme(newTheme);
        return newTheme;
    }

    /**
     * Set specific theme
     * @param {string} theme - Theme to set ('dark' or 'light')
     */
    function setTheme(theme) {
        if (theme === DARK || theme === LIGHT) {
            applyTheme(theme);
            saveTheme(theme);
        }
    }

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    function getTheme() {
        return currentTheme;
    }

    /**
     * Initialize theme system
     */
    function init() {
        // Check for saved preference, fall back to system preference
        const savedTheme = getSavedTheme();
        const initialTheme = savedTheme || getSystemPreference();

        applyTheme(initialTheme);

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!getSavedTheme()) {
                    applyTheme(e.matches ? DARK : LIGHT);
                }
            });
        }
    }

    // Public API
    return {
        init,
        toggle,
        setTheme,
        getTheme,
        DARK,
        LIGHT
    };
})();
