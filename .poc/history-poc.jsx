import React, { useState } from 'react';

const Icons = {
  Info: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Download: () => (
    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  CheckIn: ({ colorClass = "text-emerald-600" }) => (
    <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  Missed: ({ colorClass = "text-rose-600" }) => (
    <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Cuti: ({ colorClass = "text-indigo-600" }) => (
    <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
};

const ATTENDANCE_RECORDS = [
  {
    id: 101,
    date: '25 Ags 2026',
    time: '07:30',
    title: 'Check-in (Poli Penyakit Dalam)',
    location: 'Gedung A - Ruang 204',
    status: 'hadir',
    isLatest: true
  },
  {
    id: 102,
    date: '24 Ags 2026',
    time: '20:00',
    title: 'Missed (Shift Malam IGD)',
    location: 'Gedung B - IGD Utama',
    status: 'missed',
    isLatest: false
  },
  {
    id: 103,
    date: '22 Ags 2026',
    time: '08:00',
    title: 'Cuti (Simposium Kedokteran)',
    location: 'Izin Resmi RS (Approved)',
    status: 'cuti',
    isLatest: false
  },
  {
    id: 104,
    date: '20 Ags 2026',
    time: '07:45',
    title: 'Check-in (Visite Rawat Inap)',
    location: 'Bangsal Cempaka Lt. 3',
    status: 'hadir',
    isLatest: false
  }
];

export default function App() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 font-['Plus_Jakarta_Sans',sans-serif] antialiased text-slate-800 flex items-center justify-center p-4 select-none">
      {/* Load Google Font: Plus Jakarta Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* 1:1 Card Dock Layout */}
      <div className="w-full max-w-[390px] bg-white rounded-[24px] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Timeline</h2>
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-100">
              <Icons.Info />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            <Icons.Download />
            <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
        </div>

        {/* Distribution Bar (Akumulasi 1 Bulan: 75% Hadir, 10% Missed, 15% Cuti) */}
        <div className="w-full bg-slate-100 h-2 rounded-full flex gap-1 p-[1px] mb-2">
          {/* Hadir: 75% (Emerald) */}
          <div className="bg-emerald-600 h-full rounded-full w-[75%]" title="Hadir (75% - 21 Hari)" />
          {/* Missed: 10% (Rose) */}
          <div className="bg-rose-500 h-full rounded-full w-[10%]" title="Missed (10% - 2 Hari)" />
          {/* Cuti: 15% (Indigo) */}
          <div className="bg-indigo-500 h-full rounded-full w-[15%]" title="Cuti (15% - 3 Hari)" />
        </div>

        {/* Monthly Date Ticks (Gantikan jam 07:00-22:00 dengan rentang tanggal bulanan) */}
        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-5 tracking-tight">
          <span>01 Ags</span>
          <span>08 Ags</span>
          <span>15 Ags</span>
          <span>22 Ags</span>
          <span>31 Ags</span>
        </div>

        {/* Metrics & Legends */}
        <div className="flex items-end justify-between mb-6 pt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">
              Total jam kerja <span className="text-slate-300">·</span> Bulan ini
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-bold text-slate-900 leading-none tracking-tight">
                168 hr
              </span>
              <span className="text-[12px] font-medium text-slate-400">
                (21 hari)
              </span>
            </div>
          </div>

          {/* Legend for exactly 3 statuses */}
          <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500 pb-0.5">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Hadir</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Cuti</span>
            </div>
          </div>
        </div>

        {/* Attendance Records Timeline */}
        <div className="flex flex-col">
          {ATTENDANCE_RECORDS.map((item, index) => {
            const isLast = index === ATTENDANCE_RECORDS.length - 1;

            // Default style for past history items (Neutral Slate)
            let iconBoxStyle = 'border-slate-300 bg-slate-50';
            let titleStyle = 'text-slate-600 font-medium';
            let iconComponent = <Icons.CheckIn colorClass="text-slate-400" />;
            let lineStyle = 'border-l border-dashed border-slate-300';

            // Selected/Latest entry gets full accent highlight
            if (item.isLatest) {
              if (item.status === 'hadir') {
                iconBoxStyle = 'border-emerald-600 bg-emerald-50/50 shadow-[0_0_0_2px_rgba(5,150,105,0.12)]';
                titleStyle = 'text-emerald-700 font-semibold';
                iconComponent = <Icons.CheckIn colorClass="text-emerald-600" />;
                lineStyle = 'w-[1.5px] bg-emerald-600';
              } else if (item.status === 'missed') {
                iconBoxStyle = 'border-rose-500 bg-rose-50/50 shadow-[0_0_0_2px_rgba(244,63,94,0.12)]';
                titleStyle = 'text-rose-600 font-semibold';
                iconComponent = <Icons.Missed colorClass="text-rose-600" />;
                lineStyle = 'w-[1.5px] bg-rose-500';
              } else if (item.status === 'cuti') {
                iconBoxStyle = 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_0_2px_rgba(99,102,241,0.12)]';
                titleStyle = 'text-indigo-600 font-semibold';
                iconComponent = <Icons.Cuti colorClass="text-indigo-600" />;
                lineStyle = 'w-[1.5px] bg-indigo-500';
              }
            } else {
              // History items icons mapped with monochrome gray
              if (item.status === 'missed') {
                iconComponent = <Icons.Missed colorClass="text-slate-400" />;
              } else if (item.status === 'cuti') {
                iconComponent = <Icons.Cuti colorClass="text-slate-400" />;
              } else {
                iconComponent = <Icons.CheckIn colorClass="text-slate-400" />;
              }
            }

            return (
              <div key={item.id} className="relative flex items-start">
                
                {/* Node & Line Column */}
                <div className="relative flex flex-col items-center mr-3 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-white border-2 transition-all ${iconBoxStyle}`}>
                    {iconComponent}
                  </div>

                  {!isLast && (
                    <div className={`h-10 ${lineStyle}`} />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex items-start justify-between w-full pt-1 pb-4">
                  
                  {/* Date & Time */}
                  <div className="w-[85px] shrink-0">
                    <div className="text-[13px] font-bold text-slate-800 leading-tight">
                      {item.date}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {item.time}
                    </div>
                  </div>

                  {/* Title & Location */}
                  <div className="flex-1 text-right pl-2">
                    <div className={`text-[13px] leading-tight ${titleStyle}`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                      {item.location}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}