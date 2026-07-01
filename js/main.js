/* Dolina Hotel — interactions */
(function () {
  'use strict';

  // Sticky header shade on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav
  const burger = document.querySelector('[data-burger]');
  const mnav = document.querySelector('.mobile-nav');
  const scrim = document.querySelector('.scrim');
  const closeBtn = document.querySelector('[data-nav-close]');
  const setNav = (open) => {
    if (!mnav) return;
    mnav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (burger) burger.addEventListener('click', () => setNav(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setNav(false));
  if (scrim) scrim.addEventListener('click', () => setNav(false));
  if (mnav) mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // Booking form (demo — no backend; opens WhatsApp with prefilled text)
  const form = document.querySelector('[data-book-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      if (!name || !phone) {
        if (status) { status.textContent = 'Заполните имя и телефон — иначе мы не сможем перезвонить.'; status.classList.remove('ok'); }
        return;
      }
      const msg =
        `Здравствуйте! Хочу забронировать номер в Dolina Hotel.%0A` +
        `Имя: ${encodeURIComponent(name)}%0A` +
        `Телефон: ${encodeURIComponent(phone)}%0A` +
        `Заезд: ${encodeURIComponent(data.get('checkin') || '—')}%0A` +
        `Выезд: ${encodeURIComponent(data.get('checkout') || '—')}%0A` +
        `Гостей: ${encodeURIComponent(data.get('guests') || '—')}%0A` +
        `Тип номера: ${encodeURIComponent(data.get('room') || '—')}`;
      if (status) { status.textContent = 'Открываем WhatsApp — отправьте сообщение, и мы подтвердим бронь.'; status.classList.add('ok'); }
      window.open('https://wa.me/79655623100?text=' + msg, '_blank', 'noopener');
    });
  }

  // Footer year
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
