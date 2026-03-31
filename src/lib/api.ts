
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com';

export interface CricketMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  status: string;
  startTime: string;
  league: string;
  format: 'ODI' | 'T20' | 'TEST';
  matchType: string;
}

const formatScore = (scoreObj: any) => {
  if (!scoreObj) return '';
  // Handle Innings 1 (most common for T20/ODI live view)
  const inngs1 = scoreObj.inngs1;
  if (!inngs1) return '';
  return `${inngs1.runs}/${inngs1.wickets} (${inngs1.overs})`;
}

const parseMatchData = (matchWrapper: any): CricketMatch => {
  const info = matchWrapper.matchInfo;
  const scores = matchWrapper.matchScore || {};

  return {
    id: info.matchId?.toString(),
    homeTeam: info.team1?.teamName || 'Unknown',
    awayTeam: info.team2?.teamName || 'Unknown',
    homeScore: formatScore(scores.team1Score),
    awayScore: formatScore(scores.team2Score),
    status: info.status || info.state,
    startTime: new Date(parseInt(info.startDate)).toISOString(),
    league: info.seriesName || '',
    format: info.matchFormat as 'ODI' | 'T20' | 'TEST',
    matchType: info.matchDesc || ''
  };
}

// MOCK DATA FOR FALLBACK
const MOCK_CRICKET_MATCHES: CricketMatch[] = [
  {
    id: '1',
    homeTeam: 'India',
    awayTeam: 'Australia',
    homeScore: '350/5 (50)',
    awayScore: '280/10 (48.1)',
    status: 'Live',
    startTime: new Date().toISOString(),
    league: 'ICC World Cup',
    format: 'ODI',
    matchType: 'Group Stage'
  },
  {
    id: '2',
    homeTeam: 'England',
    awayTeam: 'New Zealand',
    homeScore: '-',
    awayScore: '-',
    status: 'Scheduled',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    league: 'T20 Series',
    format: 'T20',
    matchType: '1st T20I'
  },
  {
    id: '4',
    homeTeam: 'Australia',
    awayTeam: 'England',
    homeScore: '410/10',
    awayScore: '380/10',
    status: 'Live',
    startTime: new Date().toISOString(),
    league: 'The Ashes',
    format: 'TEST',
    matchType: '3rd Test'
  }
];

export async function getLiveMatches(): Promise<CricketMatch[]> {
  try {
    if (!RAPIDAPI_KEY) {
      return MOCK_CRICKET_MATCHES.filter(m => m.status === 'Live');
    }

    const response = await fetch(`https://${RAPIDAPI_HOST}/matches/v1/live`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status}`);
      return MOCK_CRICKET_MATCHES.filter(m => m.status === 'Live');
    }

    const data = await response.json();
    const typeMatches = data.typeMatches || [];
    const matches: CricketMatch[] = [];

    // Traverse the nested structure: typeMatches -> seriesMatches -> seriesAdWrapper -> matches
    typeMatches.forEach((tm: any) => {
      if (tm.seriesMatches) {
        tm.seriesMatches.forEach((sm: any) => {
          const wrapper = sm.seriesAdWrapper;
          if (wrapper && wrapper.matches) {
            wrapper.matches.forEach((m: any) => {
              matches.push(parseMatchData(m));
            });
          }
        });
      }
    });

    if (matches.length === 0) return MOCK_CRICKET_MATCHES.filter(m => m.status === 'Live');
    return matches;

  } catch (error) {
    console.error("Error fetching live cricket matches:", error);
    return MOCK_CRICKET_MATCHES.filter(m => m.status === 'Live');
  }
}

export async function getUpcomingMatches(): Promise<CricketMatch[]> {
  // For now, keep using mock for upcoming or implement v1/upcoming if available
  // Implementation would be similar to getLiveMatches if structure is same
  // To be safe and ensure stability, we will use mock for upcoming
  // unless we strictly verify that endpoint too.
  return MOCK_CRICKET_MATCHES.filter(m => m.status === 'Scheduled');
}

export async function getMatchDetails(id: string): Promise<CricketMatch | undefined> {
  // Ideally we fetch from /matches/v1/get-scorecard?matchId=...
  // For this generic demo, we'll try to find it in the live cache or return mock
  const live = await getLiveMatches();
  const found = live.find(m => m.id === id);
  if (found) return found;

  return MOCK_CRICKET_MATCHES.find(m => m.id === id);
}
