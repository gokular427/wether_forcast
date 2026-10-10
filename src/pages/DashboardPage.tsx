import React, { useEffect, useState } from 'react';
import { RegionId, LeadDay, AudienceType, RegionalMetric } from '../types/forecast';
import { REGIONS } from '../data/mockForecastData';
import { getConfidence, getMultiDayOutlook } from '../services/forecastService';
import { IndiaMap } from '../components/dashboard/IndiaMap';
import { RegionPanel } from '../components/dashboard/RegionPanel';
import { DayOutlook } from '../components/dashboard/DayOutlook';
import { LoadingSpinner } from '../components/common/LoadingState';
import { Users, Calendar, MapPin, Gauge, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

interface DashboardPageProps {
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
  selectedAudience: AudienceType;
  onRegionChange: (r: RegionId) => void;
  onLeadDayChange: (d: LeadDay) => void;
  onAudienceChange: (a: AudienceType) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  selectedRegion,
  selectedLeadDay,
  selectedAudience,
  onRegionChange,
  onLeadDayChange,
  onAudienceChange,
}) => {
  const [metric, setMetric] = useState<RegionalMetric | null>(null);
  const [outlook, setOutlook] = useState<RegionalMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getConfidence(selectedRegion, selectedLeadDay),
      getMultiDayOutlook(selectedRegion),
    ]).then(([metricRes, outlookRes]) => {
      if (isMounted) {
        setMetric(metricRes);
        setOutlook(outlookRes);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedRegion, selectedLeadDay]);

  return (
    <div className="space-y-5">
      {/* Top Filter & Control Panel */}
      <div className="bg-white border border-slate-200 rounded p-4 flex flex-wrap gap-4 items-center justify-between shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-800" />
            <span className="text-xs font-bold text-slate-700 uppercase">Station / Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value as RegionId)}
              className="bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-800 focus:outline-none"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </div>

          {/* Lead Day Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-800" />
            <span className="text-xs font-bold text-slate-700 uppercase">Forecast Horizon:</span>
            <select
              value={selectedLeadDay}
              onChange={(e) => onLeadDayChange(Number(e.target.value) as LeadDay)}
              className="bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-800 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                <option key={d} value={d}>
                  Day {d} Lead ({d * 24} Hours)
                </option>
              ))}
            </select>
          </div>

          {/* Audience Selector */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-800" />
            <span className="text-xs font-bold text-slate-700 uppercase">Decision Profile:</span>
            <select
              value={selectedAudience}
              onChange={(e) => onAudienceChange(e.target.value as AudienceType)}
              className="bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-800 focus:outline-none"
            >
              <option value="General">General Public</option>
              <option value="Farmer">Agro-Meteorological (Farmer)</option>
              <option value="Disaster Management">State Disaster Response (SDMA)</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Cycle: <strong className="text-slate-800">Operational Run 00Z</strong> | NWP: GEFS v2
        </div>
      </div>

      {/* 4 Official KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>FORECAST CONFIDENCE</span>
            <Gauge className="w-4 h-4 text-blue-800" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#0f294a]">
            {metric ? `${metric.confidenceScore}%` : '--'}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Ensemble convergence certainty index
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>BUST PROBABILITY</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700">
            {metric ? `${metric.bustProbability}%` : '--'}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Risk of categorical or large error
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>CONFIDENCE CLASS</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-lg font-extrabold text-slate-900">
            {metric ? metric.confidenceClass.replace('_', ' ') : '--'}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Demo confidence classification tier
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>MODEL ACCURACY (30D)</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">86.4%</div>
          <p className="mt-1 text-[11px] text-slate-500">
            Simulated rolling validation metric
          </p>
        </div>
      </div>

      {/* Main Grid: Left Map + Right Intelligence Panel */}
      {loading || !metric ? (
        <LoadingSpinner label="Compiling Synoptic Diagnosis..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <IndiaMap
              selectedRegion={selectedRegion}
              selectedLeadDay={selectedLeadDay}
              onSelectRegion={onRegionChange}
            />
          </div>
          <div className="lg:col-span-5">
            <RegionPanel metric={metric} />
          </div>
        </div>
      )}

      {/* Day 1 - 10 Outlook Bar */}
      {outlook.length > 0 && (
        <DayOutlook
          outlookList={outlook}
          selectedLeadDay={selectedLeadDay}
          onSelectDay={onLeadDayChange}
        />
      )}
    </div>
  );
};
