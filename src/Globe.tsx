import { useEffect, useRef } from 'react';
import { DOTS } from './globeDots';

const IN: [number, number] = [77.2, 28.6];
const US: [number, number] = [-98, 39];
const rad = Math.PI / 180;
const vec = (lon: number, lat: number): [number, number, number] => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];

/** Dotted rotating globe: India ↔ US. Canvas only, paused off-screen. */
export function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv?.getContext('2d'); if (!cv || !ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lam = 40, raf = 0, last = 0, visible = true, size = 0, dpr = 1;
    const phi0 = 22 * rad, sp = Math.sin(phi0), cp = Math.cos(phi0);
    const fit = () => { dpr = Math.min(devicePixelRatio || 1, 2); size = cv.clientWidth; cv.width = cv.height = Math.round(size * dpr); };
    const ro = new ResizeObserver(fit); ro.observe(cv); fit();
    const A = vec(...IN), B = vec(...US);
    const omega = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
    const draw = (now: number) => {
      raf = 0; if (!visible) return;
      const dt = Math.min(now - last, 80); last = now; if (!reduce) lam += dt * .006;
      const c = Math.cos(lam * rad), s = Math.sin(lam * rad);
      const map = (v: number[]): [number, number, number] => { const a = v[0] * c + v[1] * s, b = v[1] * c - v[0] * s; return [b, cp * v[2] - sp * a, sp * v[2] + cp * a]; };
      const R = size * dpr * .42, cx = size * dpr / 2, cy = size * dpr / 2;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const g = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .05, cx, cy, R * 1.02);
      g.addColorStop(0, '#3a3225'); g.addColorStop(.7, '#211c15'); g.addColorStop(1, '#14110d');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(242,201,76,.55)'; ctx.lineWidth = 1.5 * dpr; ctx.shadowColor = 'rgba(242,201,76,.7)'; ctx.shadowBlur = 28 * dpr; ctx.stroke(); ctx.shadowBlur = 0;
      const r = Math.max(1.1, size / 380) * dpr;
      for (const [lon, lat] of DOTS) {
        const [x, y, z] = map(vec(lon, lat)); if (z < 0.02) continue;
        ctx.fillStyle = `rgba(255,253,244,${.18 + .6 * z})`; ctx.fillRect(cx + x * R - r / 2, cy - y * R - r / 2, r, r);
      }
      // Arc between the two markers, lifted off the surface.
      ctx.lineWidth = 2 * dpr; ctx.setLineDash([6 * dpr, 7 * dpr]); ctx.lineDashOffset = -now * .02 * dpr;
      ctx.strokeStyle = '#F2C94C'; ctx.beginPath(); let pen = false;
      for (let i = 0; i <= 64; i++) {
        const t = i / 64, k1 = Math.sin((1 - t) * omega) / Math.sin(omega), k2 = Math.sin(t * omega) / Math.sin(omega), lift = 1 + .28 * Math.sin(Math.PI * t);
        const v = [0, 1, 2].map(j => (A[j] * k1 + B[j] * k2) * lift); const [x, y, z] = map(v);
        if (z > .02) { pen ? ctx.lineTo(cx + x * R, cy - y * R) : ctx.moveTo(cx + x * R, cy - y * R); pen = true; } else pen = false;
      }
      ctx.stroke(); ctx.setLineDash([]);
      for (const [name, p] of [['INDIA', IN], ['USA', US]] as const) {
        const [x, y, z] = map(vec(p[0], p[1])); if (z < .05) continue;
        const px = cx + x * R, py = cy - y * R, pulse = (now % 1800) / 1800;
        ctx.strokeStyle = `rgba(242,201,76,${1 - pulse})`; ctx.lineWidth = 2 * dpr; ctx.beginPath(); ctx.arc(px, py, (6 + pulse * 22) * dpr, 0, 7); ctx.stroke();
        ctx.fillStyle = '#F2C94C'; ctx.shadowColor = '#F2C94C'; ctx.shadowBlur = 18 * dpr; ctx.beginPath(); ctx.arc(px, py, 6 * dpr, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFDF4'; ctx.font = `600 ${11 * dpr}px Inter, sans-serif`; ctx.fillText(name, px + 12 * dpr, py - 10 * dpr);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(draw); } });
    io.observe(cv); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return <canvas ref={ref} className="globe" role="img" aria-label="Globe showing Chillchai based in India and working with brands in the US" />;
}
