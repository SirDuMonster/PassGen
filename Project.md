# Project: PassGen - Premium Password Generator

## Brand
- Name: PassGen
- Tagline: "Secure passwords, instantly."

## Overview
Build a modern, Apple-inspired password generator web app. Pure client-side JavaScript, no backend needed. Monetization via ads. Target: outperform outdated competitors like passwordsgenerator.net with superior UX and modern design.

## Tech Stack
- HTML5 + CSS3 (vanilla, no frameworks)
- Vanilla JavaScript (ES6+)
- Zero dependencies
- Ad placeholders ready for Google AdSense

## Design Requirements

### Apple-Inspired UI
- Clean, minimalist design with generous whitespace
- Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Subtle shadows and rounded corners (12-16px border-radius)
- Smooth micro-animations (200-300ms ease transitions)
- Glass morphism effects for cards (backdrop-filter: blur)
- Color palette:
  - Light mode: #ffffff bg, #f5f5f7 secondary, #1d1d1f text, #0071e3 accent
  - Dark mode: #000000 bg, #1c1c1e secondary, #f5f5f7 text, #0a84ff accent

### Logo
- "PassGen" clean wordmark
- Favicon: Stylized lock or "P" icon

## Core Features

### 1. Main Password Generator
- Length slider: 4-128 characters (synced with number input)
- Toggle switches for: Uppercase, Lowercase, Numbers, Symbols
- Real-time generation on any setting change
- One-click copy with "Copied!" toast animation
- Regenerate button with spin animation
- Large monospace password display

### 2. Password Strength Meter
- Animated color bar (red → orange → yellow → green)
- Labels: Weak / Fair / Good / Strong / Very Strong
- Show entropy in bits
- Show estimated crack time (e.g., "3 trillion years")

### 3. Dark Mode
- Auto-detect system preference
- Manual toggle (sun/moon icon)
- Persist choice in localStorage
- Smooth color transitions

### 4. Advanced Options (collapsible)
- Exclude ambiguous characters: 0O1lI|
- Exclude brackets/quotes: {}[]()\/'"
- Custom symbols input
- Minimum numbers required
- Minimum symbols required
- Begin with letter option
- No repeating characters option

### 5. Bulk Generator
- Generate 1-100 passwords at once
- Display in scrollable list
- Copy All button
- Download as CSV button

### 6. Passphrase Generator
- Word-based passwords (correct-horse-battery style)
- Word count: 3-8 words
- Separator: hyphen, underscore, space, number
- Capitalize options: none, first letter, ALL CAPS
- Use EFF wordlist embedded in JS

### 7. PIN Generator
- Length: 4-12 digits
- Option: No repeated digits
- Option: No sequential digits (123, 321)

## Security Requirements
- MUST use `crypto.getRandomValues()` - never Math.random()
- All generation 100% client-side
- No data sent to any server
- Document this prominently in UI ("Your passwords never leave your browser")

## SEO Content Sections
Include FAQ accordion with:
- "Is PassGen safe to use?"
- "What makes a strong password?"
- "How does PassGen generate passwords?"
- "Are my passwords stored anywhere?"
- "How long should my password be?"

Add meta tags for SEO:
- Title: "PassGen - Free Secure Password Generator"
- Description: "Generate strong, random passwords instantly. 100% free, works offline, no data stored. Create secure passwords, PINs, and passphrases."

## Ad Placements
Add placeholder divs with comments for:
- Header banner (728x90) below main generator
- Sidebar (300x250) on desktop
- Footer banner (728x90)
Do NOT add actual ad scripts, just clearly marked placeholders.

## File Structure
```
passgen/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── generator.js    (password generation logic)
│   ├── strength.js     (strength calculation)
│   ├── wordlist.js     (EFF wordlist for passphrases)
│   ├── theme.js        (dark mode handling)
│   └── app.js          (main app initialization)
├── assets/
│   └── favicon.svg
├── robots.txt
└── sitemap.xml
```

## UI Layout
```
┌─────────────────────────────────────────┐
│  PassGen                    [🌙 Toggle] │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │     xK9#mPq2$nL4vR7@             │  │
│  │     [Copy]  [Regenerate]          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ████████░░░ Strong · 89 bits          │
│  Crack time: 3 trillion years           │
│                                         │
│  Length ──────●────── 16                │
│                                         │
│  ☑ Uppercase  ☑ Lowercase               │
│  ☑ Numbers    ☑ Symbols                 │
│                                         │
│  ▼ Advanced Options                     │
│                                         │
│  [Password] [Passphrase] [PIN] ← tabs   │
│                                         │
│  ┌─ AD PLACEHOLDER 728x90 ───────────┐  │
│                                         │
│  ▼ FAQ Section                          │
│                                         │
│  PassGen © 2025 · Privacy · GitHub      │
└─────────────────────────────────────────┘
```

## Performance Targets
- Lighthouse: 95+ all categories
- Page load: <1 second
- Total size: <100KB (before ads)
- Works offline after first load

## Accessibility
- Full keyboard navigation
- ARIA labels on all controls
- Focus indicators
- 4.5:1 color contrast minimum
- Screen reader announcements for copy action

## Browser Support
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Mobile responsive (works on all screen sizes)

## Implementation Order
1. HTML structure + basic CSS
2. Main password generator logic
3. Strength meter
4. UI styling (Apple aesthetic)
5. Dark mode
6. Advanced options
7. Tabs: Bulk, Passphrase, PIN generators
8. Copy functionality with toast
9. SEO content + meta tags
10. Ad placeholders
11. Final polish + animations

Build this as a production-ready, polished web app that looks premium and works flawlessly.