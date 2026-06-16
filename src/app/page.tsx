import { DashboardProvider } from '@/context/DashboardContext';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
