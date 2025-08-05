import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let diff = null;
let intervalId1 = null;
let intervalId2 = null;

const startButton = document.querySelector('[data-start]');
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < Date.now()) {
      iziToast.error({
        title: 'Please choose a date in the future',
        position: 'topCenter',
      });
      startButton.disabled = true;
      return;
    }

    startButton.disabled = false;
    console.log(selectedDates[0]);
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '00');
}

function updateTimer() {
  const timer = document.querySelector('.timer');
  const days1 = timer.querySelector('[data-days]');
  const hours1 = timer.querySelector('[data-hours]');
  const minutes1 = timer.querySelector('[data-minutes]');
  const seconds1 = timer.querySelector('[data-seconds]');

  diff = userSelectedDate - Date.now();

  let { days, hours, minutes, seconds } = convertMs(diff);
  days1.textContent = addLeadingZero(days);
  hours1.textContent = addLeadingZero(hours);
  minutes1.textContent = addLeadingZero(minutes);
  seconds1.textContent = addLeadingZero(seconds);

  let days2 = +days1.textContent;
  let hours2 = +hours1.textContent;
  let minutes2 = +minutes1.textContent;
  let seconds2 = +seconds1.textContent;

  if (days2 + hours2 + minutes2 + seconds2 > 0) {
    return { days1, hours1, minutes1, seconds1 };
  } else {
    clearInterval(intervalId1, intervalId2);
    iziToast.success({
      title: 'Timer stopped!',
      position: 'topCenter',
    });
  }
}

startButton.addEventListener('click', () => {
  intervalId1 = setInterval(updateTimer, 1000);
  intervalId2 = setInterval(() => {
    iziToast.success({
      title: '10 sec past!',
      position: 'topCenter',
    });
  }, 10000);
});
