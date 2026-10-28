// Source: Unimark product flyer (Jun 2026) + unimarkpharmaceutical.com/products.
// `accent` is sampled from each product's scene photo and tints its card/drawer.
export const groups = [
  { id: 'all', label: 'All' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'angina', label: 'Angina & coronary' },
  { id: 'lipids', label: 'Lipid lowering' },
  { id: 'rhythm', label: 'Rhythm control' },
  { id: 'antiplatelet', label: 'Antiplatelet' },
];

export const products = [
  { id: 'carsel-25', brand: 'Carsel', strength: '25 mg', generic: 'Metoprolol Tartrate B.P.', cls: 'Beta-blocker', group: 'hypertension', pack: '30 tablets', accent: '#2f7bc7',
    text: 'Management of hypertension, angina pectoris, cardiac rhythm disturbances, myocardial infarction, functional heart disease, congestive heart failure, hyperthyroidism and migraine prevention.' },
  { id: 'carsel-50', brand: 'Carsel', strength: '50 mg', generic: 'Metoprolol Tartrate B.P.', cls: 'Beta-blocker', group: 'hypertension', pack: '30 tablets', accent: '#b15930',
    text: 'Therapeutic management of hypertension, angina pectoris, cardiac rhythm disturbances, myocardial infarction and functional cardiovascular disorders.' },
  { id: 'carsel-100', brand: 'Carsel', strength: '100 mg', generic: 'Metoprolol Tartrate B.P.', cls: 'Beta-blocker', group: 'hypertension', pack: '30 tablets', accent: '#b8873f',
    text: 'High-strength selective beta-blocker for maintenance in severe hypertension, secondary prevention after myocardial infarction and chronic angina prophylaxis.' },
  { id: 'carsel-plus-50', brand: 'Carsel Plus', strength: '50 / 25 mg', generic: 'Metoprolol Tartrate + Hydrochlorothiazide', cls: 'Beta-blocker + diuretic', group: 'hypertension', pack: '30 tablets', accent: '#ae4a12',
    text: 'Fixed-dose combination for initial or secondary therapy of hypertension, including high-risk patients with renal disease, heart failure or diabetes mellitus.' },
  { id: 'carsel-plus-100', brand: 'Carsel Plus', strength: '100 / 25 mg', generic: 'Metoprolol Tartrate + Hydrochlorothiazide', cls: 'Beta-blocker + diuretic', group: 'hypertension', pack: '30 tablets', accent: '#3f8a2e',
    text: 'Combines a cardioselective beta-blocker with a thiazide diuretic for comprehensive blood pressure control.' },
  { id: 'jesper-50', brand: 'Jesper', strength: '50 mg', generic: 'Losartan Potassium', cls: 'ARB', group: 'hypertension', pack: '20 tablets', accent: '#ae171f',
    text: 'Angiotensin II receptor antagonist for first-line treatment of hypertension, nephropathy in type 2 diabetes and risk reduction in left ventricular hypertrophy.' },
  { id: 'jesper-plus', brand: 'Jesper Plus', strength: '50 / 12.5 mg', generic: 'Losartan Potassium + Hydrochlorothiazide', cls: 'ARB + diuretic', group: 'hypertension', pack: '20 tablets', accent: '#287d35',
    text: 'Combination therapy for severe or resistant hypertension, stroke risk reduction and management of left ventricular hypertrophy.' },
  { id: 'kolmark-10', brand: 'Kolmark', strength: '10 mg', generic: 'Atorvastatin', cls: 'Statin', group: 'lipids', pack: '10 tablets', accent: '#277236',
    text: 'HMG-CoA reductase inhibitor, adjunct to diet to reduce total cholesterol, LDL-C, apolipoprotein-B and triglycerides.' },
  { id: 'kolmark-20', brand: 'Kolmark', strength: '20 mg', generic: 'Atorvastatin', cls: 'Statin', group: 'lipids', pack: '10 tablets', accent: '#b95919',
    text: 'Lipid-regulating agent to slow progression of coronary atherosclerosis in high-risk patients unresponsive to diet alone.' },
  { id: 'miodarone-200', brand: 'Miodarone', strength: '200 mg', generic: 'Amiodarone HCl B.P.', cls: 'Antiarrhythmic', group: 'rhythm', pack: '30 tablets', accent: '#a6191e',
    text: 'Antiarrhythmic for severe atrial, nodal and ventricular rhythm disorders, including WPW-associated arrhythmias and ventricular fibrillation.' },
  { id: 'monosor-20', brand: 'Monosor', strength: '20 mg', generic: 'Isosorbide-5-mononitrate', cls: 'Nitrate', group: 'angina', pack: '20 tablets', accent: '#257741',
    text: 'Organic nitrate for prophylactic maintenance therapy in chronic angina pectoris.' },
  { id: 'monosor-40', brand: 'Monosor', strength: '40 mg', generic: 'Isosorbide-5-mononitrate', cls: 'Nitrate', group: 'angina', pack: '20 tablets', accent: '#1d53a1',
    text: 'High-strength anti-anginal nitrate reducing venous return and ventricular workload.' },
  { id: 'niglys-sr-2-6', brand: 'Niglys SR', strength: '2.6 mg', generic: 'Glyceryl Trinitrate', cls: 'Nitrate, sustained release', group: 'angina', pack: '30 tablets', accent: '#9f2e29',
    text: 'Sustained-release vasodilator for long-term treatment of coronary heart disease and prophylaxis of angina pectoris.' },
  { id: 'niglys-sr-6-4', brand: 'Niglys SR', strength: '6.4 mg', generic: 'Glyceryl Trinitrate', cls: 'Nitrate, sustained release', group: 'angina', pack: '30 tablets', accent: '#255296',
    text: 'Higher-strength sustained-release nitrate for chronic stable angina maintenance.' },
  { id: 'uniplat-75', brand: 'Uniplat', strength: '75 mg', generic: 'Clopidogrel', cls: 'Antiplatelet', group: 'antiplatelet', pack: '1 × 10 tablets', accent: '#a71e22',
    text: 'Antiplatelet agent for atherosclerosis, myocardial infarction and stroke prophylaxis, peripheral arterial disease and adjunctive therapy in angina.' },
];

// One entry per brand for the homepage showcase, in catalogue order.
export const brands = ['Carsel', 'Carsel Plus', 'Niglys SR', 'Kolmark', 'Uniplat', 'Monosor', 'Jesper', 'Jesper Plus', 'Miodarone'].map((brand) => {
  const skus = products.filter((p) => p.brand === brand);
  return { brand, skus, hero: skus[skus.length > 1 ? 1 : 0], generic: skus[0].generic, cls: skus[0].cls };
});

export const photo = (id, small) => `media/products/${id}${small ? '-sm' : ''}.webp`;
