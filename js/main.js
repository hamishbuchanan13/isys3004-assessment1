(function setupNav() {
  const nav = document.querySelector('nav[data-collapsible]');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.id = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'primary-nav-list');
  btn.innerHTML = '<span class="bars" aria-hidden="true"></span><span>Menu</span>';

  const list = nav.querySelector('ul');
  if (list && !list.id) list.id = 'primary-nav-list';

  nav.prepend(btn);

  btn.addEventListener('click', () => {
    const expanded = nav.getAttribute('data-expanded') === 'true';
    nav.setAttribute('data-expanded', String(!expanded));
    btn.setAttribute('aria-expanded', String(!expanded));
  });
})();

(function setupTheme() {
  const root = document.documentElement;

  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.type = 'button';
  themeBtn.setAttribute('aria-pressed', 'false');
  themeBtn.textContent = 'Toggle theme';

  const nav = document.querySelector('nav');
  if (nav) nav.prepend(themeBtn); else document.body.prepend(themeBtn);

  const saved = localStorage.getItem('theme');
  if (saved === 'dark') root.setAttribute('data-theme', 'dark');

  const updatePressed = () => {
    themeBtn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
  };
  updatePressed();

  themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updatePressed();
  });
})();

(function setupProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const countEl = document.getElementById('project-count');
  const searchInput = document.getElementById('project-search');
  const sortSelect = document.getElementById('project-sort');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

  function normalize(s) { return (s || '').toLowerCase().trim(); }

  function matchesFilter(card, activeCat) {
    if (activeCat === 'all') return true;
    const cats = (card.dataset.category || '').split(',').map(c => c.trim().toLowerCase());
    return cats.includes(activeCat);
  }

  function applyControls() {
    const query = normalize(searchInput?.value);
    const activeBtn = filterBtns.find(b => b.getAttribute('aria-pressed') === 'true') || null;
    const activeCat = activeBtn ? activeBtn.dataset.category : 'all';
    const sort = sortSelect?.value || 'recent';

    const filtered = cards.filter(card => {
      const title = normalize(card.dataset.title);
      const desc = normalize(card.dataset.desc);
      const inText = title.includes(query) || desc.includes(query);
      return inText && matchesFilter(card, activeCat);
    });

    filtered.sort((a, b) => {
      if (sort === 'az') {
        return normalize(a.dataset.title).localeCompare(normalize(b.dataset.title));
      }
      return (parseInt(b.dataset.year, 10) || 0) - (parseInt(a.dataset.year, 10) || 0);
    });

    cards.forEach(c => (c.hidden = true));
    filtered.forEach(c => (c.hidden = false));
    filtered.forEach(c => grid.appendChild(c)); 

    if (countEl) {
      const txt = `${filtered.length} project${filtered.length === 1 ? '' : 's'} shown`;
      countEl.textContent = txt;
    }
  }

  searchInput?.addEventListener('input', applyControls);
  sortSelect?.addEventListener('change', applyControls);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      applyControls();
    });
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.details-toggle');
    if (!btn) return;
    const details = btn.parentElement.querySelector('.project-details');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    details.hidden = expanded;
  });

  applyControls();
})();
