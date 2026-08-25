import { Calendar, CheckSquare, Contact, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuickActionItem } from '@/types/portal.types';

export function QuickActionButton(props: {
  item: QuickActionItem;
  onClick?: () => void;
  className?: string;
}) {
  const renderIcon = () => {
    switch (props.item.icon) {
      case 'presence':
        return <CheckSquare className="h-6 w-6" />;
      case 'schedule':
        return <Calendar className="h-6 w-6" />;
      case 'search':
        return <Search className="h-6 w-6" />;
      case 'idCard':
        return <Contact className="h-6 w-6" />;
      default:
        return <CheckSquare className="h-6 w-6" />;
    }
  };

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        'flex flex-col items-center gap-2.5 hover:opacity-85 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none select-none',
        props.className,
      )}
    >
      <div className="w-[60px] h-[60px] bg-white rounded-[20px] flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] border border-slate-50 text-[#0A44FF]">
        {renderIcon()}
      </div>
      <span className="text-[#4a4f63] text-[11px] font-bold tracking-tight text-center">
        {props.item.label}
      </span>
    </button>
  );
}
