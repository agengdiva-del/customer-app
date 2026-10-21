import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      <div className="flex items-center gap-2.5 bg-slate-900/95 dark:bg-emerald-950/95 text-white px-4 py-2.5 rounded-full shadow-xl backdrop-blur-md border border-slate-700/50 text-xs md:text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="whitespace-nowrap">{toastMessage}</span>
      </div>
    </div>
  );
};
