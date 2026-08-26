import { Bell } from 'lucide-react';
import { DoctorAvatar } from '@/components/atoms/DoctorAvatar';
import { cn } from '@/lib/utils';
import type { DoctorProfile } from '@/types/portal.types';

export function DoctorProfileHeader(props: {
  profile: DoctorProfile;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex justify-between items-center mt-1.5 mb-3.5',
        props.className,
      )}
    >
      {/* Profile Photo & Name */}
      <button
        type="button"
        onClick={props.onProfileClick}
        className="flex items-center gap-3.5 text-left cursor-pointer focus:outline-none group"
      >
        <DoctorAvatar
          src={props.profile.avatarUrl}
          alt={props.profile.name}
          size={52}
          className="group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col">
          <span className="font-extrabold text-white text-[19px] tracking-tight leading-tight mb-0.5 drop-shadow-xs">
            {props.profile.name}
          </span>
          <span className="text-white/90 font-medium text-[13px]">
            {props.profile.greeting}
          </span>
        </div>
      </button>

      {/* Notification Bell Button */}
      <button
        type="button"
        aria-label="Notifikasi"
        onClick={props.onNotificationClick}
        className="relative w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 shrink-0 transition-all shadow-sm backdrop-blur-md cursor-pointer focus:outline-none"
      >
        <Bell className="h-5 w-5 stroke-[2.2]" />
        {props.profile.unreadNotifications > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>
    </div>
  );
}
