import React from 'react';
import { ConfidenceClass } from '../../types/forecast';

interface RiskBadgeProps {
  status: ConfidenceClass | 'HIGH' | 'MODERATE' | 'LOW' | 'VERY_LOW';
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[11px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold tracking-wider',
    lg: 'px-3 py-1.5 text-sm font-bold tracking-wider',
  };

  switch (status) {
    case 'HIGH':
      return (
        <span className={`inline-flex items-center rounded border border-emerald-300 bg-emerald-50 text-emerald-800 ${sizeClasses[size]}`}>
          <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-600"></span>
          HIGH CONFIDENCE
        </span>
      );
    case 'MODERATE':
      return (
        <span className={`inline-flex items-center rounded border border-amber-300 bg-amber-50 text-amber-800 ${sizeClasses[size]}`}>
          <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-600"></span>
          MODERATE
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center rounded border border-orange-300 bg-orange-50 text-orange-900 ${sizeClasses[size]}`}>
          <span className="mr-1.5 h-2 w-2 rounded-full bg-orange-500"></span>
          LOW CONFIDENCE
        </span>
      );
    case 'VERY_LOW':
    default:
      return (
        <span className={`inline-flex items-center rounded border border-rose-300 bg-rose-50 text-rose-800 ${sizeClasses[size]}`}>
          <span className="mr-1.5 h-2 w-2 rounded-full bg-rose-600"></span>
          VERY LOW / HIGH BUST RISK
        </span>
      );
  }
};
