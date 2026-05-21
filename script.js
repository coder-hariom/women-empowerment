/* ════════════════════════════════════════════
   ANIMATED STAR BACKGROUND — Canvas
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
      ctx.fillStyle = 'rgba(252,211,77,' + s.a + ')';
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
    span.style.cssText =
      'left:' + Math.random() * 100 + '%;' +
      '--dur:' + (Math.random() * 10 + 6).toFixed(1) + 's;' +
      '--del:' + (Math.random() * 8).toFixed(1) + 's;';
    container.appendChild(span);
  }
})();


/* ════════════════════════════════════════════
   HEADER — Shrink on scroll
════════════════════════════════════════════ */
const mainHeader = document.getElementById('main-header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
}, { passive: true });


/* ════════════════════════════════════════════
   MOBILE NAV — Hamburger toggle
════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const closeNav  = document.getElementById('close-nav');

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

closeNav.addEventListener('click', function () {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
});

document.querySelectorAll('.mob-link').forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});


/* ════════════════════════════════════════════
   SMOOTH SCROLL — All anchor links
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
════════════════════════════════════════════ */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .stagger-children').forEach(function (el) {
  revealObserver.observe(el);
});


/* ════════════════════════════════════════════
   AI CHATBOT — Chatbase iframe toggle
════════════════════════════════════════════ */
var chatToggleBtn = document.getElementById('chat-toggle');
var chatWin       = document.getElementById('chat-window');
var chatCloseBtn  = document.getElementById('chat-close-btn');

/* Open chat window */
function openChat() {
  chatWin.classList.add('open');
}

/* Close chat window */
function closeChat() {
  chatWin.classList.remove('open');
}

/* Toggle on button click */
chatToggleBtn.addEventListener('click', function () {
  if (chatWin.classList.contains('open')) {
    closeChat();
  } else {
    openChat();
  }
});

/* Close on X button */
chatCloseBtn.addEventListener('click', function () {
  closeChat();
});

/* Close when clicking outside the chat window on mobile */
document.addEventListener('click', function (e) {
  if (
    chatWin.classList.contains('open') &&
    !chatWin.contains(e.target) &&
    !chatToggleBtn.contains(e.target)
  ) {
    closeChat();
  }
});

/* Close on Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && chatWin.classList.contains('open')) {
    closeChat();
  }
});

console.log('%cTeam Bliss loaded!', 'color:#fcd34d;font-size:1.1rem;font-weight:bold;');
