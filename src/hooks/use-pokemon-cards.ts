import React from 'react';
import { DEFAULT_DOCK_CARDS, type QueueDockCardData } from '@/types/queue-dock.types';

export type UsePokemonCardsResult = {
  cards: QueueDockCardData[];
  isLoading: boolean;
  error: string | null;
};

export function usePokemonCards(): UsePokemonCardsResult {
  const [cards, setCards] = React.useState<QueueDockCardData[]>(DEFAULT_DOCK_CARDS);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isCancelled = false;

    async function loadCards() {
      try {
        const res = await fetch('/pokemon-assets/data/cards.json');
        if (!res.ok) {
          setIsLoading(false);
          return;
        }

        const rawData = await res.json();
        if (!Array.isArray(rawData) || rawData.length === 0) {
          setIsLoading(false);
          return;
        }

        // Map all 1,400+ cards from the dataset
        const mapped: QueueDockCardData[] = rawData.map((item: any) => {
          const type = item.types?.[0] ?? 'Normal';
          return {
            id: item.id,
            brand: item.name,
            title: item.rarity ?? 'Rare Holo',
            subtitle: type.toUpperCase(),
            desc: `${item.set?.toUpperCase() ?? 'TCG'} · #${item.number ?? '001'}`,
            bgClass: getGradientForType(type),
            textColor: 'text-white',
            imageUrl: item.images?.large ?? item.images?.small,
            spriteUrl: item.images?.small,
            types: item.types,
            rarity: item.rarity,
            supertype: item.supertype,
            subtypes: item.subtypes,
            number: item.number,
            set: item.set,
          };
        });

        if (!isCancelled && mapped.length > 0) {
          setCards(mapped);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Error loading pokemon cards');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCards();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { cards, isLoading, error };
}

function getGradientForType(type: string): string {
  const lower = (type || '').toLowerCase();
  switch (lower) {
    case 'fire':
      return 'bg-gradient-to-br from-orange-600 via-red-700 to-rose-950';
    case 'water':
      return 'bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-950';
    case 'lightning':
    case 'electric':
      return 'bg-gradient-to-br from-yellow-400 via-amber-600 to-amber-950';
    case 'grass':
      return 'bg-gradient-to-br from-green-500 via-emerald-700 to-emerald-950';
    case 'psychic':
      return 'bg-gradient-to-br from-purple-600 via-violet-800 to-slate-950';
    case 'dragon':
      return 'bg-gradient-to-br from-emerald-600 via-teal-800 to-slate-950';
    case 'darkness':
    case 'dark':
      return 'bg-gradient-to-br from-neutral-700 via-stone-900 to-zinc-950';
    case 'metal':
    case 'steel':
      return 'bg-gradient-to-br from-slate-400 via-slate-600 to-slate-950';
    default:
      return 'bg-gradient-to-br from-amber-700 via-stone-800 to-zinc-950';
  }
}
