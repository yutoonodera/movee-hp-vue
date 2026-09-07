<script setup lang="ts">
useHead({ title: "サッカー分析 — StatsBomb — movee" });

interface Competition {
  competition_id: number;
  season_id: number;
  label: string;
}
interface Match {
  match_id: number;
  match_date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  stage: string;
}
interface Shot {
  id: string;
  minute: number;
  second: number;
  period: number;
  team: string;
  player: string;
  location: [number, number];
  xg: number;
  outcome: string;
  technique: string;
  bodyPart: string;
  endLocation: [number, number];
}
interface Pass {
  id: string;
  team: string;
  player: string;
  location: [number, number];
  endLocation: [number, number];
  length: number;
  outcome: string;
  shotAssist: boolean;
  goalAssist: boolean;
}

const selectedComp = ref<Competition | null>(null);
const selectedMatch = ref<Match | null>(null);
const viewMode = ref<"shots" | "passes">("shots");
const tooltip = ref<{ x: number; y: number; text: string } | null>(null);

const { data: competitions } = await useFetch<Competition[]>("/api/statsbomb/competitions");

const { data: matches, status: matchStatus } = useFetch<Match[]>(
  () =>
    selectedComp.value
      ? `/api/statsbomb/matches/${selectedComp.value.competition_id}/${selectedComp.value.season_id}`
      : null,
  { watch: [selectedComp] },
);

const { data: eventData, status: eventStatus } = useFetch<{
  shots: Shot[];
  passes: Pass[];
  teamNames: string[];
}>(
  () => (selectedMatch.value ? `/api/statsbomb/events/${selectedMatch.value.match_id}` : null),
  { watch: [selectedMatch] },
);

function selectComp(c: Competition) {
  selectedComp.value = c;
  selectedMatch.value = null;
}

// Pitch SVG dimensions
const PW = 120; // pitch width in yards
const PH = 80;  // pitch height in yards
const SVG_W = 840;
const SVG_H = 560;
const PAD = 30;
const scaleX = (SVG_W - PAD * 2) / PW;
const scaleY = (SVG_H - PAD * 2) / PH;

function px(x: number) { return PAD + x * scaleX; }
function py(y: number) { return PAD + y * scaleY; }

const shots = computed(() => eventData.value?.shots ?? []);
const passes = computed(() => eventData.value?.passes ?? []);
const teamNames = computed(() => eventData.value?.teamNames ?? []);

// Team colors
const teamColor = computed(() => {
  const names = teamNames.value;
  return {
    [names[0]]: "#3b82f6",
    [names[1]]: "#ef4444",
  };
});

function shotColor(s: Shot) {
  if (s.outcome === "Goal") return "#22c55e";
  if (s.outcome === "Saved") return "#f97316";
  if (s.outcome === "Blocked") return "#a855f7";
  return "#94a3b8";
}

function shotR(s: Shot) {
  return Math.max(4, Math.min(14, 4 + s.xg * 60));
}

const teamStats = computed(() => {
  const names = teamNames.value;
  return names.map((name) => {
    const ts = shots.value.filter((s) => s.team === name);
    const goals = ts.filter((s) => s.outcome === "Goal").length;
    const xg = ts.reduce((a, s) => a + s.xg, 0);
    const onTarget = ts.filter((s) => ["Goal", "Saved"].includes(s.outcome)).length;
    return { name, shots: ts.length, goals, xg: xg.toFixed(2), onTarget };
  });
});

const topShooters = computed(() => {
  const map = new Map<string, { team: string; shots: number; goals: number; xg: number }>();
  shots.value.forEach((s) => {
    const cur = map.get(s.player) ?? { team: s.team, shots: 0, goals: 0, xg: 0 };
    map.set(s.player, {
      team: s.team,
      shots: cur.shots + 1,
      goals: cur.goals + (s.outcome === "Goal" ? 1 : 0),
      xg: cur.xg + s.xg,
    });
  });
  return [...map.entries()]
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.shots - a.shots)
    .slice(0, 8);
});

const passStats = computed(() => {
  const names = teamNames.value;
  return names.map((name) => {
    const tp = passes.value.filter((p) => p.team === name);
    const complete = tp.filter((p) => p.outcome === "Complete").length;
    const keyPasses = tp.filter((p) => p.shotAssist).length;
    const assists = tp.filter((p) => p.goalAssist).length;
    const avgLength = tp.length ? (tp.reduce((a, p) => a + p.length, 0) / tp.length).toFixed(1) : "0";
    return { name, total: tp.length, complete, pct: tp.length ? Math.round(complete / tp.length * 100) : 0, keyPasses, assists, avgLength };
  });
});

function showTip(e: MouseEvent, s: Shot) {
  tooltip.value = {
    x: (e as any).layerX ?? 0,
    y: (e as any).layerY ?? 0,
    text: `${s.player}\n${s.outcome} (xG: ${s.xg.toFixed(3)})\n${s.minute}'${s.period > 1 ? " ET" : ""}`,
  };
}
function hideTip() { tooltip.value = null; }
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
      <h1 class="hero-title">サッカー分析</h1>
      <p class="hero-sub">StatsBomb Open Data を用いたシュート・パス分析</p>
    </div>

    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <section class="sidebar-section">
          <h2 class="sidebar-heading">コンペティション</h2>
          <ul class="comp-list">
            <li
              v-for="c in competitions"
              :key="`${c.competition_id}-${c.season_id}`"
              class="comp-item"
              :class="{ active: selectedComp?.competition_id === c.competition_id && selectedComp?.season_id === c.season_id }"
              @click="selectComp(c)"
            >
              {{ c.label }}
            </li>
          </ul>
        </section>

        <section v-if="selectedComp" class="sidebar-section">
          <h2 class="sidebar-heading">試合を選択</h2>
          <div v-if="matchStatus === 'pending'" class="loading-sm">読み込み中…</div>
          <ul v-else class="match-list">
            <li
              v-for="m in matches"
              :key="m.match_id"
              class="match-item"
              :class="{ active: selectedMatch?.match_id === m.match_id }"
              @click="selectedMatch = m"
            >
              <span class="match-teams">{{ m.home_team }} {{ m.home_score }}–{{ m.away_score }} {{ m.away_team }}</span>
              <span class="match-date">{{ m.match_date }}</span>
            </li>
          </ul>
        </section>
      </aside>

      <!-- Main content -->
      <main class="main">
        <div v-if="!selectedMatch" class="empty-state">
          <div class="empty-icon">⚽</div>
          <p>左のメニューからコンペテ��ションと試合を選んでください</p>
        </div>

        <template v-else>
          <!-- Match header -->
          <div class="match-header">
            <div class="match-score-block">
              <span class="team-name home">{{ selectedMatch.home_team }}</span>
              <span class="score">{{ selectedMatch.home_score }} – {{ selectedMatch.away_score }}</span>
              <span class="team-name away">{{ selectedMatch.away_team }}</span>
            </div>
            <p class="match-meta">{{ selectedMatch.match_date }} · {{ selectedMatch.stage }}</p>
          </div>

          <div v-if="eventStatus === 'pending'" class="loading">イベントデータを読み込み中…</div>

          <template v-else-if="eventData">
            <!-- View switcher -->
            <div class="view-switcher">
              <button :class="{ active: viewMode === 'shots' }" @click="viewMode = 'shots'">シュートマップ</button>
              <button :class="{ active: viewMode === 'passes' }" @click="viewMode = 'passes'">パスマップ</button>
            </div>

            <!-- Stats row -->
            <div class="stats-row">
              <div v-for="ts in teamStats" :key="ts.name" class="stats-card">
                <p class="stats-team">{{ ts.name }}</p>
                <div class="stats-grid">
                  <div class="stat-cell">
                    <span class="stat-val">{{ ts.goals }}</span>
                    <span class="stat-lbl">ゴール</span>
                  </div>
                  <div class="stat-cell">
                    <span class="stat-val">{{ ts.shots }}</span>
                    <span class="stat-lbl">シュート数</span>
                  </div>
                  <div class="stat-cell">
                    <span class="stat-val">{{ ts.xg }}</span>
                    <span class="stat-lbl">xG</span>
                  </div>
                  <div class="stat-cell">
                    <span class="stat-val">{{ ts.onTarget }}</span>
                    <span class="stat-lbl">枠内</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shot map -->
            <div v-if="viewMode === 'shots'" class="pitch-wrap">
              <div class="pitch-legend">
                <span class="leg-item"><span class="leg-dot" style="background:#22c55e"></span>ゴール</span>
                <span class="leg-item"><span class="leg-dot" style="background:#f97316"></span>セーブ</span>
                <span class="leg-item"><span class="leg-dot" style="background:#a855f7"></span>ブロック</span>
                <span class="leg-item"><span class="leg-dot" style="background:#94a3b8"></span>外れ</span>
                <span class="leg-item leg-size">サイズ = xG</span>
              </div>
              <div class="pitch-container" @mouseleave="hideTip">
                <svg :viewBox="`0 0 ${SVG_W} ${SVG_H}`" class="pitch-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Pitch markings -->
                  <rect :x="px(0)" :y="py(0)" :width="PW*scaleX" :height="PH*scaleY" fill="#2d7a3a" stroke="#fff" stroke-width="2"/>
                  <!-- Center line -->
                  <line :x1="px(60)" :y1="py(0)" :x2="px(60)" :y2="py(80)" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <!-- Center circle -->
                  <circle :cx="px(60)" :cy="py(40)" :r="9.15*scaleX" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <!-- Center spot -->
                  <circle :cx="px(60)" :cy="py(40)" r="3" fill="#fff" opacity="0.7"/>
                  <!-- Left penalty area -->
                  <rect :x="px(0)" :y="py(18)" :width="18*scaleX" :height="44*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <!-- Left 6-yard box -->
                  <rect :x="px(0)" :y="py(30)" :width="6*scaleX" :height="20*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <!-- Left goal -->
                  <rect :x="px(-2)" :y="py(36)" :width="2*scaleX" :height="8*scaleY" fill="none" stroke="#fff" stroke-width="2"/>
                  <!-- Right penalty area -->
                  <rect :x="px(102)" :y="py(18)" :width="18*scaleX" :height="44*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <!-- Right 6-yard box -->
                  <rect :x="px(114)" :y="py(30)" :width="6*scaleX" :height="20*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <!-- Right goal -->
                  <rect :x="px(120)" :y="py(36)" :width="2*scaleX" :height="8*scaleY" fill="none" stroke="#fff" stroke-width="2"/>
                  <!-- Left penalty spot -->
                  <circle :cx="px(12)" :cy="py(40)" r="2.5" fill="#fff" opacity="0.7"/>
                  <!-- Right penalty spot -->
                  <circle :cx="px(108)" :cy="py(40)" r="2.5" fill="#fff" opacity="0.7"/>

                  <!-- Shots -->
                  <g v-for="s in shots" :key="s.id">
                    <circle
                      :cx="px(s.location[0])"
                      :cy="py(s.location[1])"
                      :r="shotR(s)"
                      :fill="shotColor(s)"
                      :stroke="s.outcome === 'Goal' ? '#fff' : 'rgba(0,0,0,0.2)'"
                      :stroke-width="s.outcome === 'Goal' ? 2 : 1"
                      :opacity="s.outcome === 'Goal' ? 1 : 0.75"
                      style="cursor:pointer"
                      @mousemove="showTip($event, s)"
                      @mouseleave="hideTip"
                    />
                    <text
                      v-if="s.outcome === 'Goal'"
                      :x="px(s.location[0])"
                      :y="py(s.location[1]) + 4"
                      text-anchor="middle"
                      font-size="10"
                      fill="#fff"
                      font-weight="bold"
                      style="pointer-events:none"
                    >G</text>
                  </g>
                </svg>

                <!-- Tooltip -->
                <div
                  v-if="tooltip"
                  class="tooltip"
                  :style="{ left: tooltip.x + 16 + 'px', top: tooltip.y - 8 + 'px' }"
                >
                  <span v-for="(line, i) in tooltip.text.split('\n')" :key="i" class="tip-line">{{ line }}</span>
                </div>
              </div>
            </div>

            <!-- Pass map -->
            <div v-if="viewMode === 'passes'" class="pitch-wrap">
              <div class="pitch-legend">
                <span v-for="(color, name) in teamColor" :key="name" class="leg-item">
                  <span class="leg-dot" :style="{ background: color }"></span>{{ name }}
                </span>
                <span class="leg-item"><span class="leg-line" style="background:#fbbf24"></span>キーパス</span>
              </div>
              <div class="pitch-container">
                <svg :viewBox="`0 0 ${SVG_W} ${SVG_H}`" class="pitch-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Pitch markings (same) -->
                  <rect :x="px(0)" :y="py(0)" :width="PW*scaleX" :height="PH*scaleY" fill="#2d7a3a" stroke="#fff" stroke-width="2"/>
                  <line :x1="px(60)" :y1="py(0)" :x2="px(60)" :y2="py(80)" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <circle :cx="px(60)" :cy="py(40)" :r="9.15*scaleX" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <circle :cx="px(60)" :cy="py(40)" r="3" fill="#fff" opacity="0.7"/>
                  <rect :x="px(0)" :y="py(18)" :width="18*scaleX" :height="44*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <rect :x="px(0)" :y="py(30)" :width="6*scaleX" :height="20*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <rect :x="px(-2)" :y="py(36)" :width="2*scaleX" :height="8*scaleY" fill="none" stroke="#fff" stroke-width="2"/>
                  <rect :x="px(102)" :y="py(18)" :width="18*scaleX" :height="44*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <rect :x="px(114)" :y="py(30)" :width="6*scaleX" :height="20*scaleY" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
                  <rect :x="px(120)" :y="py(36)" :width="2*scaleX" :height="8*scaleY" fill="none" stroke="#fff" stroke-width="2"/>

                  <!-- Passes (sample to avoid overdraw — key passes in yellow, others transparent) -->
                  <g v-for="p in passes" :key="p.id">
                    <line
                      :x1="px(p.location[0])"
                      :y1="py(p.location[1])"
                      :x2="px(p.endLocation[0])"
                      :y2="py(p.endLocation[1])"
                      :stroke="p.goalAssist ? '#fbbf24' : p.shotAssist ? '#fbbf24' : (teamColor[p.team] ?? '#3b82f6')"
                      :stroke-width="p.goalAssist || p.shotAssist ? 2.5 : 0.8"
                      :opacity="p.goalAssist || p.shotAssist ? 0.9 : 0.12"
                    />
                  </g>
                  <!-- Key pass endpoints -->
                  <g v-for="p in passes.filter(p => p.shotAssist || p.goalAssist)" :key="'kp-' + p.id">
                    <circle
                      :cx="px(p.endLocation[0])"
                      :cy="py(p.endLocation[1])"
                      r="4"
                      fill="#fbbf24"
                      opacity="0.9"
                    />
                  </g>
                </svg>
              </div>

              <!-- Pass stats -->
              <div class="stats-row" style="margin-top:16px">
                <div v-for="ps in passStats" :key="ps.name" class="stats-card">
                  <p class="stats-team">{{ ps.name }}</p>
                  <div class="stats-grid">
                    <div class="stat-cell">
                      <span class="stat-val">{{ ps.total }}</span>
                      <span class="stat-lbl">総パス数</span>
                    </div>
                    <div class="stat-cell">
                      <span class="stat-val">{{ ps.pct }}%</span>
                      <span class="stat-lbl">成功率</span>
                    </div>
                    <div class="stat-cell">
                      <span class="stat-val">{{ ps.keyPasses }}</span>
                      <span class="stat-lbl">キーパス</span>
                    </div>
                    <div class="stat-cell">
                      <span class="stat-val">{{ ps.avgLength }}</span>
                      <span class="stat-lbl">平均距離(yd)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Player shots table -->
            <div v-if="viewMode === 'shots'" class="table-section">
              <h2 class="table-title">選手別シュート</h2>
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>選手名</th>
                      <th>チーム</th>
                      <th>シュート</th>
                      <th>ゴール</th>
                      <th>xG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in topShooters" :key="p.name">
                      <td>{{ p.name }}</td>
                      <td><span class="team-badge" :style="{ background: teamColor[p.team] }">{{ p.team }}</span></td>
                      <td>{{ p.shots }}</td>
                      <td class="goals-cell">{{ p.goals }}</td>
                      <td>{{ p.xg.toFixed(3) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </template>
        </template>
      </main>
    </div>

    <footer class="footer">
      <p class="copy">© 2024 株式会社movee · Data: <a href="https://github.com/statsbomb/open-data" target="_blank" rel="noopener">StatsBomb Open Data</a></p>
    </footer>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.page {
  font-family: -apple-system, "Hiragino Sans", sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Nav */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}
.nav-logo {
  font-weight: 900;
  font-size: 18px;
  color: #f8fafc;
  text-decoration: none;
  letter-spacing: -0.04em;
}
.nav-links { display: flex; gap: 20px; }
.nav-links a { font-size: 13px; color: #94a3b8; text-decoration: none; }
.nav-links a:hover { color: #f8fafc; }

/* Hero bar */
.hero-bar {
  padding: 40px 40px 32px;
  border-bottom: 1px solid #1e293b;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
}
.hero-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #38bdf8;
  margin-bottom: 8px;
}
.hero-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}
.hero-sub { font-size: 14px; color: #94a3b8; }

/* Layout */
.layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* Sidebar */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid #1e293b;
  overflow-y: auto;
  max-height: calc(100vh - 130px);
  position: sticky;
  top: 57px;
}
.sidebar-section { padding: 20px 16px; border-bottom: 1px solid #1e293b; }
.sidebar-heading { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; margin-bottom: 10px; }
.comp-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.comp-item {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.15s;
}
.comp-item:hover { background: #1e293b; color: #e2e8f0; }
.comp-item.active { background: #1e3a5f; color: #38bdf8; font-weight: 600; }
.match-list { list-style: none; display: flex; flex-direction: column; gap: 4px; max-height: 400px; overflow-y: auto; }
.match-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.match-item:hover { background: #1e293b; }
.match-item.active { background: #1e3a5f; border-color: #1d4ed8; }
.match-teams { display: block; font-size: 12px; font-weight: 600; color: #e2e8f0; line-height: 1.4; }
.match-date { font-size: 11px; color: #64748b; font-family: ui-monospace, monospace; }
.loading-sm { font-size: 12px; color: #64748b; padding: 8px 0; }

/* Main */
.main { flex: 1; padding: 28px 32px 60px; overflow-x: hidden; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
  color: #475569;
}
.empty-icon { font-size: 48px; }
.empty-state p { font-size: 15px; }

.loading { text-align: center; padding: 60px; color: #64748b; font-size: 14px; }

/* Match header */
.match-header {
  margin-bottom: 24px;
  background: #1e293b;
  border-radius: 12px;
  padding: 20px 24px;
}
.match-score-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 8px;
}
.team-name {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  max-width: 200px;
  text-align: center;
}
.score {
  font-size: 32px;
  font-weight: 900;
  color: #38bdf8;
  letter-spacing: -0.02em;
  font-family: ui-monospace, monospace;
}
.match-meta { text-align: center; font-size: 12px; color: #64748b; }

/* View switcher */
.view-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.view-switcher button {
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.view-switcher button:hover { border-color: #475569; color: #e2e8f0; }
.view-switcher button.active { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px; }
.stats-card {
  background: #1e293b;
  border-radius: 10px;
  padding: 16px 20px;
  border: 1px solid #334155;
}
.stats-team { font-size: 13px; font-weight: 700; color: #94a3b8; margin-bottom: 12px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.stat-cell { text-align: center; }
.stat-val { display: block; font-size: 22px; font-weight: 800; color: #f8fafc; font-family: ui-monospace, monospace; }
.stat-lbl { display: block; font-size: 10px; color: #64748b; margin-top: 2px; }

/* Pitch */
.pitch-wrap { margin-bottom: 28px; }
.pitch-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}
.leg-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }
.leg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.leg-line { width: 18px; height: 2.5px; display: inline-block; flex-shrink: 0; }
.leg-size { font-size: 11px; color: #64748b; }

.pitch-container {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #2d7a3a;
  border: 2px solid #1e293b;
}
.pitch-svg { display: block; width: 100%; height: auto; }

/* Tooltip */
.tooltip {
  position: absolute;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 220px;
}
.tip-line { color: #e2e8f0; white-space: nowrap; }
.tip-line:first-child { font-weight: 700; }

/* Table */
.table-section { margin-top: 24px; }
.table-title { font-size: 15px; font-weight: 700; color: #f8fafc; margin-bottom: 12px; }
.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.data-table th {
  text-align: left;
  padding: 10px 14px;
  background: #1e293b;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #334155;
}
.data-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #1e293b;
  color: #e2e8f0;
}
.data-table tr:hover td { background: #1e293b; }
.goals-cell { font-weight: 700; color: #22c55e; }
.team-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Footer */
.footer {
  padding: 20px 40px;
  border-top: 1px solid #1e293b;
  background: #0f172a;
}
.copy { font-size: 12px; color: #475569; }
.copy a { color: #38bdf8; text-decoration: none; }

/* Mobile */
@media (max-width: 768px) {
  .layout { flex-direction: column; }
  .sidebar { width: 100%; max-height: none; position: static; border-right: none; border-bottom: 1px solid #1e293b; }
  .nav, .main, .footer, .hero-bar { padding-left: 16px; padding-right: 16px; }
}
</style>
