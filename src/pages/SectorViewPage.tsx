import React, { useEffect, useState } from 'react';
import { RegionId, LeadDay, AudienceType, SectorAdvisory } from '../types/forecast';
import { REGIONS } from '../data/mockForecastData';
import { getSectorView } from '../services/forecastService';
import { LoadingSpinner } from '../components/common/LoadingState';
import { Layers, Tractor, AlertTriangle, Users } from 'lucide-react';

export const SectorViewPage: React.FC<{
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
  selectedAudience: AudienceType;
  onAudienceChange: (a: AudienceType) => void;
  onRegionChange: (r: RegionId) => void;
  onLeadDayChange: (d: LeadDay) => void;
}> = ({
  selectedRegion,
  selectedLeadDay,
  selectedAudience,
  onAudienceChange,
  onRegionChange,
  onLeadDayChange,
}) => {
  const [advisory, setAdvisory] = useState<SectorAdvisory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSectorView(selectedRegion, selectedLeadDay, selectedAudience).then((res) => {
      setAdvisory(res);
      setLoading(false);
    });
  }, [selectedRegion, selectedLeadDay, selectedAudience]);

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-800" />
          SAME FORECAST — DIFFERENT OPERATIONAL CONTEXT
        </h2>
        <p className="text-xs text-slate-500">
          The underlying numerical forecast is unified, but advisory interpretation adapts to operational sensitivity
        </p>
      </div>

      {/* Target Controls */}
      <div className="bg-white border border-slate-200 rounded p-3.5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value as RegionId)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-700 ml-2">Horizon:</span>
          <select
            value={selectedLeadDay}
            onChange={(e) => onLeadDayChange(Number(e.target.value) as LeadDay)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Switch Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded border border-slate-200">
          {(['General', 'Farmer', 'Disaster Management'] as AudienceType[]).map((aud) => (
            <button
              key={aud}
              onClick={() => onAudienceChange(aud)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                selectedAudience === aud
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
      </div>

      {loading || !advisory ? (
        <LoadingSpinner label="Formatting Domain-Specific Interpretation..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: General */}
          <div
            className={`border rounded p-4 text-xs space-y-3 ${
              selectedAudience === 'General'
                ? 'bg-white border-blue-800 ring-2 ring-blue-700/20 shadow-sm'
                : 'bg-slate-50/60 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-700" /> General Public
              </span>
              {selectedAudience === 'General' && (
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">Active</span>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed">
              Standard situational awareness. Advises whether outdoor plans or logistics require regular follow-up.
            </p>
          </div>

          {/* Card 2: Farmer */}
          <div
            className={`border rounded p-4 text-xs space-y-3 ${
              selectedAudience === 'Farmer'
                ? 'bg-white border-blue-800 ring-2 ring-blue-700/20 shadow-sm'
                : 'bg-slate-50/60 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Tractor className="w-4 h-4 text-emerald-700" /> Agro-Meteorological
              </span>
              {selectedAudience === 'Farmer' && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Active</span>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed">
              Tailored for fertilizer top-dressing, sowing windows, and harvest drying actions sensitive to rainfall bust.
            </p>
          </div>

          {/* Card 3: Disaster Management */}
          <div
            className={`border rounded p-4 text-xs space-y-3 ${
              selectedAudience === 'Disaster Management'
                ? 'bg-white border-rose-800 ring-2 ring-rose-700/20 shadow-sm'
                : 'bg-slate-50/60 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-700" /> SDMA / NDRF Authority
              </span>
              {selectedAudience === 'Disaster Management' && (
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">Active</span>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed">
              High-readiness protocol. Evaluates high-impact low-probability busts to trigger early logistics mobilization.
            </p>
          </div>
        </div>
      )}

      {/* Active Interpretation Display Box */}
      {advisory && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Issued Guidance for {selectedAudience.toUpperCase()} ({selectedRegion} • Day {selectedLeadDay})
            </h3>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded ${
                advisory.riskTier === 'Critical'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : advisory.riskTier === 'Watch'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              TIER: {advisory.riskTier.toUpperCase()}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed text-slate-800">
            <strong>Advisory Statement:</strong> {advisory.advisoryText}
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs leading-relaxed text-blue-950">
            <strong>Recommended Operational Guidance:</strong> {advisory.actionGuidance}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Advisory decision-support only. Does not replace statutory emergency notifications issued by the State
            Disaster Management Authority.
          </p>
        </div>
      )}
    </div>
  );
};
