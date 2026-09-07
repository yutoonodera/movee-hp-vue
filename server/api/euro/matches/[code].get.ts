export interface EuroMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  homeTeam: { id: number; name: string; shortName: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; crest: string };
  homeScore: number | null;
  awayScore: number | null;
}

export default defineCachedEventHandler(async (event) => {
  const { code } = getRouterParams(event);
  const apiKey = process.env.FOOTBALL_DATA_API_KEY ?? "";
  const season = new Date().getFullYear();

  // Fetch all matches for current season
  const data = await $fetch<any>(
    `https://api.football-data.org/v4/competitions/${code}/matches?season=${season}`,
    {
      headers: { "X-Auth-Token": apiKey },
      parseResponse: (t) => JSON.parse(t),
    },
  );

  const allMatches: any[] = data?.matches ?? [];

  // Find the next upcoming matchday
  const now = new Date();
  const upcoming = allMatches.filter((m: any) =>
    m.status === "TIMED" || m.status === "SCHEDULED" || m.status === "IN_PLAY" || m.status === "PAUSED",
  );

  // Next matchday number
  const nextMatchday = upcoming.length > 0
    ? Math.min(...upcoming.map((m: any) => m.matchday ?? 99))
    : null;

  // Upcoming: all matches on next matchday
  const nextRound = nextMatchday !== null
    ? upcoming.filter((m: any) => m.matchday === nextMatchday)
    : [];

  // Recent: last 10 finished matches
  const finished = allMatches
    .filter((m: any) => m.status === "FINISHED")
    .slice(-10)
    .reverse();

  function mapMatch(m: any): EuroMatch {
    return {
      id: m.id,
      utcDate: m.utcDate,
      status: m.status,
      matchday: m.matchday ?? 0,
      homeTeam: {
        id: m.homeTeam?.id ?? 0,
        name: m.homeTeam?.name ?? "",
        shortName: m.homeTeam?.shortName ?? m.homeTeam?.name ?? "",
        crest: m.homeTeam?.crest ?? "",
      },
      awayTeam: {
        id: m.awayTeam?.id ?? 0,
        name: m.awayTeam?.name ?? "",
        shortName: m.awayTeam?.shortName ?? m.awayTeam?.name ?? "",
        crest: m.awayTeam?.crest ?? "",
      },
      homeScore: m.score?.fullTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? null,
    };
  }

  return {
    nextMatchday,
    nextRound: nextRound.map(mapMatch),
    recent: finished.map(mapMatch),
  };
}, { maxAge: 60 * 5, name: "euro-matches", getKey: (e) => e.node.req.url ?? e.path});
