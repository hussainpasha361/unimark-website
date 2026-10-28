import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(hover: none)').matches;
export { gsap, ScrollTrigger };

// ---------------------------------------------------------------- smooth scroll
export let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const el = document.querySelector(url.hash);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(el, { offset: -70 });
  });
}

// ---------------------------------------------------------------- header
const hdr = document.querySelector('[data-hdr]');
let lastY = 0;
const onScroll = () => {
  const y = window.scrollY;
  hdr.classList.toggle('is-scrolled', y > 40);
  const hidden = y > 300 && y > lastY && !document.body.classList.contains('menu-open');
  hdr.classList.toggle('is-hidden', hidden);
  document.documentElement.classList.toggle('hdr-hidden', hidden);
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const page = document.body.dataset.page;
if (page) document.querySelector(`[data-nav="${page}"]`)?.setAttribute('aria-current', 'page');

// ---------------------------------------------------------------- mobile menu
const burger = document.querySelector('[data-burger]');
const mmenu = document.querySelector('[data-mmenu]');
function closeMenu() {
  document.body.classList.remove('menu-open');
  burger?.setAttribute('aria-expanded', 'false');
  mmenu?.setAttribute('aria-hidden', 'true');
  lenis?.start();
}
burger?.addEventListener('click', () => {
  const open = !document.body.classList.contains('menu-open');
  if (!open) return closeMenu();
  document.body.classList.add('menu-open');
  burger.setAttribute('aria-expanded', 'true');
  mmenu.setAttribute('aria-hidden', 'false');
  lenis?.stop();
  gsap.fromTo(mmenu.querySelectorAll('nav a'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'expo.out', delay: 0.25 });
});
mmenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

// ---------------------------------------------------------------- split headings into masked lines
export function splitLines(el) {
  // Wrap words (keeping inline elements like .serif intact), then group by offsetTop.
  const words = [];
  const walk = (node, wrapper) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return (wrapper || el).appendChild(document.createTextNode(' '));
          const w = document.createElement('span');
          w.className = 'w';
          w.style.display = 'inline-block';
          w.textContent = part;
          (wrapper || el).appendChild(w);
          words.push(w);
        });
        child.remove();
      } else if (child.nodeType === 1 && child.classList.contains('pill-img')) {
        child.classList.add('w');
        (wrapper || el).appendChild(child);
        words.push(child);
      } else if (child.nodeType === 1) {
        const clone = child.cloneNode(false);
        (wrapper || el).appendChild(clone);
        walk(child, clone);
        child.remove();
      }
    });
  };
  const frag = el.cloneNode(true);
  el.innerHTML = '';
  walk(frag, null);
  return words;
}

function linesFromWords(el, words) {
  const lines = [];
  let top = null;
  words.forEach((w) => {
    const t = w.offsetTop;
    if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
    lines[lines.length - 1].push(w);
  });
  return lines;
}

export function revealHeading(el) {
  const words = splitLines(el);
  if (reduced) return;
  const lines = linesFromWords(el, words);
  // wrap each word in a mask so lines slide up without restructuring inline parents
  words.forEach((w) => {
    const m = document.createElement('span');
    m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding:.1em .08em .2em;margin:-.1em -.08em -.2em';
    w.replaceWith(m);
    m.appendChild(w);
  });
  lines.forEach((line, i) => {
    gsap.fromTo(line, { yPercent: 110 }, {
      yPercent: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

export function initReveals() {
  document.querySelectorAll('[data-split]').forEach(revealHeading);
  if (reduced) return;
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }),
  });
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

export function arrow(size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.5"/></svg>`;
}

// refresh triggers once fonts settle (line splits depend on metrics)
document.fonts?.ready.then(() => ScrollTrigger.refresh());
