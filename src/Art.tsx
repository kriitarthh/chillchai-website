import { useEffect, useRef } from 'react';

const N = 8, R = 372;
const eyeAngles = Array.from({ length: N }, (_, i) => (i / N) * 360 - 90 + 22.5);

/** Social Media Marketing: a phone at the centre of a ring of watching eyes. */
export function EyeRing() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current; if (!svg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pupils = Array.from(svg.querySelectorAll<SVGGElement>('.pupil'));
    const move = (e: PointerEvent) => {
      const b = svg.getBoundingClientRect(); const vx = e.clientX - (b.left + b.width / 2), vy = e.clientY - (b.top + b.height / 2);
      const len = Math.hypot(vx, vy) || 1, k = Math.min(len / 400, 1) * 15, ux = vx / len * k, uy = vy / len * k;
      pupils.forEach((p, i) => { const t = (eyeAngles[i] + 90) * Math.PI / 180; p.style.transform = `translate(${ux * Math.cos(t) + uy * Math.sin(t)}px, ${-ux * Math.sin(t) + uy * Math.cos(t) + 14}px)`; });
    };
    addEventListener('pointermove', move, { passive: true }); return () => removeEventListener('pointermove', move);
  }, []);
  return (
    <svg ref={ref} className="art eyes" viewBox="-500 -500 1000 1000" role="img" aria-label="Illustration: a phone surrounded by watching eyes">
      <defs>
        <radialGradient id="eg-bg" r="1"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".5" stopColor="#FAF0AE" /><stop offset="1" stopColor="#F2C94C" /></radialGradient>
        <radialGradient id="eg-iris" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#FAF0AE" /><stop offset="1" stopColor="#E0A91F" /></radialGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" /><feColorMatrix values="0 0 0 0 .11  0 0 0 0 .09  0 0 0 0 .07  0 0 0 .55 0" /></filter>
        <clipPath id="eg-clip"><circle r="480" /></clipPath>
      </defs>
      <circle r="480" fill="url(#eg-bg)" />
      <g clipPath="url(#eg-clip)">
        <rect x="-500" y="-500" width="1000" height="1000" filter="url(#grain)" opacity=".28" />
        {eyeAngles.map((a, i) => (
          <g key={i} transform={`rotate(${a}) translate(${R}) rotate(90) scale(1.42)`}>
            <path d="M-100 0 Q0 -84 100 0 Q0 84 -100 0Z" fill="#1C1813" />
            <g className="lid"><circle r="52" fill="url(#eg-iris)" /><circle r="52" fill="none" stroke="#1C1813" strokeWidth="3" /><g className="pupil" style={{ transform: 'translate(0px,14px)' }}><circle r="22" fill="#1C1813" /><circle cx="-8" cy="-9" r="7" fill="#FFFDF4" /></g></g>
            <path d="M-100 0 Q0 -84 100 0" fill="none" stroke="#1C1813" strokeWidth="9" strokeLinecap="round" />
            <path d="M-100 0 Q0 84 100 0" fill="none" stroke="#1C1813" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}
        {[0, 1, 2].map(i => <circle key={i} className="ping" r="150" fill="none" stroke="#1C1813" strokeWidth="2" style={{ animationDelay: `${i * 1.3}s` }} />)}
      </g>
      <g transform="scale(1.12)">
        <rect x="-102" y="-176" width="204" height="352" rx="38" fill="#1C1813" />
        <rect x="-90" y="-162" width="180" height="324" rx="28" fill="#FFFDF4" />
        <rect x="-90" y="-162" width="180" height="176" rx="28" fill="#F2C94C" />
        <rect x="-90" y="-60" width="180" height="74" fill="#F2C94C" />
        <circle cx="0" cy="-68" r="36" fill="#1C1813" /><path d="M-76 14 Q-76 -22 0 -26 Q76 -22 76 14Z" fill="#1C1813" />
        <rect x="-22" y="-176" width="44" height="12" rx="6" fill="#1C1813" />
        <path className="heart" d="M-70 50 c-9-10 5-24 14-12 c9-12 23 2 14 12 l-14 14z" fill="#E4572E" />
        <circle cx="-14" cy="48" r="11" fill="none" stroke="#1C1813" strokeWidth="4" /><path d="M24 40 l24 8 l-24 8 l6-8z" fill="#1C1813" />
        {[84, 108, 130].map((y, i) => <rect key={y} x="-70" y={y} width={i === 2 ? 90 : 140} height="9" rx="4.5" fill="#1C1813" opacity=".85" />)}
      </g>
    </svg>
  );
}

/** Personal Branding: a figure behind a front page that carries their name. */
export function HeadlineFigure() {
  return (
    <svg className="art fig" viewBox="0 0 600 700" role="img" aria-label="Illustration: a seated figure holding a newspaper with a headline">
      <defs>
        <radialGradient id="fg-bg" cx=".5" cy=".45" r=".7"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FAF0AE" /><stop offset="1" stopColor="#F2C94C" /></radialGradient>
        <clipPath id="fg-clip"><circle cx="300" cy="350" r="300" /></clipPath>
      </defs>
      <circle cx="300" cy="350" r="300" fill="url(#fg-bg)" />
      <g stroke="#1C1813" strokeLinecap="round" strokeLinejoin="round">
        {/* chair */}
        <g stroke="#B88A4A" strokeWidth="11"><path d="M120 470 L92 650" /><path d="M200 480 L215 655" /><path d="M300 470 L350 650" /><path d="M165 480 L168 640" /></g>
        <path d="M105 560 L330 548 M110 612 L320 605" stroke="#1C1813" strokeWidth="2" opacity=".5" />
        <path d="M60 390 C48 305 92 255 150 268 L330 470 C230 515 88 490 60 390Z" fill="#FFFDF4" strokeWidth="3.5" />
        {/* legs (crossed) */}
        <path d="M250 440 C330 430 410 440 450 470 L500 600 L440 612 L400 520 C360 505 300 505 250 500Z" fill="#E7B93A" strokeWidth="3.5" />
        <path d="M440 612 L500 600 L520 640 L540 660 L430 664Z" fill="#1C1813" strokeWidth="3" />
        <path d="M330 470 C380 470 410 490 400 540 L380 650 L330 650 L330 560Z" fill="#F2C94C" strokeWidth="3.5" />
        <path d="M322 650 L388 650 L396 692 L318 692Z" fill="#1C1813" strokeWidth="3" />
        {/* torso + sleeves */}
        <path d="M185 290 L430 290 L460 450 L195 460Z" fill="#F2C94C" strokeWidth="3.5" />
        <path d="M185 292 L150 360 L172 300 L196 250 L222 262 L214 330Z" fill="#E7B93A" strokeWidth="3" />
        <path d="M430 292 L470 360 L452 300 L440 250 L418 262 L424 330Z" fill="#E7B93A" strokeWidth="3" />
      </g>
      {/* newspaper */}
      <g>
        <rect x="165" y="70" width="310" height="355" rx="5" fill="#FFFDF4" stroke="#1C1813" strokeWidth="3.5" />
        <path d="M320 70 V425 M165 247 H475" stroke="#1C1813" strokeWidth="1" opacity=".15" />
        <text x="185" y="100" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="11" letterSpacing="1.2" fill="#1C1813">THE CHILLCHAI TIMES</text>
        <text x="455" y="100" textAnchor="end" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="11" letterSpacing="1.2" fill="#1C1813">BREAKING</text>
        <rect x="185" y="110" width="270" height="6" fill="#F2C94C" />
        <g fontFamily="Inter,sans-serif" fontWeight="800" fontSize="54" letterSpacing="-2.6" fill="#1C1813">
          <text x="183" y="188">Your</text><text x="183" y="248">name</text>
          <text x="183" y="308" fill="#C98F00">makes</text><text x="183" y="368" fill="#C98F00">headlines.</text>
        </g>
        <path d="M185 392 H455" stroke="#1C1813" strokeWidth="1" opacity=".3" />
        <text x="185" y="410" fontFamily="Inter,sans-serif" fontWeight="500" fontSize="11" fill="#1C1813">Founders &amp; creators, built into brands.</text>
        {/* hands */}
        <g fill="#E8B58A" stroke="#1C1813" strokeWidth="3" strokeLinejoin="round"><path d="M170 232 C150 224 146 262 166 270 L186 264 L186 236Z" /><path d="M470 232 C490 224 494 262 474 270 L454 264 L454 236Z" /></g>
      </g>
    </svg>
  );
}
