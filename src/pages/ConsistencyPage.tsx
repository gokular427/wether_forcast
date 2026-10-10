import React, { useEffect, useState } from 'react';
import { RegionId, LeadDay, RunHistoryItem } from '../types/forecast';
import { getForecastRuns } from '../services/forecastService';
import { ForecastConsistencyChart } from '../components/charts/ForecastConsistencyChart';
import { LoadingSpinner } from '../components/common/LoadingState';
import { AlertTriangle, GitCompare } from 'lucide-react';

export const ConsistencyPage: React.FC<{
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
}> = ({ selectedRegion, selectedLeadDay }) => {
  const [runs, setRuns] = useState<RunHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getForecastRuns(selectedRegion, selectedLeadDay).then((res) => {
      setRuns(res);
      setLoading(false);
    });
  }, [selectedRegion, selectedLeadDay]);

  if (loading) return <LoadingSpinner label="Auditing Run-to-Run Initialization Jitter..." />;

  const isHighShift =
    runs.length >= 3 && Math.abs(runs[2].bustProbability - runs[0].bustProbability) > 12;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-blue-800" />
          Run-to-Run Consistency Tracker (T-24h to Current)
        </h2>
        <p className="text-xs text-slate-500">
          Evaluates whether successive model cycles are converging or jumping between disparate states
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {runs.map((r, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{r.runLabel}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{r.bustProbability}%</span>
              <span className="text-xs font-semibold text-slate-600">Bust Risk</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Confidence: {r.confidenceScore}%</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Cycle Evolution Profile
        </h3>
        <ForecastConsistencyChart runs={runs} />
      </div>

      {isHighShift && (
        <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-start gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>High Run-to-Run Variability Flag:</strong> Noticeable discrepancy observed across consecutive
            numerical cycles for {selectedRegion} Day {selectedLeadDay}. Significant changes between successive model
            runs indicate reduced forecast confidence and potential trough phase shifting.
          </div>
        </div>
      )}
    </div>
  );
};
