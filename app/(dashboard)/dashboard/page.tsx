'use client';

import { useEffect, useState } from 'react';
import { Package, FileText, Upload, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import StatCard from '@/components/dashboard/StatCard';
import RecentQuotations from '@/components/dashboard/RecentQuotations';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { fetchIngredients } from '@/lib/api/ingredients';
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import { MOCK_UPLOADS } from '@/lib/mock-data/uploads';

const recentQuotations = MOCK_QUOTATIONS.slice(0, 5);
const pendingCount = MOCK_QUOTATIONS.filter((q) => q.status === 'draft').length;
const completedUploads = MOCK_UPLOADS.filter((u) => u.status === 'completed').length;

export default function DashboardPage() {
  const [ingredientTotal, setIngredientTotal] = useState<number | null>(null);

  useEffect(() => {
    fetchIngredients({ page: 1, limit: 1 })
      .then((data) => setIngredientTotal(data.pagination.total))
      .catch(() => setIngredientTotal(null));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Ingredients"
          value={ingredientTotal ?? '—'}
          icon={<Package size={18} />}
          trend="+8 this month"
          trendType="positive"
        />
        <StatCard
          title="Quotations This Month"
          value={MOCK_QUOTATIONS.length}
          icon={<FileText size={18} />}
          trend="+12% vs last month"
          trendType="positive"
        />
        <StatCard
          title="Completed Uploads"
          value={completedUploads}
          icon={<Upload size={18} />}
          trend="Files processed"
          trendType="positive"
        />
        <StatCard
          title="Pending Quotations"
          value={pendingCount}
          icon={<Clock size={18} />}
          trend="Needs action"
          trendType="warning"
        />
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card padding={false} className="xl:col-span-2 p-6">
          <RecentQuotations quotations={recentQuotations} />
        </Card>
        <Card padding={false} className="p-6">
          <ActivityFeed />
        </Card>
      </div>
    </div>
  );
}
