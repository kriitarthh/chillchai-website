import { useEffect } from 'react';

/** One hook for the page's flow: theme crossfade, zooming sunburst, reveals, smooth scroll. */
export function useFlow() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = []; let dead = false;
    const secs = Array.from(document.querySelectorAll<HTMLElement>('main > section[data-theme]'));
    const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) root.dataset.theme = (e.target as HTMLElement).dataset.theme!; }, { rootMargin: '-50% 0px -49% 0px' });
    secs.forEach(s => io.observe(s)); cleanups.push(() => io.disconnect());
    if (reduce) return () => cleanups.forEach(f => f());
    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: .085, anchors: { offset: -20 } });
      root.classList.add('lenis-on');
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
      const mo = new MutationObserver(() => { document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start(); });
      mo.observe(document.body, { attributes: true, attributeFilter: ['style'] });

      const ctx = gsap.context(() => {
        const sun = document.querySelector('.sun');
        // Hero: wordmark drifts, tagline lifts away.
        gsap.to('.hero-word', { xPercent: -7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.fromTo('.hero-tag, .hero-tagline', { y: 0, opacity: 1 }, { y: -70, opacity: 0, immediateRender: false, ease: 'none', scrollTrigger: { trigger: '.hero', start: '15% top', end: '80% top', scrub: true } });
        // Sunburst: bold behind the hero, then zooms in and fades away as you scroll.
        if (sun) {
          gsap.set(sun, { xPercent: -50, yPercent: -50, scale: 1.12, opacity: 1 });
          gsap.fromTo(sun, { scale: 1.12, opacity: 1 }, { scale: 3.8, opacity: 0, ease: 'power1.in', immediateRender: false, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: .8 } });
        }
        // Headings: word by word.
        gsap.set('main > section:not(.hero) .wi', { yPercent: 115 });
        document.querySelectorAll<HTMLElement>('main > section:not(.hero) .words').forEach(h => ScrollTrigger.create({ trigger: h, start: 'top 90%', once: true, onEnter: () => gsap.to(h.querySelectorAll('.wi'), { yPercent: 0, duration: 1.1, stagger: .07, ease: 'power4.out' }) }));
        // Cards and blocks rise in.
        gsap.set('[data-reveal]', { opacity: 0, y: 56 });
        ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: .12, ease: 'power3.out', overwrite: true }) });
        // Counters.
        document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
          const to = parseFloat(el.dataset.count!), dec = +(el.dataset.dec || 0), o = { v: 0 }; el.textContent = (0).toFixed(dec);
          ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'power2.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } }) });
        });
        // Process line draws with scroll.
        gsap.fromTo('.flow-line path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.process', start: 'top 70%', end: 'bottom 70%', scrub: .6 } });
        // Contact lemon rolls in.
        gsap.fromTo('.contact-lemon', { xPercent: -380, rotation: -435 }, { xPercent: 0, rotation: 0, ease: 'power2.out', scrollTrigger: { trigger: '.contact', start: 'top 85%', end: 'bottom bottom', scrub: 0.6 } });
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      // Work list: image follows the cursor.
      const list = document.querySelector<HTMLElement>('.work-list'), peek = document.querySelector<HTMLElement>('.work-peek');
      let pc: (() => void) | undefined;
      if (list && peek && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const pos = { x: 0, y: 0, tx: 0, ty: 0 }; let pr = 0;
        const move = (e: PointerEvent) => { pos.tx = e.clientX; pos.ty = e.clientY; };
        const step = () => { pos.x += (pos.tx - pos.x) * .14; pos.y += (pos.ty - pos.y) * .14; peek.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%) rotate(${(pos.tx - pos.x) * .04}deg)`; pr = requestAnimationFrame(step); };
        const over = (e: Event) => { const r = (e.target as Element).closest<HTMLElement>('[data-img]'); const img = peek.querySelector('img')!; if (r) { img.src = r.dataset.img!; peek.classList.add('on'); } else peek.classList.remove('on'); };
        list.addEventListener('pointermove', move); list.addEventListener('pointerover', over); list.addEventListener('pointerleave', () => peek.classList.remove('on'));
        pr = requestAnimationFrame(step);
        pc = () => { cancelAnimationFrame(pr); list.removeEventListener('pointermove', move); list.removeEventListener('pointerover', over); };
      }
      cleanups.push(() => { pc?.(); ctx.revert(); mo.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); root.classList.remove('lenis-on'); });
    })();
    return () => { dead = true; cleanups.forEach(f => f()); };
  }, []);
}
