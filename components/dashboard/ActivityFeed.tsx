import type { DashboardActivity, DashboardActivityType } from '@/lib/api/types';
import { formatRelativeTime } from '@/lib/utils';

type ActivityVisualType = 'quotation' | 'price' | 'client' | 'import' | 'neutral';

function mapActivityType(type: DashboardActivityType): ActivityVisualType {
  switch (type) {
    case 'quotation_created':
      return 'quotation';
    case 'ingredient_updated':
      return 'price';
    case 'employee_added':
      return 'client';
    default:
      return 'neutral';
  }
}

const TYPE_COLORS: Record<ActivityVisualType, string> = {
  quotation: 'bg-[#25d366]',
  price: 'bg-[#ff8800]',
  client: 'bg-[#314f2d]',
  import: 'bg-[#7c9f43]',
  neutral: 'bg-[#a3a29e]',
};

interface ActivityFeedProps {
  activities: DashboardActivity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div>
      <h2 className="type-h3-18 text-[#0a0a0a] mb-4">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-sm text-[#555555] py-6 text-center">No recent activity.</p>
      ) : (
        <div className="space-y-0 max-h-[420px] overflow-y-auto pr-1">
          {activities.map((activity, i) => {
            const visualType = mapActivityType(activity.type);
            return (
              <div
                key={`${activity.type}-${activity.time}-${i}`}
                className="flex gap-3 py-3 border-b border-[#f2f6ef] last:border-0"
              >
                <div className="flex flex-col items-center flex-shrink-0 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${TYPE_COLORS[visualType]} flex-shrink-0`}
                  />
                  {i < activities.length - 1 && (
                    <div className="w-px flex-1 bg-[#e8ece5] mt-1 min-h-[24px]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#373737] leading-snug">{activity.message}</p>
                  {activity.detail ? (
                    <p className="text-xs text-[#555555] mt-0.5 truncate">{activity.detail}</p>
                  ) : null}
                  <p className="text-[11px] text-[#a3a29e] mt-0.5">
                    {formatRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
