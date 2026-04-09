import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    border: 'border-accent-green/30',
    accent: 'text-accent-green',
    icon: CheckCircle2,
  },
  error: {
    border: 'border-red-500/30',
    accent: 'text-red-400',
    icon: AlertCircle,
  },
  info: {
    border: 'border-accent-cyan/30',
    accent: 'text-accent-cyan',
    icon: Info,
  },
  warning: {
    border: 'border-accent-amber/30',
    accent: 'text-accent-amber',
    icon: AlertTriangle,
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, message, type }]);

    const timeout = window.setTimeout(() => {
      dismissToast(id);
    }, 4000);
    timeoutsRef.current.set(id, timeout);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[120] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info;
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className={`overflow-hidden rounded-2xl border bg-bg-card/95 p-4 shadow-2xl backdrop-blur-xl ${config.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${config.accent}`}>
                    <Icon size={18} />
                  </div>
                  <p className="flex-1 text-sm font-medium text-text-primary">{toast.message}</p>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="text-text-muted transition-colors hover:text-text-primary"
                    aria-label="Dismiss toast"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function Toast() {
  return null;
}

export default Toast;
