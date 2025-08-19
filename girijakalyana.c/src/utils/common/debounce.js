// utils/debounce.js
export function debounce(func, delay) {
  let timer;

  function debounced(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  }

  // Add cancel method
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
