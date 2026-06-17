'use client';
import { useDashboard } from '@/context/DashboardContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import OverviewView    from '@/components/views/OverviewView';
import BrandView       from '@/components/views/BrandView';
import BrandPerfView   from '@/components/views/BrandPerfView';
import PerformanceView from '@/components/views/PerformanceView';
import MarketsView     from '@/components/views/MarketsView';
import AttributionView from '@/components/views/AttributionView';
import CompetitionView from '@/components/views/CompetitionView';

export default function Dashboard() {
  const { activeView } = useDashboard();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="view-content">
          {activeView === 'overview'    && <OverviewView />}
          {activeView === 'brand'       && <BrandView />}
          {activeView === 'brandperf'   && <BrandPerfView />}
          {activeView === 'performance' && <PerformanceView />}
          {activeView === 'markets'     && <MarketsView />}
          {activeView === 'attribution' && <AttributionView />}
          {activeView === 'competition' && <CompetitionView />}
        </div>
      </div>
    </div>
  );
}
