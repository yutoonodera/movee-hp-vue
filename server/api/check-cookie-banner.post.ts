import { Resend } from "resend";

interface TrackerHit { name: string; type: "analytics" | "advertising" | "social" }
interface ConsentHit  { name: string }
type Risk = "high" | "medium" | "low";

const TRACKERS: { name: string; type: TrackerHit["type"]; pattern: RegExp }[] = [
  { name: "Google Analytics 4",  type: "analytics",   pattern: /G-[A-Z0-9]{6,}|gtag\(|googletagmanager\.com\/gtag/i },
  { name: "Google Analytics UA", type: "analytics",   pattern: /UA-\d{4,}-\d+|analytics\.js|ga\.js/i },
  { name: "Google Tag Manager",  type: "analytics",   pattern: /GTM-[A-Z0-9]{5,}|googletagmanager\.com\/gtm\.js/i },
  { name: "Facebook Pixel",      type: "advertising", pattern: /fbq\(|connect\.facebook\.net.*fbevents|facebook\.com\/tr/i },
  { name: "Twitter/X Pixel",     type: "advertising", pattern: /twq\(|ads-twitter\.com/i },
  { name: "Yahoo広告",            type: "advertising", pattern: /ytag\.js|yahoo-japan-ads/i },
  { name: "LINE Tag",            type: "advertising", pattern: /_lt\(|analytics\.line\.me/i },
  { name: "Hotjar",              type: "analytics",   pattern: /hotjar\.com|_hjSettings/i },
  { name: "Microsoft Clarity",   type: "analytics",   pattern: /clarity\.ms|ms\.clarity/i },
];

const CONSENT: { name: string; pattern: RegExp }[] = [
  { name: "OneTrust",            pattern: /onetrust|OptanonConsent/i },
  { name: "Cookiebot",           pattern: /cookiebot\.com|CookieConsent/i },
  { name: "CookieYes",           pattern: /cookieyes\.com|cky-consent/i },
  { name: "TrustArc",            pattern: /trustarc\.com/i },
  { name: "Osano",               pattern: /osano\.com/i },
  { name: "CookieHub",           pattern: /cookiehub\.com/i },
  { name: "WP Cookie Law Info",  pattern: /cookie-law-info|CookieLawInfoConsent/i },
  { name: "GDPR Cookie Consent", pattern: /gdpr-cookie-consent/i },
  { name: "汎用バナー",            pattern: /cookie.{0,30}(consent|notice|banner|bar|accept)|acceptCookies/i },
];

function buildHtml(url: string, trackers: TrackerHit[], consent: ConsentHit[], hasPrivacy: boolean, risk: Risk, toEmail: string, isInternal: boolean): string {
  const riskLabel = risk === "high" ? "⚠ 要対応" : risk === "medium" ? "△ 確認推奨" : "✓ 問題なし";
  const riskColor = risk === "high" ? "#dc2626" : risk === "medium" ? "#d97706" : "#16a34a";
  const trackerRows = trackers.map(t =>
    `<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:8px 12px;font-size:13px;color:#374151">${t.name}</td><td style="padding:8px 12px;font-size:12px;color:#6b7280">${t.type}</td></tr>`
  ).join("");
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,sans-serif">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
  <div style="background:#0f172a;padding:24px 32px">
    <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase">${isInternal ? "[社内用] " : ""}Cookieバナー診断</p>
    <h1 style="margin:4px 0 0;font-size:20px;font-weight:800;color:#fff">診断レポート</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#64748b">${url}</p>
  </div>
  <div style="padding:24px 32px">
    <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:8px;margin-bottom:24px">
      <p style="margin:0;font-size:18px;font-weight:800;color:${riskColor}">${riskLabel}</p>
    </div>
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em">検出されたトラッカー（${trackers.length}件）</p>
    ${trackers.length ? `<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f8fafc"><th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">名称</th><th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">種別</th></tr>
      ${trackerRows}
    </table>` : `<p style="font-size:13px;color:#6b7280;margin:0 0 20px">トラッカーは検出されませんでした</p>`}
    <p style="font-size:13px;margin:0 0 6px">同意バナー: <strong style="color:${consent.length ? "#16a34a" : "#dc2626"}">${consent.length ? consent.map(c => c.name).join(", ") : "未検出"}</strong></p>
    <p style="font-size:13px;margin:0">プライバシーポリシー: <strong style="color:${hasPrivacy ? "#16a34a" : "#dc2626"}">${hasPrivacy ? "あり" : "未検出"}</strong></p>
    ${isInternal ? `<p style="margin:16px 0 0;font-size:11px;color:#9ca3af">顧客メール: ${toEmail}</p>` : ""}
  </div>
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 32px;text-align:center">
    <p style="margin:0;font-size:11px;color:#9ca3af">Cookieバナー診断 by movee</p>
  </div>
</div></body></html>`;
}

export default defineEventHandler(async (event) => {
  const { url: rawUrl, email } = await readBody(event);
  if (!rawUrl) throw createError({ statusCode: 400, message: "URLは必須です" });
  if (!email)  throw createError({ statusCode: 400, message: "メールアドレスは必須です" });

  const targetUrl = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  let parsed: URL;
  try { parsed = new URL(targetUrl); } catch {
    throw createError({ statusCode: 400, message: "有効なURLを入力してください" });
  }

  let html = "";
  try {
    const res = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; movee-cookie-checker/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    html = await res.text();
  } catch (e: any) {
    throw createError({ statusCode: 502, message: `ページを取得できませんでした: ${e?.message ?? ""}` });
  }

  const trackers = TRACKERS.filter(t => t.pattern.test(html)).map(t => ({ name: t.name, type: t.type }));
  const consent  = CONSENT.filter(c => c.pattern.test(html)).map(c => ({ name: c.name }));
  const hasPrivacyPolicy = /privacy.?polic|プライバシーポリシー|個人情報保護方針/i.test(html);
  const advertisingCount = trackers.filter(t => t.type === "advertising").length;
  const hasTrackers      = trackers.length > 0;
  const hasConsent       = consent.length > 0;

  const risk: Risk = (advertisingCount > 0 && !hasConsent) ? "high"
    : (hasTrackers && !hasConsent)                         ? "medium"
    : "low";

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend   = new Resend(apiKey);
    const from     = process.env.RESEND_FROM ?? "onboarding@resend.dev";
    const internal = process.env.INTERNAL_EMAIL;
    const subject  = `【Cookieバナー診断】${parsed.hostname}`;
    await Promise.allSettled([
      resend.emails.send({ from, to: email, subject, html: buildHtml(parsed.origin, trackers, consent, hasPrivacyPolicy, risk, email, false) }),
      ...(internal ? [resend.emails.send({ from, to: internal, subject: `[社内用] ${subject}`, html: buildHtml(parsed.origin, trackers, consent, hasPrivacyPolicy, risk, email, true) })] : []),
    ]);
  }

  return {
    url: parsed.origin,
    trackers,
    consent,
    hasPrivacyPolicy,
    email,
    summary: { trackerCount: trackers.length, consentCount: consent.length, hasTrackers, hasConsent, hasPrivacyPolicy, risk },
  };
});
