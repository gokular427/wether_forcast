import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  CalendarRange,
  AlertTriangle,
  Lightbulb,
  GitCompare,
  History,
  CheckCheck,
  TrendingUp,
  Layers,
  HelpCircle,
  Database,
  Info,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'confidence-map'
  | 'regional-analysis'
  | 'day-outlook'
  | 'error-prone'
  | 'explainability'
  | 'forecast-consistency'
  | 'analog-events'
  | 'model-validation'
  | 'accuracy-tracker'
  | 'sector-view'
  | 'ask-forecast'
  | 'data-sources'
  | 'about-system';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navSections = [
    {
      heading: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      heading: 'FORECAST INTELLIGENCE',
      items: [
        { id: 'confidence-map', label: 'Confidence Map', icon: MapPin },
        { id: 'regional-analysis', label: 'Regional Analysis', icon: BarChart3 },
        { id: 'day-outlook', label: 'Day 1–10 Outlook', icon: CalendarRange },
        { id: 'error-prone', label: 'Error-Prone Areas', icon: AlertTriangle },
      ],
    },
    {
      heading: 'MODEL INTELLIGENCE',
      items: [
        { id: 'explainability', label: 'Explainability', icon: Lightbulb },
        { id: 'forecast-consistency', label: 'Run Consistency', icon: GitCompare },
        { id: 'analog-events', label: 'Historical Analogs', icon: History },
        { id: 'model-validation', label: 'Model Validation', icon: CheckCheck },
        { id: 'accuracy-tracker', label: 'Accuracy Tracker', icon: TrendingUp },
      ],
    },
    {
      heading: 'DECISION SUPPORT',
      items: [
        { id: 'sector-view', label: 'Sector Advisory', icon: Layers },
        { id: 'ask-forecast', label: 'Ask Forecast Query', icon: HelpCircle },
      ],
    },
    {
      heading: 'SYSTEM ARCHITECTURE',
      items: [
        { id: 'data-sources', label: 'Data Pipelines', icon: Database },
        { id: 'about-system', label: 'About Met Engine', icon: Info },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-85px)] text-sm">
      <div className="py-4 px-3 space-y-5 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              {section.heading}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id as NavTab)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold transition-colors duration-150 ${
                      active
                        ? 'bg-[#0f294a] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-300' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto p-3 border-t border-slate-200 bg-slate-100/70">
        <div className="text-[11px] text-slate-600 font-medium">
          <p className="font-semibold text-slate-800">Operational Target</p>
          <p className="mt-0.5 text-slate-500">Production target: NWP confidence layer</p>
          <div className="mt-2 text-[10px] text-slate-400">SIH 2026 Evaluation Platform</div>
        </div>
      </div>
    </aside>
  );
};
