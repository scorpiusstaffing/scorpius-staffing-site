/* Scorpius Staffing — minimal scroll reveal */
(function () {
  'use strict';

  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    requestAnimationFrame(() => heroHeadline.classList.add('is-visible'));
  }

  // Smooth anchor scroll (offset for sticky nav)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id === '#top') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
