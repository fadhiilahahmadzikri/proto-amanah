import { Bell, Calendar, Home, QrCode, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BottomNavTab = 'home' | 'schedule' | 'qr' | 'notification' | 'account';

export function BottomNavBar(props: {
  activeTab?: BottomNavTab;
  onTabChange?: (tab: BottomNavTab) => void;
  className?: string;
}) {
  const activeTab = props.activeTab ?? 'home';

  return (
    <nav
      aria-label="Navigasi Utama"
      className={cn(
        'absolute bottom-0 w-full bg-white px-3 pt-2 pb-6 border-t border-gray-100 flex justify-around items-end shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-40 rounded-b-[32px] sm:rounded-b-[36px] select-none',
        props.className,
      )}
    >
      {/* 1. Home Tab */}
      <button
        type="button"
        onClick={() => props.onTabChange?.('home')}
        className={cn(
          'flex flex-col items-center gap-1 w-14 pb-1 transition-all cursor-pointer focus:outline-none',
          activeTab === 'home'
            ? 'text-[#1C1645] font-bold'
            : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
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
            ? 'text-[#1C1645] font-bold'
            : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
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
          className="absolute bottom-1 w-14 h-14 bg-[#14103B] rounded-[20px] flex items-center justify-center text-white text-2xl shadow-lg shadow-[#14103B]/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none ring-4 ring-white"
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
            ? 'text-[#1C1645] font-bold'
            : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
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
            ? 'text-[#1C1645] font-bold'
            : 'text-[#9CA3AF] hover:text-slate-600 font-medium',
        )}
      >
        <User className="h-6 w-6 stroke-[2.2]" />
        <span className="text-[10px]">Akun</span>
      </button>
    </nav>
  );
}
