export type QueueDockCardData = {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  desc?: string;
  bgClass: string;
  textColor: string;
  imageUrl?: string;
  spriteUrl?: string;
  types?: string[];
  rarity?: string;
  supertype?: string;
  subtypes?: string[];
  number?: string;
  set?: string;
  patientName?: string;
  queueNumber?: string;
  room?: string;
};

export const DOCK_CARD_WIDTH = 195;
export const DOCK_SPACING = 230; // Drag sensitivity spacing
export const DOCK_RAIL_RADIUS = 660; // Radius of circular U-railway track
export const DOCK_RAIL_ANGLE_STEP = 19.5; // Angle in degrees per card along U-railway
export const DOCK_CURVE_DEPTH = -25; // Z translation along track
export const DOCK_MAX_ROTATION_Y = 8; // Subtle 3D Y rotation
export const DOCK_MAX_ROTATION_Z = 13; // Tilt angle along top curved arc (13deg)
export const DOCK_ACTIVATION_THRESHOLD = 100;

export const DEFAULT_DOCK_CARDS: QueueDockCardData[] = [
  {
    id: 'pikachu',
    brand: 'Pikachu',
    title: 'Rare Secret',
    subtitle: 'LIGHTNING',
    desc: 'Crown Zenith · #160/159',
    bgClass: 'bg-gradient-to-br from-yellow-400 via-amber-600 to-amber-950',
    textColor: 'text-yellow-300',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/160.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types: ['Lightning'],
    rarity: 'Rare Secret',
  },
  {
    id: 'charizard',
    brand: 'Radiant Charizard',
    title: 'Radiant Rare',
    subtitle: 'FIRE',
    desc: 'Pokémon GO · #011/078',
    bgClass: 'bg-gradient-to-br from-orange-600 via-red-700 to-rose-950',
    textColor: 'text-orange-300',
    imageUrl: 'https://images.pokemontcg.io/pgo/11.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    types: ['Fire'],
    rarity: 'Radiant Rare',
  },
  {
    id: 'gengar',
    brand: 'Gengar',
    title: 'Rare Holo',
    subtitle: 'PSYCHIC',
    desc: 'Sword & Shield · #085/202',
    bgClass: 'bg-gradient-to-br from-purple-600 via-violet-800 to-slate-950',
    textColor: 'text-purple-300',
    imageUrl: 'https://images.pokemontcg.io/swsh1/85.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    types: ['Psychic'],
    rarity: 'Rare Holo',
  },
  {
    id: 'rayquaza',
    brand: 'Rayquaza V',
    title: 'Ultra Rare',
    subtitle: 'DRAGON',
    desc: 'Evolving Skies · #110/203',
    bgClass: 'bg-gradient-to-br from-emerald-600 via-teal-800 to-slate-950',
    textColor: 'text-emerald-300',
    imageUrl: 'https://images.pokemontcg.io/swsh7/110.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png',
    types: ['Dragon'],
    rarity: 'Rare Holo V',
  },
  {
    id: 'articuno',
    brand: 'Articuno',
    title: 'Rare Holo',
    subtitle: 'WATER',
    desc: 'Pokémon GO · #024/078',
    bgClass: 'bg-gradient-to-br from-cyan-500 via-blue-700 to-blue-950',
    textColor: 'text-cyan-300',
    imageUrl: 'https://images.pokemontcg.io/pgo/24.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
    types: ['Water'],
    rarity: 'Rare Holo',
  },
  {
    id: 'zapdos',
    brand: 'Zapdos',
    title: 'Rare Holo',
    subtitle: 'LIGHTNING',
    desc: 'Pokémon GO · #029/078',
    bgClass: 'bg-gradient-to-br from-yellow-500 via-amber-700 to-zinc-950',
    textColor: 'text-yellow-300',
    imageUrl: 'https://images.pokemontcg.io/pgo/29.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
    types: ['Lightning'],
    rarity: 'Rare Holo',
  },
  {
    id: 'moltres',
    brand: 'Moltres',
    title: 'Rare Holo',
    subtitle: 'FIRE',
    desc: 'Pokémon GO · #012/078',
    bgClass: 'bg-gradient-to-br from-rose-500 via-red-700 to-red-950',
    textColor: 'text-rose-300',
    imageUrl: 'https://images.pokemontcg.io/pgo/12.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
    types: ['Fire'],
    rarity: 'Rare Holo',
  },
  {
    id: 'eevee',
    brand: 'Eevee',
    title: 'Rare Holo Cosmos',
    subtitle: 'COLORLESS',
    desc: 'SWSH Promos · #SWSH127',
    bgClass: 'bg-gradient-to-br from-amber-700 via-stone-800 to-zinc-950',
    textColor: 'text-amber-200',
    imageUrl: 'https://images.pokemontcg.io/swshp/SWSH127.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    types: ['Colorless'],
    rarity: 'Rare Holo Cosmos',
  },
  {
    id: 'squirtle',
    brand: 'Squirtle',
    title: 'Classic Basic',
    subtitle: 'WATER',
    desc: 'Unbroken Bonds · #033/214',
    bgClass: 'bg-gradient-to-br from-sky-500 via-blue-600 to-blue-950',
    textColor: 'text-sky-300',
    imageUrl: 'https://images.pokemontcg.io/sm10/33.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    types: ['Water'],
    rarity: 'Common',
  },
  {
    id: 'charmander',
    brand: 'Charmander',
    title: 'Classic Basic',
    subtitle: 'FIRE',
    desc: 'Hidden Fates · #007/068',
    bgClass: 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-950',
    textColor: 'text-amber-300',
    imageUrl: 'https://images.pokemontcg.io/sm115/7.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    types: ['Fire'],
    rarity: 'Common',
  },
  {
    id: 'bulbasaur',
    brand: 'Bulbasaur',
    title: 'Classic Basic',
    subtitle: 'GRASS',
    desc: 'Shining Legends · #001/073',
    bgClass: 'bg-gradient-to-br from-green-500 via-emerald-700 to-emerald-950',
    textColor: 'text-green-300',
    imageUrl: 'https://images.pokemontcg.io/sm35/1.png',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    types: ['Grass'],
    rarity: 'Common',
  },
];
