import React, { useEffect, useState } from 'react';
import { RegionId, LeadDay, RegionalMetric } from '../types/forecast';
import { getConfidence } from '../services/forecastService';
import { FeatureContributionChart } from '../components/charts/FeatureContributionChart';
import { LoadingSpinner } from '../components/common/LoadingState';
import { HelpCircle, AlertOctagon } from 'lucide-react';

export const ExplainabilityPage: React.FC<{
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

  if (loading || !metric) return <LoadingSpinner label="Extracting Explainable Drivers..." />;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-rose-800 font-bold mb-1">
          <AlertOctagon className="w-5 h-5 text-rose-700" />
          <h2 className="text-base uppercase tracking-tight">
            WHY IS THIS FORECAST AT {metric.bustProbability}% BUST RISK?
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Target Diagnostic: <strong>{selectedRegion}</strong> Station | Horizon: <strong>Day {selectedLeadDay}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-4 shadow-2xs">
          <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              SHAP-Style Feature Attribution
            </h3>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Demo Feature Attribution (Simulated)
            </span>
          </div>
          <FeatureContributionChart metric={metric} />
          <p className="text-[11px] text-slate-500 italic mt-2">
            Values are deterministic demo contributions used to illustrate how feature-level explanations will be presented.
          </p>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-[#0f294a] uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-700" />
            Plain-Language Meteorological Synthesis
          </h3>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-relaxed">
            Confidence for <strong>{selectedRegion}</strong> at <strong>Day {selectedLeadDay}</strong> is categorized as{' '}
            <strong className="text-slate-900">{metric.confidenceClass.replace('_', ' ')}</strong>.
            The primary uncertainty is driven by{' '}
            <strong className="text-rose-800">{metric.topReasons[0]?.feature}</strong>, wherein ensemble members exhibit{' '}
            {metric.topReasons[0]?.impact.toLowerCase()}. Concurrently, steering flow is categorized as{' '}
            <strong>{metric.steeringFlowStrength}</strong>, limiting atmospheric advection predictability.
          </div>

          <div className="text-xs space-y-2 pt-2">
            <div className="font-bold text-slate-800">Operational Takeaways:</div>
            <ul className="list-disc pl-4 text-slate-600 space-y-1 text-[11px]">
              <li>Review successive runs when confidence drops sharply.</li>
              <li>Use the listed drivers as decision-support context, not as a replacement for forecaster judgment.</li>
              <li>Production deployment will replace these rule-based contributions with validated SHAP output.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
