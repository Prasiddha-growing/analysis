import axios from 'axios';
import * as cheerio from 'cheerio';
import { League, TeamStats, Game } from '../types';

// ESPN URLs for different leagues
const ESPN_URLS: Record<League, string> = {
  NBA: 'https://www.espn.com/nba/standings',
  NFL: 'https://www.espn.com/nfl/standings',
  NHL: 'https://www.espn.com/nhl/standings',
  NCAA: 'https://www.espn.com/mens-college-basketball/standings',
  WNBA: 'https://www.espn.com/wnba/standings'
};

// Updated schedule URLs to use the correct paths
const SCHEDULE_URLS: Record<League, string> = {
  NBA: 'https://www.espn.com/nba/scoreboard',
  NFL: 'https://www.espn.com/nfl/scoreboard',
  NHL: 'https://www.espn.com/nhl/scoreboard',
  NCAA: 'https://www.espn.com/mens-college-basketball/scoreboard',
  WNBA: 'https://www.espn.com/wnba/scoreboard'
};

// Google Sheets URL for detailed stats
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';

export async function getTeamStats(league: League): Promise<TeamStats[]> {
  try {
    // First try to get data from Google Sheets
    try {
      const { data: sheetData } = await axios.get(`${SHEETS_URL}/export?format=csv`);
      // Parse CSV data and return if successful
      if (sheetData) {
        const teams = parseSheetData(sheetData);
        if (teams.length > 0) return teams;
      }
    } catch (sheetError) {
      console.warn('Failed to fetch from Google Sheets, falling back to scraping:', sheetError);
    }

    // Fallback to scraping ESPN
    const proxyUrl = 'https://corsproxy.io/?';
    const { data } = await axios.get(`${proxyUrl}${encodeURIComponent(ESPN_URLS[league])}`);
    const $ = cheerio.load(data);
    
    const teams: TeamStats[] = [];
    
    // Updated selectors for ESPN's structure
    $('tr:not(.Table__TR--columnHeader)').each((_, element) => {
      const $row = $(element);
      const name = $row.find('td:first-child a').text().trim();
      
      if (name) {
        const columns = $row.find('td');
        const wins = parseInt(columns.eq(1).text()) || 0;
        const losses = parseInt(columns.eq(2).text()) || 0;
        const winPercentage = parseFloat(columns.eq(3).text()) || wins / (wins + losses) || 0;
        const pointsScored = parseInt(columns.eq(8).text()) || 0;
        const pointsAgainst = parseInt(columns.eq(9).text()) || 0;
        const streak = columns.eq(11).text().trim() || '-';
        const last10 = columns.eq(10).text().trim() || '-';
        
        teams.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          wins,
          losses,
          pointsScored,
          pointsAgainst,
          winPercentage,
          streak,
          lastTenGames: last10,
          homeRecord: columns.eq(4).text().trim() || '0-0',
          awayRecord: columns.eq(5).text().trim() || '0-0',
          divisionRecord: columns.eq(6).text().trim() || '0-0',
          conferenceRecord: columns.eq(7).text().trim() || '0-0'
        });
      }
    });
    
    return teams.length > 0 ? teams : getMockTeamData(league);
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return getMockTeamData(league);
  }
}

export async function getUpcomingGames(league: League): Promise<Game[]> {
  try {
    // Try Google Sheets first
    try {
      const { data: sheetData } = await axios.get(`${SHEETS_URL}/export?format=csv`);
      if (sheetData) {
        const games = parseSheetGames(sheetData);
        if (games.length > 0) return games;
      }
    } catch (sheetError) {
      console.warn('Failed to fetch games from Google Sheets, falling back to scraping:', sheetError);
    }

    // Fallback to scraping ESPN
    const proxyUrl = 'https://corsproxy.io/?';
    const url = `${proxyUrl}${encodeURIComponent(SCHEDULE_URLS[league])}`;
    
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      
      const games: Game[] = [];
      
      // Updated selectors for ESPN's scoreboard structure
      $('.gameModuleContainer, .ScoreboardScoreCell').each((_, element) => {
        const $game = $(element);
        const homeTeam = $game.find('.homeTeam .abbrev, .ScoreCell__TeamName--home').text().trim();
        const awayTeam = $game.find('.awayTeam .abbrev, .ScoreCell__TeamName--away').text().trim();
        const dateStr = $game.find('.date, .ScoreboardScoreCell__Date').text().trim();
        const timeStr = $game.find('.time, .ScoreboardScoreCell__Time').text().trim();
        const venue = $game.find('.venue, .ScoreboardScoreCell__Venue').text().trim();
        
        if (homeTeam && awayTeam) {
          games.push({
            id: `${homeTeam}-${awayTeam}`.toLowerCase().replace(/\s+/g, '-'),
            homeTeam,
            awayTeam,
            date: dateStr || new Date().toLocaleDateString(),
            time: timeStr || '7:00 PM',
            venue: venue || 'TBD'
          });
        }
      });
      
      if (games.length > 0) {
        return games;
      }
    } catch (scrapingError) {
      console.warn('Failed to scrape ESPN schedule, falling back to mock data:', scrapingError);
    }
    
    // If both Google Sheets and ESPN scraping fail, return mock data
    return getMockGames(league);
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return getMockGames(league);
  }
}

function getMockTeamData(league: League): TeamStats[] {
  const mockData: Record<League, TeamStats[]> = {
    NBA: [
      {
        id: 'boston-celtics',
        name: 'Boston Celtics',
        wins: 48,
        losses: 12,
        pointsScored: 3456,
        pointsAgainst: 3123,
        winPercentage: 0.800,
        streak: 'W5',
        lastTenGames: '8-2',
        homeRecord: '26-3',
        awayRecord: '22-9',
        divisionRecord: '12-2',
        conferenceRecord: '32-8'
      },
      {
        id: 'milwaukee-bucks',
        name: 'Milwaukee Bucks',
        wins: 41,
        losses: 19,
        pointsScored: 3345,
        pointsAgainst: 3234,
        winPercentage: 0.683,
        streak: 'W3',
        lastTenGames: '7-3',
        homeRecord: '24-6',
        awayRecord: '17-13',
        divisionRecord: '8-4',
        conferenceRecord: '27-14'
      }
    ],
    NFL: [/* Similar mock data for NFL */],
    NHL: [/* Similar mock data for NHL */],
    NCAA: [/* Similar mock data for NCAA */],
    WNBA: [/* Similar mock data for WNBA */]
  };

  return mockData[league] || mockData.NBA;
}

function getMockGames(league: League): Game[] {
  return [
    {
      id: '1',
      homeTeam: 'Boston Celtics',
      awayTeam: 'Milwaukee Bucks',
      date: new Date().toLocaleDateString(),
      time: '7:30 PM EST',
      venue: 'TD Garden'
    },
    {
      id: '2',
      homeTeam: 'Phoenix Suns',
      awayTeam: 'Los Angeles Lakers',
      date: new Date(Date.now() + 86400000).toLocaleDateString(),
      time: '8:00 PM EST',
      venue: 'Footprint Center'
    }
  ];
}

function parseSheetData(csvData: string): TeamStats[] {
  // Implementation for parsing CSV data from Google Sheets
  // This would need to be customized based on your sheet structure
  return [];
}

function parseSheetGames(csvData: string): Game[] {
  // Implementation for parsing games from Google Sheets
  // This would need to be customized based on your sheet structure
  return [];
}