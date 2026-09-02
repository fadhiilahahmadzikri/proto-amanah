'use client';

import React from 'react';
import { DoctorAvatar } from '@/components/atoms/DoctorAvatar';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { cn } from '@/lib/utils';

export type ChatMessage = {
  id: string;
  sender: 'it' | 'user';
  text: string;
  time: string;
};

/**
 * Dedicated full-screen chat interface for direct communication with IT support.
 * @param props Component properties.
 * @returns React node for the full-screen chat.
 */
export function ItChatFullScreen(props: {
  theme?: 'dark' | 'light';
  onBack: () => void;
  onTicketCreated?: (ticket: { title: string; date: string }) => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const { profile } = useDoctorStore();
  const [inputMessage, setInputMessage] = React.useState('');
  const [isTechnicianTyping, setIsTechnicianTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'it',
      text: 'Halo dr. Amelia, ada kendala pada sistem SIMRS, scanner presensi, atau perangkat poli yang bisa tim IT bantu?',
      time: '08:00',
    },
  ]);
  const messagesViewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const messagesViewport = messagesViewportRef.current;
    if (!messagesViewport) {
      return;
    }
    messagesViewport.scrollTop = messagesViewport.scrollHeight;
  }, [messages, isTechnicianTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) {
      return;
    }

    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: currentTime,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTechnicianTyping(true);
    setInputMessage('');
    props.onTicketCreated?.({
      title: trimmed,
      date: `Hari ini, ${currentTime}`,
    });

    // Automated IT acknowledgement response
    setTimeout(() => {
      const itReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'it',
        text: 'Laporan Anda sudah kami catat dan dibuatkan tiket penanganan. Teknisi IT sedang memverifikasi kendala ini.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, itReply]);
      setIsTechnicianTyping(false);
    }, 900);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden overscroll-none select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      <ScreenHeader
        title="Chat teknisi IT"
        subtitle={(
          <>
            Helpdesk SIMRS ·{' '}
            <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
              online
            </span>
          </>
        )}
        onBack={props.onBack}
        theme={props.theme}
      />

      {/* Full-Screen Chat Viewport */}
      <div
        ref={messagesViewportRef}
        className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain px-4 pt-3 pb-3 flex flex-col gap-3"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          let bubbleStyle = 'bg-slate-100 text-slate-800 rounded-bl-xs';
          let timeStyle = 'text-slate-500';

          if (isUser) {
            bubbleStyle = 'bg-blue-600 text-white rounded-br-xs';
            timeStyle = 'text-blue-100';
          } else if (isDark) {
            bubbleStyle = 'bg-[#111624] border border-white/10 text-neutral-200 rounded-bl-xs';
            timeStyle = 'text-neutral-400';
          }

          return (
            <div
              key={msg.id}
              className={cn(
                'flex w-full items-end gap-2',
                isUser ? 'justify-end' : 'justify-start',
              )}
            >
              {!isUser && (
                <div
                  aria-hidden="true"
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold shadow-xs',
                    isDark
                      ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/25'
                      : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
                  )}
                >
                  IT
                </div>
              )}

              <div
                className={cn(
                  'flex max-w-[76%] flex-col rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs',
                  bubbleStyle,
                )}
              >
                <span>{msg.text}</span>
                <span className={cn('text-[9.5px] mt-1 self-end opacity-80', timeStyle)}>
                  {msg.time}
                </span>
              </div>

              {isUser && (
                <DoctorAvatar
                  src={profile.avatarUrl}
                  alt={profile.name}
                  size={26}
                  className={cn(
                    'ring-2',
                    isDark ? 'ring-[#0a0e1a]' : 'ring-[#f8faff]',
                  )}
                />
              )}
            </div>
          );
        })}

        {isTechnicianTyping && (
          <div className="flex w-full items-end justify-start gap-2" aria-live="polite">
            <div
              aria-hidden="true"
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold shadow-xs',
                isDark
                  ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/25'
                  : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
              )}
            >
              IT
            </div>
            <div
              aria-label="Teknisi sedang mengetik"
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-2xl rounded-bl-xs px-3.5 shadow-xs',
                isDark
                  ? 'bg-[#111624] border border-white/10 text-neutral-400'
                  : 'bg-slate-100 text-slate-500',
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50 animate-pulse [animation-delay:-0.24s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50 animate-pulse [animation-delay:-0.12s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Chat Input Bar */}
      <div
        className={cn(
          'px-4 pt-2.5 pb-4 border-t shrink-0 select-none transition-colors',
          isDark
            ? 'bg-[#0a0e1a] border-white/10'
            : 'bg-white border-slate-100 shadow-lg',
        )}
      >
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pesan kendala teknis..."
            className={cn(
              'flex-1 px-3.5 py-2.5 rounded-2xl text-xs border focus:outline-none transition-colors',
              isDark
                ? 'bg-white/5 border-white/10 text-white focus:border-sky-400 placeholder:text-neutral-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 placeholder:text-slate-400',
            )}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className={cn(
              'px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0',
              isDark
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-blue-600 text-white hover:bg-blue-700',
            )}
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
