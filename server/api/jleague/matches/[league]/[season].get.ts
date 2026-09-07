interface EspnCompetitor {
  homeAway: "home" | "away";
  team: { displayName: string };
  score: string;
}
interface EspnStatus {
  type: { name: string };
}
interface EspnEvent {
  id: string;
  date: string;
  competitions: Array<{
    competitors: EspnCompetitor[];
    status: EspnStatus;
  }>;
}

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer";

async function fetchMonth(league: string, yearMonth: string): Promise<EspnEvent[]> {
  const [year, month] = [yearMonth.slice(0, 4), yearMonth.slice(4, 6)];
  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const start = `${yearMonth}01`;
  const end = `${yearMonth}${String(lastDay).padStart(2, "0")}`;

  try {
    const res = await $fetch<{ events?: EspnEvent[] }>(
      `${ESPN_BASE}/${league}/scoreboard`,
      {
        query: { limit: 200, dates: `${start}-${end}` },
        parseResponse: (txt) => JSON.parse(txt),
      },
    );
    return res.events ?? [];
  } catch {
    return [];
  }
}

export default defineEventHandler(async (event) => {
  const { league, season } = getRouterParams(event);
  const year = Number(season);

  // Fetch each month Feb–Dec (J-League season runs Feb-Dec)
  const months = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
    (m) => `${year}${String(m).padStart(2, "0")}`,
  );

  const allEvents = (
    await Promise.all(months.map((ym) => fetchMonth(league, ym)))
  ).flat();

  // Deduplicate by event id
  const seen = new Set<string>();
  const unique = allEvents.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });

  return unique
    .filter((e) => {
      const status = e.competitions?.[0]?.status?.type?.name ?? "";
      return status === "STATUS_FULL_TIME" || status === "STATUS_FINAL";
    })
    .map((e) => {
      const comp = e.competitions[0];
      const home = comp.competitors.find((c) => c.homeAway === "home")!;
      const away = comp.competitors.find((c) => c.homeAway === "away")!;
      return {
        match_id: Number(e.id),
        match_date: e.date.slice(0, 10),
        home_team: home.team.displayName,
        away_team: away.team.displayName,
        home_score: Number(home.score),
        away_score: Number(away.score),
      };
    })
    .sort((a, b) => b.match_date.localeCompare(a.match_date));
});
