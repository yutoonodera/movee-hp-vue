async function fetchScorers(code: string, season: number, apiKey: string) {
  const data = await $fetch<any>(
    `https://api.football-data.org/v4/competitions/${code}/scorers?season=${season}&limit=20`,
    { headers: { "X-Auth-Token": apiKey }, parseResponse: (t) => JSON.parse(t) },
  );
  return (data?.scorers ?? []).map((s: any) => ({
    name: s.player?.name ?? "",
    nationality: s.player?.nationality ?? "",
    team: s.team?.name ?? "",
    teamCrest: s.team?.crest ?? "",
    goals: s.goals ?? 0,
    assists: s.assists ?? null,
    penalties: s.penalties ?? null,
    played: s.playedMatches ?? null,
  }));
}

export default defineCachedEventHandler(async (event) => {
  const { code } = getRouterParams(event);
  const apiKey = process.env.FOOTBALL_DATA_API_KEY ?? "";
  const now = new Date();
  // Football seasons start in Aug/Sep; before August use previous year
  const season = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;

  try {
    const result = await fetchScorers(code, season, apiKey);
    // If no data yet (very early season), fall back to previous season
    if (result.length === 0 && season > 2020) {
      return await fetchScorers(code, season - 1, apiKey).catch(() => []);
    }
    return result;
  } catch {
    // Fallback to previous season on error
    if (season > 2020) {
      return await fetchScorers(code, season - 1, apiKey).catch(() => []);
    }
    return [];
  }
}, { maxAge: 60 * 15, name: "euro-scorers", getKey: (e) => e.node.req.url ?? e.path });
