/**
 * Intelligence Page — intelligence.js v3.0
 * Unified 3D Ring Engine — master ring + all domain rings share one factory.
 * SCORP Design System — Science Gothic / Verdana / FA7 icons
 */
export async function initIntelligencePage() {
  console.log('[Scorptech] Intelligence Page init…');

  /* ── FONT PRELOAD ────────────────────────────────────────────── */
  await Promise.all([
    document.fonts.load('900 16px "Font Awesome 7 Free"'),
    document.fonts.load('400 16px "Font Awesome 7 Brands"'),
    document.fonts.load('400 16px "Bootstrap Icons"'),  
  ]).catch(() => {});

  /* ── UTILITIES ───────────────────────────────────────────────── */
  const qs = id => document.getElementById(id);
  const TAU = Math.PI * 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t;

  /* Robust hex colour lerp — strips '#' and optional alpha suffix */
  function lerpHex(h1, h2, t) {
    const parse = h => {
      const c = h.replace('#', '').slice(0, 6);
      return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
    };
    const [r1,g1,b1] = parse(h1);
    const [r2,g2,b2] = parse(h2);
    return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`;
  }

  /* ── SCORP COLOR TOKENS (mirrors core.css CSS variables) ────── */
  const COLORS = {
    /* Primary / Blue */
    primary:       '#0066cc',
    primary_dark:  '#004d99',
    primary_light: '#3399ff',
    primary_mid:   '#b8d5f4',
    primary_soft:  '#e8f2fc',
    /* Amber */
    amber:      '#f59e0b',
    amber_dark: '#b45309',
    amber_mid:  '#fbbf24',
    amber_soft: '#fef3c7',
    /* Attention / Orange */
    attention:      '#ea580c',
    attention_dark: '#c2410c',
    attention_mid:  '#fb923c',
    attention_soft: '#ffedd5',
    /* Royal / Purple */
    royal:      '#7c3aed',
    royal_dark: '#6d28d9',
    royal_mid:  '#a78bfa',
    royal_soft: '#ede9fe',
    /* Success / Green */
    success:      '#16a34a',
    success_dark: '#15803d',
    success_mid:  '#22c55e',
    success_soft: '#dcfce7',
    /* Info / Cyan (--s-info) */
    info:      '#0284c7',
    info_dark: '#0369a1',
    info_mid:  '#38bdf8',
    info_soft: '#e0f2fe',
    /* Info-Special / Teal (--s-info-special) */
    teal:      '#0d9488',
    teal_dark: '#0f766e',
    teal_mid:  '#2dd4bf',
    teal_soft: '#ccfbf1',
    /* Danger / Red */
    danger:      '#dc2626',
    danger_dark: '#b91c1c',
    danger_mid:  '#f87171',
    danger_soft: '#fee2e2',
    /* Warning / Yellow */
    warning:      '#eab308',
    warning_dark: '#a16207',
    warning_mid:  '#fbbf24',
    warning_soft: '#fef9c3',
    /* Pop / Pink */
    pop:      '#ec4899',
    pop_dark: '#be185d',
    pop_mid:  '#f472b6',
    pop_soft: '#fce7f3',
    /* Neutrals */
    n200:   '#dde4ed',
    n400:   '#8fa3b8',
    text:   '#0f2034',
    textS:  '#3d566b',
    textM:  '#7a96ae',
    white:  '#ffffff',
    gray50: '#f8fafc',
  };

  function makeRing3D(cfg) {
    const canvas = qs(cfg.canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* — CONFIG DEFAULTS — */
    const TILT        = 0.40;
    const yScale      = Math.cos(TILT);          // ≈ 0.921
    const TRAVEL_DUR  = cfg.travelDur    ?? 0.7;
    const DWELL_DUR   = cfg.dwellDur     ?? 2.5;
    const TOTAL_DUR   = TRAVEL_DUR + DWELL_DUR;
    const P_SPEED     = cfg.particleSpeed ?? 0.14;
    const P_COUNT     = cfg.particleCount ?? 3;
    const HUB_LABEL   = cfg.hubLabel     ?? 'SAPPHIRE';
    const HUB_FIXED   = cfg.hubFixed     ?? false;
    const MAX_W       = cfg.maxW         ?? 520;
    const RING_R_FRAC = cfg.ringRadius   ?? 0.30;
    const ASPECT      = cfg.aspectRatio  ?? 1.22;
    const ICON_SCALE_ACTIVE = cfg.iconScaleActive ?? 0.052;
    const ICON_SCALE_INACTIVE = cfg.iconScaleInactive ?? 0.043;
    const ICON_SCALE_IDLE = cfg.iconScaleIdle ?? 0.044;
    const nodes       = cfg.nodes;
    const n           = nodes.length;
    const captionId   = cfg.captionId    ?? null;

    /* — STATE — */
    let W, H, cx, cy, R;
    let activeNode = 0, prevNode = 0;
    let phaseTime  = 0;
    let lastTs     = performance.now();
    let hoverNode  = -1;
    const nodeGlow  = nodes.map((_, i) => i === 0 ? 1 : 0);
    const ripples   = [];
    const particles = Array.from({ length: P_COUNT }, (_, i) => ({
      phase: (TAU / P_COUNT) * i
    }));

    /* — GEOMETRY — */
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      const logicalW = Math.min(MAX_W, rect.width || MAX_W);
      const logicalH = canvas.hasAttribute('data-height')
        ? parseInt(canvas.getAttribute('data-height'))
        : Math.round(logicalW * ASPECT);
      
      // Set physical resolution (accounts for high-DPI)
      canvas.width  = Math.round(logicalW * dpr);
      canvas.height = Math.round(logicalH * dpr);
      
      // Set display size in CSS
      canvas.style.width  = logicalW + 'px';
      canvas.style.height = logicalH + 'px';
      
      // Scale canvas drawing context for high-DPI
      ctx.scale(dpr, dpr);
      
      // Update working variables
      W = logicalW;
      H = logicalH;
      cx = W / 2;
      cy = H / 2;
      R  = W * RING_R_FRAC;
    }

    /* Projected 3D position of node i */
    function getPos(i) {
      const a  = (TAU / n) * i - Math.PI / 2;
      const sx = cx + R * Math.cos(a);
      const sy = cy + R * Math.sin(a) * yScale;
      const depth = Math.sin(a);   // -1 (far/top) → +1 (near/bottom)
      return { x: sx, y: sy, a, depth };
    }

    function depthScale(d) { return lerp(0.80, 1.06, (d + 1) / 2); }

    /* — DRAW LOOP — */
    function draw(ts) {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      phaseTime += dt;

      /* Advance active node */
      if (phaseTime > TOTAL_DUR) {
        phaseTime  -= TOTAL_DUR;
        prevNode    = activeNode;
        activeNode  = (activeNode + 1) % n;
        const p     = getPos(activeNode);
        ripples.push({ x: p.x, y: p.y, r: W * 0.07, color: nodes[activeNode].color, alpha: 0.8 });

        /* Caption crossfade */
        if (captionId) {
          const cap = qs(captionId);
          if (cap) {
            cap.style.opacity = '0';
            setTimeout(() => {
              cap.textContent = nodes[activeNode].caption ?? nodes[activeNode].label;
              cap.style.opacity = '1';
            }, 220);
          }
        }
      }

      const travelP = Math.min(phaseTime / TRAVEL_DUR, 1);
      const smoothP = easeInOut(travelP);

      /* Node glow update */
      for (let i = 0; i < n; i++) {
        nodeGlow[i] = i === activeNode
          ? Math.min(1, nodeGlow[i] + dt * 4)
          : Math.max(0, nodeGlow[i] - dt * 3);
      }

      /* Particle orbit */
      particles.forEach(p => { p.phase = (p.phase + dt * P_SPEED * TAU) % TAU; });

      ctx.clearRect(0, 0, W, H);

      /* ── 1. AMBIENT GLOW ── */
      const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.52);
      amb.addColorStop(0,   nodes[activeNode].color + '1a');
      amb.addColorStop(0.6, nodes[activeNode].color + '08');
      amb.addColorStop(1,   'transparent');
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W, H);

      /* ── 2. 3D RING RIM ── */
      [
        { yOff: W*0.022, color: 'rgba(0,5,20,0.55)',                  lw: W*0.028 },
        { yOff: W*0.014, color: nodes[activeNode].color + '33',        lw: W*0.022 },
        { yOff: W*0.007, color: nodes[activeNode].color + '22',        lw: W*0.016 },
        { yOff: 0,       color: 'rgba(255,255,255,0.07)', lw: 1.5, dash:[4,10] },
      ].forEach(l => {
        ctx.beginPath();
        ctx.ellipse(cx, cy + l.yOff, R, R * yScale, 0, 0, TAU);
        ctx.strokeStyle = l.color;
        ctx.lineWidth   = l.lw;
        if (l.dash) ctx.setLineDash(l.dash);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      /* ── 3. SEGMENT ARCS ── */
      for (let i = 0; i < n; i++) {
        const a0 = (TAU / n) * i       - Math.PI / 2;
        const a1 = (TAU / n) * (i + 1) - Math.PI / 2;

        if (i === prevNode && travelP < 1) {
          const arcEnd = a0 + (a1 - a0) * smoothP;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.ellipse(cx, cy, R, R*yScale, 0, a0, arcEnd);
          ctx.strokeStyle = nodes[activeNode].color + '22'; ctx.lineWidth = 18; ctx.stroke();
          ctx.beginPath(); ctx.ellipse(cx, cy, R, R*yScale, 0, a0, arcEnd);
          ctx.strokeStyle = nodes[activeNode].color + '55'; ctx.lineWidth = 8;  ctx.stroke();
          ctx.beginPath(); ctx.ellipse(cx, cy, R, R*yScale, 0, a0, arcEnd);
          ctx.strokeStyle = nodes[activeNode].color;         ctx.lineWidth = 2.5; ctx.stroke();
          ctx.lineCap = 'butt';
        } else {
          ctx.beginPath(); ctx.ellipse(cx, cy, R, R*yScale, 0, a0, a1);
          ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 1; ctx.stroke();
        }
      }

      /* ── 4. COMET PARTICLES (continuous orbit) ── */
      particles.forEach(pt => {
        const nearIdx = Math.round(pt.phase / (TAU / n)) % n;
        const pColor  = nodes[nearIdx]?.color ?? COLORS.primary;

        /* Tail */
        for (let j = 6; j >= 1; j--) {
          const ta = pt.phase - j * 0.05 - Math.PI / 2;
          const tx = cx + R * Math.cos(ta);
          const ty = cy + R * Math.sin(ta) * yScale;
          const al = Math.floor((1 - j / 7) * 170).toString(16).padStart(2, '0');
          ctx.beginPath(); ctx.arc(tx, ty, Math.max(0.5, 3.5 - j * 0.4), 0, TAU);
          ctx.fillStyle = pColor + al; ctx.fill();
        }
        /* Head */
        const ha = pt.phase - Math.PI / 2;
        const hx = cx + R * Math.cos(ha);
        const hy = cy + R * Math.sin(ha) * yScale;
        ctx.beginPath(); ctx.arc(hx, hy, 4.5, 0, TAU);
        ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.strokeStyle = pColor; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, hy, 10, 0, TAU);
        ctx.fillStyle = pColor + '28'; ctx.fill();
      });

      /* ── 5. RIPPLES ── */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r    += W * 0.0028;
        rip.alpha = Math.max(0, rip.alpha - 0.022);
        if (rip.alpha <= 0) { ripples.splice(i, 1); continue; }
        const ah  = Math.floor(rip.alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath(); ctx.arc(rip.x, rip.y, rip.r, 0, TAU);
        ctx.strokeStyle = rip.color + ah; ctx.lineWidth = 2; ctx.stroke();
        const ah2 = Math.floor(rip.alpha * 70).toString(16).padStart(2, '0');
        ctx.beginPath(); ctx.arc(rip.x, rip.y, rip.r * 0.65, 0, TAU);
        ctx.strokeStyle = rip.color + ah2; ctx.lineWidth = 7; ctx.stroke();
      }

      /* ── 6. NODES — depth-sorted, 3D sphere rendering ── */
      const sorted = [...Array(n).keys()].sort((a, b) => getPos(a).depth - getPos(b).depth);
      const baseR  = W * 0.066;

      for (const i of sorted) {
        const pos = getPos(i);
        const g   = nodeGlow[i];
        const ds  = depthScale(pos.depth);
        const isH = hoverNode === i;
        const dsLocked = g > 0.8 ? 1.06 : (g <= 0.08 ? 1.06 : ds);
        const r   = (baseR + g * W * 0.015 + (isH ? W * 0.007 : 0)) * dsLocked;
        const da  = lerp(0.68, 1.0, (pos.depth + 1) / 2);

        /* Ground shadow ellipse */
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + r * 0.55 + W * 0.008, r * 0.9, r * 0.22, 0, 0, TAU);
        ctx.fillStyle = `rgba(0,0,0,${0.2 * ds})`; ctx.fill();

        /* Outer aura */
        const idleHalo  = 0.18 + 0.10 * Math.sin(ts * 0.0018 + i * (TAU / n));
        const auraAlpha = isH ? 0.6 : (g > 0.05 ? g * 0.5 : idleHalo);
        ctx.globalAlpha = da * auraAlpha;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r + W * 0.026, 0, TAU);
        ctx.strokeStyle = nodes[i].color + (g > 0.05 ? '88' : '50');
        ctx.lineWidth   = g > 0.05 ? 10 : 6; ctx.stroke();
        ctx.globalAlpha = 1;

        /* Node body */
        ctx.globalAlpha = g > 0.8 ? 1.0 : (g > 0.08 ? da : 1.0);
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, TAU);
        if (g > 0.08) {
          /* ACTIVE — colored deep sphere */
          const gr = ctx.createRadialGradient(pos.x - r*0.28, pos.y - r*0.32, 0, pos.x, pos.y, r);
          gr.addColorStop(0,    lerpHex('#1a1a2e', nodes[i].color, g));
          gr.addColorStop(0.55, lerpHex('#0d0d1a', nodes[i].color, g * 0.65));
          gr.addColorStop(1,    lerpHex('#050510', nodes[i].color, g * 0.4));
          ctx.fillStyle = gr;
        } else {
          /* IDLE — opaque frosted white sphere */
          const idleGr = ctx.createRadialGradient(
            pos.x - r*0.30, pos.y - r*0.35, r * 0.02,
            pos.x, pos.y, r
          );
          idleGr.addColorStop(0,    'rgba(255,255,255,0.97)');
          idleGr.addColorStop(0.40, 'rgba(240,245,255,0.93)');
          idleGr.addColorStop(0.75, 'rgba(220,230,248,0.88)');
          idleGr.addColorStop(1,    'rgba(195,210,238,0.82)');
          ctx.fillStyle = idleGr;
        }
        ctx.fill();

        /* Specular highlight */
        const hl = ctx.createRadialGradient(
          pos.x - r*0.32, pos.y - r*0.38, r*0.05,
          pos.x - r*0.1,  pos.y - r*0.1,  r * 0.85
        );
        hl.addColorStop(0,    `rgba(255,255,255,${0.22 + g * 0.14})`);
        hl.addColorStop(0.35, 'rgba(255,255,255,0.04)');
        hl.addColorStop(1,    'transparent');
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, TAU);
        ctx.fillStyle = hl; ctx.fill();

        /* Border + animated halo */
        if (g <= 0.08) {
          /* IDLE: pulsing colored border */
          const pulse  = 0.55 + 0.45 * Math.sin(ts * 0.0020 + i * (TAU / n));
          const bAlpha = Math.floor((0.45 + 0.40 * pulse) * 255).toString(16).padStart(2, '0');
          ctx.strokeStyle = nodes[i].color + bAlpha;
          ctx.lineWidth = 2.2; ctx.stroke();
          /* Outer halo ring */
          ctx.beginPath(); ctx.arc(pos.x, pos.y, r + W * 0.008, 0, TAU);
          ctx.strokeStyle = nodes[i].color + Math.floor((0.12 + 0.12 * pulse) * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = W * 0.012; ctx.stroke();
        } else {
          /* ACTIVE: solid crisp border */
          const bA = Math.floor(lerp(45, 220, g)).toString(16).padStart(2, '0');
          ctx.strokeStyle = nodes[i].color + bA;
          ctx.lineWidth = g > 0.1 ? 2 : 1.2; ctx.stroke();
        }
        ctx.globalAlpha = 1;

        /* Icon */
        const iSz = g > 0.08
          ? Math.round(lerp(W * ICON_SCALE_ACTIVE, W * ICON_SCALE_INACTIVE, g) * ds)
          : Math.round(W * ICON_SCALE_IDLE * ds);
        ctx.font         = `900 ${iSz}px "Font Awesome 7 Free"`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = g > 0.5 ? '#ffffff' : nodes[i].color;
        ctx.globalAlpha  = da * (g > 0.5 ? 1 : lerp(0.5, 1, 1 - g));
        ctx.fillText(nodes[i].icon, pos.x, pos.y);
        ctx.globalAlpha = 1;
      }

      /* ── 7. LABELS (radial pills) ── */
      const lSize = Math.round(W * 0.027);
      ctx.font         = `600 ${lSize}px Verdana, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < n; i++) {
        const a    = (TAU / n) * i - Math.PI / 2;
        const nx   = cx + R * Math.cos(a);
        const ny   = cy + R * Math.sin(a) * yScale;
        const dX   = nx - cx, dY = ny - cy;
        const dist = Math.hypot(dX, dY);
        const push = W * 0.150;
        const lOff = nodes[i].lOff ?? {};
        const rOff = lOff.r ?? 0;
        const yOff = lOff.y ?? 0;
        const lx   = cx + (dX / dist) * (dist + push + rOff);
        const ly   = cy + (dY / dist) * (dist + push + rOff) + yOff;

        const g  = nodeGlow[i];
        const tw = ctx.measureText(nodes[i].label).width;
        const ph = lSize + 10, pw = tw + 18, pr = ph / 2;

        if (g < 1) {
          ctx.globalAlpha = 1 - g;
          ctx.fillStyle   = 'rgba(255,255,255,0.07)';
          ctx.strokeStyle = nodes[i].color + '55'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.roundRect(lx - pw/2, ly - ph/2, pw, ph, pr);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = nodes[i].color;
          ctx.fillText(nodes[i].label, lx, ly);
          ctx.globalAlpha = 1;
        }
        if (g > 0) {
          ctx.globalAlpha  = g;
          ctx.shadowColor  = nodes[i].color + '88'; ctx.shadowBlur = 12;
          ctx.fillStyle    = nodes[i].color;
          ctx.beginPath(); ctx.roundRect(lx - pw/2, ly - ph/2, pw, ph, pr);
          ctx.fill();
          ctx.shadowBlur   = 0;
          ctx.fillStyle    = '#ffffff';
          ctx.fillText(nodes[i].label, lx, ly);
          ctx.globalAlpha  = 1;
        }
      }

      /* ── 8. HUB ── */
      /* Rotating tick orbit */
      const rot1 = ts * 0.00024;
      for (let i = 0; i < 12; i++) {
        const a  = rot1 + (TAU / 12) * i;
        const dx = cx + W * 0.148 * Math.cos(a);
        const dy = cy + W * 0.148 * Math.sin(a) * yScale;
        ctx.beginPath(); ctx.arc(dx, dy, i % 3 === 0 ? 2.5 : 1.2, 0, TAU);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.15)';
        ctx.fill();
      }

      /* Inner dashed orbit */
      ctx.beginPath(); ctx.ellipse(cx, cy, W*0.142, W*0.142*yScale, 0, 0, TAU);
      ctx.strokeStyle = nodes[activeNode].color + '30'; ctx.lineWidth = 1;
      ctx.setLineDash([3, 9]); ctx.stroke(); ctx.setLineDash([]);

      /* Hub ground shadow */
      ctx.beginPath();
      ctx.ellipse(cx, cy + W*0.022, W*0.125, W*0.038, 0, 0, TAU);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();

      /* Hub body — color-tinted deep sphere */
      const hubG = ctx.createRadialGradient(cx - W*0.045, cy - W*0.048, 0, cx, cy, W*0.128);
      hubG.addColorStop(0,    lerpHex('#1a1a2e', nodes[activeNode].color, 0.55));
      hubG.addColorStop(0.45, lerpHex('#0d0d1a', nodes[activeNode].color, 0.30));
      hubG.addColorStop(1,    lerpHex('#050510', nodes[activeNode].color, 0.15));
      ctx.beginPath(); ctx.arc(cx, cy, W*0.125, 0, TAU);
      ctx.fillStyle = hubG; ctx.fill();

      /* Hub specular */
      const hubHL = ctx.createRadialGradient(cx - W*0.055, cy - W*0.065, 0, cx, cy, W*0.12);
      hubHL.addColorStop(0,   'rgba(255,255,255,0.15)');
      hubHL.addColorStop(0.4, 'rgba(255,255,255,0.04)');
      hubHL.addColorStop(1,   'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, W*0.125, 0, TAU);
      ctx.fillStyle = hubHL; ctx.fill();

      /* Pulse border */
      const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(ts * 0.0022));
      ctx.strokeStyle = nodes[activeNode].color + Math.floor(pulse*165).toString(16).padStart(2,'0');
      ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = nodes[activeNode].color + Math.floor(pulse*55).toString(16).padStart(2,'0');
      ctx.lineWidth = 14; ctx.stroke();

      /* Hub text */
      const topText = HUB_FIXED ? HUB_LABEL : (nodes[activeNode].center ?? HUB_LABEL);
      const botText = nodes[activeNode].sub ?? nodes[activeNode].label;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font      = `700 ${Math.round(W*0.034)}px 'Science Gothic', sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(topText, cx, cy - W*0.017);
      ctx.font      = `500 ${Math.round(W*0.022)}px Verdana, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.fillText(botText, cx, cy + W*0.022);

      requestAnimationFrame(draw);
    }

    /* — INTERACTION — */
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mx   = (e.clientX - rect.left) * (W / rect.width);
      const my   = (e.clientY - rect.top)  * (H / rect.height);
      hoverNode  = -1;
      for (let i = 0; i < n; i++) {
        const p = getPos(i);
        if (Math.hypot(mx - p.x, my - p.y) < W * 0.09) { hoverNode = i; break; }
      }
      canvas.style.cursor = hoverNode >= 0 ? 'pointer' : 'default';
    });

    canvas.addEventListener('click', () => {
      if (hoverNode >= 0) {
        prevNode   = activeNode;
        activeNode = hoverNode;
        phaseTime  = 0;
        const p    = getPos(activeNode);
        ripples.push({ x: p.x, y: p.y, r: W*0.07, color: nodes[activeNode].color, alpha: 0.8 });
      }
    });

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  /* ═══════════════════════════════════════════════════════════════
     MASTER LIFECYCLE RING — 8-NODE FULL ASSET LIFECYCLE
     FIX: Allocate (3 o'clock) and Monitor (9 o'clock) pulled
          inward 22px via lOff.r to prevent canvas edge clipping.
  ═══════════════════════════════════════════════════════════════ */
  makeRing3D({
    canvasId:    'masterRingCanvas',
    hubLabel:    'SAPPHIRE',
    hubFixed:    true,
    travelDur:   0.7,
    dwellDur:    2.5,
    maxW:        620,
    ringRadius:  0.275,
    aspectRatio: 1.32,
    nodes: [
      { label: 'Acquire',  icon: '\uf472', color: COLORS.primary,    sub: 'Acquire',  lOff: { r:   0, y: 0 } },
      { label: 'Organize', icon: '\uf1de', color: COLORS.teal,       sub: 'Organize', lOff: { r:   0, y: 0 } },
      { label: 'Allocate', icon: '\uf1e0', color: COLORS.success,    sub: 'Allocate', lOff: { r: -4, y: 0 } },
      { label: 'Utilize',  icon: '\ue05d', color: COLORS.amber,      sub: 'Utilize',  lOff: { r:   0, y: 0 } },
      { label: 'Inspect',  icon: '\ue522', color: COLORS.attention,  sub: 'Inspect',  lOff: { r:   0, y: 0 } }, 
      { label: 'Maintain', icon: '\uf085', color: COLORS.info,       sub: 'Maintain', lOff: { r:   0, y: 0 } },
      { label: 'Monitor',  icon: '\ue0e3', color: COLORS.royal,      sub: 'Monitor',  lOff: { r: -4, y: 0 } },
      { label: 'Dispose',  icon: '\uf2ed', color: COLORS.danger,     sub: 'Dispose',  lOff: { r:   0, y: 0 } },
    ],
  });

  /* ═══════════════════════════════════════════════════════════════
     DOMAIN RINGS — all upgraded to 3D ring style
  ═══════════════════════════════════════════════════════════════ */

  /* ── Domain 1: Enterprise Governance ── */
  makeRing3D({
    canvasId:  'cycleEnterprise',
    captionId: 'captionEnterprise',
    iconScaleActive: 0.052,
    iconScaleInactive: 0.043,
    iconScaleIdle: 0.044, 
    hubFixed:  false,
    travelDur: 0.8,
    dwellDur:  2.2,
    maxW:      9999,
    ringRadius: 0.28,
    nodes: [
      { icon: '\ue4d5', label: 'Organisation', color: COLORS.primary,
        center: 'Organisation', sub: 'the flagship',
        caption: 'The Organisation is the root. All fiscal parameters, corporate identity, and global standards are set here — once.' },
      { icon: '\uf1ad', label: 'Workplace',    color: COLORS.primary,
        center: 'Workplace',    sub: 'each branch',
        caption: 'Every branch operates under the organisation. Unlimited workplaces, each with its own shifts, contacts, and asset environment.' },
      { icon: '\uf0c0', label: 'Teams',        color: COLORS.primary,
        center: 'Teams',        sub: 'departments',
        caption: 'Teams within each branch carry the operational context — department, designation, and reporting hierarchy all defined here.' },
      { icon: '\uf507', label: 'Roles',        color: COLORS.primary,
        center: 'Roles',        sub: 'permissions',
        caption: 'Roles map precisely to what each person can see, request, approve, and report. Executive and clerical — or fully custom.' },
      { icon: '\uf0e7', label: 'Actions',      color: COLORS.primary,
        center: 'Actions',      sub: 'floor level',
        caption: 'Every action taken on the floor — an issue request, an inspection, a repair — is governed by the role above it and feeds data back up.' },
      { icon: '\uf2db', label: 'Intelligence', color: COLORS.primary,
        center: 'Intelligence', sub: 'feeds back',
        caption: 'Aggregated floor-level activity becomes the headquarters view — real-time across every branch, every role, every asset.' },
    ],
  });

  /* ── Domain 2: Inventory State ── */
  makeRing3D({
    canvasId:  'cycleInventory',
    captionId: 'captionInventory',
    hubFixed:  false,
    travelDur: 0.8,
    dwellDur:  2.2,
    maxW:      9999,
    ringRadius: 0.28,
    nodes: [
      { icon: '\uf466', label: 'Reserve', color: COLORS.amber,
        center: 'Reserve', sub: 'stored',
        caption: 'All assets not currently deployed. Fully catalogued with lifecycle context, condition, and maintenance history.' },
      { icon: '\uf164', label: 'Active',  color: COLORS.amber,
        center: 'Active',  sub: 'in use',
        caption: 'The asset is live. Its location, assigned user, and usage state are tracked in real time across the operation.' },
      { icon: '\ue552', label: 'Issue',   color: COLORS.amber,
        center: 'Issue',   sub: 'request',
        caption: 'A formal issue request is filed, routed for approval, and executed in one tap. Chain of custody created automatically.' },
      { icon: '\ue522', label: 'Inspect', color: COLORS.amber,
        center: 'Inspect', sub: 'health check',
        caption: 'Scheduled inspection triggered automatically. Condition assessed, photos attached, digital signature collected.' },
      { icon: '\ue551', label: 'Return',  color: COLORS.amber,
        center: 'Return',  sub: 'to reserve',
        caption: 'Asset returned with condition check. Returned to Reserve or flagged for disposal based on condition outcome.' },
      { icon: '\uf085', label: 'Maintain',color: COLORS.amber,
        center: 'Maintain',sub: 'service',
        caption: 'Maintenance event logged with provider, parts, cost, and warranty claim. Service history permanently attached to the asset.' },
    ],
  });

  /* ── Domain 3: Asset Lifecycle ── */
  makeRing3D({
    canvasId:  'cycleLifecycle',
    captionId: 'captionLifecycle',
    hubFixed:  false,
    travelDur: 0.8,
    dwellDur:  2.2,
    maxW:      9999,
    ringRadius: 0.28,
    nodes: [
      { icon: '\uf07a', label: 'Purchase', color: COLORS.attention,
        center: 'Purchase', sub: 'acquisition',
        caption: 'Asset acquired with full financial context — vendor, invoice, warranty, exchange rate. The cost clock starts here.' },
      { icon: '\uf02b', label: 'Onboard',  color: COLORS.attention,
        center: 'Onboard',  sub: 'register',
        caption: 'Asset is classified, coded, and entered into the system. Inspection checkpoints, maintenance cycles, and financial parameters set.' },
      { icon: '\uf135', label: 'Deploy',   color: COLORS.attention,
        center: 'Deploy',   sub: 'assign',
        caption: 'Asset deployed to its first location or employee. Chain of custody begins. Every subsequent movement is logged.' },
      { icon: '\uf002', label: 'Inspect',  color: COLORS.attention,
        center: 'Inspect',  sub: 'scheduled',
        caption: 'Auto-generated inspection cycles run continuously. Every finding logged with objective scores, photos, and signatures.' },
      { icon: '\uf0ad', label: 'Repair',   color: COLORS.attention,
        center: 'Repair',   sub: 'resolution',
        caption: 'Fault detected → repair request filed → approved → executed → cost logged → asset returned to service. Full loop, no gaps.' },
      { icon: '\uf328', label: 'Dispose',  color: COLORS.attention,
        center: 'Dispose',  sub: 'end of life',
        caption: 'Disposed with formal documentation — sale proceeds, scrap value, or archival. TCO finalised. Asset record closed.' },
    ],
  });

  /* ── Domain 4: Financial / TCO ── */
  makeRing3D({
    canvasId:  'cycleFinancial',
    captionId: 'captionFinancial',
    hubFixed:  false,
    travelDur: 0.8,
    dwellDur:  2.2,
    maxW:      9999,
    ringRadius: 0.28,
    nodes: [
      { icon: '\uf09d', label: 'Acquire',    color: COLORS.royal,
        center: 'Acquire',    sub: 'purchase',
        caption: 'The acquisition price — including taxes, freight, and forex — is the starting point of the total cost calculation.' },
      { icon: '\uf201', label: 'Depreciate', color: COLORS.royal,
        center: 'Depreciate', sub: 'book value',
        caption: 'Book value updated continuously under Company Act 2013 and IT Act 1961. Never a manual year-end calculation.' },
      { icon: '\uf0ad', label: 'OPEX',       color: COLORS.royal,
        center: 'OPEX',       sub: 'repairs',
        caption: 'Every repair, service, and maintenance event adds to the running OPEX total — attributed directly to this asset.' },
      { icon: '\uf3ed', label: 'Recover',    color: COLORS.royal,
        center: 'Recover',    sub: 'claims',
        caption: 'Warranty claims, insurance payouts, and AMC benefits offset the OPEX total. Net cost is always accurate.' },
      { icon: '\uf080', label: 'TCO',        color: COLORS.royal,
        center: 'TCO',        sub: 'total cost',
        caption: 'Total Cost of Ownership = Acquisition + OPEX − Recoveries + Depreciated value. Updated live. Always current.' },
      { icon: '\uf02b', label: 'Dispose',    color: COLORS.royal,
        center: 'Dispose',    sub: 'residual',
        caption: 'At disposal, the proceeds or scrap value closes the financial record. Final TCO calculated and archived.' },
    ],
  });

  /* ═══════════════════════════════════════════════════════════════
     STICKY SECTION NAV — SCROLL SPY
  ═══════════════════════════════════════════════════════════════ */
  const sectionIds = ['section-enterprise','section-inventory','section-lifecycle','section-financial'];
  const navItems   = document.querySelectorAll('.intel-snav-item');

  // ── SNAV SHOW / HIDE ─────────────────────────────────────────
  const snav = document.querySelector('.intel-snav');
  const snavStart = document.getElementById('section-enterprise');
  const snavEnd = document.getElementById('section-financial');
if (snav && snavStart && snavEnd) {
  const enterpriseTop    = snavStart.offsetTop;
  const financialBottom  = snavEnd.offsetTop + snavEnd.offsetHeight;

  function checkSnavVisibility() {
    const scrollY = window.scrollY;
    snav.classList.toggle(
      'snav-visible',
      scrollY >= enterpriseTop && scrollY < financialBottom
    );
}
  window.addEventListener('scroll', checkSnavVisibility, { passive: true });
  checkSnavVisibility();
}

  function scrollNavToActive() {
    const navInner   = document.querySelector('.intel-snav-inner');
    const activeItem = navInner?.querySelector('.intel-snav-item.active');
    if (!navInner || !activeItem) return;
    navInner.scrollTo({
      left:     activeItem.offsetLeft - navInner.offsetWidth / 2 + activeItem.offsetWidth / 2,
      behavior: 'smooth',
    });
  }

  function updateSectionNav() {
    const scrollY = window.scrollY + 200;
    let current   = '';
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id.replace('section-', '');
    });
    navItems.forEach(item => item.classList.toggle('active', item.dataset.domain === current));
    scrollNavToActive();
  }

  

  window.addEventListener('scroll', updateSectionNav, { passive: true });
  updateSectionNav();

  /* ═══════════════════════════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.intel-reveal').forEach(el => revealObs.observe(el));

  /* ═══════════════════════════════════════════════════════════════
     AUTO-CALIBRATE CAPTION HEIGHT — Uniform across all rings
  ═══════════════════════════════════════════════════════════════ */
  function autoCalibreateCaptionHeight() {
    const captions = document.querySelectorAll('.intel-anim-caption');
    if (!captions.length) return;

    let maxHeight = 0;

    // Measure all captions to find the tallest one
    captions.forEach(cap => {
      // Temporarily set min-height to auto to get natural height
      const savedMinHeight = cap.style.minHeight;
      cap.style.minHeight = 'auto';
      const naturalHeight = cap.offsetHeight;
      maxHeight = Math.max(maxHeight, naturalHeight);
      cap.style.minHeight = savedMinHeight;
    });

    // Add 10px buffer to ensure content never clips
    const finalHeight = maxHeight + 10;

    // Apply uniform height to all captions
    captions.forEach(cap => {
      cap.style.minHeight = finalHeight + 'px';
    });

    console.log(`[Scorptech] Caption height auto-calibrated to ${finalHeight}px`);
  }

  // Run calibration after a short delay to ensure DOM is fully rendered
  setTimeout(autoCalibreateCaptionHeight, 200);

  // Re-calibrate on window resize in case layout changes
  window.addEventListener('resize', () => {
    setTimeout(autoCalibreateCaptionHeight, 100);
  }, { passive: true });

  console.log('[Scorptech] Intelligence page ready — v3.0');
}
