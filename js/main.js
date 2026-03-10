(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initThemeToggle();
    initProjectControls();
  });

  function initNavToggle() {
    const nav = document.querySelector('nav');
    const list = nav && nav.querySelector('ul');
    if (!nav || !list) return;

    if (!list.id) list.id = 'site-navlist';
    nav.setAttribute('data-collapsible', '');

    const btn = document.createElement('button');
    btn.id = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-controls', list.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="bars" aria-hidden="true"></span><span>Menu</span>';

    nav.insertBefore(btn, list);

    const setExpanded = (expanded) => {
      btn.setAttribute('aria-expanded', String(expanded));
      nav.setAttribute('data-expanded', String(expanded));
    };

    btn.addEventListener('click', () => {
      const next = btn.getAttribute('aria-expanded') !== 'true';
      setExpanded(next);
    });

    nav.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setExpanded(false);
    });

    document.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (!expanded) return;
      if (!nav.contains(e.target)) setExpanded(false);
    });
  }

  function initThemeToggle() {
    const header = document.querySelector('header') || document.body;

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');

    const sun = '☀️';
    const moon = '🌙';

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = `${sun} Light mode`;
      } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = `${moon} Dark mode`;
      } else {
        document.documentElement.removeAttribute('data-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        btn.setAttribute('aria-pressed', prefersDark ? 'true' : 'false');
        btn.textContent = prefersDark ? `${sun} Light mode` : `${moon} Dark mode`;
      }
    };

    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved !== 'dark' && saved !== 'light') saved = null;
    applyTheme(saved);

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

    const nav = document.querySelector('nav');
    if (nav && nav.parentNode === header) {
      header.insertBefore(btn, nav);
    } else {
      header.appendChild(btn);
    }
  }

  function initProjectControls() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

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

      if (q) {
        visible = visible.filter(card => {
          const text = normalize(card.dataset.title + ' ' + card.dataset.desc);
          return text.includes(q);
        });
      }

      if (category && category !== 'all') {
        visible = visible.filter(card => (card.dataset.category || '').split(',').map(normalize).includes(category));
      }

      const byTitle = (a,b) => a.dataset.title.localeCompare(b.dataset.title);
      const byYearDesc = (a,b) => parseInt(b.dataset.year||'0') - parseInt(a.dataset.year||'0');
      if (sortVal === 'az') visible.sort(byTitle);
      else visible.sort(byYearDesc);

      cards.forEach(c => c.hidden = true);
      visible.forEach(c => c.hidden = false);

      if (countEl) countEl.textContent = `${visible.length} project${visible.length===1?'':'s'} shown`;
    }

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

    grid.addEventListener('click', (e) => {
      const t = e.target.closest('.details-toggle');
      if (!t) return;
      const details = t.parentElement.querySelector('.project-details');
      const expanded = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!expanded));
      if (details) details.hidden = expanded; 
    });

    apply();
  }
})();
