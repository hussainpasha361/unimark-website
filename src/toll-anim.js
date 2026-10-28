import { gsap, ScrollTrigger, reduced } from './main.js';

// "From molecule to medicine": a scroll-scrubbed SVG story of a partner's API
// becoming a cartoned, QC-released product. Everything is drawn in code so it
// stays crisp and light (no video, no 3D) on mid-range phones.

export const stages = [
  { t: 'Active ingredient', d: 'Your API and excipients are received, quarantined and released by QC before dispensing.' },
  { t: 'Blending & granulation', d: 'Validated mixing and granulation build a uniform, free-flowing blend.' },
  { t: 'Compression', d: 'Euro-B/D tooling presses every tablet to target weight, hardness and thickness.' },
  { t: 'Film coating', d: 'Controlled spray coating for stability, taste-masking and a premium finish.' },
  { t: 'Blister packing', d: 'Blistering with in-line inspection, batch coding and expiry printing.' },
  { t: 'Your brand, released', d: 'Cartoned in your artwork, QC-released with full documentation, ready to ship.' },
];

const CREAM = '#f2efe7';
const RED = '#c4161c';
const COAT = '#b3121a';
const rand = (a, b) => a + Math.random() * (b - a);

function tablet(cls, coated = false) {
  const top = coated ? COAT : '#ebe6db';
  const side = coated ? '#7d0b10' : 'url(#tabSide)';
  return `<g class="${cls}">
    <path class="tab-side" d="M-50 0 L-50 14 A50 16 0 0 0 50 14 L50 0 Z" fill="${side}"/>
    <ellipse class="tab-top" cx="0" cy="0" rx="50" ry="16" fill="${top}" stroke="rgba(0,0,0,.12)"/>
    <text x="0" y="5" text-anchor="middle" font-family="Inter Tight, sans-serif" font-weight="800" font-size="16" transform="scale(1 .42)" fill="${coated ? '#8e0c12' : '#cfc7b6'}" class="tab-mark">U</text>
    <ellipse class="tab-gloss" cx="-14" cy="-6" rx="24" ry="4.5" fill="#fff" opacity="${coated ? 0.55 : 0}"/>
  </g>`;
}

function buildSvg() {
  // molecule: an aromatic ring with side chains (stylised, not a specific API)
  const cx = 400, cy = 210, R = 58;
  const ring = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 6;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
  const extra = [
    [ring[0][0] + 52, ring[0][1] - 22, 0], [ring[0][0] + 96, ring[0][1] + 6, 0],
    [ring[2][0] - 2, ring[2][1] + 58, 2], [ring[3][0] - 52, ring[3][1] + 24, 3],
    [ring[4][0] - 50, ring[4][1] - 26, 4], [ring[5][0] + 8, ring[5][1] - 56, 5],
  ];
  const atoms = [...ring.map((p) => [...p, false]), ...extra.map(([x, y]) => [x, y, true])];
  let bonds = ring.map((p, k) => `<line x1="${p[0]}" y1="${p[1]}" x2="${ring[(k + 1) % 6][0]}" y2="${ring[(k + 1) % 6][1]}"/>`).join('');
  bonds += `<line x1="${ring[0][0]}" y1="${ring[0][1]}" x2="${extra[0][0]}" y2="${extra[0][1]}"/><line x1="${extra[0][0]}" y1="${extra[0][1]}" x2="${extra[1][0]}" y2="${extra[1][1]}"/>`;
  extra.slice(2).forEach(([x, y, k]) => { bonds += `<line x1="${ring[k][0]}" y1="${ring[k][1]}" x2="${x}" y2="${y}"/>`; });
  const atomEls = atoms.map(([x, y, het], i) => `<circle cx="${x}" cy="${y}" r="${het ? 10 : 8}" fill="${het && i % 2 ? RED : CREAM}"/>`).join('');

  // particles start clustered on the atoms
  const N = 70;
  const parts = Array.from({ length: N }, (_, k) => {
    const [ax, ay] = atoms[k % atoms.length];
    const api = k % 3 === 0;
    return `<circle class="pt" cx="${(ax + rand(-9, 9)).toFixed(1)}" cy="${(ay + rand(-9, 9)).toFixed(1)}" r="${rand(3.2, 5.8).toFixed(1)}" fill="${api ? RED : CREAM}" opacity="0"/>`;
  }).join('');

  // blister cavities: 2 × 5
  const cav = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) cav.push([262 + c * 69, 300 + r * 66]);
  const cavEls = cav.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="27" ry="22" fill="rgba(255,255,255,.05)" stroke="rgba(242,239,231,.35)"/>`).join('');
  const minis = cav.slice(1).map(([x, y]) => `<g transform="translate(${x} ${y})"><g class="mini-wrap">${tablet('mini', true)}</g></g>`).join('');

  const spray = Array.from({ length: 34 }, () => `<circle class="sp" cx="232" cy="150" r="${rand(1.2, 2.6).toFixed(1)}" fill="${COAT}" opacity="0"/>`).join('');

  return `
  <svg class="toll-svg" viewBox="110 50 600 510" role="img" aria-label="Animation: an active ingredient is blended, compressed into a tablet, coated, blister-packed and cartoned">
    <defs>
      <linearGradient id="tabSide" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9d3c6"/><stop offset="1" stop-color="#b8b0a0"/></linearGradient>
      <linearGradient id="foil" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#c9cdd2"/><stop offset=".45" stop-color="#f4f5f6"/><stop offset=".55" stop-color="#e3e6e9"/><stop offset="1" stop-color="#a9afb6"/></linearGradient>
      <pattern id="emboss" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="rgba(0,0,0,.12)"/></pattern>
      <radialGradient id="flash"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>

    <g class="mol"><g class="mol-bonds" stroke="${CREAM}" stroke-width="3" stroke-linecap="round">${bonds}</g>
      <circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${CREAM}" stroke-width="2" stroke-dasharray="6 6" class="mol-ring"/>
      <g class="mol-atoms">${atomEls}</g>
      <text x="${cx}" y="${cy + 150}" text-anchor="middle" class="svg-label">API · C<tspan baseline-shift="sub" font-size="9">x</tspan>H<tspan baseline-shift="sub" font-size="9">y</tspan>N<tspan baseline-shift="sub" font-size="9">z</tspan></text>
    </g>

    <g class="vessel" opacity="0" stroke="${CREAM}" stroke-width="3" fill="none" stroke-linecap="round">
      <path class="vessel-body" d="M262 330 L262 452 Q262 506 316 506 L484 506 Q538 506 538 452 L538 330"/>
      <line x1="246" y1="330" x2="554" y2="330" stroke-width="2" opacity=".5"/>
      <g class="impeller"><line x1="400" y1="300" x2="400" y2="478"/><path d="M352 478 L448 478 M366 456 L434 456" stroke-width="5"/></g>
      <text x="400" y="540" text-anchor="middle" class="svg-label" stroke="none">High-shear granulator</text>
    </g>

    <g class="press" opacity="0">
      <g class="punch"><rect x="350" y="70" width="100" height="26" rx="4" fill="#3a3a3a" stroke="${CREAM}" stroke-opacity=".4"/><rect x="372" y="96" width="56" height="150" fill="#d9d9d9"/><rect x="372" y="236" width="56" height="10" fill="${RED}"/></g>
      <rect x="290" y="400" width="220" height="64" rx="6" fill="#2a2a2a" stroke="${CREAM}" stroke-opacity=".35"/>
      <rect x="350" y="400" width="100" height="22" fill="#0b0b0b"/>
      <text x="400" y="500" text-anchor="middle" class="svg-label">Rotary tablet press · Euro-B/D tooling</text>
      <circle class="flash" cx="400" cy="400" r="90" fill="url(#flash)" opacity="0"/>
    </g>

    <g class="nozzle" opacity="0"><path d="M170 112 L222 140 L214 156 L162 128 Z" fill="#e6e2d8"/><rect x="138" y="94" width="38" height="34" rx="5" fill="#8a8a8a" stroke="#f2efe7" stroke-opacity=".5" transform="rotate(28 157 111)"/><line x1="100" y1="80" x2="150" y2="104" stroke="#f2efe7" stroke-opacity=".5" stroke-width="3"/>${spray}
      <text x="400" y="420" text-anchor="middle" class="svg-label">Perforated pan coater</text></g>

    <g class="blister" opacity="0">
      <rect x="214" y="256" width="372" height="154" rx="16" fill="rgba(255,255,255,.04)" stroke="rgba(242,239,231,.5)"/>
      ${cavEls}${minis}
      <g class="foil"><rect x="214" y="256" width="372" height="154" rx="16" fill="url(#foil)"/><rect x="214" y="256" width="372" height="154" rx="16" fill="url(#emboss)"/>
        <text x="400" y="340" text-anchor="middle" class="svg-foil">BATCH UM-2611 · MFG 10/26 · EXP 10/28</text></g>
    </g>

    <g class="tab-move"><g class="tab" transform="translate(400 405) scale(.7)" opacity="0">${tablet('main')}</g></g>

    <g class="carton" opacity="0">
      <path d="M560 250 L604 214 L604 398 L560 434 Z" fill="#d6d3cc"/>
      <path class="lid" d="M216 250 L260 214 L604 214 L560 250 Z" fill="#ebe8e1"/>
      <rect class="flap" x="216" y="172" width="344" height="78" fill="#f4f2ec" stroke="rgba(0,0,0,.08)"/>
      <rect x="216" y="250" width="344" height="184" fill="#fbfaf6"/>
      <rect x="216" y="250" width="30" height="184" fill="${RED}"/>
      <text x="270" y="312" font-family="Inter Tight, sans-serif" font-weight="800" font-size="34" fill="#111" letter-spacing="-1">YOUR BRAND</text>
      <text x="271" y="340" font-family="Inter Tight, sans-serif" font-size="15" fill="#444">Tablets 50 mg · 30's</text>
      <line x1="270" y1="364" x2="540" y2="364" stroke="#111" stroke-width="1"/>
      <text x="271" y="392" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing=".08em" fill="#666">MANUFACTURED BY</text>
      <g transform="translate(271 400)"><rect width="92" height="4" fill="${RED}"/><text y="20" font-family="Inter Tight, sans-serif" font-weight="800" font-size="18" fill="#111" textLength="92" lengthAdjust="spacingAndGlyphs">UniMark</text><rect y="24" width="92" height="4" fill="${RED}"/></g>
    </g>

    <g transform="translate(600 440)"><g class="stamp" opacity="0">
      <circle r="56" fill="rgba(196,22,28,.14)" stroke="${RED}" stroke-width="3"/><circle r="47" fill="none" stroke="${RED}" stroke-width="1" stroke-dasharray="3 4"/>
      <text y="-8" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" letter-spacing=".12em" fill="${RED}" font-weight="500">QC</text>
      <text y="10" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing=".1em" fill="${RED}" font-weight="500">RELEASED</text>
      <path d="M-12 24 L-3 32 L14 18" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round"/>
    </g></g>

    <g class="pts">${parts}</g>
  </svg>`;
}

export function mountToll(root) {
  const stageEl = root.querySelector('[data-toll-stage]');
  const list = root.querySelector('[data-toll-steps]');
  const num = root.querySelector('[data-toll-num]');
  const bar = root.querySelector('[data-toll-bar]');
  stageEl.innerHTML = buildSvg();
  list.innerHTML = stages.map((s, i) => `<li${i === 0 ? ' class="on"' : ''}><span class="mono">${String(i + 1).padStart(2, '0')}</span><div><h3>${s.t}</h3><p>${s.d}</p></div></li>`).join('');

  const svg = stageEl.querySelector('svg');
  const q = (s) => svg.querySelectorAll(s);
  const pts = [...q('.pt')];
  const items = [...list.children];

  const setStep = (i) => {
    items.forEach((li, j) => li.classList.toggle('on', j === i));
    if (num) num.textContent = String(i + 1).padStart(2, '0');
  };

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, paused: true });

  // 1 · molecule dissolves into API/excipient particles that fall into the granulator
  tl.addLabel('s0', 0)
    .to(q('.mol-bonds, .mol-ring, .mol .svg-label'), { opacity: 0, duration: 0.3 }, 0.05)
    .to(q('.mol-atoms'), { opacity: 0, duration: 0.2 }, 0.15)
    .to(pts, { opacity: 1, duration: 0.15, stagger: { amount: 0.1 } }, 0.1)
    .to(q('.vessel'), { opacity: 1, duration: 0.3 }, 0.3)
    .to(pts, { attr: { cx: () => rand(285, 515), cy: () => rand(400, 494) }, duration: 0.6, ease: 'power2.in', stagger: { amount: 0.25, from: 'random' } }, 0.35);

  // 2 · blend: two swirl passes, then clump into granules
  const gran = Array.from({ length: 14 }, (_, k) => [300 + (k % 7) * 33 + rand(-6, 6), 452 + Math.floor(k / 7) * 26 + rand(-4, 4)]);
  tl.addLabel('s1', 1.2)
    .to(q('.impeller'), { scaleX: -1, svgOrigin: '400 400', duration: 0.18, repeat: 5, yoyo: true, ease: 'none' }, 1.2)
    .to(pts, { attr: { cx: () => rand(285, 515), cy: () => rand(360, 494) }, duration: 0.35, stagger: { amount: 0.1, from: 'random' } }, 1.2)
    .to(pts, { attr: { cx: () => rand(285, 515), cy: () => rand(380, 494) }, duration: 0.35, stagger: { amount: 0.1, from: 'random' } }, 1.55)
    .to(pts, { attr: { cx: (i) => gran[i % 14][0] + rand(-4, 4), cy: (i) => gran[i % 14][1] + rand(-3, 3) }, fill: '#e9d6cf', duration: 0.4 }, 1.95);

  // 3 · compression: granules feed the die, the punch strikes, a tablet is ejected
  tl.addLabel('s2', 2.4)
    .to(q('.vessel'), { opacity: 0, duration: 0.25 }, 2.4)
    .to(q('.press'), { opacity: 1, duration: 0.25 }, 2.45)
    .to(pts, { attr: { cx: () => rand(360, 440), cy: () => rand(402, 418), r: 2 }, duration: 0.35 }, 2.5)
    .to(q('.punch'), { y: 154, duration: 0.25, ease: 'power3.in' }, 2.85)
    .to(pts, { opacity: 0, duration: 0.05 }, 3.08)
    .to(q('.flash'), { opacity: 1, duration: 0.06, yoyo: true, repeat: 1 }, 3.08)
    .to(q('.tab'), { opacity: 1, duration: 0.05 }, 3.1)
    .to(q('.punch'), { y: 0, duration: 0.25, ease: 'power2.out' }, 3.15)
    .to(q('.tab'), { attr: { transform: 'translate(400 270) scale(1.7)' }, duration: 0.35, ease: 'back.out(1.6)' }, 3.2)
    .to(q('.press'), { opacity: 0, duration: 0.2 }, 3.4);

  // 4 · film coating
  tl.addLabel('s3', 3.6)
    .to(q('.nozzle'), { opacity: 1, duration: 0.2 }, 3.6)
    .fromTo(q('.sp'), { attr: { cx: 232, cy: 150 }, opacity: 0 },
      { attr: { cx: () => rand(330, 470), cy: () => rand(240, 300) }, opacity: 1, duration: 0.3, stagger: { amount: 0.5, repeat: 0 }, ease: 'power1.out' }, 3.7)
    .to(q('.sp'), { opacity: 0, duration: 0.15, stagger: { amount: 0.5 } }, 3.95)
    .to(q('.main .tab-top'), { fill: COAT, duration: 0.5 }, 3.8)
    .to(q('.main .tab-side'), { fill: '#7d0b10', duration: 0.5 }, 3.8)
    .to(q('.main .tab-mark'), { fill: '#8e0c12', duration: 0.5 }, 3.8)
    .to(q('.main .tab-gloss'), { opacity: 0.55, duration: 0.4 }, 4.0)
    .to(q('.nozzle'), { opacity: 0, duration: 0.2 }, 4.4);

  // 5 · blister: tablet drops into cavity 1, the rest fill, foil seals
  tl.addLabel('s4', 4.8)
    .to(q('.blister'), { opacity: 1, duration: 0.25 }, 4.8)
    .to(q('.tab'), { attr: { transform: 'translate(262 300) scale(.44)' }, duration: 0.45 }, 4.85)
    .fromTo(q('.mini-wrap'), { scale: 0, svgOrigin: '0 0' }, { scale: 0.44, duration: 0.2, stagger: 0.05, ease: 'back.out(2)' }, 5.2)
    .fromTo(q('.foil'), { scaleX: 0, opacity: 0, svgOrigin: '214 0' }, { scaleX: 1, opacity: 0.95, duration: 0.4 }, 5.7);

  // 6 · cartoning and QC release
  tl.addLabel('s5', 6.2)
    .to(q('.blister, .tab-move'), { x: -150, scale: 0.62, svgOrigin: '400 330', duration: 0.35 }, 6.2)
    .fromTo(q('.carton'), { x: 160 }, { x: 40, duration: 0.4 }, 6.25)
    .fromTo(q('.carton'), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, 6.25)
    .to(q('.blister, .tab-move'), { x: 120, duration: 0.45, ease: 'power2.in' }, 6.65)
    .to(q('.blister, .tab-move'), { opacity: 0, duration: 0.05 }, 7.05)
    .fromTo(q('.flap'), { scaleY: 1, svgOrigin: '0 250' }, { scaleY: 0, duration: 0.3 }, 7.1)
    .fromTo(q('.lid'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 7.25)
    .fromTo(q('.stamp'), { opacity: 0, scale: 2.4, rotation: -30, svgOrigin: '0 0' }, { opacity: 1, scale: 1, rotation: -12, duration: 0.35, ease: 'back.out(2)' }, 7.45)
    .to({}, { duration: 0.4 });

  const bounds = [0, 1.2, 2.4, 3.6, 4.8, 6.2, Infinity];
  const stepAt = (t) => bounds.findIndex((b, i) => t >= b && t < bounds[i + 1]);

  if (reduced) {
    tl.progress(1);
    items.forEach((li) => li.classList.add('on'));
    return;
  }

  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: () => `+=${window.innerHeight * 5}`,
    pin: root.querySelector('[data-toll-pin]') || true,
    scrub: 0.8,
    animation: tl,
  });
  // follow the scrubbed timeline itself, so the caption never lags the picture
  tl.eventCallback('onUpdate', () => {
    setStep(stepAt(tl.time()));
    if (bar) bar.style.transform = `scaleX(${tl.progress()})`;
  });
}
