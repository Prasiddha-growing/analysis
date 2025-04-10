import useSWR from 'swr';
import { League, Game } from '../types';
import { getUpcomingGames } from '../lib/api';

export function useUpcomingGames(league: League) {
  const { data, error, isLoading } = useSWR(
    ['upcomingGames', league],
    () => getUpcomingGames(league),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    games: data,
    isLoading,
    isError: error,
  };
}