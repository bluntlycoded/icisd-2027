(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Year in footer */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Header: solid background once the hero is scrolled past */
  const header = $('.site-header');
  const hero = $('.hero');
  const setHeader = () => header.classList.toggle('is-solid', window.scrollY > (hero ? hero.offsetHeight - 120 : 40));
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  /* Mobile menu */
  const toggle = $('.menu-toggle');
  const nav = $('#nav');
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* Countdown */
  const cd = $('.countdown');
  if (cd) {
    const target = new Date(cd.dataset.target).getTime();
    const units = { days: 864e5, hours: 36e5, minutes: 6e4, seconds: 1e3 };
    const out = Object.fromEntries(Object.keys(units).map(k => [k, $(`[data-unit="${k}"]`, cd)]));
    const label = $('.countdown-label');
    const tick = () => {
      let diff = target - Date.now();
      if (diff <= 0) {
        const end = target + 2 * 864e5;
        label.textContent = Date.now() < end ? 'The conference is live' : 'Thank you for joining ICISD’27';
        Object.values(out).forEach(el => (el.textContent = '00'));
        return false;
      }
      for (const [k, ms] of Object.entries(units)) {
        const v = Math.floor(diff / ms);
        diff -= v * ms;
        out[k].textContent = String(v).padStart(2, '0');
      }
      return true;
    };
    if (tick()) {
      const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000);
    }
  }

  /* Timeline: mark past milestones and the next one; show next deadline in hero */
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let next = null;
  $$('.timeline li').forEach(li => {
    const d = new Date(li.dataset.date + 'T23:59:59+05:30');
    if (d < today) li.classList.add('is-past');
    else if (!next) { next = li; li.classList.add('is-next'); }
  });
  const nd = $('#next-deadline');
  if (nd && next) {
    const days = Math.ceil((new Date(next.dataset.date + 'T23:59:59+05:30') - Date.now()) / 864e5);
    const what = $('h3', next).textContent;
    if (!/conference/i.test(what)) {
      nd.innerHTML = `Next: <strong>${what}</strong> — ${$('time', next).textContent}` + (days > 0 ? ` (${days} day${days === 1 ? '' : 's'})` : ' (today)');
    }
  }

  /* Active nav link */
  const links = $$('.nav a[href^="#"]');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));

    /* Reveal on scroll */
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
  }
})();
