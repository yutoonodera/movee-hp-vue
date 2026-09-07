<script setup lang="ts">
useHead({ title: "サッカー分析 — Jリーグ — movee" });

// ─── Types ────────────────────────────────────────────────────────────────────
interface Competition {
  id: string;
  label: string;
  season: string;
  league: string;
}
interface Match {
  match_id: number;
  match_date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
}

// ─── State ───────────────────────────────────────────────────────────────────
const selectedComp = ref<Competition | null>(null);
const viewMode = ref<"predict" | "trend" | "table">("predict");
const predHome = ref("");
const predAway = ref("");
const trendTeam = ref("");

// ─── Data fetching ────────────────────────────────────────────────────────────
const { data: competitions } = await useFetch<Competition[]>("/api/jleague/competitions");

const matches = ref<Match[] | null>(null);
const matchStatus = ref<"idle" | "pending" | "success" | "error">("idle");

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(selectedComp, async (comp) => {
  predHome.value = "";
  predAway.value = "";
  trendTeam.value = "";
  matches.value = null;

  if (!comp) return;

  matchStatus.value = "pending";
  try {
    matches.value = await $fetch<Match[]>(
      `/api/jleague/matches/${comp.league}/${comp.season}`,
    );
    matchStatus.value = "success";
    const teams = allTeams.value;
    if (teams.length > 0) predHome.value = teams[0];
    if (teams.length > 1) predAway.value = teams[1];
    if (teams.length > 0) trendTeam.value = teams[0];
  } catch {
    matchStatus.value = "error";
  }
});

// ─── Derived lists ────────────────────────────────────────────────────────────
const completedMatches = computed(() =>
  (matches.value ?? []).filter(
    (m) => typeof m.home_score === "number" && typeof m.away_score === "number",
  )
);

const allTeams = computed(() =>
  [...new Set(completedMatches.value.flatMap((m) => [m.home_team, m.away_team]))].sort()
);

// ─── Poisson model ────────────────────────────────────────────────────────────
const facts = (() => {
  const f = [1];
  for (let i = 1; i <= 15; i++) f[i] = f[i - 1] * i;
  return f;
})();

function poisson(k: number, lambda: number) {
  return Math.exp(-lambda) * Math.pow(lambda, k) / (facts[Math.min(k, 15)] ?? 1);
}

interface TeamStat { hg: number; hc: number; ag: number; ac: number; hm: number; am: number }

const poissonModel = computed(() => {
  const ms = completedMatches.value;
  if (!ms.length) return null;

  const stats = new Map<string, TeamStat>();
  for (const m of ms) {
    if (!stats.has(m.home_team)) stats.set(m.home_team, { hg: 0, hc: 0, ag: 0, ac: 0, hm: 0, am: 0 });
    if (!stats.has(m.away_team)) stats.set(m.away_team, { hg: 0, hc: 0, ag: 0, ac: 0, hm: 0, am: 0 });
    const h = stats.get(m.home_team)!;
    const a = stats.get(m.away_team)!;
    h.hg += m.home_score; h.hc += m.away_score; h.hm++;
    a.ag += m.away_score; a.ac += m.home_score; a.am++;
  }

  const avgHome = ms.reduce((s, m) => s + m.home_score, 0) / ms.length;
  const avgAway = ms.reduce((s, m) => s + m.away_score, 0) / ms.length;
  const leagueAvg = (avgHome + avgAway) / 2 || 1;

  const strengths = new Map<string, { attack: number; defense: number }>();
  stats.forEach((s, team) => {
    const total = s.hm + s.am || 1;
    strengths.set(team, {
      attack: ((s.hg + s.ag) / total) / leagueAvg,
      defense: ((s.hc + s.ac) / total) / leagueAvg,
    });
  });

  return { strengths, avgHome, avgAway };
});

const prediction = computed(() => {
  const m = poissonModel.value;
  if (!m || !predHome.value || !predAway.value || predHome.value === predAway.value) return null;
  const h = m.strengths.get(predHome.value);
  const a = m.strengths.get(predAway.value);
  if (!h || !a) return null;

  const lambdaH = m.avgHome * h.attack * a.defense;
  const lambdaA = m.avgAway * a.attack * h.defense;

  let homeWin = 0, draw = 0, awayWin = 0;
  const scores: Array<{ score: string; prob: number; hg: number; ag: number }> = [];
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8; j++) {
      const prob = poisson(i, lambdaH) * poisson(j, lambdaA);
      if (i > j) homeWin += prob;
      else if (i === j) draw += prob;
      else awayWin += prob;
      scores.push({ score: `${i}–${j}`, prob, hg: i, ag: j });
    }
  }

  // Past head-to-head results
  const h2h = completedMatches.value.filter(
    (x) => (x.home_team === predHome.value && x.away_team === predAway.value) ||
            (x.home_team === predAway.value && x.away_team === predHome.value),
  ).slice(0, 5);

  return {
    homeWin, draw, awayWin,
    lambdaH, lambdaA,
    topScores: scores.sort((a, b) => b.prob - a.prob).slice(0, 8),
    h2h,
  };
});

// ─── League table ─────────────────────────────────────────────────────────────
const leagueTable = computed(() => {
  const m = poissonModel.value;
  if (!m) return [];
  return [...m.strengths.entries()].map(([name, s]) => {
    let pts = 0, gf = 0, ga = 0, w = 0, d = 0, l = 0;
    for (const x of completedMatches.value) {
      if (x.home_team === name) {
        gf += x.home_score; ga += x.away_score;
        if (x.home_score > x.away_score) { pts += 3; w++; }
        else if (x.home_score === x.away_score) { pts += 1; d++; }
        else l++;
      } else if (x.away_team === name) {
        gf += x.away_score; ga += x.home_score;
        if (x.away_score > x.home_score) { pts += 3; w++; }
        else if (x.away_score === x.home_score) { pts += 1; d++; }
        else l++;
      }
    }
    return { name, played: w + d + l, w, d, l, gf, ga, gd: gf - ga, pts, atk: s.attack, def: s.defense };
  }).sort((a, b) => b.pts - a.pts || b.gd - a.gd);
});

// ─── Trend data ───────────────────────────────────────────────────────────────
const trendData = computed(() => {
  if (!trendTeam.value) return [];
  return completedMatches.value
    .filter((m) => m.home_team === trendTeam.value || m.away_team === trendTeam.value)
    .sort((a, b) => a.match_date.localeCompare(b.match_date))
    .map((m) => {
      const isHome = m.home_team === trendTeam.value;
      const gf = isHome ? m.home_score : m.away_score;
      const ga = isHome ? m.away_score : m.home_score;
      const opponent = isHome ? m.away_team : m.home_team;
      const result = gf > ga ? "W" : gf < ga ? "L" : "D";
      return { date: m.match_date, gf, ga, opponent, result, isHome };
    });
});

const trendRolling = computed(() => {
  const td = trendData.value;
  return td.map((_, i) => {
    const w = td.slice(Math.max(0, i - 4), i + 1);
    return {
      gf: w.reduce((s, x) => s + x.gf, 0) / w.length,
      ga: w.reduce((s, x) => s + x.ga, 0) / w.length,
    };
  });
});

// ─── Trend chart dims ─────────────────────────────────────────────────────────
const TW = 700, TH = 220, TP = 36;
const maxG = computed(() => Math.max(5, ...trendData.value.map((d) => Math.max(d.gf, d.ga))));
const tX = (i: number) => TP + (i / Math.max(trendData.value.length - 1, 1)) * (TW - TP * 2);
const tY = (v: number) => TH - TP - (v / maxG.value) * (TH - TP * 2);
function polyline(vals: number[]) { return vals.map((v, i) => `${tX(i)},${tY(v)}`).join(" "); }

const cumulativeForm = computed(() => {
  let pts = 0;
  return trendData.value.map((d) => {
    if (d.result === "W") pts += 3;
    else if (d.result === "D") pts += 1;
    return pts;
  });
});
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-logo">movee</NuxtLink>
      <nav class="nav-links">
        <NuxtLink to="/achievements">実績</NuxtLink>
        <NuxtLink to="/blog">ブログ</NuxtLink>
        <a href="/#contact">お問い合わせ</a>
      </nav>
    </header>

    <div class="hero-bar">
      <p class="hero-tag">DATA ANALYTICS</p>
      <h1 class="hero-title">Jリーグ分析</h1>
      <p class="hero-sub">Poissonモデルによる試合予測・チーム強度分析・シーズントレンド</p>
    </div>

    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <h2 class="sidebar-heading">シーズン選択</h2>
          <ul class="comp-list">
            <li
              v-for="c in competitions"
              :key="c.id"
              class="comp-item"
              :class="{ active: selectedComp?.id === c.id }"
              @click="selectedComp = c"
            >
              {{ c.label }}
            </li>
          </ul>
        </div>

        <div v-if="selectedComp && matchStatus !== 'pending' && matches?.length" class="sidebar-section sidebar-stats">
          <h2 class="sidebar-heading">データ概要</h2>
          <div class="mini-stat"><span class="ms-val">{{ completedMatches.length }}</span><span class="ms-lbl">試合数</span></div>
          <div class="mini-stat"><span class="ms-val">{{ allTeams.length }}</span><span class="ms-lbl">チーム数</span></div>
          <div class="mini-stat">
            <span class="ms-val">{{ completedMatches.length ? (completedMatches.reduce((s,m)=>s+m.home_score+m.away_score,0)/completedMatches.length).toFixed(2) : '—' }}</span>
            <span class="ms-lbl">平均総得点/試合</span>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="main">
        <div v-if="!selectedComp" class="empty-state">
          <div class="empty-icon">⚽</div>
          <p>左からシーズンを選んでください</p>
        </div>

        <template v-else>
          <div v-if="matchStatus === 'pending' || matchStatus === 'idle'" class="loading">
            <div class="spin"></div>
            データを読み込み中…
          </div>

          <template v-else-if="!matches?.length">
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <p>このシーズンのデータがまだありません</p>
            </div>
          </template>

          <template v-else>
            <div class="comp-label">{{ selectedComp.label }} · {{ completedMatches.length }}試合分析</div>

            <!-- Tabs -->
            <div class="view-switcher">
              <button :class="{ active: viewMode === 'predict' }" @click="viewMode = 'predict'">試合予測</button>
              <button :class="{ active: viewMode === 'trend' }" @click="viewMode = 'trend'">チームトレンド</button>
              <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">順位表・強度分析</button>
            </div>

            <!-- ── 試合予測 ─────────────────────────────────────────────────── -->
            <template v-if="viewMode === 'predict'">
              <div class="vs-row">
                <div class="team-sel-wrap">
                  <label class="sel-label">ホームチーム</label>
                  <select v-model="predHome" class="sel-box">
                    <option v-for="t in allTeams" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div class="vs-badge">VS</div>
                <div class="team-sel-wrap">
                  <label class="sel-label">アウェイチーム</label>
                  <select v-model="predAway" class="sel-box">
                    <option v-for="t in allTeams" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>

              <template v-if="prediction && predHome !== predAway">
                <!-- Win probability -->
                <div class="prob-card">
                  <div class="prob-team-row">
                    <div class="prob-team-block">
                      <span class="prob-team-name">{{ predHome }}</span>
                      <span class="prob-team-role">HOME</span>
                    </div>
                    <div class="prob-team-block center">
                      <span class="prob-match-label">勝率予測</span>
                    </div>
                    <div class="prob-team-block right">
                      <span class="prob-team-name">{{ predAway }}</span>
                      <span class="prob-team-role">AWAY</span>
                    </div>
                  </div>

                  <div class="prob-bar-wrap">
                    <div class="prob-seg home" :style="{ flex: prediction.homeWin }">
                      <span class="prob-pct-lbl">{{ (prediction.homeWin * 100).toFixed(1) }}%</span>
                      <span class="prob-result-lbl">勝利</span>
                    </div>
                    <div class="prob-seg draw" :style="{ flex: prediction.draw }">
                      <span class="prob-pct-lbl">{{ (prediction.draw * 100).toFixed(1) }}%</span>
                      <span class="prob-result-lbl">引分</span>
                    </div>
                    <div class="prob-seg away" :style="{ flex: prediction.awayWin }">
                      <span class="prob-pct-lbl">{{ (prediction.awayWin * 100).toFixed(1) }}%</span>
                      <span class="prob-result-lbl">勝利</span>
                    </div>
                  </div>

                  <div class="xg-row">
                    <div class="xg-block">
                      <span class="xg-num">{{ prediction.lambdaH.toFixed(2) }}</span>
                      <span class="xg-lbl">期待得点</span>
                    </div>
                    <div class="xg-sep">—</div>
                    <div class="xg-block right">
                      <span class="xg-num">{{ prediction.lambdaA.toFixed(2) }}</span>
                      <span class="xg-lbl">期待得点</span>
                    </div>
                  </div>
                </div>

                <!-- Score predictions -->
                <div class="scores-section">
                  <h3 class="sub-title">スコア予測（上位8パターン）</h3>
                  <div class="scores-grid">
                    <div
                      v-for="(s, i) in prediction.topScores"
                      :key="s.score"
                      class="score-chip"
                      :class="{ top: i === 0 }"
                    >
                      <span class="sc-rank">{{ i + 1 }}</span>
                      <span class="sc-score">{{ s.score }}</span>
                      <div class="sc-bar-wrap">
                        <div class="sc-bar" :style="{ width: (s.prob / prediction.topScores[0].prob * 100) + '%', background: s.hg > s.ag ? '#1d4ed8' : s.hg === s.ag ? '#475569' : '#b91c1c' }"></div>
                      </div>
                      <span class="sc-prob">{{ (s.prob * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Head to head -->
                <div v-if="prediction.h2h.length" class="h2h-section">
                  <h3 class="sub-title">直近の直接対決</h3>
                  <div class="h2h-list">
                    <div v-for="m in prediction.h2h" :key="m.match_id" class="h2h-row">
                      <span class="h2h-date">{{ m.match_date }}</span>
                      <span class="h2h-teams">{{ m.home_team }}</span>
                      <span class="h2h-score" :class="m.home_score > m.away_score ? 'home-win' : m.home_score < m.away_score ? 'away-win' : ''">
                        {{ m.home_score }} – {{ m.away_score }}
                      </span>
                      <span class="h2h-teams">{{ m.away_team }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="predHome === predAway" class="info-box">異なるチームを選んでください</div>
            </template>

            <!-- ── チームトレンド ───────────────────────────────────────────── -->
            <template v-if="viewMode === 'trend'">
              <div class="trend-controls">
                <label class="sel-label">チームを選択</label>
                <select v-model="trendTeam" class="sel-box" style="max-width:260px">
                  <option v-for="t in allTeams" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <template v-if="trendData.length">
                <!-- Summary chips -->
                <div class="trend-chips">
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.length }}</span>
                    <span class="tc-lbl">試合</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.filter(d=>d.result==='W').length }}</span>
                    <span class="tc-lbl">勝</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.filter(d=>d.result==='D').length }}</span>
                    <span class="tc-lbl">分</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.filter(d=>d.result==='L').length }}</span>
                    <span class="tc-lbl">負</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.reduce((s,d)=>s+d.gf,0) }}</span>
                    <span class="tc-lbl">得点</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.reduce((s,d)=>s+d.ga,0) }}</span>
                    <span class="tc-lbl">失点</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ trendData.reduce((s,d)=>s+(d.result==='W'?3:d.result==='D'?1:0),0) }}</span>
                    <span class="tc-lbl">勝点</span>
                  </div>
                  <div class="t-chip">
                    <span class="tc-val">{{ (trendData.reduce((s,d)=>s+d.gf,0)/trendData.length).toFixed(1) }}</span>
                    <span class="tc-lbl">得点/試合</span>
                  </div>
                </div>

                <!-- Goals trend chart -->
                <div class="chart-box">
                  <p class="chart-label">得点・失点推移（棒グラフ = 実績、折れ線 = 5試合移動平均）</p>
                  <div class="chart-wrap">
                    <svg :viewBox="`0 0 ${TW} ${TH}`" class="trend-svg">
                      <!-- Grid lines -->
                      <g v-for="v in Array.from({ length: maxG + 1 }, (_, i) => i)" :key="'g' + v">
                        <line :x1="TP" :y1="tY(v)" :x2="TW - TP" :y2="tY(v)" stroke="#1e293b" stroke-width="1"/>
                        <text :x="TP - 6" :y="tY(v) + 4" text-anchor="end" font-size="10" fill="#475569">{{ v }}</text>
                      </g>
                      <!-- X axis -->
                      <line :x1="TP" :y1="TH - TP" :x2="TW - TP" :y2="TH - TP" stroke="#334155" stroke-width="1.5"/>
                      <!-- Date labels -->
                      <g v-for="(d, i) in trendData" :key="'xl' + i">
                        <text v-if="i % Math.max(1, Math.floor(trendData.length / 12)) === 0" :x="tX(i)" :y="TH - TP + 14" text-anchor="middle" font-size="9" fill="#475569">{{ d.date.slice(5) }}</text>
                      </g>
                      <!-- Bars -->
                      <g v-for="(d, i) in trendData" :key="'bar' + i">
                        <rect :x="tX(i) - 5" :y="tY(d.gf)" width="5" :height="Math.max(1, TH - TP - tY(d.gf))" fill="#22c55e" opacity=".5"/>
                        <rect :x="tX(i)"     :y="tY(d.ga)" width="5" :height="Math.max(1, TH - TP - tY(d.ga))" fill="#ef4444" opacity=".5"/>
                      </g>
                      <!-- Rolling average lines -->
                      <polyline :points="polyline(trendRolling.map(r => r.gf))" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                      <polyline :points="polyline(trendRolling.map(r => r.ga))" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                      <!-- Data dots -->
                      <g v-for="(d, i) in trendData" :key="'dt' + i">
                        <circle :cx="tX(i)" :cy="tY(d.gf)" r="3" fill="#22c55e"/>
                        <circle :cx="tX(i)" :cy="tY(d.ga)" r="3" fill="#ef4444"/>
                      </g>
                    </svg>
                  </div>
                  <div class="chart-legend">
                    <span class="leg-item"><span class="leg-dot" style="background:#22c55e"></span>得点（5試合移動平均）</span>
                    <span class="leg-item"><span class="leg-dot" style="background:#ef4444"></span>失点（5試合移動平均）</span>
                  </div>
                </div>

                <!-- Cumulative points chart -->
                <div class="chart-box">
                  <p class="chart-label">累積勝点推移</p>
                  <div class="chart-wrap">
                    <svg :viewBox="`0 0 ${TW} ${TH}`" class="trend-svg">
                      <g v-for="v in Array.from({ length: Math.floor(cumulativeForm[cumulativeForm.length-1]/10)+2 }, (_,i)=>i*10)" :key="'cg'+v">
                        <line :x1="TP" :y1="TH - TP - (v / (cumulativeForm[cumulativeForm.length-1]||1)) * (TH - TP * 2)" :x2="TW - TP" :y2="TH - TP - (v / (cumulativeForm[cumulativeForm.length-1]||1)) * (TH - TP * 2)" stroke="#1e293b" stroke-width="1"/>
                        <text :x="TP - 6" :y="TH - TP - (v / (cumulativeForm[cumulativeForm.length-1]||1)) * (TH - TP * 2) + 4" text-anchor="end" font-size="10" fill="#475569">{{ v }}</text>
                      </g>
                      <line :x1="TP" :y1="TH - TP" :x2="TW - TP" :y2="TH - TP" stroke="#334155" stroke-width="1.5"/>
                      <polyline
                        :points="cumulativeForm.map((v, i) => `${tX(i)},${TH - TP - (v / (cumulativeForm[cumulativeForm.length-1]||1)) * (TH - TP * 2)}`).join(' ')"
                        fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"
                      />
                      <g v-for="(v, i) in cumulativeForm" :key="'cp'+i">
                        <circle :cx="tX(i)" :cy="TH - TP - (v / (cumulativeForm[cumulativeForm.length-1]||1)) * (TH - TP * 2)" r="3" fill="#38bdf8"/>
                      </g>
                    </svg>
                  </div>
                  <div class="chart-legend">
                    <span class="leg-item"><span class="leg-dot" style="background:#38bdf8"></span>累積勝点</span>
                  </div>
                </div>

                <!-- Match log -->
                <div class="match-log">
                  <h3 class="sub-title">全試合ログ</h3>
                  <div class="table-wrap">
                    <table class="data-table">
                      <thead><tr><th>日付</th><th>H/A</th><th>対戦相手</th><th>得</th><th>失</th><th>結果</th></tr></thead>
                      <tbody>
                        <tr v-for="d in trendData" :key="d.date + d.opponent" :class="'row-' + d.result.toLowerCase()">
                          <td>{{ d.date }}</td>
                          <td><span class="ha-badge" :class="d.isHome ? 'home' : 'away'">{{ d.isHome ? 'H' : 'A' }}</span></td>
                          <td>{{ d.opponent }}</td>
                          <td class="score-td">{{ d.gf }}</td>
                          <td class="score-td">{{ d.ga }}</td>
                          <td><span class="res-badge" :class="'res-' + d.result.toLowerCase()">{{ d.result === 'W' ? '勝' : d.result === 'L' ? '負' : '分' }}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </template>

            <!-- ── 順位表・強度分析 ────────────────────────────────────────── -->
            <template v-if="viewMode === 'table'">
              <p class="section-note">攻撃力・守備力はリーグ平均を1.00とした相対値（Poissonモデル推定）</p>
              <div class="table-wrap">
                <table class="data-table wide-table">
                  <thead>
                    <tr>
                      <th class="th-rank">順</th>
                      <th>チーム</th>
                      <th>試合</th>
                      <th>勝</th>
                      <th>分</th>
                      <th>負</th>
                      <th>得</th>
                      <th>失</th>
                      <th>得失</th>
                      <th>勝点</th>
                      <th title="攻撃力（高いほど得点しやすい）">攻撃力↑</th>
                      <th title="守備力（低いほど失点しにくい）">守備力↓</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(t, i) in leagueTable"
                      :key="t.name"
                      :class="{ 'hl-home': t.name === predHome, 'hl-away': t.name === predAway }"
                    >
                      <td class="td-rank">{{ i + 1 }}</td>
                      <td class="td-name">{{ t.name }}</td>
                      <td>{{ t.played }}</td>
                      <td>{{ t.w }}</td>
                      <td>{{ t.d }}</td>
                      <td>{{ t.l }}</td>
                      <td>{{ t.gf }}</td>
                      <td>{{ t.ga }}</td>
                      <td :class="t.gd >= 0 ? 'pos' : 'neg'">{{ t.gd >= 0 ? '+' : '' }}{{ t.gd }}</td>
                      <td class="td-pts">{{ t.pts }}</td>
                      <td>
                        <span class="strength-bar-wrap">
                          <span class="strength-bar" :style="{ width: Math.min(100, t.atk * 50) + '%', background: t.atk >= 1.2 ? '#22c55e' : t.atk >= 1 ? '#38bdf8' : '#64748b' }"></span>
                          <span class="strength-val">{{ t.atk.toFixed(2) }}</span>
                        </span>
                      </td>
                      <td>
                        <span class="strength-bar-wrap">
                          <span class="strength-bar" :style="{ width: Math.min(100, t.def * 50) + '%', background: t.def <= 0.8 ? '#22c55e' : t.def <= 1 ? '#38bdf8' : '#ef4444' }"></span>
                          <span class="strength-val">{{ t.def.toFixed(2) }}</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </template>
        </template>
      </main>
    </div>

    <footer class="footer">
      <p class="copy">© 2024 株式会社movee · データ提供: <a href="https://www.thesportsdb.com" target="_blank" rel="noopener">TheSportsDB</a></p>
    </footer>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { font-family: -apple-system,"Hiragino Sans",sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; }

/* Nav */
.nav { display:flex; align-items:center; justify-content:space-between; padding:18px 40px; background:rgba(15,23,42,.95); border-bottom:1px solid #1e293b; position:sticky; top:0; z-index:100; backdrop-filter:blur(8px); }
.nav-logo { font-weight:900; font-size:18px; color:#f8fafc; text-decoration:none; letter-spacing:-.04em; }
.nav-links { display:flex; gap:20px; }
.nav-links a { font-size:13px; color:#94a3b8; text-decoration:none; }
.nav-links a:hover { color:#f8fafc; }

/* Hero */
.hero-bar { padding:36px 40px 28px; border-bottom:1px solid #1e293b; background:linear-gradient(135deg,#0f172a 0%,#0c2340 100%); }
.hero-tag { font-size:11px; font-weight:700; letter-spacing:.12em; color:#4ade80; margin-bottom:8px; }
.hero-title { font-size:clamp(22px,4vw,34px); font-weight:800; color:#f8fafc; letter-spacing:-.03em; margin-bottom:8px; }
.hero-sub { font-size:14px; color:#94a3b8; }

/* Layout */
.layout { display:flex; flex:1; }
.sidebar { width:240px; flex-shrink:0; border-right:1px solid #1e293b; overflow-y:auto; max-height:calc(100vh - 120px); position:sticky; top:57px; }
.sidebar-section { padding:16px; border-bottom:1px solid #1e293b; }
.sidebar-heading { font-size:11px; font-weight:700; letter-spacing:.1em; color:#64748b; margin-bottom:8px; }
.comp-list { list-style:none; display:flex; flex-direction:column; gap:3px; }
.comp-item { padding:8px 10px; border-radius:6px; font-size:13px; cursor:pointer; color:#94a3b8; transition:all .15s; }
.comp-item:hover { background:#1e293b; color:#e2e8f0; }
.comp-item.active { background:#0c2340; color:#4ade80; font-weight:700; }
.sidebar-stats { display:flex; flex-direction:column; gap:8px; }
.mini-stat { display:flex; justify-content:space-between; align-items:center; }
.ms-val { font-size:16px; font-weight:800; color:#f8fafc; font-family:ui-monospace,monospace; }
.ms-lbl { font-size:11px; color:#64748b; }

/* Main */
.main { flex:1; padding:24px 28px 60px; overflow-x:hidden; }
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; height:400px; gap:16px; color:#475569; }
.empty-icon { font-size:48px; }
.empty-state p { font-size:15px; }
.loading { display:flex; align-items:center; justify-content:center; gap:12px; padding:80px; color:#64748b; font-size:14px; }
.spin { width:20px; height:20px; border:2px solid #334155; border-top-color:#4ade80; border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.comp-label { font-size:13px; color:#64748b; margin-bottom:16px; }
.info-box { background:#1e293b; border:1px solid #334155; border-radius:8px; padding:14px 18px; font-size:13px; color:#64748b; }

/* View switcher */
.view-switcher { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px; }
.view-switcher button { padding:8px 18px; border-radius:8px; border:1px solid #334155; background:transparent; color:#94a3b8; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; }
.view-switcher button:hover { border-color:#475569; color:#e2e8f0; }
.view-switcher button.active { background:#15803d; border-color:#15803d; color:#fff; }

/* VS row */
.vs-row { display:flex; align-items:flex-end; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
.team-sel-wrap { flex:1; min-width:160px; }
.sel-label { display:block; font-size:11px; color:#64748b; margin-bottom:6px; font-weight:600; letter-spacing:.06em; }
.sel-box { width:100%; background:#1e293b; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; }
.sel-box:focus { outline:none; border-color:#4ade80; }
.vs-badge { font-size:16px; font-weight:900; color:#475569; padding-bottom:10px; }

/* Prediction card */
.prob-card { background:#1e293b; border-radius:14px; padding:22px; border:1px solid #334155; margin-bottom:20px; }
.prob-team-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.prob-team-block { display:flex; flex-direction:column; gap:4px; max-width:40%; }
.prob-team-block.center { align-items:center; max-width:20%; }
.prob-team-block.right { align-items:flex-end; }
.prob-team-name { font-size:14px; font-weight:700; color:#f8fafc; word-break:break-word; }
.prob-team-role { font-size:10px; font-weight:700; letter-spacing:.1em; color:#64748b; }
.prob-match-label { font-size:11px; color:#64748b; }
.prob-bar-wrap { display:flex; height:52px; border-radius:10px; overflow:hidden; gap:2px; margin-bottom:12px; }
.prob-seg { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; min-width:50px; transition:flex .4s; }
.prob-seg.home { background:#1d4ed8; }
.prob-seg.draw { background:#475569; }
.prob-seg.away { background:#9f1239; }
.prob-pct-lbl { font-size:14px; font-weight:800; color:#fff; }
.prob-result-lbl { font-size:10px; color:rgba(255,255,255,.7); }
.xg-row { display:flex; align-items:center; gap:12px; margin-top:12px; }
.xg-block { flex:1; text-align:center; background:#0f172a; border-radius:8px; padding:12px; }
.xg-block.right { text-align:center; }
.xg-num { display:block; font-size:24px; font-weight:900; color:#4ade80; font-family:ui-monospace,monospace; }
.xg-lbl { display:block; font-size:11px; color:#64748b; margin-top:2px; }
.xg-sep { color:#334155; font-size:20px; }

/* Score predictions */
.scores-section { margin-bottom:24px; }
.sub-title { font-size:14px; font-weight:700; color:#f8fafc; margin-bottom:12px; }
.scores-grid { display:flex; flex-direction:column; gap:8px; }
.score-chip { display:grid; grid-template-columns:24px 60px 1fr 52px; align-items:center; gap:12px; background:#1e293b; border-radius:8px; padding:10px 14px; border:1px solid #334155; }
.score-chip.top { border-color:#4ade80; background:#0c2340; }
.sc-rank { font-size:11px; color:#64748b; font-family:ui-monospace,monospace; }
.sc-score { font-size:16px; font-weight:800; color:#f8fafc; font-family:ui-monospace,monospace; }
.sc-bar-wrap { height:6px; background:#0f172a; border-radius:3px; overflow:hidden; }
.sc-bar { height:100%; border-radius:3px; transition:width .3s; }
.sc-prob { font-size:13px; font-weight:700; color:#94a3b8; text-align:right; font-family:ui-monospace,monospace; }

/* H2H */
.h2h-section { }
.h2h-list { display:flex; flex-direction:column; gap:6px; }
.h2h-row { display:grid; grid-template-columns:90px 1fr 56px 1fr; align-items:center; gap:8px; background:#1e293b; border-radius:8px; padding:10px 14px; font-size:13px; }
.h2h-date { font-size:11px; color:#64748b; font-family:ui-monospace,monospace; }
.h2h-teams { color:#e2e8f0; }
.h2h-score { font-size:15px; font-weight:800; text-align:center; color:#94a3b8; font-family:ui-monospace,monospace; }
.h2h-score.home-win { color:#38bdf8; }
.h2h-score.away-win { color:#f97316; }

/* Trend */
.trend-controls { margin-bottom:20px; }
.trend-chips { display:grid; grid-template-columns:repeat(auto-fill,minmax(80px,1fr)); gap:10px; margin-bottom:20px; }
.t-chip { background:#1e293b; border-radius:10px; padding:12px; text-align:center; border:1px solid #334155; }
.tc-val { display:block; font-size:22px; font-weight:800; color:#f8fafc; font-family:ui-monospace,monospace; }
.tc-lbl { display:block; font-size:10px; color:#64748b; margin-top:3px; }

.chart-box { background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:16px; margin-bottom:16px; }
.chart-label { font-size:12px; color:#64748b; margin-bottom:10px; }
.chart-wrap { overflow-x:auto; }
.trend-svg { display:block; min-width:400px; width:100%; height:auto; }
.chart-legend { display:flex; gap:20px; margin-top:10px; flex-wrap:wrap; }
.leg-item { display:flex; align-items:center; gap:6px; font-size:12px; color:#94a3b8; }
.leg-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

.match-log { margin-top:20px; }
.table-wrap { overflow-x:auto; }
.data-table { width:100%; border-collapse:collapse; font-size:12px; }
.data-table th { padding:8px 12px; background:#1e293b; color:#64748b; font-size:10px; font-weight:600; letter-spacing:.06em; border-bottom:1px solid #334155; text-align:left; white-space:nowrap; }
.data-table td { padding:8px 12px; border-bottom:1px solid #1e293b; color:#e2e8f0; }
.data-table tr:hover td { background:#1e293b55; }
.ha-badge { display:inline-block; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:700; }
.ha-badge.home { background:#1d4ed8; color:#fff; }
.ha-badge.away { background:#334155; color:#e2e8f0; }
.res-badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
.res-w { background:#15803d; color:#fff; }
.res-l { background:#9f1239; color:#fff; }
.res-d { background:#334155; color:#94a3b8; }
.score-td { font-weight:700; font-family:ui-monospace,monospace; }
.row-w td { background:rgba(21,128,61,.06); }
.row-l td { background:rgba(159,18,57,.06); }

/* League table */
.section-note { font-size:12px; color:#64748b; margin-bottom:14px; }
.wide-table { min-width:700px; }
.th-rank { width:36px; }
.td-rank { font-weight:700; color:#64748b; text-align:center; }
.td-name { font-weight:600; min-width:120px; }
.td-pts { font-weight:800; color:#4ade80; }
.pos { color:#22c55e; font-weight:600; }
.neg { color:#ef4444; font-weight:600; }
.hl-home td { background:rgba(29,78,216,.12) !important; }
.hl-away td { background:rgba(159,18,57,.12) !important; }
.strength-bar-wrap { display:flex; align-items:center; gap:8px; }
.strength-bar { height:6px; border-radius:3px; flex-shrink:0; display:block; transition:width .3s; }
.strength-val { font-size:12px; font-family:ui-monospace,monospace; color:#94a3b8; white-space:nowrap; }

/* Footer */
.footer { padding:18px 40px; border-top:1px solid #1e293b; }
.copy { font-size:12px; color:#475569; }
.copy a { color:#4ade80; text-decoration:none; }

/* Mobile */
@media (max-width:768px) {
  .layout { flex-direction:column; }
  .sidebar { width:100%; max-height:none; position:static; border-right:none; border-bottom:1px solid #1e293b; }
  .nav,.main,.footer,.hero-bar { padding-left:16px; padding-right:16px; }
  .vs-row { flex-direction:column; }
}
</style>
