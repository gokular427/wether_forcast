import React, { useState } from 'react';
import { askForecast } from '../services/forecastService';
import { QueryParseResult } from '../types/forecast';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingSpinner } from '../components/common/LoadingState';
import { HelpCircle, Search } from 'lucide-react';

export const AskForecastPage: React.FC = () => {
  const [query, setQuery] = useState('How confident are we about rainfall in Chennai in the next 4 days?');
  const [result, setResult] = useState<QueryParseResult | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    'How confident are we about rainfall in Chennai in the next 4 days?',
    'Mumbai Day 8 confidence and bust risk',
    'Delhi heatwave Day 5 forecast uncertainty',
    'Kolkata Day 7 forecast reliability',
  ];

  const handleSearch = (qToUse?: string) => {
    const text = qToUse || query;
    if (!text.trim()) return;
    setLoading(true);
    askForecast(text).then((res) => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-800" />
          Natural-Language Forecast Reliability Assistant
        </h2>
        <p className="text-xs text-slate-500">
          Deterministic synoptic query parser running entirely on local evaluation service (No third-party LLMs)
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Type query: e.g. Chennai rainfall next 4 days, Mumbai Day 8 confidence..."
            className="flex-1 bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded px-3 py-2 focus:ring-1 focus:ring-blue-800 focus:outline-none"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-[#0f294a] hover:bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Audit Query</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">Fast Evaluator Presets:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner label="Parsing Meteorological Query & Ensembles..." />}

      {result && !loading && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Diagnostic Response
            </span>
            {result.metric && <RiskBadge status={result.metric.confidenceClass} size="sm" />}
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-950 font-medium leading-relaxed">
            {result.summaryAnswer}
          </div>

          {result.metric && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Station</span>
                <span className="font-extrabold text-slate-900 text-sm">{result.identifiedRegion}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Horizon</span>
                <span className="font-extrabold text-slate-900 text-sm">Day {result.identifiedLeadDay}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Confidence Score</span>
                <span className="font-extrabold text-slate-900 text-sm">{result.metric.confidenceScore}%</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Bust Probability</span>
                <span className="font-extrabold text-rose-700 text-sm">{result.metric.bustProbability}%</span>
              </div>
            </div>
          )}

          {result.metric && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
              <span className="font-bold text-slate-800">Primary Supporting Evidence:</span>
              <p className="text-slate-600 mt-1">
                {result.metric.topReasons[0]?.feature} ({result.metric.topReasons[0]?.impact}), steering flow is{' '}
                {result.metric.steeringFlowStrength.toLowerCase()}, and historical analog reflects {result.metric.analogEvent.name}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
