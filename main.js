
// js/main.js — Portfolio interactions (Hamish Buchanan)
// Features implemented for Checkpoint 1.3 (Week 4):
// 1) Mobile navigation toggle (accessible, keyboard friendly)
// 2) Theme switcher (light/dark with localStorage persistence + prefers-color-scheme)
// 3) Projects page: search + category filter + sort + details disclosure
// Code style: no inline handlers; using addEventListener; progressive enhancement.

(function () {
  // Add a marker class to <html> so CSS can progressively enhance
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initThemeToggle();
    initProjectControls();
  });

  /**
   * Create an accessible hamburger button that toggles the primary nav
   * - Uses aria-expanded and aria-controls per WAI-ARIA disclosure guidance
   */
  function initNavToggle() {
    const nav = document.querySelector('nav');
    const list = nav && nav.querySelector('ul');
    if (!nav || !list) return;

    // Ensure list has an id for aria-controls
    if (!list.id) list.id = 'site-navlist';
    nav.setAttribute('data-collapsible', '');

    // Create the toggle button (insert before the list)
    const btn = document.createElement('button');
    btn.id = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-controls', list.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="bars" aria-hidden="true"></span><span>Menu</span>';

    nav.insertBefore(btn, list);

    // Toggle logic
    const setExpanded = (expanded) => {
      btn.setAttribute('aria-expanded', String(expanded));
      nav.setAttribute('data-expanded', String(expanded));
    };

    btn.addEventListener('click', () => {
      const next = btn.getAttribute('aria-expanded') !== 'true';
      setExpanded(next);
    });

    // Close on Escape when focus is inside nav
    nav.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setExpanded(false);
    });

    // Click outside to close (if open)
    document.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (!expanded) return;
      if (!nav.contains(e.target)) setExpanded(false);
    });
  }

  /**
   * Theme switcher with localStorage persistence.
   * - Respects system preference (prefers-color-scheme) until user chooses.
   */
  function initThemeToggle() {
    const header = document.querySelector('header') || document.body;

    // Build button
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');

    const sun = '☀️';
    const moon = '🌙';

    // Helpers
    const applyTheme = (theme /* 'dark' | 'light' | null */) => {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = `${sun} Light mode`;
      } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = `${moon} Dark mode`;
      } else {
        // No explicit theme; remove attribute to allow prefers-color-scheme CSS
        document.documentElement.removeAttribute('data-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        btn.setAttribute('aria-pressed', prefersDark ? 'true' : 'false');
        btn.textContent = prefersDark ? `${sun} Light mode` : `${moon} Dark mode`;
      }
    };

    // Initial from localStorage
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved !== 'dark' && saved !== 'light') saved = null;
    applyTheme(saved);

    // Listen for system changes only if no explicit choice
    if (!saved && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', () => applyTheme(null));
    }

    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.hasAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next);
    });

    // Mount button into header (before nav if possible)
    const nav = document.querySelector('nav');
    if (nav && nav.parentNode === header) {
      header.insertBefore(btn, nav);
    } else {
      header.appendChild(btn);
    }
  }

  /**
   * Projects page controls
   * - Search by title/description
   * - Filter by category via buttons
   * - Sort by year/title
   * - Toggle project details disclosure per card
   */
  function initProjectControls() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return; // Only on projects.html

    const cards = Array.from(grid.querySelectorAll('.project-card'));

    const search = document.querySelector('#project-search');
    const sort = document.querySelector('#project-sort');
    const filterGroup = document.querySelector('.filter-group');
    const countEl = document.querySelector('#project-count');

    function normalize(s){ return (s||'').toString().toLowerCase(); }

    function apply() {
      const q = normalize(search && search.value);
      const activeBtn = filterGroup && filterGroup.querySelector('[aria-pressed="true"]');
      const category = activeBtn ? activeBtn.dataset.category : 'all';
      const sortVal = sort ? sort.value : 'recent';

      let visible = cards.slice();

      // Filter by search
      if (q) {
        visible = visible.filter(card => {
          const text = normalize(card.dataset.title + ' ' + card.dataset.desc);
          return text.includes(q);
        });
      }

      // Filter by category
      if (category && category !== 'all') {
        visible = visible.filter(card => (card.dataset.category || '').split(',').map(normalize).includes(category));
      }

      // Sort
      const byTitle = (a,b) => a.dataset.title.localeCompare(b.dataset.title);
      const byYearDesc = (a,b) => parseInt(b.dataset.year||'0') - parseInt(a.dataset.year||'0');
      if (sortVal === 'az') visible.sort(byTitle);
      else visible.sort(byYearDesc);

      // Apply visibility
      cards.forEach(c => c.hidden = true);
      visible.forEach(c => c.hidden = false);

      if (countEl) countEl.textContent = `${visible.length} project${visible.length===1?'':'s'} shown`;
    }

    // Wire up controls
    if (search) search.addEventListener('input', apply);
    if (sort) sort.addEventListener('change', apply);
    if (filterGroup) {
      filterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('button.filter-btn');
        if (!btn) return;
        for (const b of filterGroup.querySelectorAll('button.filter-btn')) b.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-pressed', 'true');
        apply();
      });
    }

    // Details toggles
    grid.addEventListener('click', (e) => {
      const t = e.target.closest('.details-toggle');
      if (!t) return;
      const details = t.parentElement.querySelector('.project-details');
      const expanded = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!expanded));
      if (details) details.hidden = expanded; // hide if already expanded
    });

    // Initial render
    apply();
  }
})();
