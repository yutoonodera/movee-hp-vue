<script setup lang="ts">
useHead({
  title: "メール配信停止 | movee",
  meta: [{ name: "robots", content: "noindex" }],
});

const route = useRoute();
const email = ref((route.query.email as string) ?? "");
const status = ref<"idle" | "pending" | "done" | "error">("idle");
const errorMsg = ref("");

async function submit() {
  if (!email.value.trim()) return;
  status.value = "pending";
  try {
    await $fetch("/api/unsubscribe", {
      method: "POST",
      body: { email: email.value.trim() },
    });
    status.value = "done";
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? "エラーが発生しました。しばらく後に再試行してください。";
    status.value = "error";
  }
}
</script>

<template>
  <div class="unsub-page">
    <div class="unsub-card">
      <NuxtLink to="/" class="unsub-logo">㈱movee</NuxtLink>

      <template v-if="status === 'done'">
        <div class="done-icon">✓</div>
        <h1 class="unsub-title">配信を停止しました</h1>
        <p class="unsub-sub">
          <strong>{{ email }}</strong> への<br />メール配信を停止しました。
        </p>
        <NuxtLink to="/" class="back-btn">トップページへ戻る</NuxtLink>
      </template>

      <template v-else>
        <h1 class="unsub-title">メール配信停止</h1>
        <p class="unsub-sub">
          配信を停止するメールアドレスを確認して<br />「配信停止」ボタンを押してください。
        </p>

        <form class="unsub-form" @submit.prevent="submit">
          <label class="unsub-label" for="email">メールアドレス</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="unsub-input"
            placeholder="example@email.com"
            required
            :disabled="status === 'pending'"
          />

          <div v-if="status === 'error'" class="unsub-error">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            class="unsub-btn"
            :disabled="status === 'pending' || !email.trim()"
          >
            <span v-if="status === 'pending'" class="unsub-spinner" />
            <span v-else>配信停止</span>
          </button>
        </form>

        <p class="unsub-note">
          再度メールを受け取りたい場合は<br />
          <a href="mailto:info@movee.jp">info@movee.jp</a> までご連絡ください。
        </p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.unsub-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg, #f5f5f5);
  padding: 24px 16px;
}

.unsub-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 48px 40px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

@media (max-width: 480px) {
  .unsub-card { padding: 36px 24px; }
}

.unsub-logo { display: inline-block; margin-bottom: 4px; font-weight: 700; font-size: 1rem; color: #1a1a1a; text-decoration: none; }

.done-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e6f4ea;
  color: #2d7d46;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unsub-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.unsub-sub {
  font-size: 0.875rem;
  color: #555;
  margin: 0;
  line-height: 1.7;
}

.unsub-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.unsub-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #444;
  letter-spacing: 0.03em;
}

.unsub-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #d0d0d0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: #fafafa;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.unsub-input:focus { outline: none; border-color: #555; background: #fff; }
.unsub-input:disabled { opacity: 0.6; }

.unsub-error {
  font-size: 0.8rem;
  color: #c0392b;
  background: #fdf0ee;
  border-radius: 6px;
  padding: 8px 12px;
}

.unsub-btn {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}
.unsub-btn:hover:not(:disabled) { background: #333; }
.unsub-btn:disabled { opacity: 0.5; cursor: default; }

.unsub-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.back-btn {
  display: inline-block;
  padding: 10px 24px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}
.back-btn:hover { background: #333; }

.unsub-note {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
  line-height: 1.7;
}
.unsub-note a { color: #555; }
</style>
