import { useEffect, useRef } from 'react';
import { content } from './content';
import './lemon-drop.css';

const VISITED = 'chillchai:lemon-drop:v1';
const ease = 'cubic-bezier(.22,1,.36,1)';

export function LemonDrop() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const overlay = layer.current;
    const header = document.querySelector('header');
    const logo = header?.querySelector<HTMLImageElement>('.brand img');
    const brand = header?.querySelector<HTMLAnchorElement>('.brand');
    if (!overlay || !header || !logo || !brand || !logo.animate) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    let frame = 0;
    let timer = 0;
    let running = false;
    let disposed = false;
    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const a = element.animate(frames, options);
      animations.add(a);
      a.onfinish = () => animations.delete(a);
      return a;
    };
    const finish = () => {
      running = false;
      clearTimeout(timer);
      animations.forEach(a => a.cancel());
      animations.clear();
      overlay.classList.remove('is-playing');
      header.classList.remove('lemon-travelling');
    };
    const start = () => {
      if (disposed || media.matches || scrollY > 20 || (location.hash && location.hash !== '#home')) return;
      let visited = false;
      try { visited = localStorage.getItem(VISITED) === 'seen'; } catch { /* Storage is optional. */ }
      const replay = new URLSearchParams(location.search).get('intro') === '1';
      const hero = document.querySelectorAll('.hero-line, .hero-description, .hero-actions > *');
      if (visited && !replay) {
        hero.forEach(el => animate(el, [{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:280,easing:ease}));
        return;
      }
      try { localStorage.setItem(VISITED, 'seen'); } catch { /* A blocked store must not block the page. */ }
      running = true;
      overlay.classList.add('is-playing');
      header.classList.add('lemon-travelling');
      const mobile = innerWidth <= 760;
      const size = mobile ? 88 : 142;
      const bounds = logo.getBoundingClientRect();
      const x = innerWidth / 2 - (bounds.left + bounds.width / 2);
      const centreY = innerHeight * (mobile ? .35 : .37);
      const y = centreY - (bounds.top + bounds.height / 2);
      const scale = size / bounds.width;
      const pose = (dy: number, rotation = 0) => `translate(${x}px, ${y+dy}px) scale(${scale}) rotate(${rotation}deg)`;
      const above = -centreY-size;
      // Animate the actual navbar image, not a copy: it ends at its own DOM position.
      animate(logo, [
        {transform:pose(above,-10),offset:0,easing:'cubic-bezier(.45,0,.75,.55)'},
        {transform:pose(0,0),offset:.25,easing:'cubic-bezier(.15,.6,.35,1)'},
        {transform:pose(mobile?-13:-24,4),offset:.32,easing:'cubic-bezier(.45,0,.8,.6)'},
        {transform:pose(0,0),offset:.40},
        {transform:pose(0,0),offset:.64,easing:ease},
        {transform:'translate(0,0) scale(1) rotate(0)',offset:1}
      ], {duration:2000,fill:'backwards'});
      animate(overlay,[{opacity:1,offset:0},{opacity:1,offset:.70},{opacity:0,offset:1}],{duration:1700,fill:'forwards'});
      const ripple = overlay.querySelector('.tea-ripple')!;
      animate(ripple,[{opacity:0,transform:'translate(-50%,-50%) scale(.35)'},{opacity:.28,offset:.18},{opacity:0,transform:'translate(-50%,-50%) scale(1.8)'}],{duration:850,delay:480,easing:'ease-out',fill:'backwards'});
      animate(overlay.querySelector('.drop-sparkle')!,[{opacity:0,transform:'scale(.3) rotate(-25deg)'},{opacity:1,transform:'scale(1.12) rotate(5deg)',offset:.6},{opacity:1,transform:'scale(1) rotate(0)'}],{duration:350,delay:570,fill:'backwards',easing:ease});
      overlay.querySelectorAll('.drop-tagline span').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)',offset:.42},{opacity:1,transform:'translateY(0)',offset:.75},{opacity:0,transform:'translateY(-4px)'}],{duration:710-i*210,delay:590+i*210,fill:'both',easing:ease}));
      hero.forEach((el,i)=>animate(el,[{opacity:.02,transform:`translateY(${mobile?10:20}px)`},{opacity:1,transform:'none'}],{duration:510,delay:1220+i*45,fill:'backwards',easing:ease}));
      const art = document.querySelector('.hero-art');
      if (art) animate(art,[{opacity:0},{opacity:1}],{duration:480,delay:1450,fill:'backwards'});
      timer = window.setTimeout(finish, 2020);
    };
    // Let React's development effect cleanup run before starting or recording a visit.
    frame = requestAnimationFrame(start);
    const interrupt = () => { if (running) finish(); };
    const preferenceChanged = () => { if (media.matches) finish(); };
    const bounce = () => {
      if (running) finish();
      if (media.matches) return;
      logo.getAnimations().forEach(a => a.cancel());
      animate(logo,[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-7px) rotate(-7deg)',offset:.38},{transform:'translateY(0) rotate(0)'}],{duration:480,easing:ease});
      brand.classList.remove('lemon-clicked');
      void brand.offsetWidth;
      brand.classList.add('lemon-clicked');
    };
    const clearSparkle = () => brand.classList.remove('lemon-clicked');
    brand.addEventListener('click', bounce); // Preserve the existing #home link action.
    brand.addEventListener('animationend', clearSparkle);
    media.addEventListener('change', preferenceChanged);
    window.addEventListener('resize', interrupt);
    window.addEventListener('scroll', interrupt, {passive:true});
    window.addEventListener('wheel', interrupt, {passive:true});
    window.addEventListener('touchmove', interrupt, {passive:true});
    document.addEventListener('pointerdown', interrupt, true);
    document.addEventListener('keydown', interrupt, true);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      finish();
      clearSparkle();
      brand.removeEventListener('click', bounce);
      brand.removeEventListener('animationend', clearSparkle);
      media.removeEventListener('change', preferenceChanged);
      window.removeEventListener('resize', interrupt);
      window.removeEventListener('scroll', interrupt);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchmove', interrupt);
      document.removeEventListener('pointerdown', interrupt, true);
      document.removeEventListener('keydown', interrupt, true);
    };
  }, []);
  return <div className="lemon-drop" ref={layer} aria-hidden="true"><div className="tea-ripple"/><span className="drop-sparkle">✦</span><p className="drop-tagline"><span>{content.intro.firstLine}</span><span>{content.intro.secondLine}</span></p></div>;
}
