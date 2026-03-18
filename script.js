/* ================================================
   DRA. ALEXIA HISSA — script.js
   ================================================ */

'use strict';

/* ── Navbar: scroll shadow ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Navbar: hamburger / drawer ── */
(function initDrawer() {
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');
  const closeBtn  = document.getElementById('drawerClose');
  if (!hamburger || !drawer) return;

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  // Fechar ao clicar em link do drawer
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();


/* ── Smooth scroll para âncoras ── */
(function initSmoothScroll() {
  const navbarH = 68;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── Comparador Antes/Depois ── */
function initComparators() {
  document.querySelectorAll('.comparator').forEach(comp => {
    const handle   = comp.querySelector('.comp-handle');
    const afterWrap = comp.querySelector('.comp-after-wrap');
    if (!handle || !afterWrap) return;

    let dragging = false;

    function move(clientX) {
      const rect = comp.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      afterWrap.style.width = pct + '%';
      handle.style.left     = pct + '%';
    }

    // Mouse
    handle.addEventListener('mousedown', e => {
      dragging = true;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (dragging) move(e.clientX);
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    // Touch
    handle.addEventListener('touchstart', e => {
      dragging = true;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      if (dragging) move(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener('touchend', () => { dragging = false; });
  });
}

initComparators();




/* ── Scroll horizontal por scroll vertical (Procedimentos) ── */
function initProcedimentosScroll() {
  const section = document.querySelector('.procedimentos-scroll-section');
  const track   = document.querySelector('.procedimentos-track');
  const fill    = document.querySelector('.proc-progress-fill');
  const atual   = document.querySelector('.proc-counter-atual');
  const cards   = document.querySelectorAll('.proc-card');

  if (!section || !track) return;

  window.addEventListener('scroll', () => {
    const rect           = section.getBoundingClientRect();
    const scrollDistance = track.scrollWidth - window.innerWidth + 80;

    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
      const progress = Math.min(1, Math.max(0, -rect.top / (section.offsetHeight - window.innerHeight)));
      track.style.transform = `translateX(-${progress * scrollDistance}px)`;
      if (fill)  fill.style.width = (progress * 100) + '%';
      if (atual) {
        const index = Math.min(cards.length - 1, Math.floor(progress * cards.length));
        atual.textContent = String(index + 1).padStart(2, '0');
      }
    }
  }, { passive: true });
}

initProcedimentosScroll();


/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── Linhas douradas animadas nos separadores ── */
(function initSepLines() {
  const lines = document.querySelectorAll('.sep-linha');
  if (!lines.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'lineGrow 0.7s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  lines.forEach(line => {
    line.style.transform = 'scaleX(0)';
    line.style.transformOrigin = line.closest('.sep-content-center') ? 'center' : 'left';
    observer.observe(line);
  });
})();


/* ── Active nav link por seção ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], .cta-final[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .drawer-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ── Resultados — reveal por scroll (efeito raspar) ── */
function initResultadosReveal() {
  const items = document.querySelectorAll('.reveal-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = (Array.from(items).indexOf(entry.target) % 2) * 120;
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -60px 0px'
  });

  items.forEach(item => observer.observe(item));
}

initResultadosReveal();
