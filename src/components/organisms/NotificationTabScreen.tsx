'use client';

import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  CheckCheck,
  ChevronRight,
  Clock,
  FileText,
  MessageSquare,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import React from 'react';
import { ClayIcon } from '@/components/atoms/ClayIcon';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { cn } from '@/lib/utils';

export type NotificationCategory = 'all' | 'queue' | 'clinical' | 'shift';

export type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: string;
  category: 'queue' | 'clinical' | 'shift';
  isUnread: boolean;
  isUrgent?: boolean;
  actionLabel?: string;
  colorPrimary: string;
  colorLight: string;
  colorDark: string;
  icon: React.ComponentType<{ className?: string }>;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Pasien Siap di Ruang Periksa',
    desc: 'An. Kevin Sanjaya (No. Antrean A-04) telah selesai asesmen tanda vital oleh perawat.',
    time: 'Baru saja',
    timestamp: '07:45',
    category: 'queue',
    isUnread: true,
    isUrgent: false,
    colorPrimary: '#0d66e9',
    colorLight: '#38bdf8',
    colorDark: '#1d58ac',
    icon: Activity,
  },
  {
    id: 'notif_2',
    title: 'Hasil Kritis Laboratorium Darah',
    desc: 'Hb 7.2 g/dL & Trombosit 45.000 pada pasien Ny. Ratna Dewi (Kamar 204B) perlu verifikasi DPJP.',
    time: '12 mnt lalu',
    timestamp: '07:33',
    category: 'clinical',
    isUnread: true,
    isUrgent: true,
    colorPrimary: '#EF4444',
    colorLight: '#FCA5A5',
    colorDark: '#DC2626',
    icon: AlertCircle,
  },
  {
    id: 'notif_3',
    title: 'Konsultasi Antar Spesialis',
    desc: 'dr. Budi Santoso, Sp.A meminta lembar rujukan kasus bronkiolitis anak ruang PICU.',
    time: '45 mnt lalu',
    timestamp: '07:00',
    category: 'clinical',
    isUnread: true,
    colorPrimary: '#8B5CF6',
    colorLight: '#C4B5FD',
    colorDark: '#6D28D9',
    icon: MessageSquare,
  },
  {
    id: 'notif_4',
    title: 'Konfirmasi Jadwal Shift Sore',
    desc: 'Poli Spesialis Anak Sesi 2 dimulai pukul 14:00 - 18:00 WIB (Kuota 15 pasien terisi).',
    time: '2 jam lalu',
    timestamp: '05:45',
    category: 'shift',
    isUnread: false,
    colorPrimary: '#F59E0B',
    colorLight: '#FCD34D',
    colorDark: '#D97706',
    icon: Calendar,
  },
  {
    id: 'notif_5',
    title: 'Laporan Hasil Radiologi Toraks',
    desc: 'Hasil foto Rontgen Thorax AP/Lat pasien By. Alif Pratama sudah dapat diakses via SIMRS.',
    time: '3 jam lalu',
    timestamp: '04:30',
    category: 'clinical',
    isUnread: false,
    colorPrimary: '#06B6D4',
    colorLight: '#67E8F9',
    colorDark: '#0891B2',
    icon: FileText,
  },
  {
    id: 'notif_6',
    title: 'Pengingat Batas Verifikasi Resep',
    desc: 'Terdapat 3 resep elektronik pasien rawat jalan yang menunggu paraf digital Anda.',
    time: 'Kemarin',
    timestamp: '25 Ags',
    category: 'shift',
    isUnread: false,
    colorPrimary: '#10B981',
    colorLight: '#6EE7B7',
    colorDark: '#059669',
    icon: Clock,
  },
];

export function NotificationTabScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = React.useState<NotificationCategory>('all');
  const [selectedNotif, setSelectedNotif] = React.useState<NotificationItem | null>(null);
  const [showMenu, setShowMenu] = React.useState(false);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => n.isUnread));
  };

  const handleItemClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n)),
    );
    setSelectedNotif(item);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Header (Compact, Symmetric, Unified with Other Screens) */}
      <ScreenHeader
        title="Notifikasi"
        subtitle={unreadCount > 0 ? `${unreadCount} belum dibaca` : undefined}
        onBack={props.onBack}
        theme={props.theme}
        rightAction={
          <div className="relative flex items-center justify-end">
            <button
              type="button"
              aria-label="Opsi Notifikasi"
              onClick={() => setShowMenu((prev) => !prev)}
              className={cn(
                'p-1.5 -mr-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
                isDark
                  ? 'text-neutral-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
              )}
            >
              <MoreVertical className="h-5 w-5 stroke-[2]" />
            </button>

            {/* Compact Floating Glass Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className={cn(
                    'absolute right-0 top-full mt-1.5 z-50 w-48 py-1.5 rounded-2xl shadow-xl border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 select-none flex flex-col',
                    isDark
                      ? 'bg-[#111624]/95 border-white/10 text-white shadow-black/80'
                      : 'bg-white/95 border-slate-100 text-slate-800 shadow-slate-900/10',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleMarkAllRead();
                      setShowMenu(false);
                    }}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold transition-colors text-left cursor-pointer',
                      isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800',
                    )}
                  >
                    <CheckCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Tandai Semua Dibaca</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleClearRead();
                      setShowMenu(false);
                    }}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold transition-colors text-left cursor-pointer border-t',
                      isDark
                        ? 'hover:bg-white/10 text-neutral-300 border-white/5'
                        : 'hover:bg-slate-100 text-slate-700 border-slate-100',
                    )}
                  >
                    <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Bersihkan Terbaca</span>
                  </button>
                </div>
              </>
            )}
          </div>
        }
      />

      {/* 2. Content Scroll Area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar flex flex-col pt-2 pb-36 sm:pb-40">
        {/* Category Filter Chips - Compact & Borderless */}
        <div className="flex items-center gap-1.5 px-5 pb-2.5 overflow-x-auto no-scrollbar shrink-0 select-none">
          {[
            { id: 'all', label: 'Semua', count: notifications.length },
            { id: 'queue', label: 'Antrean', count: notifications.filter((n) => n.category === 'queue').length },
            { id: 'clinical', label: 'Klinis & Lab', count: notifications.filter((n) => n.category === 'clinical').length },
            { id: 'shift', label: 'Shift & Poli', count: notifications.filter((n) => n.category === 'shift').length },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as NotificationCategory)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95',
                  isActive
                    ? isDark
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDark
                      ? 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900',
                )}
              >
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full tabular-nums',
                      isActive
                        ? isDark
                          ? 'bg-slate-200 text-slate-900'
                          : 'bg-slate-800 text-white'
                        : isDark
                          ? 'bg-white/10 text-neutral-300'
                          : 'bg-slate-200 text-slate-700',
                    )}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Notification Items List - Compact, Minimalist, No Card Borders, No Colored Backgrounds */}
        <div className="flex flex-col px-4 pt-1 divide-y divide-slate-100 dark:divide-white/5">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center select-none">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                  isDark ? 'bg-white/5 text-neutral-500' : 'bg-slate-100 text-slate-400',
                )}
              >
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className={cn('text-xs font-semibold', isDark ? 'text-neutral-300' : 'text-slate-700')}>
                Tidak ada notifikasi
              </p>
              <p className={cn('text-[11px] mt-0.5', isDark ? 'text-neutral-500' : 'text-slate-400')}>
                Semua pembaruan pada kategori ini sudah diperiksa.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'group flex items-center justify-between w-full py-3.5 px-2 text-left transition-colors cursor-pointer select-none rounded-2xl active:scale-[0.99]',
                    isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/80',
                  )}
                >
                  {/* Left Section: 3D ClayIcon + Title + Description */}
                  <div className="flex items-start gap-3.5 min-w-0 pr-3 flex-1">
                    {/* Leading 3D ClayIcon Badge (Compact 30px, matching Profile screen) */}
                    <div className="relative shrink-0 mt-0.5">
                      <ClayIcon
                        size={30}
                        colorPrimary={item.colorPrimary}
                        colorLight={item.colorLight}
                        colorDark={item.colorDark}
                      >
                        <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                      </ClayIcon>
                      {item.isUrgent && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 ring-2 ring-white shadow-sm" />
                        </span>
                      )}
                    </div>

                    {/* Middle Text: Title + Subtitle/Desc (Clean, Compact Typography) */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-[13px] tracking-tight leading-snug line-clamp-1',
                            item.isUnread ? 'font-bold' : 'font-medium',
                            isDark ? (item.isUnread ? 'text-white' : 'text-neutral-300') : (item.isUnread ? 'text-slate-900' : 'text-slate-700'),
                          )}
                        >
                          {item.title}
                        </span>
                      </div>

                      <p
                        className={cn(
                          'text-[11px] leading-relaxed mt-0.5 line-clamp-2',
                          isDark ? 'text-neutral-400' : 'text-slate-500',
                        )}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Section: Trailing Timestamp + Unread Dot + Chevron (Matching Profile Screen Pattern) */}
                  <div className="flex items-center gap-2 shrink-0 pl-1">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500 tabular-nums">
                        {item.time}
                      </span>
                      {item.isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                      )}
                    </div>

                    {/* Trailing Chevron Icon */}
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-opacity opacity-40 group-hover:opacity-90',
                        isDark ? 'text-neutral-400' : 'text-slate-400',
                      )}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Compact Notification Detail Modal */}
      {selectedNotif && (
        <>
          <div
            onClick={() => setSelectedNotif(null)}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            className={cn(
              'absolute inset-x-4 bottom-8 z-50 p-5 rounded-3xl shadow-2xl border transition-all animate-in slide-in-from-bottom-4 duration-300 select-none flex flex-col gap-3.5 backdrop-blur-xl',
              isDark
                ? 'bg-[#111624]/95 border-white/10 text-white shadow-black/80'
                : 'bg-white/95 border-slate-100 text-slate-900 shadow-xl',
            )}
          >
            <div className="flex items-start gap-3.5">
              <ClayIcon
                size={34}
                colorPrimary={selectedNotif.colorPrimary}
                colorLight={selectedNotif.colorLight}
                colorDark={selectedNotif.colorDark}
              >
                {React.createElement(selectedNotif.icon, { className: 'w-4 h-4 stroke-[2.2]' })}
              </ClayIcon>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-tight text-cyan-600 dark:text-cyan-400">
                    {selectedNotif.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-400 tabular-nums">
                    {selectedNotif.timestamp} WIB
                  </span>
                </div>
                <h4 className="text-sm font-bold tracking-tight mt-0.5 leading-snug">
                  {selectedNotif.title}
                </h4>
              </div>
            </div>

            <p className={cn('text-xs leading-relaxed', isDark ? 'text-neutral-300' : 'text-slate-600')}>
              {selectedNotif.desc}
            </p>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95',
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
                )}
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
