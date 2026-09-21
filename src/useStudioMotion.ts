import { useEffect } from 'react';

/** Progressive enhancement: never hide content while waiting for an observer. */
export function useStudioMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const targets = document.querySelectorAll<HTMLElement>(
      '.section h2, .difference-copy, .proof-grid > div, .wing-card, .project, .team-grid article, .process-grid article, .contact .handwritten, footer > .handwritten'
    );
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const start = () => {
      stop();
      if (preference.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          observer?.unobserve(entry.target);
          const element = entry.target as HTMLElement;
          if (element.id === 'contact') {
            element.classList.add('brew-arrived');
            continue;
          }
          // Content remains in its final, readable state if animation is unavailable.
          if (!element.animate) continue;
          const mobile = window.matchMedia('(max-width: 760px)').matches;
          const siblings = Array.from(element.parentElement?.children ?? []);
          const staggered = element.matches('.proof-grid > div, .wing-card, .team-grid article, .process-grid article');
          const delay = staggered ? Math.min(siblings.indexOf(element), 3) * (mobile ? 35 : 65) : 0;
          const animation = element.animate(
            [{ opacity: .35, transform: `translateY(${mobile ? 10 : 22}px)` }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: mobile ? 440 : 680, delay, easing: 'cubic-bezier(.22,1,.36,1)' }
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
      targets.forEach(target => { if (!seen.has(target)) observer?.observe(target); });
      const contact = document.getElementById('contact');
      if (contact && !seen.has(contact)) observer.observe(contact);
    };
    start();
    preference.addEventListener('change', start);
    return () => {
      stop();
      preference.removeEventListener('change', start);
      document.getElementById('contact')?.classList.remove('brew-arrived');
    };
  }, []);
}
