import React, { useEffect, useState } from 'react';
import { getAllRegionsForDay } from '../services/forecastService';
import { LeadDay, RegionalMetric } from '../types/forecast';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingSpinner } from '../components/common/LoadingState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ErrorProneAreasPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<LeadDay>(8);
  const [data, setData] = useState<RegionalMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllRegionsForDay(selectedDay).then((res) => {
      // Sort highest bust probability first
      const sorted = [...res].sort((a, b) => b.bustProbability - a.bustProbability);
      setData(sorted);
      setLoading(false);
    });
  }, [selectedDay]);

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#0f294a]">
            Error-Prone Synoptic Sector Identification
          </h2>
          <p className="text-xs text-slate-500">
            Ranked medium-range uncertainty hot-spots across India met centers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Lead Horizon:</span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value) as LeadDay)}
            className="bg-slate-50 border border-slate-300 text-xs font-bold rounded px-3 py-1.5"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
              <option key={d} value={d}>
                Day {d} Outlook
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Evaluating Regional Bust Risk Indices..." />
      ) : (
        <>
          {/* Bar Chart: Highest Uncertainty */}
          <div className="bg-white border border-slate-200 rounded p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Bust Probability Comparison — Day {selectedDay} Horizon
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#334155' }} />
                  <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#334155' }} />
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Bust Risk']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '11px' }}
                  />
                  <Bar dataKey="bustProbability" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranked Table */}
          <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Station / Region</th>
                  <th className="p-3">Horizon</th>
                  <th className="p-3">Bust Probability</th>
                  <th className="p-3">Confidence Score</th>
                  <th className="p-3">Primary Uncertainty Driver</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {data.map((item, idx) => (
                  <tr key={item.region} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{item.region}</td>
                    <td className="p-3 text-slate-600">Day {item.leadDay}</td>
                    <td className="p-3 font-bold text-rose-700">{item.bustProbability}%</td>
                    <td className="p-3 text-slate-800">{item.confidenceScore}%</td>
                    <td className="p-3 text-slate-600">{item.topReasons[0]?.feature || 'Spread variance'}</td>
                    <td className="p-3">
                      <RiskBadge status={item.confidenceClass} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
