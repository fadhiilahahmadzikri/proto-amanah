import { ChevronRight } from 'lucide-react';
import { ActivityCard } from '@/components/molecules/ActivityCard';
import { cn } from '@/lib/utils';
import type { ActivityMetric } from '@/types/portal.types';

export function TodayActivitySection(props: {
  activities: ActivityMetric[];
  onDetailClick?: () => void;
  onActivityClick?: (activityId: string) => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <div className={cn('flex flex-col gap-3.5 mb-6', props.className)}>
      {/* Section Header */}
      <div className="flex justify-between items-center px-1">
        <h3
          className={cn(
            'font-extrabold text-[16px] tracking-tight transition-colors',
            isDark ? 'text-white' : 'text-[#1a1d2e]',
          )}
        >
          Aktivitas hari ini
        </h3>
        <button
          type="button"
          onClick={props.onDetailClick}
          className={cn(
            'px-3 py-1.5 rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer focus:outline-none select-none border',
            isDark
              ? 'bg-white/10 border-white/20 text-cyan-400 hover:bg-white/15 backdrop-blur-md'
              : 'bg-white border-gray-200 text-[#0A44FF] hover:bg-gray-50',
          )}
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
            theme={props.theme}
            onClick={() => props.onActivityClick?.(activity.id)}
          />
        ))}
      </div>
    </div>
  );
}
