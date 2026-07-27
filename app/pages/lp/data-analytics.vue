<script setup lang="ts">
useHead({ title: "接点顧客アプローチ分析 — 1人社長の営業を、丸投げで回す by movee" });
useSeoMeta({ description: "分析している時間はない。でも接点は溜まっている。CSVを送るだけで、今月動くべき人リストが届きます。1人社長のための営業支援サブスクです。" });
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-logo">movee</NuxtLink>
      <a href="mailto:info@movee.jp" class="nav-cta">相談する →</a>
    </header>

    <!-- ヒーロー -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">by movee · 1人社長のための接点顧客分析</p>
        <h1 class="hero-title">
          分析してる<br />暇はない。<br />
          <span class="title-sub">それでいい。</span>
        </h1>
        <p class="hero-body">
          営業も、運営も、経理も、全部1人。<br />
          接点は溜まってるのに、動けていない人がいる。<br />
          それを追いかける時間だけが足りない。<br /><br />
          <strong>CSVを送るだけで、今月動くべきリストを届けます。</strong>
        </p>
        <div class="hero-flow">
          <div class="flow-step">
            <span class="flow-num">1</span>
            <span class="flow-label">CSVを送る</span>
            <span class="flow-sub">5分でできる</span>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <span class="flow-num">2</span>
            <span class="flow-label">丸投げ</span>
            <span class="flow-sub">あとは全部こちら</span>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <span class="flow-num">3</span>
            <span class="flow-label">リストが届く</span>
            <span class="flow-sub">連絡するだけ</span>
          </div>
        </div>
        <a href="mailto:info@movee.jp" class="hero-btn">まず相談する</a>
      </div>
    </section>

    <main>

      <!-- 共感 -->
      <section class="band band-empathy">
        <div class="inner inner-narrow">
          <p class="empathy-lead">こんな状況、ありませんか。</p>
          <ul class="empathy-list">
            <li>展示会で名刺を集めたが、その後なにもしていない</li>
            <li>「またご連絡します」と言ったきり、数ヶ月が経った</li>
            <li>X（旧Twitter）やInstagramでつながっているのに、DMすら送っていない</li>
            <li>以前見積りを出したが、断られた後フォローしていない</li>
            <li>昔の職場や取引先に声をかければよさそうなのに、手が回らない</li>
          </ul>
          <p class="empathy-note">
            これは怠慢でも忘れているわけでもありません。<br />
            <strong>1人でやっているから、時間が足りないだけです。</strong>
          </p>
        </div>
      </section>

      <!-- 原体験 -->
      <section class="band band-story">
        <div class="inner inner-narrow">
          <p class="story-quote">
            「顧客管理ツールを導入したが、入力の手間がネックで続かなかった。細かい入力は現場の負担になる。もっとシンプルでいいはずだと、ずっと思っていた。」
          </p>
          <p class="story-body">
            代表自身が営業として感じてきたことです。ツールが悪いわけじゃない。入力し続ける時間と余裕がないだけ。<br /><br />
            だからこのサービスは、<strong>クライアントに新しい習慣を求めません。</strong>
            今あるデータをCSVでエクスポートして送るだけ。ツールも変えなくていい。入力も増やさなくていい。
          </p>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="band band-alt">
        <div class="inner">
          <p class="eyebrow">HOW IT WORKS</p>
          <h2 class="heading">日々書いて、月1回送る。<br />分析とアプローチ案はこちらがやる。</h2>
          <p class="section-lead">テンプレートに沿って営業活動を記録するだけ。月に1回CSVで送ってもらえれば、AIと人の目でアプローチ案まで仕上げてお届けします。</p>

          <div class="works-steps">
            <div class="works-step">
              <div class="works-step-num">01</div>
              <div class="works-step-body">
                <p class="works-step-title">テンプレートに日々の接点を記録する</p>
                <p class="works-step-desc">最初にスプレッドシートのテンプレートをお渡しします。商談・名刺交換・SNSでのやりとりなど、接点が生まれたらその都度書き足していくだけです。</p>
                <!-- スプレッドシートモック -->
                <div class="sheet-mock">
                  <div class="sheet-row sheet-header">
                    <span>名前</span><span>会社</span><span>チャネル</span><span>最終接触日</span><span>結果</span><span>金額</span><span>メモ</span><span>雑談メモ</span>
                  </div>
                  <div class="sheet-row">
                    <span>山田 太郎</span><span>株式会社○○</span><span>展示会</span><span>2025/11/12</span><span>検討中</span><span>50万</span><span>予算は来期</span><span>ゴルフ好き</span>
                  </div>
                  <div class="sheet-row">
                    <span>鈴木 花子</span><span>△△商事</span><span>X</span><span>2026/02/03</span><span>未連絡</span><span>—</span><span>DM返信あり</span><span>子育て中</span>
                  </div>
                  <div class="sheet-row sheet-faded">
                    <span>・・・</span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="works-step">
              <div class="works-step-num">02</div>
              <div class="works-step-body">
                <p class="works-step-title">月1回、CSVで送る<span class="step-time">（約5分）</span></p>
                <p class="works-step-desc">月末にスプレッドシートをCSVでエクスポートして送るだけ。エクスポートのやり方がわからなければ最初に一緒に確認します。</p>
              </div>
            </div>
            <div class="works-step">
              <div class="works-step-num">03</div>
              <div class="works-step-body">
                <p class="works-step-title">人の目で調査・精査してアプローチ案を仕上げる<span class="step-time">（すべてこちら）</span></p>
                <p class="works-step-desc">まずAIが未接触期間・結果・金額をもとに優先度スコアを算出します。その後、優先度の高い接点については<strong>人が一件ずつメモ・雑談メモを読み込み、必要に応じて追加リサーチを行ったうえで</strong>アプローチ案を書いています。AIが出した文章をそのまま渡すのではなく、実際に使える内容かを人が確認・調整してからお届けします。</p>
              </div>
            </div>
            <div class="works-step">
              <div class="works-step-num">04</div>
              <div class="works-step-body">
                <p class="works-step-title">アプローチリスト＋提案文が届く</p>
                <p class="works-step-desc">届いた内容をもとに連絡するだけ。「何を送ればいいかわからない」という状態をなくします。</p>
              </div>
            </div>
          </div>

          <!-- レポートモック -->
          <div class="report-mock">
            <div class="mock-header">
              <span class="mock-dot red"></span>
              <span class="mock-dot yellow"></span>
              <span class="mock-dot green"></span>
              <span class="mock-title">今月のアプローチレポート</span>
            </div>
            <div class="mock-body">
              <div class="mock-person">
                <div class="mock-person-header">
                  <div class="mock-person-info">
                    <span class="mock-person-name">山田 太郎 <span class="mock-person-co">/ 株式会社○○</span></span>
                    <span class="mock-person-meta">未接触 8ヶ月 · 展示会 · 検討中 · 予算50万</span>
                  </div>
                  <span class="badge high">優先度：高</span>
                </div>
                <div class="mock-approach">
                  <p class="mock-approach-label">アプローチ案</p>
                  <p class="mock-approach-text">「先日の展示会以来ご無沙汰しています。来期のご予算の時期かと思いご連絡しました。ゴルフの話題も含め、一度お茶でもいかがでしょうか。」</p>
                </div>
              </div>
              <div class="mock-person mock-person-faded">
                <div class="mock-person-header">
                  <div class="mock-person-info">
                    <span class="mock-person-name">鈴木 花子 <span class="mock-person-co">/ △△商事</span></span>
                    <span class="mock-person-meta">未接触 5ヶ月 · X · DM返信あり</span>
                  </div>
                  <span class="badge mid">優先度：中</span>
                </div>
                <div class="mock-approach">
                  <p class="mock-approach-label">アプローチ案</p>
                  <p class="mock-approach-text">「先日のポストにいいねありがとうございました。お子さん関連のお仕事もされているとのこと…」</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 習慣づけ -->
          <div class="habit-box">
            <p class="habit-title">「毎月送る」が、習慣になる。</p>
            <p class="habit-desc">
              最初は記録の習慣がなくても構いません。テンプレートに沿って書くだけなので、営業活動をしながら自然に溜まっていきます。<br />
              毎月レポートが届くサイクルを繰り返すことで、接点を管理する感覚が身についていきます。
            </p>
          </div>
        </div>
      </section>

      <!-- 料金 -->
      <section class="band band-white">
        <div class="inner">
          <p class="eyebrow">PRICING</p>
          <h2 class="heading">月5万円。<br />人を雇うより先に。</h2>
          <p class="section-lead">アルバイトを1人雇えば月10〜15万円。インターンでも8万円前後。このサービスは月5万円で、営業のアシスタントを1人持つ感覚で使えます。</p>

          <div class="pricing-grid">
            <div class="pricing-card">
              <p class="pricing-phase">PHASE 01 · 初期設定</p>
              <p class="pricing-desc">はじめてのCSVを受け取り、データ構造の確認・分析軸の設計・第一回レポートの作成を行います。</p>
              <p class="pricing-amount">¥150,000<span class="pricing-unit">（税抜・一括）</span></p>
              <p class="pricing-note">データ量・チャネル数により変動する場合があります</p>
            </div>
            <div class="pricing-card pricing-card-main">
              <p class="pricing-phase">PHASE 02 · 月次分析</p>
              <p class="pricing-desc">毎月CSVを受け取り、アプローチリストとカバレッジレポートをお届けします。クライアント側の作業は月1回のCSV送信のみ。</p>
              <p class="pricing-amount">¥50,000<span class="pricing-unit">税抜 / 月</span></p>
              <p class="pricing-note">最低6ヶ月・以降月次更新</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="band band-alt">
        <div class="inner inner-narrow">
          <h2 class="heading">よくある質問</h2>
          <div class="faq-list">
            <div class="faq-item">
              <p class="faq-q">どんなデータがあれば始められますか？</p>
              <p class="faq-a">「名前・会社名・最後に連絡した日」の3つがあれば始められます。Sansan・kintone・Excel・Googleスプレッドシートのエクスポートデータ、何でも対応します。整っていなくて構いません。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">CSVのエクスポート方法がわかりません</p>
              <p class="faq-a">よく使われているツールのエクスポート手順はこちらで案内します。それでも難しければ画面を共有してもらえれば一緒に確認します。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">SNSのつながりはどうすればいいですか？</p>
              <p class="faq-a">フォロワーや名刺代わりに使っているリストをスプレッドシートにまとめてCSVで送ってもらえばOKです。完璧でなくて構いません。</p>
            </div>
            <div class="faq-item">
              <p class="faq-q">データを渡すことへの不安があります</p>
              <p class="faq-a">受け取ったデータは分析のみに使用し、第三者への提供・マーケティング利用は一切しません。NDA対応も可能です。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-band">
        <div class="inner">
          <h2 class="cta-title">まず、話だけ<br />聞いてみてください。</h2>
          <p class="cta-body">今どんな形で接点を管理しているか、教えてください。<br />ヒアリングから始めます。データの提供は不要です。</p>
          <a href="mailto:info@movee.jp" class="cta-btn">相談・問い合わせ</a>
        </div>
      </section>

    </main>

    <LpPackageNav current="data-analytics" />

    <footer class="footer">
      <p>© 株式会社movee</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75; color: #0F172A; background: #fff;
  -webkit-font-smoothing: antialiased;
}

/* Nav */
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 48px; border-bottom: 1px solid #E2E8F0;
  position: sticky; top: 0; background: #fff; z-index: 10;
}
.nav-logo {
  font-size: 18px; font-weight: 800; letter-spacing: -0.04em;
  color: #0F172A; font-family: ui-monospace, monospace; text-decoration: none;
}
.nav-cta { font-size: 14px; font-weight: 700; color: #0891B2; text-decoration: none; }
.nav-cta:hover { text-decoration: underline; }

/* Hero */
.hero {
  background: linear-gradient(160deg, #F0FDFF 0%, #E0F2FE 60%, #F8FAFC 100%);
  padding: 80px 48px 72px;
}
.hero-inner { max-width: 640px; margin: 0 auto; }
.hero-kicker {
  font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: #0891B2;
  font-family: ui-monospace, monospace; text-transform: uppercase; margin: 0 0 20px;
}
.hero-title {
  font-size: clamp(44px, 8vw, 80px); font-weight: 900;
  letter-spacing: -0.05em; line-height: 1.0;
  color: #0F172A; margin: 0 0 24px;
}
.title-sub { color: #0891B2; }
.hero-body {
  font-size: 16px; line-height: 1.9; color: #475569; margin: 0 0 40px;
}
.hero-body strong { color: #0F172A; }

.hero-flow { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; flex-wrap: wrap; }
.flow-step {
  display: flex; flex-direction: column; gap: 4px;
  background: #fff; border: 1px solid #BAE6FD; border-radius: 10px; padding: 16px 20px;
  flex: 1; min-width: 120px;
}
.flow-num  { font-size: 11px; font-weight: 700; color: #0891B2; font-family: ui-monospace, monospace; }
.flow-label { font-size: 15px; font-weight: 800; color: #0F172A; }
.flow-sub   { font-size: 12px; color: #64748B; }
.flow-arrow { font-size: 20px; color: #BAE6FD; flex-shrink: 0; }

.hero-btn {
  display: inline-block; background: #0891B2; color: #fff;
  font-size: 15px; font-weight: 700; padding: 14px 32px;
  border-radius: 10px; text-decoration: none; transition: background .15s;
}
.hero-btn:hover { background: #0E7490; }

/* Empathy */
.band-empathy { background: #FAFAFA; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; padding: 56px 48px; }
.empathy-lead { font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 24px; letter-spacing: -0.02em; }
.empathy-list {
  list-style: none; padding: 0; margin: 0 0 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.empathy-list li {
  font-size: 15px; color: #334155; padding: 14px 18px;
  background: #fff; border: 1px solid #E2E8F0; border-radius: 8px;
  display: flex; align-items: flex-start; gap: 10px; line-height: 1.6;
}
.empathy-list li::before {
  content: "✓"; color: #0891B2; font-weight: 800; flex-shrink: 0; margin-top: 1px;
}
.empathy-note {
  font-size: 15px; color: #475569; line-height: 1.8; margin: 0;
  padding: 20px 24px; background: #EFF6FF; border-radius: 10px; border: 1px solid #BFDBFE;
}
.empathy-note strong { color: #0F172A; }

/* Story */
.band-story { background: #0F172A; padding: 64px 48px; }
.story-quote {
  font-size: clamp(16px, 2.5vw, 20px); font-weight: 700; color: #E0F2FE;
  line-height: 1.7; border-left: 3px solid #0891B2; padding-left: 24px;
  margin: 0 0 28px; font-style: italic;
}
.story-body { font-size: 15px; color: #94A3B8; line-height: 1.9; margin: 0; }
.story-body strong { color: #E0F2FE; font-weight: 700; }

/* Bands */
.band { padding: 72px 48px; }
.band-white { background: #fff; }
.band-alt   { background: #F0FDFF; }
.inner { max-width: 840px; margin: 0 auto; }
.inner-narrow { max-width: 620px; margin: 0 auto; }

.eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: #0891B2;
  font-family: ui-monospace, monospace; text-transform: uppercase; margin: 0 0 16px;
}
.heading {
  font-size: clamp(24px, 4vw, 36px); font-weight: 800;
  letter-spacing: -0.03em; margin: 0 0 16px; color: #0F172A; text-wrap: balance;
}
.section-lead {
  font-size: 15px; color: #475569; line-height: 1.85; margin: 0 0 48px; max-width: 600px;
}

/* How it works */
.works-steps { display: flex; flex-direction: column; margin-bottom: 48px; }
.works-step {
  display: flex; gap: 24px; padding: 32px 0;
  border-bottom: 1px solid #BAE6FD; align-items: flex-start;
}
.works-step:first-child { border-top: 1px solid #BAE6FD; }
.works-step-num {
  font-size: 36px; font-weight: 900; color: #BAE6FD;
  font-family: ui-monospace, monospace; line-height: 1; flex-shrink: 0; width: 52px;
}
.works-step-title {
  font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 8px;
}
.step-time {
  font-size: 13px; font-weight: 500; color: #0891B2; margin-left: 8px;
}
.works-step-desc { font-size: 14px; color: #475569; line-height: 1.8; margin: 0; }

/* Sheet mock */
.sheet-mock {
  margin-top: 20px; border: 1px solid #BAE6FD; border-radius: 8px;
  overflow: hidden; font-size: 11px;
}
.sheet-row {
  display: grid;
  grid-template-columns: 1fr 1fr 0.8fr 1fr 0.8fr 0.7fr 1.2fr 1.2fr;
  border-bottom: 1px solid #E0F2FE;
}
.sheet-row:last-child { border-bottom: none; }
.sheet-row span {
  padding: 7px 10px; color: #334155;
  border-right: 1px solid #E0F2FE; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sheet-row span:last-child { border-right: none; }
.sheet-header { background: #E0F2FE; }
.sheet-header span { font-weight: 700; color: #0E7490; }
.sheet-faded span { color: #94A3B8; }

/* Report mock (updated) */
.report-mock {
  border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,.06);
}
.mock-person {
  padding: 20px 24px; border-bottom: 1px solid #F1F5F9;
}
.mock-person-faded { opacity: .5; }
.mock-person-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; margin-bottom: 14px;
}
.mock-person-info { display: flex; flex-direction: column; gap: 4px; }
.mock-person-name { font-size: 14px; font-weight: 700; color: #0F172A; }
.mock-person-co   { font-weight: 400; color: #64748B; }
.mock-person-meta { font-size: 11px; color: #94A3B8; font-family: ui-monospace, monospace; }
.mock-approach { background: #F0FDFF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 12px 16px; }
.mock-approach-label { font-size: 10px; font-weight: 700; color: #0891B2; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px; }
.mock-approach-text  { font-size: 13px; color: #334155; line-height: 1.7; margin: 0; }

/* Habit box */
.habit-box {
  background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px;
  padding: 28px 32px; margin-bottom: 48px;
}
.habit-title { font-size: 17px; font-weight: 800; color: #0F172A; margin: 0 0 10px; }
.habit-desc  { font-size: 14px; color: #475569; line-height: 1.85; margin: 0; }

.red-text    { color: #DC2626; font-weight: 700; }
.orange-text { color: #D97706; font-weight: 700; }
.badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px; flex-shrink: 0; }
.badge.high { background: #FEE2E2; color: #DC2626; }
.badge.mid  { background: #FEF3C7; color: #D97706; }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr; } }
.pricing-card {
  padding: 32px; border: 1px solid #E2E8F0; border-radius: 12px; background: #F8FAFC;
  display: flex; flex-direction: column; gap: 12px;
}
.pricing-card-main { background: #F0F9FF; border-color: #BAE6FD; }
.pricing-phase {
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #0891B2;
  font-family: ui-monospace, monospace; text-transform: uppercase;
}
.pricing-desc  { font-size: 14px; color: #475569; line-height: 1.75; flex: 1; }
.pricing-amount {
  font-size: 28px; font-weight: 900; letter-spacing: -0.03em;
  color: #0F172A; font-variant-numeric: tabular-nums;
}
.pricing-unit { font-size: 14px; font-weight: 400; color: #64748B; }
.pricing-note { font-size: 12px; color: #94A3B8; }

/* FAQ */
.faq-list { display: flex; flex-direction: column; }
.faq-item { padding: 24px 0; border-bottom: 1px solid #BAE6FD; }
.faq-item:first-child { border-top: 1px solid #BAE6FD; }
.faq-q { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 10px; }
.faq-a { font-size: 14px; color: #475569; margin: 0; line-height: 1.8; }

/* CTA */
.cta-band { background: #0891B2; padding: 80px 48px; text-align: center; }
.cta-title {
  font-size: clamp(22px, 4vw, 34px); font-weight: 900; color: #fff;
  margin: 0 0 16px; letter-spacing: -0.04em; line-height: 1.2; text-wrap: balance;
}
.cta-body { font-size: 15px; color: rgba(255,255,255,.8); margin: 0 0 32px; }
.cta-btn {
  display: inline-block; background: #fff; color: #0891B2;
  font-size: 15px; font-weight: 700; padding: 14px 40px;
  border-radius: 10px; text-decoration: none; transition: opacity .15s;
}
.cta-btn:hover { opacity: .9; }

.footer { border-top: 1px solid #E2E8F0; padding: 24px 48px; font-size: 14px; color: #94A3B8; }

@media (max-width: 640px) {
  .nav          { padding: 14px 20px; }
  .hero         { padding: 56px 20px 48px; }
  .band         { padding: 56px 20px; }
  .band-empathy { padding: 48px 20px; }
  .band-story   { padding: 48px 20px; }
  .footer       { padding: 20px; }
  .flow-arrow   { display: none; }
  .works-step   { gap: 16px; }
  .mock-row     { grid-template-columns: 1.5fr 1fr 1fr 1fr; font-size: 11px; padding: 10px 12px; }
}
</style>
