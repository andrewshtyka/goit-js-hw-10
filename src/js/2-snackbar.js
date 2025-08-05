import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputMs = document.querySelector('[name="delay"]');
const formMs = document.querySelector('.form');
let inputValue = null;

inputMs.addEventListener('input', event => {
  inputValue = event.target.value;
  console.log(inputValue);
});

formMs.addEventListener('submit', event => {
  event.preventDefault();

  if (Number(inputValue) < 0) {
    inputMs.value = '';
    inputValue = null;
    return;
  }

  delayedToast(inputValue)
    .then(params => {
      iziToast.success(params);
      console.log(`✅ Fulfilled promise in ${inputValue}ms`);
    })
    .catch(params => {
      iziToast.error(params);
      console.log(`❌ Rejected promise in ${inputValue}ms`);
    });
});

function delayedToast(delay) {
  const selectedMs = document.querySelector('[name="state"]:checked');

  return new Promise((resolve, reject) => {
    if (selectedMs.value === 'fulfilled') {
      setTimeout(() => {
        resolve({
          title: `✅ Fulfilled promise in ${delay}ms`,
          position: 'topCenter',
        });
      }, delay);
    } else if (selectedMs.value === 'rejected') {
      setTimeout(() => {
        reject({
          title: `❌ Rejected promise in ${delay}ms`,
          position: 'topCenter',
        });
      }, delay);
    } else {
      inputValue === '';
      return;
    }
  });
}
