/**
 * PassGen - Password Generator Module
 * Uses crypto.getRandomValues() for cryptographically secure random generation
 */

const Generator = (function() {
    'use strict';

    // Character sets
    const CHARS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        ambiguous: '0O1lI|',
        brackets: '{}[]()\\\/\'"'
    };

    /**
     * Get cryptographically secure random integer
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} Random integer from 0 to max-1
     */
    function getSecureRandomInt(max) {
        if (max <= 0) return 0;

        const array = new Uint32Array(1);
        const maxUint32 = 0xFFFFFFFF;
        const limit = maxUint32 - (maxUint32 % max);

        do {
            crypto.getRandomValues(array);
        } while (array[0] >= limit);

        return array[0] % max;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm with secure random
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    function secureShuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = getSecureRandomInt(i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Remove characters from a string
     * @param {string} str - Source string
     * @param {string} charsToRemove - Characters to remove
     * @returns {string} String with characters removed
     */
    function removeChars(str, charsToRemove) {
        return str.split('').filter(char => !charsToRemove.includes(char)).join('');
    }

    /**
     * Generate a password based on options
     * @param {Object} options - Generation options
     * @returns {string} Generated password
     */
    function generatePassword(options = {}) {
        const defaults = {
            length: 16,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            excludeAmbiguous: false,
            excludeBrackets: false,
            customSymbols: null,
            minNumbers: 0,
            minSymbols: 0,
            beginWithLetter: false,
            noRepeating: false
        };

        const opts = { ...defaults, ...options };

        // Build character pool
        let charPool = '';
        let requiredChars = [];

        if (opts.uppercase) {
            let chars = CHARS.uppercase;
            if (opts.excludeAmbiguous) {
                chars = removeChars(chars, CHARS.ambiguous);
            }
            charPool += chars;
        }

        if (opts.lowercase) {
            let chars = CHARS.lowercase;
            if (opts.excludeAmbiguous) {
                chars = removeChars(chars, CHARS.ambiguous);
            }
            charPool += chars;
        }

        if (opts.numbers) {
            let chars = CHARS.numbers;
            if (opts.excludeAmbiguous) {
                chars = removeChars(chars, CHARS.ambiguous);
            }
            charPool += chars;

            // Add minimum required numbers
            for (let i = 0; i < opts.minNumbers; i++) {
                requiredChars.push(chars[getSecureRandomInt(chars.length)]);
            }
        }

        if (opts.symbols) {
            let chars = opts.customSymbols || CHARS.symbols;
            if (opts.excludeBrackets) {
                chars = removeChars(chars, CHARS.brackets);
            }
            charPool += chars;

            // Add minimum required symbols
            for (let i = 0; i < opts.minSymbols; i++) {
                requiredChars.push(chars[getSecureRandomInt(chars.length)]);
            }
        }

        // Fallback if no options selected
        if (charPool.length === 0) {
            charPool = CHARS.lowercase;
        }

        // Handle noRepeating constraint
        if (opts.noRepeating && opts.length > charPool.length) {
            // Can't generate without repeating if length > pool size
            // Silently adjust or return what we can
            opts.length = charPool.length;
        }

        // Generate password
        let password = [];
        let usedChars = new Set();

        // Handle begin with letter
        if (opts.beginWithLetter) {
            let letterPool = '';
            if (opts.uppercase) {
                letterPool += opts.excludeAmbiguous ?
                    removeChars(CHARS.uppercase, CHARS.ambiguous) : CHARS.uppercase;
            }
            if (opts.lowercase) {
                letterPool += opts.excludeAmbiguous ?
                    removeChars(CHARS.lowercase, CHARS.ambiguous) : CHARS.lowercase;
            }
            if (letterPool.length > 0) {
                const firstChar = letterPool[getSecureRandomInt(letterPool.length)];
                password.push(firstChar);
                if (opts.noRepeating) {
                    usedChars.add(firstChar);
                }
            }
        }

        // Add required characters
        for (const char of requiredChars) {
            if (password.length < opts.length) {
                if (!opts.noRepeating || !usedChars.has(char)) {
                    password.push(char);
                    if (opts.noRepeating) {
                        usedChars.add(char);
                    }
                }
            }
        }

        // Fill remaining length
        let availablePool = opts.noRepeating ?
            charPool.split('').filter(c => !usedChars.has(c)) :
            charPool.split('');

        while (password.length < opts.length && availablePool.length > 0) {
            const index = getSecureRandomInt(availablePool.length);
            const char = availablePool[index];
            password.push(char);

            if (opts.noRepeating) {
                availablePool.splice(index, 1);
            }
        }

        // Shuffle (but keep first char if beginWithLetter)
        if (opts.beginWithLetter && password.length > 1) {
            const firstChar = password[0];
            const rest = secureShuffleArray(password.slice(1));
            return firstChar + rest.join('');
        }

        return secureShuffleArray(password).join('');
    }

    /**
     * Generate a PIN
     * @param {Object} options - Generation options
     * @returns {string} Generated PIN
     */
    function generatePIN(options = {}) {
        const defaults = {
            length: 4,
            noRepeatedDigits: false,
            noSequentialDigits: false
        };

        const opts = { ...defaults, ...options };
        const digits = '0123456789';
        let pin = [];
        let attempts = 0;
        const maxAttempts = 1000;

        while (pin.length < opts.length && attempts < maxAttempts) {
            const digit = digits[getSecureRandomInt(10)];

            // Check repeated digits
            if (opts.noRepeatedDigits && pin.includes(digit)) {
                attempts++;
                continue;
            }

            // Check sequential digits
            if (opts.noSequentialDigits && pin.length > 0) {
                const lastDigit = parseInt(pin[pin.length - 1]);
                const currentDigit = parseInt(digit);

                // Check ascending or descending sequence
                if (Math.abs(currentDigit - lastDigit) === 1) {
                    // Check if it would form a sequence of 3+
                    if (pin.length >= 2) {
                        const prevDigit = parseInt(pin[pin.length - 2]);
                        const diff1 = lastDigit - prevDigit;
                        const diff2 = currentDigit - lastDigit;

                        if ((diff1 === 1 && diff2 === 1) || (diff1 === -1 && diff2 === -1)) {
                            attempts++;
                            continue;
                        }
                    }
                }
            }

            pin.push(digit);
            attempts = 0;
        }

        // If we couldn't generate a valid PIN with constraints, fall back
        if (pin.length < opts.length) {
            return generatePIN({ ...opts, noSequentialDigits: false });
        }

        return pin.join('');
    }

    /**
     * Generate a passphrase using wordlist
     * @param {Object} options - Generation options
     * @returns {string} Generated passphrase
     */
    function generatePassphrase(options = {}) {
        const defaults = {
            wordCount: 4,
            separator: '-',
            capitalize: 'first', // 'none', 'first', 'all'
            includeNumber: false
        };

        const opts = { ...defaults, ...options };

        // Use EFF wordlist (must be loaded)
        if (typeof EFF_WORDLIST === 'undefined' || EFF_WORDLIST.length === 0) {
            console.error('EFF wordlist not loaded');
            return 'error-loading-wordlist';
        }

        let words = [];
        for (let i = 0; i < opts.wordCount; i++) {
            const word = EFF_WORDLIST[getSecureRandomInt(EFF_WORDLIST.length)];
            words.push(word);
        }

        // Apply capitalization
        words = words.map(word => {
            switch (opts.capitalize) {
                case 'first':
                    return word.charAt(0).toUpperCase() + word.slice(1);
                case 'all':
                    return word.toUpperCase();
                default:
                    return word;
            }
        });

        // Add number if requested
        if (opts.includeNumber) {
            const position = getSecureRandomInt(words.length + 1);
            const number = getSecureRandomInt(100);
            words.splice(position, 0, number.toString());
        }

        return words.join(opts.separator);
    }

    /**
     * Generate multiple passwords (bulk)
     * @param {number} count - Number of passwords
     * @param {Object} options - Password options
     * @returns {string[]} Array of passwords
     */
    function generateBulk(count, options = {}) {
        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(generatePassword(options));
        }
        return passwords;
    }

    /**
     * Convert passwords to CSV format
     * @param {string[]} passwords - Array of passwords
     * @returns {string} CSV content
     */
    function toCSV(passwords) {
        const header = 'Index,Password';
        const rows = passwords.map((pwd, i) => `${i + 1},"${pwd}"`);
        return [header, ...rows].join('\n');
    }

    /**
     * Download passwords as CSV file
     * @param {string[]} passwords - Array of passwords
     */
    function downloadCSV(passwords) {
        const csv = toCSV(passwords);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `passgen-passwords-${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Public API
    return {
        generatePassword,
        generatePIN,
        generatePassphrase,
        generateBulk,
        downloadCSV,
        CHARS
    };
})();
