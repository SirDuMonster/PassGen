/**
 * PassGen - Password Strength Analyzer Module
 * Calculates entropy and estimates crack time
 */

const StrengthAnalyzer = (function() {
    'use strict';

    // Strength levels based on industry standards
    // NIST and security researchers recommend:
    // - 25-30 bits: Basic protection
    // - 60-80 bits: Important accounts
    // - 100+ bits: Critical/high-security
    const LEVELS = {
        WEAK: { name: 'Weak', key: 'weak', minEntropy: 0 },
        FAIR: { name: 'Fair', key: 'fair', minEntropy: 30 },
        GOOD: { name: 'Good', key: 'good', minEntropy: 50 },
        STRONG: { name: 'Strong', key: 'strong', minEntropy: 70 },
        VERY_STRONG: { name: 'Very Strong', key: 'very-strong', minEntropy: 90 }
    };

    // Our actual wordlist size (for passphrase entropy)
    const WORDLIST_SIZE = 3223;

    /**
     * Calculate character pool size based on password content
     * @param {string} password - Password to analyze
     * @returns {number} Size of the character pool
     */
    function calculatePoolSize(password) {
        let poolSize = 0;
        let hasLower = false;
        let hasUpper = false;
        let hasDigits = false;
        let hasSymbols = false;

        for (const char of password) {
            if (/[a-z]/.test(char)) hasLower = true;
            else if (/[A-Z]/.test(char)) hasUpper = true;
            else if (/[0-9]/.test(char)) hasDigits = true;
            else hasSymbols = true;
        }

        if (hasLower) poolSize += 26;
        if (hasUpper) poolSize += 26;
        if (hasDigits) poolSize += 10;
        if (hasSymbols) poolSize += 32;

        return poolSize || 1;
    }

    /**
     * Calculate entropy in bits
     * Formula: E = L × log₂(R) where L = length, R = pool size
     * @param {string} password - Password to analyze
     * @returns {number} Entropy in bits
     */
    function calculateEntropy(password) {
        if (!password || password.length === 0) return 0;

        const poolSize = calculatePoolSize(password);
        const entropy = password.length * Math.log2(poolSize);

        return Math.round(entropy * 10) / 10;
    }

    /**
     * Calculate entropy for passphrase
     * @param {number} wordCount - Number of words
     * @param {number} wordlistSize - Size of wordlist
     * @param {boolean} includesNumber - Whether a number is included
     * @returns {number} Entropy in bits
     */
    function calculatePassphraseEntropy(wordCount, wordlistSize = WORDLIST_SIZE, includesNumber = false) {
        // Each word adds log₂(wordlistSize) bits of entropy
        let entropy = wordCount * Math.log2(wordlistSize);

        if (includesNumber) {
            // Add entropy for number (0-99) and its position
            entropy += Math.log2(100) + Math.log2(wordCount + 1);
        }

        return Math.round(entropy * 10) / 10;
    }

    /**
     * Estimate time to crack password via brute force
     * Based on offline attack with fast hashing (SHA-1, MD5)
     * @param {number} entropy - Entropy in bits
     * @returns {string} Human-readable time estimate
     */
    function estimateCrackTime(entropy) {
        if (entropy <= 0) return 'Instant';

        // 10 billion guesses/sec = modern GPU cluster with fast hash
        // This matches zxcvbn's offline_fast_hashing_1e10_per_second
        const guessesPerSecond = 10e9;

        // Total combinations = 2^entropy
        // Average tries to find = half (50% probability)
        const totalCombinations = Math.pow(2, entropy);
        const averageTries = totalCombinations / 2;
        const secondsToCrack = averageTries / guessesPerSecond;

        return formatTime(secondsToCrack);
    }

    /**
     * Format seconds into human-readable time
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    function formatTime(seconds) {
        if (seconds < 0.001) return 'Instant';
        if (seconds < 1) return 'Less than a second';
        if (seconds < 60) {
            const s = Math.round(seconds);
            return `${s} ${s === 1 ? 'second' : 'seconds'}`;
        }

        const minutes = seconds / 60;
        if (minutes < 60) {
            const m = Math.round(minutes);
            return `${m} ${m === 1 ? 'minute' : 'minutes'}`;
        }

        const hours = minutes / 60;
        if (hours < 24) {
            const h = Math.round(hours);
            return `${h} ${h === 1 ? 'hour' : 'hours'}`;
        }

        const days = hours / 24;
        if (days < 30) {
            const d = Math.round(days);
            return `${d} ${d === 1 ? 'day' : 'days'}`;
        }

        const months = days / 30;
        if (months < 12) {
            const mo = Math.round(months);
            return `${mo} ${mo === 1 ? 'month' : 'months'}`;
        }

        const years = days / 365.25;

        if (years < 1000) {
            const y = Math.round(years);
            return `${y} ${y === 1 ? 'year' : 'years'}`;
        }
        if (years < 1e6) return `${formatCompact(years)} years`;
        if (years < 1e9) return `${formatCompact(years / 1e6)} million years`;
        if (years < 1e12) return `${formatCompact(years / 1e9)} billion years`;
        if (years < 1e15) return `${formatCompact(years / 1e12)} trillion years`;

        // For extremely large numbers, use scientific notation
        const exponent = Math.floor(Math.log10(years));
        return `10^${exponent} years`;
    }

    /**
     * Format numbers in compact form
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    function formatCompact(num) {
        if (num < 10) return num.toFixed(1);
        if (num < 1000) return Math.round(num).toLocaleString('en-US');
        if (num < 1e6) return `${(num / 1e3).toFixed(1)}K`;
        return Math.round(num).toLocaleString('en-US');
    }

    /**
     * Get strength level based on entropy
     * @param {number} entropy - Entropy in bits
     * @returns {Object} Strength level object
     */
    function getStrengthLevel(entropy) {
        if (entropy >= LEVELS.VERY_STRONG.minEntropy) return LEVELS.VERY_STRONG;
        if (entropy >= LEVELS.STRONG.minEntropy) return LEVELS.STRONG;
        if (entropy >= LEVELS.GOOD.minEntropy) return LEVELS.GOOD;
        if (entropy >= LEVELS.FAIR.minEntropy) return LEVELS.FAIR;
        return LEVELS.WEAK;
    }

    /**
     * Analyze password strength
     * @param {string} password - Password to analyze
     * @returns {Object} Analysis result
     */
    function analyze(password) {
        const entropy = calculateEntropy(password);
        const level = getStrengthLevel(entropy);
        const crackTime = estimateCrackTime(entropy);

        return {
            entropy,
            level,
            crackTime,
            length: password ? password.length : 0
        };
    }

    /**
     * Analyze passphrase strength
     * @param {number} wordCount - Number of words
     * @param {boolean} includesNumber - Whether includes a number
     * @returns {Object} Analysis result
     */
    function analyzePassphrase(wordCount, includesNumber = false) {
        const entropy = calculatePassphraseEntropy(wordCount, WORDLIST_SIZE, includesNumber);
        const level = getStrengthLevel(entropy);
        const crackTime = estimateCrackTime(entropy);

        return {
            entropy,
            level,
            crackTime,
            wordCount
        };
    }

    // Public API
    return {
        analyze,
        analyzePassphrase,
        calculateEntropy,
        calculatePassphraseEntropy,
        estimateCrackTime,
        getStrengthLevel,
        LEVELS,
        WORDLIST_SIZE
    };
})();
