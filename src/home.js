import { gsap, ScrollTrigger, reduced, lenis, initReveals, splitLines, arrow } from './main.js';
import { products, brands, photo } from './products-data.js';
import { mountToll } from './toll-anim.js';
import { renderForms } from './forms.js';

// ---------------------------------------------------------------- ECG line behind the headline
const ecg = document.querySelector('[data-ecg]');
const [ecgBase, ecgLive] = ecg.querySelectorAll('path');
const ecgDot = ecg.querySelector('circle');
let ecgLen = 0;

function beat(x, b, s) {
  return `L${x} ${b} Q${x + 10 * s} ${b - 14 * s} ${x + 20 * s} ${b} L${x + 30 * s} ${b} L${x + 36 * s} ${b + 12 * s} ` +
    `L${x + 48 * s} ${b - 96 * s} L${x + 60 * s} ${b + 38 * s} L${x + 68 * s} ${b} L${x + 90 * s} ${b} ` +
    `Q${x + 106 * s} ${b - 28 * s} ${x + 122 * s} ${b}`;
}
function drawEcg() {
  const w = ecg.clientWidth, h = ecg.clientHeight;
  // keep the whole trace inside its band: peak rises 96s above the baseline, trough dips 38s below
  const b = h * 0.62, s = Math.min((b - 4) / 96, (h - b - 4) / 38, w / 1100);
  ecg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const beats = w < 700 ? [0.72] : [0.6, 0.84];
  let d = `M0 ${b}`;
  beats.forEach((p) => { d += beat(w * p - 60 * s, b, s); });
  d += ` L${w} ${b}`;
  ecgBase.setAttribute('d', d);
  ecgLive.setAttribute('d', d);
  ecgLen = ecgLive.getTotalLength();
}
drawEcg();
window.addEventListener('resize', drawEcg);

let dotT = 0;
const runDot = () => gsap.ticker.add(() => {
  dotT = (dotT + 0.0022) % 1;
  const p = ecgLive.getPointAtLength(dotT * ecgLen);
  ecgDot.setAttribute('cx', p.x);
  ecgDot.setAttribute('cy', p.y);
});

// ---------------------------------------------------------------- intro
const loader = document.querySelector('[data-loader]');
const heroLines = document.querySelectorAll('[data-hero-title] .line-inner');
const heroFades = document.querySelectorAll('[data-hero-fade]');

function heroIn(delay = 0) {
  gsap.timeline({ delay })
    .fromTo(heroLines, { yPercent: 110 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12 })
    .fromTo(ecgLive, { strokeDasharray: ecgLen, strokeDashoffset: ecgLen }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', onComplete: () => { ecgLive.style.strokeDasharray = 'none'; } }, 0.1)
    .fromTo(heroFades, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0.5)
    .fromTo('[data-hero-frame] .slide.on', { scale: 1.2 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.2)
    .add(runDot, 1.6)
    .add(startSlides, 1.2);
}

let seen = false;
try { seen = sessionStorage.getItem('um-intro') === '1'; sessionStorage.setItem('um-intro', '1'); } catch { /* storage blocked */ }

if (reduced || seen) {
  loader.remove();
  if (reduced) { ecgDot.remove(); startSlides(); } else heroIn(0.1);
} else {
  lenis?.stop();
  const count = loader.querySelector('[data-count]');
  const c = { v: 0 };
  // the logo assembles: bars draw out, wordmark rises between them, script signs off
  gsap.timeline({ onComplete: () => { loader.remove(); lenis?.start(); } })
    .fromTo(loader.querySelectorAll('.lg-bar'), { scaleX: 0, svgOrigin: '0 0' }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut', stagger: 0.12 })
    .fromTo(loader.querySelector('.lg-word'), { y: 62 }, { y: 0, duration: 0.8, ease: 'expo.out' }, 0.45)
    .to(loader.querySelector('.loader-tag'), { opacity: 1, duration: 0.6 }, 0.9)
    .to(c, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(c.v)).padStart(3, '0'); } }, 0)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '+=0.2')
    .add(() => heroIn(0), '-=0.55');
}

// ---------------------------------------------------------------- hero product slideshow
const order = [products.find((p) => p.id === 'miodarone-200'), ...products.filter((p) => p.id !== 'miodarone-200')];
const slideBox = document.querySelector('[data-slides]');
const slides = [slideBox.querySelector('.slide')];
const capName = document.querySelector('[data-cap-name]');
const capGen = document.querySelector('[data-cap-gen]');
const capCount = document.querySelector('[data-cap-count]');
const bar = document.querySelector('[data-slide-bar]');
let cur = 0, timer = null, playing = false, busy = false, inView = true;

function ensure(i) {
  if (slides[i]) return slides[i];
  const p = order[i];
  const img = new Image();
  img.className = 'slide';
  img.src = photo(p.id);
  img.alt = `${p.brand} ${p.strength} pack and blister`;
  img.decoding = 'async';
  slideBox.appendChild(img);
  slides[i] = img;
  return img;
}

function setCaption(p, i) {
  capName.textContent = `${p.brand} ${p.strength}`;
  capGen.textContent = `${p.generic} · ${p.cls}`;
  capCount.textContent = `${String(i + 1).padStart(2, '0')} / ${order.length}`;
}

async function go(i) {
  if (busy) return;
  busy = true;
  i = (i + order.length) % order.length;
  const next = ensure(i), prev = slides[cur], p = order[i];
  ensure((i + 1) % order.length); // preload the one after
  await next.decode().catch(() => {});
  slideBox.appendChild(next); // newest on top
  if (reduced) {
    prev.classList.remove('on'); next.classList.add('on');
  } else {
    gsap.fromTo(next, { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 1.2, ease: 'expo.inOut', onComplete: () => { prev.classList.remove('on'); gsap.set(prev, { clearProps: 'clipPath' }); } });
    next.classList.add('on');
    // swap the caption as the new photo crosses the middle, so name and picture always match
    gsap.timeline()
      .to([capName, capGen], { yPercent: -30, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .add(() => setCaption(p, i), 0.5)
      .fromTo([capName, capGen], { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, 0.5);
  }
  if (reduced) setCaption(p, i);
  cur = i;
  setTimeout(() => { busy = false; }, reduced ? 0 : 1100);
  if (playing) schedule();
}

function schedule() {
  timer?.kill();
  if (!playing || reduced || !inView) return;
  timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 4.2, ease: 'none', onComplete: () => go(cur + 1) });
}
function startSlides() { if (!playing) { playing = true; schedule(); } }
document.querySelector('[data-next]').addEventListener('click', () => go(cur + 1));
document.querySelector('[data-prev]').addEventListener('click', () => go(cur - 1));
new IntersectionObserver(([e]) => {
  inView = e.isIntersecting;
  if (playing) inView ? schedule() : timer?.kill();
}).observe(slideBox.parentElement);

// ---------------------------------------------------------------- brand showcase rail (tints to the active brand)
const railSec = document.querySelector('[data-rail-sec]');
const rail = document.querySelector('[data-rail]');
rail.innerHTML = brands.map((b) => `
  <a class="bcard" href="products.html#p-${b.hero.id}" style="--accent:${b.hero.accent}">
    <div class="bcard-img"><img src="${photo(b.hero.id, true)}" alt="${b.brand} pack and blister" loading="lazy" /></div>
    <div class="bcard-body">
      <span class="cls">${b.cls}</span>
      <h3>${b.brand}</h3>
      <p class="gen">${b.generic}</p>
      <div class="row"><div class="doses">${b.skus.map((s) => `<span>${s.strength}</span>`).join('')}</div><span class="mono" style="opacity:.6">${b.skus[0].pack}</span></div>
    </div></a>`).join('') +
  `<a class="bcard bcard--end" href="products.html"><span class="mono">Full portfolio</span><div><h3>15 formulations, 9 brands</h3><p style="margin-top:14px;opacity:.85">Browse by indication, strength and pack.</p></div><span class="btn btn--light" style="align-self:flex-start">View all<span class="btn-ico">${arrow()}</span></span></a>`;

let tintIdx = -1;
const tint = (i) => {
  i = Math.max(0, Math.min(brands.length - 1, i));
  if (i === tintIdx) return;
  tintIdx = i;
  railSec.style.setProperty('--tint', brands[i].hero.accent);
};
tint(0);

const mm = gsap.matchMedia();
mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
  // Pin, hold still for a beat so every card is fully readable, then scroll sideways.
  const dist = () => rail.scrollWidth - window.innerWidth;
  const hold = () => window.innerHeight * 0.45;
  const tl = gsap.timeline({
    scrollTrigger: {
      // If the section is taller than the window, pin only once its bottom (the full cards) is in view.
      trigger: railSec, start: () => `top+=${Math.max(0, railSec.offsetHeight - window.innerHeight)} top`, end: () => `+=${hold() + dist()}`,
      pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st) => {
        const h = Math.max(0, Math.min(1, (st.progress * (hold() + dist()) - hold()) / dist()));
        gsap.set('[data-rail-progress]', { scaleX: h });
        tint(Math.round(h * brands.length - 0.3));
      },
    },
  });
  tl.to({}, { duration: () => hold() })
    .to(rail, { x: () => -dist(), ease: 'none', duration: () => dist() });
});
mm.add('(max-width: 760px), (prefers-reduced-motion: reduce)', () => {
  const sc = rail.parentElement;
  sc.style.overflowX = 'auto';
  rail.style.paddingBottom = '10px';
  const onS = () => tint(Math.round(sc.scrollLeft / (rail.firstElementChild.offsetWidth + 18)));
  sc.addEventListener('scroll', onS, { passive: true });
  return () => sc.removeEventListener('scroll', onS);
});

// ---------------------------------------------------------------- toll manufacturing
mountToll(document.querySelector('[data-toll]'));
renderForms(document.querySelector('[data-forms]'));

// ---------------------------------------------------------------- manifesto word reveal
const manifesto = document.querySelector('[data-manifesto]');
const mWords = splitLines(manifesto);
if (!reduced) {
  gsap.to(mWords, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: manifesto, start: 'top 78%', end: 'bottom 62%', scrub: true } });
}

// ---------------------------------------------------------------- counters
document.querySelectorAll('[data-counter]').forEach((el) => {
  const to = +el.dataset.counter;
  if (reduced) { el.textContent = to; return; }
  const o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
    onEnter: () => gsap.to(o, { v: to, duration: 2, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
});

// ---------------------------------------------------------------- distribution map
// Rough Pakistan outline (lon, lat) used only to clip the dot matrix.
const outline = [[61.6,25.2],[62.3,25.1],[63.5,25.2],[64.5,25.2],[65.7,25.4],[66.6,25.4],[67.0,24.8],[67.5,23.9],[68.8,23.9],[69.6,24.2],[71.1,24.4],[70.9,25.2],[70.2,25.7],[70.1,26.5],[69.6,27.0],[70.6,27.7],[71.9,27.9],[72.4,28.8],[73.4,29.9],[74.0,30.4],[74.5,31.1],[74.6,32.0],[75.0,32.5],[74.6,32.8],[73.9,33.0],[74.0,34.0],[75.5,34.6],[77.0,35.0],[77.8,35.5],[76.0,36.6],[75.2,37.0],[74.6,37.0],[73.7,36.9],[72.5,36.8],[71.4,36.1],[71.6,35.6],[71.3,35.0],[71.1,34.4],[69.9,34.0],[70.3,33.4],[69.5,33.0],[69.3,31.9],[68.2,31.8],[67.4,31.2],[66.4,30.9],[66.3,29.9],[64.0,29.5],[62.5,29.4],[60.9,29.9],[60.9,29.4],[61.9,28.6],[62.8,28.3],[62.8,27.3],[63.3,27.2],[63.2,26.6],[62.3,26.5],[61.6,25.2]];
const proj = ([lon, lat]) => [((lon - 60.5) / 17.5) * 600, ((37.4 - lat) / 13.8) * 520];
const poly = outline.map(proj);
const inside = (x, y) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const hubs = [
  { name: 'Peshawar (KPK)', short: 'Peshawar', n: 7, ll: [71.58, 34.01], dx: -10, dy: -6, anchor: 'end' },
  { name: 'Abbottabad', n: 6, ll: [73.22, 34.15], dx: 10, dy: -8 },
  { name: 'Rawalpindi', n: 6, ll: [72.95, 33.62], dx: -10, dy: 12, anchor: 'end' },
  { name: 'Gujranwala', n: 3, ll: [74.19, 32.16], dx: 10 },
  { name: 'Lahore', n: 2, ll: [74.35, 31.55], dx: 10, dy: 8 },
  { name: 'Faisalabad', n: 1, ll: [73.08, 31.42], dx: -10, anchor: 'end' },
  { name: 'D.I. Khan', n: 2, ll: [70.9, 31.83], dx: -10, anchor: 'end' },
  { name: 'Multan', n: 6, ll: [71.47, 30.16], dx: 10 },
  { name: 'Quetta', n: 1, ll: [67.0, 30.18], dx: -10, anchor: 'end' },
  { name: 'Sukkur', n: 1, ll: [68.86, 27.7], dx: 10 },
];
const hq = proj([73.25, 33.48]);
const map = document.querySelector('[data-dist-map]');
let svg = '';
for (let y = 6; y < 520; y += 13) for (let x = 6; x < 600; x += 13) if (inside(x, y)) svg += `<circle class="dot" cx="${x}" cy="${y}" r="2.2"/>`;
hubs.forEach((h, i) => {
  const [x, y] = proj(h.ll);
  const mx = (x + hq[0]) / 2 - (y - hq[1]) * 0.25, my = (y + hq[1]) / 2 + (x - hq[0]) * 0.25;
  svg += `<path class="route" d="M${hq[0]} ${hq[1]} Q${mx} ${my} ${x} ${y}"/>`;
  svg += `<g class="city" data-city="${i}"><circle class="ring" cx="${x}" cy="${y}" r="5" style="animation-delay:${(i * 0.27).toFixed(2)}s"/><circle class="core" cx="${x}" cy="${y}" r="4"/><text x="${x + (h.dx || 10)}" y="${y + (h.dy || 0) + 4}" text-anchor="${h.anchor || 'start'}">${h.short || h.name}</text></g>`;
});
svg += `<g class="city hq"><circle class="ring" cx="${hq[0]}" cy="${hq[1]}" r="7"/><circle class="core" cx="${hq[0]}" cy="${hq[1]}" r="6"/><text x="${hq[0] + 12}" y="${hq[1] + 18}">Rawat HQ</text></g>`;
map.innerHTML = svg;

const list = document.querySelector('[data-dist-list]');
list.innerHTML = hubs.map((h, i) => `<li data-hub="${i}">${h.name}<b>${String(h.n).padStart(2, '0')}</b></li>`).join('') + '<li>Institutional<b>05</b></li>';
list.querySelectorAll('[data-hub]').forEach((li) => {
  const g = map.querySelector(`[data-city="${li.dataset.hub}"]`);
  li.addEventListener('mouseenter', () => g.classList.add('on'));
  li.addEventListener('mouseleave', () => g.classList.remove('on'));
});
if (!reduced) {
  map.querySelectorAll('.route').forEach((r) => {
    const l = r.getTotalLength();
    gsap.fromTo(r, { strokeDasharray: `${l}`, strokeDashoffset: l }, {
      strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: map, start: 'top 70%', once: true },
      onComplete: () => { r.style.strokeDasharray = ''; r.style.strokeDashoffset = ''; },
    });
  });
  gsap.from(map.querySelectorAll('.dot'), { opacity: 0, duration: 0.8, stagger: { amount: 1, from: 'random' }, scrollTrigger: { trigger: map, start: 'top 80%', once: true } });
}

// ---------------------------------------------------------------- headings & fades (after fonts, so line breaks are real)
Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
  initReveals();
  ScrollTrigger.refresh();
});
