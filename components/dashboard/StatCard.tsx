import { ReactNode } from 'react';
import Card from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend: string;
  trendType?: 'positive' | 'warning' | 'neutral';
}

export default function StatCard({ title, value, icon, trend, trendType = 'positive' }: StatCardProps) {
  const trendColors: Record<string, string> = {
    positive: 'bg-[#25d366]/10 text-[#1a9e4a]',
    warning:  'bg-[#ff8800]/10 text-[#cc6e00]',
    neutral:  'bg-[#f2f6ef] text-[#555555]',
  };

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-[#314f2d]/10 flex items-center justify-center text-[#314f2d]">
          {icon}
        </div>
      </div>
      <div>
        <p className="type-h2 text-[#0a0a0a] leading-none">{value}</p>
        <p className="type-small-body text-[#555555] mt-1">{title}</p>
      </div>
      <span className={`inline-flex items-center self-start px-2 py-0.5 rounded-full text-[11px] font-medium ${trendColors[trendType]}`}>
        {trend}
      </span>
    </Card>
  );
}
