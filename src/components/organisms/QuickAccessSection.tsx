import { QuickActionButton } from '@/components/atoms/QuickActionButton';
import { cn } from '@/lib/utils';
import type { QuickActionItem } from '@/types/portal.types';

export function QuickAccessSection(props: {
  actions: QuickActionItem[];
  onActionClick?: (actionId: string) => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex justify-between items-start px-1 mb-9',
        props.className,
      )}
    >
      {props.actions.map(action => (
        <QuickActionButton
          key={action.id}
          item={action}
          theme={props.theme}
          onClick={() => props.onActionClick?.(action.id)}
        />
      ))}
    </div>
  );
}
