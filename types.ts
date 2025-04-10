export type League = 'NBA' | 'NFL' | 'NHL' | 'NCAA' | 'WNBA';

export interface TeamStats {
  id: string;
  name: string;
  wins: number;
  losses: number;
  pointsScored: number;
  pointsAgainst: number;
  winPercentage: number;
  streak: string;
  lastTenGames: string;
  homeRecord: string;
  awayRecord: string;
  divisionRecord: string;
  conferenceRecord: string;
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
}