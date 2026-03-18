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


/* ── Dados dos procedimentos (para o modal) ── */
const PROCEDIMENTOS = [
  {
    nome:   'Toxina Botulínica (Botox)',
    antes:  'fotos/p01-antes.jpg',
    depois: 'fotos/p01-depois.jpg',
    desc:   'Aplicação precisa de toxina botulínica para relaxar músculos de expressão, suavizando rugas e linhas sem perder a naturalidade do rosto. Resultado delicado que preserva quem você é.'
  },
  {
    nome:   'Harmonização Full Face',
    antes:  'fotos/p02-antes.jpg',
    depois: 'fotos/p02-depois.jpg',
    desc:   'Protocolo completo que combina técnicas injetáveis para reequilibrar proporções, restaurar volumes e revelar a melhor versão do seu rosto — com resultado harmonioso e natural.'
  },
  {
    nome:   'Perfiloplastia',
    antes:  'fotos/p03-antes.jpg',
    depois: 'fotos/p03-depois.jpg',
    desc:   'Correção e refinamento do perfil facial com ácido hialurônico, trabalhando queixo, nariz e mandíbula para criar um contorno mais equilibrado e elegante.'
  },
  {
    nome:   'Otomodelação',
    antes:  'fotos/p04-antes.jpg',
    depois: 'fotos/p04-depois.jpg',
    desc:   'Técnica não cirúrgica que utiliza fios ou moldagem para reposicionar orelhas proeminentes, com resultado sutil e natural, sem cortes ou recuperação prolongada.'
  },
  {
    nome:   'Rejuvenescimento Facial',
    antes:  'fotos/p05-antes.jpg',
    depois: 'fotos/p05-depois.jpg',
    desc:   'Protocolo combinado de técnicas para restaurar firmeza, suavizar sulcos e devolver luminosidade à pele, com abordagem progressiva e resultados naturais.'
  },
  {
    nome:   'Harmonização Orofacial',
    antes:  'fotos/p06-antes.jpg',
    depois: 'fotos/p06-depois.jpg',
    desc:   'Tratamento que harmoniza a região da boca, lábios e sorriso com o restante do rosto, corrigindo assimetrias e realçando a expressão de forma integrada.'
  }
];

/* ── Modal de Procedimento — abrirModal(index) ── */
const modal      = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modal-title');
const modalDesc  = document.getElementById('modal-desc');
const modalComp  = document.getElementById('modalComparator');
const modalCta   = document.getElementById('modal-cta');

// EDITAR: Número do WhatsApp
const WHATSAPP_URL = 'https://wa.me/55XXXXXXXXXXX';

function abrirModal(index) {
  if (!modal) return;
  const p = PROCEDIMENTOS[index];
  if (!p) return;

  if (modalTitle) modalTitle.textContent = p.nome;
  if (modalDesc)  modalDesc.textContent  = p.desc;
  if (modalCta)   modalCta.href = WHATSAPP_URL;

  if (modalComp) {
    modalComp.innerHTML = `
      <div class="comparator" style="height:300px; border-radius:0;">
        <img class="comp-before" src="${p.antes}" alt="Antes — ${p.nome}" loading="lazy"
             onerror="this.src='fotos/hero.png'">
        <div class="comp-after-wrap">
          <img class="comp-after" src="${p.depois}" alt="Depois — ${p.nome}" loading="lazy"
               onerror="this.src='fotos/hero.png'">
        </div>
        <div class="comp-handle"><div class="comp-btn">⟨⟩</div></div>
        <span class="comp-label left">Antes</span>
        <span class="comp-label right">Depois</span>
      </div>`;
    initComparators();
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', fecharModal);
if (modal) {
  modal.addEventListener('click', e => { if (e.target === modal) fecharModal(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });


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
