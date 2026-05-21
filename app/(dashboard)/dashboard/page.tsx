'use client';

import { useCallback, useEffect, useState } from 'react';
import { Package, FileText, Users, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/dashboard/StatCard';
import RecentQuotations from '@/components/dashboard/RecentQuotations';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import TopIngredients from '@/components/dashboard/TopIngredients';
import { fetchDashboard } from '@/lib/api/dashboard';
import { ApiError } from '@/lib/api/errors';
import type { DashboardData } from '@/lib/api/types';
import { formatPercentChange } from '@/lib/utils';
import toast from 'react-hot-toast';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-[#f2f6ef]" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-80 rounded-xl bg-[#f2f6ef]" />
        <div className="h-80 rounded-xl bg-[#f2f6ef]" />
      </div>
      <div className="h-64 rounded-xl bg-[#f2f6ef]" />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboard = await fetchDashboard();
      setData(dashboard);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Failed to load dashboard. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm text-[#555555] max-w-md">{error}</p>
        <Button leftIcon={<RefreshCw size={16} />} onClick={() => void loadDashboard()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentQuotations, activityFeed, topIngredients } = data;
  const quotationsTrendType =
    stats.quotationsChange > 0 ? 'positive' : stats.quotationsChange < 0 ? 'warning' : 'neutral';

  return (
    <div className="flex flex-col gap-6">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#555555]">
          <Loader2 size={16} className="animate-spin" />
          Refreshing…
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Ingredients"
          value={stats.totalIngredients.toLocaleString('en-IN')}
          icon={<Package size={18} />}
          trend={`${stats.ingredientsThisMonth.toLocaleString('en-IN')} this month`}
          trendType="positive"
        />
        <StatCard
          title="Quotations This Month"
          value={stats.quotationsThisMonth.toLocaleString('en-IN')}
          icon={<FileText size={18} />}
          trend={formatPercentChange(stats.quotationsChange)}
          trendType={quotationsTrendType}
        />
        <StatCard
          title="Total Quotations"
          value={stats.totalQuotations.toLocaleString('en-IN')}
          icon={<TrendingUp size={18} />}
          trend={`${stats.quotationsLastMonth} last month`}
          trendType="neutral"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees.toLocaleString('en-IN')}
          icon={<Users size={18} />}
          trend={`${stats.newEmployeesThisWeek} new this week`}
          trendType={stats.newEmployeesThisWeek > 0 ? 'positive' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card padding={false} className="xl:col-span-2 p-4 sm:p-6 min-w-0">
          <RecentQuotations quotations={recentQuotations} />
        </Card>
        <Card padding={false} className="p-4 sm:p-6 min-w-0">
          <ActivityFeed activities={activityFeed} />
        </Card>
      </div>

      <Card padding={false} className="p-4 sm:p-6">
        <TopIngredients ingredients={topIngredients} />
      </Card>
    </div>
  );
}
