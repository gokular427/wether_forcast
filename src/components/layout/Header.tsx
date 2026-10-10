import React from 'react';
import { ShieldCheck, Activity, Database, CheckCircle2 } from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top National Met Bar */}
      <div className="bg-[#0b1d3a] text-white px-6 py-1.5 text-xs flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="tracking-wide">NATIONAL METEOROLOGICAL DECISION SUPPORT INFRASTRUCTURE</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Smart India Hackathon Evaluation Build</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Demo Engine: Ready
          </span>
          <span>Rolling 30-Day Accuracy: <strong className="text-white">86.4%</strong></span>
          <span>Mode: Offline Demo</span>
        </div>
      </div>

      {/* Main Header Branding Bar */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-[#0f294a] text-white p-2.5 rounded shadow-sm border border-blue-900">
            <ShieldCheck className="w-7 h-7 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#0f294a] uppercase">
                Forecast Confidence System
              </h1>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded">
                v2.4-MED
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium tracking-normal mt-0.5">
              AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts (Day 1 – Day 10 NWP Reliability)
            </p>
          </div>
        </div>

        {/* System Attributes */}
        <div className="flex items-center gap-3">
          <DemoBadge />
          <div className="hidden lg:flex items-center text-xs border-l border-slate-200 pl-4 py-1 text-slate-600 gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-700" />
              <span>Offline Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>GEFS v2 / IMDAA Compatible</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
