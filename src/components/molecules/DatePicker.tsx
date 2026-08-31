'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { gsap } from 'gsap';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export function DatePicker(props: {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string;
  placeholder?: string;
  error?: string;
  theme?: 'light' | 'dark';
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const isClosingRef = React.useRef(false);

  // Parse current selected date
  const parsedSelectedDate = React.useMemo(() => {
    if (!props.value) return null;
    try {
      const d = parseISO(props.value);
      return !Number.isNaN(d.getTime()) ? d : null;
    } catch {
      return null;
    }
  }, [props.value]);

  // Current viewing month in calendar view
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => {
    return parsedSelectedDate || new Date();
  });

  // Keep viewing month in sync when value changes externally
  React.useEffect(() => {
    if (parsedSelectedDate) {
      setCalendarMonth(parsedSelectedDate);
    }
  }, [parsedSelectedDate]);

  // GSAP Entrance animation when dropdown opens
  React.useLayoutEffect(() => {
    if (isCalendarOpen && dropdownRef.current) {
      isClosingRef.current = false;
      gsap.killTweensOf(dropdownRef.current);

      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          y: -12,
          scaleY: 0.94,
          transformOrigin: 'top center',
        },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.32,
          ease: 'back.out(1.6)',
        },
      );

      // Stagger day cells for rich tactile physics
      const dayCells = dropdownRef.current.querySelectorAll('.calendar-day-cell');
      if (dayCells.length > 0) {
        gsap.killTweensOf(dayCells);
        gsap.fromTo(
          dayCells,
          {
            opacity: 0,
            scale: 0.85,
            y: -4,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.005,
            ease: 'power2.out',
            delay: 0.03,
          },
        );
      }
    }
  }, [isCalendarOpen]);

  // Animated close handler
  const closeCalendarWithAnimation = React.useCallback((onComplete?: () => void) => {
    if (isClosingRef.current) return;
    if (dropdownRef.current) {
      isClosingRef.current = true;
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -10,
        scaleY: 0.95,
        duration: 0.22,
        ease: 'power3.in',
        onComplete: () => {
          setIsCalendarOpen(false);
          isClosingRef.current = false;
          onComplete?.();
        },
      });
    } else {
      setIsCalendarOpen(false);
      onComplete?.();
    }
  }, []);

  // Close calendar on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isCalendarOpen
      ) {
        closeCalendarWithAnimation();
      }
    }

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen, closeCalendarWithAnimation]);

  // Month Transition with GSAP Swipe Animation
  const handleMonthTransition = (direction: 'prev' | 'next') => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        {
          opacity: 0,
          x: direction === 'next' ? 16 : -16,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.24,
          ease: 'power2.out',
        },
      );
    }
    setCalendarMonth((prev) => (direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)));
  };

  // Generate calendar grid days for current viewing month (Sunday start)
  const calendarDays = React.useMemo(() => {
    const monthStart = startOfMonth(calendarMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [calendarMonth]);

  const handleSelectDay = (day: Date) => {
    const formatted = format(day, 'yyyy-MM-dd');
    props.onChange(formatted);
    closeCalendarWithAnimation();
  };

  const formattedDisplay = parsedSelectedDate
    ? format(parsedSelectedDate, 'd MMMM yyyy', { locale: idLocale })
    : props.placeholder || 'Pilih tanggal';

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1 w-full', props.className)}>
      {props.label && (
        <label className={cn('block text-xs font-bold px-0.5 tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
          {props.label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (isCalendarOpen) {
            closeCalendarWithAnimation();
          } else {
            setIsCalendarOpen(true);
          }
        }}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium flex items-center justify-between transition-all duration-200 cursor-pointer select-none border',
          isDark
            ? isCalendarOpen
              ? 'bg-white/10 text-white border-cyan-400/50 ring-1 ring-cyan-400/20'
              : 'bg-white/5 text-white border-white/10 hover:bg-white/[0.08]'
            : isCalendarOpen
              ? 'bg-[#eff6ff] text-[#0f172b] border-[#0d66e9] ring-2 ring-[#0d66e9]/15'
              : 'bg-[#f8fafc] text-[#0f172b] border-[#e2e8f0] hover:bg-slate-100/80 shadow-2xs',
          props.error && 'border-[#fb2c36] ring-1 ring-[#fb2c36]/30',
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <div
            className={cn(
              'p-1.5 rounded-xl shrink-0 transition-colors',
              isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-[#eff6ff] text-[#0d66e9]',
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </div>
          <span className={cn('font-semibold truncate text-xs', !parsedSelectedDate && 'text-[#90a1b9] font-normal')}>
            {formattedDisplay}
          </span>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-250 ease-out shrink-0 ml-1',
            isCalendarOpen
              ? 'rotate-180 text-[#0d66e9] dark:text-cyan-400'
              : 'text-[#90a1b9] dark:text-neutral-400',
          )}
        />
      </button>

      {props.error && <span className="text-[11px] font-medium text-[#fb2c36] pl-1">{props.error}</span>}

      {/* GSAP Animated Calendar Dropdown Panel */}
      {isCalendarOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 p-3.5 rounded-2xl select-none border shadow-2xl backdrop-blur-xl will-change-transform',
            isDark
              ? 'bg-[#0f1524]/98 text-white border-white/15 shadow-black/80'
              : 'bg-white/98 text-[#0f172b] border-[#e2e8f0] shadow-xl',
          )}
          style={{ top: '100%' }}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-100 dark:border-white/10 pb-2">
            <button
              type="button"
              aria-label="Bulan sebelumnya"
              onClick={(e) => {
                e.stopPropagation();
                handleMonthTransition('prev');
              }}
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-[#314158]',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className={cn('text-xs font-bold capitalize', isDark ? 'text-white' : 'text-[#0f172b]')}>
              {format(calendarMonth, 'MMMM yyyy', { locale: idLocale })}
            </span>

            <button
              type="button"
              aria-label="Bulan berikutnya"
              onClick={(e) => {
                e.stopPropagation();
                handleMonthTransition('next');
              }}
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-[#314158]',
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {dayNames.map((dayName) => (
              <span
                key={dayName}
                className={cn('text-[10px] font-semibold', isDark ? 'text-neutral-500' : 'text-[#90a1b9]')}
              >
                {dayName}
              </span>
            ))}
          </div>

          {/* Animated Day Cells Grid */}
          <div ref={gridRef} className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isCurMonth = isSameMonth(day, calendarMonth);
              const isSelected = parsedSelectedDate ? isSameDay(day, parsedSelectedDate) : false;
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'calendar-day-cell h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95',
                    isSelected
                      ? isDark
                        ? 'btn-crisp-blue-dark font-bold shadow-xs'
                        : 'btn-crisp-blue font-bold shadow-xs'
                      : isTodayDate
                        ? isDark
                          ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30'
                          : 'bg-[#eff6ff] text-[#0d66e9] font-bold border border-blue-200/60'
                        : isCurMonth
                          ? isDark
                            ? 'text-neutral-200 hover:bg-white/10'
                            : 'text-[#0f172b] hover:bg-slate-100'
                          : isDark
                            ? 'text-neutral-600 hover:bg-white/5'
                            : 'text-[#90a1b9] hover:bg-slate-50',
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
