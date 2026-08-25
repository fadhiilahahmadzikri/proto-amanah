import { ChevronRight } from 'lucide-react';
import { ActivityCard } from '@/components/molecules/ActivityCard';
import { cn } from '@/lib/utils';
import type { ActivityMetric } from '@/types/portal.types';

export function TodayActivitySection(props: {
  activities: ActivityMetric[];
  onDetailClick?: () => void;
  onActivityClick?: (activityId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3.5 mb-6', props.className)}>
      {/* Section Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-extrabold text-[#1a1d2e] text-[16px] tracking-tight">
          Aktivitas hari ini
        </h3>
        <button
          type="button"
          onClick={props.onDetailClick}
          className="bg-white border border-gray-200 text-[#0A44FF] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-xs hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          <span>Detail</span>
          <ChevronRight className="h-3 w-3 stroke-[3]" />
        </button>
      </div>

      {/* Activity Cards Row */}
      <div className="flex gap-3 px-1">
        {props.activities.map(activity => (
          <ActivityCard
            key={activity.id}
            item={activity}
            onClick={() => props.onActivityClick?.(activity.id)}
          />
        ))}
      </div>
    </div>
  );
}
