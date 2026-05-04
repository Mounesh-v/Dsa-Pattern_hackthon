import { useEffect, useState } from 'react';

const listeners = new Set();
let toastId = 0;
let toasts = [];

const notify = () => {
  listeners.forEach((listener) => listener(toasts));
};

const removeToast = (id) => {
  toasts = toasts.filter((item) => item.id !== id);
  notify();
};

const addToast = (type, message, options = {}) => {
  const id = options.id || `toast-${++toastId}`;
  const duration = options.duration ?? (type === 'loading' ? Infinity : 3500);

  toasts = [
    ...toasts.filter((item) => item.id !== id),
    { id, type, message },
  ];
  notify();

  if (Number.isFinite(duration)) {
    window.setTimeout(() => removeToast(id), duration);
  }

  return id;
};

export const toast = {
  success: (message, options) => addToast('success', message, options),
  error: (message, options) =>
    addToast('error', message, { duration: 4500, ...options }),
  loading: (message, options) => addToast('loading', message, options),
  dismiss: (id) => {
    if (id) {
      removeToast(id);
      return;
    }

    toasts = [];
    notify();
  },
};

export const useToast = () => toast;

const toastStyles = {
  success: 'border-green-200 text-green-700',
  error: 'border-red-200 text-red-700',
  loading: 'border-border text-text-primary',
};

const toastLabels = {
  success: 'Success',
  error: 'Error',
  loading: 'Loading',
};

export const ToastProvider = ({ children }) => {
  const [visibleToasts, setVisibleToasts] = useState(toasts);

  useEffect(() => {
    listeners.add(setVisibleToasts);
    return () => listeners.delete(setVisibleToasts);
  }, []);

  return (
    <>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {visibleToasts.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg border bg-card px-4 py-3 shadow-lg ${toastStyles[item.type]}`}
          >
            <div className="text-xs font-semibold uppercase">
              {toastLabels[item.type]}
            </div>
            <div className="mt-1 text-sm text-text-primary">
              {item.message}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
