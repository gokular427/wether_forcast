import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="w-full space-y-3 p-4 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
    <div className="h-4 bg-slate-100 rounded w-2/3"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-slate-100 rounded w-full"></div>
    ))}
  </div>
);

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Computing Met Evaluation...' }) => (
  <div className="flex flex-col items-center justify-center p-8 gap-2">
    <Loader2 className="w-7 h-7 text-blue-700 animate-spin" />
    <span className="text-xs font-semibold text-slate-600 tracking-wide">{label}</span>
  </div>
);
