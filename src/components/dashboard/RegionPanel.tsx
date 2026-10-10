import React from 'react';
import { RegionalMetric } from '../../types/forecast';
import { ConfidenceGauge } from '../common/ConfidenceGauge';
import { RiskBadge } from '../common/RiskBadge';
import { History, Wind } from 'lucide-react';

interface RegionPanelProps {
  metric: RegionalMetric;
}

export const RegionPanel: React.FC<RegionPanelProps> = ({ metric }) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Station Telemetry & Diagnostics
          </div>
          <h2 className="text-lg font-extrabold text-[#0f294a]">{metric.region} Station</h2>
          <div className="text-xs text-slate-600">Lead Forecast Horizon: Day {metric.leadDay} ({metric.leadDay * 24}h)</div>
        </div>
        <div>
          <RiskBadge status={metric.confidenceClass} size="md" />
        </div>
      </div>

      {/* Main Dial & Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50/70 p-3 rounded border border-slate-200/70">
        <div>
          <ConfidenceGauge score={metric.confidenceScore} size={150} />
        </div>
        <div className="space-y-2 text-xs">
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Forecast Bust Risk</span>
            <span className="text-lg font-black text-rose-700">{metric.bustProbability}%</span>
            <span className="text-[11px] text-slate-500 ml-1.5">(Inversion of confidence)</span>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
            <span className="text-slate-600">Ensemble Spread:</span>
            <span className="font-bold text-slate-900">{metric.ensembleSpread} σ</span>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
            <span className="text-slate-600">Steering Flow:</span>
            <span className="font-bold text-slate-900">{metric.steeringFlowStrength}</span>
          </div>
        </div>
      </div>

      {/* Top Meteorological Drivers */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Wind className="w-3.5 h-3.5 text-blue-700" />
          Primary Uncertainty Drivers
        </h4>
        <div className="space-y-2">
          {metric.topReasons.map((reason, idx) => (
            <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">{reason.feature}</span>
                <span className="text-[11px] font-semibold text-rose-700">+{reason.contribution}% Risk</span>
              </div>
              <p className="text-[11px] text-slate-600">{reason.impact}</p>
              {/* Contribution Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-blue-800 h-full rounded-full"
                  style={{ width: `${Math.min(100, reason.contribution * 2.2)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Analog Match */}
      <div className="bg-blue-50/60 border border-blue-200 rounded p-3 text-xs">
        <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
          <History className="w-3.5 h-3.5 text-blue-700" />
          <span>Closest Synoptic Analog Retrieval</span>
        </div>
        <p className="font-semibold text-slate-800 text-[11px]">{metric.analogEvent.name}</p>
        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
          {metric.analogEvent.synopticDescription}
        </p>
        <div className="mt-2 flex gap-4 text-[10px] font-bold text-slate-700">
          <span>Pattern Similarity: <strong className="text-blue-800">{metric.analogEvent.similarity}%</strong></span>
          <span>Verified Event Error: <strong className="text-rose-700">{metric.analogEvent.historicalError}%</strong></span>
        </div>
      </div>
    </div>
  );
};
