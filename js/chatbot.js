// =====================================================
// SmartChat — Chatbot Emocional Simulado
// js/chatbot.js
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!AUTH.requireAuth()) return;

  loadUserInfo();
  initChatbot();
  initSidebar();
  initClock();
});

// ── Base de conocimiento emocional ────────────────────
const KB = [
  {
    keys: ['hola', 'hi', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos'],
    responses: [
      '¡Hola! 👋 Me alegra que estés aquí. Soy SmartChat, tu asistente de apoyo emocional. ¿Cómo te sientes hoy?',
      '¡Bienvenido/a! 🌟 Estoy aquí para escucharte. ¿Qué hay en tu mente en este momento?',
      '¡Hola! Qué bueno verte por aquí. 😊 Cuéntame, ¿cómo ha sido tu día?'
    ]
  },
  {
    keys: ['triste', 'tristeza', 'llorar', 'llorando', 'deprimido', 'depresion', 'mal', 'pena', 'dolor'],
    responses: [
      'Entiendo que estás pasando por un momento difícil. 💙 La tristeza es una emoción válida y necesaria. No estás solo/a. ¿Quieres contarme qué está pasando?',
      'Está bien sentirse triste a veces. 🤗 Permítete sentir esa emoción. Estoy aquí para escucharte sin juzgarte. ¿Qué es lo que más te pesa hoy?',
      'Lamento que no te sientas bien. 💜 Recuerda que después de la tormenta siempre sale el sol. Cuéntame más sobre cómo te sientes.'
    ]
  },
  {
    keys: ['estres', 'estresado', 'estresada', 'agotado', 'agotada', 'cansado', 'cansada', 'abrumado', 'sobrecargado', 'trabajo'],
    responses: [
      'El estrés puede ser muy pesado. 😮‍💨 Antes que nada, toma una respiración profunda. Inhala por 4 segundos... sostén 4... exhala por 6. ¿Qué situación te está generando más tensión?',
      'Entiendo ese agotamiento. 🌿 Es importante que te des permiso de descansar. Tu bienestar importa más que cualquier tarea. ¿Puedes contarme qué está pasando?',
      'Cuando todo se acumula, es muy difícil. 💪 Recuerda: no tienes que resolverlo todo hoy. Vamos paso a paso. ¿Por dónde quieres empezar?'
    ]
  },
  {
    keys: ['ansiedad', 'ansioso', 'ansiosa', 'nervioso', 'nerviosa', 'miedo', 'angustia', 'panico', 'preocupado', 'preocupada'],
    responses: [
      'La ansiedad puede sentirse muy intensa, pero hay técnicas que ayudan. 🌊 Prueba esto: nombra 5 cosas que puedes VER, 4 que puedes TOCAR, 3 que escuchas. ¿Pudiste hacerlo?',
      'Entiendo ese miedo. 🤝 La ansiedad miente y nos hace ver peligros donde no los hay. Recuerda: este momento pasará. ¿Qué es lo que más te preocupa ahora mismo?',
      'Respira conmigo. 💙 La ansiedad es la mente queriendo protegerte, aunque a veces se equivoca. ¿Hay algo específico que te esté generando esta sensación?'
    ]
  },
  {
    keys: ['solo', 'sola', 'soledad', 'aislado', 'aislada', 'nadie', 'abandonado', 'incomprendido'],
    responses: [
      'La soledad duele, y tiene sentido que te sientas así. 🤗 Pero quiero que sepas que en este momento, estoy aquí contigo. ¿Quieres contarme más?',
      'No estás solo/a. 💙 A veces la vida nos pone en situaciones de aislamiento que no elegimos. ¿Hay algo que te haya llevado a sentirte así?',
      'Entiendo ese sentimiento de estar solo/a. 🌟 Pero recuerda: pedir apoyo es un acto de valentía. Cuéntame qué está pasando en tu vida.'
    ]
  },
  {
    keys: ['motivacion', 'motivado', 'animado', 'fuerza', 'energia', 'bien', 'feliz', 'contento', 'alegre', 'excelente'],
    responses: [
      '¡Me alegra mucho escuchar eso! 🌟 Mantén esa energía positiva. ¿Qué es lo que te tiene tan motivado/a hoy?',
      '¡Genial! 🎉 Esa actitud es poderosa. ¿Qué meta o proyecto está impulsando esa motivación?',
      '¡Qué bien! 💪 La energía positiva es contagiosa. Cuéntame más sobre lo que te está haciendo sentir así.'
    ]
  },
  {
    keys: ['gracias', 'thank', 'agradecido', 'agradecida', 'genial', 'excelente respuesta'],
    responses: [
      '¡De nada! 😊 Para eso estoy aquí. ¿Hay algo más en lo que pueda ayudarte?',
      'Me alegra haberte ayudado. 💙 Recuerda que siempre puedes volver cuando lo necesites.',
      '¡Con mucho gusto! 🌟 Tu bienestar es lo más importante. ¿Hay algo más que quieras compartir?'
    ]
  },
  {
    keys: ['ayuda', 'necesito ayuda', 'no se que hacer', 'perdido', 'perdida', 'crisis'],
    responses: [
      'Estoy aquí para ayudarte. 🤝 Primero, respira. Ahora cuéntame: ¿qué está pasando exactamente? Vamos paso a paso.',
      'Entiendo que estás en un momento difícil. 💙 No tienes que enfrentarlo solo/a. Cuéntame qué necesitas y lo trabajaremos juntos.',
      'Tranquilo/a. Estoy aquí. 🌿 A veces solo necesitamos que alguien nos escuche. ¿Qué es lo que más te preocupa en este momento?'
    ]
  },
  {
    keys: ['adios', 'chao', 'hasta luego', 'bye', 'me voy', 'hasta pronto'],
    responses: [
      '¡Hasta pronto! 👋 Recuerda que siempre puedes volver cuando lo necesites. Cuídate mucho. 💙',
      '¡Hasta luego! 🌟 Fue un placer charlar contigo. Que tengas un día maravilloso.',
      '¡Nos vemos! 😊 Recuerda: siempre estoy aquí para ti. ¡Cuídate!'
    ]
  }
];

const DEFAULT_RESPONSES = [
  'Entiendo lo que me comentas. 💙 Cuéntame más, estoy aquí para escucharte sin juzgar.',
  'Gracias por compartir eso conmigo. 🤗 ¿Cómo te hace sentir esa situación?',
  'Aprecio que te abras conmigo. 🌿 Cada emoción que sientes es válida. ¿Qué más hay en tu mente?',
  'Estoy aquí para ti. 💜 A veces poner en palabras lo que sentimos ya ayuda. ¿Quieres seguir contándome?',
  'Te escucho. 😊 ¿Hay algo específico de lo que te gustaría hablar hoy?'
];

// ── Motor del chatbot ─────────────────────────────────
function getResponse(message) {
  const lower = message.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar tildes

  for (const rule of KB) {
    if (rule.keys.some(k => lower.includes(k))) {
      return rule.responses[Math.floor(Math.random() * rule.responses.length)];
    }
  }
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

// ── Chatbot UI ────────────────────────────────────────
let msgCount = 0;
let sessionMsgs = 0;

function initChatbot() {
  const input   = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatBox = document.getElementById('chatMessages');
  if (!input || !sendBtn || !chatBox) return;

  // Mensaje de bienvenida
  setTimeout(() => {
    addMessage('bot', '¡Hola! 👋 Soy SmartChat, tu asistente de apoyo emocional. Estoy aquí para escucharte en cualquier momento. ¿Cómo te sientes hoy?');
  }, 600);

  // Enviar con botón
  sendBtn.addEventListener('click', sendMessage);

  // Enviar con Enter (Shift+Enter = nueva línea)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // Chips de sugerencias
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.msg || chip.textContent;
      input.focus();
      sendMessage();
    });
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Agregar mensaje del usuario
    addMessage('user', text);
    input.value = '';
    input.style.height = 'auto';
    sessionMsgs++;
    updateStats();

    // Mostrar "escribiendo..."
    const typingEl = showTyping();

    // Respuesta del bot con delay
    const delay = Math.random() * 800 + 800;
    setTimeout(() => {
      typingEl.remove();
      const response = getResponse(text);
      addMessage('bot', response);
    }, delay);
  }
}

function addMessage(type, text) {
  const chatBox = document.getElementById('chatMessages');
  if (!chatBox) return;

  msgCount++;
  const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const row = document.createElement('div');
  row.className = `msg-row ${type}`;
  row.id = `msg-${msgCount}`;

  if (type === 'bot') {
    row.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content">
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <div class="msg-time">🕐 ${now}</div>
      </div>`;
  } else {
    row.innerHTML = `
      <div class="msg-content">
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <div class="msg-time">${now} ✓✓</div>
      </div>
      <div class="msg-avatar" style="background:var(--surface-3)">😊</div>`;
  }

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'typing-indicator';
  el.innerHTML = `
    <div class="msg-avatar" style="width:36px;height:36px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:16px;">🤖</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  return el;
}

function updateStats() {
  const el = document.getElementById('sessionMsgCount');
  if (el) el.textContent = sessionMsgs;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

// ── Info de usuario en chatbot ────────────────────────
function loadUserInfo() {
  const session = AUTH.getSession();
  if (!session) return;
  const el = document.getElementById('chatUserName');
  if (el) el.textContent = session.name || session.email;
}

// ── Reloj ─────────────────────────────────────────────
function initClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const upd = () => { el.textContent = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); };
  upd(); setInterval(upd, 1000);
}

// ── Sidebar móvil ─────────────────────────────────────
function initSidebar() {
  const btn  = document.getElementById('mobileMenuBtn');
  const side = document.getElementById('sidebar');
  const ov   = document.getElementById('sidebarOverlay');
  if (!btn || !side) return;
  btn.addEventListener('click', () => { side.classList.add('open'); ov?.classList.add('visible'); });
  ov?.addEventListener('click', () => { side.classList.remove('open'); ov?.classList.remove('visible'); });
}

// Logout
document.addEventListener('click', e => {
  if (e.target.closest('#logoutBtn')) AUTH.logout();
});
