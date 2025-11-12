const styles = {
  success: 'bg-green-600',
  info: 'bg-blue-600',
  error: 'bg-red-600',
};

const icons = {
  success: /* HTML */ `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
  `,
  info: /* HTML */ `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  `,
  error: /* HTML */ `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  `,
};

const Toast = ({ type = 'success', message }) => {
  return /* HTML */ `
    <div
      class="${styles[
        type
      ]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm"
    >
      <div class="flex-shrink-0">${icons[type]}</div>
      <p class="text-sm font-medium">${message}</p>
      <button
        id="toast-close-btn"
        class="flex-shrink-0 ml-2 text-white hover:text-gray-200"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  `;
};

export const showToast = (message, type = 'success', duration = 3000) => {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className =
      'toast-container fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center';

    // footer 앞에 추가 (modal overlay의 형제로)
    const footer = document.querySelector('footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', toastContainer);
    } else {
      document.body.appendChild(toastContainer);
    }
  }

  const toastElement = document.createElement('div');
  toastElement.innerHTML = Toast({ type, message });
  const toast = toastElement.firstElementChild;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms';
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });
  });

  const removeToast = () => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 300);
  };

  const closeBtn = toast.querySelector('#toast-close-btn');
  closeBtn?.addEventListener('click', removeToast);

  setTimeout(removeToast, duration);
};
