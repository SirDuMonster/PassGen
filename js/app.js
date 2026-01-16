/**
 * PassGen - Main Application Module
 * Initializes and coordinates all features
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        // Theme
        themeToggle: document.getElementById('themeToggle'),

        // Tabs
        tabs: document.querySelectorAll('.tab-btn'),
        panels: document.querySelectorAll('.generator-panel'),

        // Password Generator
        passwordText: document.getElementById('passwordText'),
        copyBtn: document.getElementById('copyBtn'),
        regenerateBtn: document.getElementById('regenerateBtn'),
        passwordLength: document.getElementById('passwordLength'),
        passwordLengthInput: document.getElementById('passwordLengthInput'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols'),
        excludeAmbiguous: document.getElementById('excludeAmbiguous'),
        excludeBrackets: document.getElementById('excludeBrackets'),
        beginWithLetter: document.getElementById('beginWithLetter'),
        noRepeating: document.getElementById('noRepeating'),
        minNumbers: document.getElementById('minNumbers'),
        minSymbols: document.getElementById('minSymbols'),
        customSymbols: document.getElementById('customSymbols'),

        // Strength Meter
        strengthFill: document.getElementById('strengthFill'),
        strengthLabel: document.getElementById('strengthLabel'),
        strengthEntropy: document.getElementById('strengthEntropy'),
        strengthTime: document.getElementById('strengthTime'),

        // Passphrase Generator
        passphraseText: document.getElementById('passphraseText'),
        copyPassphraseBtn: document.getElementById('copyPassphraseBtn'),
        regeneratePassphraseBtn: document.getElementById('regeneratePassphraseBtn'),
        wordCount: document.getElementById('wordCount'),
        wordCountInput: document.getElementById('wordCountInput'),
        separator: document.getElementById('separator'),
        capitalize: document.getElementById('capitalize'),
        includeNumber: document.getElementById('includeNumber'),
        passphraseStrengthFill: document.getElementById('passphraseStrengthFill'),
        passphraseStrengthLabel: document.getElementById('passphraseStrengthLabel'),
        passphraseStrengthEntropy: document.getElementById('passphraseStrengthEntropy'),
        passphraseStrengthTime: document.getElementById('passphraseStrengthTime'),

        // PIN Generator
        pinText: document.getElementById('pinText'),
        copyPinBtn: document.getElementById('copyPinBtn'),
        regeneratePinBtn: document.getElementById('regeneratePinBtn'),
        pinLength: document.getElementById('pinLength'),
        pinLengthInput: document.getElementById('pinLengthInput'),
        noRepeatedDigits: document.getElementById('noRepeatedDigits'),
        noSequentialDigits: document.getElementById('noSequentialDigits'),
        pinStrengthFill: document.getElementById('pinStrengthFill'),
        pinStrengthLabel: document.getElementById('pinStrengthLabel'),
        pinStrengthEntropy: document.getElementById('pinStrengthEntropy'),
        pinStrengthTime: document.getElementById('pinStrengthTime'),

        // Bulk Generator
        bulkCount: document.getElementById('bulkCount'),
        bulkCountInput: document.getElementById('bulkCountInput'),
        generateBulkBtn: document.getElementById('generateBulkBtn'),
        copyAllBtn: document.getElementById('copyAllBtn'),
        downloadCsvBtn: document.getElementById('downloadCsvBtn'),
        bulkList: document.getElementById('bulkList'),

        // Toast
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage')
    };

    // State
    let bulkPasswords = [];
    let toastTimeout = null;

    /**
     * Show toast notification
     * @param {string} message - Message to display
     */
    function showToast(message = 'Copied!') {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        elements.toastMessage.textContent = message;
        elements.toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 2000);
    }

    /**
     * Show copy button success state
     * @param {HTMLElement} button - The copy button element
     */
    function showCopySuccess(button) {
        if (!button) return;

        button.classList.add('copied');
        const span = button.querySelector('span');
        const originalText = span ? span.textContent : 'Copy';
        if (span) span.textContent = 'Copied!';

        setTimeout(() => {
            button.classList.remove('copied');
            if (span) span.textContent = originalText;
        }, 1500);
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @param {HTMLElement} button - Optional button to show success state
     */
    async function copyToClipboard(text, button = null) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied!');
            showCopySuccess(button);

            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = 'Password copied to clipboard';
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Copied!');
                showCopySuccess(button);
            } catch (e) {
                showToast('Failed to copy');
            }
            document.body.removeChild(textArea);
        }
    }

    /**
     * Get current password options from UI
     * @returns {Object} Password options
     */
    function getPasswordOptions() {
        return {
            length: parseInt(elements.passwordLength.value, 10),
            uppercase: elements.uppercase.checked,
            lowercase: elements.lowercase.checked,
            numbers: elements.numbers.checked,
            symbols: elements.symbols.checked,
            excludeAmbiguous: elements.excludeAmbiguous.checked,
            excludeBrackets: elements.excludeBrackets.checked,
            beginWithLetter: elements.beginWithLetter.checked,
            noRepeating: elements.noRepeating.checked,
            minNumbers: parseInt(elements.minNumbers.value, 10) || 0,
            minSymbols: parseInt(elements.minSymbols.value, 10) || 0,
            customSymbols: elements.customSymbols.value || null
        };
    }

    /**
     * Update strength meter display
     * @param {Object} analysis - Strength analysis result
     * @param {string} prefix - Element ID prefix ('', 'passphrase')
     */
    function updateStrengthMeter(analysis, prefix = '') {
        const fill = prefix ? elements.passphraseStrengthFill : elements.strengthFill;
        const label = prefix ? elements.passphraseStrengthLabel : elements.strengthLabel;
        const entropy = prefix ? elements.passphraseStrengthEntropy : elements.strengthEntropy;
        const time = prefix ? elements.passphraseStrengthTime : elements.strengthTime;

        fill.setAttribute('data-strength', analysis.level.key);
        label.setAttribute('data-strength', analysis.level.key);
        label.textContent = analysis.level.name;
        entropy.textContent = `${analysis.entropy} bits`;
        time.textContent = analysis.crackTime;
    }

    /**
     * Generate and display password
     */
    function generatePassword() {
        const options = getPasswordOptions();

        // Ensure at least one character type is selected
        if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
            options.lowercase = true;
            elements.lowercase.checked = true;
        }

        const password = Generator.generatePassword(options);
        elements.passwordText.textContent = password;

        // Add spin animation to regenerate button
        elements.regenerateBtn.querySelector('.regenerate-icon').style.transform = 'rotate(360deg)';
        setTimeout(() => {
            elements.regenerateBtn.querySelector('.regenerate-icon').style.transform = '';
        }, 300);

        // Update strength meter
        const analysis = StrengthAnalyzer.analyze(password);
        updateStrengthMeter(analysis);
    }

    /**
     * Get passphrase options from UI
     * @returns {Object} Passphrase options
     */
    function getPassphraseOptions() {
        return {
            wordCount: parseInt(elements.wordCount.value, 10),
            separator: elements.separator.value,
            capitalize: elements.capitalize.value,
            includeNumber: elements.includeNumber.checked
        };
    }

    /**
     * Generate and display passphrase
     */
    function generatePassphrase() {
        const options = getPassphraseOptions();
        const passphrase = Generator.generatePassphrase(options);
        elements.passphraseText.textContent = passphrase;

        // Update strength meter
        const analysis = StrengthAnalyzer.analyzePassphrase(options.wordCount, options.includeNumber);
        updateStrengthMeter(analysis, 'passphrase');
    }

    /**
     * Get PIN options from UI
     * @returns {Object} PIN options
     */
    function getPinOptions() {
        return {
            length: parseInt(elements.pinLength.value, 10),
            noRepeatedDigits: elements.noRepeatedDigits.checked,
            noSequentialDigits: elements.noSequentialDigits.checked
        };
    }

    /**
     * Update PIN strength meter
     * @param {string} pin - Generated PIN
     */
    function updatePinStrengthMeter(pin) {
        if (!pin || !elements.pinStrengthFill) return;

        // Calculate PIN entropy: log2(10^length) = length * log2(10) ≈ length * 3.322
        const entropy = Math.round(pin.length * 3.322 * 10) / 10;
        const analysis = {
            entropy,
            level: StrengthAnalyzer.getStrengthLevel(entropy),
            crackTime: StrengthAnalyzer.estimateCrackTime(entropy)
        };

        elements.pinStrengthFill.setAttribute('data-strength', analysis.level.key);
        elements.pinStrengthLabel.setAttribute('data-strength', analysis.level.key);
        elements.pinStrengthLabel.textContent = analysis.level.name;
        elements.pinStrengthEntropy.textContent = `${analysis.entropy} bits`;
        elements.pinStrengthTime.textContent = analysis.crackTime;
    }

    /**
     * Generate and display PIN
     */
    function generatePIN() {
        const options = getPinOptions();
        const pin = Generator.generatePIN(options);
        elements.pinText.textContent = pin;

        // Update PIN strength meter
        updatePinStrengthMeter(pin);
    }

    /**
     * Generate bulk passwords
     */
    function generateBulk() {
        const count = parseInt(elements.bulkCount.value, 10);
        const options = getPasswordOptions();

        bulkPasswords = Generator.generateBulk(count, options);

        // Clear and populate list
        elements.bulkList.innerHTML = '';
        bulkPasswords.forEach((pwd, index) => {
            const li = document.createElement('li');
            li.textContent = pwd;
            li.setAttribute('data-index', index);
            li.addEventListener('click', () => copyToClipboard(pwd));
            li.style.cursor = 'pointer';
            li.title = 'Click to copy';
            elements.bulkList.appendChild(li);
        });

        // Enable buttons
        elements.copyAllBtn.disabled = false;
        elements.downloadCsvBtn.disabled = false;
    }

    /**
     * Copy all bulk passwords
     */
    function copyAllBulk() {
        if (bulkPasswords.length > 0) {
            copyToClipboard(bulkPasswords.join('\n'));
        }
    }

    /**
     * Download bulk passwords as CSV
     */
    function downloadBulkCSV() {
        if (bulkPasswords.length > 0) {
            Generator.downloadCSV(bulkPasswords);
            showToast('Downloaded!');
        }
    }

    /**
     * Sync slider and input values
     * @param {HTMLInputElement} slider - Slider element
     * @param {HTMLInputElement} input - Number input element
     * @param {Function} callback - Callback on change
     */
    function syncSliderInput(slider, input, callback) {
        slider.addEventListener('input', () => {
            input.value = slider.value;
            callback();
        });

        input.addEventListener('input', () => {
            let value = parseInt(input.value, 10);
            const min = parseInt(input.min, 10);
            const max = parseInt(input.max, 10);

            if (isNaN(value)) value = min;
            if (value < min) value = min;
            if (value > max) value = max;

            input.value = value;
            slider.value = value;
            callback();
        });
    }

    /**
     * Switch active tab
     * @param {string} tabId - Tab ID to activate
     */
    function switchTab(tabId) {
        // Update tab buttons
        elements.tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        // Update panels
        elements.panels.forEach(panel => {
            const isActive = panel.id === `${tabId}-panel`;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });

        // Generate initial content for newly activated tab
        switch (tabId) {
            case 'password':
                if (elements.passwordText.textContent.includes('Click generate')) {
                    generatePassword();
                }
                break;
            case 'passphrase':
                if (elements.passphraseText.textContent.includes('Click generate')) {
                    generatePassphrase();
                }
                break;
            case 'pin':
                if (elements.pinText.textContent.includes('Click generate')) {
                    generatePIN();
                }
                break;
        }
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Theme toggle
        elements.themeToggle.addEventListener('click', () => Theme.toggle());

        // Tab switching
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        // Password generator
        elements.copyBtn.addEventListener('click', () => {
            const text = elements.passwordText.textContent;
            if (text && !text.includes('Click generate')) {
                copyToClipboard(text, elements.copyBtn);
            }
        });

        elements.regenerateBtn.addEventListener('click', generatePassword);

        // Sync length slider and input
        syncSliderInput(elements.passwordLength, elements.passwordLengthInput, generatePassword);

        // Character type checkboxes
        [elements.uppercase, elements.lowercase, elements.numbers, elements.symbols].forEach(cb => {
            cb.addEventListener('change', generatePassword);
        });

        // Advanced options
        [elements.excludeAmbiguous, elements.excludeBrackets, elements.beginWithLetter, elements.noRepeating].forEach(cb => {
            cb.addEventListener('change', generatePassword);
        });

        elements.minNumbers.addEventListener('change', generatePassword);
        elements.minSymbols.addEventListener('change', generatePassword);
        elements.customSymbols.addEventListener('input', generatePassword);

        // Passphrase generator
        elements.copyPassphraseBtn.addEventListener('click', () => {
            const text = elements.passphraseText.textContent;
            if (text && !text.includes('Click generate')) {
                copyToClipboard(text, elements.copyPassphraseBtn);
            }
        });

        elements.regeneratePassphraseBtn.addEventListener('click', generatePassphrase);

        syncSliderInput(elements.wordCount, elements.wordCountInput, generatePassphrase);

        elements.separator.addEventListener('change', generatePassphrase);
        elements.capitalize.addEventListener('change', generatePassphrase);
        elements.includeNumber.addEventListener('change', generatePassphrase);

        // PIN generator
        elements.copyPinBtn.addEventListener('click', () => {
            const text = elements.pinText.textContent;
            if (text && !text.includes('Click generate')) {
                copyToClipboard(text, elements.copyPinBtn);
            }
        });

        elements.regeneratePinBtn.addEventListener('click', generatePIN);

        syncSliderInput(elements.pinLength, elements.pinLengthInput, generatePIN);

        elements.noRepeatedDigits.addEventListener('change', generatePIN);
        elements.noSequentialDigits.addEventListener('change', generatePIN);

        // Bulk generator
        syncSliderInput(elements.bulkCount, elements.bulkCountInput, () => {});

        elements.generateBulkBtn.addEventListener('click', generateBulk);
        elements.copyAllBtn.addEventListener('click', copyAllBulk);
        elements.downloadCsvBtn.addEventListener('click', downloadBulkCSV);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + G to regenerate
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                const activePanel = document.querySelector('.generator-panel.active');
                if (activePanel) {
                    switch (activePanel.id) {
                        case 'password-panel':
                            generatePassword();
                            break;
                        case 'passphrase-panel':
                            generatePassphrase();
                            break;
                        case 'pin-panel':
                            generatePIN();
                            break;
                    }
                }
            }

            // Ctrl/Cmd + C to copy (when not in input)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.target.matches('input, textarea')) {
                const activePanel = document.querySelector('.generator-panel.active');
                if (activePanel) {
                    let text = '';
                    switch (activePanel.id) {
                        case 'password-panel':
                            text = elements.passwordText.textContent;
                            break;
                        case 'passphrase-panel':
                            text = elements.passphraseText.textContent;
                            break;
                        case 'pin-panel':
                            text = elements.pinText.textContent;
                            break;
                    }
                    if (text && !text.includes('Click generate')) {
                        copyToClipboard(text);
                    }
                }
            }
        });
    }

    /**
     * Initialize the application
     */
    function init() {
        // Initialize theme
        Theme.init();

        // Initialize event listeners
        initEventListeners();

        // Generate initial password
        generatePassword();
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
