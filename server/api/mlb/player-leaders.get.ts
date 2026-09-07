export interface StatLeader {
  rank: number;
  id: number;
  name: string;
  team: string;
  value: string;
}

export interface PlayerLeadersData {
  avg: StatLeader[];
  sb: StatLeader[];
  era: StatLeader[];
  so: StatLeader[];
}

const BASE = "https://statsapi.mlb.com/api/v1/stats";
const SEASON = new Date().getFullYear();

async function fetchLeaders(
  group: "hitting" | "pitching",
  sortStat: string,
  pool: string,
  fmt: (s: any) => string,
): Promise<StatLeader[]> {
  const url = `${BASE}?stats=season&group=${group}&season=${SEASON}&sportId=1&limit=20&sortStat=${sortStat}&playerPool=${pool}`;
  const data = await $fetch<{ stats?: any[] }>(url, { parseResponse: (t) => JSON.parse(t) });
  return (data.stats?.[0]?.splits ?? []).map((s: any, i: number) => ({
    rank: i + 1,
    id: s.player?.id ?? 0,
    name: s.player?.fullName ?? "—",
    team: s.team?.name ?? "—",
    value: fmt(s.stat),
  }));
}

export default defineCachedEventHandler(async () => {
  const [avg, sb, era, so] = await Promise.all([
    fetchLeaders("hitting", "avg", "QUALIFIED", (s) =>
      s.avg ? "." + String(Math.round(s.avg * 1000)).padStart(3, "0") : ".000"),
    fetchLeaders("hitting", "stolenBases", "ALL", (s) => String(s.stolenBases ?? 0)),
    fetchLeaders("pitching", "era", "QUALIFIED", (s) =>
      s.era != null ? parseFloat(s.era).toFixed(2) : "—"),
    fetchLeaders("pitching", "strikeOuts", "ALL", (s) => String(s.strikeOuts ?? 0)),
  ]);
  return { avg, sb, era, so } satisfies PlayerLeadersData;
}, { maxAge: 60 * 15, name: "mlb-player-leaders" });
