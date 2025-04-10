import React from 'react';
import { ShoppingBasket as Basketball, FolderRoot as Football, Pocket as Hockey, Trophy, Users } from 'lucide-react';
import { League } from '../types';
import { cn } from '../utils';

interface LeagueSelectorProps {
  selectedLeague: League;
  onLeagueChange: (league: League) => void;
}

const leagueIcons = {
  NBA: Basketball,
  NFL: Football,
  NHL: Hockey,
  NCAA: Trophy,
  WNBA: Users,
};

const leagueColors = {
  NBA: 'bg-blue-500 hover:bg-blue-600',
  NFL: 'bg-red-500 hover:bg-red-600',
  NHL: 'bg-indigo-500 hover:bg-indigo-600',
  NCAA: 'bg-orange-500 hover:bg-orange-600',
  WNBA: 'bg-pink-500 hover:bg-pink-600',
};

export function LeagueSelector({ selectedLeague, onLeagueChange }: LeagueSelectorProps) {
  return (
    <div className="flex space-x-2 p-4 bg-white rounded-lg shadow-md">
      {(Object.keys(leagueIcons) as League[]).map((league) => {
        const Icon = leagueIcons[league];
        return (
          <button
            key={league}
            onClick={() => onLeagueChange(league)}
            className={cn(
              'flex items-center px-4 py-2 rounded-md text-white transition-colors',
              leagueColors[league],
              selectedLeague === league ? 'ring-2 ring-offset-2 ring-black' : ''
            )}
          >
            <Icon className="w-5 h-5 mr-2" />
            <span className="font-semibold">{league}</span>
          </button>
        );
      })}
    </div>
  );
}