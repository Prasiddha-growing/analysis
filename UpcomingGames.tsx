import React from 'react';
import { Calendar } from 'lucide-react';
import { Game } from '../types';

interface UpcomingGamesProps {
  games: Game[];
}

export function UpcomingGames({ games }: UpcomingGamesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 mr-2 text-gray-600" />
        <h2 className="text-2xl font-bold">Upcoming Games</h2>
      </div>
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{game.homeTeam} vs {game.awayTeam}</p>
                <p className="text-gray-600">{game.venue}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{game.date}</p>
                <p className="text-gray-600">{game.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}