interface TrackerHit {
  name: string;
  type: "analytics" | "advertising" | "social";
}

interface ConsentHit {
  name: string;
}

const TRACKERS: { name: string; type: TrackerHit["type"]; pattern: RegExp }[] = [
  { name: "Google Analytics 4",   type: "analytics",   pattern: /G-[A-Z0-9]{6,}|gtag\(|googletagmanager\.com\/gtag/i },
  { name: "Google Analytics UA",  type: "analytics",   pattern: /UA-\d{4,}-\d+|analytics\.js|ga\.js/i },
  { name: "Google Tag Manager",   type: "analytics",   pattern: /GTM-[A-Z0-9]{5,}|googletagmanager\.com\/gtm\.js/i },
  { name: "Facebook Pixel",       type: "advertising", pattern: /fbq\(|connect\.facebook\.net.*fbevents|facebook\.com\/tr/i },
  { name: "Twitter/X Pixel",      type: "advertising", pattern: /twitter\.com\/i\/adsct|twq\(|ads-twitter\.com/i },
  { name: "Yahoo広告",             type: "advertising", pattern: /s\.yimg\.com\/images\/clear\.gif|ytag\.js|yahoo-canada/i },
  { name: "LINE Tag",             type: "advertising", pattern: /line\.me\/R\/app|_lt\(|analytics\.line\.me/i },
  { name: "Hotjar",               type: "analytics",   pattern: /hotjar\.com|hj\(|_hjSettings/i },
  { name: "Microsoft Clarity",    type: "analytics",   pattern: /clarity\.ms|ms\.clarity/i },
];

const CONSENT: { name: string; pattern: RegExp }[] = [
  { name: "OneTrust",             pattern: /onetrust|OptanonConsent/i },
  { name: "Cookiebot",            pattern: /cookiebot\.com|CookieConsent/i },
  { name: "CookieYes",            pattern: /cookieyes\.com|cky-consent/i },
  { name: "CookiePro",            pattern: /cookiepro/i },
  { name: "TrustArc",             pattern: /trustarc\.com/i },
  { name: "Osano",                pattern: /osano\.com/i },
  { name: "CookieHub",            pattern: /cookiehub\.com/i },
  { name: "WP Cookie Law Info",   pattern: /cookie-law-info|CookieLawInfoConsent/i },
  { name: "GDPR Cookie Consent",  pattern: /gdpr-cookie-consent|GCookieConsent/i },
  { name: "汎用バナー",             pattern: /cookie.{0,30}(consent|notice|banner|bar|accept)|cookieConsent|acceptCookies/i },
];

export default defineEventHandler(async (event) => {
  const { url: rawUrl } = getQuery(event);
  if (!rawUrl || typeof rawUrl !== "string") {
    throw createError({ statusCode: 400, message: "URLは必須です" });
  }

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

  const trackers: TrackerHit[] = TRACKERS
    .filter(t => t.pattern.test(html))
    .map(t => ({ name: t.name, type: t.type }));

  const consent: ConsentHit[] = CONSENT
    .filter(c => c.pattern.test(html))
    .map(c => ({ name: c.name }));

  const hasPrivacyPolicy =
    /privacy.?polic|プライバシーポリシー|個人情報保護方針/i.test(html);

  const analyticsCount    = trackers.filter(t => t.type === "analytics").length;
  const advertisingCount  = trackers.filter(t => t.type === "advertising").length;
  const hasTrackers       = trackers.length > 0;
  const hasConsent        = consent.length > 0;

  type Risk = "high" | "medium" | "low";
  let risk: Risk;
  if (advertisingCount > 0 && !hasConsent) risk = "high";
  else if (hasTrackers && !hasConsent)      risk = "medium";
  else                                      risk = "low";

  return {
    url: parsed.origin,
    trackers,
    consent,
    hasPrivacyPolicy,
    summary: {
      trackerCount:    trackers.length,
      consentCount:    consent.length,
      hasTrackers,
      hasConsent,
      hasPrivacyPolicy,
      risk,
    },
  };
});
