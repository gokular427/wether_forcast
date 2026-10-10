import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RollingAccuracyRecord } from '../../types/forecast';

export const AccuracyChart: React.FC<{ data: RollingAccuracyRecord[] }> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} />
          <YAxis domain={[60, 100]} unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
          <Tooltip
            formatter={(value: any) => [`${value}%`]}
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Line
            type="monotone"
            dataKey="rollingAccuracy"
            name="AI Confidence System (Rolling 45-Day)"
            stroke="#0f294a"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#0f294a' }}
          />
          <Line
            type="monotone"
            dataKey="climatologyBaseline"
            name="Climatology / Persistence Baseline"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
