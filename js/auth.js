// =====================================================
// SmartChat — Auth / Session Management
// js/auth.js
// =====================================================

const AUTH = {
  CREDENTIALS: { email: 'admin@demo.com', password: '1234' },
  STORAGE_KEY: 'sc_session',

  // Guardar sesión
  login(email) {
    const session = {
      loggedIn: true,
      email,
      name: 'Administrador',
      role: 'Admin Demo',
      avatar: 'A',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.href = this._getRoot() + 'login.html';
  },

  // Obtener sesión
  getSession() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  // ¿Está logueado?
  isLoggedIn() {
    const s = this.getSession();
    return s && s.loggedIn === true;
  },

  // Proteger ruta: redirige a login si no hay sesión
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = this._getRoot() + 'login.html';
      return false;
    }
    return true;
  },

  // Ruta raíz relativa
  _getRoot() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../' : './';
  }
};

// ── Lógica de la página de Login ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Si ya está logueado, redirigir al dashboard
  if (AUTH.isLoggedIn() && document.getElementById('loginForm')) {
    window.location.href = 'pages/dashboard.html';
    return;
  }

  const form      = document.getElementById('loginForm');
  const emailInp  = document.getElementById('emailInput');
  const passInp   = document.getElementById('passwordInput');
  const errorBox  = document.getElementById('errorBox');
  const submitBtn = document.getElementById('submitBtn');
  const togglePass= document.getElementById('togglePass');

  if (!form) return;

  // Toggle visibilidad contraseña
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const isText = passInp.type === 'text';
      passInp.type = isText ? 'password' : 'text';
      togglePass.textContent = isText ? '👁️' : '🙈';
    });
  }

  // Autofill demo al hacer clic en el hint
  const demoHint = document.getElementById('demoHint');
  if (demoHint) {
    demoHint.style.cursor = 'pointer';
    demoHint.addEventListener('click', () => {
      emailInp.value = AUTH.CREDENTIALS.email;
      passInp.value  = AUTH.CREDENTIALS.password;
      emailInp.dispatchEvent(new Event('input'));
      passInp.dispatchEvent(new Event('input'));
    });
  }

  // Submit del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email    = emailInp.value.trim();
    const password = passInp.value;

    // Validación básica
    if (!email || !password) {
      showError('Por favor, completa todos los campos.');
      return;
    }
    if (!isValidEmail(email)) {
      showError('Ingresa un correo electrónico válido.');
      return;
    }

    // Simular carga
    setLoading(true);
    await sleep(1200);

    // Verificar credenciales
    if (email === AUTH.CREDENTIALS.email && password === AUTH.CREDENTIALS.password) {
      AUTH.login(email);
      // Animación de éxito
      submitBtn.innerHTML = '✅ ¡Acceso concedido!';
      submitBtn.style.background = '#10B981';
      await sleep(700);
      window.location.href = 'pages/dashboard.html';
    } else {
      setLoading(false);
      showError('Credenciales incorrectas. Usa: admin@demo.com / 1234');
      shake(form);
    }
  });

  // Animación de frases del panel izquierdo
  initPhrases();

  // ── Helpers ──────────────────────────────────────────
  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = '⚠️ ' + msg;
    errorBox.classList.add('visible');
  }
  function clearError() {
    if (errorBox) errorBox.classList.remove('visible');
  }
  function setLoading(state) {
    if (!submitBtn) return;
    submitBtn.disabled = state;
    submitBtn.innerHTML = state
      ? '<div class="spinner"></div> Verificando...'
      : '🚀 Ingresar al Sistema';
  }
  function isValidEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shakeX 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
});

// ── Frases rotativas del panel izquierdo ──────────────
function initPhrases() {
  const items = document.querySelectorAll('.phrase-item');
  if (!items.length) return;
  let i = 0;
  function show(idx) {
    items.forEach((el, j) => {
      el.classList.toggle('visible', j === idx);
    });
  }
  show(0);
  setInterval(() => {
    i = (i + 1) % items.length;
    show(i);
  }, 3500);
}
