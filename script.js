/* TaskFlow AI — landing page interactions */
(function () {
  'use strict';

  /* ===== Navbar scroll state ===== */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== Mobile menu ===== */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const actions = document.querySelector('.nav__actions');

  const setMenu = (open) => {
    toggle.classList.toggle('open', open);
    links.classList.toggle('open', open);
    if (actions) actions.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(!toggle.classList.contains('open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ===== Pricing toggle ===== */
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyLabel = document.getElementById('toggleMonthly');
  const annualLabel = document.getElementById('toggleAnnual');
  const amounts = document.querySelectorAll('.plan__amount');

  const updatePricing = (annual) => {
    pricingToggle.setAttribute('aria-checked', String(annual));
    monthlyLabel.style.color = annual ? 'var(--text-3)' : 'var(--text)';
    annualLabel.style.color = annual ? 'var(--text)' : 'var(--text-3)';
    amounts.forEach((el) => {
      const target = annual ? el.dataset.annual : el.dataset.monthly;
      animateNumber(el, parseInt(el.textContent, 10) || 0, parseInt(target, 10), 500);
    });
  };

  pricingToggle.addEventListener('click', () => {
    updatePricing(pricingToggle.getAttribute('aria-checked') !== 'true');
  });
  updatePricing(false);

  /* ===== Number animation helper ===== */
  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ===== Scroll reveal ===== */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ===== Animated stat counters ===== */
  const stats = document.querySelectorAll('.stat__num');
  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.dataset.count, 10) || 0;
          animateNumber(el, 0, target, 1600);
          statObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((el) => statObserver.observe(el));
  } else {
    stats.forEach((el) => (el.textContent = (parseInt(el.dataset.count, 10) || 0).toLocaleString()));
  }

  /* ===== Smooth anchor scroll with navbar offset ===== */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
