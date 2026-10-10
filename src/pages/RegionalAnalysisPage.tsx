import React, { useEffect, useState } from 'react';
import { RegionId, LeadDay, RegionalMetric } from '../types/forecast';
import { getMultiDayOutlook, getConfidence } from '../services/forecastService';
import { REGIONS } from '../data/mockForecastData';
import { LoadingSpinner } from '../components/common/LoadingState';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const RegionalAnalysisPage: React.FC<{
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
  onRegionChange: (r: RegionId) => void;
}> = ({ selectedRegion, selectedLeadDay, onRegionChange }) => {
  const [metric, setMetric] = useState<RegionalMetric | null>(null);
  const [outlook, setOutlook] = useState<RegionalMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getConfidence(selectedRegion, selectedLeadDay),
      getMultiDayOutlook(selectedRegion),
    ]).then(([m, out]) => {
      setMetric(m);
      setOutlook(out);
      setLoading(false);
    });
  }, [selectedRegion, selectedLeadDay]);

  if (loading || !metric) return <LoadingSpinner label="Loading Regional Diagnostics..." />;

  const chartData = outlook.map((o) => ({
    day: `Day ${o.leadDay}`,
    confidence: o.confidenceScore,
    bustRisk: o.bustProbability,
  }));

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#0f294a]">
            Regional Meteorological Profile: {selectedRegion}
          </h2>
          <p className="text-xs text-slate-500">
            Multi-Lead Atmospheric Profile and Ensemble Diagnostics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Select Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value as RegionId)}
            className="bg-slate-50 border border-slate-300 text-xs font-bold rounded px-3 py-1.5"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Numerical Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-3 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Ensemble Spread (σ)</span>
          <p className="text-lg font-bold text-slate-900 mt-1">{metric.ensembleSpread} mm/s</p>
        </div>
        <div className="bg-white p-3 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Steering Flow</span>
          <p className="text-lg font-bold text-slate-900 mt-1">{metric.steeringFlowStrength}</p>
        </div>
        <div className="bg-white p-3 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Monsoon Phase</span>
          <p className="text-lg font-bold text-slate-900 mt-1">{metric.monsoonPhase}</p>
        </div>
        <div className="bg-white p-3 border border-slate-200 rounded">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Climatological Error</span>
          <p className="text-lg font-bold text-slate-900 mt-1">{metric.climatologicalErrorRate}%</p>
        </div>
      </div>

      {/* Lead Day 1-10 Chart */}
      <div className="bg-white border border-slate-200 rounded p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Lead Day 1 to 10: Confidence vs Bust Probability Trajectory
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#334155' }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#334155' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="confidence"
                name="Forecast Confidence Score (%)"
                stroke="#0f294a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bustRisk"
                name="Bust Probability (%)"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analog Context */}
      <div className="bg-white border border-slate-200 rounded p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Historical Operational Case Association
        </h3>
        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">{metric.analogEvent.name}</p>
          <p className="text-slate-600">{metric.analogEvent.synopticDescription}</p>
          <div className="flex gap-4 pt-2 font-medium text-slate-700">
            <span>Historical Verification Error: <strong>{metric.analogEvent.historicalError}%</strong></span>
            <span>Pattern Correlation: <strong>{metric.analogEvent.similarity}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
