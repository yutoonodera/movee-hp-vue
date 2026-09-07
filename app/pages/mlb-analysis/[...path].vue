<script setup lang="ts">
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler } from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler);

const route = useRoute();
const router = useRouter();
useHead({
  title: "MLB Analysis | movee",
  meta: [
    { property: "og:title", content: "MLB Analysis | movee" },
    { property: "og:description", content: "MLBリアルタイム順位・予告先発・勝率予測・月別本塁打ランキング" },
    { property: "og:url", content: () => `https://www.movee.jp${route.path}` },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://www.movee.jp/mlb-analysis.png" },
    { property: "og:image:width", content: "1254" },
    { property: "og:image:height", content: "1254" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "MLB Analysis | movee" },
    { name: "twitter:description", content: "MLBリアルタイム順位・予告先発・勝率予測・月別本塁打ランキング" },
    { name: "twitter:image", content: "https://www.movee.jp/mlb-analysis.png" },
  ],
});

// URL sync — path-based
const MLB_TABS = ["standings", "today", "predict", "stats", "players"];
const STAT_TABS = ["hr", "avg", "sb", "era", "so"] as const;

const pathSegs = computed(() => (route.params.path as string[]) ?? []);

// Share
const copied = ref(false);
function copyLink() {
  navigator.clipboard.writeText(`https://www.movee.jp${route.path}`).then(() => {
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  });
}
function shareTwitter() {
  const text = encodeURIComponent("MLB分析ページ — 順位表・予告先発・勝率予測");
  const url = encodeURIComponent(`https://www.movee.jp${route.path}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
}

// Navigation helpers
function goToTab(tab: string) {
  if (tab === "players") {
    router.replace(`/mlb-analysis/players/${playerStatTab.value}`);
  } else {
    router.replace(`/mlb-analysis/${tab}`);
  }
}
function goToStat(stat: string) {
  router.replace(`/mlb-analysis/players/${stat}`);
}
function goToHRPlayer(id: number | null) {
  if (id === null || selectedPlayerId.value === id) {
    router.replace("/mlb-analysis/players/hr");
  } else {
    router.replace(`/mlb-analysis/players/hr/${id}`);
  }
}
function goToStatPlayer(id: number | null) {
  const s = playerStatTab.value;
  if (id === null || selectedStatPlayerId.value === id) {
    router.replace(`/mlb-analysis/players/${s}`);
  } else {
    router.replace(`/mlb-analysis/players/${s}/${id}`);
  }
}

// ── Types ──────────────────────────────────────────────────────────────────
interface TeamRecord {
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

interface Division {
  id: number;
  name: string;
  league: "AL" | "NL";
  teams: TeamRecord[];
}

interface StandingsData {
  season: number;
  divisions: Division[];
}

interface GamePitcher {
  id: number;
  name: string;
  era: string | null;
  wins: number;
  losses: number;
  ip: string;
  whip: string | null;
}

interface TodayGame {
  gameId: number;
  status: string;
  gameTime: string;
  homeTeamId: number;
  homeTeam: string;
  homeScore: number | null;
  homePitcher: GamePitcher | null;
  awayTeamId: number;
  awayTeam: string;
  awayScore: number | null;
  awayPitcher: GamePitcher | null;
  venue: string;
  inning: string | null;
}

interface TodayData {
  date: string;
  games: TodayGame[];
}

interface TeamStat {
  id: number;
  name: string;
  avg: string; obp: string; slg: string; ops: string;
  homeRuns: number; runs: number; rbi: number; stolenBases: number; strikeOutsH: number;
  era: string; whip: string; strikeOuts: number; saves: number; holds: number;
  k9: string; bb9: string; hrAllowed: number;
}

interface TeamStatsData { season: number; teams: TeamStat[] }

interface MonthlyHRPlayer {
  id: number; name: string; team: string; teamId: number;
  totalHR: number; monthly: Record<number, number>;
}
interface MonthlyHRData { season: number; players: MonthlyHRPlayer[]; months: number[] }

// ── State ──────────────────────────────────────────────────────────────────
const activeTab = computed<"standings" | "today" | "predict" | "stats" | "players">(() => {
  const seg = pathSegs.value[0];
  return (MLB_TABS.includes(seg) ? seg : "standings") as any;
});

// Standings
const standings = ref<StandingsData | null>(null);
const standingsLoading = ref(true);
const standingsError = ref("");

// Today
const todayData = ref<TodayData | null>(null);
const todayLoading = ref(true);
const todayError = ref("");

// Team stats
const teamStats = ref<TeamStatsData | null>(null);
const teamStatsLoading = ref(false);
const teamStatsLoaded = ref(false);

// Player stats (monthly HR)
const monthlyHR = ref<MonthlyHRData | null>(null);
const monthlyHRLoading = ref(false);
const monthlyHRLoaded = ref(false);
// Player stat sub-tab
type PlayerStatTab = "hr" | "avg" | "sb" | "era" | "so";
const playerStatTab = computed<PlayerStatTab>(() => {
  const seg = pathSegs.value[1];
  return (STAT_TABS as readonly string[]).includes(seg) ? seg as PlayerStatTab : "hr";
});
interface StatLeader { rank: number; id: number; name: string; team: string; value: string }
interface PlayerLeaders { avg: StatLeader[]; sb: StatLeader[]; era: StatLeader[]; so: StatLeader[] }
const playerLeaders = ref<PlayerLeaders | null>(null);
const playerLeadersLoading = ref(false);
const playerLeadersLoaded = ref(false);

// Monthly stat charts (avg / sb / era / so)
interface MonthlyStatPlayer { id: number; name: string; team: string; totalValue: number; monthly: Record<number, number> }
interface MonthlyStatData { season: number; stat: string; players: MonthlyStatPlayer[]; months: number[] }
const monthlyStatCache = ref<Record<string, MonthlyStatData>>({});
const monthlyStatLoading = ref<Record<string, boolean>>({});
const statChartCanvas = ref<HTMLCanvasElement | null>(null);
let statChart: Chart | null = null;
const statView = ref<"monthly" | "cumulative">("cumulative");
const selectedStatPlayerId = computed<number | null>(() => {
  const seg = pathSegs.value[2];
  return seg && /^\d+$/.test(seg) && playerStatTab.value !== "hr" ? Number(seg) : null;
});

// Rate stats: no cumulative toggle (avg, era are rates)
const isRateStat = computed(() => playerStatTab.value === "avg" || playerStatTab.value === "era");

const STAT_LABEL: Record<string, string> = { avg: "打率", sb: "盗塁", era: "防御率", so: "奪三振" };

function fmtStatValue(stat: string, v: number): string {
  if (stat === "avg") return v === 0 ? ".000" : "." + String(Math.round(v * 1000)).padStart(3, "0");
  if (stat === "era") return v.toFixed(2);
  return String(v);
}

const hrView = ref<"monthly" | "cumulative">("cumulative");
const selectedPlayerId = computed<number | null>(() => {
  const seg = pathSegs.value[2];
  return seg && /^\d+$/.test(seg) && playerStatTab.value === "hr" ? Number(seg) : null;
});
const hrChartCanvas = ref<HTMLCanvasElement | null>(null);
let hrChart: Chart | null = null;
const statsView = ref<"hitting" | "pitching">("hitting");
const statsSortKey = ref<keyof TeamStat>("ops");
const statsSortAsc = ref(false);

// Predict tab
const predTeamA = ref("");
const predTeamB = ref("");
const homeTeam = ref<"A" | "B">("A");

// ── Constants ──────────────────────────────────────────────────────────────
const MLB_LG_ERA = 4.00;
const TIE_RATE = 0.0;
const HOME_BOOST = 0.03;

// ── Data fetch ─────────────────────────────────────────────────────────────
async function fetchStandings() {
  standingsLoading.value = true;
  standingsError.value = "";
  try {
    standings.value = await $fetch<StandingsData>("/api/mlb/standings");
  } catch {
    standingsError.value = "データの取得に失敗しました";
  } finally {
    standingsLoading.value = false;
  }
}

async function fetchToday() {
  todayLoading.value = true;
  todayError.value = "";
  try {
    todayData.value = await $fetch<TodayData>("/api/mlb/today");
  } catch {
    todayError.value = "今日の試合データの取得に失敗しました";
  } finally {
    todayLoading.value = false;
  }
}

async function fetchTeamStats() {
  if (teamStatsLoaded.value) return;
  teamStatsLoading.value = true;
  try {
    teamStats.value = await $fetch<TeamStatsData>("/api/mlb/teamstats");
    teamStatsLoaded.value = true;
  } finally {
    teamStatsLoading.value = false;
  }
}

onMounted(() => {
  fetchStandings();
  fetchToday();
  fetchPlayerLeaders();
  if (activeTab.value === "stats") fetchTeamStats();
  if (activeTab.value === "players") {
    const s = playerStatTab.value;
    if (s === "hr") {
      showPlayers();
    } else {
      fetchMonthlyHR();
      fetchMonthlyStat(s).then(() => nextTick(() => renderStatChart(s)));
    }
  }
});

async function fetchMonthlyHR() {
  if (monthlyHRLoaded.value) return;
  monthlyHRLoading.value = true;
  try {
    monthlyHR.value = await $fetch<MonthlyHRData>("/api/mlb/monthly-hr");
    monthlyHRLoaded.value = true;
  } finally {
    monthlyHRLoading.value = false;
  }
}

async function fetchPlayerLeaders() {
  if (playerLeadersLoaded.value) return;
  playerLeadersLoading.value = true;
  try {
    playerLeaders.value = await $fetch<PlayerLeaders>("/api/mlb/player-leaders");
    playerLeadersLoaded.value = true;
  } finally {
    playerLeadersLoading.value = false;
  }
}

async function showPlayers() {
  await Promise.all([fetchMonthlyHR(), fetchPlayerLeaders()]);
  await nextTick();
  renderHRChart();
}

async function fetchMonthlyStat(stat: string) {
  if (monthlyStatCache.value[stat]) return;
  monthlyStatLoading.value = { ...monthlyStatLoading.value, [stat]: true };
  try {
    monthlyStatCache.value[stat] = await $fetch<MonthlyStatData>(`/api/mlb/monthly-stat?stat=${stat}`);
  } finally {
    monthlyStatLoading.value = { ...monthlyStatLoading.value, [stat]: false };
  }
}

function buildStatChartData(stat: string) {
  const d = monthlyStatCache.value[stat];
  if (!d) return null;
  const { players, months } = d;
  const filtered = selectedStatPlayerId.value !== null
    ? players.filter((p) => p.id === selectedStatPlayerId.value)
    : players;

  const datasets = filtered.map((p, i) => {
    const origIdx = players.indexOf(p);
    const color = CHART_COLORS[origIdx % CHART_COLORS.length];
    let values: number[];
    if (!isRateStat.value && statView.value === "cumulative") {
      let cum = 0;
      values = months.map((m) => { cum += (p.monthly[m] ?? 0); return cum; });
    } else {
      values = months.map((m) => p.monthly[m] ?? 0);
    }
    return {
      label: p.name,
      data: values,
      borderColor: color,
      backgroundColor: color + "22",
      borderWidth: selectedStatPlayerId.value !== null ? 2.5 : 1.8,
      pointRadius: selectedStatPlayerId.value !== null ? 5 : 3,
      pointHoverRadius: 7,
      tension: 0.3,
    };
  });
  return { labels: months.map((m) => MONTH_LABELS[m] ?? `${m}月`), datasets };
}

function renderStatChart(stat: string) {
  const canvas = statChartCanvas.value;
  if (!canvas || !monthlyStatCache.value[stat]) return;
  const data = buildStatChartData(stat);
  if (!data) return;

  if (statChart) { statChart.destroy(); statChart = null; }

  const isDark = !document.documentElement.dataset.theme
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : document.documentElement.dataset.theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "#7d8590" : "#6b7280";

  const isRate = stat === "avg" || stat === "era";
  const yLabel = isRate
    ? (stat === "avg" ? "月間打率" : "月間防御率")
    : (statView.value === "cumulative" ? `累計${STAT_LABEL[stat]}` : `月間${STAT_LABEL[stat]}`);

  statChart = new Chart(canvas, {
    type: "line",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "right", labels: { color: tickColor, font: { size: 11 }, boxWidth: 14, padding: 8 } },
        tooltip: {
          callbacks: {
            label: (item: any) => ` ${item.dataset.label}: ${fmtStatValue(stat, item.raw)}`,
          },
        },
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
        y: {
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 11 } },
          reverse: stat === "era",
          title: { display: true, text: yLabel, color: tickColor, font: { size: 11 } },
        },
      },
    },
  });
}

watch(playerStatTab, (s) => {
  if (s === "hr") { nextTick(renderHRChart); return; }
  fetchMonthlyStat(s).then(() => nextTick(() => renderStatChart(s)));
});

watch(statView, () => {
  const s = playerStatTab.value;
  if (s !== "hr") nextTick(() => renderStatChart(s));
});

watch(selectedStatPlayerId, () => {
  const s = playerStatTab.value;
  if (s !== "hr") nextTick(() => renderStatChart(s));
});

watch(statChartCanvas, (canvas) => {
  const s = playerStatTab.value;
  if (canvas && s !== "hr" && monthlyStatCache.value[s]) renderStatChart(s);
}, { flush: "post" });

// statChartCanvas は v-else-if 内なのでデータ取得後に canvas が現れる
// → monthlyStatCache が更新されたタイミングでも描画をトリガー
watch(monthlyStatCache, () => {
  const s = playerStatTab.value;
  if (s !== "hr") nextTick(() => renderStatChart(s));
}, { deep: true });

watch(activeTab, (tab) => {
  if (tab === "stats") fetchTeamStats();
  if (tab === "players") showPlayers();
});

watch(hrView, () => {
  nextTick(renderHRChart);
});

watch(selectedPlayerId, () => {
  nextTick(renderHRChart);
});

// canvas は v-else-if の中にあるため、マウント後に ref が set される
watch(hrChartCanvas, (canvas) => {
  if (canvas && monthlyHR.value) renderHRChart();
}, { flush: "post" });

const CHART_COLORS = [
  "#3b82f6","#ef4444","#22c55e","#f59e0b","#a855f7",
  "#06b6d4","#f97316","#ec4899","#84cc16","#14b8a6",
  "#6366f1","#e11d48","#16a34a","#d97706","#7c3aed",
  "#0891b2","#ea580c","#db2777","#65a30d","#0f766e",
];

const MONTH_LABELS: Record<number, string> = {
  3:"3月", 4:"4月", 5:"5月", 6:"6月", 7:"7月",
  8:"8月", 9:"9月", 10:"10月",
};

function buildChartData() {
  if (!monthlyHR.value) return null;
  const { players, months } = monthlyHR.value;

  const filtered = selectedPlayerId.value !== null
    ? players.filter((p) => p.id === selectedPlayerId.value)
    : players;

  const datasets = filtered.map((p, i) => {
    const origIdx = players.indexOf(p);
    let values: number[];
    if (hrView.value === "cumulative") {
      let cum = 0;
      values = months.map((m) => { cum += (p.monthly[m] ?? 0); return cum; });
    } else {
      values = months.map((m) => p.monthly[m] ?? 0);
    }
    const color = CHART_COLORS[origIdx % CHART_COLORS.length];
    return {
      label: p.name,
      data: values,
      borderColor: color,
      backgroundColor: color + "22",
      borderWidth: selectedPlayerId.value !== null ? 2.5 : 1.8,
      pointRadius: selectedPlayerId.value !== null ? 5 : 3,
      pointHoverRadius: 7,
      tension: 0.3,
    };
  });

  return {
    labels: months.map((m) => MONTH_LABELS[m] ?? `${m}月`),
    datasets,
  };
}

function renderHRChart() {
  const canvas = hrChartCanvas.value;
  if (!canvas || !monthlyHR.value) return;
  const data = buildChartData();
  if (!data) return;

  if (hrChart) { hrChart.destroy(); hrChart = null; }

  const isDark = document.documentElement.dataset.theme !== "light" &&
    !document.documentElement.dataset.theme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "#7d8590" : "#6b7280";

  hrChart = new Chart(canvas, {
    type: "line",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: tickColor,
            font: { size: 11 },
            boxWidth: 14,
            padding: 8,
          },
        },
        tooltip: {
          callbacks: {
            title: (items: any[]) => items[0]?.label ?? "",
            label: (item: any) => ` ${item.dataset.label}: ${item.raw} HR`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 11 } },
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 11 }, stepSize: 5 },
          title: {
            display: true,
            text: hrView.value === "cumulative" ? "累計本塁打" : "月間本塁打",
            color: tickColor,
            font: { size: 11 },
          },
        },
      },
    },
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtPct(p: number) {
  return p === 0 ? ".000" : "." + String(Math.round(p * 1000)).padStart(3, "0");
}

function fmtGb(gb: number | null) {
  if (gb === null) return "—";
  return gb % 1 === 0.5 ? `${Math.floor(gb)}½` : String(gb);
}

function fmtEra(era: string | null) {
  if (!era) return "—";
  return parseFloat(era).toFixed(2);
}

function gameStatusLabel(status: string): { text: string; cls: string } {
  if (status === "Final") return { text: "最終", cls: "status-final" };
  if (status === "Scheduled") return { text: "予定", cls: "status-sched" };
  if (status.includes("Progress") || status.includes("progress")) return { text: "試合中", cls: "status-live" };
  if (status.includes("Postponed")) return { text: "延期", cls: "status-pp" };
  return { text: status, cls: "" };
}

function fmtTime(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" }) + " ET";
  } catch {
    return "";
  }
}

function log5(pA: number, pB: number): number {
  const denom = pA + pB - 2 * pA * pB;
  if (denom === 0) return 0.5;
  return (pA - pA * pB) / denom;
}

function calcProbs(pHome: number, pAway: number, homeEra: number | null, awayEra: number | null) {
  let adj = Math.min(0.92, Math.max(0.08, log5(pHome || 0.5, pAway || 0.5) + HOME_BOOST));
  const fH = homeEra && homeEra > 0 ? MLB_LG_ERA / homeEra : 1;
  const fA = awayEra && awayEra > 0 ? MLB_LG_ERA / awayEra : 1;
  if (fH !== 1 || fA !== 1) {
    const nH = adj * fH;
    const nA = (1 - adj) * fA;
    const total = nH + nA;
    if (total > 0) adj = Math.min(0.95, Math.max(0.05, nH / total));
  }
  const eraAdjusted = fH !== 1 || fA !== 1;
  return {
    winH: +(adj * (1 - TIE_RATE)).toFixed(4),
    tie: TIE_RATE,
    winA: +((1 - adj) * (1 - TIE_RATE)).toFixed(4),
    eraAdjusted,
  };
}

function predictFromTeam(homeTeamName: string, awayTeamName: string) {
  const allTeams = standings.value?.divisions.flatMap((d) => d.teams) ?? [];
  const tH = allTeams.find((t) => t.name === homeTeamName);
  const tA = allTeams.find((t) => t.name === awayTeamName);
  if (!tH || !tA) return null;
  const { winH, tie, winA, eraAdjusted } = calcProbs(tH.pct, tA.pct, null, null);
  return { tH, tA, winH, tie, winA, eraAdjusted };
}

function gamePred(g: TodayGame) {
  const allTeams = standings.value?.divisions.flatMap((d) => d.teams) ?? [];
  const tH = allTeams.find((t) => t.id === g.homeTeamId);
  const tA = allTeams.find((t) => t.id === g.awayTeamId);
  if (!tH || !tA) return null;
  const homeEra = g.homePitcher?.era ? parseFloat(g.homePitcher.era) : null;
  const awayEra = g.awayPitcher?.era ? parseFloat(g.awayPitcher.era) : null;
  return calcProbs(tH.pct, tA.pct, homeEra, awayEra);
}

function barW(p: number) {
  return Math.round(p * 100);
}

// ── 1試合予測 computed ──────────────────────────────────────────────────────
const prediction = computed(() => {
  if (!predTeamA.value || !predTeamB.value || predTeamA.value === predTeamB.value) return null;
  const allTeams = standings.value?.divisions.flatMap((d) => d.teams) ?? [];
  const isAHome = homeTeam.value === "A";
  const tHome = allTeams.find((t) => t.name === (isAHome ? predTeamA.value : predTeamB.value));
  const tAway = allTeams.find((t) => t.name === (isAHome ? predTeamB.value : predTeamA.value));
  if (!tHome || !tAway) return null;
  const { winH, tie, winA, eraAdjusted } = calcProbs(tHome.pct, tAway.pct, null, null);
  return { tHome, tAway, isAHome, winHome: winH, tie, winAway: winA, eraAdjusted };
});

const allTeamsSorted = computed(() => {
  return standings.value?.divisions.flatMap((d) => d.teams).sort((a, b) => a.name.localeCompare(b.name)) ?? [];
});

const todayPreds = computed(() =>
  (todayData.value?.games ?? []).map((g) => ({ game: g, pred: gamePred(g) })),
);

// Run differential (RS - RA per game)
function runDiff(t: TeamRecord): number {
  const g = t.wins + t.losses;
  if (g === 0) return 0;
  return +((t.runsScored - t.runsAllowed) / g).toFixed(2);
}

// Team stats sort + division lookup
const divisionOf = computed(() => {
  const map = new Map<number, Division>();
  for (const div of standings.value?.divisions ?? []) {
    for (const t of div.teams) map.set(t.id, div);
  }
  return map;
});

function sortVal(t: TeamStat): number {
  const k = statsSortKey.value as keyof TeamStat;
  const v = t[k];
  if (typeof v === "number") return v;
  return parseFloat(String(v)) || 0;
}

const sortedTeamStats = computed(() => {
  if (!teamStats.value) return [];
  return [...teamStats.value.teams].sort((a, b) => {
    const diff = sortVal(a) - sortVal(b);
    return statsSortAsc.value ? diff : -diff;
  });
});

function setSort(key: keyof TeamStat) {
  if (statsSortKey.value === key) {
    statsSortAsc.value = !statsSortAsc.value;
  } else {
    statsSortKey.value = key;
    statsSortAsc.value = false;
  }
}

const HITTING_COLS: { key: keyof TeamStat; label: string; asc?: boolean }[] = [
  { key: "avg",         label: "打率" },
  { key: "obp",         label: "出塁率" },
  { key: "slg",         label: "長打率" },
  { key: "ops",         label: "OPS" },
  { key: "homeRuns",    label: "本塁打" },
  { key: "runs",        label: "得点" },
  { key: "rbi",         label: "打点" },
  { key: "stolenBases", label: "盗塁" },
  { key: "strikeOutsH", label: "三振" },
];

const PITCHING_COLS: { key: keyof TeamStat; label: string; asc?: boolean }[] = [
  { key: "era",         label: "防御率" },
  { key: "whip",        label: "WHIP" },
  { key: "strikeOuts",  label: "奪三振" },
  { key: "k9",          label: "K/9" },
  { key: "bb9",         label: "BB/9" },
  { key: "hrAllowed",   label: "被本塁打" },
  { key: "saves",       label: "セーブ" },
  { key: "holds",       label: "ホールド" },
];
</script>

<template>
  <div class="mlb-page">
    <!-- Header -->
    <header class="mlb-header">
      <div class="mlb-header-inner">
        <div class="mlb-title-group">
          <span class="mlb-eyebrow">⚾ MAJOR LEAGUE BASEBALL</span>
          <h1 class="mlb-title">MLB Analysis <a class="by-movee" href="https://www.movee.jp" target="_blank" rel="noopener">by （株）movee</a></h1>
          <p class="mlb-subtitle">リアルタイム順位・予告先発・勝率予測</p>
        </div>
        <div class="share-btns">
          <button class="share-btn" @click="copyLink">{{ copied ? '✓ コピー済み' : '🔗 リンクをコピー' }}</button>
          <button class="share-btn share-btn--x" @click="shareTwitter">𝕏 でシェア</button>
        </div>
        <nav class="mlb-tabs">
          <button
            v-for="tab in [
              { id: 'standings', label: '順位表' },
              { id: 'today', label: '今日の試合' },
              { id: 'predict', label: '1試合予測' },
              { id: 'stats', label: 'チーム成績' },
              { id: 'players', label: '個人成績' },
            ]"
            :key="tab.id"
            class="mlb-tab"
            :class="{ 'mlb-tab--active': activeTab === tab.id }"
            @click="goToTab(tab.id)"
          >{{ tab.label }}</button>
        </nav>
      </div>
    </header>

    <main class="mlb-main">

      <!-- ── 順位表 ──────────────────────────────────────── -->
      <section v-show="activeTab === 'standings'">
        <div v-if="standingsLoading" class="loading-msg">データを取得中…</div>
        <div v-else-if="standingsError" class="error-msg">{{ standingsError }}</div>
        <div v-else-if="standings" class="standings-grid">
          <div
            v-for="div in standings.divisions"
            :key="div.id"
            class="div-card"
          >
            <div class="div-header">
              <span class="league-pill" :class="div.league === 'AL' ? 'al-pill' : 'nl-pill'">{{ div.league }}</span>
              <span class="div-name">{{ div.name.replace('American League', 'AL').replace('National League', 'NL') }}</span>
            </div>
            <div class="standings-table-wrap">
              <table class="standings-table">
                <thead>
                  <tr>
                    <th class="col-rank">#</th>
                    <th class="col-team">チーム</th>
                    <th class="col-num">W</th>
                    <th class="col-num">L</th>
                    <th class="col-num">勝率</th>
                    <th class="col-num">GB</th>
                    <th class="col-num">直近10</th>
                    <th class="col-num">連勝敗</th>
                    <th class="col-num">得失点差</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in div.teams" :key="t.id" class="standings-row" :class="{ 'row-top': t.divisionRank === 1 }">
                    <td class="col-rank">{{ t.divisionRank }}</td>
                    <td class="col-team">
                      {{ t.name }}
                      <span v-if="t.magicNumber" class="magic-badge">M{{ t.magicNumber }}</span>
                      <span v-if="t.eliminated" class="elim-badge">E</span>
                    </td>
                    <td class="col-num">{{ t.wins }}</td>
                    <td class="col-num">{{ t.losses }}</td>
                    <td class="col-num fw-num">{{ fmtPct(t.pct) }}</td>
                    <td class="col-num">{{ fmtGb(t.gb) }}</td>
                    <td class="col-num">{{ t.last10W }}-{{ t.last10L }}</td>
                    <td class="col-num" :class="t.streak.startsWith('W') ? 'streak-w' : 'streak-l'">{{ t.streak }}</td>
                    <td class="col-num" :class="{ 'diff-pos': runDiff(t) > 0, 'diff-neg': runDiff(t) < 0 }">
                      {{ runDiff(t) > 0 ? '+' : '' }}{{ runDiff(t) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 今日の試合 ──────────────────────────────────── -->
      <section v-show="activeTab === 'today'">
        <div v-if="todayLoading || standingsLoading" class="loading-msg">データを取得中…</div>
        <div v-else-if="todayError" class="error-msg">{{ todayError }}</div>
        <div v-else-if="!todayData?.games.length" class="empty-msg">今日の試合はありません</div>
        <div v-else>
          <p class="today-date">{{ todayData?.date }} の試合（全{{ todayData?.games.length }}試合）</p>
          <div class="games-grid">
            <div v-for="{ game, pred } in todayPreds" :key="game.gameId" class="game-card">
              <div class="game-card-top">
                <span class="game-status" :class="gameStatusLabel(game.status).cls">
                  {{ gameStatusLabel(game.status).text }}
                </span>
                <span class="game-time">{{ fmtTime(game.gameTime) }}</span>
                <span class="game-venue">{{ game.venue }}</span>
              </div>

              <div class="game-matchup">
                <!-- Away -->
                <div class="game-team-side away-side">
                  <p class="game-team-name">{{ game.awayTeam }}</p>
                  <p v-if="game.awayScore !== null" class="game-score">{{ game.awayScore }}</p>
                  <p v-if="game.awayPitcher" class="game-pitcher">
                    {{ game.awayPitcher.name }}
                    <span class="pitcher-stats">
                      ERA {{ fmtEra(game.awayPitcher.era) }}
                      ／ {{ game.awayPitcher.wins }}W-{{ game.awayPitcher.losses }}L
                    </span>
                  </p>
                  <p v-else class="game-pitcher game-pitcher--tbd">先発未定</p>
                </div>

                <div class="game-at">@</div>

                <!-- Home -->
                <div class="game-team-side home-side">
                  <p class="game-team-name">{{ game.homeTeam }}</p>
                  <p v-if="game.homeScore !== null" class="game-score">{{ game.homeScore }}</p>
                  <p v-if="game.homePitcher" class="game-pitcher">
                    {{ game.homePitcher.name }}
                    <span class="pitcher-stats">
                      ERA {{ fmtEra(game.homePitcher.era) }}
                      ／ {{ game.homePitcher.wins }}W-{{ game.homePitcher.losses }}L
                    </span>
                  </p>
                  <p v-else class="game-pitcher game-pitcher--tbd">先発未定</p>
                </div>
              </div>

              <!-- Win probability -->
              <div v-if="pred && game.status !== 'Final'" class="game-prob">
                <div class="prob-row">
                  <span class="prob-team">{{ game.awayTeam }}</span>
                  <div class="prob-bar">
                    <div class="prob-seg-a" :style="{ width: barW(pred.winA) + '%' }" />
                    <div class="prob-seg-h" :style="{ width: barW(pred.winH) + '%' }" />
                  </div>
                  <span class="prob-team">{{ game.homeTeam }}</span>
                </div>
                <div class="prob-nums">
                  <span class="pnum-a">{{ Math.round(pred.winA * 100) }}%</span>
                  <span class="prob-method">{{ pred.eraAdjusted ? 'log5 + ERA補正' : 'log5 + ホームアドバンテージ' }}</span>
                  <span class="pnum-h">{{ Math.round(pred.winH * 100) }}%</span>
                </div>
              </div>
              <div v-else-if="game.status === 'Final'" class="game-final-result">
                <span class="final-score">
                  {{ game.awayScore }} - {{ game.homeScore }}
                </span>
                <span class="final-label">最終スコア</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 1試合予測 ──────────────────────────────────── -->
      <section v-show="activeTab === 'predict'">
        <div v-if="standingsLoading" class="loading-msg">データを取得中…</div>
        <div v-else class="pred-wrap">
          <div class="pred-selectors">
            <div class="sel-group">
              <label class="sel-label">チームA</label>
              <select v-model="predTeamA" class="team-sel">
                <option value="">選択してください</option>
                <template v-for="div in standings?.divisions" :key="div.id">
                  <optgroup :label="div.name.replace('American League','AL').replace('National League','NL')">
                    <option v-for="t in div.teams" :key="t.id" :value="t.name">{{ t.name }}</option>
                  </optgroup>
                </template>
              </select>
            </div>
            <span class="vs-label">VS</span>
            <div class="sel-group">
              <label class="sel-label">チームB</label>
              <select v-model="predTeamB" class="team-sel">
                <option value="">選択してください</option>
                <template v-for="div in standings?.divisions" :key="div.id">
                  <optgroup :label="div.name.replace('American League','AL').replace('National League','NL')">
                    <option v-for="t in div.teams" :key="t.id" :value="t.name">{{ t.name }}</option>
                  </optgroup>
                </template>
              </select>
            </div>
          </div>

          <div class="home-row">
            <span class="sel-label">ホームチーム</span>
            <label class="radio-lbl">
              <input type="radio" v-model="homeTeam" value="A" />
              <span>チームA（{{ predTeamA || "—" }}）</span>
            </label>
            <label class="radio-lbl">
              <input type="radio" v-model="homeTeam" value="B" />
              <span>チームB（{{ predTeamB || "—" }}）</span>
            </label>
          </div>

          <template v-if="prediction">
            <div class="pred-card">
              <div class="pred-teams-row">
                <div class="pred-team-box">
                  <p class="pred-tname">{{ prediction.tHome.name }}</p>
                  <p class="pred-tstat">{{ prediction.tHome.wins }}勝 {{ prediction.tHome.losses }}敗</p>
                  <p class="pred-tstat">勝率 {{ fmtPct(prediction.tHome.pct) }}</p>
                  <span class="home-pill">🏟 ホーム</span>
                </div>
                <div class="pred-pcts">
                  <span class="pred-pct-a">{{ Math.round(prediction.winHome * 100) }}<small>%</small></span>
                  <span class="pred-pct-divider">vs</span>
                  <span class="pred-pct-b">{{ Math.round(prediction.winAway * 100) }}<small>%</small></span>
                </div>
                <div class="pred-team-box pred-team-box--right">
                  <p class="pred-tname">{{ prediction.tAway.name }}</p>
                  <p class="pred-tstat">{{ prediction.tAway.wins }}勝 {{ prediction.tAway.losses }}敗</p>
                  <p class="pred-tstat">勝率 {{ fmtPct(prediction.tAway.pct) }}</p>
                  <span class="away-pill">✈ ビジター</span>
                </div>
              </div>

              <div class="prob-bar-full">
                <div class="prob-seg--a" :style="{ width: barW(prediction.winHome) + '%' }" />
                <div class="prob-seg--b" :style="{ width: barW(prediction.winAway) + '%' }" />
              </div>
              <div class="prob-bar-labels">
                <span>{{ prediction.tHome.name }}の勝利</span>
                <span>{{ prediction.tAway.name }}の勝利</span>
              </div>

              <!-- Comparison table -->
              <div class="cmp-table">
                <div class="cmp-row">
                  <span class="cmp-a fw-num">{{ prediction.tHome.wins }}-{{ prediction.tHome.losses }}</span>
                  <span class="cmp-lbl">W-L</span>
                  <span class="cmp-b fw-num">{{ prediction.tAway.wins }}-{{ prediction.tAway.losses }}</span>
                </div>
                <div class="cmp-row">
                  <span class="cmp-a fw-num">{{ fmtPct(prediction.tHome.pct) }}</span>
                  <span class="cmp-lbl">勝率</span>
                  <span class="cmp-b fw-num">{{ fmtPct(prediction.tAway.pct) }}</span>
                </div>
                <div class="cmp-row">
                  <span class="cmp-a">{{ prediction.tHome.homeW }}-{{ prediction.tHome.homeL }}</span>
                  <span class="cmp-lbl">ホーム</span>
                  <span class="cmp-b">{{ prediction.tAway.homeW }}-{{ prediction.tAway.homeL }}</span>
                </div>
                <div class="cmp-row">
                  <span class="cmp-a">{{ prediction.tHome.awayW }}-{{ prediction.tHome.awayL }}</span>
                  <span class="cmp-lbl">アウェイ</span>
                  <span class="cmp-b">{{ prediction.tAway.awayW }}-{{ prediction.tAway.awayL }}</span>
                </div>
                <div class="cmp-row">
                  <span class="cmp-a" :class="{ 'diff-pos': runDiff(prediction.tHome) > 0, 'diff-neg': runDiff(prediction.tHome) < 0 }">
                    {{ runDiff(prediction.tHome) > 0 ? '+' : '' }}{{ runDiff(prediction.tHome) }}
                  </span>
                  <span class="cmp-lbl">得失点差/G</span>
                  <span class="cmp-b" :class="{ 'diff-pos': runDiff(prediction.tAway) > 0, 'diff-neg': runDiff(prediction.tAway) < 0 }">
                    {{ runDiff(prediction.tAway) > 0 ? '+' : '' }}{{ runDiff(prediction.tAway) }}
                  </span>
                </div>
              </div>

              <p class="pred-note">※ log5公式＋ホームアドバンテージ(+3%) — 今日の試合タブでは先発ERA補正も適用</p>
            </div>
          </template>
          <div v-else class="pred-empty">異なる2チームを選択してください</div>
        </div>
      </section>

      <!-- ── チーム成績 ──────────────────────────────────── -->
      <section v-show="activeTab === 'stats'">
        <div v-if="teamStatsLoading" class="loading-msg">データを取得中…</div>
        <div v-else-if="teamStats" class="ts-wrap">
          <!-- View toggle -->
          <div class="ts-controls">
            <div class="ts-toggle">
              <button class="ts-toggle-btn" :class="{ active: statsView === 'hitting' }" @click="statsView = 'hitting'; statsSortKey = 'ops'; statsSortAsc = false">打撃成績</button>
              <button class="ts-toggle-btn" :class="{ active: statsView === 'pitching' }" @click="statsView = 'pitching'; statsSortKey = 'era'; statsSortAsc = true">投手成績</button>
            </div>
            <p class="ts-note">列ヘッダーをクリックでソート</p>
          </div>

          <div class="ts-table-wrap">
            <table class="ts-table">
              <thead>
                <tr>
                  <th class="ts-th-team">チーム</th>
                  <th class="ts-th-lg">LG</th>
                  <template v-if="statsView === 'hitting'">
                    <th
                      v-for="col in HITTING_COLS" :key="col.key"
                      class="ts-th-num"
                      :class="{ 'ts-th--active': statsSortKey === col.key }"
                      @click="setSort(col.key)"
                    >
                      {{ col.label }}
                      <span class="sort-arrow">{{ statsSortKey === col.key ? (statsSortAsc ? '↑' : '↓') : '' }}</span>
                    </th>
                  </template>
                  <template v-else>
                    <th
                      v-for="col in PITCHING_COLS" :key="col.key"
                      class="ts-th-num"
                      :class="{ 'ts-th--active': statsSortKey === col.key }"
                      @click="setSort(col.key)"
                    >
                      {{ col.label }}
                      <span class="sort-arrow">{{ statsSortKey === col.key ? (statsSortAsc ? '↑' : '↓') : '' }}</span>
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in sortedTeamStats" :key="t.id" class="ts-row">
                  <td class="ts-td-team">{{ t.name }}</td>
                  <td class="ts-td-lg">
                    <span
                      class="league-pill-sm"
                      :class="divisionOf.get(t.id)?.league === 'AL' ? 'al-pill' : 'nl-pill'"
                    >{{ divisionOf.get(t.id)?.league ?? '—' }}</span>
                  </td>
                  <template v-if="statsView === 'hitting'">
                    <td class="ts-td-num fw-num">{{ t.avg }}</td>
                    <td class="ts-td-num fw-num">{{ t.obp }}</td>
                    <td class="ts-td-num fw-num">{{ t.slg }}</td>
                    <td class="ts-td-num fw-num ts-highlight">{{ t.ops }}</td>
                    <td class="ts-td-num">{{ t.homeRuns }}</td>
                    <td class="ts-td-num">{{ t.runs }}</td>
                    <td class="ts-td-num">{{ t.rbi }}</td>
                    <td class="ts-td-num">{{ t.stolenBases }}</td>
                    <td class="ts-td-num">{{ t.strikeOutsH }}</td>
                  </template>
                  <template v-else>
                    <td class="ts-td-num fw-num ts-highlight">{{ t.era }}</td>
                    <td class="ts-td-num fw-num">{{ t.whip }}</td>
                    <td class="ts-td-num">{{ t.strikeOuts }}</td>
                    <td class="ts-td-num">{{ t.k9 }}</td>
                    <td class="ts-td-num">{{ t.bb9 }}</td>
                    <td class="ts-td-num">{{ t.hrAllowed }}</td>
                    <td class="ts-td-num">{{ t.saves }}</td>
                    <td class="ts-td-num">{{ t.holds }}</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ── 個人成績 ──────────────────────────────────── -->
      <section v-show="activeTab === 'players'" class="players-section">
        <!-- サブタブ -->
        <div class="pstat-tabs">
          <button v-for="t in ([
            { id: 'hr',  label: '本塁打' },
            { id: 'avg', label: '打率' },
            { id: 'sb',  label: '盗塁' },
            { id: 'era', label: '防御率' },
            { id: 'so',  label: '奪三振' },
          ] as const)" :key="t.id"
            class="pstat-tab"
            :class="{ 'pstat-tab--active': playerStatTab === t.id }"
            @click="goToStat(t.id)">
            {{ t.label }}
          </button>
        </div>

        <!-- 本塁打（月別チャート） -->
        <div v-show="playerStatTab === 'hr'">
          <div v-if="monthlyHRLoading" class="loading-msg">データを取得中（約10秒かかります）…</div>
          <div v-else-if="monthlyHR" class="players-wrap">
            <div class="players-header">
              <h2 class="players-heading">月別本塁打 トップ20（{{ monthlyHR.season }}）</h2>
              <div class="hr-view-toggle">
                <button class="hr-toggle-btn" :class="{ active: hrView === 'cumulative' }" @click="hrView = 'cumulative'">累計</button>
                <button class="hr-toggle-btn" :class="{ active: hrView === 'monthly' }" @click="hrView = 'monthly'">月間</button>
                <button v-if="selectedPlayerId !== null" class="hr-toggle-btn hr-reset-btn" @click="goToHRPlayer(null)">全員表示</button>
              </div>
            </div>
            <div class="hr-chart-wrap">
              <canvas ref="hrChartCanvas" class="hr-canvas" />
            </div>
            <div class="hr-table-wrap">
              <table class="hr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="hr-th-name">選手</th>
                    <th class="hr-th-team">チーム</th>
                    <th v-for="m in monthlyHR.months" :key="m">{{ MONTH_LABELS[m] ?? m + '月' }}</th>
                    <th class="hr-th-total">合計</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in monthlyHR.players" :key="p.id"
                    class="hr-row"
                    :class="{ 'hr-row--selected': selectedPlayerId === p.id, 'hr-row--dim': selectedPlayerId !== null && selectedPlayerId !== p.id }"
                    @click="goToHRPlayer(p.id)"
                    style="cursor: pointer">
                    <td class="hr-rank">
                      <span class="hr-rank-inner">
                        <span class="hr-rank-dot" :style="{ background: CHART_COLORS[i % 20] }" />
                        {{ i + 1 }}
                      </span>
                    </td>
                    <td class="hr-name">{{ p.name }}</td>
                    <td class="hr-team">{{ p.team }}</td>
                    <td v-for="m in monthlyHR.months" :key="m" class="hr-cell"
                      :class="{ 'hr-cell--hot': (p.monthly[m] ?? 0) >= 10 }">
                      {{ p.monthly[m] ?? 0 }}
                    </td>
                    <td class="hr-total">{{ p.totalHR }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 打率 / 盗塁 / 防御率 / 奪三振（共有canvas） -->
        <div v-show="playerStatTab !== 'hr'">
          <div v-if="monthlyStatLoading[playerStatTab]" class="loading-msg">データを取得中（約10秒かかります）…</div>
          <div v-else-if="monthlyStatCache[playerStatTab]" class="players-wrap">
            <div class="players-header">
              <h2 class="players-heading">{{ STAT_LABEL[playerStatTab] }} トップ20（{{ monthlyStatCache[playerStatTab].season }}）</h2>
              <div class="hr-view-toggle">
                <template v-if="!isRateStat">
                  <button class="hr-toggle-btn" :class="{ active: statView === 'cumulative' }" @click="statView = 'cumulative'">累計</button>
                  <button class="hr-toggle-btn" :class="{ active: statView === 'monthly' }" @click="statView = 'monthly'">月間</button>
                </template>
                <button v-if="selectedStatPlayerId !== null" class="hr-toggle-btn hr-reset-btn" @click="goToStatPlayer(null)">全員表示</button>
              </div>
            </div>
            <div class="hr-chart-wrap">
              <canvas ref="statChartCanvas" class="hr-canvas" />
            </div>
            <div class="hr-table-wrap">
              <table class="hr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="hr-th-name">選手</th>
                    <th class="hr-th-team">チーム</th>
                    <th v-for="m in monthlyStatCache[playerStatTab].months" :key="m">{{ MONTH_LABELS[m] ?? m + '月' }}</th>
                    <th class="hr-th-total">シーズン</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in monthlyStatCache[playerStatTab].players" :key="p.id"
                    class="hr-row"
                    :class="{ 'hr-row--selected': selectedStatPlayerId === p.id, 'hr-row--dim': selectedStatPlayerId !== null && selectedStatPlayerId !== p.id }"
                    @click="goToStatPlayer(p.id)"
                    style="cursor: pointer">
                    <td class="hr-rank">
                      <span class="hr-rank-inner">
                        <span class="hr-rank-dot" :style="{ background: CHART_COLORS[i % 20] }" />
                        {{ i + 1 }}
                      </span>
                    </td>
                    <td class="hr-name">{{ p.name }}</td>
                    <td class="hr-team">{{ p.team }}</td>
                    <td v-for="m in monthlyStatCache[playerStatTab].months" :key="m" class="hr-cell">
                      {{ fmtStatValue(playerStatTab, p.monthly[m] ?? 0) }}
                    </td>
                    <td class="hr-total">{{ fmtStatValue(playerStatTab, p.totalValue) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0a0f1a;
  --surface: #111827;
  --surface2: #1c2333;
  --border: #2a3347;
  --text: #e8edf5;
  --muted: #6b7a99;
  --accent-al: #c8102e;
  --accent-nl: #003087;
  --gold: #d4a843;
  --win: #22c55e;
  --loss: #ef4444;
  --live: #f97316;
  --radius: 8px;
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --bg: #f0f4fa;
    --surface: #ffffff;
    --surface2: #e8edf5;
    --border: #c8d0e0;
    --text: #0a0f1a;
    --muted: #6b7a99;
  }
}
:root[data-theme="light"] {
  --bg: #f0f4fa;
  --surface: #ffffff;
  --surface2: #e8edf5;
  --border: #c8d0e0;
  --text: #0a0f1a;
  --muted: #6b7a99;
}
:root[data-theme="dark"] {
  --bg: #0a0f1a;
  --surface: #111827;
  --surface2: #1c2333;
  --border: #2a3347;
  --text: #e8edf5;
  --muted: #6b7a99;
}

* { box-sizing: border-box; }

.mlb-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── Header ── */
.mlb-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.mlb-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px 0;
  display: flex;
  gap: 24px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.mlb-eyebrow {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.mlb-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--text);
}
.mlb-subtitle {
  font-size: 0.75rem;
  color: var(--muted);
  margin: 4px 0 0;
}
.mlb-title-group { flex: 0 0 auto; }

.mlb-tabs {
  display: flex;
  gap: 0;
  margin-left: auto;
}
.mlb-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 10px 16px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.mlb-tab:hover { color: var(--text); }
.mlb-tab--active { color: var(--gold); border-bottom-color: var(--gold); }

/* Share */
.share-btns { display: flex; gap: 8px; align-items: center; margin-left: auto; padding-bottom: 4px; }
.share-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: color 0.15s, border-color 0.15s; white-space: nowrap; }
.share-btn:hover { color: var(--text); border-color: var(--gold); }
.share-btn--x { border-color: #1da1f2; color: #1da1f2; }
.share-btn--x:hover { background: rgba(29,161,242,0.1); }
.by-movee { font-size: 0.42em; font-weight: 500; color: var(--muted); letter-spacing: 0.04em; text-decoration: none; vertical-align: middle; }
.by-movee:hover { color: var(--gold); text-decoration: underline; }

/* ── Mobile header ── */
@media (max-width: 640px) {
  .mlb-header-inner { padding: 8px 12px 0; gap: 8px; align-items: center; }
  .mlb-eyebrow, .mlb-subtitle { display: none; }
  .mlb-title { font-size: 1.2rem; }
  .mlb-title-group { flex: 1; min-width: 0; }
  .share-btns { margin-left: 0; gap: 4px; }
  .share-btn { padding: 4px 8px; font-size: 0.68rem; }
  .mlb-tabs { margin-left: 0; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .mlb-tabs::-webkit-scrollbar { display: none; }
  .mlb-tab { padding: 8px 10px; font-size: 0.75rem; flex-shrink: 0; white-space: nowrap; }
}

/* ── Main ── */
.mlb-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* ── Status messages ── */
.loading-msg, .error-msg, .empty-msg {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
  font-size: 0.9rem;
}
.error-msg { color: var(--loss); }

/* ── League / division pills ── */
.league-pill {
  display: inline-block;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1px 7px;
  border-radius: 3px;
  margin-right: 6px;
}
.league-pill-sm {
  display: inline-block;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
}
.al-pill { background: rgba(200, 16, 46, 0.2); color: #e85470; }
.nl-pill { background: rgba(0, 48, 135, 0.3); color: #5b80d4; }

/* ── Standings ── */
.standings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(540px, 1fr));
  gap: 20px;
}
.div-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.div-header {
  padding: 12px 16px;
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}
.div-name { color: var(--text); }
.standings-table-wrap { overflow-x: auto; }
.standings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.standings-table th {
  padding: 7px 10px;
  text-align: right;
  color: var(--muted);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
}
.standings-table th.col-team, .standings-table th.col-rank { text-align: left; }
.standings-table td {
  padding: 8px 10px;
  text-align: right;
  border-bottom: 1px solid rgba(42, 51, 71, 0.5);
  white-space: nowrap;
}
.standings-row:last-child td { border-bottom: none; }
.col-rank { color: var(--muted); font-size: 0.75rem; text-align: left !important; min-width: 24px; }
.col-team { text-align: left !important; min-width: 160px; }
.col-num { min-width: 40px; }
.fw-num { font-variant-numeric: tabular-nums; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; }
.row-top td { color: var(--text); }
.row-top .fw-num { color: var(--gold); }
.magic-badge { font-size: 0.65rem; background: rgba(212, 168, 67, 0.2); color: var(--gold); padding: 1px 5px; border-radius: 3px; margin-left: 4px; }
.elim-badge { font-size: 0.65rem; background: rgba(239, 68, 68, 0.15); color: var(--loss); padding: 1px 5px; border-radius: 3px; margin-left: 4px; }
.streak-w { color: var(--win); font-weight: 600; }
.streak-l { color: var(--loss); font-weight: 600; }
.diff-pos { color: var(--win); }
.diff-neg { color: var(--loss); }

/* ── Today's games ── */
.today-date { font-size: 0.8rem; color: var(--muted); margin: 0 0 16px; }
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}
.game-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.game-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--muted);
  flex-wrap: wrap;
}
.game-status {
  font-size: 0.65rem;
  font-weight: 700;
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 3px;
  background: var(--surface2);
  color: var(--muted);
}
.status-final { background: rgba(107, 122, 153, 0.2); color: var(--muted); }
.status-sched { background: rgba(212, 168, 67, 0.15); color: var(--gold); }
.status-live { background: rgba(249, 115, 22, 0.2); color: var(--live); animation: pulse-badge 1.5s ease-in-out infinite; }
.status-pp { background: rgba(239, 68, 68, 0.15); color: var(--loss); }
@keyframes pulse-badge { 0%,100%{ opacity:1 } 50%{ opacity:0.6 } }

.game-matchup {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.game-team-side { flex: 1; }
.away-side { text-align: right; }
.home-side { text-align: left; }
.game-at { font-size: 0.9rem; color: var(--muted); flex: 0 0 auto; padding-top: 2px; }
.game-team-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 3px;
  color: var(--text);
  line-height: 1.2;
}
.game-score {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 3px;
  color: var(--text);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.game-pitcher {
  font-size: 0.72rem;
  color: var(--muted);
  margin: 0;
  min-height: 2.8em;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.home-side .game-pitcher { align-items: flex-start; }
.away-side .game-pitcher { align-items: flex-end; }
.game-pitcher--tbd { font-style: italic; }
.pitcher-stats { font-size: 0.67rem; color: var(--muted); opacity: 0.75; }

/* Prob bar */
.game-prob { display: flex; flex-direction: column; gap: 4px; }
.prob-row { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; }
.prob-team { flex: 1; color: var(--muted); }
.prob-row .prob-team:last-child { text-align: right; }
.prob-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--surface2);
  overflow: hidden;
  display: flex;
}
.prob-seg-a { height: 100%; background: var(--accent-al); border-radius: 3px 0 0 3px; transition: width 0.4s; }
.prob-seg-h { height: 100%; background: var(--accent-nl); border-radius: 0 3px 3px 0; transition: width 0.4s; }
.prob-nums { display: flex; justify-content: space-between; font-size: 0.7rem; }
.pnum-a { color: var(--accent-al); font-weight: 700; font-family: 'Barlow Condensed', sans-serif; }
.pnum-h { color: var(--accent-nl); font-weight: 700; font-family: 'Barlow Condensed', sans-serif; }
.prob-method { color: var(--muted); font-size: 0.64rem; }

.game-final-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.final-score { font-family: 'Barlow Condensed', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--text); }
.final-label { font-size: 0.65rem; color: var(--muted); }

/* ── Predict tab ── */
.pred-wrap { max-width: 700px; }
.pred-selectors { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.sel-group { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 6px; }
.sel-label { font-size: 0.72rem; color: var(--muted); letter-spacing: 0.04em; font-weight: 500; }
.team-sel {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 9px 12px;
  border-radius: var(--radius);
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
}
.team-sel:focus { outline: 2px solid var(--gold); outline-offset: 2px; }
.vs-label { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--muted); padding-top: 20px; }

.home-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
.radio-lbl { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; cursor: pointer; color: var(--muted); }
.radio-lbl input[type=radio] { accent-color: var(--gold); }
.radio-lbl:has(input:checked) { color: var(--text); }

.pred-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pred-teams-row { display: flex; align-items: center; gap: 12px; }
.pred-team-box { flex: 1; }
.pred-team-box--right { text-align: right; }
.pred-tname { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; margin: 0 0 3px; }
.pred-tstat { font-size: 0.76rem; color: var(--muted); margin: 0; }
.home-pill { display: inline-block; font-size: 0.65rem; background: rgba(212, 168, 67, 0.15); color: var(--gold); padding: 2px 7px; border-radius: 3px; margin-top: 6px; }
.away-pill { display: inline-block; font-size: 0.65rem; background: rgba(107, 122, 153, 0.15); color: var(--muted); padding: 2px 7px; border-radius: 3px; margin-top: 6px; }

.pred-pcts { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 0 0 auto; }
.pred-pct-a, .pred-pct-b { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 800; line-height: 1; }
.pred-pct-a { color: var(--gold); }
.pred-pct-b { color: var(--muted); }
.pred-pct-divider { font-size: 0.7rem; color: var(--muted); }
.pred-pct-a small, .pred-pct-b small { font-size: 1rem; }

.prob-bar-full {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  background: var(--surface2);
}
.prob-seg--a { background: var(--gold); height: 100%; transition: width 0.5s; }
.prob-seg--b { background: var(--muted); opacity: 0.4; height: 100%; transition: width 0.5s; }
.prob-bar-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--muted); }

/* cmp table in predict */
.cmp-table { display: flex; flex-direction: column; gap: 6px; background: var(--surface2); border-radius: 6px; padding: 12px; }
.cmp-row { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; }
.cmp-a { flex: 1; text-align: right; font-variant-numeric: tabular-nums; }
.cmp-b { flex: 1; font-variant-numeric: tabular-nums; }
.cmp-lbl { flex: 0 0 100px; text-align: center; font-size: 0.7rem; color: var(--muted); letter-spacing: 0.03em; }

.pred-note { font-size: 0.7rem; color: var(--muted); margin: 0; }
.pred-empty { padding: 40px 0; color: var(--muted); font-size: 0.9rem; }

/* ── Compare tab ── */
.compare-wrap { overflow-x: auto; }
.cmp-heading { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; margin: 0 0 16px; }
.cmp-full-wrap { overflow-x: auto; }
.cmp-full-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.81rem;
  min-width: 700px;
}
.cmp-full-table th {
  padding: 8px 12px;
  text-align: right;
  color: var(--muted);
  font-size: 0.7rem;
  font-weight: 500;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.cmp-full-table th:first-child { text-align: left; }
.cmp-full-table td { padding: 8px 12px; text-align: right; border-bottom: 1px solid rgba(42, 51, 71, 0.4); }
.div-separator td {
  padding: 10px 12px 4px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
  background: var(--surface2);
  text-align: left !important;
}
.team-cell { text-align: left !important; white-space: nowrap; font-weight: 500; }
.lg-cell { text-align: left !important; }
.cmp-data-row:hover td { background: var(--surface2); }
.cmp-data-row.row-top .team-cell { color: var(--gold); font-weight: 600; }

/* ── Team stats tab ── */
.ts-wrap { display: flex; flex-direction: column; gap: 16px; }
.ts-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.ts-toggle { display: flex; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.ts-toggle-btn {
  background: none; border: none; color: var(--muted);
  font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500;
  padding: 8px 18px; cursor: pointer; transition: color 0.15s, background 0.15s;
}
.ts-toggle-btn.active { background: var(--surface); color: var(--gold); }
.ts-note { font-size: 0.72rem; color: var(--muted); margin: 0; }

.ts-table-wrap { overflow-x: auto; }
.ts-table {
  width: 100%; border-collapse: collapse;
  font-size: 0.81rem; min-width: 600px;
}
.ts-th-team, .ts-th-lg, .ts-th-num {
  padding: 8px 12px;
  color: var(--muted); font-size: 0.7rem; font-weight: 500;
  border-bottom: 1px solid var(--border);
  white-space: nowrap; cursor: pointer; user-select: none;
}
.ts-th-team { text-align: left; min-width: 160px; cursor: default; }
.ts-th-lg { text-align: left; cursor: default; }
.ts-th-num { text-align: right; min-width: 52px; }
.ts-th-num:hover { color: var(--text); }
.ts-th--active { color: var(--gold) !important; }
.sort-arrow { margin-left: 3px; font-size: 0.65rem; }

.ts-row td { padding: 8px 12px; border-bottom: 1px solid rgba(42,51,71,0.4); }
.ts-row:last-child td { border-bottom: none; }
.ts-row:hover td { background: var(--surface2); }
.ts-td-team { text-align: left; white-space: nowrap; font-weight: 500; }
.ts-td-lg { text-align: left; }
.ts-td-num { text-align: right; font-variant-numeric: tabular-nums; }
.ts-highlight { color: var(--gold); font-weight: 600; }

/* ── Players tab ── */
.players-wrap { display: flex; flex-direction: column; gap: 20px; }
.players-header { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.players-heading { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; margin: 0; }
.hr-view-toggle { display: flex; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.hr-toggle-btn { background: none; border: none; color: var(--muted); font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500; padding: 7px 16px; cursor: pointer; transition: color 0.15s, background 0.15s; }
.hr-toggle-btn.active { background: var(--surface); color: var(--gold); }

.hr-chart-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 16px; height: 420px; }
.hr-canvas { width: 100% !important; height: 100% !important; }

.hr-table-wrap { overflow-x: auto; }
.hr-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; min-width: 600px; }
.hr-table thead th { padding: 6px 10px; text-align: right; color: var(--muted); font-size: 0.68rem; font-weight: 500; border-bottom: 1px solid var(--border); white-space: nowrap; }
.hr-table thead th:first-child, .hr-th-name, .hr-th-team { text-align: left; }
.hr-row td { padding: 6px 10px; border-bottom: 1px solid rgba(42,51,71,0.4); text-align: right; font-variant-numeric: tabular-nums; vertical-align: middle; }
.hr-row:last-child td { border-bottom: none; }
.hr-row:hover td { background: var(--surface2); }
.hr-row--selected td { background: rgba(212,168,67,0.08) !important; }
.hr-row--selected .hr-name { color: var(--gold); font-weight: 700; }
.hr-row--dim td { opacity: 0.35; }
.hr-reset-btn { margin-left: 8px; color: var(--gold) !important; border: 1px solid rgba(212,168,67,0.3) !important; border-radius: 4px; }

/* ── 個人成績サブタブ ─── */
.players-section { padding-top: 4px; }
.pstat-tabs { display: flex; gap: 4px; margin-bottom: 24px; flex-wrap: wrap; }
.pstat-tab { background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-size: 0.8rem; font-weight: 500; padding: 6px 16px; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.pstat-tab:hover { color: var(--text); border-color: var(--muted); }
.pstat-tab--active { background: var(--gold); border-color: var(--gold); color: #0a0f1a; font-weight: 700; }

/* ── リーダーボード共通 ─── */
.leaders-wrap { }
.leaders-table-wrap { overflow-x: auto; }
.leaders-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; max-width: 640px; }
.leaders-table thead th { padding: 6px 12px; text-align: left; color: var(--muted); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.04em; border-bottom: 1px solid var(--border); }
.ld-th-val, .ld-val { text-align: right; font-variant-numeric: tabular-nums; }
.ld-row td { padding: 8px 12px; border-bottom: 1px solid rgba(42,51,71,0.3); vertical-align: middle; }
.ld-row:last-child td { border-bottom: none; }
.ld-row:hover td { background: var(--surface2); }
.ld-rank { color: var(--muted); font-size: 0.75rem; width: 36px; }
.ld-name { font-weight: 600; color: var(--text); }
.ld-team { color: var(--muted); font-size: 0.78rem; }
.ld-val { font-weight: 700; color: var(--gold); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.hr-rank { text-align: left !important; white-space: nowrap; vertical-align: middle; }
.hr-rank-inner { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 0.75rem; }
.hr-rank-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
.hr-name { text-align: left !important; white-space: nowrap; font-weight: 500; }
.hr-team { text-align: left !important; color: var(--muted); font-size: 0.73rem; white-space: nowrap; }
.hr-cell { color: var(--muted); }
.hr-cell--hot { color: var(--gold); font-weight: 700; }
.hr-total { font-family: 'Barlow Condensed', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--text); }
</style>
