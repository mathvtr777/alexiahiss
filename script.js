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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(items).indexOf(entry.target);
        const delay = (idx % 2) * 120;
        setTimeout(() => entry.target.classList.add('is-revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  items.forEach(item => observer.observe(item));
}

initResultadosReveal();


/* ── Modal de Casos por Procedimento ── */
const procedimentos = [
  {
    nome: 'Toxina Botulínica',
    slides: [
      { tipo: 'foto', src: 'fotos/toxina botulínica/1.jpeg' },
      { tipo: 'foto', src: 'fotos/toxina botulínica/2.jpeg' }
    ],
    whats: 'Olá! Tenho interesse em: Toxina Botulínica'
  },
  {
    nome: 'Harmonização Full Face',
    slides: [
      {
        tipo: 'caso-especial',
        foto: 'fotos/full.jpeg',
        texto: `Um FULL FACE vai muito além de um único ponto… é sobre olhar o rosto como um todo ✨

Neste caso, realizamos um planejamento completo, respeitando a anatomia e a essência da paciente:

▫️ Rinomodelação (nariz)
▫️ Estruturação de pré-maxila e maxila
▫️ Preenchimento labial
▫️ Definição de mandíbula
▫️ Projeção de queixo

O resultado não é sobre mudança, e sim sobre equilíbrio, sustentação e rejuvenescimento de forma natural. Cada detalhe foi pensado para harmonizar o conjunto, trazendo mais leveza, proporção e elegância ao rosto.

Porque no full face, o segredo está na técnica… mas principalmente no olhar.`
      }
    ],
    whats: 'Olá! Tenho interesse em: Harmonização Full Face'
  },
  {
    nome: 'Perfiloplastia',
    slides: [
      { tipo: 'foto', src: 'fotos/Perfiloplastia/1.jpeg' },
      { tipo: 'foto', src: 'fotos/Perfiloplastia/2.jpeg' },
      { tipo: 'foto', src: 'fotos/Perfiloplastia/3.jpeg' },
      { tipo: 'foto', src: 'fotos/perfi1.jpeg' }
    ],
    whats: 'Olá! Tenho interesse em: Perfiloplastia'
  },
  {
    nome: 'Otomodelação',
    slides: [
      { tipo: 'foto', src: 'fotos/r7.jpeg' },
      { tipo: 'foto', src: 'fotos/correta.jpeg' },
      { tipo: 'foto', src: 'fotos/r6.jpeg' }
    ],
    whats: 'Olá! Tenho interesse em: Otomodelação'
  },
  {
    nome: 'Rejuvenescimento Facial',
    slides: [
      { tipo: 'foto', src: 'fotos/Rejuvenescimento Facial/1.jpeg' },
      { tipo: 'foto', src: 'fotos/Rejuvenescimento Facial/2.jpeg' },
      { tipo: 'foto', src: 'fotos/Rejuvenescimento Facial/3.jpeg' },
      { tipo: 'foto', src: 'fotos/Rejuvenescimento Facial/4.jpeg' }
    ],
    whats: 'Olá! Tenho interesse em: Rejuvenescimento Facial'
  },
  {
    nome: 'Rinomodelação',
    slides: [
      { tipo: 'foto', src: 'fotos/rino1.jpeg' },
      { tipo: 'foto', src: 'fotos/rino2.jpeg' },
      { tipo: 'foto', src: 'fotos/rino3.jpeg' }
    ],
    whats: 'Olá! Tenho interesse em: Rinomodelação'
  },
  {
    nome: 'Preenchimento Labial',
    slides: [
      { tipo: 'foto', src: 'fotos/preenchimento labial/WhatsApp Image 2026-03-19 at 09.09.37.jpeg' },
      { tipo: 'foto', src: 'fotos/preenchimento labial/WhatsApp Image 2026-03-19 at 09.09.38.jpeg' },
      { tipo: 'foto', src: 'fotos/preenchimento labial/WhatsApp Image 2026-03-19 at 09.09.38 (1).jpeg' },
      { tipo: 'foto', src: 'fotos/preenchimento labial/WhatsApp Image 2026-03-19 at 09.09.38 (2).jpeg' }
    ],
    whats: 'Olá! Tenho interesse em: Preenchimento Labial'
  }
];

let currentSlide = 0;

function abrirModal(index) {
  const proc = procedimentos[index];
  const modal = document.getElementById('casosModal');
  const track = document.getElementById('casosTrack');
  const dots = document.getElementById('casosDots');
  const titulo = document.getElementById('modalTitulo');
  const whats = document.getElementById('casosWhats');

  titulo.textContent = proc.nome;
  whats.href = `https://wa.me/5584991766006?text=${encodeURIComponent(proc.whats)}`;

  track.innerHTML = proc.slides.map(slide => {
    if (slide.tipo === 'caso-especial') {
      return `
        <div class="casos-slide casos-slide-especial">
          <img src="${slide.foto}" alt="${proc.nome}" loading="lazy">
          <div class="casos-slide-texto">
            <p>${slide.texto.replace(/\n/g, '<br>')}</p>
          </div>
        </div>`;
    }
    return `<div class="casos-slide"><img src="${slide.src}" alt="${proc.nome}" loading="lazy"></div>`;
  }).join('');

  dots.innerHTML = proc.slides.map((_, i) =>
    `<div class="casos-dot ${i === 0 ? 'active' : ''}" onclick="irParaSlide(${i})"></div>`
  ).join('');

  currentSlide = 0;
  track.style.transform = 'translateX(0)';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('casosModal').classList.remove('open');
  document.body.style.overflow = '';
}

function abrirTodos() {
  const modal = document.getElementById('todosModal');
  const grid = document.getElementById('todosGrid');

  grid.innerHTML = procedimentos.map(proc => {
    const fotos = proc.slides
      .filter(s => s.tipo === 'foto' || s.tipo === 'caso-especial')
      .map(s => {
        const src = s.tipo === 'caso-especial' ? s.foto : s.src;
        return `
          <div class="todos-foto-item">
            <img src="${src}" alt="${proc.nome}" loading="lazy">
            <span class="todos-foto-label">${proc.nome}</span>
          </div>`;
      }).join('');

    return `
      <div class="todos-categoria">
        <div class="todos-categoria-titulo">${proc.nome}</div>
        <div class="todos-fotos-grid">${fotos}</div>
      </div>`;
  }).join('');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharTodos() {
  document.getElementById('todosModal').classList.remove('open');
  document.body.style.overflow = '';
}

function navCarrossel(dir) {
  const track = document.getElementById('casosTrack');
  const slides = track.querySelectorAll('.casos-slide');
  const dots = document.querySelectorAll('.casos-dot');
  currentSlide = Math.max(0, Math.min(slides.length - 1, currentSlide + dir));
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function irParaSlide(index) {
  const track = document.getElementById('casosTrack');
  const dots = document.querySelectorAll('.casos-dot');
  currentSlide = index;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fecharModal();
});
