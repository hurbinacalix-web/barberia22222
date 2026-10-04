import React from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useBarberData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 ${
              isSuccess
                ? 'bg-neutral-900/95 border-amber-500/40 text-neutral-100 shadow-amber-500/5'
                : isWarning
                ? 'bg-neutral-900/95 border-red-500/40 text-neutral-100 shadow-red-500/5'
                : 'bg-neutral-900/95 border-neutral-700/60 text-neutral-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-red-400" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-sky-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-100 leading-tight">
                {toast.title}
              </p>
              <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1 -mr-1"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
