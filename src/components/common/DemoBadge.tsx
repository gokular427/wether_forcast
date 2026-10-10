import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DemoBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium tracking-tight">
      <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
      <span>SIMULATED OPERATIONAL DATA • LOCAL DETERMINISTIC SERVICE</span>
    </div>
  );
};
