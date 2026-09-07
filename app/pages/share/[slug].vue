<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

interface ShareEntry {
  title: string;
  description: string;
  image: string;
  path: string;
}

const SHARE_MAP: Record<string, ShareEntry> = {
  // ── MLB ──
  "mlb":           { title: "MLB Analysis | movee",          description: "MLBリアルタイム順位・予告先発・勝率予測・月別本塁打ランキング",     image: "/mlb-analysis.png", path: "/mlb-analysis" },
  "mlb-standings": { title: "MLB 順位表 | movee",             description: "MLBリアルタイム地区別順位表・勝率・ゲーム差",                     image: "/mlb-analysis.png", path: "/mlb-analysis?tab=standings" },
  "mlb-today":     { title: "MLB 本日の試合 | movee",          description: "本日のMLB試合・予告先発投手・投手成績",                          image: "/mlb-analysis.png", path: "/mlb-analysis?tab=today" },
  "mlb-predict":   { title: "MLB 勝率予測 | movee",            description: "MLB試合勝率シミュレーター・先発投手別予測",                       image: "/mlb-analysis.png", path: "/mlb-analysis?tab=predict" },
  "mlb-stats":     { title: "MLB チーム成績 | movee",          description: "MLBチーム打率・本塁打・防御率ランキング",                         image: "/mlb-analysis.png", path: "/mlb-analysis?tab=stats" },
  "mlb-hr":        { title: "MLB 本塁打ランキング | movee",     description: "MLB本塁打ランキング・選手別月間推移グラフ",                       image: "/mlb-analysis.png", path: "/mlb-analysis?tab=players&stat=hr" },
  "mlb-avg":       { title: "MLB 打率ランキング | movee",       description: "MLB打率ランキング・選手別月別推移グラフ",                         image: "/mlb-analysis.png", path: "/mlb-analysis?tab=players&stat=avg" },
  "mlb-sb":        { title: "MLB 盗塁ランキング | movee",       description: "MLB盗塁ランキング・選手別月間推移グラフ",                         image: "/mlb-analysis.png", path: "/mlb-analysis?tab=players&stat=sb" },
  "mlb-era":       { title: "MLB 防御率ランキング | movee",     description: "MLB防御率ランキング・選手別月別推移グラフ",                       image: "/mlb-analysis.png", path: "/mlb-analysis?tab=players&stat=era" },
  "mlb-so":        { title: "MLB 奪三振ランキング | movee",     description: "MLB奪三振ランキング・選手別月間推移グラフ",                       image: "/mlb-analysis.png", path: "/mlb-analysis?tab=players&stat=so" },

  // ── NPB ──
  "npb":           { title: "NPB 野球分析 | movee",            description: "NPBリアルタイム順位表・チーム分析・勝率予測（セ・パ両リーグ）",    image: "/npb-analysis.png", path: "/npb-analysis" },
  "npb-today":     { title: "NPB 今日の試合 | movee",           description: "本日のNPB試合・勝率予測シミュレーター",                          image: "/npb-analysis.png", path: "/npb-analysis?tab=today" },
  "npb-standings": { title: "NPB 順位表 | movee",              description: "NPBリアルタイム順位表・セ・パ両リーグ",                          image: "/npb-analysis.png", path: "/npb-analysis?tab=standings" },
  "npb-predict":   { title: "NPB 勝率予測 | movee",            description: "NPB試合勝率シミュレーター",                                      image: "/npb-analysis.png", path: "/npb-analysis?tab=predict" },
  "npb-analysis":  { title: "NPB チーム分析 | movee",           description: "NPBチーム分析・本拠地vsビジター勝率比較",                        image: "/npb-analysis.png", path: "/npb-analysis?tab=analysis" },

  // ── Euro ──
  "euro":          { title: "Euro Football Analysis | movee", description: "欧州サッカー6リーグ順位・ポアソン勝率予測・得点ランキング",         image: "/euro-analysis.png", path: "/euro-analysis" },
  "euro-pl":       { title: "プレミアリーグ分析 | movee",       description: "プレミアリーグ順位・次節試合・勝率予測・得点ランキング",           image: "/euro-analysis.png", path: "/euro-analysis?league=PL" },
  "euro-pd":       { title: "ラ・リーガ分析 | movee",           description: "ラ・リーガ順位・次節試合・勝率予測・得点ランキング",               image: "/euro-analysis.png", path: "/euro-analysis?league=PD" },
  "euro-bl1":      { title: "ブンデスリーガ分析 | movee",        description: "ブンデスリーガ順位・次節試合・勝率予測・得点ランキング",           image: "/euro-analysis.png", path: "/euro-analysis?league=BL1" },
  "euro-sa":       { title: "セリエA分析 | movee",              description: "セリエA順位・次節試合・勝率予測・得点ランキング",                 image: "/euro-analysis.png", path: "/euro-analysis?league=SA" },
  "euro-fl1":      { title: "リーグ・アン分析 | movee",          description: "リーグ・アン順位・次節試合・勝率予測・得点ランキング",             image: "/euro-analysis.png", path: "/euro-analysis?league=FL1" },
  "euro-cl":       { title: "チャンピオンズリーグ分析 | movee",   description: "UCL順位・次節試合・勝率予測・得点ランキング",                   image: "/euro-analysis.png", path: "/euro-analysis?league=CL" },
};

const entry = SHARE_MAP[slug] ?? SHARE_MAP["mlb"];
const pageUrl = `https://www.movee.jp/share/${slug}`;
const imageUrl = `https://www.movee.jp${entry.image}`;

useHead({
  title: entry.title,
  meta: [
    { property: "og:type",        content: "website" },
    { property: "og:url",         content: pageUrl },
    { property: "og:title",       content: entry.title },
    { property: "og:description", content: entry.description },
    { property: "og:image",       content: imageUrl },
    { property: "og:image:width", content: "1254" },
    { property: "og:image:height",content: "1254" },
    { name: "twitter:card",        content: "summary_large_image" },
    { name: "twitter:title",       content: entry.title },
    { name: "twitter:description", content: entry.description },
    { name: "twitter:image",       content: imageUrl },
  ],
});

onMounted(() => {
  navigateTo(entry.path, { replace: true });
});
</script>

<template>
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:#888">
    リダイレクト中...
  </div>
</template>
