import React from 'react';
import { TeamStats } from '../types';

interface StatsCardProps {
  stats: TeamStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">{stats.name}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Record</p>
          <p className="text-2xl font-bold">{stats.wins}-{stats.losses}</p>
        </div>
        <div>
          <p className="text-gray-600">Win %</p>
          <p className="text-2xl font-bold">{(stats.winPercentage * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-600">Points For</p>
          <p className="text-2xl font-bold">{stats.pointsScored}</p>
        </div>
        <div>
          <p className="text-gray-600">Points Against</p>
          <p className="text-2xl font-bold">{stats.pointsAgainst}</p>
        </div>
        <div>
          <p className="text-gray-600">Streak</p>
          <p className="text-2xl font-bold">{stats.streak}</p>
        </div>
        <div>
          <p className="text-gray-600">Last 10</p>
          <p className="text-2xl font-bold">{stats.lastTenGames}</p>
        </div>
      </div>
    </div>
  );
}