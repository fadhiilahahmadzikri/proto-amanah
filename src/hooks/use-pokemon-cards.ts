import React from 'react';
import { DEFAULT_DOCK_CARDS, type QueueDockCardData } from '@/types/queue-dock.types';

export type UsePokemonCardsResult = {
  cards: QueueDockCardData[];
  isLoading: boolean;
  error: string | null;
};

export function usePokemonCards(): UsePokemonCardsResult {
  const [cards] = React.useState<QueueDockCardData[]>(DEFAULT_DOCK_CARDS);
  const [isLoading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  return { cards, isLoading, error };
}
