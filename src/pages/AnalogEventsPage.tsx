import React, { useEffect, useState } from 'react';
import { RegionId, LeadDay, RegionalMetric } from '../types/forecast';
import { getConfidence } from '../services/forecastService';
import { LoadingSpinner } from '../components/common/LoadingState';
import { History } from 'lucide-react';

export const AnalogEventsPage: React.FC<{
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
}> = ({ selectedRegion, selectedLeadDay }) => {
  const [metric, setMetric] = useState<RegionalMetric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getConfidence(selectedRegion, selectedLeadDay).then((res) => {
      setMetric(res);
      setLoading(false);
    });
  }, [selectedRegion, selectedLeadDay]);

  const curatedAnalogs = [
    {
      title: 'Monsoon Break-to-Active Transition — July 2019',
      region: 'Central & Coastal India',
      errorObserved: '55% Bust Error',
      similarity: '89%',
      notes: 'Trough depression over Bay of Bengal stalled, generating unforecast extreme localized convective bursts.',
    },
    {
      title: 'Cyclone Amphan Approaching Recurvature — May 2020',
      region: 'East Coast & Gangetic Basin',
      errorObserved: '49% Bust Error',
      similarity: '86%',
      notes: 'Mid-latitude jet stream dry slotting accelerated forward motion 18 hours faster than 7-day model median.',
    },
    {
      title: 'Pre-Monsoon Heatwave Disruption — North India — May 2022',
      region: 'Northwest Plains',
      errorObserved: '42% Bust Error',
      similarity: '84%',
      notes: 'Dry boundary layer thermal lapse underforecasted maximum temperatures across Delhi/NCR by 3.8°C.',
    },
    {
      title: 'Western Disturbance Interaction — February 2021',
      region: 'Western Himalayas / Northern Plains',
      errorObserved: '38% Bust Error',
      similarity: '82%',
      notes: 'High-altitude trough interacted with moisture stream from Arabian sea, displacing snowfall locus 220km east.',
    },
  ];

  if (loading || !metric) return <LoadingSpinner label="Fetching Closest Historical Pattern Analogs..." />;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
          <History className="w-5 h-5 text-blue-800" />
          Synoptic Analog Matching Engine
        </h2>
        <p className="text-xs text-slate-500">
          Identifies historical days with similar geopotential height, shear, and moisture patterns
        </p>
      </div>

      {/* Selected Match Card */}
      <div className="bg-blue-50/70 border border-blue-200 rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">
            Best Historical Analog For Selected Condition
          </span>
          <span className="text-xs font-bold text-slate-700">Demo Analog Retrieval</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900">{metric.analogEvent.name}</h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{metric.analogEvent.synopticDescription}</p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-800">
          <div className="bg-white px-2.5 py-1 rounded border border-blue-200">
            Pattern Similarity: <strong className="text-blue-700">{metric.analogEvent.similarity}%</strong>
          </div>
          <div className="bg-white px-2.5 py-1 rounded border border-blue-200">
            Historical Lead Error: <strong className="text-rose-700">{metric.analogEvent.historicalError}%</strong>
          </div>
          <div className="bg-white px-2.5 py-1 rounded border border-blue-200">
            Target Region: <strong>{selectedRegion}</strong>
          </div>
        </div>
      </div>

      {/* Curated Historical Bank */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Curated Benchmark Met Catalog
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curatedAnalogs.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded p-3.5 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                  {item.similarity}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">{item.notes}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <span>Domain: {item.region}</span>
                <span className="text-rose-700 font-bold">{item.errorObserved}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
