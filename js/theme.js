// =====================================================
// SmartChat — Theme Toggle (Modo oscuro/claro)
// js/theme.js
// =====================================================

(function () {
  const THEME_KEY = 'sc_theme';

  // Aplicar tema al cargar (antes del render para evitar flash)
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  // Cuando el DOM esté listo, configurar los botones
  document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggles();
  });

  function setupThemeToggles() {
    const toggles = document.querySelectorAll(
      '.theme-toggle, .theme-toggle-login, .topbar-icon-btn[data-action="theme"]'
    );
    toggles.forEach(btn => {
      updateIcon(btn);
      btn.addEventListener('click', toggle);
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    // Actualizar todos los íconos
    document.querySelectorAll(
      '.theme-toggle, .theme-toggle-login, .topbar-icon-btn[data-action="theme"]'
    ).forEach(btn => updateIcon(btn));
  }

  function updateIcon(btn) {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
  }

  // Exponer para uso externo
  window.SmartTheme = { toggle, getTheme: () => localStorage.getItem(THEME_KEY) || 'light' };
})();
