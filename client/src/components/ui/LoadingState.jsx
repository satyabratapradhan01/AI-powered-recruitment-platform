import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({
  message = 'Loading data...',
  fullScreen = false,
  className = '',
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs p-4">
        <div className="flex flex-col items-center space-y-3 bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 space-y-3 text-center ${className}`}
    >
      <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingState;
