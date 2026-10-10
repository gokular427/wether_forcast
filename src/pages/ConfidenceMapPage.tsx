import React, { useState } from 'react';
import { RegionId, LeadDay } from '../types/forecast';
import { REGIONS, FORECAST_DATABASE } from '../data/mockForecastData';
import { IndiaMap } from '../components/dashboard/IndiaMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { Compass } from 'lucide-react';

interface ConfidenceMapPageProps {
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
  onRegionChange: (r: RegionId) => void;
  onLeadDayChange: (d: LeadDay) => void;
}

export const ConfidenceMapPage: React.FC<ConfidenceMapPageProps> = ({
  selectedRegion,
  selectedLeadDay,
  onRegionChange,
  onLeadDayChange,
}) => {
  const [showSpreadContour, setShowSpreadContour] = useState(true);
  const [showSteeringVectors, setShowSteeringVectors] = useState(true);

  const activeMetric = FORECAST_DATABASE[`${selectedRegion}_${selectedLeadDay}`];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-800" />
            National Synoptic Confidence & Bust Vulnerability Grid
          </h2>
          <p className="text-xs text-slate-500">
            Spatial distribution of numerical forecast reliability across regional meteorological observatories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Forecast Horizon:</span>
          <select
            value={selectedLeadDay}
            onChange={(e) => onLeadDayChange(Number(e.target.value) as LeadDay)}
            className="bg-slate-50 border border-slate-300 text-xs font-bold rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-800"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
              <option key={d} value={d}>
                Day {d} ({d * 24}h Horizon)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layer Toggles & Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Map View */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white border border-slate-200 rounded p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 font-medium text-slate-700">
              <span className="font-bold uppercase text-[10px] text-slate-500 tracking-wider">
                Synoptic Overlays:
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSpreadContour}
                  onChange={(e) => setShowSpreadContour(e.target.checked)}
                  className="rounded text-blue-800 focus:ring-0"
                />
                <span>Ensemble Spread Contours</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSteeringVectors}
                  onChange={(e) => setShowSteeringVectors(e.target.checked)}
                  className="rounded text-blue-800 focus:ring-0"
                />
                <span>Steering Flow Vector Fields</span>
              </label>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">GEFS 0.25° Mesh</span>
          </div>

          <IndiaMap
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            onSelectRegion={onRegionChange}
          />
        </div>

        {/* Right Station Index Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded p-3 shadow-2xs">
            <h3 className="text-xs font-bold text-[#0f294a] uppercase tracking-wider mb-2">
              Observatory Telemetry (Day {selectedLeadDay})
            </h3>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {REGIONS.map((r) => {
                const metric = FORECAST_DATABASE[`${r.id}_${selectedLeadDay}`];
                const isSelected = selectedRegion === r.id;

                return (
                  <button
                    key={r.id}
                    onClick={() => onRegionChange(r.id)}
                    className={`w-full text-left p-2.5 rounded border transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-800 ring-1 ring-blue-800'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{r.id}</span>
                      <RiskBadge status={metric.confidenceClass} size="sm" />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                      <span>Conf: <strong>{metric.confidenceScore}%</strong></span>
                      <span className="text-rose-700 font-semibold">Bust: {metric.bustProbability}%</span>
                      <span>Spread: {metric.ensembleSpread}σ</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {activeMetric && (
            <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-2">
              <div className="font-bold text-slate-800">Station Summary: {selectedRegion}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Atmospheric steering is {activeMetric.steeringFlowStrength.toLowerCase()} with {activeMetric.monsoonPhase} monsoon regime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
