import { Resend } from "resend";

type Grade = "A" | "B" | "C";
type Risk  = "high" | "medium" | "low";

// ── PageSpeed Insights ──────────────────────────────────────────────────────

async function checkPSI(url: string, strategy: "mobile" | "desktop") {
  const key = process.env.GOOGLE_PSI_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${key}`,
      { signal: AbortSignal.timeout(30000) }
    );
    if (!res.ok) return null;
    const d = await res.json();
    const audits = d.lighthouseResult?.audits ?? {};
    const cats   = d.lighthouseResult?.categories ?? {};
    const pct    = (cat: any) => cat?.score != null ? Math.round(cat.score * 100) : null;
    const score  = pct(cats.performance) ?? 0;
    return {
      score,
      grade:         (score >= 90 ? "A" : score >= 50 ? "B" : "C") as Grade,
      lcp:           audits["largest-contentful-paint"]?.displayValue ?? null,
      cls:           audits["cumulative-layout-shift"]?.displayValue ?? null,
      fcp:           audits["first-contentful-paint"]?.displayValue ?? null,
      tbt:           audits["total-blocking-time"]?.displayValue ?? null,
      accessibility: pct(cats.accessibility),
      seo:           pct(cats.seo),
      bestPractices: pct(cats["best-practices"]),
    };
  } catch { return null; }
}

// ── ページ取得（HTML + レスポンスヘッダー） ───────────────────────────────

async function fetchPage(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; movee-site-checker/1.0)" },
    signal: AbortSignal.timeout(12000),
    redirect: "follow",
  });
  const html = await res.text();
  const hdrs: Record<string, string> = {};
  res.headers.forEach((v, k) => { hdrs[k] = v; });
  return { html, headers: hdrs, finalUrl: res.url, isHttps: res.url.startsWith("https://") };
}

// ── セキュリティヘッダー ─────────────────────────────────────────────────

function checkSecurity(hdrs: Record<string, string>, isHttps: boolean) {
  const items = [
    { key: "isHttps",        ok: isHttps,                            label: "HTTPS",               desc: "通信の暗号化" },
    { key: "hsts",           ok: !!hdrs["strict-transport-security"], label: "HSTS",                desc: "HTTPSを強制" },
    { key: "xFrameOptions",  ok: !!hdrs["x-frame-options"],          label: "X-Frame-Options",     desc: "クリックジャッキング防止" },
    { key: "xContentType",   ok: !!hdrs["x-content-type-options"],   label: "X-Content-Type",      desc: "MIMEスニッフィング防止" },
    { key: "csp",            ok: !!hdrs["content-security-policy"],  label: "CSP",                 desc: "コンテンツセキュリティポリシー" },
    { key: "referrerPolicy", ok: !!hdrs["referrer-policy"],          label: "Referrer-Policy",     desc: "リファラー情報の制御" },
  ];
  const passed = items.filter(i => i.ok).length;
  const grade: Grade = passed >= 5 ? "A" : passed >= 3 ? "B" : "C";
  return { items, passed, total: items.length, grade };
}

// ── OGP ─────────────────────────────────────────────────────────────────────

function parseOgp(html: string) {
  const get = (prop: string) => {
    const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"))
           ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i"));
    return m?.[1]?.trim() ?? null;
  };
  const fields = [
    { key: "metaTitle",       value: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null, label: "title タグ",       critical: true  },
    { key: "metaDescription", value: get("description"),    label: "meta description", critical: true  },
    { key: "ogTitle",         value: get("og:title"),       label: "og:title",         critical: true  },
    { key: "ogDescription",   value: get("og:description"), label: "og:description",   critical: false },
    { key: "ogImage",         value: get("og:image"),       label: "og:image",         critical: true  },
    { key: "twitterCard",     value: get("twitter:card"),   label: "twitter:card",     critical: false },
  ];
  const criticalPassed = fields.filter(f => f.critical && f.value).length;
  const criticalTotal  = fields.filter(f => f.critical).length;
  const grade: Grade = criticalPassed >= criticalTotal ? "A" : criticalPassed >= criticalTotal - 1 ? "B" : "C";
  return { fields, grade };
}

// ── デザイン / アクセシビリティ（HTML解析）────────────────────────────────

function checkDesign(html: string) {
  const viewport    = /<meta[^>]+name=["']viewport["']/i.test(html);
  const langMatch   = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const lang        = langMatch?.[1] ?? null;
  const hasFavicon  = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);
  const h1Count     = (html.match(/<h1[\s>]/gi) ?? []).length;

  const imgTags     = html.match(/<img[^>]+>/gi) ?? [];
  const withAlt     = imgTags.filter(t => /\balt=["'][^"']*["']/i.test(t)).length;
  const altRatio    = imgTags.length > 0
    ? { total: imgTags.length, withAlt, ratio: Math.round((withAlt / imgTags.length) * 100) }
    : null;

  const items = [
    { key: "viewport",  ok: viewport,                                    label: "viewport メタタグ",     desc: "スマホ表示の基本設定" },
    { key: "lang",      ok: !!lang,                                      label: `lang 属性 (${lang ?? "未設定"})`, desc: "スクリーンリーダーが言語を認識できるか" },
    { key: "h1",        ok: h1Count === 1,                               label: `h1 タグ (${h1Count}個)`, desc: "1ページに1つが理想" },
    { key: "alt",       ok: !altRatio || altRatio.ratio >= 80,           label: `alt 属性 (${altRatio ? `${altRatio.withAlt}/${altRatio.total}枚` : "画像なし"})`, desc: "スクリーンリーダー・SEOに影響" },
    { key: "favicon",   ok: hasFavicon,                                  label: "ファビコン",             desc: "ブラウザタブのアイコン" },
  ];
  const passed  = items.filter(i => i.ok).length;
  const grade: Grade = passed >= 5 ? "A" : passed >= 3 ? "B" : "C";
  return { items, passed, total: items.length, grade, viewport, lang, h1Count, altRatio, hasFavicon };
}

// ── Cookie / トラッカー ──────────────────────────────────────────────────────

const TRACKERS: { name: string; type: "analytics" | "advertising"; pattern: RegExp }[] = [
  { name: "Google Analytics 4",  type: "analytics",   pattern: /G-[A-Z0-9]{6,}|gtag\(|googletagmanager\.com\/gtag/i },
  { name: "Google Analytics UA", type: "analytics",   pattern: /UA-\d{4,}-\d+|analytics\.js/i },
  { name: "Google Tag Manager",  type: "analytics",   pattern: /GTM-[A-Z0-9]{5,}|googletagmanager\.com\/gtm\.js/i },
  { name: "Facebook Pixel",      type: "advertising", pattern: /fbq\(|connect\.facebook\.net.*fbevents/i },
  { name: "Twitter/X Pixel",     type: "advertising", pattern: /twq\(|ads-twitter\.com/i },
  { name: "Hotjar",              type: "analytics",   pattern: /hotjar\.com|_hjSettings/i },
  { name: "Microsoft Clarity",   type: "analytics",   pattern: /clarity\.ms|ms\.clarity/i },
];
const CONSENT: { name: string; pattern: RegExp }[] = [
  { name: "OneTrust",            pattern: /onetrust|OptanonConsent/i },
  { name: "Cookiebot",           pattern: /cookiebot\.com|CookieConsent/i },
  { name: "CookieYes",           pattern: /cookieyes\.com|cky-consent/i },
  { name: "WP Cookie Law Info",  pattern: /cookie-law-info|CookieLawInfoConsent/i },
  { name: "汎用バナー",            pattern: /cookie.{0,30}(consent|notice|banner|bar|accept)|acceptCookies/i },
];

function parseCookie(html: string) {
  const trackers = TRACKERS.filter(t => t.pattern.test(html)).map(t => ({ name: t.name, type: t.type }));
  const consent  = CONSENT.filter(c => c.pattern.test(html)).map(c => ({ name: c.name }));
  const hasPrivacy = /privacy.?polic|プライバシーポリシー|個人情報保護方針/i.test(html);
  const risk: Risk = (trackers.some(t => t.type === "advertising") && !consent.length) ? "high"
    : (trackers.length > 0 && !consent.length)                                         ? "medium"
    : "low";
  return { trackers, consent, hasPrivacy, risk };
}

// ── 総合グレード ─────────────────────────────────────────────────────────────

function calcOverall(grades: (Grade | undefined)[]): Grade {
  const scores = grades.map(g => g === "A" ? 3 : g === "B" ? 2 : 1);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return avg >= 2.5 ? "A" : avg >= 1.5 ? "B" : "C";
}

// ── メール ───────────────────────────────────────────────────────────────────

function buildHtml(url: string, overall: Grade, speed: any, security: any, ogp: any, cookie: any, design: any, toEmail: string, isInternal: boolean): string {
  const gc = (g: Grade) => g === "A" ? "#16a34a" : g === "B" ? "#ca8a04" : "#dc2626";
  const badge = (g: Grade) => `<span style="background:${gc(g)};color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:3px">${g}</span>`;
  const row   = (label: string, ok: boolean) =>
    `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:7px 12px;font-size:13px;color:#374151">${label}</td><td style="padding:7px 12px;font-size:13px;color:${ok ? "#16a34a" : "#dc2626"}">${ok ? "✓" : "✗"}</td></tr>`;

  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,sans-serif">
<div style="max-width:620px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
  <div style="background:#0f172a;padding:24px 32px">
    <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase">${isInternal ? "[社内用] " : ""}サイトまるごとチェッカー</p>
    <h1 style="margin:4px 0 0;font-size:20px;font-weight:800;color:#fff">診断レポート</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#64748b">${url}</p>
  </div>
  <div style="padding:24px 32px">
    <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:8px;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em">総合評価</p>
      <p style="margin:0;font-size:52px;font-weight:900;color:${gc(overall)};line-height:1">${overall}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f8fafc">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">カテゴリ</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">評価</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">詳細</th>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 12px;font-size:13px;color:#374151">表示速度</td>
        <td style="padding:8px 12px">${speed ? badge(speed.grade) : "<span style='color:#9ca3af'>—</span>"}</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280">${speed ? `モバイル ${speed.mobile?.score ?? "—"} / PC ${speed.desktop?.score ?? "—"}` : "取得不可"}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 12px;font-size:13px;color:#374151">セキュリティ</td>
        <td style="padding:8px 12px">${badge(security.grade)}</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280">${security.passed}/${security.total} 項目OK</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 12px;font-size:13px;color:#374151">OGP/SNS</td>
        <td style="padding:8px 12px">${badge(ogp.grade)}</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280">${ogp.fields.filter((f: any) => f.value).length}/${ogp.fields.length} 項目設定済み</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 12px;font-size:13px;color:#374151">Cookieバナー</td>
        <td style="padding:8px 12px;font-size:13px;color:${cookie.risk === "high" ? "#dc2626" : cookie.risk === "medium" ? "#d97706" : "#16a34a"}">${cookie.risk === "high" ? "⚠ 要対応" : cookie.risk === "medium" ? "△ 確認推奨" : "✓ 問題なし"}</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280">${cookie.trackers.length}件のトラッカー</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:#374151">デザイン/アクセシビリティ</td>
        <td style="padding:8px 12px">${badge(design.grade)}</td>
        <td style="padding:8px 12px;font-size:12px;color:#6b7280">${design.passed}/${design.total} 項目OK${speed?.mobile?.accessibility != null ? ` · アクセシビリティ ${speed.mobile.accessibility}点` : ""}</td>
      </tr>
    </table>
    ${isInternal ? `<p style="font-size:11px;color:#9ca3af;margin:0">顧客メール: ${toEmail}</p>` : ""}
  </div>
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 32px;text-align:center">
    <p style="margin:0;font-size:11px;color:#9ca3af">サイトまるごとチェッカー by movee</p>
  </div>
</div></body></html>`;
}

// ── ハンドラー ────────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const { url: rawUrl, email } = await readBody(event);
  if (!rawUrl) throw createError({ statusCode: 400, message: "URLは必須です" });
  if (!email)  throw createError({ statusCode: 400, message: "メールアドレスは必須です" });

  const targetUrl = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try { new URL(targetUrl); } catch {
    throw createError({ statusCode: 400, message: "有効なURLを入力してください" });
  }

  const [pageRes, psiMobile, psiDesktop] = await Promise.allSettled([
    fetchPage(targetUrl),
    checkPSI(targetUrl, "mobile"),
    checkPSI(targetUrl, "desktop"),
  ]);

  const page = pageRes.status === "fulfilled" ? pageRes.value : null;
  const html = page?.html ?? "";

  const security = checkSecurity(page?.headers ?? {}, page?.isHttps ?? false);
  const ogp      = parseOgp(html);
  const cookie   = parseCookie(html);
  const design   = checkDesign(html);

  const mobile  = psiMobile.status  === "fulfilled" ? psiMobile.value  : null;
  const desktop = psiDesktop.status === "fulfilled" ? psiDesktop.value : null;

  const speedGrade: Grade | undefined = (mobile || desktop)
    ? ((): Grade => {
        const scores = [mobile?.score, desktop?.score].filter(s => s != null) as number[];
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg >= 90 ? "A" : avg >= 50 ? "B" : "C";
      })()
    : undefined;

  const speed = (mobile || desktop) ? { mobile, desktop, grade: speedGrade! } : null;

  const cookieGrade: Grade = cookie.risk === "high" ? "C" : cookie.risk === "medium" ? "B" : "A";
  const overall = calcOverall([speedGrade, security.grade, ogp.grade, cookieGrade, design.grade]);

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend   = new Resend(apiKey);
    const from     = process.env.RESEND_FROM ?? "onboarding@resend.dev";
    const internal = process.env.INTERNAL_EMAIL;
    const subject  = `【サイトまるごとチェッカー】${new URL(targetUrl).hostname}`;
    await Promise.allSettled([
      resend.emails.send({ from, to: email, subject, html: buildHtml(targetUrl, overall, speed, security, ogp, cookie, design, email, false) }),
      ...(internal ? [resend.emails.send({ from, to: internal, subject: `[社内用] ${subject}`, html: buildHtml(targetUrl, overall, speed, security, ogp, cookie, design, email, true) })] : []),
    ]);
  }

  return { url: targetUrl, overall, speed, security, ogp, cookie, design, email };
});
