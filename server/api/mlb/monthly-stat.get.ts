export interface MonthlyStatPlayer {
  id: number;
  name: string;
  team: string;
  totalValue: number;
  monthly: Record<number, number>; // month → value
  wins?: number | null; // pitching stats only
}

export interface MonthlyStatData {
  season: number;
  stat: string;
  players: MonthlyStatPlayer[];
  months: number[];
}

const SEASON = new Date().getFullYear();
const BASE = "https://statsapi.mlb.com/api/v1";

const STAT_CONFIG: Record<string, {
  group: "hitting" | "pitching";
  sortStat: string;
  pool: string;
  field: string;
}> = {
  avg: { group: "hitting",  sortStat: "avg",          pool: "QUALIFIED", field: "avg" },
  sb:  { group: "hitting",  sortStat: "stolenBases",   pool: "ALL",       field: "stolenBases" },
  era: { group: "pitching", sortStat: "era",           pool: "QUALIFIED", field: "era" },
  so:  { group: "pitching", sortStat: "strikeOuts",    pool: "ALL",       field: "strikeOuts" },
};

export default defineCachedEventHandler(async (event) => {
  const stat = (getQuery(event).stat as string) ?? "avg";
  const cfg = STAT_CONFIG[stat];
  if (!cfg) throw createError({ statusCode: 400, message: "Unknown stat" });

  // Step 1: top 20 leaders
  const leadersData = await $fetch<{ stats?: any[] }>(
    `${BASE}/stats?stats=season&group=${cfg.group}&season=${SEASON}&sportId=1&limit=20&sortStat=${cfg.sortStat}&playerPool=${cfg.pool}`,
    { parseResponse: (t) => JSON.parse(t) },
  );
  const leaders = (leadersData.stats?.[0]?.splits ?? []).map((s: any) => ({
    id: s.player?.id as number,
    name: s.player?.fullName as string,
    team: s.team?.name as string,
    totalValue: parseFloat(s.stat?.[cfg.field] ?? "0") || 0,
    wins: cfg.group === "pitching" ? (s.stat?.wins ?? null) : undefined,
  }));

  // Step 2: monthly splits for each player in parallel
  const monthlyResults = await Promise.all(
    leaders.map((p) =>
      $fetch<{ stats?: any[] }>(
        `${BASE}/people/${p.id}/stats?stats=byMonth&group=${cfg.group}&season=${SEASON}`,
        { parseResponse: (t) => JSON.parse(t) },
      ).then((d) => {
        const monthly: Record<number, number> = {};
        for (const s of d.stats?.[0]?.splits ?? []) {
          const month = parseInt(s.month ?? "0");
          if (month > 0) {
            const val = parseFloat(s.stat?.[cfg.field] ?? "0") || 0;
            monthly[month] = val;
          }
        }
        return monthly;
      }).catch(() => ({} as Record<number, number>)),
    ),
  );

  const players: MonthlyStatPlayer[] = leaders.map((p, i) => ({
    ...p,
    monthly: monthlyResults[i],
  }));

  const allMonths = [...new Set(players.flatMap((p) => Object.keys(p.monthly).map(Number)))].sort((a, b) => a - b);

  return { season: SEASON, stat, players, months: allMonths } satisfies MonthlyStatData;
}, {
  maxAge: 60 * 60,
  name: "mlb-monthly-stat",
  getKey: (e) => e.node.req.url ?? e.path,
});
