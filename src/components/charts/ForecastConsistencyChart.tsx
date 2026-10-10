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
import { RunHistoryItem } from '../../types/forecast';

interface ConsistencyChartProps {
  runs: RunHistoryItem[];
}

export const ForecastConsistencyChart: React.FC<ConsistencyChartProps> = ({ runs }) => {
  const data = runs.map((r) => ({
    cycle: r.runLabel.replace('Operational Run ', ''),
    bustProb: r.bustProbability,
    confidence: r.confidenceScore,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="cycle" tick={{ fontSize: 11, fill: '#334155' }} />
          <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#334155' }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line
            type="monotone"
            dataKey="bustProb"
            name="Bust Probability (%)"
            stroke="#dc2626"
            strokeWidth={2.5}
            dot={{ r: 5, fill: '#dc2626' }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="confidence"
            name="Confidence Score (%)"
            stroke="#0f294a"
            strokeWidth={2.5}
            dot={{ r: 5, fill: '#0f294a' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
