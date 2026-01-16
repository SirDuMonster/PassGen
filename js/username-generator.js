/**
 * PassGen - Username Generator Module
 * Generates random usernames in various styles
 */

const UsernameGenerator = (function() {
    'use strict';

    // Adjectives for username generation
    const adjectives = [
        'swift', 'bold', 'calm', 'dark', 'epic', 'fast', 'glad', 'keen', 'loud', 'mild',
        'neat', 'pure', 'rare', 'safe', 'true', 'warm', 'wise', 'cool', 'free', 'kind',
        'brave', 'quick', 'sharp', 'smart', 'royal', 'noble', 'magic', 'cyber', 'cosmic',
        'ninja', 'super', 'ultra', 'mega', 'hyper', 'alpha', 'omega', 'prime', 'elite',
        'lucky', 'happy', 'silent', 'shadow', 'golden', 'silver', 'crystal', 'phantom',
        'mystic', 'ancient', 'digital', 'electric', 'quantum', 'stellar', 'atomic', 'sonic'
    ];

    // Nouns for username generation
    const nouns = [
        'wolf', 'hawk', 'lion', 'bear', 'fox', 'owl', 'tiger', 'eagle', 'dragon', 'phoenix',
        'knight', 'wizard', 'ninja', 'hunter', 'rider', 'pilot', 'ranger', 'warrior', 'guardian',
        'storm', 'flame', 'frost', 'spark', 'blade', 'shield', 'arrow', 'star', 'moon', 'sun',
        'coder', 'hacker', 'gamer', 'player', 'master', 'chief', 'captain', 'legend', 'hero',
        'shadow', 'phantom', 'spirit', 'ghost', 'raven', 'cobra', 'viper', 'panther', 'falcon'
    ];

    // Consonants and vowels for pronounceable generation
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';

    /**
     * Get cryptographically secure random integer
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
     * Get random item from array
     */
    function randomItem(array) {
        return array[getSecureRandomInt(array.length)];
    }

    /**
     * Generate random characters
     */
    function randomChars(length, charset) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset[getSecureRandomInt(charset.length)];
        }
        return result;
    }

    /**
     * Capitalize first letter
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Generate Adjective + Noun style username (e.g., SwiftWolf42)
     */
    function generateAdjectiveNoun(options = {}) {
        const adj = capitalize(randomItem(adjectives));
        const noun = capitalize(randomItem(nouns));
        const number = options.includeNumber ? getSecureRandomInt(100) : '';
        return adj + noun + number;
    }

    /**
     * Generate random characters username (e.g., xK7mP2nQ)
     */
    function generateRandom(options = {}) {
        const length = options.length || 8;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return randomChars(length, charset);
    }

    /**
     * Generate pronounceable username (e.g., Tomaku, Velino)
     */
    function generatePronounceable(options = {}) {
        const syllables = options.syllables || 3;
        let result = '';

        for (let i = 0; i < syllables; i++) {
            result += consonants[getSecureRandomInt(consonants.length)];
            result += vowels[getSecureRandomInt(vowels.length)];
        }

        result = capitalize(result);

        if (options.includeNumber) {
            result += getSecureRandomInt(100);
        }

        return result;
    }

    /**
     * Generate word + numbers style (e.g., player8472)
     */
    function generateWordNumbers(options = {}) {
        const word = randomItem(nouns);
        const digits = options.digits || 4;
        let numbers = '';
        for (let i = 0; i < digits; i++) {
            numbers += getSecureRandomInt(10);
        }
        return word + numbers;
    }

    /**
     * Generate gaming-style username (e.g., xXShadowNinjaXx)
     */
    function generateGaming(options = {}) {
        const adj = randomItem(adjectives);
        const noun = randomItem(nouns);
        const prefix = options.includePrefix ? 'xX' : '';
        const suffix = options.includeSuffix ? 'Xx' : '';
        const number = options.includeNumber ? getSecureRandomInt(100) : '';

        return prefix + capitalize(adj) + capitalize(noun) + number + suffix;
    }

    /**
     * Generate professional-style username (e.g., john.doe, jdoe)
     */
    function generateProfessional(options = {}) {
        const firstNames = ['alex', 'sam', 'jordan', 'taylor', 'morgan', 'casey', 'riley', 'drew', 'jamie', 'quinn'];
        const lastNames = ['smith', 'jones', 'wilson', 'taylor', 'brown', 'davis', 'miller', 'anderson', 'jackson', 'white'];

        const first = randomItem(firstNames);
        const last = randomItem(lastNames);
        const style = getSecureRandomInt(3);

        switch (style) {
            case 0: return first + '.' + last;
            case 1: return first[0] + last;
            case 2: return first + last[0];
            default: return first + last;
        }
    }

    /**
     * Main generate function
     */
    function generate(style = 'adjectiveNoun', options = {}) {
        switch (style) {
            case 'adjectiveNoun':
                return generateAdjectiveNoun(options);
            case 'random':
                return generateRandom(options);
            case 'pronounceable':
                return generatePronounceable(options);
            case 'wordNumbers':
                return generateWordNumbers(options);
            case 'gaming':
                return generateGaming(options);
            case 'professional':
                return generateProfessional(options);
            default:
                return generateAdjectiveNoun(options);
        }
    }

    /**
     * Generate multiple usernames
     */
    function generateMultiple(count = 5, style = 'adjectiveNoun', options = {}) {
        const usernames = [];
        for (let i = 0; i < count; i++) {
            usernames.push(generate(style, options));
        }
        return usernames;
    }

    return {
        generate,
        generateMultiple,
        generateAdjectiveNoun,
        generateRandom,
        generatePronounceable,
        generateWordNumbers,
        generateGaming,
        generateProfessional
    };
})();
