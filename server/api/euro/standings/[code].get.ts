export interface EuroTeam {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  position: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string;
  // Poisson attack/defense ratings (calculated server-side)
  attackStrength: number;
  defenseStrength: number;
}

export interface EuroStandings {
  competition: string;
  season: number;
  teams: EuroTeam[];
  leagueAvgGoals: number; // goals per game (home)
}

function poisson(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 1; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

export default defineCachedEventHandler(async (event) => {
  const { code } = getRouterParams(event);
  const apiKey = process.env.FOOTBALL_DATA_API_KEY ?? "";
  const season = new Date().getFullYear();

  const data = await $fetch<any>(
    `https://api.football-data.org/v4/competitions/${code}/standings?season=${season}`,
    {
      headers: { "X-Auth-Token": apiKey },
      parseResponse: (t) => JSON.parse(t),
    },
  );

  const table: any[] = data?.standings?.[0]?.table ?? [];
  const competitionName: string = data?.competition?.name ?? code;

  // Historical league average goals per game (used as floor for early-season data)
  const LEAGUE_FLOOR: Record<string, number> = {
    PL: 2.70, PD: 2.65, BL1: 2.90, SA: 2.60, FL1: 2.55, CL: 2.80,
  };
  const floor = LEAGUE_FLOOR[code] ?? 2.65;

  // League averages — blend actual data with historical floor when few games played
  const totalGoals = table.reduce((s: number, t: any) => s + (t.goalsFor ?? 0), 0);
  const totalGames = table.reduce((s: number, t: any) => s + (t.playedGames ?? 0), 0);
  const actualAvg = totalGames > 0 ? totalGoals / totalGames : floor;
  // Weight: after 5+ games per team the actual data takes over; early season blends with floor
  const avgGamesPerTeam = totalGames / Math.max(table.length, 1);
  const weight = Math.min(1, avgGamesPerTeam / 5);
  const leagueAvgGoals = actualAvg * weight + floor * (1 - weight);

  // Weight for team-level ratings: converges to actual after ~10 games
  const teamWeight = Math.min(1, Math.max(...table.map((t: any) => t.playedGames ?? 0)) / 10);

  const teams: EuroTeam[] = table.map((t: any) => {
    const played = t.playedGames ?? 1;
    const goalsFor = t.goalsFor ?? 0;
    const goalsAgainst = t.goalsAgainst ?? 0;
    const rawAtk = played > 0 ? (goalsFor / played) / (leagueAvgGoals / 2) : 1;
    const rawDef = played > 0 ? (goalsAgainst / played) / (leagueAvgGoals / 2) : 1;
    // Blend toward neutral (1.0) in early season
    const attackStrength = rawAtk * teamWeight + 1 * (1 - teamWeight);
    const defenseStrength = rawDef * teamWeight + 1 * (1 - teamWeight);

    return {
      id: t.team?.id ?? 0,
      name: t.team?.name ?? "",
      shortName: t.team?.shortName ?? t.team?.name ?? "",
      crest: t.team?.crest ?? "",
      position: t.position ?? 0,
      played,
      won: t.won ?? 0,
      draw: t.draw ?? 0,
      lost: t.lost ?? 0,
      goalsFor,
      goalsAgainst,
      goalDiff: t.goalDifference ?? 0,
      points: t.points ?? 0,
      form: t.form ?? "",
      attackStrength: +attackStrength.toFixed(3),
      defenseStrength: +defenseStrength.toFixed(3),
    };
  });

  return { competition: competitionName, season, teams, leagueAvgGoals: +leagueAvgGoals.toFixed(3) };
}, { maxAge: 60 * 10, name: "euro-standings", getKey: (e) => e.node.req.url ?? e.path});
