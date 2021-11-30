import './style.css';

const $inputName = document.getElementById('input-name') as HTMLInputElement;
const $formGreet = document.getElementById('form-greet');

$formGreet?.addEventListener('submit', async e => {
  e.preventDefault();

  const { greet } = await import('./lazy-chunk');

  greet($inputName?.value || 'Chess.com');
});
