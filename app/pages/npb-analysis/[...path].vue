<script setup lang="ts">
const route = useRoute();
const router = useRouter();
useHead({
  title: "NPB 野球分析 | movee",
  meta: [
    { property: "og:title", content: "NPB 野球分析 | movee" },
    { property: "og:description", content: "NPBリアルタイム順位表・チーム分析・勝率予測（セ・パ両リーグ）" },
    { property: "og:url", content: () => `https://www.movee.jp${route.path}` },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://www.movee.jp/npb-analysis.png" },
    { property: "og:image:width", content: "1254" },
    { property: "og:image:height", content: "1254" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "NPB 野球分析 | movee" },
    { name: "twitter:description", content: "NPBリアルタイム順位表・チーム分析・勝率予測（セ・パ両リーグ）" },
    { name: "twitter:image", content: "https://www.movee.jp/npb-analysis.png" },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap",
    },
  ],
});

// URL sync
const NPB_TABS = ["today", "standings", "predict", "analysis"];

const pathSegs = computed(() => (route.params.path as string[]) ?? []);

const npbCopied = ref(false);
function npbCopyLink() {
  navigator.clipboard.writeText(`https://www.movee.jp${route.path}`).then(() => {
    npbCopied.value = true;
    setTimeout(() => { npbCopied.value = false; }, 2000);
  });
}
function npbShareTwitter() {
  const text = encodeURIComponent("NPB野球分析 — 順位表・勝率予測");
  const url = encodeURIComponent(`https://www.movee.jp${route.path}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
}

function goToTab(tab: string) {
  router.replace(`/npb-analysis/${tab}`);
}

interface Competition {
  id: string;
  label: string;
  season: string;
}
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
  team: string;
  era: number | null;
  wins: number | null;
}
interface StandingsData {
  season: number;
  central: TeamStanding[];
  pacific: TeamStanding[];
  pitchers: Pitcher[];
}

const { data: compsData } = await useFetch<Competition[]>("/api/npb/competitions");
const competitions = computed(() => compsData.value ?? []);

// Initialize to first competition directly so watch fires immediately
const selectedComp = ref<Competition | null>(competitions.value[0] ?? null);
const standings = ref<StandingsData | null>(null);
const status = ref<"idle" | "pending" | "success" | "error">("idle");
const activeTab = computed<"today" | "standings" | "predict" | "analysis">(() => {
  const seg = pathSegs.value[0];
  return NPB_TABS.includes(seg) ? seg as any : "today";
});
const predTeamA = ref("");
const predTeamB = ref("");
const homeTeam = ref<"A" | "B">("A");
const predHomePitcher = ref("");
const predAwayPitcher = ref("");
const predHomeEra = ref("");
const predAwayEra = ref("");
const analysisTeam = ref("");

watch(selectedComp, async (comp) => {
  standings.value = null;
  predTeamA.value = "";
  predTeamB.value = "";
  predHomePitcher.value = "";
  predAwayPitcher.value = "";
  predHomeEra.value = "";
  predAwayEra.value = "";
  analysisTeam.value = "";
  if (!comp) return;
  status.value = "pending";
  try {
    standings.value = await $fetch<StandingsData>(`/api/npb/standings/${comp.season}`);
    status.value = "success";
    const cl = standings.value.central;
    const pl = standings.value.pacific;
    if (cl.length > 0) predTeamA.value = cl[0].team;
    if (pl.length > 0) predTeamB.value = pl[0].team;
    if (cl.length > 0) analysisTeam.value = cl[0].team;
  } catch {
    status.value = "error";
  }
}, { immediate: true });

const allTeams = computed(() => {
  if (!standings.value) return [];
  return [
    ...standings.value.central.map((t) => t.team),
    ...standings.value.pacific.map((t) => t.team),
  ];
});

function getTeam(name: string): TeamStanding | null {
  if (!standings.value) return null;
  return (
    standings.value.central.find((t) => t.team === name) ??
    standings.value.pacific.find((t) => t.team === name) ??
    null
  );
}

function log5(pA: number, pB: number): number {
  const d = pA + pB - 2 * pA * pB;
  if (d === 0) return 0.5;
  return (pA - pA * pB) / d;
}

const TIE_RATE = 0.028;
const HOME_BOOST = 0.03;
const NPB_LG_ERA = 3.80;

function calcProbs(
  pHome: number,
  pAway: number,
  homeEra?: number | null,
  awayEra?: number | null,
): { winH: number; tie: number; winA: number; eraAdjusted: boolean } {
  const base = log5(pHome || 0.5, pAway || 0.5);
  let adj = Math.min(0.92, Math.max(0.08, base + HOME_BOOST));

  const fH = homeEra && homeEra > 0 ? NPB_LG_ERA / homeEra : 1;
  const fA = awayEra && awayEra > 0 ? NPB_LG_ERA / awayEra : 1;
  const eraAdjusted = fH !== 1 || fA !== 1;

  if (eraAdjusted) {
    const nH = adj * fH;
    const nA = (1 - adj) * fA;
    const total = nH + nA;
    if (total > 0) adj = Math.min(0.95, Math.max(0.05, nH / total));
  }

  return {
    winH: +(adj * (1 - TIE_RATE)).toFixed(4),
    tie: TIE_RATE,
    winA: +((1 - adj) * (1 - TIE_RATE)).toFixed(4),
    eraAdjusted,
  };
}

const prediction = computed(() => {
  const tA = getTeam(predTeamA.value);
  const tB = getTeam(predTeamB.value);
  if (!tA || !tB || predTeamA.value === predTeamB.value) return null;
  const isAHome = homeTeam.value === "A";
  const tHome = isAHome ? tA : tB;
  const tAway = isAHome ? tB : tA;
  const homePitcherKey = isAHome ? predHomePitcher.value : predAwayPitcher.value;
  const awayPitcherKey = isAHome ? predAwayPitcher.value : predHomePitcher.value;
  const homeEraInput = isAHome ? predHomeEra.value : predAwayEra.value;
  const awayEraInput = isAHome ? predAwayEra.value : predHomeEra.value;
  const homeEraVal = effectiveEra(homePitcherKey, tHome.team, homeEraInput);
  const awayEraVal = effectiveEra(awayPitcherKey, tAway.team, awayEraInput);
  const { winH, tie, winA, eraAdjusted } = calcProbs(tHome.pct, tAway.pct, homeEraVal, awayEraVal);
  return {
    tHome, tAway, isAHome,
    winHome: winH, tie, winAway: winA, eraAdjusted,
    homeEraVal, awayEraVal,
    homePitcherName: homePitcherKey && homePitcherKey !== "custom" ? homePitcherKey : null,
    awayPitcherName: awayPitcherKey && awayPitcherKey !== "custom" ? awayPitcherKey : null,
  };
});

const analysisData = computed(() => {
  const t = getTeam(analysisTeam.value);
  if (!t) return null;
  const hG = t.homeW + t.homeL;
  const aG = t.awayW + t.awayL;
  return {
    t,
    homePct: hG > 0 ? t.homeW / hG : 0,
    awayPct: aG > 0 ? t.awayW / aG : 0,
    homeRecord: `${t.homeW}-${t.homeL}${t.homeT ? `-${t.homeT}` : ""}`,
    awayRecord: `${t.awayW}-${t.awayL}${t.awayT ? `-${t.awayT}` : ""}`,
  };
});

// ── Pitcher helpers ──
function teamPitchers(teamName: string): Pitcher[] {
  return (standings.value?.pitchers ?? []).filter((p) => p.team === teamName);
}
function pitcherEra(pitcherName: string, teamName: string): number | null {
  if (!pitcherName || pitcherName === "custom") return null;
  return teamPitchers(teamName).find((p) => p.name === pitcherName)?.era ?? null;
}
function pitcherNeedsManualEra(pitcherName: string, teamName: string): boolean {
  if (!pitcherName || pitcherName === "custom") return pitcherName === "custom";
  const p = teamPitchers(teamName).find((q) => q.name === pitcherName);
  return !!p && p.era === null;
}
function effectiveEra(pitcherName: string, teamName: string, manualEra: string): number | null {
  const fromPitcher = pitcherEra(pitcherName, teamName);
  if (fromPitcher !== null) return fromPitcher;
  const manual = parseFloat(manualEra);
  return isNaN(manual) ? null : manual;
}
function pitcherLabel(p: Pitcher): string {
  if (p.era !== null) return `${p.name}（ERA ${p.era.toFixed(2)}）`;
  if (p.wins !== null) return `${p.name}（${p.wins}勝）`;
  return p.name;
}

// ── Today's games ──
interface GameSlot {
  id: number;
  home: string;
  away: string;
  homePitcher: string;
  awayPitcher: string;
  homeEra: string;
  awayEra: string;
}

let nextId = 1;
function blankSlot(id: number): GameSlot {
  return { id, home: "", away: "", homePitcher: "", awayPitcher: "", homeEra: "", awayEra: "" };
}
const todayGames = ref<GameSlot[]>([
  blankSlot(nextId++),
  blankSlot(nextId++),
  blankSlot(nextId++),
]);

function addGame() {
  if (todayGames.value.length < 6) todayGames.value.push(blankSlot(nextId++));
}
function removeGame(id: number) {
  todayGames.value = todayGames.value.filter((g) => g.id !== id);
}

function predictGame(home: string, away: string, hEra?: number | null, aEra?: number | null) {
  const tH = getTeam(home);
  const tA = getTeam(away);
  if (!tH || !tA || home === away) return null;
  return { tH, tA, ...calcProbs(tH.pct, tA.pct, hEra ?? null, aEra ?? null) };
}

// Prefill today's games when standings load
watch(standings, (s) => {
  if (!s) return;
  const cl = s.central.map((t) => t.team);
  const pl = s.pacific.map((t) => t.team);
  const defaults: [string, string][] = [
    [cl[0] ?? "", pl[0] ?? ""],
    [pl[1] ?? "", cl[1] ?? ""],
    [cl[2] ?? "", pl[2] ?? ""],
  ];
  todayGames.value = defaults.map(([home, away], i) => blankSlot(i + 1));
  todayGames.value.forEach((g, i) => {
    g.home = defaults[i][0];
    g.away = defaults[i][1];
  });
  nextId = 4;
});

function fmtPct(p: number): string {
  return p.toFixed(3).replace(/^0/, "");
}
function fmtGb(n: number | null): string {
  if (n === null) return "—";
  const w = Math.floor(n);
  return n % 1 !== 0 ? `${w}½` : String(n);
}
function barW(p: number): number {
  return Math.round(p * 100);
}

const todayPredictions = computed(() =>
  todayGames.value.map((g) => ({
    game: g,
    pred: g.home && g.away && g.home !== g.away
      ? predictGame(
          g.home, g.away,
          effectiveEra(g.homePitcher, g.home, g.homeEra),
          effectiveEra(g.awayPitcher, g.away, g.awayEra),
        )
      : null,
  })),
);

function todayLabel(): string {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

const tabs = [
  { id: "today", label: "今日の予測" },
  { id: "standings", label: "順位表" },
  { id: "predict", label: "1試合予測" },
  { id: "analysis", label: "チーム分析" },
] as const;
</script>

<template>
  <div class="npb">
    <header class="npb-header">
      <div class="header-left">
        <span class="ball-icon" aria-hidden="true">⚾</span>
        <div class="header-titles">
          <h1 class="page-title">NPB 野球分析 <a class="by-movee" href="https://www.movee.jp" target="_blank" rel="noopener">by （株）movee</a></h1>
          <p class="page-sub">順位表・試合予測・チーム分析</p>
        </div>
      </div>
      <div class="header-right">
        <select v-model="selectedComp" class="season-sel">
          <option :value="null" disabled>シーズンを選択</option>
          <option v-for="c in competitions" :key="c.id" :value="c">
            {{ c.label }}
          </option>
        </select>
        <div class="share-btns">
          <button class="share-btn" @click="npbCopyLink">{{ npbCopied ? '✓ コピー済み' : '🔗 コピー' }}</button>
          <button class="share-btn share-btn--x" @click="npbShareTwitter">𝕏</button>
        </div>
      </div>
    </header>

    <main class="npb-main">
      <!-- Idle / Loading / Error -->
      <div
        v-if="status === 'idle' || status === 'pending'"
        class="state-view"
      >
        <div v-if="status === 'pending'" class="spinner" aria-label="読み込み中" />
        <p class="state-msg">
          {{ status === "pending" ? "データを取得中..." : "シーズンを選択してください" }}
        </p>
      </div>

      <div v-else-if="status === 'error'" class="state-view state-error">
        <p class="state-msg">データの取得に失敗しました。しばらく後に再試行してください。</p>
      </div>

      <template v-else-if="standings">
        <!-- Tab navigation -->
        <nav class="tab-nav" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :class="['tab-btn', { 'tab-btn--active': activeTab === tab.id }]"
            @click="goToTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>

        <!-- ====== TODAY'S GAMES ====== -->
        <section v-if="activeTab === 'today'" class="pane">
          <div class="today-wrap">
            <div class="today-header">
              <h2 class="today-date">{{ todayLabel() }} の試合予測</h2>
              <p class="today-sub">ホームチームと対戦相手を選択すると勝率が計算されます</p>
            </div>

            <div class="today-grid">
              <div
                v-for="{ game, pred } in todayPredictions"
                :key="game.id"
                class="game-card"
              >
                <button
                  class="game-card-remove"
                  @click="removeGame(game.id)"
                  aria-label="削除"
                >×</button>

                <div class="game-selectors">
                  <div class="game-team-col">
                    <span class="game-team-tag home-tag-label">🏟 ホーム</span>
                    <select v-model="game.home" class="game-sel">
                      <option value="" disabled>チームを選択</option>
                      <optgroup label="セントラル・リーグ">
                        <option v-for="t in standings.central" :key="t.team" :value="t.team">{{ t.team }}</option>
                      </optgroup>
                      <optgroup label="パシフィック・リーグ">
                        <option v-for="t in standings.pacific" :key="t.team" :value="t.team">{{ t.team }}</option>
                      </optgroup>
                    </select>
                  </div>

                  <span class="game-vs">VS</span>

                  <div class="game-team-col">
                    <span class="game-team-tag away-tag-label">✈ ビジター</span>
                    <select v-model="game.away" class="game-sel">
                      <option value="" disabled>チームを選択</option>
                      <optgroup label="セントラル・リーグ">
                        <option v-for="t in standings.central" :key="t.team" :value="t.team">{{ t.team }}</option>
                      </optgroup>
                      <optgroup label="パシフィック・リーグ">
                        <option v-for="t in standings.pacific" :key="t.team" :value="t.team">{{ t.team }}</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div v-if="pred" class="game-result">
                  <div class="game-prob-row">
                    <span class="game-team-name">{{ pred.tH.team }}</span>
                    <span class="game-pct game-pct--home">{{ Math.round(pred.winH * 100) }}%</span>
                    <div class="game-bar">
                      <div class="game-bar-h" :style="{ width: barW(pred.winH) + '%' }" />
                      <div class="game-bar-tie" :style="{ width: barW(pred.tie) + '%' }" />
                      <div class="game-bar-a" :style="{ width: barW(pred.winA) + '%' }" />
                    </div>
                    <span class="game-pct game-pct--away">{{ Math.round(pred.winA * 100) }}%</span>
                    <span class="game-team-name game-team-name--right">{{ pred.tA.team }}</span>
                  </div>
                  <div class="game-meta-row">
                    <span class="game-meta">勝率 {{ fmtPct(pred.tH.pct) }} | {{ pred.tH.wins }}-{{ pred.tH.losses }}</span>
                    <span class="game-tie-pct">引 {{ Math.round(pred.tie * 100) }}%</span>
                    <span class="game-meta game-meta--right">勝率 {{ fmtPct(pred.tA.pct) }} | {{ pred.tA.wins }}-{{ pred.tA.losses }}</span>
                  </div>
                </div>
                <div v-else class="game-empty">
                  チームを選択してください
                </div>
              </div>
            </div>

            <button
              v-if="todayGames.length < 6"
              class="add-game-btn"
              @click="addGame"
            >
              + 試合を追加
            </button>

            <p class="today-note">
              ※ log5公式（勝率ベース）＋ホームアドバンテージ(+3%)による予測です
            </p>
          </div>
        </section>

        <!-- ====== STANDINGS ====== -->
        <section v-if="activeTab === 'standings'" class="pane">
          <div class="leagues">
            <div
              v-for="({ teams, name, key }) in [
                { teams: standings.central, name: 'セントラル・リーグ', key: 'cl' },
                { teams: standings.pacific, name: 'パシフィック・リーグ', key: 'pl' },
              ]"
              :key="key"
              class="league-block"
            >
              <h2 class="league-name" :class="`league-name--${key}`">{{ name }}</h2>
              <div class="tbl-wrap">
                <table class="stbl">
                  <thead>
                    <tr>
                      <th class="th-pos">順位</th>
                      <th class="th-team">チーム</th>
                      <th class="th-n">試</th>
                      <th class="th-n">勝</th>
                      <th class="th-n">負</th>
                      <th class="th-n">分</th>
                      <th class="th-n">勝率</th>
                      <th class="th-n">GB</th>
                      <th class="th-rec">本拠地</th>
                      <th class="th-rec">ビジター</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="t in teams"
                      :key="t.team"
                      :class="[
                        'srow',
                        { 'srow--pennant': t.pennant, 'srow--cs': !t.pennant && t.pos <= 3 },
                      ]"
                    >
                      <td class="td-pos">
                        <span :class="['pos-num', { 'pos-num--1': t.pos === 1 }]">{{ t.pos }}</span>
                      </td>
                      <td class="td-team">
                        {{ t.team }}
                        <span v-if="t.pennant" class="badge bdg-pennant">優勝</span>
                        <span v-else-if="t.pos <= 3" class="badge bdg-cs">CS</span>
                      </td>
                      <td class="td-n">{{ t.games }}</td>
                      <td class="td-n td-bold">{{ t.wins }}</td>
                      <td class="td-n">{{ t.losses }}</td>
                      <td class="td-n td-muted">{{ t.ties }}</td>
                      <td class="td-n td-bold td-accent">{{ fmtPct(t.pct) }}</td>
                      <td class="td-n">{{ fmtGb(t.gb) }}</td>
                      <td class="td-rec">
                        {{ t.homeW }}-{{ t.homeL }}<span v-if="t.homeT">-{{ t.homeT }}</span>
                      </td>
                      <td class="td-rec">
                        {{ t.awayW }}-{{ t.awayL }}<span v-if="t.awayT">-{{ t.awayT }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p class="legend">
            <span class="badge bdg-pennant">優勝</span> リーグ優勝
            <span class="badge bdg-cs">CS</span> クライマックスシリーズ進出（上位3チーム）
          </p>
        </section>

        <!-- ====== PREDICTION ====== -->
        <section v-if="activeTab === 'predict'" class="pane">
          <div class="pred-wrap">
            <div class="pred-selectors">
              <div class="sel-group">
                <label class="sel-label">チームA</label>
                <select v-model="predTeamA" class="team-sel">
                  <optgroup label="セントラル・リーグ">
                    <option v-for="t in standings.central" :key="t.team" :value="t.team">{{ t.team }}</option>
                  </optgroup>
                  <optgroup label="パシフィック・リーグ">
                    <option v-for="t in standings.pacific" :key="t.team" :value="t.team">{{ t.team }}</option>
                  </optgroup>
                </select>
              </div>

              <span class="vs-label">VS</span>

              <div class="sel-group">
                <label class="sel-label">チームB</label>
                <select v-model="predTeamB" class="team-sel">
                  <optgroup label="セントラル・リーグ">
                    <option v-for="t in standings.central" :key="t.team" :value="t.team">{{ t.team }}</option>
                  </optgroup>
                  <optgroup label="パシフィック・リーグ">
                    <option v-for="t in standings.pacific" :key="t.team" :value="t.team">{{ t.team }}</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div class="home-row">
              <span class="sel-label">ホームチーム</span>
              <label class="radio-lbl">
                <input type="radio" v-model="homeTeam" value="A" />
                <span>チームA ({{ predTeamA || "—" }})</span>
              </label>
              <label class="radio-lbl">
                <input type="radio" v-model="homeTeam" value="B" />
                <span>チームB ({{ predTeamB || "—" }})</span>
              </label>
            </div>

            <template v-if="prediction">
              <div class="pred-card">
                <!-- Team headers -->
                <div class="pred-teams-row">
                  <div class="pred-team-box">
                    <p class="pred-tname">{{ prediction.tHome.team }}</p>
                    <p class="pred-tstat">{{ prediction.tHome.wins }}勝 {{ prediction.tHome.losses }}敗</p>
                    <p class="pred-tstat">勝率 {{ fmtPct(prediction.tHome.pct) }}</p>
                    <span class="home-pill">🏟 ホーム</span>
                  </div>
                  <div class="pred-pcts">
                    <span class="pred-pct-a">{{ Math.round(prediction.winHome * 100) }}<small>%</small></span>
                    <span class="pred-pct-tie">{{ Math.round(prediction.tie * 100) }}<small>%</small><br /><small class="tie-word">引分</small></span>
                    <span class="pred-pct-b">{{ Math.round(prediction.winAway * 100) }}<small>%</small></span>
                  </div>
                  <div class="pred-team-box pred-team-box--right">
                    <p class="pred-tname">{{ prediction.tAway.team }}</p>
                    <p class="pred-tstat">{{ prediction.tAway.wins }}勝 {{ prediction.tAway.losses }}敗</p>
                    <p class="pred-tstat">勝率 {{ fmtPct(prediction.tAway.pct) }}</p>
                    <span class="away-pill">✈ ビジター</span>
                  </div>
                </div>

                <!-- Probability bar -->
                <div class="prob-bar">
                  <div class="prob-seg prob-seg--a" :style="{ width: barW(prediction.winHome) + '%' }" />
                  <div class="prob-seg prob-seg--tie" :style="{ width: barW(prediction.tie) + '%' }" />
                  <div class="prob-seg prob-seg--b" :style="{ width: barW(prediction.winAway) + '%' }" />
                </div>
                <div class="prob-bar-labels">
                  <span>{{ prediction.tHome.team }}の勝利</span>
                  <span>引き分け</span>
                  <span>{{ prediction.tAway.team }}の勝利</span>
                </div>

                <!-- Stats comparison grid -->
                <div class="cmp-grid">
                  <div class="cmp-row">
                    <span class="cmp-a">{{ prediction.tHome.wins }}-{{ prediction.tHome.losses }}</span>
                    <span class="cmp-lbl">今季成績</span>
                    <span class="cmp-b">{{ prediction.tAway.wins }}-{{ prediction.tAway.losses }}</span>
                  </div>
                  <div class="cmp-row">
                    <span class="cmp-a">{{ prediction.tHome.homeW }}-{{ prediction.tHome.homeL }}</span>
                    <span class="cmp-lbl">本拠地</span>
                    <span class="cmp-b">{{ prediction.tAway.homeW }}-{{ prediction.tAway.homeL }}</span>
                  </div>
                  <div class="cmp-row">
                    <span class="cmp-a">{{ prediction.tHome.awayW }}-{{ prediction.tHome.awayL }}</span>
                    <span class="cmp-lbl">ビジター</span>
                    <span class="cmp-b">{{ prediction.tAway.awayW }}-{{ prediction.tAway.awayL }}</span>
                  </div>
                  <div class="cmp-row">
                    <span class="cmp-a">{{ fmtGb(prediction.tHome.gb) }}</span>
                    <span class="cmp-lbl">ゲーム差</span>
                    <span class="cmp-b">{{ fmtGb(prediction.tAway.gb) }}</span>
                  </div>
                  <div class="cmp-row">
                    <span class="cmp-a">{{ prediction.tHome.pos }}位</span>
                    <span class="cmp-lbl">リーグ順位</span>
                    <span class="cmp-b">{{ prediction.tAway.pos }}位</span>
                  </div>
                </div>

                <p class="pred-note">※ log5公式＋ホームアドバンテージ(+3%)</p>
              </div>
            </template>

            <div v-else class="pred-empty">
              異なる2チームを選択してください
            </div>
          </div>
        </section>

        <!-- ====== ANALYSIS ====== -->
        <section v-if="activeTab === 'analysis'" class="pane">
          <div class="analysis-wrap">
            <div class="sel-group">
              <label class="sel-label">チームを選択</label>
              <select v-model="analysisTeam" class="team-sel">
                <optgroup label="セントラル・リーグ">
                  <option v-for="t in standings.central" :key="t.team" :value="t.team">
                    {{ t.team }}
                  </option>
                </optgroup>
                <optgroup label="パシフィック・リーグ">
                  <option v-for="t in standings.pacific" :key="t.team" :value="t.team">
                    {{ t.team }}
                  </option>
                </optgroup>
              </select>
            </div>

            <template v-if="analysisData">
              <!-- Team summary card -->
              <div class="ana-card">
                <h3 class="ana-team-name">{{ analysisData.t.team }}</h3>
                <div class="ana-bars">
                  <div class="ana-bar-item">
                    <div class="ana-bar-meta">
                      <span class="ana-bar-label">シーズン全体</span>
                      <span class="ana-bar-record">{{ analysisData.t.wins }}-{{ analysisData.t.losses }}-{{ analysisData.t.ties }}</span>
                    </div>
                    <div class="ana-track">
                      <div class="ana-fill ana-fill--total" :style="{ width: barW(analysisData.t.pct) + '%' }" />
                    </div>
                    <span class="ana-pct-val">勝率 {{ fmtPct(analysisData.t.pct) }}</span>
                  </div>
                  <div class="ana-bar-item">
                    <div class="ana-bar-meta">
                      <span class="ana-bar-label">🏟 本拠地</span>
                      <span class="ana-bar-record">{{ analysisData.homeRecord }}</span>
                    </div>
                    <div class="ana-track">
                      <div class="ana-fill ana-fill--home" :style="{ width: barW(analysisData.homePct) + '%' }" />
                    </div>
                    <span class="ana-pct-val">勝率 {{ fmtPct(analysisData.homePct) }}</span>
                  </div>
                  <div class="ana-bar-item">
                    <div class="ana-bar-meta">
                      <span class="ana-bar-label">✈ ビジター</span>
                      <span class="ana-bar-record">{{ analysisData.awayRecord }}</span>
                    </div>
                    <div class="ana-track">
                      <div class="ana-fill ana-fill--away" :style="{ width: barW(analysisData.awayPct) + '%' }" />
                    </div>
                    <span class="ana-pct-val">勝率 {{ fmtPct(analysisData.awayPct) }}</span>
                  </div>
                </div>

                <div class="diff-chips">
                  <div class="diff-chip">
                    <span class="diff-chip-lbl">本拠地優位性</span>
                    <span
                      class="diff-chip-val"
                      :class="{
                        'diff-pos': analysisData.homePct > analysisData.awayPct,
                        'diff-neg': analysisData.homePct < analysisData.awayPct,
                      }"
                    >
                      {{ analysisData.homePct >= analysisData.awayPct ? "+" : "" }}{{ ((analysisData.homePct - analysisData.awayPct) * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="diff-chip">
                    <span class="diff-chip-lbl">順位</span>
                    <span class="diff-chip-val">{{ analysisData.t.pos }}位</span>
                  </div>
                  <div class="diff-chip">
                    <span class="diff-chip-lbl">ゲーム差</span>
                    <span class="diff-chip-val">{{ fmtGb(analysisData.t.gb) }}</span>
                  </div>
                  <div class="diff-chip">
                    <span class="diff-chip-lbl">試合数</span>
                    <span class="diff-chip-val">{{ analysisData.t.games }}</span>
                  </div>
                </div>
              </div>

              <!-- All-teams comparison chart -->
              <div class="cmp-chart-section">
                <h3 class="cmp-chart-title">全チーム 本拠地 vs ビジター 勝率</h3>
                <div class="cmp-chart-grid">
                  <div
                    v-for="({ name, teams }) in [
                      { name: 'セントラル', teams: standings.central },
                      { name: 'パシフィック', teams: standings.pacific },
                    ]"
                    :key="name"
                    class="cmp-chart-col"
                  >
                    <h4 class="cmp-chart-league">{{ name }}</h4>
                    <div
                      v-for="t in teams"
                      :key="t.team"
                      :class="['cmp-team-row', { 'cmp-team-row--active': t.team === analysisTeam }]"
                    >
                      <span class="cmp-tname">{{ t.team }}</span>
                      <div class="cmp-bars">
                        <div class="cmp-bar-row">
                          <span class="cmp-bar-tag">本</span>
                          <div class="cmp-bar-track">
                            <div
                              class="cmp-bar-fill cmp-bar-fill--home"
                              :style="{ width: barW(t.homeW + t.homeL > 0 ? t.homeW / (t.homeW + t.homeL) : 0) + '%' }"
                            />
                          </div>
                          <span class="cmp-bar-pct">{{ fmtPct(t.homeW + t.homeL > 0 ? t.homeW / (t.homeW + t.homeL) : 0) }}</span>
                        </div>
                        <div class="cmp-bar-row">
                          <span class="cmp-bar-tag">訪</span>
                          <div class="cmp-bar-track">
                            <div
                              class="cmp-bar-fill cmp-bar-fill--away"
                              :style="{ width: barW(t.awayW + t.awayL > 0 ? t.awayW / (t.awayW + t.awayL) : 0) + '%' }"
                            />
                          </div>
                          <span class="cmp-bar-pct">{{ fmtPct(t.awayW + t.awayL > 0 ? t.awayW / (t.awayW + t.awayL) : 0) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
/* ── Tokens ── */
:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface2: #21262d;
  --border: #30363d;
  --text: #e6edf3;
  --muted: #7d8590;
  --accent: #d4a843;
  --accent-lo: rgba(212, 168, 67, 0.15);
  --cl: #58a6ff;
  --pl: #f78166;
  --win: #3fb950;
  --loss: #f85149;
  --radius: 8px;
}

/* ── Page shell ── */
.npb {
  font-family: "Noto Sans JP", system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* ── Header ── */
.npb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-wrap: wrap;
}
.header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.share-btns { display: flex; gap: 6px; }
.share-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.73rem; padding: 5px 10px; border-radius: 16px; cursor: pointer; transition: color 0.15s, border-color 0.15s; white-space: nowrap; }
.share-btn:hover { color: var(--text); border-color: var(--accent); }
.share-btn--x { border-color: #1da1f2; color: #1da1f2; }
.share-btn--x:hover { background: rgba(29,161,242,0.1); }
.by-movee { font-size: 0.5em; font-weight: 500; color: var(--muted); letter-spacing: 0.04em; text-decoration: none; vertical-align: middle; }
.by-movee:hover { color: var(--accent); text-decoration: underline; }
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.ball-icon {
  font-size: 28px;
  line-height: 1;
}
.page-title {
  font-family: "Barlow Condensed", "Noto Sans JP", sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--accent);
  margin: 0;
}
.page-sub {
  font-size: 0.78rem;
  color: var(--muted);
  margin: 2px 0 0;
  letter-spacing: 0.03em;
}

.season-sel {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 14px;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 160px;
}
.season-sel:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Main ── */
.npb-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

/* ── State views ── */
.state-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 24px;
  color: var(--muted);
}
.state-error { color: var(--loss); }
.state-msg { font-size: 0.95rem; }
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Tabs ── */
.tab-nav {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0;
}
.tab-btn {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.02em;
}
.tab-btn:hover { color: var(--text); }
.tab-btn--active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 700;
}

.pane { animation: fadein 0.2s ease; }
@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }

/* ── Mobile header ── */
@media (max-width: 640px) {
  .npb-header { padding: 10px 12px; gap: 8px; }
  .ball-icon { display: none; }
  .page-title { font-size: 1.1rem; }
  .page-sub { display: none; }
  .season-sel { min-width: auto; font-size: 0.82rem; padding: 6px 10px; }
  .tab-nav { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .tab-nav::-webkit-scrollbar { display: none; }
  .tab-btn { padding: 8px 12px; font-size: 0.8rem; flex-shrink: 0; white-space: nowrap; }
}

/* ── Standings ── */
.leagues {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 820px) {
  .leagues { grid-template-columns: 1fr; }
}

.league-block { display: flex; flex-direction: column; gap: 10px; }
.league-name {
  font-family: "Barlow Condensed", "Noto Sans JP", sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0;
}
.league-name--cl { color: var(--cl); }
.league-name--pl { color: var(--pl); }

.tbl-wrap { overflow-x: auto; }
.stbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  min-width: 480px;
}
.stbl th {
  padding: 8px 6px;
  text-align: right;
  font-weight: 500;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.th-pos, .th-team { text-align: left; }
.th-team { min-width: 140px; }
.th-n { min-width: 38px; }
.th-rec { min-width: 60px; }

.stbl td {
  padding: 9px 6px;
  text-align: right;
  border-bottom: 1px solid rgba(48, 54, 61, 0.6);
}
.td-pos, .td-team { text-align: left; }
.td-bold { font-weight: 700; }
.td-muted { color: var(--muted); }
.td-accent { color: var(--accent); }
.td-rec { font-family: "Barlow Condensed", monospace; letter-spacing: 0.02em; }

.srow:hover { background: var(--surface2); }
.srow--pennant { background: rgba(212, 168, 67, 0.07); }
.srow--cs { background: rgba(63, 185, 80, 0.04); }

.pos-num {
  font-family: "Barlow Condensed", monospace;
  font-weight: 700;
  font-size: 1rem;
  color: var(--muted);
}
.pos-num--1 { color: var(--accent); }

.badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 4px;
  vertical-align: middle;
  letter-spacing: 0.03em;
}
.bdg-pennant { background: var(--accent-lo); color: var(--accent); border: 1px solid var(--accent); }
.bdg-cs { background: rgba(63, 185, 80, 0.12); color: #3fb950; border: 1px solid rgba(63, 185, 80, 0.4); }

.legend {
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 16px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

/* ── Prediction ── */
.pred-wrap { display: flex; flex-direction: column; gap: 20px; }

.pred-selectors {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}
.sel-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
.sel-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.team-sel {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 9px 12px;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
}
.team-sel:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.vs-label {
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--border);
  padding-bottom: 8px;
  letter-spacing: 0.1em;
}

.home-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.radio-lbl {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.87rem;
  cursor: pointer;
  color: var(--muted);
}
.radio-lbl input { accent-color: var(--accent); }
.radio-lbl:has(input:checked) { color: var(--text); }

.pred-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pred-teams-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
}
.pred-team-box { display: flex; flex-direction: column; gap: 4px; }
.pred-team-box--right { text-align: right; align-items: flex-end; }
.pred-tname {
  font-family: "Barlow Condensed", "Noto Sans JP", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.pred-tstat { font-size: 0.8rem; color: var(--muted); margin: 0; }
.home-pill {
  display: inline-block;
  font-size: 0.7rem;
  background: var(--accent-lo);
  color: var(--accent);
  border: 1px solid rgba(212, 168, 67, 0.3);
  border-radius: 20px;
  padding: 2px 8px;
  margin-top: 4px;
}

.pred-pcts {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.pred-pct-a, .pred-pct-b {
  font-family: "Barlow Condensed", monospace;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
}
.pred-pct-a { color: var(--accent); }
.pred-pct-b { color: var(--cl); }
.pred-pct-a small, .pred-pct-b small { font-size: 1rem; }
.pred-pct-tie {
  font-family: "Barlow Condensed", monospace;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--muted);
  text-align: center;
  line-height: 1.2;
}
.tie-word { font-size: 0.7rem; }

.prob-bar {
  display: flex;
  height: 14px;
  border-radius: 7px;
  overflow: hidden;
  gap: 2px;
}
.prob-seg { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
.prob-seg--a { background: var(--accent); }
.prob-seg--tie { background: var(--border); }
.prob-seg--b { background: var(--cl); }

.prob-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.74rem;
  color: var(--muted);
}

/* Stats comparison */
.cmp-grid { display: flex; flex-direction: column; gap: 0; }
.cmp-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid rgba(48, 54, 61, 0.5);
}
.cmp-row:last-child { border-bottom: none; }
.cmp-a {
  font-family: "Barlow Condensed", monospace;
  font-weight: 700;
  font-size: 1rem;
  color: var(--accent);
}
.cmp-b {
  font-family: "Barlow Condensed", monospace;
  font-weight: 700;
  font-size: 1rem;
  color: var(--cl);
  text-align: right;
}
.cmp-lbl {
  font-size: 0.78rem;
  color: var(--muted);
  text-align: center;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.pred-note {
  font-size: 0.74rem;
  color: var(--muted);
  margin: 0;
}

.pred-empty {
  padding: 48px;
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}

/* ── Analysis ── */
.analysis-wrap { display: flex; flex-direction: column; gap: 24px; }

.ana-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ana-team-name {
  font-family: "Barlow Condensed", "Noto Sans JP", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0;
}
.ana-bars { display: flex; flex-direction: column; gap: 16px; }
.ana-bar-item { display: flex; flex-direction: column; gap: 6px; }
.ana-bar-meta { display: flex; justify-content: space-between; align-items: center; }
.ana-bar-label { font-size: 0.82rem; color: var(--muted); }
.ana-bar-record {
  font-family: "Barlow Condensed", monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
}
.ana-track {
  height: 10px;
  background: var(--surface2);
  border-radius: 5px;
  overflow: hidden;
}
.ana-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}
.ana-fill--total { background: var(--accent); }
.ana-fill--home { background: var(--win); }
.ana-fill--away { background: var(--cl); }
.ana-pct-val { font-size: 0.78rem; color: var(--muted); }

.diff-chips { display: flex; gap: 12px; flex-wrap: wrap; }
.diff-chip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 16px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  min-width: 90px;
}
.diff-chip-lbl { font-size: 0.72rem; color: var(--muted); letter-spacing: 0.03em; }
.diff-chip-val {
  font-family: "Barlow Condensed", monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
}
.diff-pos { color: var(--win); }
.diff-neg { color: var(--loss); }

/* All-teams comparison */
.cmp-chart-section { display: flex; flex-direction: column; gap: 14px; }
.cmp-chart-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin: 0;
}
.cmp-chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 680px) {
  .cmp-chart-grid { grid-template-columns: 1fr; }
  .pred-teams-row { grid-template-columns: 1fr; }
}

.cmp-chart-col { display: flex; flex-direction: column; gap: 4px; }
.cmp-chart-league {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 8px;
}

.cmp-team-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 5px;
}
.cmp-team-row--active {
  background: var(--accent-lo);
  border: 1px solid rgba(212, 168, 67, 0.25);
}
.cmp-tname { font-size: 0.8rem; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cmp-bars { display: flex; flex-direction: column; gap: 4px; }
.cmp-bar-row { display: flex; align-items: center; gap: 6px; }
.cmp-bar-tag { font-size: 0.68rem; color: var(--muted); width: 14px; flex-shrink: 0; }
.cmp-bar-track { flex: 1; height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
.cmp-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
.cmp-bar-fill--home { background: var(--win); }
.cmp-bar-fill--away { background: var(--cl); }
.cmp-bar-pct { font-family: "Barlow Condensed", monospace; font-size: 0.72rem; color: var(--muted); width: 30px; text-align: right; }

/* ── Today's predictions ── */
.today-wrap { display: flex; flex-direction: column; gap: 20px; }
.today-header { display: flex; flex-direction: column; gap: 4px; }
.today-date {
  font-family: "Barlow Condensed", "Noto Sans JP", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0;
}
.today-sub { font-size: 0.8rem; color: var(--muted); margin: 0; }

.today-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 14px;
}

.game-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
.game-card-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 3px;
}
.game-card-remove:hover { color: var(--loss); background: rgba(248, 81, 73, 0.1); }

.game-selectors {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 8px;
}
.game-team-col { display: flex; flex-direction: column; gap: 4px; }
.game-team-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.home-tag-label { color: var(--accent); }
.away-tag-label { color: var(--cl); }
.game-sel {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 7px 8px;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  width: 100%;
}
.game-sel:focus { outline: 2px solid var(--accent); outline-offset: 2px; }
.game-vs {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--border);
  padding-bottom: 4px;
  letter-spacing: 0.1em;
}

.game-result { display: flex; flex-direction: column; gap: 6px; }
.game-prob-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto 1fr;
  align-items: center;
  gap: 6px;
}
.game-team-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.game-team-name--right { text-align: right; }
.game-pct {
  font-family: "Barlow Condensed", monospace;
  font-size: 1.1rem;
  font-weight: 700;
  white-space: nowrap;
}
.game-pct--home { color: var(--accent); }
.game-pct--away { color: var(--cl); }
.game-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  width: 80px;
  flex-shrink: 0;
}
.game-bar-h { background: var(--accent); height: 100%; }
.game-bar-tie { background: var(--border); height: 100%; }
.game-bar-a { background: var(--cl); height: 100%; }

.game-meta-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--muted);
}
.game-meta--right { text-align: right; }
.game-tie-pct { text-align: center; white-space: nowrap; }

.game-empty {
  font-size: 0.78rem;
  color: var(--muted);
  text-align: center;
  padding: 12px 0 4px;
}

.add-game-btn {
  align-self: flex-start;
  background: var(--surface2);
  border: 1px dashed var(--border);
  color: var(--muted);
  padding: 10px 20px;
  border-radius: var(--radius);
  font-family: "Noto Sans JP", sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.add-game-btn:hover { color: var(--accent); border-color: var(--accent); }

.today-note { font-size: 0.74rem; color: var(--muted); margin: 0; }

/* ── ERA inputs ── */
.era-input-row { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
.era-label { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.03em; }
.era-input {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 7px 10px;
  border-radius: 5px;
  font-family: "Barlow Condensed", monospace;
  font-size: 0.9rem;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
}
.era-input:focus { outline: 2px solid var(--accent); outline-offset: 2px; }
.era-input::placeholder { color: var(--muted); font-size: 0.8rem; }

.era-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: rgba(212, 168, 67, 0.08);
  border: 1px solid rgba(212, 168, 67, 0.25);
  border-radius: 5px;
}
.era-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.era-badge-detail {
  font-size: 0.72rem;
  color: var(--muted);
}

.away-pill {
  display: inline-block;
  font-size: 0.7rem;
  background: rgba(88, 166, 255, 0.1);
  color: var(--cl);
  border: 1px solid rgba(88, 166, 255, 0.3);
  border-radius: 20px;
  padding: 2px 8px;
  margin-top: 4px;
}

.cmp-era-good { color: var(--win) !important; }
.cmp-era-bad { color: var(--loss) !important; }

/* Game card ERA input */
.game-era-input {
  background: var(--surface2);
  border: 1px solid rgba(48, 54, 61, 0.7);
  color: var(--text);
  padding: 5px 8px;
  border-radius: 4px;
  font-family: "Barlow Condensed", monospace;
  font-size: 0.82rem;
  width: 100%;
  margin-top: 4px;
  -webkit-appearance: none;
  appearance: none;
}
.game-era-input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.game-era-input::placeholder { color: var(--muted); font-size: 0.75rem; }

.game-era-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(212, 168, 67, 0.1);
  border: 1px solid rgba(212, 168, 67, 0.25);
  border-radius: 3px;
  padding: 1px 6px;
  margin-bottom: 4px;
  letter-spacing: 0.02em;
}
</style>
