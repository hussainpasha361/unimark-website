import { gsap, ScrollTrigger, reduced, lenis, initReveals } from './main.js';
import { groups, products, photo } from './products-data.js';

const grid = document.querySelector('[data-grid]');
const chips = document.querySelector('[data-chips]');
const search = document.querySelector('[data-search]');
const empty = document.querySelector('[data-empty]');
const drawer = document.querySelector('[data-drawer]');
const drawerBody = document.querySelector('[data-drawer-body]');

// Deep links use the hash (#g-angina, #p-uniplat-75) so they survive hosts that drop query strings.
const params = new URLSearchParams(location.search);
const hash = location.hash.slice(1);
const fromHash = (prefix) => (hash.startsWith(prefix) ? hash.slice(prefix.length) : null);
const wanted = fromHash('g-') || params.get('g');
let group = groups.some((g) => g.id === wanted) ? wanted : 'all';
let query = '';

chips.innerHTML = groups.map((g) => {
  const n = g.id === 'all' ? products.length : products.filter((p) => p.group === g.id).length;
  return `<button class="chip" data-g="${g.id}" aria-pressed="${g.id === group}">${g.label}<small>${n}</small></button>`;
}).join('');

function render() {
  const q = query.trim().toLowerCase();
  const list = products
    .map((p, i) => ({ ...p, i }))
    .filter((p) => (group === 'all' || p.group === group) && (!q || `${p.brand} ${p.generic} ${p.cls}`.toLowerCase().includes(q)));
  grid.innerHTML = list.map((p) => `
    <button class="gcard" data-i="${p.i}" style="--accent:${p.accent}">
      <div class="gcard-img"><img src="${photo(p.id, true)}" alt="" loading="lazy" /></div>
      <div class="gcard-body">
        <span class="cls">${p.cls}</span>
        <h3>${p.brand}<span>${p.strength}</span></h3>
        <p class="gen">${p.generic}</p>
      </div>
    </button>`).join('');
  empty.hidden = list.length > 0;
  if (!reduced) gsap.fromTo(grid.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 });
  ScrollTrigger.refresh();
}

chips.addEventListener('click', (e) => {
  const b = e.target.closest('[data-g]');
  if (!b) return;
  group = b.dataset.g;
  chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
  try { history.replaceState(null, '', group === 'all' ? location.pathname : `#g-${group}`); } catch { /* sandboxed frame */ }
  render();
});
search.addEventListener('input', () => { query = search.value; render(); });

let lastFocus = null;
function open(i) {
  const p = products[i];
  lastFocus = document.activeElement;
  drawerBody.innerHTML = `
    <div class="drawer-img"><img src="${photo(p.id)}" alt="${p.brand} ${p.strength} pack and blister" /></div>
    <div class="drawer-body">
      <span class="eyebrow">${p.cls}</span>
      <h2 id="dr-title">${p.brand} <span>${p.strength}</span></h2>
      <p>${p.text}</p>
      <dl>
        <dt>Composition</dt><dd>${p.generic} ${p.strength}</dd>
        <dt>Dosage form</dt><dd>Tablet</dd>
        <dt>Pack</dt><dd>${p.pack}</dd>
        <dt>Therapy area</dt><dd>Cardiology · ${groups.find((g) => g.id === p.group).label}</dd>
        <dt>Pricing</dt><dd>SRO regulated</dd>
      </dl>
      <p class="note">Prescription medicine. Refer to the approved prescribing information before use. To report an adverse event, contact info@unimarkpharmaceutical.com.</p>
    </div>`;
  drawer.querySelector('.drawer-panel').style.setProperty('--accent', p.accent);
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  lenis?.stop();
  drawer.querySelector('.drawer-close').focus();
}
function close() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  lenis?.start();
  lastFocus?.focus();
}
grid.addEventListener('click', (e) => { const c = e.target.closest('[data-i]'); if (c) open(+c.dataset.i); });
drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });

render();
const deep = fromHash('p-') || params.get('p');
if (deep) {
  const i = products.findIndex((p) => p.id === deep);
  if (i > -1) setTimeout(() => open(i), 400);
}

Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
  initReveals();
  ScrollTrigger.refresh();
});
