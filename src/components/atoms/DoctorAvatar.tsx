import { cn } from '@/lib/utils';

export function DoctorAvatar(props: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const size = props.size ?? 52;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-white/20 border-2 border-white/40 shadow-sm shrink-0 backdrop-blur-md',
        props.className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <img
        src={props.src}
        alt={props.alt}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
