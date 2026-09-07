interface PitcherStats {
  id: number;
  name: string;
  teamId: number;
  era: string | null;
  wins: number;
  losses: number;
  ip: string;
  whip: string | null;
  strikeouts: number;
}

interface GamePitcher {
  id: number;
  name: string;
  era: string | null;
  wins: number;
  losses: number;
  ip: string;
  whip: string | null;
}

interface TodayGame {
  gameId: number;
  status: string;
  gameTime: string;
  homeTeamId: number;
  homeTeam: string;
  homeScore: number | null;
  homePitcher: GamePitcher | null;
  awayTeamId: number;
  awayTeam: string;
  awayScore: number | null;
  awayPitcher: GamePitcher | null;
  venue: string;
  inning: string | null;
}

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event);
  const dateParam = query.date as string | undefined;

  const today = dateParam || new Date().toISOString().slice(0, 10);

  // Fetch schedule and pitcher stats in parallel
  const [scheduleData, pitcherData] = await Promise.all([
    $fetch<{ dates?: any[] }>(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=probablePitcher,linescore,team`,
      { parseResponse: (t) => JSON.parse(t) },
    ),
    $fetch<{ stats?: any[] }>(
      `https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=${today.slice(0, 4)}&sportId=1&limit=500&sortStat=inningsPitched&playerPool=ALL`,
      { parseResponse: (t) => JSON.parse(t) },
    ),
  ]);

  // Build pitcher stats map by player ID
  const pitcherMap = new Map<number, PitcherStats>();
  for (const split of (pitcherData.stats?.[0]?.splits ?? [])) {
    const p = split.player ?? {};
    const t = split.team ?? {};
    const s = split.stat ?? {};
    pitcherMap.set(p.id, {
      id: p.id,
      name: p.fullName ?? "",
      teamId: t.id ?? 0,
      era: s.era != null ? String(s.era) : null,
      wins: s.wins ?? 0,
      losses: s.losses ?? 0,
      ip: s.inningsPitched ?? "0.0",
      whip: s.whip != null ? String(s.whip) : null,
      strikeouts: s.strikeOuts ?? 0,
    });
  }

  function buildPitcher(raw: any): GamePitcher | null {
    if (!raw?.id) return null;
    const stats = pitcherMap.get(raw.id);
    return {
      id: raw.id,
      name: raw.fullName ?? raw.name ?? "",
      era: stats?.era ?? null,
      wins: stats?.wins ?? 0,
      losses: stats?.losses ?? 0,
      ip: stats?.ip ?? "0.0",
      whip: stats?.whip ?? null,
    };
  }

  const games: TodayGame[] = [];
  for (const dateObj of scheduleData.dates ?? []) {
    for (const g of dateObj.games ?? []) {
      const home = g.teams?.home ?? {};
      const away = g.teams?.away ?? {};
      const status = g.status?.abstractGameState ?? "";
      const detailedState = g.status?.detailedState ?? "";
      const linescore = g.linescore ?? {};
      const inningState = linescore.inningState
        ? `${linescore.inningState} ${linescore.currentInningOrdinal}`
        : null;

      games.push({
        gameId: g.gamePk ?? 0,
        status: detailedState,
        gameTime: g.gameDate ?? "",
        homeTeamId: home.team?.id ?? 0,
        homeTeam: home.team?.name ?? "",
        homeScore: home.score ?? null,
        homePitcher: buildPitcher(home.probablePitcher),
        awayTeamId: away.team?.id ?? 0,
        awayTeam: away.team?.name ?? "",
        awayScore: away.score ?? null,
        awayPitcher: buildPitcher(away.probablePitcher),
        venue: g.venue?.name ?? "",
        inning: inningState,
      });
    }
  }

  return { date: today, games };
}, { maxAge: 60 * 5, name: "mlb-today", getKey: () => new Date().toISOString().slice(0, 10) });
