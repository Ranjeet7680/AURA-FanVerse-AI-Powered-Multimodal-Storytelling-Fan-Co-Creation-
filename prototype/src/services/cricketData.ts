export interface PlayerProfile {
  id: number;
  name: string;
  country: string;
  role: string;
  bat: string;
  bowl: string;
  gender: string;
  img: string;
}

export interface PlayerStats {
  id: number;
  name: string;
  country: string;
  role: string;
  img: string;
  tests: { mat: number; runs: number; ave: number; hs: string; hundreds: number; wkts: number };
  odis: { mat: number; runs: number; ave: number; hs: string; hundreds: number; wkts: number };
  t20is: { mat: number; runs: number; ave: number; hs: string; hundreds: number; wkts: number };
}

export interface MatchSummary {
  id: string;
  teams: string[];
  format: string;
  gender: string;
  date: string;
  venue: string;
  city: string;
  event: string;
  toss: { winner: string; decision: string };
  outcome: { winner?: string; by?: Record<string, number>; result?: string };
  scores: { team: string; runs: number; wickets: number; overs: number }[];
}

export const cricketDataService = {
  async getPlayersIndex(): Promise<PlayerProfile[]> {
    try {
      const response = await fetch('/data/players_index.json');
      return await response.json();
    } catch {
      return [];
    }
  },

  async getTopPlayers(): Promise<PlayerStats[]> {
    try {
      const response = await fetch('/data/top_players_stats.json');
      return await response.json();
    } catch {
      return [];
    }
  },

  async getMatchSummaries(): Promise<MatchSummary[]> {
    try {
      const response = await fetch('/data/match_summaries.json');
      return await response.json();
    } catch {
      return [];
    }
  },

  searchPlayers(query: string, players: PlayerProfile[]): PlayerProfile[] {
    const q = query.toLowerCase().trim();
    if (!q) return players;
    return players.filter(p => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
  },

  filterMatches(filters: { format?: string; gender?: string; team?: string }, matches: MatchSummary[]): MatchSummary[] {
    return matches.filter(m => {
      let match = true;
      if (filters.format && m.format !== filters.format) match = false;
      if (filters.gender && m.gender !== filters.gender) match = false;
      if (filters.team && !m.teams.includes(filters.team)) match = false;
      return match;
    });
  },

  getTopRunScorers(players: PlayerStats[], format: 'tests' | 'odis' | 't20is', limit: number = 10): PlayerStats[] {
    return [...players].sort((a, b) => (b[format]?.runs || 0) - (a[format]?.runs || 0)).slice(0, limit);
  },

  getTopWicketTakers(players: PlayerStats[], format: 'tests' | 'odis' | 't20is', limit: number = 10): PlayerStats[] {
    return [...players].sort((a, b) => (b[format]?.wkts || 0) - (a[format]?.wkts || 0)).slice(0, limit);
  },

  getCountryStats(players: PlayerStats[]): { country: string; players: number; totalRuns: number; totalWickets: number }[] {
    const stats: Record<string, { players: number; totalRuns: number; totalWickets: number }> = {};
    
    players.forEach(p => {
      if (!stats[p.country]) {
        stats[p.country] = { players: 0, totalRuns: 0, totalWickets: 0 };
      }
      stats[p.country].players += 1;
      
      const runs = (p.tests?.runs || 0) + (p.odis?.runs || 0) + (p.t20is?.runs || 0);
      const wkts = (p.tests?.wkts || 0) + (p.odis?.wkts || 0) + (p.t20is?.wkts || 0);
      
      stats[p.country].totalRuns += runs;
      stats[p.country].totalWickets += wkts;
    });

    return Object.entries(stats).map(([country, data]) => ({ country, ...data }));
  }
};
