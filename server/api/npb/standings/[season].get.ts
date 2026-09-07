interface TeamStanding {
  pos: number;
  team: string;
  games: number;
  wins: number;
  losses: number;
  ties: number;
  pct: number;
  gb: number | null;
  homeW: number;
  homeL: number;
  homeT: number;
  awayW: number;
  awayL: number;
  awayT: number;
  pennant: boolean;
  clinched: boolean;
}

interface Pitcher {
  name: string;
  team: string; // full English team name
  era: number | null;
  wins: number | null;
}

// Wikipedia 3-letter abbreviation → NPB full name
const ABBREV: Record<string, string> = {
  HAN: "Hanshin Tigers",
  YKO: "Yokohama DeNA BayStars",
  YDB: "Yokohama DeNA BayStars",
  BAY: "Yokohama DeNA BayStars",
  YOM: "Yomiuri Giants",
  GIA: "Yomiuri Giants",
  CHU: "Chunichi Dragons",
  CDR: "Chunichi Dragons",
  HIR: "Hiroshima Toyo Carp",
  HTC: "Hiroshima Toyo Carp",
  YAK: "Tokyo Yakult Swallows",
  YKS: "Tokyo Yakult Swallows",
  SWA: "Tokyo Yakult Swallows",
  SFT: "Fukuoka SoftBank Hawks",
  SOF: "Fukuoka SoftBank Hawks",
  FSH: "Fukuoka SoftBank Hawks",
  HAW: "Fukuoka SoftBank Hawks",
  NPN: "Hokkaido Nippon-Ham Fighters",
  NHF: "Hokkaido Nippon-Ham Fighters",
  FIG: "Hokkaido Nippon-Ham Fighters",
  ORX: "Orix Buffaloes",
  OBU: "Orix Buffaloes",
  TOH: "Tohoku Rakuten Golden Eagles",
  TRE: "Tohoku Rakuten Golden Eagles",
  RAK: "Tohoku Rakuten Golden Eagles",
  SEI: "Saitama Seibu Lions",
  SSL: "Saitama Seibu Lions",
  LIO: "Saitama Seibu Lions",
  LOT: "Chiba Lotte Marines",
  CLM: "Chiba Lotte Marines",
  MAR: "Chiba Lotte Marines",
};

function parseRecord(str: string): [number, number, number] {
  const clean = str.replace(/[–— ]/g, "-").trim();
  const parts = clean.split("-");
  return [Number(parts[0]) || 0, Number(parts[1]) || 0, Number(parts[2]) || 0];
}

function parseGB(str: string): number | null {
  const clean = str.replace(/[—–]/g, "").trim();
  if (!clean) return null;
  const half = clean.includes("½");
  const num = parseFloat(clean.replace(/[½]/g, ""));
  if (isNaN(num)) return null;
  return num + (half && !clean.match(/\d\.\d/) ? 0.5 : 0);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#[0-9]+;/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseStandings(tableHtml: string): TeamStanding[] {
  const rows = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) ?? [];
  const results: TeamStanding[] = [];
  for (const row of rows) {
    const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g) ?? [];
    if (cells.length < 8) continue;
    const vals = cells.map((c) => stripHtml(c));
    const pos = parseInt(vals[0]);
    if (isNaN(pos)) continue;
    const teamRaw = vals[1];
    const pennant = teamRaw.includes("†");
    const clinched = teamRaw.includes("*");
    const team = teamRaw.replace(/[†*✓◆\s]+$/g, "").trim();
    const games = parseInt(vals[2]) || 0;
    const wins = parseInt(vals[3]) || 0;
    const losses = parseInt(vals[4]) || 0;
    const ties = parseInt(vals[5]) || 0;
    const pct = parseFloat(vals[6]) || 0;
    const gb = parseGB(vals[7]);
    const [homeW, homeL, homeT] = parseRecord(vals[8] ?? "");
    const [awayW, awayL, awayT] = parseRecord(vals[9] ?? "");
    results.push({ pos, team, games, wins, losses, ties, pct, gb, homeW, homeL, homeT, awayW, awayL, awayT, pennant, clinched });
  }
  return results;
}

// Parse pitcher stat-leader tables (cols: Stat | Player (ABBR) | Value)
function parsePitcherStats(tableHtml: string): { name: string; abbrev: string; stat: string; val: string }[] {
  const rows = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) ?? [];
  const out: { name: string; abbrev: string; stat: string; val: string }[] = [];

  for (const row of rows) {
    const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g) ?? [];
    if (cells.length < 3) continue;
    const [statCell, playerCell, valCell] = cells.map((c) => stripHtml(c));
    const stat = statCell.trim();
    if (!["W", "ERA", "K", "IP", "SV", "HLD"].includes(stat)) continue;

    // Player cell may list multiple tied players: "John A (HAN)Jane B (YKO)"
    const playerRaw = playerCell ?? "";
    const matches = [...playerRaw.matchAll(/([^()]+)\(([A-Z]{2,4})\)/g)];
    for (const m of matches) {
      const name = m[1].trim();
      const abbrev = m[2].trim();
      const val = (valCell ?? "").trim();
      if (name && abbrev) out.push({ name, abbrev, stat, val });
    }
  }
  return out;
}

function extractTables(html: string): string[] {
  const tables: string[] = [];
  let idx = 0;
  while (idx < html.length) {
    const start = html.indexOf("<table", idx);
    if (start === -1) break;
    let depth = 0;
    let pos = start;
    while (pos < html.length) {
      const open = html.indexOf("<table", pos + 1);
      const close = html.indexOf("</table>", pos);
      if (close === -1) break;
      if (open !== -1 && open < close) {
        depth++;
        pos = open;
      } else {
        if (depth === 0) {
          tables.push(html.slice(start, close + 8));
          idx = close + 8;
          break;
        }
        depth--;
        pos = close + 8;
      }
    }
    if (pos >= html.length) break;
  }
  return tables;
}

export default defineCachedEventHandler(async (event) => {
  const { season } = getRouterParams(event);
  const year = parseInt(season);
  if (isNaN(year) || year < 2000 || year > 2030) {
    throw createError({ statusCode: 400, message: "Invalid season" });
  }

  const pageName = `${year}_Nippon_Professional_Baseball_season`;
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageName)}&prop=text&format=json`;

  let html: string;
  try {
    const data = await $fetch<{ parse?: { text?: { "*": string } } }>(url, {
      headers: { "User-Agent": "NPBAnalytics/1.0 (sports-data-research)" },
      parseResponse: (txt) => JSON.parse(txt),
    });
    html = data?.parse?.text?.["*"] ?? "";
  } catch {
    throw createError({ statusCode: 502, message: "Failed to fetch Wikipedia data" });
  }

  if (!html) {
    throw createError({ statusCode: 404, message: "Season not found" });
  }

  const tables = extractTables(html);

  // ── Standings (first two wikitables with Pos+Team headers) ──
  const standingTables: TeamStanding[][] = [];
  // ── Pitcher stat-leader tables (Stat|Player|Total pattern) ──
  const pitcherRaw: { name: string; abbrev: string; stat: string; val: string }[] = [];

  for (const table of tables) {
    if (!table.includes("wikitable")) continue;
    const firstRow = table.match(/<tr[^>]*>[\s\S]*?<\/tr>/)?.[0] ?? "";

    if (firstRow.includes("Pos") && firstRow.includes("Team")) {
      const parsed = parseStandings(table);
      if (parsed.length >= 3 && parsed.length <= 10) {
        standingTables.push(parsed);
        if (standingTables.length === 2) continue;
      }
    }

    if (firstRow.includes("Stat") && firstRow.includes("Player")) {
      pitcherRaw.push(...parsePitcherStats(table));
    }
  }

  // ── Build pitcher list ──
  // Merge entries: same name+abbrev → combine era and wins
  const byKey = new Map<string, Pitcher>();
  for (const { name, abbrev, stat, val } of pitcherRaw) {
    const teamFull = ABBREV[abbrev] ?? abbrev;
    const key = `${name}|${abbrev}`;
    if (!byKey.has(key)) byKey.set(key, { name, team: teamFull, era: null, wins: null });
    const entry = byKey.get(key)!;
    if (stat === "ERA") entry.era = parseFloat(val) || null;
    if (stat === "W") entry.wins = parseInt(val) || null;
  }
  const pitchers = [...byKey.values()].sort((a, b) => {
    if (a.era !== null && b.era !== null) return a.era - b.era;
    if (a.era !== null) return -1;
    if (b.era !== null) return 1;
    return (b.wins ?? 0) - (a.wins ?? 0);
  });

  return {
    season: year,
    central: standingTables[0] ?? [],
    pacific: standingTables[1] ?? [],
    pitchers,
  };
}, { maxAge: 60 * 10, name: "npb-standings", getKey: (e) => e.node.req.url ?? e.path});
