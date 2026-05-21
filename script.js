<!-- ══════════════════════════════════════════
       JAVASCRIPT
  ══════════════════════════════════════════ -->
  <script>
  
           
    ─────────────────────────────────────────── */
   
    const SYSTEM_PROMPT = `You are Bliss AI, a warm and empathetic wellness chatbot for Team Bliss — a project focused on digital safety and empowerment for women. 
Your role:
- Provide emotional support and mental wellness guidance
- Share tips on online safety, cyberbullying prevention, and staying safe digitally
- Empower users with confidence and positivity
- Be concise (2–4 sentences per reply) and friendly
- If someone seems in crisis, gently suggest professional help
- Never give medical diagnoses or legal advice`;

    /* ─── CANVAS BACKGROUND ─────────────────── */
    (function initCanvas() {
      const canvas = document.getElementById('bg-canvas');
      const ctx    = canvas.getContext('2d');
      let W, H, stars = [];

      function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      // Create star particles
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * 9999,
          y: Math.random() * 9999,
          r: Math.random() * 1.4 + .2,
          a: Math.random(),
          da: (Math.random() - .5) * .003,
          dx: (Math.random() - .5) * .12,
          dy: (Math.random() - .5) * .12,
        });
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
          s.x = ((s.x + s.dx) % W + W) % W;
          s.y = ((s.y + s.dy) % H + H) % H;
          s.a = Math.max(.05, Math.min(.8, s.a + s.da));
          if (Math.random() < .01) s.da *= -1;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252,211,77,${s.a})`;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    })();

    /* ─── HERO PARTICLES ─────────────────────── */
    (function initHeroParticles() {
      const container = document.getElementById('hero-particles');
      if (!container) return;
      for (let i = 0; i < 22; i++) {
        const s = document.createElement('span');
        const dur = (Math.random() * 10 + 6).toFixed(1) + 's';
        const del = (Math.random() * 8).toFixed(1) + 's';
        s.style.cssText = `
          left:${Math.random()*100}%;
          --dur:${dur};
          --del:${del};
        `;
        container.appendChild(s);
      }
    })();

    /* ─── HEADER SCROLL ──────────────────────── */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ─── MOBILE NAV ─────────────────────────── */
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

    /* ─── SMOOTH SCROLL ──────────────────────── */
    document.querySelectorAll('a[href^="#"], .mob-link').forEach(link => {
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

    /* ─── SCROLL REVEAL (IntersectionObserver) ── */
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

    /* ─── CHATBOT ─────────────────────────────── */
    const chatToggle  = document.getElementById('chat-toggle');
    const chatWindow  = document.getElementById('chat-window');
    const chatCloseBtn= document.getElementById('chat-close-btn');
    const chatInput   = document.getElementById('chat-input');
    const chatSend    = document.getElementById('chat-send');
    const chatMessages= document.getElementById('chat-messages');

    let conversationHistory = [];
    let isTyping = false;

    function openChat() {
      chatWindow.classList.add('open');
      if (chatMessages.children.length === 0) {
        addMessage('bot', "Hi! 👋 I'm Bliss AI — your personal wellness & safety assistant. How are you feeling today? I'm here to listen and help. 💛");
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

    function addMessage(role, text) {
      const div = document.createElement('div');
      div.className = `msg ${role}`;
      div.textContent = text;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

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

    async function sendMessage() {
      const text = chatInput.value.trim();
      if (!text || isTyping) return;

      chatInput.value = '';
      addMessage('user', text);
      conversationHistory.push({ role: 'user', content: text });

      isTyping = true;
      showTyping();

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...conversationHistory
            ],
            max_tokens: 200,
            temperature: 0.8
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data  = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || "I'm here for you. Could you tell me more?";

        conversationHistory.push({ role: 'assistant', content: reply });
        hideTyping();
        addMessage('bot', reply);

      } catch (err) {
        hideTyping();
        console.error('Chat error:', err);
        addMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again in a moment. 💛");
      }

      isTyping = false;
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log('%cTeam Bliss 🚀', 'color:#fcd34d;font-size:1.2rem;font-weight:bold;');
  </script>
