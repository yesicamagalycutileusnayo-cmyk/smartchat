// =====================================================
// SmartChat — Dashboard Logic
// js/dashboard.js
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  // Proteger ruta
  if (!AUTH.requireAuth()) return;

  loadUserInfo();
  initClock();
  initSidebar();
  initStats();
  animateCards();
});

// ── Cargar info de usuario ────────────────────────────
function loadUserInfo() {
  const session = AUTH.getSession();
  if (!session) return;

  // Nombre de bienvenida
  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName) welcomeName.textContent = session.name || 'Usuario';

  // Topbar user name
  const topbarUser = document.getElementById('topbarUserName');
  if (topbarUser) topbarUser.textContent = session.name || session.email;

  // Sidebar user info
  const sideUser = document.getElementById('sidebarUserName');
  if (sideUser) sideUser.textContent = session.name || session.email;

  const sideEmail = document.getElementById('sidebarUserEmail');
  if (sideEmail) sideEmail.textContent = session.email;

  // Avatar inicial
  const avatarEls = document.querySelectorAll('.user-avatar-letter');
  avatarEls.forEach(el => {
    el.textContent = (session.name || session.email)[0].toUpperCase();
  });
}

// ── Reloj en vivo ─────────────────────────────────────
function initClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  update();
  setInterval(update, 1000);
}

// ── Sidebar móvil ─────────────────────────────────────
function initSidebar() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => openSidebar());
  overlay?.addEventListener('click', () => closeSidebar());

  function openSidebar() {
    sidebar.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Cerrar en links móvil
  sidebar.querySelectorAll('.sidebar-link').forEach(l => {
    l.addEventListener('click', () => {
      if (window.innerWidth < 900) closeSidebar();
    });
  });
}

// ── Animar tarjetas de estadísticas ───────────────────
function initStats() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const end    = parseFloat(el.dataset.count);
    const dur    = 1500;
    const suffix = el.dataset.suffix || '';
    const step   = 16;
    const inc    = end / (dur / step);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + inc, end);
      el.textContent = (Number.isInteger(end) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
      if (cur >= end) clearInterval(timer);
    }, step);
  });
}

// ── Animar cards con delay ────────────────────────────
function animateCards() {
  const cards = document.querySelectorAll('.stat-card, .card, .chat-cta-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
}

// AUTH debe estar disponible (incluir auth.js antes de dashboard.js)
// Logout button
document.addEventListener('click', e => {
  if (e.target.closest('#logoutBtn')) {
    AUTH.logout();
  }
});
