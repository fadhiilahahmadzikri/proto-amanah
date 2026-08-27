import React, { useState, useEffect } from 'react';

// Pemetaan warna gradien berdasarkan tipe utama Pokemon untuk latar belakang sisi depan
const typeColors = {
  normal: 'from-gray-300 to-gray-500',
  fire: 'from-orange-400 to-red-600',
  water: 'from-blue-400 to-blue-700',
  grass: 'from-green-400 to-green-700',
  electric: 'from-yellow-300 to-yellow-500',
  ice: 'from-cyan-300 to-blue-400',
  fighting: 'from-red-600 to-red-900',
  poison: 'from-purple-500 to-purple-800',
  ground: 'from-yellow-600 to-amber-800',
  flying: 'from-indigo-300 to-purple-500',
  psychic: 'from-pink-400 to-pink-600',
  bug: 'from-lime-400 to-green-600',
  rock: 'from-stone-500 to-stone-800',
  ghost: 'from-indigo-800 to-purple-900',
  dragon: 'from-violet-600 to-indigo-900',
  dark: 'from-gray-700 to-black',
  steel: 'from-slate-400 to-slate-600',
  fairy: 'from-pink-300 to-rose-400',
};

// Pemetaan warna Holografik berdasarkan tipe Pokemon
const holoStyles = {
  normal: { c1: '#c0c0c0', c2: '#ffffff' },
  fire: { c1: '#ff5555', c2: '#ffaa00' },
  water: { c1: '#55aaff', c2: '#00ffff' },
  grass: { c1: '#55ff55', c2: '#aaff00' },
  electric: { c1: '#ffff00', c2: '#ffcc00' },
  ice: { c1: '#aaffff', c2: '#ffffff' },
  fighting: { c1: '#ff0000', c2: '#aa0000' },
  poison: { c1: '#aa55ff', c2: '#ff55ff' },
  ground: { c1: '#dcaa55', c2: '#ffcc55' },
  flying: { c1: '#aaaaff', c2: '#aaccff' },
  psychic: { c1: '#ff55aa', c2: '#ff00ff' },
  bug: { c1: '#aaff55', c2: '#ddff55' },
  rock: { c1: '#aa8855', c2: '#ccaa55' },
  ghost: { c1: '#5555aa', c2: '#8855ff' },
  dragon: { c1: '#5555ff', c2: '#aa55ff' },
  dark: { c1: '#555555', c2: '#333333' },
  steel: { c1: '#aaaaaa', c2: '#cccccc' },
  fairy: { c1: '#ffaaff', c2: '#ffccff' },
};

const PokemonCard = ({ pokemon }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [interact, setInteract] = useState({ rx: 0, ry: 0, px: 50, py: 50, px_spark: 50, py_spark: 50, opacity: 0 });

  const mainType = pokemon.types[0].type.name;
  const gradientClass = typeColors[mainType] || typeColors.normal;
  const holoColor = holoStyles[mainType] || holoStyles.normal;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const l = e.clientX - rect.left;
    const t = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Logika perhitungan posisi 3D TCG dari codepen yang diadaptasi
    const px = Math.abs(Math.floor((100 / w) * l) - 100);
    const py = Math.abs(Math.floor((100 / h) * t) - 100);
    const pa = (50 - px) + (50 - py);

    const lp = 50 + (px - 50) / 1.5;
    const tp = 50 + (py - 50) / 1.5;
    const px_spark = 50 + (px - 50) / 7;
    const py_spark = 50 + (py - 50) / 7;
    
    // Perhitungan kemiringan
    const ty = ((tp - 50) / 2) * -1;
    const tx = ((lp - 50) / 1.5) * 0.5;
    
    // Opacity dinamis berdasarkan sudut
    const p_opc = 20 + (Math.abs(pa) * 1.5);

    setInteract({ rx: ty, ry: tx, px: lp, py: tp, px_spark, py_spark, opacity: p_opc / 100 });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setInteract({ rx: 0, ry: 0, px: 50, py: 50, px_spark: 50, py_spark: 50, opacity: 0 });
  };

  return (
    <div 
      className="relative group cursor-pointer [perspective:1000px] w-full max-w-[280px] mx-auto aspect-[63/88] z-10 hover:z-50" 
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {}
      {/* Tilt Wrapper (Efek 3D miring) */}
      <div 
        className="relative w-full h-full"
        style={{
            transform: `rotateX(${interact.rx}deg) rotateY(${interact.ry}deg)`,
            transformStyle: 'preserve-3d',
            transition: isHovering ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        {/* Container utama untuk efek Flip Depan/Belakang */}
        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl rounded-xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {}
          {/* SISI BELAKANG (Card Back - Crimson) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-800 via-red-950 to-black rounded-xl border-[5px] border-yellow-500 [backface-visibility:hidden] flex items-center justify-center overflow-hidden">
            {/* Ornamen garis bintang/kosmik latar belakang */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Pokeball SVG Center */}
            <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 relative">
              <circle cx="50" cy="50" r="48" fill="white" stroke="#222" strokeWidth="3"/>
              <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#ef4444" stroke="#222" strokeWidth="3"/>
              <circle cx="50" cy="50" r="16" fill="white" stroke="#222" strokeWidth="4"/>
              <circle cx="50" cy="50" r="9" fill="white" stroke="#222" strokeWidth="2"/>
            </svg>
          </div>

          {}
          {/* SISI DEPAN (Card Front - Full Art Reveal) */}
          <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${gradientClass} rounded-xl border-[5px] border-gray-300 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between transition-transform duration-700 [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
            
            {/* Header: Name, HP, and Type */}
            <div className="w-full flex justify-between items-center px-3 pt-2 z-20 drop-shadow-md bg-gradient-to-b from-black/60 to-transparent pb-4">
               <div className="flex flex-col">
                  <span className="text-[9px] text-gray-200 font-bold uppercase tracking-wider">Basic</span>
                  <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] capitalize">
                     {pokemon.name} <span className="text-yellow-400 text-sm">ex</span>
                  </h2>
               </div>
               <div className="flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  <span className="text-[9px] text-red-200 font-bold mt-1">HP</span>
                  <span className="text-xl sm:text-2xl font-black text-white">{pokemon.stats[0].base_stat * 2}</span>
                  <div className={`w-5 h-5 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] border border-white/60 bg-white/20 backdrop-blur-md flex items-center justify-center ml-1`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white/90 to-white/40 shadow-sm"></div>
                  </div>
               </div>
            </div>

            {/* Gambar Pokemon Full Art Center */}
            <div className="absolute inset-0 flex items-center justify-center z-10 w-full h-full pointer-events-none">
                 <img 
                    src={pokemon.sprites.other['official-artwork'].front_default} 
                    alt={pokemon.name}
                    className="w-full h-full object-contain scale-[1.3] -translate-y-[5%] drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                 />
            </div>

            {}
            {/* Bottom Moves Block */}
            <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-3 px-3 flex flex-col gap-2 z-20">
                {/* Move 1 */}
                <div className="flex justify-between items-center text-white pb-1 border-b border-white/20">
                   <div className="flex items-center gap-2">
                       <div className="flex gap-0.5">
                           <span className="w-3 h-3 rounded-full bg-white/90 shadow-[inset_0_-2px_2px_rgba(0,0,0,0.3)]"></span>
                       </div>
                       <span className="font-bold text-xs sm:text-sm capitalize drop-shadow-md">
                          {pokemon.moves[0]?.move.name.replace('-', ' ') || 'Tackle'}
                       </span>
                   </div>
                   <span className="font-bold text-base sm:text-lg drop-shadow-md">{pokemon.stats[1].base_stat * 2}</span>
                </div>

                {/* Move 2 */}
                <div className="flex justify-between items-center text-white pb-1">
                   <div className="flex items-center gap-2">
                       <div className="flex gap-0.5">
                           <span className="w-3 h-3 rounded-full bg-white/90 shadow-[inset_0_-2px_2px_rgba(0,0,0,0.3)]"></span>
                           <span className="w-3 h-3 rounded-full bg-white/90 shadow-[inset_0_-2px_2px_rgba(0,0,0,0.3)]"></span>
                       </div>
                       <span className="font-bold text-xs sm:text-sm capitalize drop-shadow-md">
                          {pokemon.moves[1]?.move.name.replace('-', ' ') || 'Hyper Beam'}
                       </span>
                   </div>
                   <span className="font-bold text-base sm:text-lg drop-shadow-md">{pokemon.stats[2].base_stat * 3}</span>
                </div>

                {/* Footer Metadata */}
                <div className="flex justify-between mt-1 text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-widest bg-black/40 rounded px-1 py-0.5">
                   <span className="flex gap-1 items-center">weakness<span className="text-white">x2</span></span>
                   <span className="flex gap-1 items-center">resistance<span className="text-white">-30</span></span>
                   <span className="flex gap-1 items-center">retreat<span className="text-white">**</span></span>
                </div>
            </div>

            {}
            {/* HOLO EFFECT LAYERS (Only active when Front face is revealed and hovered) */}
            <div className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none transition-opacity duration-300 z-30 ${isHovering && isFlipped ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* 1. Dynamic Holo Gradient (Color Dodge) */}
              <div 
                className="absolute inset-0 mix-blend-color-dodge opacity-50"
                style={{
                    backgroundPosition: `${interact.px}% ${interact.py}%`,
                    backgroundSize: '300% 300%',
                    backgroundImage: `linear-gradient(115deg, transparent 0%, ${holoColor.c1} 25%, transparent 47%, transparent 53%, ${holoColor.c2} 75%, transparent 100%)`,
                    filter: 'brightness(0.5) contrast(1)'
                }}
              ></div>
              
              {/* 2. Sparkles & Rainbow Foil overlay (Color Dodge) */}
              <div 
                className="absolute inset-0 mix-blend-color-dodge"
                style={{
                    backgroundPosition: `${interact.px_spark}% ${interact.py_spark}%`,
                    backgroundSize: '160%',
                    backgroundImage: `url("https://assets.codepen.io/13471/sparkles.gif"), url("https://assets.codepen.io/13471/holo.png"), linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%)`,
                    backgroundBlendMode: 'overlay',
                    filter: 'brightness(1) contrast(1)',
                    opacity: interact.opacity || 0.75
                }}
              ></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomPokemons = async () => {
    setLoading(true);
    try {
      const randomIds = [];
      while (randomIds.length < 6) {
        const id = Math.floor(Math.random() * 151) + 1;
        if (!randomIds.includes(id)) randomIds.push(id);
      }

      const promises = randomIds.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      setPokemons(results);
    } catch (error) {
      console.error("Error fetching Pokemons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPokemons();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-y-auto pb-20">
      
      <div className="mb-8 text-center mt-4">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2 uppercase tracking-widest">
          Gacha Pokémon
        </h1>
        <p className="text-gray-400 text-sm">Klik kartu untuk Reveal (3D Holo Full-Art)</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
          <p className="text-yellow-400 mt-4 font-semibold tracking-widest animate-pulse">MEMUAT...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-12 w-full max-w-5xl mx-auto">
          {pokemons.map((pokemon, index) => (
            <PokemonCard key={`${pokemon.id}-${index}`} pokemon={pokemon} />
          ))}
        </div>
      )}

      <button 
        onClick={fetchRandomPokemons}
        disabled={loading}
        className="mt-14 px-8 py-4 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-black uppercase tracking-wider rounded-full shadow-[0_5px_15px_rgba(220,38,38,0.5)] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-red-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Tarik 6 Kartu Baru
      </button>

    </div>
  );
}