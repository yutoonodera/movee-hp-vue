<script setup lang="ts">
interface WpPost {
  id: number; slug: string; date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featuredImage: string | null;
  eventDate?: string | null;
  eventEnd?: string | null;
}

const route = useRoute();
const { data: post, error } = await useFetch<WpPost>(`/api/wp/post/${route.params.slug}`);

useHead(() => ({
  title: post.value ? `${post.value.title.rendered} — movee 勉強会` : "勉強会 — movee",
}));

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();
const encodeImageUrl = (url: string) => {
  try { return encodeURI(decodeURIComponent(url)); } catch { return encodeURI(url); }
};

if (post.value) {
  const desc  = stripHtml(post.value.excerpt.rendered).slice(0, 120);
  const image = post.value.featuredImage
    ? encodeImageUrl(post.value.featuredImage)
    : "https://www.movee.jp/og-default.png";
  useSeoMeta({
    ogTitle: post.value.title.rendered,
    ogDescription: desc,
    ogType: "article",
    ogImage: image,
    twitterCard: "summary_large_image",
    twitterTitle: post.value.title.rendered,
    twitterDescription: desc,
    twitterImage: image,
  });
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const formatEventDate = (dt: string) => {
  const [datePart, timePart] = dt.replace("T", " ").split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const day = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const base = `${y}年${m}月${d}日（${day}）`;
  if (!timePart || timePart === "00:00") return base;
  const [h, min] = timePart.split(":");
  return `${base} ${parseInt(h)}:${min}`;
};

// 開催日時1日前にクローズ
const isClosed = computed(() => {
  if (!post.value?.eventDate) return false;
  const eventTime = new Date(post.value.eventDate.replace(" ", "T"));
  const closeTime = new Date(eventTime.getTime() - 24 * 60 * 60 * 1000);
  return new Date() >= closeTime;
});

// Form
const form = reactive({ name: "", email: "", company: "" });
const formError = ref("");
const submitting = ref(false);
const submitted = ref(false);

async function submit() {
  formError.value = "";
  if (!form.name.trim()) { formError.value = "氏名を入力してください"; return; }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    formError.value = "有効なメールアドレスを入力してください"; return;
  }

  submitting.value = true;
  try {
    await $fetch("/api/workshop-register", {
      method: "POST",
      body: {
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        workshopTitle: post.value?.title.rendered ?? "",
        workshopSlug: route.params.slug as string,
      },
    });
    submitted.value = true;
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string };
    formError.value = err?.data?.message ?? "送信に失敗しました。しばらくしてから再度お試しください。";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="page">
    <header class="nav">
      <NuxtLink to="/" class="nav-back">← movee</NuxtLink>
      <NuxtLink to="/workshop" class="nav-workshop">勉強会一覧</NuxtLink>
    </header>

    <div v-if="error" class="error-state">
      <p>記事が見つかりませんでした。</p>
      <NuxtLink to="/workshop">勉強会一覧へ</NuxtLink>
    </div>

    <template v-else-if="post">
      <article class="article">
        <div v-if="post.featuredImage" class="article-hero">
          <img :src="post.featuredImage" :alt="post.title.rendered" />
        </div>
        <div class="article-header">
          <div class="article-meta">
            <p v-if="post.eventDate" class="event-date-badge">
              開催日時: {{ formatEventDate(post.eventDate) }}{{ post.eventEnd ? `〜${post.eventEnd.slice(0, 5)}` : '' }}
            </p>
          </div>
          <h1 class="article-title" v-html="post.title.rendered"></h1>
        </div>
        <div class="article-body" v-html="post.content.rendered"></div>
      </article>

      <!-- 申し込みフォーム -->
      <section class="form-section">
        <div class="form-box">
          <div class="form-header">
            <p class="form-label">REGISTRATION</p>
            <h2 class="form-title">参加申し込み</h2>
            <p class="form-subtitle" v-html="post.title.rendered"></p>
            <p class="form-notice">※ 同業者の方はご遠慮ください。</p>
          </div>

          <div v-if="isClosed" class="closed-state">
            <p class="closed-icon">🔒</p>
            <h3 class="closed-heading">申し込みを締め切りました</h3>
            <p class="closed-text">このイベントの受付は終了しました。</p>
          </div>

          <div v-else-if="submitted" class="success-state">
            <div class="success-icon">✓</div>
            <h3 class="success-heading">申し込みを受け付けました</h3>
            <p class="success-text">
              ご登録のメールアドレスに確認メールをお送りしました。<br>
              開催の詳細については、別途ご連絡いたします。
            </p>
          </div>

          <form v-else-if="!isClosed" class="form" @submit.prevent="submit" novalidate>
            <div class="field">
              <label class="field-label">
                氏名 <span class="required">必須</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="山田 太郎"
                class="field-input"
                :disabled="submitting"
                autocomplete="name"
              />
            </div>

            <div class="field">
              <label class="field-label">
                メールアドレス <span class="required">必須</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                class="field-input"
                :disabled="submitting"
                autocomplete="email"
              />
            </div>

            <div class="field">
              <label class="field-label">
                会社名・屋号 <span class="optional">任意</span>
              </label>
              <input
                v-model="form.company"
                type="text"
                placeholder="株式会社○○"
                class="field-input"
                :disabled="submitting"
                autocomplete="organization"
              />
            </div>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="submitting" class="loading-dots">
                <span></span><span></span><span></span>
              </span>
              <span v-else>申し込む</span>
            </button>

            <p class="privacy-note">
              送信いただいた情報は、勉強会の運営・ご連絡のみに使用します。
            </p>
          </form>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page {
  --bg:     #FFFFFF;
  --ink:    #0F172A;
  --ink-2:  #475569;
  --ink-3:  #94A3B8;
  --accent: #1D4ED8;
  --accent-light: #DBEAFE;
  --line:   #E2E8F0;

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.nav {
  padding: 18px 48px;
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; gap: 24px;
}
.nav-back, .nav-workshop {
  font-size: 14px; color: var(--ink-2);
  text-decoration: none; font-weight: 500;
}
.nav-back:hover, .nav-workshop:hover { color: var(--accent); }

/* Article */
.article {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 48px 64px;
}

.article-hero {
  margin-bottom: 40px; border-radius: 10px; overflow: hidden; aspect-ratio: 16 / 9;
}
.article-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }

.article-header {
  margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--line);
}
.article-meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.event-date-badge {
  margin: 0;
  font-size: 13px; font-weight: 700;
  color: var(--accent); background: var(--accent-light);
  padding: 4px 12px; border-radius: 100px;
}
.article-date {
  font-size: 12px; color: var(--ink-3); font-family: ui-monospace, monospace; margin: 0;
}
.article-title {
  font-size: clamp(24px, 4vw, 36px); font-weight: 800;
  letter-spacing: -0.03em; line-height: 1.3; margin: 0; text-wrap: balance;
}

.article-body :deep(p)          { margin: 0 0 1.5em; font-size: 16px; line-height: 1.85; color: var(--ink-2); }
.article-body :deep(h2)         { font-size: 22px; font-weight: 700; margin: 2em 0 .75em; letter-spacing: -.02em; color: var(--ink); }
.article-body :deep(h3)         { font-size: 18px; font-weight: 700; margin: 1.75em 0 .5em; color: var(--ink); }
.article-body :deep(ul)         { padding-left: 1.5em; margin: 0 0 1.5em; }
.article-body :deep(li)         { margin-bottom: .4em; font-size: 16px; color: var(--ink-2); }
.article-body :deep(a)          { color: var(--accent); text-decoration: underline; }
.article-body :deep(img)        { max-width: 100%; border-radius: 6px; margin: 1em 0; }
.article-body :deep(blockquote) { border-left: 3px solid var(--line); padding-left: 1em; margin: 1.5em 0; color: var(--ink-3); }
.article-body :deep(pre)        { background: #0F172A; color: #e2e8f0; padding: 1em 1.25em; border-radius: 6px; overflow-x: auto; font-size: 14px; line-height: 1.6; }
.article-body :deep(code)       { font-family: ui-monospace, monospace; font-size: .9em; background: var(--line); padding: .15em .4em; border-radius: 3px; }
.article-body :deep(pre code)   { background: none; padding: 0; }

/* Form section */
.form-section {
  background: #F8FAFF;
  border-top: 1px solid var(--line);
  padding: 64px 48px 96px;
}

.form-box {
  max-width: 640px;
  margin: 0 auto;
}

.form-header { margin-bottom: 40px; text-align: center; }
.form-label {
  font-size: 11px; letter-spacing: .12em; color: var(--accent);
  font-family: ui-monospace, monospace; text-transform: uppercase; margin: 0 0 12px;
}
.form-title {
  font-size: 28px; font-weight: 800; letter-spacing: -.03em;
  color: var(--ink); margin: 0 0 12px;
}
.form-subtitle {
  font-size: 14px; color: var(--ink-2); margin: 0; line-height: 1.6;
}
.form-notice {
  font-size: 13px; color: var(--ink-3); margin: 10px 0 0;
}

.form { display: flex; flex-direction: column; gap: 24px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 13px; font-weight: 600; color: var(--ink);
  display: flex; align-items: center; gap: 6px;
}
.required {
  font-size: 10px; font-weight: 700; letter-spacing: .04em;
  background: var(--accent); color: #fff;
  padding: 2px 6px; border-radius: 3px;
}
.optional {
  font-size: 10px; font-weight: 500; color: var(--ink-3);
  background: var(--line); padding: 2px 6px; border-radius: 3px;
}
.field-input {
  padding: 11px 14px;
  border: 1.5px solid var(--line); border-radius: 8px;
  font-size: 15px; font-family: inherit; color: var(--ink);
  background: #fff; outline: none;
  transition: border-color .15s;
}
.field-input:focus  { border-color: var(--accent); }
.field-input:disabled { opacity: .5; cursor: not-allowed; }
.field-input::placeholder { color: var(--ink-3); }

.form-error {
  margin: 0; padding: 12px 16px;
  background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px;
  font-size: 13px; color: #DC2626;
}

.submit-btn {
  padding: 14px 28px;
  background: var(--accent); color: #fff;
  font-size: 16px; font-weight: 700; font-family: inherit;
  border: none; border-radius: 10px; cursor: pointer;
  transition: background .15s, transform .15s;
  display: flex; align-items: center; justify-content: center;
  min-height: 52px;
}
.submit-btn:hover:not(:disabled)  { background: #1e40af; transform: translateY(-1px); }
.submit-btn:active:not(:disabled) { transform: none; }
.submit-btn:disabled { opacity: .5; cursor: not-allowed; }

.loading-dots { display: flex; gap: 5px; align-items: center; }
.loading-dots span {
  width: 6px; height: 6px; border-radius: 50%; background: #fff;
  animation: blink 1.2s infinite;
}
.loading-dots span:nth-child(2) { animation-delay: .2s; }
.loading-dots span:nth-child(3) { animation-delay: .4s; }
@keyframes blink {
  0%, 80%, 100% { opacity: .2; }
  40%           { opacity: 1; }
}

.privacy-note { margin: 0; font-size: 12px; color: var(--ink-3); text-align: center; line-height: 1.6; }

.closed-state { text-align: center; padding: 48px 24px; }
.closed-icon { font-size: 36px; margin: 0 0 16px; }
.closed-heading { font-size: 20px; font-weight: 700; margin: 0 0 10px; color: var(--ink); }
.closed-text { font-size: 14px; color: var(--ink-3); margin: 0; }

.success-state { text-align: center; padding: 48px 24px; }
.success-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: #D1FAE5; color: #059669;
  font-size: 28px; display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
}
.success-heading { font-size: 22px; font-weight: 700; margin: 0 0 12px; color: var(--ink); }
.success-text { font-size: 15px; color: var(--ink-2); line-height: 1.8; margin: 0; }

.error-state { text-align: center; padding: 96px 24px; color: var(--ink-2); }
.error-state a { color: var(--accent); }

@media (max-width: 640px) {
  .nav          { padding: 14px 20px; }
  .article      { padding: 40px 20px 48px; }
  .form-section { padding: 48px 20px 72px; }
}
</style>
