import { Calendar, CheckSquare, Contact, History, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuickActionItem } from '@/types/portal.types';

export function QuickActionButton(props: {
  item: QuickActionItem;
  onClick?: () => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  const renderIcon = () => {
    switch (props.item.icon) {
      case 'history':
        return <History className="h-6 w-6 stroke-[2.2]" />;
      case 'presence':
        return <CheckSquare className="h-6 w-6" />;
      case 'schedule':
        return <Calendar className="h-6 w-6" />;
      case 'search':
        return <Search className="h-6 w-6" />;
      case 'antrean':
        return <Users className="h-6 w-6 stroke-[2.2]" />;
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
        'flex flex-col items-center gap-2 hover:opacity-85 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none select-none',
        props.className,
      )}
    >
      <div
        className={cn(
          'w-[60px] h-[60px] rounded-[20px] flex items-center justify-center transition-all duration-300',
          isDark
            ? 'bg-neutral-900/90 text-cyan-400 shadow-xl shadow-black/40 backdrop-blur-xl'
            : 'bg-white text-[#0d66e9] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)]',
        )}
      >
        {renderIcon()}
      </div>
      <span
        className={cn(
          'text-[11px] font-medium tracking-tight text-center transition-colors',
          isDark ? 'text-slate-400' : 'text-slate-500',
        )}
      >
        {props.item.label}
      </span>
    </button>
  );
}
