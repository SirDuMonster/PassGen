# Project: PassGen - Premium Password Generator

## Brand
- Name: PassGen
- Tagline: "Secure passwords, instantly."
- URL: https://passgen-liard.vercel.app

## Overview
A modern, Apple-inspired password generator web app. Pure client-side JavaScript, no backend needed. Monetization via ads. Target: outperform outdated competitors like passwordsgenerator.net with superior UX and modern design.

## Tech Stack
- HTML5 + CSS3 (vanilla, no frameworks)
- Vanilla JavaScript (ES6+)
- Zero dependencies
- Ad placeholders ready for Google AdSense
- Deployed on Vercel

## Design System

### Apple-Inspired UI
- Clean, minimalist design with generous whitespace
- Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Subtle shadows and rounded corners (12-16px border-radius)
- Smooth micro-animations (200-300ms ease transitions)
- Glass morphism effects for cards (backdrop-filter: blur)
- Color palette:
  - Light mode: #ffffff bg, #f5f5f7 secondary, #1d1d1f text, #0071e3 accent
  - Dark mode: #000000 bg, #1c1c1e secondary, #f5f5f7 text, #0a84ff accent

### Navigation
- Sticky header with logo and main navigation
- Section tabs toolbar for quick tool access
- Mobile hamburger menu with slide-out drawer
- Unified footer across all pages

---

## Tools & Features

### 1. Main Password Generator (`/`)
- Length slider: 4-128 characters (synced with number input)
- Toggle switches for: Uppercase, Lowercase, Numbers, Symbols
- Real-time generation on any setting change
- One-click copy with "Copied!" toast animation
- Regenerate button with spin animation
- Large monospace password display

### 2. Password Strength Meter
- Animated color bar (red -> orange -> yellow -> green)
- Labels: Weak / Fair / Good / Strong / Very Strong
- Show entropy in bits
- Show estimated crack time (e.g., "3 trillion years")

### 3. Passphrase Generator (`/passphrase-generator/`)
- Word-based passwords (correct-horse-battery style)
- Word count: 3-8 words
- Separator: hyphen, underscore, space, number
- Capitalize options: none, first letter, ALL CAPS
- Uses EFF wordlist embedded in JS

### 4. PIN Generator (`/pin-generator/`)
- Length: 4-12 digits
- Option: No repeated digits
- Option: No sequential digits (123, 321)

### 5. Bulk Password Generator (`/bulk-password-generator/`)
- Generate 1-100 passwords at once
- Display in scrollable list
- Copy All button
- Download as CSV button

### 6. WiFi Password Generator (`/wifi-password-generator/`)
- Optimized for WPA2/WPA3 networks
- Length: 8-63 characters
- Memory-friendly options
- Device compatibility presets

### 7. Username Generator (`/username-generator/`)
- **7 Style Options:**
  - Creative (Adjective + Noun): SwiftWolf42
  - Gaming: xXShadowNinjaXx
  - Professional: john.smith
  - Pronounceable: Tomaku
  - Word + Numbers: player8472
  - Random: xK7mP2nQ
  - Custom Word: [user's word]_42
- Generate 1-20 usernames at once
- Click to copy functionality

### 8. Memorable Password Generator (`/memorable-password-generator/`)
- Pattern-based generation
- Easy to remember, hard to guess
- Multiple complexity levels

### 9. Strong Password Generator (`/strong-password-generator/`)
- High-entropy focused
- Maximum security options
- Preset configurations for different use cases

### 10. Password Strength Checker (`/password-strength-checker/`)
- Analyze existing passwords
- Detailed strength breakdown
- Security recommendations
- Crack time estimation

---

## Content Sections

### Blog (`/blog/`)
- Security articles and guides
- Password best practices
- Industry news and updates

### Compare (`/compare/`)
- PassGen vs LastPass
- PassGen vs Bitwarden
- PassGen vs 1Password
- Best Password Generators overview

### Glossary (`/glossary/`)
- Security terminology definitions
- Educational resource

### Static Pages
- About (`/about/`)
- Privacy Policy (`/privacy/`)
- Terms of Service (`/terms/`)

---

## Security Requirements
- MUST use `crypto.getRandomValues()` - never Math.random()
- All generation 100% client-side
- No data sent to any server
- Document this prominently in UI ("Your passwords never leave your browser")

---

## SEO
- Meta tags on all pages
- Schema.org structured data
- FAQ sections with FAQ schema
- Sitemap.xml
- Robots.txt
- Canonical URLs

---

## File Structure
```
passgen/
├── index.html
├── Project.md
├── progress.md
├── README.md
├── favicon.ico
├── robots.txt
├── sitemap.xml
│
├── css/
│   ├── style.css
│   ├── pages.css
│   └── navigation.css
│
├── js/
│   ├── app.js
│   ├── generator.js
│   ├── strength.js
│   ├── wordlist.js
│   ├── theme.js
│   ├── navigation.js
│   └── username-generator.js
│
├── [tool-name]/
│   └── index.html
│
├── blog/
├── compare/
├── glossary/
├── about/
├── privacy/
└── terms/
```

---

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
- Skip to content links

## Browser Support
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Mobile responsive (works on all screen sizes)

---

## Deployment
- **Platform**: Vercel
- **Repository**: GitHub (SirDuMonster/PassGen)
- **Auto-deploy**: On push to master branch
