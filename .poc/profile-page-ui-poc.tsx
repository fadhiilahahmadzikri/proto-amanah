import React, { useState, useEffect } from 'react';

const FontInjector = () => {
  useEffect(() => {
    const fontId = 'plus-jakarta-sans-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <style>{`
      /* Extracted Color Palette Variables */
      :root {
        --color-1: #000000;
        --color-2: #ffffff;
        --color-3: #0284c7;
        --color-4: #38bdf8;
        --color-5: #0369a1;
        --color-6: #082f49;
        --color-7: #0b1329;
        --color-8: #e0f2fe;
        --color-9: #060b18;
        --color-10: #00d3f2;
        --color-11: #0d66e9;
        --color-12: #94a3b8;
        --color-13: #d4d4d4;
        --color-14: #075985;
        --color-15: #a5f3fc;
        --color-16: #22d3ee;
        --color-17: #67e8f9;
        --color-18: #737373;
        --color-19: #a1a1a1;
        --color-20: #f0f9ff;
        --color-21: #bae6fd;
        --color-22: #3d8eff;
        --color-23: #d6edff;
        --color-24: #3f3f3f;
        --color-25: #06b6d4;
        --color-26: #171717;
        --color-27: #cad5e2;
        --color-28: #e2e8f0;
        --color-29: #00b9dc;
        --color-30: #f0fdfa;
        --color-31: #475569;
        --color-32: #e5e5e5;
        --color-33: #0e7490;
        --color-34: #1d58ac;
        --color-35: #0f1422;
        --color-36: #00bcff;
        --color-37: #80b8ff;
        --color-38: #93ccff;
        --color-39: #80c2ff;
        --color-40: #9dcaff;
        --color-41: #c6d8eb;
        --color-42: #8ba7c4;
        --color-43: #0a0a0a;
        --color-44: #252525;
        --color-45: #262626;
        --color-46: #90a1b9;
        --color-47: #131b2e;
        --color-48: #16233d;
        --color-49: #0f1629;
        --color-50: #0a0f1d;
        --tw-ring-offset-color: #fff;
        --color-white: #fff;
        --color-black: #000;
      }
    `}</style>
  );
};

const AndroidStatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-3 pb-1.5 text-slate-800 text-xs font-semibold select-none z-30">
    <div className="flex items-center gap-2">
      <span className="text-[13px] tracking-tight font-semibold text-[#181818]">00.19</span>
      <div className="flex items-center gap-1.5 opacity-80">
        {/* Camera / Scan icon */}
        <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {/* Telegram paper airplane icon */}
        <svg className="w-3.5 h-3.5 text-slate-700 fill-slate-700" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        {/* Instagram camera icon */}
        <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
        {/* Notification dot */}
        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
      </div>
    </div>

    {/* Right Status items: Location, Wi-Fi, Cellular, Battery */}
    <div className="flex items-center gap-1.5 text-slate-800">
      {/* Location icon */}
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      {/* WiFi icon */}
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
      {/* Cellular signal */}
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="15" width="3" height="6" rx="0.5" />
        <rect x="7" y="11" width="3" height="10" rx="0.5" />
        <rect x="12" y="7" width="3" height="14" rx="0.5" />
        <rect x="17" y="3" width="3" height="18" rx="0.5" />
      </svg>
      {/* Battery badge with 40% */}
      <div className="flex items-center bg-[#2B2B2B] text-white rounded-full px-1.5 py-0.5 text-[9.5px] font-bold leading-none tracking-tighter">
        <span>40</span>
      </div>
    </div>
  </div>
);

const MedicalHeroIllustration = () => (
  <div className="relative w-full h-[165px] overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#0284c7]">
    {/* Medical Grid Pattern & Vital wave lines */}
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 160">
      <defs>
        {/* Clinical Grid */}
        <pattern id="medicalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.25" />
        </pattern>
        {/* Multi-depth gradients from medical palette */}
        <linearGradient id="medWaveDeep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
        <linearGradient id="medWaveMid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="ecgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="35%" stopColor="#00d3f2" stopOpacity="1" />
          <stop offset="65%" stopColor="#67e8f9" stopOpacity="1" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Grid Canvas Backdrop */}
      <rect width="400" height="160" fill="url(#medicalGrid)" />

      {/* Background Fluid Medical Wave */}
      <path
        d="M-20,118 Q80,68 200,96 T420,74 L420,160 L-20,160 Z"
        fill="url(#medWaveMid)"
        opacity="0.92"
      />

      {/* Foreground Deep Clinical Wave */}
      <path
        d="M-20,135 Q110,88 230,126 T420,100 L420,160 L-20,160 Z"
        fill="url(#medWaveDeep)"
      />

      {/* ECG Heartbeat Pulse Rhythm Line */}
      <path
        d="M-10,88 L85,88 L95,88 L100,74 L106,104 L112,54 L118,106 L123,82 L128,88 L188,88 L194,88 L199,75 L204,98 L210,64 L216,99 L221,83 L226,88 L410,88"
        fill="none"
        stroke="url(#ecgGlow)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 5px rgba(0, 211, 242, 0.75))"
      />

      {/* Floating Medical Crosses / Plus Sparkles */}
      <path d="M42,34 H48 M45,31 V37" stroke="#00d3f2" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M140,24 H146 M143,21 V27" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      <path d="M194,36 H198 M196,34 V38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M330,22 H336 M333,19 V25" stroke="#00d3f2" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Vital Pulse Node Highlights */}
      <circle cx="112" cy="54" r="3" fill="#00d3f2" filter="drop-shadow(0 0 6px #00d3f2)" />
      <circle cx="210" cy="64" r="2.5" fill="#67e8f9" filter="drop-shadow(0 0 5px #67e8f9)" />
      <circle cx="70" cy="48" r="1.5" fill="#ffffff" opacity="0.9" />
      <circle cx="280" cy="38" r="1.5" fill="#a5f3fc" opacity="0.8" />
    </svg>

    {/* Medical Telemetry & Healthcare Elements */}
    <div className="absolute right-4 -bottom-4 w-52 h-44 pointer-events-none select-none">
      <div className="relative w-full h-full">
        {/* First Aid Cross Badge */}
        <div className="absolute top-5 left-5 z-20 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#00d3f2] text-white flex items-center justify-center shadow-lg border border-white/70">
          <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>

        {/* Tilted Telehealth Tablet */}
        <div className="absolute right-7 top-4 w-28 h-40 bg-gradient-to-b from-[#0369a1] to-[#082f49] rounded-[18px] transform -rotate-12 border-[2.5px] border-[#0284c7] shadow-2xl p-1.5 flex flex-col justify-between">
          <div className="w-7 h-1 bg-[#38bdf8]/40 rounded-full mx-auto mt-0.5"></div>

          {/* Tablet Clinical Screen */}
          <div className="w-full h-28 bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] rounded-xl flex flex-col items-center justify-between p-2 shadow-inner border border-white/50">
            {/* Health Stethoscope Badge */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] flex items-center justify-center shadow-sm text-white">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>

            {/* Vitals pulse miniature */}
            <div className="w-full bg-[#082f49]/10 rounded-md px-1 py-0.5 flex items-center justify-center">
              <svg className="w-full h-3" viewBox="0 0 80 14" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round">
                <path d="M0 7 L24 7 L31 1 L37 13 L44 3 L50 9 L56 7 L80 7" />
              </svg>
            </div>

            {/* Clinical Active Care Status */}
            <div className="w-16 h-3 bg-[#00d3f2]/20 border border-[#00d3f2]/50 rounded-full flex items-center justify-center">
              <span className="text-[7.5px] font-bold text-[#0369a1] tracking-tight">TeleCare Active</span>
            </div>
          </div>

          <div className="w-3.5 h-3.5 rounded-full bg-[#38bdf8]/30 mx-auto mb-0.5 border border-[#38bdf8]/40"></div>
        </div>

        {/* Medical Shield Badge on right */}
        <div className="absolute top-11 right-3 z-20 w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d3f2] to-[#0284c7] text-white flex items-center justify-center shadow-xl border border-white/70">
          <svg className="w-4.5 h-4.5 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const PixelPerfectWingedMail = () => (
  <div className="relative w-28 h-24 flex-shrink-0 flex items-center justify-center select-none">
    {/* Soft subtle warm background glow */}
    <div className="absolute right-0 top-1 w-24 h-22 bg-[#fef3c7]/60 rounded-full blur-lg pointer-events-none"></div>

    <svg className="w-28 h-24 overflow-visible" viewBox="0 0 120 110" fill="none">
      <defs>
        {/* Shading gradients for envelope surfaces */}
        <linearGradient id="envInnerShade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0096c7" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="envFrontBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bbf2f6" />
          <stop offset="100%" stopColor="#8de0f7" />
        </linearGradient>

        <linearGradient id="envLeftWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#d5dbe3" />
          <stop offset="100%" stopColor="#b4becc" />
        </linearGradient>

        <linearGradient id="envRightWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#d5dbe3" />
          <stop offset="100%" stopColor="#b4becc" />
        </linearGradient>

        <linearGradient id="goldBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* WINGS AT THE TOP */}
      <g className="filter drop-shadow-[0_2px_3px_rgba(100,116,139,0.25)]">
        {/* LEFT WING - 3 feathered tiers with rounded tips */}
        <path
          d="M 52 31 
             C 45 28, 38 18, 34 10 
             C 31 6, 26 8, 27 13 
             C 28 17, 31 22, 33 24 
             C 27 21, 23 23, 24 27 
             C 25 31, 29 34, 35 36 
             C 30 35, 27 38, 29 42 
             C 32 46, 40 45, 52 35 Z"
          fill="url(#envLeftWingGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* RIGHT WING - 3 feathered tiers mirrored */}
        <path
          d="M 64 31 
             C 71 28, 78 18, 82 10 
             C 85 6, 90 8, 89 13 
             C 88 17, 85 22, 83 24 
             C 89 21, 93 23, 92 27 
             C 91 31, 87 34, 81 36 
             C 86 35, 89 38, 87 42 
             C 84 46, 76 45, 64 35 Z"
          fill="url(#envRightWingGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Wing inner contour accent strokes */}
        <path d="M 33 24 C 38 27, 44 31, 48 33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
        <path d="M 35 36 C 41 37, 46 37, 50 35" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
        <path d="M 83 24 C 78 27, 72 31, 68 33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
        <path d="M 81 36 C 75 37, 70 37, 66 35" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* COILED WIRE / SPRING ANTENNA connecting envelope to wings */}
      <path
        d="M 58 52 
           C 57 46, 62 44, 62 40 
           C 62 36, 53 38, 54 34 
           C 55 30, 59 31, 58 27"
        fill="none"
        stroke="#1e293b"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ENVELOPE BASE (Tilted counter-clockwise slightly for playful perspective) */}
      <g transform="rotate(-3 58 74)">
        {/* Isometric dark blue top flap interior */}
        <path
          d="M 26 47 L 58 31 L 90 47 L 58 63 Z"
          fill="url(#envInnerShade)"
          stroke="#008cb9"
          strokeWidth="1.2"
        />

        {/* Front envelope body */}
        <path
          d="M 24 48 L 58 64 L 92 48 L 92 84 C 92 88, 88 91, 84 91 L 32 91 C 28 91, 24 88, 24 84 Z"
          fill="url(#envFrontBody)"
          stroke="#74c5e3"
          strokeWidth="1.2"
          filter="drop-shadow(0 4px 6px rgba(2,132,199,0.18))"
        />

        {/* Envelope fold creases forming the characteristic envelope cross */}
        <path
          d="M 24 49 L 58 73 L 92 49"
          fill="none"
          stroke="#0090c7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 25 89 L 46 72"
          stroke="#0090c7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 91 89 L 70 72"
          stroke="#0090c7"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* GOLDEN WAX SEAL WITH WHITE @ EMBLEM */}
        <g className="filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]">
          {/* Outer gold ring */}
          <circle cx="58" cy="73" r="12" fill="url(#goldBadgeGrad)" stroke="#f59e0b" strokeWidth="1.2" />
          <circle cx="58" cy="73" r="10" fill="none" stroke="#fde68a" strokeWidth="0.8" opacity="0.8" />

          {/* Crisp centered @ symbol */}
          <text
            x="58"
            y="77.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12.5"
            fontWeight="900"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            @
          </text>
        </g>
      </g>
    </svg>
  </div>
);

export default function App() {
  // User profile state
  const [userName, setUserName] = useState('zikri');
  const [phoneNumber, setPhoneNumber] = useState('+62 822••••5701');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  // Profile edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempPhone, setTempPhone] = useState(phoneNumber);
  const [tempAvatar, setTempAvatar] = useState(avatarUrl);

  const openEditModal = () => {
    setTempName(userName);
    setTempPhone(phoneNumber);
    setTempAvatar(avatarUrl);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (tempName.trim()) setUserName(tempName.trim());
    if (tempPhone.trim()) setPhoneNumber(tempPhone.trim());
    if (tempAvatar.trim()) setAvatarUrl(tempAvatar.trim());
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#e0f2fe]/40 flex justify-center items-start sm:py-6 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#bae6fd] selection:text-[#082f49]">
      <FontInjector />

      {/* Android Device Canvas Frame */}
      <div className="w-full max-w-[420px] bg-[#f8fafc] min-h-screen sm:min-h-[860px] sm:rounded-[36px] shadow-2xl flex flex-col relative overflow-hidden border border-[#cad5e2]/80 pb-12">
        {/* Android Top Status Bar */}
        <div className="relative z-30 bg-white">
          <AndroidStatusBar />
        </div>

        {/* Top Header Region with Back Button & Illustration */}
        <div className="relative">
          <MedicalHeroIllustration />

          {/* Navigation Bar: Arrow and "Profilku" */}
          <div className="absolute top-2 left-4 right-4 z-20 flex items-center gap-3">
            <button
              type="button"
              className="p-1 -ml-1 text-[#082f49] hover:opacity-75 transition-opacity"
              aria-label="Kembali"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-[19px] font-bold tracking-tight text-[#082f49]">Profilku</h1>
          </div>

          {/* STACK CONTAINER: Stack 1 on top of Stack 2 with rounded aesthetic & medical gradient */}
          <div className="px-4 -mt-16 relative z-20">
            {/* STACK 2: Outer Loyalty Container with Clinical Cyan-Sky to Soft-Ice-Blue gradient */}
            <div className="w-full rounded-[24px] bg-gradient-to-r from-[#00d3f2] via-[#67e8f9] to-[#d6edff] shadow-[0_6px_22px_rgba(2,132,199,0.18)] overflow-hidden border border-[#bae6fd]">
              
              {/* STACK 1: White Profile Card with fully rounded 4-corners, overlapping Stack 2 */}
              <div className="bg-white rounded-[22px] p-4 shadow-[0_3px_14px_rgba(8,47,73,0.06)] border border-[#e0f2fe] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  {/* User Profile Avatar (Clean, no camera badge) */}
                  <div
                    onClick={openEditModal}
                    className="relative cursor-pointer group"
                    title="Klik untuk mengubah profil"
                  >
                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#bae6fd] shadow-sm transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>

                  {/* Name and Phone number */}
                  <div className="flex flex-col">
                    <h2 className="text-[19px] font-extrabold text-[#082f49] tracking-tight leading-tight">
                      {userName}
                    </h2>
                    <span className="text-[13px] font-medium text-[#475569] mt-0.5 tracking-normal">
                      {phoneNumber}
                    </span>
                  </div>
                </div>

                {/* Profile action: Bold solid slanted pencil button (Opens Edit Profile Modal) */}
                <button
                  type="button"
                  onClick={openEditModal}
                  className="p-2.5 text-[#082f49] hover:text-[#0284c7] rounded-full hover:bg-[#e0f2fe]/60 transition-all active:scale-95"
                  aria-label="Edit profil"
                  title="Edit profil"
                >
                  <svg className="w-5 h-5 fill-current stroke-current" viewBox="0 0 24 24" strokeWidth="0.5">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
              </div>

              {/* STACK 2: Loyalty Bar bottom section exposed beneath Stack 1 */}
              <div className="px-4 py-2.5 flex items-center justify-between">
                {/* Left side: Badge icon + "Join loyalty" */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center text-[#082f49]">
                    <svg className="w-4.5 h-4.5 fill-[#082f49]" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <span className="text-[13.5px] font-extrabold text-[#082f49] tracking-tight">
                    Join loyalty
                  </span>
                </div>

                {/* Right side: "Ada reward eksklusif" + Dark circular arrow button */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[12.5px] font-semibold text-[#0369a1] tracking-tight">
                    Ada reward eksklusif
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#082f49] text-[#67e8f9] flex items-center justify-center shadow-sm">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="px-4 mt-3">
          <div className="bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] border border-[#bae6fd] rounded-[22px] p-3.5 pl-4 flex items-center justify-between shadow-[0_2px_8px_rgba(2,132,199,0.06)]">
            <div className="pr-1 flex flex-col items-start">
              <p className="text-[13px] font-bold text-[#0369a1] leading-snug max-w-[200px] tracking-tight">
                Kamu belum menambahkan email ke akunmu.
              </p>
              <button
                type="button"
                className="mt-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[12px] font-bold px-4 py-1 rounded-full shadow-[0_2px_6px_rgba(2,132,199,0.25)] border border-transparent active:scale-95 transition-all"
              >
                Tambah
              </button>
            </div>
            <PixelPerfectWingedMail />
          </div>
        </div>

        {}
        <div className="px-4 mt-4.5">
          <h3 className="text-[13.5px] font-bold text-[#475569] tracking-tight mb-2 px-1">
            Preferensi
          </h3>

          <div className="bg-white rounded-[22px] border border-[#e2e8f0] shadow-[0_2px_12px_rgba(8,47,73,0.04)] divide-y divide-slate-100 overflow-hidden">
            {/* Keamanan akun */}
            <button
              type="button"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f0f9ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#0284c7]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.54-3.13 8.78-7 9.88-3.87-1.1-7-5.34-7-9.88V6.3l7-3.12zM11 7v6h2V7h-2zm0 8v2h2v-2h-2z" />
                  </svg>
                </div>
                <span className="text-[13.5px] font-bold text-[#0f172a]">Keamanan akun</span>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Gojek PLUS */}
            <button
              type="button"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f0f9ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#0284c7]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H7v-2h4V7h2v4h4v2h-4v4z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-[#0f172a]">Gojek PLUS</span>
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#0284c7] to-[#00d3f2] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    <span>Promo terbatas</span>
                    <span className="text-xs">⚡</span>
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Metode Pembayaran */}
            <button
              type="button"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f0f9ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#0284c7]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.99 1-1.72V9c0-.73-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5V5z" />
                    <circle cx="16" cy="12" r="1" />
                  </svg>
                </div>
                <span className="text-[13.5px] font-bold text-[#0f172a]">Metode Pembayaran</span>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Akun Keluarga */}
            <button
              type="button"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f0f9ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#0284c7]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-[#0f172a]">Akun Keluarga</span>
                  <span className="bg-[#0284c7] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Baru
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Alamat tersimpan */}
            <button
              type="button"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f0f9ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#0284c7]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                <span className="text-[13.5px] font-bold text-[#0f172a]">Alamat tersimpan</span>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Pusat Akun Terverifikasi */}
            <button
              type="button"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f0f9ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[#0284c7]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M18.5 10l-1.5-1.5-1 1 2.5 2.5 4.5-4.5-1-1z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-[#0f172a]">Pusat Akun Terverifikasi</span>
                  <span className="bg-[#0284c7] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Baru
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Activity Section */}
        <div className="px-4 mt-5">
          <h3 className="text-[13.5px] font-bold text-[#475569] tracking-tight mb-2 px-1">
            Aktivitas Medis & Layanan
          </h3>
        </div>

        {}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-[#082f49]/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[24px] p-5 w-full max-w-sm shadow-2xl border border-[#bae6fd]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-[#082f49]">Edit Profil</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Avatar Live Preview */}
              <div className="flex justify-center my-3">
                <div className="relative">
                  <img
                    src={tempAvatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#0284c7] shadow"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-[#0284c7] text-white p-1 rounded-full border-2 border-white shadow-sm">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-[11.5px] font-bold text-[#082f49] mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full text-xs p-2.5 border border-[#cad5e2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0284c7] font-medium"
                    required
                  />
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-[11.5px] font-bold text-[#082f49] mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    placeholder="+62..."
                    className="w-full text-xs p-2.5 border border-[#cad5e2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0284c7] font-medium"
                    required
                  />
                </div>

                {/* URL Avatar */}
                <div>
                  <label className="block text-[11.5px] font-bold text-[#082f49] mb-1">
                    URL Foto Profil
                  </label>
                  <input
                    type="text"
                    value={tempAvatar}
                    onChange={(e) => setTempAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 border border-[#cad5e2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0284c7] font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
                      setTempName('zikri');
                      setTempPhone('+62 822••••5701');
                    }}
                    className="text-[11px] text-[#0284c7] font-semibold hover:underline"
                  >
                    Reset default
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl active:scale-95 transition-transform shadow-sm"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
