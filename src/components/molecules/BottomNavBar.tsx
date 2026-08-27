import { Bell, Calendar, Home, QrCode, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BottomNavTab = 'home' | 'schedule' | 'qr' | 'notification' | 'account';

export function BottomNavBar(props: {
  activeTab?: BottomNavTab;
  onTabChange?: (tab: BottomNavTab) => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const activeTab = props.activeTab ?? 'home';
  const isDark = props.theme === 'dark';

  return (
    <nav
      aria-label="Navigasi Utama"
      className={cn(
        'absolute bottom-0 w-full px-3 pt-2 pb-6 flex justify-around items-end z-20 rounded-b-[32px] sm:rounded-b-[36px] select-none transition-colors duration-300',
        isDark
          ? 'bg-neutral-950/85 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl'
          : 'bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]',
        props.className,
      )}
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      {/* 1. Home Tab */}
      <button
        type="button"
        onClick={() => props.onTabChange?.('home')}
        className={cn(
          'flex flex-col items-center gap-1 w-14 pb-1 transition-all cursor-pointer focus:outline-none',
          activeTab === 'home'
            ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-[#0a44ff] font-bold scale-105'
            : isDark ? 'text-neutral-500 hover:text-neutral-300 font-medium' : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
        )}
      >
        <Home className="h-6 w-6 stroke-[2.2]" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* 2. Jadwal Tab */}
      <button
        type="button"
        onClick={() => props.onTabChange?.('schedule')}
        className={cn(
          'flex flex-col items-center gap-1 w-14 pb-1 transition-all cursor-pointer focus:outline-none',
          activeTab === 'schedule'
            ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-[#0a44ff] font-bold scale-105'
            : isDark ? 'text-neutral-500 hover:text-neutral-300 font-medium' : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
        )}
      >
        <Calendar className="h-6 w-6 stroke-[2.2]" />
        <span className="text-[10px]">Jadwal</span>
      </button>

      {/* 3. Floating Center QR Action Button */}
      <div className="relative w-16 flex justify-center">
        <button
          type="button"
          aria-label="Pindai QR Presensi"
          onClick={() => props.onTabChange?.('qr')}
          className={cn(
            'absolute bottom-1 w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none',
            activeTab === 'qr' && (isDark ? 'ring-2 ring-cyan-300' : 'ring-2 ring-blue-500'),
            isDark
              ? 'bg-cyan-500 text-neutral-950 shadow-cyan-500/30 ring-4 ring-neutral-950 hover:bg-cyan-400'
              : 'bg-[#0a44ff] text-white shadow-blue-500/30 ring-4 ring-white hover:bg-[#0038ff]',
          )}
        >
          <QrCode className="h-7 w-7 stroke-[2]" />
        </button>
      </div>

      {/* 4. Notifikasi Tab */}
      <button
        type="button"
        onClick={() => props.onTabChange?.('notification')}
        className={cn(
          'flex flex-col items-center gap-1 w-14 pb-1 transition-all cursor-pointer focus:outline-none',
          activeTab === 'notification'
            ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-[#0a44ff] font-bold scale-105'
            : isDark ? 'text-neutral-500 hover:text-neutral-300 font-medium' : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
        )}
      >
        <Bell className="h-6 w-6 stroke-[2.2]" />
        <span className="text-[10px]">Notifikasi</span>
      </button>

      {/* 5. Akun Tab */}
      <button
        type="button"
        onClick={() => props.onTabChange?.('account')}
        className={cn(
          'flex flex-col items-center gap-1 w-14 pb-1 transition-all cursor-pointer focus:outline-none',
          activeTab === 'account'
            ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-[#0a44ff] font-bold scale-105'
            : isDark ? 'text-neutral-500 hover:text-neutral-300 font-medium' : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
        )}
      >
        <User className="h-6 w-6 stroke-[2.2]" />
        <span className="text-[10px]">Akun</span>
      </button>
    </nav>
  );
}
