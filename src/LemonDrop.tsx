import { useEffect, useRef } from 'react';
import './lemon-drop.css';

const VISITED = 'chillchai:intro-film:v1';
const ease = 'cubic-bezier(.22,1,.36,1)';

export function LemonDrop() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = layer.current;
    const video = overlay?.querySelector<HTMLVideoElement>('video');
    const brand = document.querySelector<HTMLAnchorElement>('header .brand');
    const logo = brand?.querySelector<HTMLImageElement>('img');
    if (!overlay || !video || !brand || !logo) return;

    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    let hideTimer = 0;
    let revealTimer = 0;
    let running = false;

    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
      return animation;
    };

    const revealHero = () => {
      const mobile = innerWidth <= 760;
      document.querySelectorAll('.hero-line, .hero-description, .hero-actions > *').forEach((element, index) => {
        animate(
          element,
          [{ opacity: .08, transform: `translateY(${mobile ? 8 : 16}px)` }, { opacity: 1, transform: 'none' }],
          { duration: mobile ? 360 : 480, delay: index * 38, fill: 'backwards', easing: ease }
        );
      });
      const art = document.querySelector('.hero-art');
      if (art) animate(art, [{ opacity: .1 }, { opacity: 1 }], { duration: 420, fill: 'backwards', easing: ease });
    };

    const finish = () => {
      if (!running) return;
      running = false;
      window.clearTimeout(hideTimer);
      window.clearTimeout(revealTimer);
      video.pause();
      overlay.classList.add('is-leaving');
      revealHero();
      hideTimer = window.setTimeout(() => {
        overlay.classList.remove('is-playing', 'is-leaving');
      }, 260);
    };

    const start = async () => {
      const replay = new URLSearchParams(location.search).get('intro') === '1';
      let visited = false;
      try { visited = localStorage.getItem(VISITED) === 'seen'; } catch { /* Storage is optional. */ }
      if (motionPreference.matches || scrollY > 20 || (location.hash && location.hash !== '#home')) return;
      if (visited && !replay) {
        revealHero();
        return;
      }

      try { localStorage.setItem(VISITED, 'seen'); } catch { /* A blocked store must not block the page. */ }
      video.currentTime = 0;
      running = true;
      overlay.classList.add('is-playing');
      try {
        await video.play();
      } catch {
        finish();
        return;
      }
      revealTimer = window.setTimeout(finish, 720);
    };

    const bounce = () => {
      if (running) finish();
      if (motionPreference.matches) return;
      logo.getAnimations().forEach(animation => animation.cancel());
      animate(
        logo,
        [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-7px) rotate(-7deg)', offset: .38 }, { transform: 'translateY(0) rotate(0)' }],
        { duration: 480, easing: ease }
      );
      brand.classList.remove('lemon-clicked');
      void brand.offsetWidth;
      brand.classList.add('lemon-clicked');
    };

    const interrupt = () => finish();
    const preferenceChanged = () => { if (motionPreference.matches) finish(); };
    const clearSparkle = () => brand.classList.remove('lemon-clicked');
    const frame = requestAnimationFrame(start);

    brand.addEventListener('click', bounce);
    brand.addEventListener('animationend', clearSparkle);
    motionPreference.addEventListener('change', preferenceChanged);
    window.addEventListener('resize', interrupt);
    window.addEventListener('scroll', interrupt, { passive: true });
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchmove', interrupt, { passive: true });
    document.addEventListener('pointerdown', interrupt, true);
    document.addEventListener('keydown', interrupt, true);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(revealTimer);
      video.pause();
      animations.forEach(animation => animation.cancel());
      overlay.classList.remove('is-playing', 'is-leaving');
      clearSparkle();
      brand.removeEventListener('click', bounce);
      brand.removeEventListener('animationend', clearSparkle);
      motionPreference.removeEventListener('change', preferenceChanged);
      window.removeEventListener('resize', interrupt);
      window.removeEventListener('scroll', interrupt);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchmove', interrupt);
      document.removeEventListener('pointerdown', interrupt, true);
      document.removeEventListener('keydown', interrupt, true);
    };
  }, []);

  return (
    <div className="lemon-drop" ref={layer} aria-hidden="true">
      <video muted playsInline preload="auto">
        <source src="/assets/chillchai-intro.m4v" type="video/x-m4v" />
      </video>
    </div>
  );
}
