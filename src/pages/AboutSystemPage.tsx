import React from 'react';
import { Info, ArrowDown } from 'lucide-react';

export const AboutSystemPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-800" />
          Forecast Confidence System Architecture
        </h2>
        <p className="text-xs text-slate-500">
          Official Decision-Support Meta-Model for Indian Numerical Weather Prediction
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-xs text-blue-950 font-medium leading-relaxed">
        <strong>CRITICAL OPERATIONAL SCOPE:</strong> THIS SYSTEM DOES NOT PREDICT WEATHER. It evaluates the
        reliability and forecast bust likelihood of already existing NWP model forecasts (Day 1 to Day 10). It answers:
        <span className="font-bold underline ml-1">
          "How much should this weather forecast be trusted today, and why?"
        </span>
      </div>

      {/* Conceptual Flow Diagram */}
      <div className="bg-white border border-slate-200 rounded p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Structural Architecture Hierarchy
        </h3>
        <div className="max-w-md mx-auto space-y-2 text-center text-xs">
          <div className="p-2.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800">
            Numerical Weather Prediction (NWP Ensembles: Day 1 – Day 10)
          </div>
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-500" />
          </div>
          <div className="p-3 bg-[#0f294a] text-white rounded font-bold shadow-sm">
            AI-Based Forecast Confidence System (Meta-Model Layer)
          </div>
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-500" />
          </div>
          <div className="p-2.5 bg-blue-50 border border-blue-300 rounded font-bold text-blue-900">
            Confidence Score + Bust Probability + Explainable Drivers
          </div>
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-500" />
          </div>
          <div className="p-2.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800">
            Sector-Specific Decision Support (General • Agriculture • Disaster Response)
          </div>
        </div>
      </div>

      {/* Demo vs Production Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded p-4 space-y-2">
          <div className="font-bold text-slate-800 border-b border-slate-100 pb-1">
            CURRENT EVALUATION DEMO BUILD
          </div>
          <ul className="space-y-1.5 text-slate-600">
            <li>• Deterministic TypeScript mock engine based on meteorological rules</li>
            <li>• Seeded regional profiles for 8 Indian hubs across Days 1–10</li>
            <li>• Rule-based SHAP-style attribution & local NLP parser</li>
            <li>• Completely offline-ready for hackathon evaluation stability</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 space-y-2">
          <div className="font-bold text-blue-900 border-b border-slate-100 pb-1">
            TARGET PRODUCTION IMPLEMENTATION
          </div>
          <ul className="space-y-1.5 text-slate-600">
            <li>• LightGBM / CatBoost calibrated binary & regression models</li>
            <li>• TreeSHAP exact game-theoretic feature attribution</li>
            <li>• Automated ingestion of NOAA GEFS v2 & NCMRWF GRIB2 archives</li>
            <li>• High-performance FastAPI asynchronous microservices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
