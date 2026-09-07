import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastData {
  title: string;
  desc: string;
  icon?: string;
  tone?: 'primary' | 'success' | 'error';
}

interface Props {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={`${toast.title}-${toast.desc}`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-outline-variant/20 min-w-[320px] max-w-[420px]"
            role="status"
            aria-live="polite"
          >
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">{toast.icon ?? 'check_circle'}</span>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md font-semibold">{toast.title}</span>
              <span className="font-body-sm text-body-sm text-on-primary-container">{toast.desc}</span>
            </div>
            <button
              onClick={onDismiss}
              className="ml-auto p-1 hover:bg-white/10 rounded"
              aria-label="Dismiss"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
