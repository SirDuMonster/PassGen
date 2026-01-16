/**
 * PassGen - Password Strength Analyzer Module
 * Calculates entropy and estimates crack time
 */

const StrengthAnalyzer = (function() {
    'use strict';

    // Strength levels
    const LEVELS = {
        WEAK: { name: 'Weak', key: 'weak', minEntropy: 0 },
        FAIR: { name: 'Fair', key: 'fair', minEntropy: 28 },
        GOOD: { name: 'Good', key: 'good', minEntropy: 36 },
        STRONG: { name: 'Strong', key: 'strong', minEntropy: 60 },
        VERY_STRONG: { name: 'Very Strong', key: 'very-strong', minEntropy: 80 }
    };

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
     * @param {number} wordlistSize - Size of wordlist (default EFF = 7776)
     * @param {boolean} includesNumber - Whether a number is included
     * @returns {number} Entropy in bits
     */
    function calculatePassphraseEntropy(wordCount, wordlistSize = 7776, includesNumber = false) {
        let entropy = wordCount * Math.log2(wordlistSize);

        if (includesNumber) {
            // Add entropy for number position and value (0-99)
            entropy += Math.log2(100) + Math.log2(wordCount + 1);
        }

        return Math.round(entropy * 10) / 10;
    }

    /**
     * Estimate time to crack password via brute force
     * @param {number} entropy - Entropy in bits
     * @returns {string} Human-readable time estimate
     */
    function estimateCrackTime(entropy) {
        if (entropy <= 0) return 'Instant';

        // Assume 10 billion guesses per second (modern hardware)
        const guessesPerSecond = 10e9;

        // Total possible combinations = 2^entropy
        // Average tries = half of that
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
        if (seconds < 60) return `${Math.round(seconds)} seconds`;

        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.round(minutes)} minutes`;

        const hours = minutes / 60;
        if (hours < 24) return `${Math.round(hours)} hours`;

        const days = hours / 24;
        if (days < 30) return `${Math.round(days)} days`;

        const months = days / 30;
        if (months < 12) return `${Math.round(months)} months`;

        const years = days / 365;
        if (years < 1000) return `${Math.round(years)} years`;

        if (years < 1e6) return `${formatNumber(years)} years`;
        if (years < 1e9) return `${formatNumber(years / 1e6)} million years`;
        if (years < 1e12) return `${formatNumber(years / 1e9)} billion years`;

        return `${formatNumber(years / 1e12)} trillion years`;
    }

    /**
     * Format large numbers
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    function formatNumber(num) {
        if (num < 10) return num.toFixed(1);
        if (num < 100) return Math.round(num).toString();
        if (num < 1000) return Math.round(num).toString();

        return num.toLocaleString('en-US', {
            maximumFractionDigits: 0,
            notation: 'compact',
            compactDisplay: 'short'
        });
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
        const entropy = calculatePassphraseEntropy(wordCount, 7776, includesNumber);
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
        LEVELS
    };
})();
