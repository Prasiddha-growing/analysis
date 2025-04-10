import React, { useState } from 'react';
import { League } from './types';
import { LeagueSelector } from './components/LeagueSelector';
import { StatsCard } from './components/StatsCard';
import { UpcomingGames } from './components/UpcomingGames';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useTeamStats } from './hooks/useTeamStats';
import { useUpcomingGames } from './hooks/useUpcomingGames';

function App() {
  const [selectedLeague, setSelectedLeague] = useState<League>('NBA');
  const { teams, isLoading: isLoadingTeams, isError: teamsError } = useTeamStats(selectedLeague);
  const { games, isLoading: isLoadingGames, isError: gamesError } = useUpcomingGames(selectedLeague);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Sports Analysis Hub</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LeagueSelector
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoadingTeams ? (
              <LoadingSpinner />
            ) : teamsError ? (
              <ErrorMessage message="Failed to load team statistics" />
            ) : teams && teams.length >= 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard stats={teams[0]} />
                <StatsCard stats={teams[1]} />
              </div>
            ) : (
              <ErrorMessage message="No team data available" />
            )}
          </div>
          <div>
            {isLoadingGames ? (
              <LoadingSpinner />
            ) : gamesError ? (
              <ErrorMessage message="Failed to load upcoming games" />
            ) : games ? (
              <UpcomingGames games={games} />
            ) : (
              <ErrorMessage message="No upcoming games available" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;