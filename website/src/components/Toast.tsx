import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ToastMessage {
  id: number;
  title: string;
  text: string;
}

interface ToastContextValue {
  showToast: (title: string, text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 4500;

// Toast notification provider that persists across page navigation.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setToast(null);
  }, []);

  const showToast = useCallback((title: string, text: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    setToast({
      id: Date.now(),
      title,
      text,
    });

    timer.current = setTimeout(() => {
      setToast(null);
      timer.current = null;
    }, DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <style>{`
        .toast {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 14px;
          width: 340px;
          max-width: calc(100vw - 48px);
          min-width: 0;
          padding: 14px 16px 14px 14px;
          box-sizing: border-box;
          background: #ffffff;
          border: 1px solid #e7e7e7;
          border-left: 4px solid #1f1f1f;
          border-radius: 10px;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.14);
          font-family: Inter, Arial, sans-serif;
          animation: toast-in 0.3s ease;
        }

        .toast-icon {
          flex: 0 0 32px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e4f6e8;
          color: #1e6b34;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-body {
          min-width: 0;
          flex: 1;
        }

        .toast-title {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: #888888;
          overflow-wrap: anywhere;
        }

        .toast-text {
          margin: 2px 0 0;
          font-size: 15px;
          line-height: 1.5;
          font-weight: 600;
          color: #1f1f1f;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .toast-close {
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 4px;
          background: transparent;
          color: #999999;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
        }

        .toast-close:hover {
          color: #1f1f1f;
          background: #f5f5f5;
        }

        .toast-close:focus-visible {
          outline: 2px solid #555555;
          outline-offset: 2px;
        }

        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .toast {
            left: 14px;
            right: 14px;
            bottom: 14px;
            width: auto;
            max-width: none;
            gap: 10px;
            padding: 12px;
            border-radius: 8px;
          }

          .toast-icon {
            flex-basis: 30px;
            width: 30px;
            height: 30px;
          }

          .toast-title {
            font-size: 11px;
          }

          .toast-text {
            font-size: 13px;
          }
        }

        @media (max-width: 360px) {
          .toast {
            left: 10px;
            right: 10px;
            bottom: 10px;
            gap: 8px;
            padding: 10px;
          }

          .toast-text {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .toast {
            animation: none;
          }
        }
      `}</style>

      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
          key={toast.id}
        >
          <span className="toast-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>

          <div className="toast-body">
            <p className="toast-title">{toast.title}</p>
            <p className="toast-text">{toast.text}</p>
          </div>

          <button
            type="button"
            className="toast-close"
            onClick={dismiss}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return ctx;
}