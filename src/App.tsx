import React, { useState } from 'react';
import { RegionId, LeadDay, AudienceType } from './types/forecast';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ConfidenceMapPage } from './pages/ConfidenceMapPage';
import { RegionalAnalysisPage } from './pages/RegionalAnalysisPage';
import { DayOutlookPage } from './pages/DayOutlookPage';
import { ErrorProneAreasPage } from './pages/ErrorProneAreasPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { ConsistencyPage } from './pages/ConsistencyPage';
import { AnalogEventsPage } from './pages/AnalogEventsPage';
import { ValidationPage } from './pages/ValidationPage';
import { AccuracyTrackerPage } from './pages/AccuracyTrackerPage';
import { SectorViewPage } from './pages/SectorViewPage';
import { AskForecastPage } from './pages/AskForecastPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { AboutSystemPage } from './pages/AboutSystemPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('Chennai');
  const [selectedLeadDay, setSelectedLeadDay] = useState<LeadDay>(5);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('General');

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            selectedAudience={selectedAudience}
            onRegionChange={setSelectedRegion}
            onLeadDayChange={setSelectedLeadDay}
            onAudienceChange={setSelectedAudience}
          />
        );
      case 'confidence-map':
        return (
          <ConfidenceMapPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            onRegionChange={setSelectedRegion}
            onLeadDayChange={setSelectedLeadDay}
          />
        );
      case 'regional-analysis':
        return (
          <RegionalAnalysisPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            onRegionChange={setSelectedRegion}
          />
        );
      case 'day-outlook':
        return (
          <DayOutlookPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            onRegionChange={setSelectedRegion}
            onLeadDayChange={setSelectedLeadDay}
          />
        );
      case 'error-prone':
        return <ErrorProneAreasPage />;
      case 'explainability':
        return (
          <ExplainabilityPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
          />
        );
      case 'forecast-consistency':
        return (
          <ConsistencyPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
          />
        );
      case 'analog-events':
        return (
          <AnalogEventsPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
          />
        );
      case 'model-validation':
        return <ValidationPage />;
      case 'accuracy-tracker':
        return <AccuracyTrackerPage />;
      case 'sector-view':
        return (
          <SectorViewPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            selectedAudience={selectedAudience}
            onAudienceChange={setSelectedAudience}
            onRegionChange={setSelectedRegion}
            onLeadDayChange={setSelectedLeadDay}
          />
        );
      case 'ask-forecast':
        return <AskForecastPage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'about-system':
        return <AboutSystemPage />;
      default:
        return (
          <DashboardPage
            selectedRegion={selectedRegion}
            selectedLeadDay={selectedLeadDay}
            selectedAudience={selectedAudience}
            onRegionChange={setSelectedRegion}
            onLeadDayChange={setSelectedLeadDay}
            onAudienceChange={setSelectedAudience}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
        <main className="flex-1 p-5 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default App;
