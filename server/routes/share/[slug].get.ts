interface ShareEntry {
  title: string;
  description: string;
  image: string;
  target: string;
}

const BASE = "https://www.movee.jp";

const SHARE_MAP: Record<string, ShareEntry> = {
  // ── MLB ──
  "mlb":           { title: "MLB Analysis | movee", description: "MLBリアルタイム順位・予告先発・勝率予測・月別本塁打ランキング", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis` },
  "mlb-standings": { title: "MLB 順位表 | movee",   description: "MLBリアルタイム地区別順位表・勝率・ゲーム差", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=standings` },
  "mlb-today":     { title: "MLB 本日の試合 | movee", description: "本日のMLB試合・予告先発投手・投手成績", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=today` },
  "mlb-predict":   { title: "MLB 勝率予測 | movee",  description: "MLB試合勝率シミュレーター・先発投手別予測", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=predict` },
  "mlb-stats":     { title: "MLB チーム成績 | movee", description: "MLBチーム打率・本塁打・防御率ランキング", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=stats` },
  "mlb-hr":        { title: "MLB 本塁打ランキング | movee", description: "MLB本塁打ランキング・選手別月間推移グラフ", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=players&stat=hr` },
  "mlb-avg":       { title: "MLB 打率ランキング | movee",   description: "MLB打率ランキング・選手別月別推移グラフ", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=players&stat=avg` },
  "mlb-sb":        { title: "MLB 盗塁ランキング | movee",   description: "MLB盗塁ランキング・選手別月間推移グラフ", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=players&stat=sb` },
  "mlb-era":       { title: "MLB 防御率ランキング | movee",  description: "MLB防御率ランキング・選手別月別推移グラフ", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=players&stat=era` },
  "mlb-so":        { title: "MLB 奪三振ランキング | movee",  description: "MLB奪三振ランキング・選手別月間推移グラフ", image: `${BASE}/mlb-analysis.png`, target: `${BASE}/mlb-analysis?tab=players&stat=so` },

  // ── NPB ──
  "npb":           { title: "NPB 野球分析 | movee",  description: "NPBリアルタイム順位表・チーム分析・勝率予測（セ・パ両リーグ）", image: `${BASE}/npb-analysis.png`, target: `${BASE}/npb-analysis` },
  "npb-today":     { title: "NPB 今日の試合 | movee", description: "本日のNPB試合・勝率予測シミュレーター", image: `${BASE}/npb-analysis.png`, target: `${BASE}/npb-analysis?tab=today` },
  "npb-standings": { title: "NPB 順位表 | movee",    description: "NPBリアルタイム順位表・セ・パ両リーグ", image: `${BASE}/npb-analysis.png`, target: `${BASE}/npb-analysis?tab=standings` },
  "npb-predict":   { title: "NPB 勝率予測 | movee",  description: "NPB試合勝率シミュレーター", image: `${BASE}/npb-analysis.png`, target: `${BASE}/npb-analysis?tab=predict` },
  "npb-analysis":  { title: "NPB チーム分析 | movee", description: "NPBチーム分析・本拠地vsビジター勝率比較", image: `${BASE}/npb-analysis.png`, target: `${BASE}/npb-analysis?tab=analysis` },

  // ── Euro ──
  "euro":     { title: "Euro Football Analysis | movee", description: "欧州サッカー6リーグ順位・ポアソン勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis` },
  "euro-pl":  { title: "プレミアリーグ分析 | movee", description: "プレミアリーグ順位・次節試合・勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis?league=PL` },
  "euro-pd":  { title: "ラ・リーガ分析 | movee",    description: "ラ・リーガ順位・次節試合・勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis?league=PD` },
  "euro-bl1": { title: "ブンデスリーガ分析 | movee", description: "ブンデスリーガ順位・次節試合・勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis?league=BL1` },
  "euro-sa":  { title: "セリエA分析 | movee",       description: "セリエA順位・次節試合・勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis?league=SA` },
  "euro-fl1": { title: "リーグ・アン分析 | movee",   description: "リーグ・アン順位・次節試合・勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis?league=FL1` },
  "euro-cl":  { title: "チャンピオンズリーグ分析 | movee", description: "UCL順位・次節試合・勝率予測・得点ランキング", image: `${BASE}/euro-analysis.png`, target: `${BASE}/euro-analysis?league=CL` },
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const entry = SHARE_MAP[slug] ?? SHARE_MAP["mlb"];
  const pageUrl = `${BASE}/share/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${esc(entry.target)}">
<title>${esc(entry.title)}</title>
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(pageUrl)}">
<meta property="og:title" content="${esc(entry.title)}">
<meta property="og:description" content="${esc(entry.description)}">
<meta property="og:image" content="${esc(entry.image)}">
<meta property="og:image:width" content="1254">
<meta property="og:image:height" content="1254">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(entry.title)}">
<meta name="twitter:description" content="${esc(entry.description)}">
<meta name="twitter:image" content="${esc(entry.image)}">
<script>location.replace(${JSON.stringify(entry.target)})<\/script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px;color:#888">
リダイレクト中...
</body>
</html>`;

  setHeader(event, "Content-Type", "text/html; charset=utf-8");
  return html;
});
