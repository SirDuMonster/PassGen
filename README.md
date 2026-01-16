# PassGen - Secure Password Generator

A modern, Apple-inspired password generator web app. Generate strong, random passwords instantly with 100% client-side security.

## Features

- **Password Generator** - Customizable length (4-128 chars), character types, advanced options
- **Passphrase Generator** - Word-based passwords using EFF wordlist
- **PIN Generator** - Secure numeric PINs with anti-pattern options
- **Bulk Generator** - Generate up to 100 passwords at once, export to CSV
- **Strength Meter** - Real-time entropy calculation and crack time estimates
- **Dark Mode** - Auto-detects system preference, with manual toggle
- **100% Client-Side** - Uses `crypto.getRandomValues()`, no data sent to servers

## Security

All password generation happens directly in your browser using the Web Crypto API. Your passwords are never transmitted over the internet or stored anywhere.

## Tech Stack

- HTML5 + CSS3 (vanilla, no frameworks)
- Vanilla JavaScript (ES6+)
- Zero dependencies

## Live Demo

Visit [PassGen](https://passgen.vercel.app) to try it out.

## License

MIT License
