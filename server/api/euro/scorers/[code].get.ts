export default defineCachedEventHandler(async (event) => {
  const { code } = getRouterParams(event);
  const apiKey = process.env.FOOTBALL_DATA_API_KEY ?? "";
  const season = new Date().getFullYear();

  const data = await $fetch<any>(
    `https://api.football-data.org/v4/competitions/${code}/scorers?season=${season}&limit=20`,
    {
      headers: { "X-Auth-Token": apiKey },
      parseResponse: (t) => JSON.parse(t),
    },
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
}, { maxAge: 60 * 15, name: "euro-scorers", getKey: (e) => e.node.req.url ?? e.path});
