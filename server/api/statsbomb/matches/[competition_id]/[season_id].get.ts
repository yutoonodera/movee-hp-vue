const SB_BASE = "https://raw.githubusercontent.com/statsbomb/open-data/master/data";

interface RawMatch {
  match_id: number;
  match_date: string;
  kick_off: string;
  home_team: { home_team_name: string };
  away_team: { away_team_name: string };
  home_score: number;
  away_score: number;
  competition_stage: { name: string };
}

export default defineEventHandler(async (event) => {
  const { competition_id, season_id } = getRouterParams(event);

  const raw = await $fetch<RawMatch[] | unknown>(
    `${SB_BASE}/matches/${competition_id}/${season_id}.json`,
    { parseResponse: (txt) => JSON.parse(txt) },
  );
  const matches = (Array.isArray(raw) ? raw : Object.values(raw)) as RawMatch[];

  return matches
    .sort((a, b) => b.match_date.localeCompare(a.match_date))
    .map((m) => ({
      match_id: m.match_id,
      match_date: m.match_date,
      home_team: m.home_team.home_team_name,
      away_team: m.away_team.away_team_name,
      home_score: m.home_score,
      away_score: m.away_score,
      stage: m.competition_stage.name,
    }));
});
