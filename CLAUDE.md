# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CoachOS is a personal training management web app for managing coaching relationships with multiple clients. It runs entirely as static HTML/JS/CSS on GitHub Pages with no build step, no package manager, and no compilation.

**Live URL**: `https://momcilovicrobert-momc.github.io/CoachOS/CoachOS/`

## Development

There is no build, lint, or test toolchain. To develop:
- Open HTML files directly in a browser, or serve locally with any static file server (e.g., `python -m http.server` in the `CoachOS/` subdirectory).
- All source is in `CoachOS/*.html` — self-contained HTML files with embedded `<style>` and `<script>` tags.

## Architecture

### File Layout

```
CoachOS/
└── CoachOS/
    ├── coachos-coach.html        # Coach dashboard — central hub
    ├── coachos-eli.html          # Per-client pages
    ├── coachos-hana.html
    ├── coachos-hana-telo.html    # Hana body-tracking variant
    ├── coachos-niko.html
    ├── coachos-nina.html
    ├── coachos-pain-tracker.html
    └── images/clients/
```

### Data Flow

1. **Client pages** save workout logs, check-ins, weight, measurements, and cardio to **browser localStorage** (offline-first).
2. On save, data is also POSTed to a **Google Apps Script endpoint** (hardcoded URL in each file) which writes to Google Sheets.
3. **Coach dashboard** (`coachos-coach.html`) reads recent logs by fetching from the same Google Sheets endpoint and displays them in a multi-client overview.
4. Coach dashboard has an AI analysis feature that calls the **Anthropic Claude API** (`https://api.anthropic.com/v1/messages`, model `claude-sonnet-4-20250514`) directly from the browser.

### Tech Stack

- **Vanilla JS** (ES6+, async/await) — no frameworks
- **Chart.js 4.4.1** — weight/progress charts
- **Google Fonts** — Bebas Neue, DM Sans, JetBrains Mono
- **CSS custom properties** — dark theme (`#0d0d0d` bg, lime `#c8f135`, orange `#ff6b35`, purple `#a78bfa` for AI)

### Key Patterns

- **No authentication** — access is by knowing the GitHub Pages URL.
- **UI language is Slovenian** — all labels, prompts, and AI instructions are in Slovenian.
- **Program A/B rotation** — some clients have two programs; the day selector cycles through them.
- **Structured workout log format**: exercise name, sets × reps, weight (kg), RPE, date.
- **Each HTML file is self-contained** — config (Google Apps Script URL, client metadata, program definitions) is hardcoded in the `<script>` block of that file.
