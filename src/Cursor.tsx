import { useEffect, useRef } from 'react';
import { content as c } from './content';

const rays = Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2, r0 = 17, r1 = i % 2 ? 22 : 27; return <line key={i} x1={(Math.cos(a) * r0).toFixed(1)} y1={(Math.sin(a) * r0).toFixed(1)} x2={(Math.cos(a) * r1).toFixed(1)} y2={(Math.sin(a) * r1).toFixed(1)} />; });

/** Chillchai cursor: the lemon logo inside a spinning sunburst ring. Mouse only. */
export function Cursor() {
  const sun = useRef<HTMLDivElement>(null); const logo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const s = sun.current!, l = logo.current!, root = document.documentElement;
    let x = -100, y = -100, sx = -100, sy = -100, lx = -100, ly = -100, raf = 0, shown = false;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; if (!shown) { shown = true; sx = lx = x; sy = ly = y; root.classList.add('has-cursor'); }
      const t = e.target as Element | null;
      s.classList.toggle('is-cta', !!t?.closest('.pill, .play, .key'));
      s.classList.toggle('is-link', !t?.closest('.pill, .play, .key') && !!t?.closest('a, button'));
    };
    const down = () => s.classList.add('press'), up = () => s.classList.remove('press');
    const leave = () => { shown = false; root.classList.remove('has-cursor'); };
    const loop = () => { sx = lx = x; sy = ly = y; s.style.transform = `translate3d(${sx}px,${sy}px,0)`; l.style.transform = `translate3d(${lx}px,${ly}px,0)`; raf = requestAnimationFrame(loop); };
    addEventListener('pointermove', move, { passive: true }); addEventListener('pointerdown', down); addEventListener('pointerup', up); root.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('pointerdown', down); removeEventListener('pointerup', up); root.removeEventListener('pointerleave', leave); root.classList.remove('has-cursor'); };
  }, []);
  return <><div className="cur cur-sun" ref={sun} aria-hidden="true"><svg viewBox="-30 -30 60 60">{rays}</svg></div><div className="cur cur-logo" ref={logo} aria-hidden="true"><img src={c.brand.logo} alt="" width="22" height="22" /></div></>;
}
