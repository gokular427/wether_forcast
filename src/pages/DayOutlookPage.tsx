import React, { useState } from 'react';
import { RegionId, LeadDay } from '../types/forecast';
import { REGIONS, FORECAST_DATABASE } from '../data/mockForecastData';
import { CalendarRange, Filter } from 'lucide-react';

interface DayOutlookPageProps {
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
  onRegionChange: (r: RegionId) => void;
  onLeadDayChange: (d: LeadDay) => void;
}

export const DayOutlookPage: React.FC<DayOutlookPageProps> = ({
  selectedRegion,
  selectedLeadDay,
  onRegionChange,
  onLeadDayChange,
}) => {
  const [filterThreshold, setFilterThreshold] = useState<'ALL' | 'VULNERABLE'>('ALL');

  const leadDays: LeadDay[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getStatusColor = (bust: number) => {
    if (bust >= 65) return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    if (bust >= 45) return 'bg-orange-100 text-orange-800 border-orange-300 font-medium';
    if (bust >= 25) return 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium';
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-blue-800" />
            National Day 1 to Day 10 Uncertainty Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Multi-center lead-time horizon evaluation across all 8 synoptic observation nodes
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-slate-700">Display Filter:</span>
          <button
            onClick={() => setFilterThreshold('ALL')}
            className={`px-2.5 py-1 rounded border text-xs font-bold ${
              filterThreshold === 'ALL'
                ? 'bg-[#0f294a] text-white border-[#0f294a]'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            All Stations
          </button>
          <button
            onClick={() => setFilterThreshold('VULNERABLE')}
            className={`px-2.5 py-1 rounded border text-xs font-bold ${
              filterThreshold === 'VULNERABLE'
                ? 'bg-[#0f294a] text-white border-[#0f294a]'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            High Bust Risk Only (&gt;50%)
          </button>
        </div>
      </div>

      {/* Cross-Regional Matrix Table */}
      <div className="bg-white border border-slate-200 rounded shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase">
              <th className="p-3">Observatory / Hub</th>
              {leadDays.map((d) => (
                <th
                  key={d}
                  onClick={() => onLeadDayChange(d)}
                  className={`p-2.5 text-center cursor-pointer hover:bg-slate-200 transition-colors ${
                    selectedLeadDay === d ? 'bg-blue-100 text-blue-900 border-b-2 border-blue-900' : ''
                  }`}
                >
                  Day {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {REGIONS.map((r) => {
              const isSelectedRegion = selectedRegion === r.id;

              return (
                <tr
                  key={r.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isSelectedRegion ? 'bg-blue-50/40 font-semibold' : ''
                  }`}
                >
                  <td
                    className="p-3 font-bold text-slate-900 cursor-pointer flex items-center justify-between"
                    onClick={() => onRegionChange(r.id)}
                  >
                    <span>{r.id}</span>
                    {isSelectedRegion && (
                      <span className="text-[10px] text-blue-800 font-black">ACTIVE</span>
                    )}
                  </td>
                  {leadDays.map((d) => {
                    const metric = FORECAST_DATABASE[`${r.id}_${d}`];
                    const isCellSelected = isSelectedRegion && selectedLeadDay === d;

                    if (filterThreshold === 'VULNERABLE' && metric.bustProbability <= 50) {
                      return (
                        <td key={d} className="p-2 text-center text-slate-300">
                          -
                        </td>
                      );
                    }

                    return (
                      <td
                        key={d}
                        onClick={() => {
                          onRegionChange(r.id);
                          onLeadDayChange(d);
                        }}
                        className={`p-2 text-center cursor-pointer transition-all ${
                          isCellSelected ? 'ring-2 ring-blue-900 rounded' : ''
                        }`}
                      >
                        <div
                          className={`py-1 px-1.5 rounded border text-[11px] ${getStatusColor(
                            metric.bustProbability
                          )}`}
                          title={`Confidence: ${metric.confidenceScore}% | Bust: ${metric.bustProbability}%`}
                        >
                          <div>{metric.confidenceScore}%</div>
                          <div className="text-[9px] opacity-80">{metric.bustProbability}%b</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend & Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="font-bold text-slate-800">Confidence Scale:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> High (≥75%)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Moderate (55–74%)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-orange-400"></span> Low (35–54%)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Very Low (&lt;35%)
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Click any cell to set operational region & lead horizon globally.
        </div>
      </div>
    </div>
  );
};
