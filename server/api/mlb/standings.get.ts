interface MlbTeamRecord {
  id: number;
  name: string;
  wins: number;
  losses: number;
  pct: number;
  gb: number | null;
  wcGb: number | null;
  homeW: number;
  homeL: number;
  awayW: number;
  awayL: number;
  streak: string;
  last10W: number;
  last10L: number;
  runsScored: number;
  runsAllowed: number;
  divisionRank: number;
  wildCardRank: number | null;
  magicNumber: string | null;
  eliminated: boolean;
}

interface MlbDivision {
  id: number;
  name: string;
  league: "AL" | "NL";
  teams: MlbTeamRecord[];
}

function parseGb(val: string | number | undefined): number | null {
  if (val === undefined || val === null) return null;
  const s = String(val).trim();
  if (s === "-" || s === "" || s === "0" || s === "0.0") return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export default defineCachedEventHandler(async () => {
  const season = new Date().getFullYear();

  const data = await $fetch<{ records?: any[] }>(
    `https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=division,team,league,record(splits=[home,away,lastTen])`,
    { parseResponse: (t) => JSON.parse(t) },
  );

  const divisionOrder: Record<number, number> = { 201: 0, 202: 1, 200: 2, 204: 3, 205: 4, 203: 5 };

  const divisions: MlbDivision[] = (data.records ?? [])
    .sort((a: any, b: any) => {
      const ia = divisionOrder[a.division?.id ?? 0] ?? 99;
      const ib = divisionOrder[b.division?.id ?? 0] ?? 99;
      return ia - ib;
    })
    .map((rec: any) => {
      const divId: number = rec.division?.id ?? 0;
      const divName: string = rec.division?.name ?? "";
      const leagueId: number = rec.league?.id ?? 0;
      const league: "AL" | "NL" = leagueId === 103 ? "AL" : "NL";

      const teams: MlbTeamRecord[] = (rec.teamRecords ?? []).map((t: any) => {
        const splits = t.records?.splits ?? [];
        const homeSplit = splits.find((s: any) => s.type === "home") ?? {};
        const awaySplit = splits.find((s: any) => s.type === "away") ?? {};
        const last10Split = splits.find((s: any) => s.type === "lastTen") ?? {};

        return {
          id: t.team?.id ?? 0,
          name: t.team?.name ?? "",
          wins: t.wins ?? 0,
          losses: t.losses ?? 0,
          pct: parseFloat(t.winningPercentage ?? "0") || 0,
          gb: parseGb(t.gamesBack),
          wcGb: parseGb(t.wildCardGamesBack),
          homeW: homeSplit.wins ?? 0,
          homeL: homeSplit.losses ?? 0,
          awayW: awaySplit.wins ?? 0,
          awayL: awaySplit.losses ?? 0,
          streak: t.streak?.streakCode ?? "",
          last10W: last10Split.wins ?? 0,
          last10L: last10Split.losses ?? 0,
          runsScored: t.runsScored ?? 0,
          runsAllowed: t.runsAllowed ?? 0,
          divisionRank: parseInt(t.divisionRank ?? "0") || 0,
          wildCardRank: t.wildCardRank ? parseInt(t.wildCardRank) : null,
          magicNumber: t.magicNumber !== "E" && t.magicNumber ? t.magicNumber : null,
          eliminated: t.eliminationNumber === "E",
        };
      });

      return { id: divId, name: divName, league, teams };
    });

  return { season, divisions };
}, { maxAge: 60 * 10, name: "mlb-standings" });
