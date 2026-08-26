import React, { useState, useRef } from 'react';

// Custom SF-styled SVG Icons for 1:1 visual match with reference video
const Icons = {
  Plus: () => (
    <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Cross: () => (
    <svg className="w-3.5 h-3.5 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Play: () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  Reset: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  ),
  Cursor: () => (
    <svg className="w-5 h-5 text-slate-900 drop-shadow-md pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L4.5 3.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
};

const TIME_OPTIONS = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
];

const INITIAL_SESSIONS = [
  { id: 'dini_hari', name: 'Sesi Dini Hari', active: false, slots: [{ id: 'dh1', from: '1:00 AM', to: '4:00 AM' }] },
  { id: 'pagi', name: 'Sesi Pagi', active: false, slots: [{ id: 'p1', from: '7:00 AM', to: '11:00 AM' }] },
  { id: 'siang', name: 'Sesi Siang', active: false, slots: [{ id: 's1', from: '1:00 PM', to: '5:00 PM' }] },
  { id: 'malam', name: 'Sesi Malam', active: false, slots: [{ id: 'm1', from: '7:00 PM', to: '10:00 PM' }] },
];

const ToggleSwitch = ({ active, onChange, id }) => (
  <button
    type="button"
    id={id}
    aria-label="Toggle availability"
    onClick={(e) => {
      e.stopPropagation();
      onChange(!active);
    }}
    className={`relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-300 ease-out focus:outline-none ${
      active ? 'bg-[#1C1C1E]' : 'bg-[#E5E5EA]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.8,0.64,1)] ${
        active ? 'translate-x-[20px]' : 'translate-x-[0px]'
      }`}
    />
  </button>
);

export default function App() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const toggleSession = (sessionId, forcedState = null) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const nextActive = forcedState !== null ? forcedState : !session.active;
          return {
            ...session,
            active: nextActive,
            slots: nextActive && session.slots.length === 0 ? [{ id: `${sessionId}-${Date.now()}`, from: '7:00 AM', to: '8:00 AM' }] : session.slots
          };
        }
        return session;
      })
    );
  };

  const addTimeSlot = (sessionId) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          let from = '8:00 AM';
          let to = '10:00 AM';

          if (sessionId === 'dini_hari') { from = '2:00 AM'; to = '4:00 AM'; }
          else if (sessionId === 'pagi') { from = '8:00 AM'; to = '10:00 AM'; }
          else if (sessionId === 'siang') { from = '2:00 PM'; to = '4:00 PM'; }
          else if (sessionId === 'malam') { from = '8:00 PM'; to = '10:00 PM'; }

          return {
            ...session,
            slots: [...session.slots, { id: `${sessionId}-${Date.now()}`, from, to }]
          };
        }
        return session;
      })
    );
  };

  const removeTimeSlot = (sessionId, slotIndex) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedSlots = session.slots.filter((_, idx) => idx !== slotIndex);
          return {
            ...session,
            slots: updatedSlots
          };
        }
        return session;
      })
    );
  };

  const updateTimeSlot = (sessionId, slotIndex, field, value) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedSlots = session.slots.map((s, idx) => (idx === slotIndex ? { ...s, [field]: value } : s));
          return { ...session, slots: updatedSlots };
        }
        return session;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA] font-sans antialiased text-[#1C1C1E] flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      
      {/* Dynamic Bouncy Spring Keyframes */}
      <style>{`
        @keyframes bouncePopIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(-10px);
          }
          65% {
            opacity: 1;
            transform: scale(1.02) translateY(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-bounce-pop {
          animation: bouncePopIn 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .spring-card-transition {
          transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .spring-grid-transition {
          transition: grid-template-rows 0.48s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease-out;
        }
      `}</style>

      {/* Main Container Card Only */}
      <div className="w-full max-w-[440px] bg-white rounded-[28px] p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.06)] border border-slate-200/70 space-y-3">
        {/* List of Sessions */}
        {sessions.map((session) => {
          const isExpanded = session.active;
          return (
            <div
              key={session.id}
              className={`spring-card-transition w-full transform-gpu ${
                isExpanded
                  ? 'bg-white rounded-[22px] border border-[#E4E4E8] p-4 shadow-[0_6px_24px_rgba(0,0,0,0.05)] scale-[1.01]'
                  : 'bg-[#F2F2F7] hover:bg-[#EAEAEF] rounded-[20px] px-4 py-3.5 border border-transparent scale-100'
              }`}
            >
              {/* Header Row - Locked w-full & justify-between for far-right switch positioning */}
              <div
                className={`w-full flex items-center justify-between cursor-pointer ${isExpanded ? 'mb-3' : ''}`}
                onClick={() => toggleSession(session.id)}
              >
                <span className={`font-semibold tracking-tight text-[15px] transition-colors ${isExpanded ? 'text-[#1C1C1E]' : 'text-[#2C2C2E]'}`}>
                  {session.name}
                </span>
                <ToggleSwitch
                  id={`toggle-${session.id}`}
                  active={session.active}
                  onChange={(val) => toggleSession(session.id, val)}
                />
              </div>

              {/* Collapsible Slots Body with Bouncy Spring Expansion */}
              <div
                className={`grid spring-grid-transition ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden space-y-2.5">
                  {/* Time Slots List */}
                  {session.slots.map((slot, idx) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-2 sm:gap-2.5 animate-bounce-pop"
                    >
                      {/* From Selector */}
                      <span className="text-slate-400 text-xs sm:text-[13px] font-normal min-w-[34px]">From</span>
                      <div className="relative flex-1">
                        <select
                          value={slot.from}
                          onChange={(e) => updateTimeSlot(session.id, idx, 'from', e.target.value)}
                          className="w-full appearance-none bg-white border border-[#E5E5EA] rounded-xl px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-[#1C1C1E] shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors cursor-pointer"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* To Selector */}
                      <span className="text-slate-400 text-xs sm:text-[13px] font-normal px-0.5">To</span>
                      <div className="relative flex-1">
                        <select
                          value={slot.to}
                          onChange={(e) => updateTimeSlot(session.id, idx, 'to', e.target.value)}
                          className="w-full appearance-none bg-white border border-[#E5E5EA] rounded-xl px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-[#1C1C1E] shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors cursor-pointer"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Remove Button (x) */}
                      <button
                        type="button"
                        id={`remove-${session.id}-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTimeSlot(session.id, idx);
                        }}
                        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-transform active:scale-75 cursor-pointer"
                        title="Remove time slot"
                      >
                        <Icons.Cross />
                      </button>
                    </div>
                  ))}

                  {/* + Add More Button */}
                  <button
                    type="button"
                    id={`add-more-${session.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addTimeSlot(session.id);
                    }}
                    className="w-full py-2.5 mt-2 rounded-xl bg-[#F2F2F7] hover:bg-[#E8E8EE] active:scale-[0.97] text-[#1C1C1E] font-medium text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-black/[0.02]"
                  >
                    <Icons.Plus />
                    <span>Add More</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}