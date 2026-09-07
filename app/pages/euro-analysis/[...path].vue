<script setup lang="ts">
const route = useRoute();
const router = useRouter();
useHead({
  title: "Euro Football Analysis | movee",
  meta: [
    { property: "og:title", content: "Euro Football Analysis | movee" },
    { property: "og:description", content: "プレミアリーグ・ラ・リーガ等ヨーロッパサッカー6リーグの順位・ポアソンモデル予測・得点ランキング" },
    { property: "og:url", content: () => `https://www.movee.jp${route.path}` },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://www.movee.jp/euro-analysis.png" },
    { property: "og:image:width", content: "1254" },
    { property: "og:image:height", content: "1254" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Euro Football Analysis | movee" },
    { name: "twitter:description", content: "プレミアリーグ・ラ・リーガ等6リーグ順位・ポアソン勝率予測" },
    { name: "twitter:image", content: "https://www.movee.jp/euro-analysis.png" },
  ],
});

const euroCopied = ref(false);
function euroCopyLink() {
  navigator.clipboard.writeText(`https://www.movee.jp${route.path}`).then(() => {
    euroCopied.value = true;
    setTimeout(() => { euroCopied.value = false; }, 2000);
  });
}
function euroShareTwitter() {
  const text = encodeURIComponent("ヨーロッパサッカー分析 — 順位表・ポアソン予測");
  const url = encodeURIComponent(`https://www.movee.jp${route.path}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
}

// ── Types ──────────────────────────────────────────────────────────────────
interface EuroTeam {
  id: number; name: string; shortName: string; crest: string;
  position: number; played: number; won: number; draw: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDiff: number; points: number;
  form: string; attackStrength: number; defenseStrength: number;
}
interface StandingsData { competition: string; season: number; teams: EuroTeam[]; leagueAvgGoals: number }
interface EuroMatch {
  id: number; utcDate: string; status: string; matchday: number;
  homeTeam: { id: number; name: string; shortName: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; crest: string };
  homeScore: number | null; awayScore: number | null;
}
interface MatchesData { nextMatchday: number | null; nextRound: EuroMatch[]; recent: EuroMatch[] }
interface Scorer { name: string; nationality: string; team: string; teamCrest: string; goals: number; assists: number | null; penalties: number | null; played: number | null }
interface Prediction { homeWin: number; draw: number; awayWin: number; homeXG: number; awayXG: number; likelyScore: string }

// ── Leagues ────────────────────────────────────────────────────────────────
const LEAGUES = [
  { code: "PL",  name: "プレミアリーグ",    country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "PD",  name: "ラ・リーガ",         country: "🇪🇸" },
  { code: "BL1", name: "ブンデスリーガ",     country: "🇩🇪" },
  { code: "SA",  name: "セリエA",            country: "🇮🇹" },
  { code: "FL1", name: "リーグ・アン",       country: "🇫🇷" },
  { code: "CL",  name: "チャンピオンズリーグ", country: "🇪🇺" },
];

// ── URL sync ───────────────────────────────────────────────────────────────

const VALID_LEAGUES = ["PL", "PD", "BL1", "SA", "FL1", "CL"];
const VALID_TABS = ["standings", "matches", "predict", "scorers"];

const pathSegs = computed(() => (route.params.path as string[]) ?? []);

// ── State ──────────────────────────────────────────────────────────────────
const activeLeague = computed(() => {
  const seg = pathSegs.value[0]?.toUpperCase();
  return VALID_LEAGUES.includes(seg) ? seg : "PL";
});
const activeTab = computed<"standings" | "matches" | "predict" | "scorers">(() => {
  const seg = pathSegs.value[1];
  return VALID_TABS.includes(seg) ? seg as any : "standings";
});

function goToLeague(code: string) {
  router.replace(`/euro-analysis/${code.toLowerCase()}`);
}
function goToTab(tab: string) {
  router.replace(`/euro-analysis/${activeLeague.value.toLowerCase()}/${tab}`);
}

const standings = ref<StandingsData | null>(null);
const standingsLoading = ref(false);

const matchesData = ref<MatchesData | null>(null);
const matchesLoading = ref(false);

const scorers = ref<Scorer[]>([]);
const scorersLoading = ref(false);
const scorersLoaded = ref(false);

// Predict tab
const predHome = ref("");
const predAway = ref("");

// ── Data fetch ─────────────────────────────────────────────────────────────
async function load(league: string) {
  standings.value = null;
  matchesData.value = null;
  scorers.value = [];
  scorersLoaded.value = false;

  standingsLoading.value = true;
  matchesLoading.value = true;

  const [s, m] = await Promise.all([
    $fetch<StandingsData>(`/api/euro/standings/${league}`).finally(() => { standingsLoading.value = false }),
    $fetch<MatchesData>(`/api/euro/matches/${league}`).finally(() => { matchesLoading.value = false }),
  ]);
  standings.value = s;
  matchesData.value = m;
}

watch(activeLeague, (lg) => {
  predHome.value = "";
  predAway.value = "";
  scorersLoaded.value = false;
  load(lg);
}, { immediate: true });

watch(activeTab, (tab) => {
  if (tab === "scorers" && !scorersLoaded.value) {
    scorersLoading.value = true;
    $fetch<Scorer[]>(`/api/euro/scorers/${activeLeague.value}`)
      .then((d) => { scorers.value = d; scorersLoaded.value = true; })
      .finally(() => { scorersLoading.value = false; });
  }
});

// ── Poisson prediction ─────────────────────────────────────────────────────
function poisson(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 1; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function predictMatch(home: EuroTeam, away: EuroTeam, avg: number): Prediction {
  // Home advantage: ~12% boost to home expected goals
  const homeXG = avg * home.attackStrength * away.defenseStrength * 1.12;
  const awayXG = avg * away.attackStrength * home.defenseStrength * 0.88;

  const MAX = 8;
  let homeWin = 0, draw = 0, awayWin = 0;
  let bestP = 0, likelyScore = "1-0";

  for (let h = 0; h <= MAX; h++) {
    for (let a = 0; a <= MAX; a++) {
      const p = poisson(h, homeXG) * poisson(a, awayXG);
      if (h > a) homeWin += p;
      else if (h === a) draw += p;
      else awayWin += p;
      if (p > bestP) { bestP = p; likelyScore = `${h}-${a}`; }
    }
  }

  const total = homeWin + draw + awayWin;
  return {
    homeWin: +(homeWin / total).toFixed(3),
    draw: +(draw / total).toFixed(3),
    awayWin: +(awayWin / total).toFixed(3),
    homeXG: +homeXG.toFixed(2),
    awayXG: +awayXG.toFixed(2),
    likelyScore,
  };
}

// ── Computed ───────────────────────────────────────────────────────────────
const teamMap = computed(() => {
  const m = new Map<number, EuroTeam>();
  for (const t of standings.value?.teams ?? []) m.set(t.id, t);
  return m;
});

const nextRoundPreds = computed(() => {
  if (!matchesData.value || !standings.value) return [];
  const avg = standings.value.leagueAvgGoals;
  return matchesData.value.nextRound.map((match) => {
    const home = teamMap.value.get(match.homeTeam.id);
    const away = teamMap.value.get(match.awayTeam.id);
    const pred = home && away ? predictMatch(home, away, avg) : null;
    return { match, pred };
  });
});

const singlePred = computed((): Prediction | null => {
  if (!predHome.value || !predAway.value || predHome.value === predAway.value) return null;
  if (!standings.value) return null;
  const home = standings.value.teams.find((t) => t.name === predHome.value);
  const away = standings.value.teams.find((t) => t.name === predAway.value);
  if (!home || !away) return null;
  return predictMatch(home, away, standings.value.leagueAvgGoals);
});

const selectedHome = computed(() => standings.value?.teams.find((t) => t.name === predHome.value) ?? null);
const selectedAway = computed(() => standings.value?.teams.find((t) => t.name === predAway.value) ?? null);

// ── Helpers ────────────────────────────────────────────────────────────────
function pct(v: number) { return Math.round(v * 100); }

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });
  } catch { return iso.slice(5, 10); }
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }) + " BST";
  } catch { return ""; }
}

function formDots(form: string) {
  return (form || "").split(",").filter(Boolean).slice(-5).map((r) => ({
    r, cls: r === "W" ? "form-w" : r === "D" ? "form-d" : "form-l",
  }));
}

function resultClass(m: EuroMatch): string {
  if (m.homeScore === null) return "";
  if (m.homeScore > m.awayScore!) return "result-home";
  if (m.homeScore < m.awayScore!) return "result-away";
  return "result-draw";
}
</script>

<template>
  <div class="euro-page">
    <!-- Header -->
    <header class="euro-header">
      <div class="euro-header-inner">
        <div class="euro-title-group">
          <span class="euro-eyebrow">⚽ EUROPEAN FOOTBALL</span>
          <h1 class="euro-title">Euro Analysis <span class="by-movee">by </span><a class="by-movee" href="https://www.movee.jp" target="_blank" rel="noopener">㈱movee</a></h1>
          <p class="euro-subtitle">ポアソンモデルによる勝率予測</p>
        </div>
        <div class="share-btns">
          <button class="share-btn" @click="euroCopyLink">{{ euroCopied ? '✓ コピー済み' : '🔗 リンクをコピー' }}</button>
          <button class="share-btn share-btn--x" @click="euroShareTwitter">𝕏 でシェア</button>
        </div>

        <!-- League selector -->
        <div class="league-selector">
          <button
            v-for="lg in LEAGUES" :key="lg.code"
            class="league-btn"
            :class="{ 'league-btn--active': activeLeague === lg.code }"
            @click="goToLeague(lg.code)"
          >
            <span class="lg-flag">{{ lg.country }}</span>
            <span class="lg-name">{{ lg.name }}</span>
          </button>
        </div>

        <!-- Tabs -->
        <nav class="euro-tabs">
          <button
            v-for="tab in [
              { id: 'standings', label: '順位表' },
              { id: 'matches',   label: '次節の試合' },
              { id: 'predict',   label: '1試合予測' },
              { id: 'scorers',   label: '得点ランキング' },
            ]"
            :key="tab.id"
            class="euro-tab"
            :class="{ 'euro-tab--active': activeTab === tab.id }"
            @click="goToTab(tab.id)"
          >{{ tab.label }}</button>
        </nav>
      </div>
    </header>

    <main class="euro-main">

      <!-- ── 順位表 ──────────────────────────────────────── -->
      <section v-show="activeTab === 'standings'">
        <div v-if="standingsLoading" class="loading-msg">データを取得中…</div>
        <div v-else-if="standings" class="st-wrap">
          <h2 class="st-heading">{{ standings.competition }} {{ standings.season }}-{{ standings.season + 1 }}</h2>
          <div class="st-table-wrap">
            <table class="st-table">
              <thead>
                <tr>
                  <th class="st-th-pos">#</th>
                  <th class="st-th-team">チーム</th>
                  <th class="st-th-n">試</th>
                  <th class="st-th-n">勝</th>
                  <th class="st-th-n">分</th>
                  <th class="st-th-n">敗</th>
                  <th class="st-th-n">得点</th>
                  <th class="st-th-n">失点</th>
                  <th class="st-th-n">得失差</th>
                  <th class="st-th-n fw-pts">勝点</th>
                  <th class="st-th-n">直近5</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="t in standings.teams" :key="t.id"
                  class="st-row"
                  :class="{
                    'zone-cl': t.position <= 4,
                    'zone-el': t.position === 5,
                    'zone-rel': t.position >= standings.teams.length - 2,
                  }"
                >
                  <td class="st-td-pos">{{ t.position }}</td>
                  <td class="st-td-team">
                    <span class="team-inner">
                      <img v-if="t.crest" :src="t.crest" class="team-crest" alt="" />
                      <span>{{ t.shortName || t.name }}</span>
                    </span>
                  </td>
                  <td class="st-td-n">{{ t.played }}</td>
                  <td class="st-td-n">{{ t.won }}</td>
                  <td class="st-td-n">{{ t.draw }}</td>
                  <td class="st-td-n">{{ t.lost }}</td>
                  <td class="st-td-n">{{ t.goalsFor }}</td>
                  <td class="st-td-n">{{ t.goalsAgainst }}</td>
                  <td class="st-td-n" :class="{ 'diff-pos': t.goalDiff > 0, 'diff-neg': t.goalDiff < 0 }">
                    {{ t.goalDiff > 0 ? '+' : '' }}{{ t.goalDiff }}
                  </td>
                  <td class="st-td-n fw-pts">{{ t.points }}</td>
                  <td class="st-td-form">
                    <span
                      v-for="(dot, i) in formDots(t.form)" :key="i"
                      class="form-dot" :class="dot.cls"
                    >{{ dot.r }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="zone-legend">
            <span class="zone-legend-item zone-cl-dot">CL出場圏</span>
            <span class="zone-legend-item zone-el-dot">EL出場圏</span>
            <span class="zone-legend-item zone-rel-dot">降格圏</span>
          </div>
        </div>
      </section>

      <!-- ── 次節の試合 ──────────────────────────────────── -->
      <section v-show="activeTab === 'matches'">
        <div v-if="matchesLoading || standingsLoading" class="loading-msg">データを取得中…</div>
        <div v-else class="matches-wrap">
          <!-- Upcoming -->
          <div v-if="nextRoundPreds.length">
            <h2 class="match-section-heading">
              第{{ matchesData?.nextMatchday }}節の試合
            </h2>
            <div class="match-cards">
              <div v-for="{ match, pred } in nextRoundPreds" :key="match.id" class="match-card">
                <div class="match-meta">
                  <span class="match-date">{{ fmtDate(match.utcDate) }}</span>
                  <span class="match-time">{{ fmtTime(match.utcDate) }}</span>
                </div>
                <div class="match-teams">
                  <div class="match-team match-team--home">
                    <img v-if="match.homeTeam.crest" :src="match.homeTeam.crest" class="match-crest" alt="" />
                    <span class="match-tname">{{ match.homeTeam.shortName }}</span>
                  </div>
                  <span class="match-sep">vs</span>
                  <div class="match-team match-team--away">
                    <span class="match-tname">{{ match.awayTeam.shortName }}</span>
                    <img v-if="match.awayTeam.crest" :src="match.awayTeam.crest" class="match-crest" alt="" />
                  </div>
                </div>

                <div v-if="pred" class="match-pred">
                  <!-- Probability bar -->
                  <div class="pred-bar">
                    <div class="pred-bar-h" :style="{ width: pct(pred.homeWin) + '%' }" />
                    <div class="pred-bar-d" :style="{ width: pct(pred.draw) + '%' }" />
                    <div class="pred-bar-a" :style="{ width: pct(pred.awayWin) + '%' }" />
                  </div>
                  <div class="pred-nums">
                    <span class="pred-pct-h">{{ pct(pred.homeWin) }}%</span>
                    <span class="pred-pct-d">{{ pct(pred.draw) }}%<br /><small>引分</small></span>
                    <span class="pred-pct-a">{{ pct(pred.awayWin) }}%</span>
                  </div>
                  <div class="pred-xg">
                    <span>xG {{ pred.homeXG }}</span>
                    <span class="pred-likely">最多予想スコア <strong>{{ pred.likelyScore }}</strong></span>
                    <span>xG {{ pred.awayXG }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent results -->
          <div v-if="matchesData?.recent.length">
            <h2 class="match-section-heading" style="margin-top:32px">直近の結果</h2>
            <div class="recent-list">
              <div v-for="m in matchesData.recent" :key="m.id" class="recent-row">
                <span class="recent-date">{{ fmtDate(m.utcDate) }}</span>
                <span class="recent-home">{{ m.homeTeam.shortName }}</span>
                <span class="recent-score" :class="resultClass(m)">
                  {{ m.homeScore }} - {{ m.awayScore }}
                </span>
                <span class="recent-away">{{ m.awayTeam.shortName }}</span>
              </div>
            </div>
          </div>

          <div v-if="!nextRoundPreds.length && !matchesData?.recent.length" class="loading-msg">試合データがありません</div>
        </div>
      </section>

      <!-- ── 1試合予測 ──────────────────────────────────── -->
      <section v-show="activeTab === 'predict'">
        <div v-if="standingsLoading" class="loading-msg">データを取得中…</div>
        <div v-else class="predict-wrap">
          <div class="predict-selectors">
            <div class="sel-group">
              <label class="sel-label">ホームチーム</label>
              <select v-model="predHome" class="team-sel">
                <option value="">選択してください</option>
                <option v-for="t in standings?.teams" :key="t.id" :value="t.name">
                  {{ t.position }}. {{ t.shortName || t.name }}
                </option>
              </select>
            </div>
            <span class="vs-sep">vs</span>
            <div class="sel-group">
              <label class="sel-label">アウェイチーム</label>
              <select v-model="predAway" class="team-sel">
                <option value="">選択してください</option>
                <option v-for="t in standings?.teams" :key="t.id" :value="t.name">
                  {{ t.position }}. {{ t.shortName || t.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="singlePred && selectedHome && selectedAway" class="pred-card">
            <!-- Teams row -->
            <div class="pred-teams-row">
              <div class="pred-team-side">
                <img v-if="selectedHome.crest" :src="selectedHome.crest" class="pred-crest" alt="" />
                <p class="pred-tname">{{ selectedHome.shortName || selectedHome.name }}</p>
                <p class="pred-tstat">{{ selectedHome.points }}pt / {{ selectedHome.position }}位</p>
                <p class="pred-tstat">得{{ selectedHome.goalsFor }} 失{{ selectedHome.goalsAgainst }}</p>
                <span class="home-tag">🏟 ホーム</span>
              </div>

              <div class="pred-center">
                <div class="pred-pct-big">
                  <span class="pred-pct-h-big">{{ pct(singlePred.homeWin) }}<small>%</small></span>
                  <span class="pred-pct-d-big">{{ pct(singlePred.draw) }}<small>%</small><br /><span class="pred-draw-label">引分</span></span>
                  <span class="pred-pct-a-big">{{ pct(singlePred.awayWin) }}<small>%</small></span>
                </div>
                <div class="pred-bar-full">
                  <div class="pred-bar-h" :style="{ width: pct(singlePred.homeWin) + '%' }" />
                  <div class="pred-bar-d" :style="{ width: pct(singlePred.draw) + '%' }" />
                  <div class="pred-bar-a" :style="{ width: pct(singlePred.awayWin) + '%' }" />
                </div>
              </div>

              <div class="pred-team-side pred-team-side--right">
                <img v-if="selectedAway.crest" :src="selectedAway.crest" class="pred-crest" alt="" />
                <p class="pred-tname">{{ selectedAway.shortName || selectedAway.name }}</p>
                <p class="pred-tstat">{{ selectedAway.points }}pt / {{ selectedAway.position }}位</p>
                <p class="pred-tstat">得{{ selectedAway.goalsFor }} 失{{ selectedAway.goalsAgainst }}</p>
                <span class="away-tag">✈ アウェイ</span>
              </div>
            </div>

            <!-- Details -->
            <div class="pred-details">
              <div class="detail-row">
                <span class="detail-val">{{ singlePred.homeXG }}</span>
                <span class="detail-lbl">期待ゴール（xG）</span>
                <span class="detail-val">{{ singlePred.awayXG }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-val">{{ selectedHome.attackStrength }}</span>
                <span class="detail-lbl">攻撃力スコア</span>
                <span class="detail-val">{{ selectedAway.attackStrength }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-val">{{ selectedHome.defenseStrength }}</span>
                <span class="detail-lbl">守備力スコア</span>
                <span class="detail-val">{{ selectedAway.defenseStrength }}</span>
              </div>
              <div class="detail-row detail-row--highlight">
                <span class="detail-val">—</span>
                <span class="detail-lbl">最多予想スコア</span>
                <span class="detail-val">{{ singlePred.likelyScore }}</span>
              </div>
            </div>

            <p class="pred-note">
              ※ ポアソンモデル（Dixon-Coles準拠）＋ホームアドバンテージ(+12%/-12%)
              　リーグ平均xG: {{ standings?.leagueAvgGoals }} goals/game
            </p>
          </div>
          <div v-else class="pred-empty">異なる2チームを選択してください</div>
        </div>
      </section>

      <!-- ── 得点ランキング ──────────────────────────────── -->
      <section v-show="activeTab === 'scorers'">
        <div v-if="scorersLoading" class="loading-msg">データを取得中…</div>
        <div v-else-if="scorers.length" class="scorers-wrap">
          <div class="scorer-list">
            <div v-for="(s, i) in scorers" :key="i" class="scorer-row">
              <span class="scorer-rank">{{ i + 1 }}</span>
              <img v-if="s.teamCrest" :src="s.teamCrest" class="scorer-crest" alt="" />
              <div class="scorer-info">
                <p class="scorer-name">{{ s.name }}</p>
                <p class="scorer-team">{{ s.team }}</p>
              </div>
              <div class="scorer-stats">
                <span class="scorer-goals">{{ s.goals }}<small>G</small></span>
                <span v-if="s.assists !== null" class="scorer-assists">{{ s.assists }}<small>A</small></span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!scorersLoading" class="loading-msg">得点ランキングを読み込んでいます…</div>
      </section>

    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface2: #21262d;
  --border: #30363d;
  --text: #e6edf3;
  --muted: #7d8590;
  --accent: #238636;
  --accent2: #1f6feb;
  --gold: #d29922;
  --win: #3fb950;
  --draw: #a8a8a8;
  --loss: #f85149;
  --cl: #1f6feb;
  --el: #388bfd;
  --rel: #f85149;
  --radius: 8px;
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --bg: #f6f8fa; --surface: #ffffff; --surface2: #f0f2f5;
    --border: #d0d7de; --text: #1f2328; --muted: #636c76;
    --gold: #9a6700;
  }
}
:root[data-theme="light"] {
  --bg: #f6f8fa; --surface: #ffffff; --surface2: #f0f2f5;
  --border: #d0d7de; --text: #1f2328; --muted: #636c76; --gold: #9a6700;
}
:root[data-theme="dark"] {
  --bg: #0d1117; --surface: #161b22; --surface2: #21262d;
  --border: #30363d; --text: #e6edf3; --muted: #7d8590; --gold: #d29922;
}
* { box-sizing: border-box; }
.euro-page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }

/* ── Header ── */
.euro-header { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; }
.euro-header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 20px 0; }
.euro-title-group { margin-bottom: 12px; }
.euro-eyebrow { display: block; font-size: 0.62rem; letter-spacing: 0.12em; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-weight: 600; text-transform: uppercase; }
.euro-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 800; margin: 0; line-height: 1; }
.euro-subtitle { font-size: 0.72rem; color: var(--muted); margin: 2px 0 0; }

/* Share */
.share-btns { display: flex; gap: 8px; align-items: center; margin-left: auto; }
.share-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.75rem; padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: color 0.15s, border-color 0.15s; white-space: nowrap; }
.share-btn:hover { color: var(--text); border-color: var(--gold); }
.share-btn--x { border-color: #1da1f2; color: #1da1f2; }
.share-btn--x:hover { background: rgba(29,161,242,0.1); }
.by-movee { font-size: 0.42em; font-weight: 500; color: var(--muted); letter-spacing: 0.04em; text-decoration: none; vertical-align: middle; }
.by-movee:hover { color: var(--gold); text-decoration: underline; }

/* League selector */
.league-selector { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.league-btn {
  display: flex; align-items: center; gap: 5px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--muted); font-family: 'Inter', sans-serif; font-size: 0.78rem;
  padding: 5px 10px; border-radius: 20px; cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.league-btn:hover { color: var(--text); border-color: var(--gold); }
.league-btn--active { background: rgba(210, 153, 34, 0.12); border-color: var(--gold); color: var(--gold); font-weight: 600; }
.lg-flag { font-size: 1rem; line-height: 1; }
.lg-name { white-space: nowrap; }

/* Tabs */
.euro-tabs { display: flex; gap: 0; border-top: 1px solid var(--border); margin-top: 4px; }
.euro-tab { background: none; border: none; border-bottom: 2px solid transparent; color: var(--muted); font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500; padding: 8px 14px; cursor: pointer; transition: color 0.15s, border-color 0.15s; }
.euro-tab:hover { color: var(--text); }
.euro-tab--active { color: var(--gold); border-bottom-color: var(--gold); }

/* ── Mobile header ── */
@media (max-width: 640px) {
  .euro-header-inner { padding: 8px 12px 0; }
  .euro-eyebrow, .euro-subtitle { display: none; }
  .euro-title { font-size: 1.2rem; }
  .euro-title-group { margin-bottom: 4px; }
  .league-selector { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 2px; gap: 4px; }
  .league-selector::-webkit-scrollbar { display: none; }
  .league-btn { padding: 4px 8px; font-size: 0.72rem; }
  .euro-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .euro-tabs::-webkit-scrollbar { display: none; }
  .euro-tab { padding: 6px 10px; font-size: 0.72rem; flex-shrink: 0; white-space: nowrap; }
}

/* Main */
.euro-main { max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px; }
.loading-msg { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 0.9rem; }

/* ── Standings ── */
.st-wrap { }
.st-heading { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; margin: 0 0 12px; }
.st-table-wrap { overflow-x: auto; }
.st-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; min-width: 600px; }
.st-table thead tr { border-bottom: 1px solid var(--border); }
.st-th-pos, .st-th-team, .st-th-n { padding: 7px 10px; color: var(--muted); font-size: 0.68rem; font-weight: 500; letter-spacing: 0.04em; text-align: right; white-space: nowrap; }
.st-th-pos, .st-th-team { text-align: left; }
.st-th-team { min-width: 140px; }
.st-row td { padding: 7px 10px; border-bottom: 1px solid rgba(48,54,61,0.5); }
.st-row:last-child td { border-bottom: none; }
.st-row:hover td { background: var(--surface2); }
.st-td-pos { color: var(--muted); font-size: 0.75rem; text-align: left; min-width: 24px; }
.st-td-team { text-align: left; }
.team-inner { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
.st-td-n { text-align: right; font-variant-numeric: tabular-nums; }
.st-td-form { text-align: right; }
.fw-pts { font-family: 'Barlow Condensed', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--text); }
.team-crest { width: 18px; height: 18px; object-fit: contain; flex-shrink: 0; }
.diff-pos { color: var(--win); } .diff-neg { color: var(--loss); }

/* Zone colours */
.zone-cl { border-left: 3px solid var(--cl); }
.zone-el { border-left: 3px solid var(--el); }
.zone-rel { border-left: 3px solid var(--rel); }

/* Form dots */
.form-dot { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; font-size: 0.6rem; font-weight: 700; margin-left: 2px; }
.form-w { background: rgba(63,185,80,0.2); color: var(--win); }
.form-d { background: rgba(168,168,168,0.15); color: var(--draw); }
.form-l { background: rgba(248,81,73,0.2); color: var(--loss); }

/* Zone legend */
.zone-legend { display: flex; gap: 16px; margin-top: 12px; font-size: 0.72rem; color: var(--muted); }
.zone-legend-item { display: flex; align-items: center; gap: 6px; }
.zone-legend-item::before { content: ''; display: inline-block; width: 12px; height: 3px; border-radius: 2px; }
.zone-cl-dot::before { background: var(--cl); }
.zone-el-dot::before { background: var(--el); }
.zone-rel-dot::before { background: var(--rel); }

/* ── Matches ── */
.matches-wrap { }
.match-section-heading { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; margin: 0 0 14px; }
.match-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.match-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.match-meta { display: flex; gap: 10px; font-size: 0.72rem; color: var(--muted); }
.match-date { font-weight: 500; }
.match-teams { display: flex; align-items: center; gap: 10px; }
.match-team { display: flex; align-items: center; gap: 7px; flex: 1; }
.match-team--home { justify-content: flex-end; }
.match-team--away { justify-content: flex-start; }
.match-crest { width: 22px; height: 22px; object-fit: contain; }
.match-tname { font-weight: 600; font-size: 0.85rem; }
.match-sep { font-size: 0.75rem; color: var(--muted); flex: 0 0 auto; }

/* Pred bar (in match card) */
.match-pred { display: flex; flex-direction: column; gap: 5px; }
.pred-bar { height: 7px; border-radius: 4px; overflow: hidden; display: flex; }
.pred-bar-h { background: #1f6feb; height: 100%; }
.pred-bar-d { background: #7d8590; height: 100%; }
.pred-bar-a { background: #f85149; height: 100%; }
.pred-nums { display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; }
.pred-pct-h { font-weight: 700; color: #388bfd; font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; }
.pred-pct-d { text-align: center; color: var(--muted); font-size: 0.68rem; }
.pred-pct-a { font-weight: 700; color: var(--loss); font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; }
.pred-xg { display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--muted); }
.pred-likely { color: var(--gold); text-align: center; }
.pred-likely strong { font-family: 'Barlow Condensed', sans-serif; font-size: 0.85rem; }

/* Recent results */
.recent-list { display: flex; flex-direction: column; gap: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.recent-row { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-bottom: 1px solid var(--border); font-size: 0.8rem; }
.recent-row:last-child { border-bottom: none; }
.recent-date { font-size: 0.7rem; color: var(--muted); min-width: 64px; }
.recent-home { flex: 1; text-align: right; font-weight: 500; }
.recent-away { flex: 1; text-align: left; font-weight: 500; }
.recent-score { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; min-width: 54px; text-align: center; padding: 2px 8px; border-radius: 4px; }
.recent-score.result-home { background: rgba(63,185,80,0.15); color: var(--win); }
.recent-score.result-away { background: rgba(248,81,73,0.15); color: var(--loss); }
.recent-score.result-draw { background: var(--surface2); color: var(--muted); }

/* ── Predict ── */
.predict-wrap { max-width: 760px; }
.predict-selectors { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
.sel-group { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 6px; }
.sel-label { font-size: 0.72rem; color: var(--muted); font-weight: 500; letter-spacing: 0.04em; }
.team-sel { background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 9px 12px; border-radius: var(--radius); font-family: 'Inter', sans-serif; font-size: 0.85rem; width: 100%; -webkit-appearance: none; appearance: none; }
.team-sel:focus { outline: 2px solid var(--gold); outline-offset: 2px; }
.vs-sep { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--muted); padding-top: 20px; }

.pred-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.pred-teams-row { display: flex; align-items: flex-start; gap: 16px; }
.pred-team-side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.pred-team-side--right { }
.pred-crest { width: 44px; height: 44px; object-fit: contain; }
.pred-tname { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 700; margin: 0; }
.pred-tstat { font-size: 0.73rem; color: var(--muted); margin: 0; }
.home-tag { font-size: 0.65rem; background: rgba(210,153,34,0.15); color: var(--gold); padding: 2px 7px; border-radius: 3px; margin-top: 4px; }
.away-tag { font-size: 0.65rem; background: rgba(125,133,144,0.15); color: var(--muted); padding: 2px 7px; border-radius: 3px; margin-top: 4px; }

.pred-center { flex: 1.2; display: flex; flex-direction: column; gap: 8px; }
.pred-pct-big { display: flex; justify-content: space-around; align-items: baseline; }
.pred-pct-h-big { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 800; color: #388bfd; }
.pred-pct-d-big { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 600; color: var(--muted); text-align: center; }
.pred-pct-a-big { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--loss); }
.pred-pct-h-big small, .pred-pct-d-big small, .pred-pct-a-big small { font-size: 1rem; font-weight: 400; }
.pred-draw-label { font-size: 0.6rem; color: var(--muted); }
.pred-bar-full { height: 8px; border-radius: 4px; overflow: hidden; display: flex; }

.pred-details { background: var(--surface2); border-radius: 6px; padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; }
.detail-row { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
.detail-val { flex: 1; font-variant-numeric: tabular-nums; font-family: 'Barlow Condensed', sans-serif; font-size: 0.9rem; font-weight: 600; text-align: right; }
.detail-val:last-child { text-align: left; }
.detail-lbl { flex: 0 0 140px; text-align: center; font-size: 0.7rem; color: var(--muted); }
.detail-row--highlight .detail-lbl { color: var(--gold); }
.detail-row--highlight .detail-val:last-child { color: var(--gold); font-size: 1.1rem; }

.pred-note { font-size: 0.68rem; color: var(--muted); margin: 0; }
.pred-empty { padding: 40px 0; color: var(--muted); font-size: 0.9rem; }

/* ── Scorers ── */
.scorers-wrap { max-width: 540px; }
.scorer-list { display: flex; flex-direction: column; gap: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.scorer-row { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border); }
.scorer-row:last-child { border-bottom: none; }
.scorer-rank { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; color: var(--muted); min-width: 22px; text-align: center; }
.scorer-row:nth-child(1) .scorer-rank { color: #d29922; }
.scorer-row:nth-child(2) .scorer-rank { color: #a8a8a8; }
.scorer-row:nth-child(3) .scorer-rank { color: #c07b48; }
.scorer-crest { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
.scorer-info { flex: 1; min-width: 0; }
.scorer-name { font-weight: 600; font-size: 0.85rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.scorer-team { font-size: 0.7rem; color: var(--muted); margin: 0; }
.scorer-stats { display: flex; gap: 10px; align-items: baseline; }
.scorer-goals { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--win); }
.scorer-assists { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 600; color: var(--muted); }
.scorer-goals small, .scorer-assists small { font-size: 0.7rem; font-weight: 400; }
</style>
