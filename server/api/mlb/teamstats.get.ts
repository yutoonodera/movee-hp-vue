interface TeamStat {
  id: number;
  name: string;
  // hitting
  avg: string;
  ops: string;
  obp: string;
  slg: string;
  homeRuns: number;
  runs: number;
  rbi: number;
  stolenBases: number;
  strikeOutsH: number;
  // pitching
  era: string;
  whip: string;
  strikeOuts: number;
  saves: number;
  holds: number;
  k9: string;
  bb9: string;
  hrAllowed: number;
  qualityStarts: number;
}

export default defineCachedEventHandler(async () => {
  const season = new Date().getFullYear();

  const [hitData, pitData] = await Promise.all([
    $fetch<{ stats?: any[] }>(
      `https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=hitting&season=${season}&sportId=1`,
      { parseResponse: (t) => JSON.parse(t) },
    ),
    $fetch<{ stats?: any[] }>(
      `https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=pitching&season=${season}&sportId=1`,
      { parseResponse: (t) => JSON.parse(t) },
    ),
  ]);

  // Build maps by team id
  const hitMap = new Map<number, any>();
  for (const s of hitData.stats?.[0]?.splits ?? []) {
    hitMap.set(s.team?.id, s.stat ?? {});
  }

  const teams: TeamStat[] = [];
  for (const s of pitData.stats?.[0]?.splits ?? []) {
    const teamId: number = s.team?.id;
    const teamName: string = s.team?.name ?? "";
    const pit = s.stat ?? {};
    const hit = hitMap.get(teamId) ?? {};

    teams.push({
      id: teamId,
      name: teamName,
      avg: hit.avg ?? ".000",
      ops: hit.ops ?? ".000",
      obp: hit.obp ?? ".000",
      slg: hit.slg ?? ".000",
      homeRuns: hit.homeRuns ?? 0,
      runs: hit.runs ?? 0,
      rbi: hit.rbi ?? 0,
      stolenBases: hit.stolenBases ?? 0,
      strikeOutsH: hit.strikeOuts ?? 0,
      era: pit.era ?? "0.00",
      whip: pit.whip ?? "0.00",
      strikeOuts: pit.strikeOuts ?? 0,
      saves: pit.saves ?? 0,
      holds: pit.holds ?? 0,
      k9: pit.strikeoutsPer9Inn ?? "0.0",
      bb9: pit.walksPer9Inn ?? "0.0",
      hrAllowed: pit.homeRuns ?? 0,
      qualityStarts: 0,
    });
  }

  return { season, teams };
}, { maxAge: 60 * 15, name: "mlb-teamstats" });
