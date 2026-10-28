// Dosage forms offered to toll-manufacturing partners (one per production section).
const ico = {
  tablet: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="22" cy="18" rx="15" ry="6"/><path d="M7 18v6c0 3.3 6.7 6 15 6s15-2.7 15-6v-6"/><path d="M15 18h14"/></svg>',
  capsule: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="15" width="32" height="14" rx="7" transform="rotate(-35 22 22)"/><path d="M18 14l8 16" /></svg>',
  sachet: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 9l3 2 3-2 3 2 3-2 3 2 3-2 3 2 3-2v26H10z"/><path d="M16 22h12M16 27h8"/></svg>',
  tube: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 36h20l-3-24H15z"/><rect x="18" y="6" width="8" height="6" rx="1.5"/><path d="M12 31h20"/></svg>',
  volume: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="15" cy="16" rx="8" ry="3.5"/><ellipse cx="29" cy="16" rx="8" ry="3.5"/><ellipse cx="22" cy="27" rx="8" ry="3.5"/><path d="M7 16v3c0 2 3.6 3.5 8 3.5M37 16v3c0 2-3.6 3.5-8 3.5M14 27v3c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5v-3"/></svg>',
  vial: '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="16" y="6" width="12" height="6" rx="1.5"/><path d="M17 12h10v4l3 4v16a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20l3-4z"/><path d="M14 26h16"/></svg>',
};

export const forms = [
  { t: 'Tablets', d: 'Direct compression, wet granulation, effervescent and bilayer.', i: 'tablet' },
  { t: 'Capsules', d: 'Hard gelatin and vegetable shells, volumetric filling.', i: 'capsule' },
  { t: 'Sachets', d: 'Powders and granules on multi-track packers.', i: 'sachet' },
  { t: 'Creams & ointments', d: 'Semi-solid compounding and tube filling.', i: 'tube' },
  { t: 'High-volume tablets', d: 'Dedicated Tablet-2 line for large commercial batches.', i: 'volume' },
  { t: 'Dry powder injection', d: 'Sterile powder filling for parenteral vials.', i: 'vial' },
];

export function renderForms(el) {
  el.innerHTML = forms.map((f) => `<div class="form-card" data-fade>${ico[f.i]}<div><h3>${f.t}</h3><p>${f.d}</p></div></div>`).join('');
}
