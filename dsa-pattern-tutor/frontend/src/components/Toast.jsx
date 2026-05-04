import toast, { Toaster } from 'react-hot-toast';

export const useToast = () => toast;

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
    </>
  );
};
