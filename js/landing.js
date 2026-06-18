// =====================================================
// SmartChat — Landing Page Interactions
// js/landing.js
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initHeroParticles();
  initMobileMenu();
  initScrollSpy();
  initTypingEffect();
  initMockChatAnimation();
  initStats();
});

// ── Navbar scroll effect ───────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile menu ────────────────────────────────────────
function initMobileMenu() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Cerrar al hacer clic en un link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll Spy (active nav link) ──────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ── Scroll Reveal ─────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── Hero Particles ─────────────────────────────────────
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 60 + 20;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.12 + 0.03};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * -10}s;
    `;
    container.appendChild(p);
  }
}

// ── Typing / Typewriter effect hero ───────────────────
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const words = ['inteligente', 'empático', 'disponible', 'confidencial'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  setTimeout(type, 1000);
}

// ── Animated Chat Preview ─────────────────────────────
function initMockChatAnimation() {
  const body = document.getElementById('mockChatBody');
  if (!body) return;

  const msgs = [
    { type: 'bot',  text: '¡Hola! Soy SmartChat 👋 ¿Cómo te sientes hoy?' },
    { type: 'user', text: 'Me siento un poco ansioso...' },
    { type: 'bot',  text: 'Entiendo, la ansiedad es difícil. 💙 Respira profundo. ¿Quieres que hablemos?' },
    { type: 'user', text: 'Sí, por favor.' },
    { type: 'bot',  text: 'Estoy aquí para ti, sin juicios. ¿Qué está pasando? 🤗' },
  ];

  let i = 0;
  body.innerHTML = '';

  function addMsg() {
    if (i >= msgs.length) {
      setTimeout(() => { i = 0; body.innerHTML = ''; addMsg(); }, 3000);
      return;
    }
    const m = msgs[i++];
    const row = document.createElement('div');
    row.className = `mock-msg ${m.type}`;
    row.innerHTML = `
      ${m.type === 'bot' ? '<div class="mock-avatar">🤖</div>' : ''}
      <div class="mock-bubble">${m.text}</div>
      ${m.type === 'user' ? '<div class="mock-avatar">😊</div>' : ''}
    `;
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;

    requestAnimationFrame(() => {
      row.style.transition = 'all 0.4s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    });

    setTimeout(addMsg, 1600);
  }
  setTimeout(addMsg, 800);
}

// ── Animated stat counters ─────────────────────────────
function initStats() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseFloat(el.dataset.count);
      const dur   = 1800;
      const step  = 16;
      const inc   = end / (dur / step);
      let cur = 0;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = prefix + (Number.isInteger(end) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
        if (cur >= end) clearInterval(timer);
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ── Smooth scroll for anchor links ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
