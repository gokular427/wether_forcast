import React from 'react';

interface ConfidenceGaugeProps {
  score: number; // 0 to 100
  size?: number;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ score, size = 150 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#059669'; // Green
  if (score < 35) strokeColor = '#dc2626'; // Red
  else if (score < 55) strokeColor = '#ea580c'; // Orange
  else if (score < 75) strokeColor = '#d97706'; // Amber

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size / 1.7} className="overflow-visible">
        {/* Background Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground Colored Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="-mt-8 text-center">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{score}%</span>
        <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Confidence</span>
      </div>
    </div>
  );
};
