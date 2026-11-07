import { useEffect, useRef } from 'react';

/** Grainy gradient + halftone dots that swell and brighten around the cursor. */
export function Backdrop() {
  const cv = useRef<HTMLCanvasElement>(null); const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = cv.current, g = glow.current; const ctx = c?.getContext('2d'); if (!c || !g || !ctx) return;
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, coarse = matchMedia('(pointer: coarse)').matches;
    const SP = coarse ? 20 : 18, RAD = coarse ? 95 : 150, SW = coarse ? .12 : .34, GR = coarse ? 1.4 : 3.6, GA = coarse ? .4 : .7; let W = 0, H = 0, raf = 0;
    const m = { x: innerWidth * .7, y: innerHeight * .3, tx: innerWidth * .7, ty: innerHeight * .3 };
    let theme = root.dataset.theme === 'ink' ? 1 : 0, sy = scrollY, touched = false;
    const fit = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); wake(); };
    const draw = (now: number) => {
      raf = 0;
      if (coarse && !touched) { m.tx = W * (.5 + .3 * Math.sin(now / 3600)); m.ty = H * (.45 + .25 * Math.cos(now / 4700)); }
      m.x += (m.tx - m.x) * .09; m.y += (m.ty - m.y) * .09;
      const tt = root.dataset.theme === 'ink' ? 1 : 0; theme += (tt - theme) * .05;
      sy += (scrollY - sy) * .08;
      const max = Math.max(1, document.documentElement.scrollHeight - H), ph = sy / max * 6.283;
      // Cursor glow, colour drifting marigold → warm orange across the screen.
      const k = Math.min(Math.max(m.x / W, 0), 1);
      g.style.setProperty('--mx', `${m.x}px`); g.style.setProperty('--my', `${m.y}px`);
      g.style.setProperty('--cg', `${Math.round(244 - k * 8)},${Math.round(204 - k * 62)},${Math.round(80 - k * 22)}`);
      ctx.clearRect(0, 0, W, H);
      const fr = 28 + (255 - 28) * theme, fg = 24 + (253 - 24) * theme, fb = 19 + (244 - 19) * theme;
      ctx.fillStyle = `rgba(${fr | 0},${fg | 0},${fb | 0},${.13 + .02 * theme})`;
      const near: number[] = []; ctx.beginPath();
      for (let gy = SP / 2; gy < H + SP; gy += SP) for (let gx = SP / 2; gx < W + SP; gx += SP) {
        const dx = gx - m.x, dy = gy - m.y, infl = Math.exp(-(dx * dx + dy * dy) / (2 * RAD * RAD)), s = 1 + SW * infl;
        const px = m.x + dx * s, py = m.y + dy * s, w = .5 + .5 * Math.sin(gx * .0022 + gy * .0017 + ph);
        const r = .35 + w * 1.25 + infl * GR;
        if (infl > .07) near.push(px, py, r, infl); else { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, 6.283); }
      }
      ctx.fill();
      for (let i = 0; i < near.length; i += 4) { ctx.fillStyle = `rgba(242,201,76,${.2 + .7 * near[i + 3]})`; ctx.beginPath(); ctx.arc(near[i], near[i + 1], near[i + 2], 0, 6.283); ctx.fill(); }
      const moving = Math.abs(m.tx - m.x) + Math.abs(m.ty - m.y) > .4 || Math.abs(tt - theme) > .01 || Math.abs(scrollY - sy) > .5;
      if (!reduce && (moving || (coarse && !touched))) raf = requestAnimationFrame(draw);
    };
    function wake() { if (!raf) raf = requestAnimationFrame(draw); }
    const move = (e: PointerEvent) => { m.tx = e.clientX; m.ty = e.clientY; if (e.pointerType !== 'mouse') touched = true; if (!reduce) wake(); };
    const mo = new MutationObserver(wake); mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    fit(); addEventListener('resize', fit); addEventListener('pointermove', move, { passive: true }); addEventListener('scroll', wake, { passive: true });
    return () => { cancelAnimationFrame(raf); mo.disconnect(); removeEventListener('resize', fit); removeEventListener('pointermove', move); removeEventListener('scroll', wake); };
  }, []);
  return <div className="bg" aria-hidden="true"><div className="bg-layer bg-cream" /><div className="bg-layer bg-ink" /><div className="bg-glow" ref={glow} /><canvas ref={cv} className="bg-dots" /><div className="bg-grain" /><div className="bg-vig v-cream" /><div className="bg-vig v-ink" /></div>;
}
