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
        <label className={cn('block text-xs font-semibold px-0.5', isDark ? 'text-neutral-200' : 'text-slate-700')}>
          {props.label}
        </label>
      )}

      {/* Trigger Button (1:1 with ScheduleTabScreen master pattern) */}
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
              ? 'bg-white/10 text-white border-cyan-400/40 ring-1 ring-cyan-400/20'
              : 'bg-white/5 text-white border-white/10 hover:bg-white/[0.08]'
            : isCalendarOpen
              ? 'bg-slate-100/90 text-slate-900 border-blue-600/40 ring-1 ring-blue-600/20'
              : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100/70',
          props.error && 'border-red-500 ring-1 ring-red-500/30',
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <div
            className={cn(
              'p-1.5 rounded-lg shrink-0 transition-colors',
              isDark ? 'bg-blue-950/60 text-cyan-400' : 'bg-blue-50 text-blue-600',
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </div>
          <span className={cn('font-semibold truncate', !parsedSelectedDate && 'text-slate-400 font-normal')}>
            {formattedDisplay}
          </span>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform duration-250 ease-out shrink-0 ml-1',
            isCalendarOpen && 'rotate-180 text-blue-600 dark:text-cyan-400',
          )}
        />
      </button>

      {props.error && <span className="text-[10px] text-red-500 pl-1">{props.error}</span>}

      {/* GSAP Animated Calendar Dropdown Panel */}
      {isCalendarOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 p-3.5 rounded-2xl select-none border shadow-2xl backdrop-blur-xl will-change-transform',
            isDark
              ? 'bg-[#0f1524]/95 text-white border-white/15 shadow-black/80'
              : 'bg-white/95 text-slate-900 border-slate-200 shadow-slate-300/60',
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
                isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className={cn('text-xs font-bold capitalize', isDark ? 'text-white' : 'text-slate-900')}>
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
                isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600',
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
                className={cn('text-[10px] font-semibold', isDark ? 'text-neutral-500' : 'text-slate-400')}
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
                        ? 'bg-cyan-500 text-cyan-950 font-bold shadow-md shadow-cyan-500/25'
                        : 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                      : isTodayDate
                        ? isDark
                          ? 'bg-cyan-500/15 text-cyan-400 font-bold'
                          : 'bg-blue-50 text-blue-600 font-bold'
                        : isCurMonth
                          ? isDark
                            ? 'text-neutral-200 hover:bg-white/10'
                            : 'text-slate-800 hover:bg-slate-100'
                          : isDark
                            ? 'text-neutral-600 hover:bg-white/5'
                            : 'text-slate-300 hover:bg-slate-50',
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
