import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const ValidationChart: React.FC = () => {
  const data = [
    { metric: 'AUC-ROC', aiModel: 0.84, climatology: 0.66 },
    { metric: 'Brier Score (Lower is better)', aiModel: 0.14, climatology: 0.22 },
    { metric: 'Hit Rate Accuracy', aiModel: 0.85, climatology: 0.71 },
    { metric: 'Precision on Bust Alerts', aiModel: 0.79, climatology: 0.54 },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#334155' }} />
          <YAxis domain={[0, 1.0]} tick={{ fontSize: 11, fill: '#334155' }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Bar dataKey="aiModel" name="Forecast Confidence AI Model" fill="#0f294a" radius={[3, 3, 0, 0]} />
          <Bar dataKey="climatology" name="Climatological Baseline" fill="#94a3b8" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
