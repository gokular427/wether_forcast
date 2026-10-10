import React from 'react';
import { LeadDay, RegionalMetric } from '../../types/forecast';

interface DayOutlookProps {
  outlookList: RegionalMetric[];
  selectedLeadDay: LeadDay;
  onSelectDay: (day: LeadDay) => void;
}

export const DayOutlook: React.FC<DayOutlookProps> = ({
  outlookList,
  selectedLeadDay,
  onSelectDay,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Day 1 to Day 10 Sequential Uncertainty Envelope
          </h3>
          <p className="text-[11px] text-slate-500">
            Click any lead horizon to inspect atmospheric stability and feature contributions
          </p>
        </div>
        <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Selected: Day {selectedLeadDay}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {outlookList.map((item) => {
          const isSelected = item.leadDay === selectedLeadDay;
          let colorBorder = 'border-slate-200';
          let badgeColor = 'bg-emerald-100 text-emerald-800';

          if (item.confidenceClass === 'MODERATE') {
            badgeColor = 'bg-amber-100 text-amber-900';
          } else if (item.confidenceClass === 'LOW') {
            badgeColor = 'bg-orange-100 text-orange-900';
          } else if (item.confidenceClass === 'VERY_LOW') {
            badgeColor = 'bg-rose-100 text-rose-900';
          }

          if (isSelected) {
            colorBorder = 'border-blue-900 ring-2 ring-blue-700/30';
          }

          return (
            <button
              key={item.leadDay}
              onClick={() => onSelectDay(item.leadDay)}
              className={`text-left p-2.5 rounded border ${colorBorder} transition-all duration-150 ${
                isSelected ? 'bg-blue-50/50' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>Day {item.leadDay}</span>
                <span className={`text-[9px] font-black px-1 rounded ${badgeColor}`}>
                  {item.confidenceClass === 'VERY_LOW' ? 'V.LOW' : item.confidenceClass}
                </span>
              </div>
              <div className="mt-2 text-base font-extrabold text-slate-900">
                {item.confidenceScore}%
              </div>
              <div className="text-[10px] font-semibold text-rose-600">
                {item.bustProbability}% bust
              </div>
              <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.confidenceScore >= 75
                      ? 'bg-emerald-600'
                      : item.confidenceScore >= 55
                      ? 'bg-amber-500'
                      : item.confidenceScore >= 35
                      ? 'bg-orange-500'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${item.confidenceScore}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
