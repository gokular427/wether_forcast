import React, { useMemo, useState } from 'react';
import { RegionId, LeadDay, RegionalMetric } from '../../types/forecast';
import { FORECAST_DATABASE, REGIONS } from '../../data/mockForecastData';

interface IndiaMapProps {
  selectedRegion: RegionId;
  selectedLeadDay: LeadDay;
  onSelectRegion: (reg: RegionId) => void;
}

interface StationPosition {
  id: RegionId;
  name: string;
  state: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  labelSide: 'left' | 'right';
}

const VIEW_W = 760;
const VIEW_H = 720;
const PAD_X = 58;
const PAD_Y = 44;
const MIN_LNG = 67.4;
const MAX_LNG = 97.6;
const MIN_LAT = 6.4;
const MAX_LAT = 37.6;

const project = (lng: number, lat: number) => ({
  x: PAD_X + ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * (VIEW_W - PAD_X * 2),
  y: PAD_Y + ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * (VIEW_H - PAD_Y * 2),
});

// Simplified geographic outline using longitude/latitude control points.
// It is intentionally lightweight for an offline demo while keeping the India silhouette recognizable.
const INDIA_MAINLAND: Array<[number, number]> = [
  [68.0, 23.7], [68.6, 22.6], [69.0, 21.6], [69.8, 20.7], [70.7, 19.7],
  [71.6, 19.1], [72.4, 18.4], [72.9, 17.4], [73.3, 16.5], [73.7, 15.6],
  [74.2, 14.7], [74.7, 13.8], [75.1, 12.9], [75.5, 12.0], [75.9, 11.1],
  [76.2, 10.2], [76.4, 9.3], [76.8, 8.4], [77.2, 7.8], [77.8, 8.3],
  [78.3, 9.1], [78.8, 10.0], [79.3, 10.9], [79.8, 11.8], [80.2, 12.8],
  [80.4, 13.8], [80.8, 14.8], [81.2, 15.8], [81.8, 16.8], [82.5, 17.7],
  [83.2, 18.6], [84.0, 19.4], [84.9, 20.1], [85.8, 20.7], [86.7, 21.2],
  [87.5, 21.5], [88.1, 22.0], [88.6, 22.6], [89.0, 23.5], [89.2, 24.3],
  [89.6, 25.0], [90.4, 25.5], [91.1, 25.8], [91.9, 26.2], [92.7, 26.7],
  [93.5, 27.2], [94.4, 27.5], [95.4, 27.9], [96.2, 28.6], [96.4, 29.5],
  [95.3, 29.8], [94.2, 29.6], [93.1, 29.4], [92.0, 28.9], [91.0, 28.4],
  [90.1, 27.9], [89.3, 27.5], [88.8, 27.7], [88.3, 28.2], [88.0, 28.9],
  [88.2, 29.6], [88.0, 30.3], [87.4, 30.9], [86.6, 31.5], [85.8, 32.2],
  [84.9, 32.8], [84.0, 33.4], [83.0, 34.0], [82.1, 34.6], [81.2, 35.0],
  [80.2, 35.4], [79.3, 35.7], [78.5, 35.5], [77.7, 35.1], [76.9, 34.8],
  [76.0, 34.6], [75.2, 34.4], [74.5, 34.0], [73.9, 33.4], [73.3, 32.8],
  [72.7, 32.1], [72.1, 31.4], [71.5, 30.7], [70.9, 30.1], [70.4, 29.4],
  [69.9, 28.7], [69.4, 27.9], [69.0, 27.0], [68.6, 26.1], [68.2, 25.1],
  [68.0, 23.7],
];

const MAINLAND_PATH = INDIA_MAINLAND.map(([lng, lat], i) => {
  const p = project(lng, lat);
  return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join(' ') + ' Z';

const getMarkerColor = (metric?: RegionalMetric) => {
  if (!metric) return '#64748b';
  switch (metric.confidenceClass) {
    case 'HIGH': return '#059669';
    case 'MODERATE': return '#d97706';
    case 'LOW': return '#ea580c';
    default: return '#dc2626';
  }
};

const riskLabel = (metric?: RegionalMetric) => {
  if (!metric) return 'N/A';
  return metric.confidenceClass.replace('_', ' ');
};

export const IndiaMap: React.FC<IndiaMapProps> = ({
  selectedRegion,
  selectedLeadDay,
  onSelectRegion,
}) => {
  const [hoveredStation, setHoveredStation] = useState<StationPosition | null>(null);

  const stations = useMemo<StationPosition[]>(() => REGIONS.map((r) => {
    const pos = project(r.lng, r.lat);
    const labelSide: 'left' | 'right' = ['Mumbai', 'Bengaluru', 'Kochi'].includes(r.id) ? 'left' : 'right';
    return { ...r, ...pos, labelSide };
  }), []);

  const hoveredMetric = hoveredStation
    ? FORECAST_DATABASE[`${hoveredStation.id}_${selectedLeadDay}`]
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded p-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2.5 mb-3 gap-2">
        <div>
          <h3 className="text-xs font-bold text-[#0f294a] uppercase tracking-wider">
            Forecast Confidence — Day {selectedLeadDay}
          </h3>
          <p className="text-[11px] text-slate-500">
            Region-level forecast reliability across selected Indian meteorological stations
          </p>
        </div>
        <div className="text-[10px] bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-bold text-slate-700">
          INDIA • OFFLINE DEMO MAP
        </div>
      </div>

      <div className="relative bg-[#fbfdff] border border-slate-200 rounded overflow-hidden">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto select-none" style={{ maxHeight: 560 }}>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#fbfdff" />

          <g stroke="#e6edf5" strokeWidth="1" strokeDasharray="4 5">
            {[10, 15, 20, 25, 30, 35].map((lat) => {
              const y = project(77, lat).y;
              return <line key={`lat-${lat}`} x1="34" y1={y} x2={VIEW_W - 34} y2={y} />;
            })}
            {[70, 75, 80, 85, 90, 95].map((lng) => {
              const x = project(lng, 20).x;
              return <line key={`lng-${lng}`} x1={x} y1="30" x2={x} y2={VIEW_H - 30} />;
            })}
          </g>

          <g fill="#94a3b8" fontSize="9" fontWeight="600">
            {[10, 15, 20, 25, 30, 35].map((lat) => {
              const y = project(77, lat).y + 3;
              return <text key={`lat-t-${lat}`} x="10" y={y}>{lat}°N</text>;
            })}
          </g>

          <text x="74" y="526" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="2">ARABIAN SEA</text>
          <text x="520" y="494" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="2">BAY OF BENGAL</text>
          <text x="294" y="690" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="1.5">INDIAN OCEAN</text>

          <path
            d={MAINLAND_PATH}
            fill="#eef4f9"
            stroke="#36516f"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Indicative internal guide lines: visual aid only, not political boundaries. */}
          <g stroke="#c7d3e0" strokeWidth="1" strokeDasharray="5 5" fill="none" opacity="0.9">
            <path d={`M ${project(72.5, 24.0).x} ${project(72.5, 24.0).y} L ${project(88.2, 22.7).x} ${project(88.2, 22.7).y}`} />
            <path d={`M ${project(76.8, 30.5).x} ${project(76.8, 30.5).y} L ${project(82.5, 17.0).x} ${project(82.5, 17.0).y}`} />
            <path d={`M ${project(73.2, 19.0).x} ${project(73.2, 19.0).y} L ${project(88.0, 23.0).x} ${project(88.0, 23.0).y}`} />
          </g>

          {/* Lakshadweep */}
          <g fill="#d8e2ec" stroke="#8da2b8" strokeWidth="1">
            <ellipse cx={project(72.6, 11.8).x} cy={project(72.6, 11.8).y} rx="4" ry="7" />
            <ellipse cx={project(72.3, 10.6).x} cy={project(72.3, 10.6).y} rx="3.2" ry="6" />
          </g>
          <text x={project(69.5, 10.7).x} y={project(69.5, 10.7).y} fill="#94a3b8" fontSize="8">Lakshadweep</text>

          {/* Andaman & Nicobar */}
          <g fill="#d8e2ec" stroke="#8da2b8" strokeWidth="1">
            <ellipse cx={project(92.75, 13.4).x} cy={project(92.75, 13.4).y} rx="4" ry="10" />
            <ellipse cx={project(92.82, 11.6).x} cy={project(92.82, 11.6).y} rx="4" ry="12" />
            <ellipse cx={project(93.0, 9.3).x} cy={project(93.0, 9.3).y} rx="4" ry="11" />
          </g>
          <text x={project(89.4, 14.6).x} y={project(89.4, 14.6).y} fill="#94a3b8" fontSize="8">Andaman & Nicobar</text>

          {stations.map((station) => {
            const metric = FORECAST_DATABASE[`${station.id}_${selectedLeadDay}`];
            const isSelected = selectedRegion === station.id;
            const isHovered = hoveredStation?.id === station.id;
            const color = getMarkerColor(metric);
            const labelWidth = Math.max(54, station.id.length * 7 + 16);
            const labelX = station.labelSide === 'left' ? station.x - labelWidth - 11 : station.x + 11;
            const labelY = station.y - 11;

            return (
              <g
                key={station.id}
                className="cursor-pointer"
                role="button"
                aria-label={`Select ${station.id}`}
                tabIndex={0}
                onClick={() => onSelectRegion(station.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectRegion(station.id); }}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {isSelected && (
                  <>
                    <circle cx={station.x} cy={station.y} r="17" fill="none" stroke="#0f294a" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx={station.x} cy={station.y} r="11.5" fill="none" stroke="#2563eb" strokeWidth="2" />
                  </>
                )}
                <circle cx={station.x} cy={station.y} r={isSelected || isHovered ? 7.5 : 6.3} fill="#ffffff" stroke="#334155" strokeWidth="1.2" />
                <circle cx={station.x} cy={station.y} r={isSelected || isHovered ? 5.5 : 4.5} fill={color} />

                <rect
                  x={labelX}
                  y={labelY}
                  width={labelWidth}
                  height="20"
                  rx="3"
                  fill={isSelected ? '#0f294a' : '#ffffff'}
                  stroke={isSelected ? '#0f294a' : '#b8c6d6'}
                  strokeWidth="1"
                />
                <text
                  x={labelX + labelWidth / 2}
                  y={labelY + 13.5}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#0f294a'}
                  fontSize="9"
                  fontWeight="700"
                >
                  {station.id}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredStation && hoveredMetric && (
          <div className="pointer-events-none absolute top-3 right-3 w-64 rounded border border-slate-300 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-extrabold text-[#0f294a]">{hoveredStation.name}</div>
                <div className="text-[10px] text-slate-500">{hoveredStation.state}</div>
              </div>
              <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: getMarkerColor(hoveredMetric) }}>
                {riskLabel(hoveredMetric)}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-600">
              <span>Lead day</span><strong className="text-right text-slate-900">Day {selectedLeadDay}</strong>
              <span>Confidence</span><strong className="text-right text-slate-900">{hoveredMetric.confidenceScore}%</strong>
              <span>Bust probability</span><strong className="text-right text-rose-700">{hoveredMetric.bustProbability}%</strong>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[10px]">
        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <span className="font-bold uppercase tracking-wider text-slate-500">Confidence:</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-emerald-600" />High</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-amber-600" />Moderate</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-orange-600" />Low</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-red-600" />Very Low</span>
        </div>
        <span className="text-slate-400">Markers use real station latitude/longitude positions.</span>
      </div>
    </div>
  );
};
