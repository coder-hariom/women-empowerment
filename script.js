 
const SYSTEM_PROMPT = `You are Bliss AI, a warm and empathetic wellness chatbot for Team Bliss — a project focused on digital safety and empowerment for women.
Your role:
- Provide emotional support and mental wellness guidance
- Share tips on online safety, cyberbullying prevention, and digital security
- Empower users with confidence and positivity
- Keep replies concise: 2 to 4 sentences max
- If someone seems in distress or crisis, gently suggest professional help
- Never provide medical diagnoses or legal advice
- Always respond in a friendly, caring, supportive tone`;


/* ════════════════════════════════════════════
   ANIMATED STAR BACKGROUND (Canvas)
════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 120; i++) {
    stars.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.4 + 0.2,
      a:  Math.random(),
      da: (Math.random() - 0.5) * 0.003,
      dx: (Math.random() - 0.5) * 0.12,
      dy: (Math.random() - 0.5) * 0.12,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.x = ((s.x + s.dx) % W + W) % W;
      s.y = ((s.y + s.dy) % H + H) % H;
      s.a = Math.max(0.05, Math.min(0.8, s.a + s.da));
      if (Math.random() < 0.01) s.da *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(252,211,77,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ════════════════════════════════════════════
   HERO FLOATING PARTICLES
════════════════════════════════════════════ */
(function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const span = document.createElement('span');
    span.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${(Math.random() * 10 + 6).toFixed(1)}s;
      --del: ${(Math.random() * 8).toFixed(1)}s;
    `;
    container.appendChild(span);
  }
})();


/* ════════════════════════════════════════════
   HEADER — Shrink on scroll
════════════════════════════════════════════ */
const mainHeader = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  mainHeader.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ════════════════════════════════════════════
   MOBILE NAV
════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const closeNav  = document.getElementById('close-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

closeNav.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});


/* ════════════════════════════════════════════
   SMOOTH SCROLL (all anchor links)
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
  revealObserver.observe(el);
});


/* ════════════════════════════════════════════
   AI CHATBOT
════════════════════════════════════════════ */
const chatToggle   = document.getElementById('chat-toggle');
const chatWindow   = document.getElementById('chat-window');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatInput    = document.getElementById('chat-input');
const chatSend     = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

let conversationHistory = [];
let isTyping = false;
let chatOpened = false;

/* Open chat (also called from portfolio "Chat Now" button) */
function openChat() {
  chatWindow.classList.add('open');
  if (!chatOpened) {
    chatOpened = true;
    addBotMessage("Hi! 👋 I'm Bliss AI — your personal wellness & safety assistant. How are you feeling today? I'm here to listen and help. 💛");
  }
  setTimeout(() => chatInput.focus(), 350);
}

function closeChat() {
  chatWindow.classList.remove('open');
}

chatToggle.addEventListener('click', () => {
  chatWindow.classList.contains('open') ? closeChat() : openChat();
});

chatCloseBtn.addEventListener('click', closeChat);

/* Add a bot message bubble */
function addBotMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* Add a user message bubble */
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* Show animated typing indicator */
function showTyping() {
  const el = document.createElement('div');
  el.className = 'typing-dots';
  el.id = 'typing-indicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

/* Main send function */
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || isTyping) return;

  chatInput.value = '';
  addUserMessage(text);
  conversationHistory.push({ role: 'user', content: text });

  isTyping = true;
  showTyping();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 200,
        temperature: 0.8,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory
        ]
      })
    });

    const data = await response.json();
    hideTyping();

    if (!response.ok) {
      /* Show the actual OpenAI error for debugging */
      console.error('OpenAI error:', data);
      const errMsg = data?.error?.message || 'Unknown API error.';
      addBotMessage('⚠️ API Error: ' + errMsg);
      isTyping = false;
      return;
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (reply) {
      conversationHistory.push({ role: 'assistant', content: reply });
      addBotMessage(reply);
    } else {
      addBotMessage("I'm here for you — could you tell me a bit more? 💛");
    }

  } catch (err) {
    hideTyping();
    console.error('Network/fetch error:', err);
    addBotMessage("Sorry, I couldn't connect. Please check your internet and try again. 💛");
  }

  isTyping = false;
}

/* Send on button click */
chatSend.addEventListener('click', sendMessage);

/* Send on Enter key */
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

console.log('%cTeam Bliss 🚀 loaded!', 'color:#fcd34d;font-size:1.1rem;font-weight:bold;');
