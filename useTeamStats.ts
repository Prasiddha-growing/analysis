import useSWR from 'swr';
import { League, TeamStats } from '../types';
import { getTeamStats } from '../lib/api';

export function useTeamStats(league: League) {
  const { data, error, isLoading } = useSWR(
    ['teamStats', league],
    () => getTeamStats(league),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    teams: data,
    isLoading,
    isError: error,
  };
}