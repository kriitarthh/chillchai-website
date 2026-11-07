import React, { useEffect, useRef, useState } from 'react';
import { content as c, type Project } from './content';
import './site.css';
import { useFlow } from './useFlow';
import { Globe } from './Globe';
import { Backdrop } from './Backdrop';
import { Cursor } from './Cursor';
import { EyeRing, HeadlineFigure } from './Art';

const Arrow = () => <span aria-hidden="true">↗</span>;
const mail = `mailto:${c.contact.email}?subject=${encodeURIComponent(c.ui.enquirySubject)}`;
const NAV: [string, string][] = [['What we do', 'services'], ['Work', 'work'], ['People', 'people'], ['Podcast', 'podcast'], ['Contact', 'contact']];

function Words({ text }: { text: string }) {
  return <span className="words">{text.split(' ').map((w, i) => <React.Fragment key={i}><span className="w"><span className="wi">{w}</span></span>{' '}</React.Fragment>)}</span>;
}
function H2({ a, b }: { a: string; b: string }) {
  return <h2 className="h2"><span className="sr-only">{a} {b}</span><span aria-hidden="true"><Words text={a} /><br /><em><Words text={b} /></em></span></h2>;
}
function Sunburst() {
  const lines = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2, len = 150 + Math.abs(Math.sin(i * 2.3) * 190) + (i % 5 === 0 ? 70 : 0), r0 = 70;
    return <line key={i} x1={(Math.cos(a) * r0).toFixed(1)} y1={(Math.sin(a) * r0).toFixed(1)} x2={(Math.cos(a) * (r0 + len)).toFixed(1)} y2={(Math.sin(a) * (r0 + len)).toFixed(1)} />;
  });
  return <svg viewBox="-500 -500 1000 1000" aria-hidden="true">{lines}</svg>;
}
function Brand() {
  return <a className="brand" href="#home" aria-label="Chillchai Creations — home"><img src={c.brand.logo} alt="" width="44" height="44" /><span>chillchai</span></a>;
}
function ProjectView({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = dialog.current; if (project) { d?.showModal(); document.body.style.overflow = 'hidden'; } return () => { d?.close(); document.body.style.overflow = ''; }; }, [project]);
  return <dialog ref={dialog} data-lenis-prevent className="project-dialog" aria-labelledby="project-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    {project && <div className="dialog-inner"><button className="dialog-close" onClick={onClose} autoFocus aria-label={c.ui.close}>×</button><p className="eyebrow">{project.category}</p><h2 id="project-title">{project.name}</h2><p className="dialog-summary">{project.summary}</p>
      <div className="detail-grid"><section><h3>{c.ui.context}</h3><p>{project.context}</p></section><section><h3>{c.ui.role}</h3><p>{project.role}</p></section></div>
      <h3>{c.ui.approach}</h3><ul>{project.approach.map(t => <li key={t}>{t}</li>)}</ul>
      {project.outcomes.length > 0 && <><h3>{c.ui.outcomes}</h3><div className="outcomes">{project.outcomes.map(([n, l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div><p className="fine">{c.ui.source}</p></>}
      {project.links.map(l => <a key={l.href} className="text-link" href={l.href} target="_blank" rel="noreferrer">{l.label} <Arrow /></a>)}
      <button className="pill dark" onClick={onClose}>{c.ui.back}</button></div>}
  </dialog>;
}
function PodcastCard() {
  const [mode, setMode] = useState<'idle' | 'muted' | 'sound'>('idle');
  const box = useRef<HTMLDivElement>(null);
  const id = c.podcast.videoId;
  useEffect(() => {
    const el = box.current; if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMode(m => (m === 'idle' ? 'muted' : m)); io.disconnect(); } }, { threshold: .55 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div className="podcast-card" ref={box} data-reveal>
    {mode !== 'idle' ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${mode === 'muted' ? 1 : 0}&playsinline=1&rel=0&modestbranding=1`} title={c.podcast.videoTitle} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      : <button onClick={() => setMode('sound')} aria-label={`Play: ${c.podcast.videoTitle}`}>
        <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" onError={e => { e.currentTarget.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`; }} />
        <span className="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
      </button>}
  </div>;
}

const team = [
  { k: 'A', n: 'Avishi Mishra', r: 'Founder', img: c.founder.image, alt: c.founder.imageAlt, bio: 'Built the audience before advising one: 89.9K on YouTube, 41.5K on Instagram, 5 products from idea to sold.', h: '@avishimishh', href: 'https://www.instagram.com/avishimishh/' },
  { k: 'K', n: 'Kritarth Shuckla', r: 'Business Lead', img: '/assets/kritarth.webp', alt: 'Kritarth Shuckla', bio: 'The operator behind Protein Mummy (213K+), bringing audience-building to the business of content.', h: '@kriitarth', href: 'https://www.instagram.com/kriitarth/' },
];
function WhoWeAre() {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));
  const arrow = <svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 6 C 70 0, 110 40, 100 80 M100 80 l-14 -14 M100 80 l 14 -12" /></svg>;
  return <div className="keys-stage" data-reveal>
    <div className="keys-row">
      <span className="hand hand-who" aria-hidden="true">who{arrow}</span>
      <div className="keys" role="group" aria-label="Who we are: flip a key to meet us">{team.map((t, i) => {
        const on = open.includes(i);
        return <div className="key-col" key={t.k}>
          <button className={`key${on ? ' down' : ''}`} aria-pressed={on} aria-label={`${on ? 'Hide' : 'Meet'} ${t.n}`} onClick={() => toggle(i)}>
            <span className="flip"><span className="cap"><span className="face">{t.k}</span></span><span className="back"><img src={t.img} alt={t.alt} width="300" height="300" loading="lazy" /></span></span>
          </button>
          <div className={`key-cap${on ? ' shown' : ''}`} aria-hidden={!on}><h3>{t.n}</h3><p>{t.r}</p><a href={t.href} target="_blank" rel="noreferrer" tabIndex={on ? 0 : -1}>{t.h}<Arrow /></a></div>
        </div>;
      })}</div>
      <span className="hand hand-are" aria-hidden="true">we are{arrow}</span>
    </div>
    <p className="key-hint" aria-hidden="true">{open.length === 0 ? 'flip a key' : ' '}</p>
  </div>;
}
const workRows = c.work.projects.filter(p => p.id !== 'client-launch');
const stats: [string, string][] = [['344K+', 'combined followers & subscribers'], ['60+', 'brand collaborations'], ['5,000+', 'units sold'], ['90–100', 'creators in our network']];
const steps: [string, string][] = [['Understand', 'Your brand, audience and goal.'], ['Find the story', 'Positioning and ideas worth making.'], ['Make it real', 'Content, creators, campaigns.'], ['Learn & improve', 'See what works. Make the next one better.']];

function Wr({ i, children }: { i: number; children: React.ReactNode }) { return <><span className="wr" data-s={i % 2 ? 'c' : 's'} style={{ ['--w' as string]: i }} aria-hidden="true"><span className="wr-t">{children}</span></span>{' '}</>; }
const SBAR: [string, string][] = [['home', 'Home'], ['services', 'What we do'], ['numbers', 'Reach'], ['work', 'Work'], ['global', 'Global'], ['people', 'People'], ['podcast', 'Podcast'], ['process', 'Process'], ['contact', 'Contact']];
function ScrollBar() {
  const fill = useRef<HTMLSpanElement>(null), head = useRef<HTMLSpanElement>(null), track = useRef<HTMLSpanElement>(null);
  const [ticks, setTicks] = useState<{ id: string; label: string; p: number }[]>([]);
  const [active, setActive] = useState('home');
  const pos = useRef<{ id: string; top: number }[]>([]);
  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const list = SBAR.map(([id, label]) => { const el = document.getElementById(id); return el ? { id, label, top: el.getBoundingClientRect().top + scrollY } : null; }).filter(Boolean) as { id: string; label: string; top: number }[];
      pos.current = list; setTicks(list.map(t => ({ id: t.id, label: t.label, p: Math.min(1, Math.max(0, t.top / max)) })));
    };
    measure(); const t1 = setTimeout(measure, 1200), t2 = setTimeout(measure, 4000); addEventListener('resize', measure); addEventListener('load', measure);
    let cur = 0, raf = 0, act = 'home';
    const tick = () => {
      const max = document.documentElement.scrollHeight - innerHeight, t = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      cur += (t - cur) * .12; if (Math.abs(t - cur) < .0004) cur = t;
      if (fill.current) fill.current.style.transform = `scaleY(${cur})`;
      if (head.current) head.current.style.transform = `translateY(${cur * 100}%)`;
      let a = pos.current[0]?.id || 'home'; for (const q of pos.current) if (q.top <= scrollY + innerHeight * .45) a = q.id;
      if (a !== act) { act = a; setActive(a); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); removeEventListener('resize', measure); removeEventListener('load', measure); };
  }, []);
  const go = (id: string) => { const q = pos.current.find(x => x.id === id); if (q) scrollTo({ top: Math.max(0, q.top - (id === 'home' ? 0 : 20)), behavior: 'smooth' }); };
  const scrub = (e: React.PointerEvent) => {
    const r = track.current!.getBoundingClientRect(); const f = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    scrollTo({ top: f * (document.documentElement.scrollHeight - innerHeight), behavior: 'auto' });
  };
  return <div className="sbar" role="navigation" aria-label="Page progress">
    <span className="sbar-track" ref={track} onPointerDown={e => { (e.target as Element).closest('.tick') || (e.currentTarget.setPointerCapture(e.pointerId), scrub(e)); }} onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e); }} onPointerUp={e => e.currentTarget.releasePointerCapture(e.pointerId)}>
      <span className="sbar-fill" ref={fill} /><span className="sbar-head" ref={head}><i /></span>
      {ticks.map(t => <button key={t.id} className={`tick${active === t.id ? ' on' : ''}`} style={{ top: `${t.p * 100}%` }} onClick={() => go(t.id)} aria-label={`Go to ${t.label}`}><b /><span>{t.label}</span></button>)}
    </span>
  </div>;
}

export default function App() {
  useFlow();
  const [menu, setMenu] = useState(false); const [project, setProject] = useState<Project | null>(null);
  useEffect(() => { if (!menu) return; const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); }; document.addEventListener('keydown', esc); return () => document.removeEventListener('keydown', esc); }, [menu]);
  return <>
    <Backdrop /><Cursor /><ScrollBar />
    <div className="sun" aria-hidden="true"><Sunburst /></div>
    <a className="skip" href="#main">{c.ui.skip}</a>
    <header className="top"><Brand />
      <nav className={menu ? 'open' : ''} id="navigation" aria-label="Main navigation">{NAV.map(([l, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{l}</a>)}</nav>
      <a className="pill dark talk" href="#contact">{c.ui.talk}<Arrow /></a>
      <button className="menu-btn" aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button>
    </header>
    <main id="main">
      <section className="hero" id="home" data-theme="cream">
        <div className="hero-word" aria-hidden="true">{[...'chillchai'].map((ch, i) => <span key={i} className={ch === 'i' ? 'ch li' : 'ch'} data-s={i % 2 ? 'c' : 's'} style={{ ['--i' as string]: i }}>{ch === 'i' ? <>ı<span className="dot"><img src="/assets/logo.webp" alt="" /></span></> : ch}</span>)}</div>
        <h1 className="hero-tag"><span className="sr-only">Chillchai Creations — </span>
          <span className="l1">{['We', 'build,', 'manage', '&', 'grow', 'social', 'media'].map((w, i) => <Wr key={i} i={i}>{w}</Wr>)}</span>
          <span className="l2">{['for', <em key="b">brands</em>, 'and', 'the', <em key="p">people</em>, 'behind', 'them.'].map((w, i) => <Wr key={i} i={i + 7}>{w}</Wr>)}</span></h1>
        <p className="hero-tagline"><svg className="swoosh" viewBox="0 0 600 22" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13 C 110 2, 230 21, 350 9 S 520 5, 596 12" /></svg><em>{c.brand.tagline}</em></p>
        <p className="hero-social" aria-label="Social links"><a href="https://www.instagram.com/chillchai/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.youtube.com/@chillchai" target="_blank" rel="noreferrer">YouTube</a></p>
        <a className="scroll-cue" href="#services">Scroll<span aria-hidden="true">↓</span></a>
      </section>

      <section className="section services" id="services" data-theme="cream">
        <H2 a="Two wings." b="One story." />
        <article className="chapter" data-reveal>
          <div className="art-wrap"><EyeRing /></div>
          <div className="chapter-copy"><p className="tag">01 · For brands</p><h3>Social Media Marketing</h3><p className="chapter-head">Attention is the only currency. We mint it.</p><p>We engineer attention: audience-first narratives, content systems that compound, and a network of 90–100 creators that turns reach into recall. Strategy, storytelling and distribution, wired into one machine that keeps running long after the launch.</p></div>
        </article>
        <article className="chapter rev" data-reveal>
          <div className="art-wrap"><HeadlineFigure /></div>
          <div className="chapter-copy"><p className="tag">02 · For founders &amp; creators</p><h3>Personal Branding</h3><p className="chapter-head">Be the headline, not the footnote.</p><p>For founders and creators, the person is the product. We find the one story only you can tell, then build the positioning, scripts and cadence that carry your name further than any ad budget: thought leadership with the discipline of a sales team.</p></div>
        </article>
      </section>

      <section className="section numbers" id="numbers" data-theme="ink">
        <p className="eyebrow">The story so far</p>
        <div className="big-number" data-reveal><span data-count="100">100</span><span className="plus">M+</span></div>
        <p className="big-caption" data-reveal>people reached through our channels, including multiple viral reels at <b>15M+</b>.</p>
        <dl className="stat-line">{stats.map(([v, l]) => <div key={l} data-reveal><dt>{v}</dt><dd>{l}</dd></div>)}</dl>
      </section>

      <section className="section work" id="work" data-theme="cream">
        <H2 a="Less pitch." b="More proof." />
        <ul className="work-list">
          {workRows.map((p, i) => <li key={p.id} data-reveal data-img={p.image || ''}><button onClick={() => setProject(p)} aria-label={`${c.ui.project}: ${p.name}`}><span className="wn">0{i + 1}</span><span className="wt">{p.name}</span><span className="wc">{p.category.split('/')[0].trim().toLowerCase()}</span><span className="ws">{p.outcomes[0]?.[0]}</span><span className="wa"><Arrow /></span>{p.image && <img className="wthumb" src={p.image} alt="" loading="lazy" />}</button></li>)}
          <li data-reveal><a href="#contact"><span className="wn">03</span><span className="wt"><em>Yours, next.</em></span><span className="wc">start a project</span><span className="ws" /><span className="wa"><Arrow /></span></a></li>
        </ul>
        <div className="work-peek" aria-hidden="true"><img alt="" /></div>
      </section>

      <section className="section globe-sec" id="global" data-theme="ink">
        <div className="globe-copy">
          <p className="eyebrow">Our reach</p>
          <H2 a="Based in India." b="Working with the US." />
          <p className="sub" data-reveal>A team in India, building brands that travel.</p>
        </div>
        <div className="globe-wrap" data-reveal><Globe /></div>
      </section>

      <section className="section people" id="people" data-theme="cream"><h2 className="sr-only">Who we are</h2><WhoWeAre /></section>

      <section className="section podcast" id="podcast" data-theme="ink">
        <div className="pod-copy">
          <p className="eyebrow">The Chillchai Podcast</p>
          <H2 a="Chillchai" b="with Avishi." />
          <p className="sub" data-reveal>Conversations with people doing cool things at a young age.</p>
          <div className="pod-links" data-reveal>{c.podcast.links.map((l, i) => <a key={l.href} className={`pill ${i ? 'ghost' : 'gold'}`} href={l.href} target="_blank" rel="noreferrer">{l.label}<Arrow /></a>)}</div>
        </div>
        <PodcastCard />
      </section>

      <section className="section process" id="process" data-theme="cream">
        <H2 a="A good brew" b="takes intention." />
        <svg className="flow-line" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 70 C 140 0, 260 130, 380 66 S 620 0, 750 64 S 900 120, 1000 50" /></svg>
        <ol className="steps">{steps.map(([n, d], i) => <li key={n} data-reveal><span className="sn">0{i + 1}</span><h3>{n}</h3><p>{d}</p></li>)}</ol>
      </section>

      <section className="section contact" id="contact" data-theme="ink">
        <img className="contact-lemon" src={c.brand.logo} alt="" width="120" height="120" loading="lazy" />
        <h2 className="mega"><span className="sr-only">Let’s talk.</span><span aria-hidden="true"><Words text="Let’s" /> <em><Words text="talk." /></em></span></h2>
        <p className="sub" data-reveal>Brand launching soon, or a founder building a personal brand? Tell us what you’re making.</p>
        <div className="contact-actions" data-reveal><a className="pill gold big" href={mail}>{c.contact.cta}<Arrow /></a><a className="mail" href={mail}>{c.contact.email}</a></div>
        <footer><Brand /><span className="foot-tag">{c.brand.tagline}</span><span>© {new Date().getFullYear()} {c.ui.copyright}</span></footer>
      </section>
    </main>
    <ProjectView project={project} onClose={() => setProject(null)} />
  </>;
}
