import React from 'react';
import { Database, ArrowRight } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const sources = [
    {
      name: 'NOAA GEFS Reforecast v2',
      type: 'NWP Multi-Ensemble Archive',
      description: 'Open retrospective ensemble forecast archive proposed for production training and evaluation.',
      status: 'Target Operational Archive',
    },
    {
      name: 'IndiaWeatherBench / IMDAA',
      type: 'Indian Ground Truth & High-Res Analysis',
      description: 'India-focused reanalysis/benchmark source proposed for forecast-truth matching and error labels.',
      status: 'Verification Benchmark',
    },
    {
      name: 'ECMWF ERA5 Reanalysis',
      type: 'Synoptic Climatology Baseline',
      description: 'Used to calculate baseline variance and climatological bust thresholds for medium-range horizons.',
      status: 'Reference Baseline',
    },
    {
      name: 'TIGGE Multi-Model Ensemble',
      type: 'Operational Extension',
      description: 'Planned production ingestion for UKMO, NCEP, and JMA multi-center ensemble cross-verification.',
      status: 'Roadmap Extension',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-800" />
          Meteorological Data Pipeline Architecture
        </h2>
        <p className="text-xs text-slate-500">
          Target production data sources and processing stages; the current demo runs on local deterministic data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded p-4 space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{src.name}</span>
                <span className="text-[11px] text-blue-800 font-semibold">{src.type}</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                {src.status}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{src.description}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-white border border-slate-200 rounded p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          End-to-End Processing Workflow
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-800">
          <div className="bg-slate-50 border border-slate-300 p-3 rounded text-center w-full md:w-auto">
            Raw NWP GRIB2 (GEFS)
          </div>
          <ArrowRight className="w-4 h-4 text-blue-700 shrink-0 hidden md:block" />
          <div className="bg-slate-50 border border-slate-300 p-3 rounded text-center w-full md:w-auto">
            Synoptic Feature Extraction
          </div>
          <ArrowRight className="w-4 h-4 text-blue-700 shrink-0 hidden md:block" />
          <div className="bg-slate-50 border border-slate-300 p-3 rounded text-center w-full md:w-auto">
            Bust Classifier Engine
          </div>
          <ArrowRight className="w-4 h-4 text-blue-700 shrink-0 hidden md:block" />
          <div className="bg-slate-50 border border-slate-300 p-3 rounded text-center w-full md:w-auto">
            Confidence & Explanation API
          </div>
        </div>
      </div>
    </div>
  );
};
