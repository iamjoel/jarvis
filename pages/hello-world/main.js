/* Pure browser JS: canvas background + small interactive UI. */

(() => {
  const root = document.documentElement;
  const body = document.body;
  const fx = /** @type {HTMLCanvasElement} */ (document.getElementById("fx"));
  const ctx = fx.getContext("2d", { alpha: true });
  const clockEl = document.getElementById("clock");
  const seedEl = document.getElementById("seed");
  const typeEl = document.getElementById("type");
  const shuffleBtn = document.getElementById("shuffle");
  const pauseBtn = document.getElementById("pause");
  const copyLink = document.getElementById("copy");
  const toastEl = document.getElementById("toast");
  const rippleEl = document.getElementById("ripple");

  if (!ctx) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  /** @type {{x:number, y:number, nx:number, ny:number, down:boolean}} */
  const pointer = { x: 0, y: 0, nx: 0.5, ny: 0.4, down: false };

  const phrases = [
    "Warm gradients.",
    "A calmer kind of motion.",
    "A sky that listens.",
    "No dependencies.",
    "One file at a time.",
  ];

  const palettes = [
    { a0: [40, 95, 62], a1: [190, 85, 58], a2: [285, 85, 68] },
    { a0: [18, 95, 62], a1: [140, 70, 52], a2: [210, 90, 66] },
    { a0: [60, 92, 58], a1: [310, 82, 66], a2: [195, 80, 56] },
    { a0: [0, 90, 60], a1: [205, 95, 62], a2: [42, 95, 62] },
    { a0: [265, 85, 66], a1: [25, 95, 62], a2: [185, 80, 56] },
  ];

  const state = {
    running: !reduceMotion,
    raf: 0,
    t: 0,
    dpr: 1,
    w: 0,
    h: 0,
    seed: "",
    paletteIdx: 0,
  };

  function hsl([h, s, l], a = 1) {
    return `hsl(${h} ${s}% ${l}% / ${a})`;
  }

  function setPalette(idx, seed) {
    const p = palettes[idx % palettes.length];
    root.style.setProperty("--a0", hsl(p.a0));
    root.style.setProperty("--a1", hsl(p.a1));
    root.style.setProperty("--a2", hsl(p.a2));
    state.paletteIdx = idx % palettes.length;
    state.seed = seed;
    seedEl.textContent = `seed:${seed}`;
  }

  function randSeed() {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.dataset.show = "true";
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      toastEl.dataset.show = "false";
    }, 1100);
  }
  toast._t = 0;

  function formatTime(d) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  function startClock() {
    const tick = () => {
      clockEl.textContent = formatTime(new Date());
    };
    tick();
    window.setInterval(tick, 1000);
  }

  function startType() {
    let phraseIdx = 0;
    let i = 0;
    let dir = 1;
    let hold = 0;

    const step = () => {
      if (!state.running || reduceMotion) {
        typeEl.textContent = phrases[phraseIdx];
        return;
      }

      const p = phrases[phraseIdx];
      if (hold > 0) {
        hold--;
      } else {
        i += dir;
        if (i >= p.length) {
          i = p.length;
          hold = 24;
          dir = -1;
        } else if (i <= 0) {
          i = 0;
          hold = 10;
          dir = 1;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }

      const caret = (Math.floor(performance.now() / 520) % 2) === 0 ? "_" : " ";
      typeEl.textContent = p.slice(0, i) + caret;
    };

    window.setInterval(step, 42);
  }

  function resize() {
    state.dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = fx.getBoundingClientRect();
    state.w = Math.max(1, Math.floor(rect.width));
    state.h = Math.max(1, Math.floor(rect.height));
    fx.width = Math.floor(state.w * state.dpr);
    fx.height = Math.floor(state.h * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function onPointerMove(e) {
    const x = typeof e.clientX === "number" ? e.clientX : state.w * 0.5;
    const y = typeof e.clientY === "number" ? e.clientY : state.h * 0.5;
    pointer.x = x;
    pointer.y = y;
    pointer.nx = clamp(x / Math.max(1, state.w), 0, 1);
    pointer.ny = clamp(y / Math.max(1, state.h), 0, 1);
    root.style.setProperty("--parx", `${(pointer.nx - 0.5) * 28}px`);
    root.style.setProperty("--pary", `${(pointer.ny - 0.5) * 18}px`);
  }

  function fireRipple(x, y) {
    const rx = `${x}px`;
    const ry = `${y}px`;
    rippleEl.style.setProperty("--rx", rx);
    rippleEl.style.setProperty("--ry", ry);
    rippleEl.dataset.fire = "false";
    // Restart animation reliably
    void rippleEl.offsetWidth;
    rippleEl.dataset.fire = "true";
    window.clearTimeout(fireRipple._t);
    fireRipple._t = window.setTimeout(() => {
      rippleEl.dataset.fire = "false";
    }, 820);
  }
  fireRipple._t = 0;

  function setBtnGlow(btn, e) {
    const r = btn.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const my = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
    btn.style.setProperty("--mx", `${mx}%`);
    btn.style.setProperty("--my", `${my}%`);
  }

  function wireButtons() {
    const btns = /** @type {NodeListOf<HTMLButtonElement>} */ (
      document.querySelectorAll(".btn")
    );
    btns.forEach((btn) => {
      btn.addEventListener("pointermove", (e) => setBtnGlow(btn, e));
    });
  }

  function toggleRunning(next) {
    state.running = next;
    body.dataset.paused = next ? "false" : "true";
    pauseBtn.setAttribute("aria-pressed", next ? "false" : "true");
    pauseBtn.textContent = next ? "Pause motion" : "Resume motion";
    if (next) loop();
    else cancelAnimationFrame(state.raf);
  }

  function greeting() {
    const a = ["Hello", "Hi", "Hey", "Greetings", "Ahoy"];
    const b = ["world", "friend", "traveler", "future", "you"];
    const c = ["make it strange", "keep it kind", "ship it", "stay curious", "build boldly"];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `${pick(a)}, ${pick(b)}. ${pick(c)}.`;
  }

  async function copyGreeting() {
    const text = greeting();
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied.");
    } catch {
      // Fallback: select via a temporary textarea
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast("Copied.");
      } catch {
        toast(text);
      } finally {
        ta.remove();
      }
    }
  }

  // Particle field (subtle, low-frequency motion).
  const field = (() => {
    const particles = [];
    const max = 180;

    function init() {
      particles.length = 0;
      const density = state.w * state.h;
      const n = clamp(Math.floor(density / 9500), 90, max);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * state.w,
          y: Math.random() * state.h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: 0.6 + Math.random() * 1.8,
          h: Math.random(),
        });
      }
    }

    function step(dt) {
      const px = pointer.nx * state.w;
      const py = pointer.ny * state.h;
      const pull = pointer.down ? 0.018 : 0.008;

      for (const p of particles) {
        const dx = px - p.x;
        const dy = py - p.y;
        const d2 = dx * dx + dy * dy;
        const near = d2 < 220 * 220;
        if (near) {
          p.vx += (dx / Math.max(1, Math.sqrt(d2))) * pull;
          p.vy += (dy / Math.max(1, Math.sqrt(d2))) * pull;
        }

        // Low-pass drift to keep it calm.
        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -20) p.x = state.w + 20;
        if (p.x > state.w + 20) p.x = -20;
        if (p.y < -20) p.y = state.h + 20;
        if (p.y > state.h + 20) p.y = -20;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, state.w, state.h);

      const g = ctx.createRadialGradient(
        pointer.nx * state.w,
        pointer.ny * state.h,
        40,
        pointer.nx * state.w,
        pointer.ny * state.h,
        Math.max(state.w, state.h) * 0.7
      );
      g.addColorStop(0, "rgba(255,255,255,0.10)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, state.w, state.h);

      for (const p of particles) {
        const t = (state.paletteIdx + p.h) % 1;
        const hue = Math.floor(360 * t);
        ctx.fillStyle = `hsla(${hue} 90% 70% / 0.34)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // A few connecting lines for depth (sparingly).
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 6) {
        const a = particles[i];
        const b = particles[(i + 8) % particles.length];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < 220 * 220) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    return { init, step, draw };
  })();

  function loop() {
    if (!state.running) return;
    const now = performance.now();
    const dt = Math.min(32, now - state.t || 16);
    state.t = now;
    field.step(dt);
    field.draw();
    state.raf = requestAnimationFrame(loop);
  }

  function reshuffle() {
    const idx = Math.floor(Math.random() * palettes.length);
    const seed = randSeed().slice(0, 8);
    setPalette(idx, seed);
    field.init();
    toast("Shuffled.");
  }

  function init() {
    setPalette(0, randSeed().slice(0, 8));
    startClock();
    startType();
    resize();
    field.init();
    wireButtons();

    // Pointer tracking
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener(
      "pointerdown",
      (e) => {
        pointer.down = true;
        onPointerMove(e);
        fireRipple(e.clientX, e.clientY);
      },
      { passive: true }
    );
    window.addEventListener(
      "pointerup",
      () => {
        pointer.down = false;
      },
      { passive: true }
    );

    // Click ripple anywhere, even without pointer events (keyboard focus, etc.)
    window.addEventListener(
      "click",
      (e) => {
        if (typeof e.clientX === "number" && typeof e.clientY === "number") {
          fireRipple(e.clientX, e.clientY);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      resize();
      field.init();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(state.raf);
      else if (state.running) loop();
    });

    shuffleBtn.addEventListener("click", reshuffle);
    pauseBtn.addEventListener("click", () => toggleRunning(!state.running));
    copyLink.addEventListener("click", (e) => {
      e.preventDefault();
      copyGreeting();
    });

    // Start a little offset for parallax.
    onPointerMove({ clientX: window.innerWidth * 0.52, clientY: window.innerHeight * 0.38 });

    toggleRunning(state.running);
  }

  init();
})();

