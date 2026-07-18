import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
