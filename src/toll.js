import { ScrollTrigger, initReveals } from './main.js';
import { mountToll } from './toll-anim.js';
import { renderForms } from './forms.js';

mountToll(document.querySelector('[data-toll]'));
renderForms(document.querySelector('[data-forms]'));

const form = document.querySelector('[data-qf]');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = [...form.querySelectorAll('[required]')].find((el) => !el.value.trim() || (el.type === 'email' && !el.validity.valid));
  if (bad) { bad.focus(); bad.style.borderColor = '#fff'; return; }
  form.classList.add('sent');
  form.querySelector('.qf-ok').focus?.();
});

Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
  initReveals();
  ScrollTrigger.refresh();
});
