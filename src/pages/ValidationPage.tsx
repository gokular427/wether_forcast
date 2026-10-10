import React from 'react';
import { ValidationChart } from '../components/charts/ValidationChart';

export const ValidationPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-[#0f294a]">
              AI Model vs Climatology Baseline Validation
            </h2>
            <p className="text-xs text-slate-500">
              Prototype comparison using deterministic demo validation values
            </p>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 border border-slate-300 text-slate-700 px-2 py-1 rounded">
            DEMO VALIDATION DATA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">AUC-ROC Score</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">0.84</span>
            <span className="text-xs text-slate-500">vs 0.66 Baseline</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">+27% Discrimination</span>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Brier Score (Calibration)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">0.14</span>
            <span className="text-xs text-slate-500">vs 0.22 Baseline</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Lower uncertainty residual</span>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Hit Rate on Bust Events</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">85.0%</span>
            <span className="text-xs text-slate-500">vs 71.0% Baseline</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">+14% Accuracy Gain</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Comparative Performance Metrics (AI Model vs Simple Persistence)
        </h3>
        <ValidationChart />
      </div>

      <div className="p-3 bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 leading-relaxed">
        <strong>Transparency Note:</strong> These values are simulated for the hackathon prototype to demonstrate the intended validation view. They are not results from a completed historical hindcast experiment.
      </div>
    </div>
  );
};
