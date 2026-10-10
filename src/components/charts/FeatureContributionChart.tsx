import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RegionalMetric } from '../../types/forecast';

interface FeatureChartProps {
  metric: RegionalMetric;
}

export const FeatureContributionChart: React.FC<FeatureChartProps> = ({ metric }) => {
  const chartData = metric.topReasons.map((r) => ({
    name: r.feature,
    contribution: r.contribution,
    impact: r.impact,
  }));

  const COLORS = ['#0f294a', '#1d4ed8', '#0284c7', '#475569'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 45]} unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }}
            width={135}
          />
          <Tooltip
            formatter={(value: any, _name: any, item: any) => [
              `${value}% Bust Risk Weight`,
              `Observed: ${item.payload.impact}`,
            ]}
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '11px' }}
          />
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
