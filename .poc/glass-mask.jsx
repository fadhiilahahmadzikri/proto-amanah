import React from 'react';

// Custom SVG icons matching reference card
const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-amber-400 text-amber-400">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const AreaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[2] fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M21 3l-7 7" />
    <path d="M9 21H3v-6" />
    <path d="M3 21l7-7" />
    <rect x="3" y="3" width="18" height="18" rx="4" className="opacity-40" />
  </svg>
);

const RoomIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[2] fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
  </svg>
);

export default function App() {
  const imageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 antialiased font-sans">
      {/* Centered Single Card Dock */}
      <div className="relative w-full max-w-[360px] h-[520px] rounded-[32px] overflow-hidden shadow-2xl bg-slate-900 select-none border border-black/10">
        
        {/* Layer 1: Single 100% Crisp Background Photo (Zero image-level blur or bloom) */}
        <img
          src={imageUrl}
          alt="Spanish villa property"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Layer 2: Real-time GPU Liquid Glass (Progressive Backdrop Blur + Vibrance Boost) */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 75%)'
          }}
        />

        {/* Layer 3: High-Contrast Ambient Gradient (For crystal clear text contrast without milky haze) */}
        <div 
          className="absolute inset-0 pointer-events-none z-15"
          style={{
            background: 'linear-gradient(to top, rgba(12, 20, 15, 0.82) 0%, rgba(12, 20, 15, 0.4) 40%, rgba(12, 20, 15, 0) 70%)'
          }}
        />

        {/* Top Badge: Prime Pick */}
        <div className="absolute top-4 left-4 z-30">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/90">
            <StarIcon />
            <span className="text-xs font-semibold text-gray-900 tracking-tight">Prime Pick</span>
          </div>
        </div>

        {/* Card Content Overlay Layer */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-5 pt-6 text-white">
          
          {/* Price Heading */}
          <h1 className="text-white text-[25px] font-semibold tracking-tight leading-none mb-3">
            List: $250,000
          </h1>

          {/* Details Row */}
          <div className="flex items-end justify-between gap-2">
            
            {/* Address / Owner */}
            <div className="flex flex-col justify-end text-left space-y-0.5">
              <p className="text-white/70 text-[13px] font-normal leading-snug tracking-tight">
                Harry Konigsberg's...
              </p>
              <p className="text-white/95 text-[13.5px] font-medium leading-snug tracking-tight">
                1065 AG Guillaume Briard
              </p>
            </div>

            {/* Specifications */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Living Area */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-white font-medium text-[13.5px]">
                  <AreaIcon />
                  <span>29m²</span>
                </div>
                <span className="text-[11px] text-white/70 font-normal mt-0.5">Living</span>
              </div>

              {/* Separator Line */}
              <div className="w-[1px] h-7 bg-white/20 self-center" />

              {/* Rooms */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-white font-medium text-[13.5px]">
                  <RoomIcon />
                  <span>2</span>
                </div>
                <span className="text-[11px] text-white/70 font-normal mt-0.5">Rooms</span>
              </div>
            </div>
          </div>

          {/* Glass Line Separator */}
          <div className="w-full h-[1px] bg-white/20 my-3.5" />

          {/* Footer Metadata Row */}
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="text-white/70">By</span>
            <span className="w-1 h-1 rounded-full bg-white/60 mx-0.5" />
            <span className="text-white font-medium underline underline-offset-2 cursor-pointer">
              Waleed Sabir
            </span>
            <span className="text-white/70 ml-1">2 days ago</span>
          </div>

        </div>

      </div>
    </div>
  );
}