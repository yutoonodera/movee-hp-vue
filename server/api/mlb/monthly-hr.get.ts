interface MonthlyHR {
  id: number;
  name: string;
  team: string;
  teamId: number;
  totalHR: number;
  monthly: Record<number, number>; // month number → HR count
}

export default defineCachedEventHandler(async () => {
  const season = new Date().getFullYear();

  // Step 1: Top 20 HR leaders for the season
  const leadersData = await $fetch<{ stats?: any[] }>(
    `https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&season=${season}&sportId=1&limit=20&sortStat=homeRuns&playerPool=ALL`,
    { parseResponse: (t) => JSON.parse(t) },
  );

  const leaders = (leadersData.stats?.[0]?.splits ?? []).map((s: any) => ({
    id: s.player?.id as number,
    name: s.player?.fullName as string,
    team: s.team?.name as string,
    teamId: s.team?.id as number,
    totalHR: s.stat?.homeRuns as number ?? 0,
  }));

  // Step 2: Monthly splits for each player in parallel
  const monthlyResults = await Promise.all(
    leaders.map((p) =>
      $fetch<{ stats?: any[] }>(
        `https://statsapi.mlb.com/api/v1/people/${p.id}/stats?stats=byMonth&group=hitting&season=${season}`,
        { parseResponse: (t) => JSON.parse(t) },
      ).then((d) => {
        const monthly: Record<number, number> = {};
        for (const s of d.stats?.[0]?.splits ?? []) {
          const month = parseInt(s.month ?? "0");
          if (month > 0) monthly[month] = s.stat?.homeRuns ?? 0;
        }
        return monthly;
      }).catch(() => ({} as Record<number, number>)),
    ),
  );

  const result: MonthlyHR[] = leaders.map((p, i) => ({
    ...p,
    monthly: monthlyResults[i],
  }));

  // Determine available months from data
  const allMonths = [...new Set(result.flatMap((p) => Object.keys(p.monthly).map(Number)))].sort((a, b) => a - b);

  return { season, players: result, months: allMonths };
}, { maxAge: 60 * 60, name: "mlb-monthly-hr" });
