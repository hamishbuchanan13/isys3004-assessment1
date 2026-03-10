
# Changelog

All notable changes to this project are documented here. This file tracks the fixes and improvements made while getting CSS/JS integration working and aligning the site with Checkpoint 3 requirements.

## [Unreleased] - 2026-03-10

### Fixed
- **Incorrect asset paths**: Updated HTML to reference `css/styles.css` and `js/main.js`, matching the actual folder structure so styles and scripts load correctly.
- **Missing JavaScript file**: Added a `js/main.js` implementing required interactive features (navigation toggle, theme switcher, projects search/filter/sort, details toggles).
- **Progressive enhancement activation**: Ensured a `.js` class is applied to `<html>` early so JS-enhanced CSS rules (e.g., collapsible nav) take effect.

### Added
- **Project structure**: Introduced a conventional layout:
  ```
  / (project root)
    index.html
    about.html
    projects.html
    css/
      styles.css
    js/
      main.js
  ```
- **Theme switcher**: Light/Dark toggle with `localStorage` persistence; respects `prefers-color-scheme` when no explicit choice is set.
- **Mobile navigation**: Accessible hamburger button injected by JS with `aria-expanded`/`aria-controls`, Escape-to-close, and click-outside-to-close behavior.
- **Projects page interactivity**: Live search, category filters, sorting (Newest/A→Z), per-card details disclosure, and live project count updates.

### Changed
- **CSS foundation**: Replaced `styles.css` with a complete stylesheet including:
  - Design tokens (colors, spacing, radii, shadows, typography).
  - Base reset and typography.
  - Centered layout via `.container` with a max content width.
  - Navigation, section, and card styling.
  - JS-enhanced UI rules (collapsible nav, theme toggle, projects toolbar/grid).
- **Presentation polish**:
  - Centered header and navigation contents.
  - Applied `.container` to `header`, `nav`, and `main` to keep a clean central column.
  - Added `.prose` utility for comfortable spacing inside main content.
  - Constrained large images with a `.responsive` class and subtle rounding/shadow.
- **Consistency**: Normalized cross-page navigation so links behave consistently between `index.html`, `about.html`, and `projects.html`.

### Compliance (Checkpoint 3)
- **Required files present**: `index.html`, `about.html`, `projects.html`, `css/styles.css`, `js/main.js`.
- **JavaScript features (≥ 2)**: Implemented **three** core features—mobile nav toggle, theme switcher, and projects page interactivity.
- **Code quality**: No inline event handlers; all logic uses `addEventListener`. Key logic is commented. Progressive enhancement ensures pages remain usable without JS.

### Developer Notes
- Use a hard refresh (`Ctrl/Cmd + Shift + R`) after CSS/JS updates to bypass cache.
- Paths and file names are case-sensitive on most servers—ensure exact casing (e.g., `styles.css`, not `Styles.css`).
- For the demo video, showcase: toggling the mobile menu, switching themes (and persistence on reload), live filtering/sorting of projects, and opening/closing project details.

