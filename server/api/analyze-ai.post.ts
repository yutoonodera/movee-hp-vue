import { Resend } from "resend";

// ---- 定数 ----------------------------------------------------------------

const SECURITY_HEADERS = [
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

const HEADER_LABEL: Record<string, string> = {
  "strict-transport-security": "HSTS",
  "content-security-policy": "CSP",
  "x-frame-options": "X-Frame-Options",
  "x-content-type-options": "X-Content-Type-Options",
  "referrer-policy": "Referrer-Policy",
  "permissions-policy": "Permissions-Policy",
};

const HEADER_RISK: Record<string, string> = {
  "strict-transport-security": "通信が暗号化されず、中間者攻撃によるデータ傍受のリスクがあります",
  "content-security-policy": "悪意あるスクリプトの実行（XSS）を防ぐ設定がなく、情報漏えいリスクがあります",
  "x-frame-options": "クリックジャッキング攻撃により、ユーザーを騙した操作を誘導される可能性があります",
  "x-content-type-options": "ブラウザがファイルタイプを誤認識し、意図しないスクリプトが実行されるリスクがあります",
  "referrer-policy": "外部サイトへのリンク経由でURLやセッション情報が漏えいする可能性があります",
  "permissions-policy": "カメラ・マイク・位置情報などへの不正アクセスを制限できていない状態です",
};

const HEADER_FIX: Record<string, string> = {
  "strict-transport-security": "Strict-Transport-Security: max-age=31536000; includeSubDomains をレスポンスヘッダーに追加してください",
  "content-security-policy": "Content-Security-Policy ヘッダーでスクリプト・スタイルの許可元を明示的に制限してください",
  "x-frame-options": "X-Frame-Options: DENY または SAMEORIGIN をヘッダーに設定してください",
  "x-content-type-options": "X-Content-Type-Options: nosniff をレスポンスヘッダーに追加してください",
  "referrer-policy": "Referrer-Policy: strict-origin-when-cross-origin に設定することを推奨します",
  "permissions-policy": "Permissions-Policy ヘッダーで camera=(), microphone=(), geolocation=() など不要な機能を無効化してください",
};

// ---- 型 ------------------------------------------------------------------

type Grade = "A" | "B" | "C";

interface SecurityFinding {
  level: "critical" | "warning" | "info";
  message: string;
}

interface SecurityResult {
  score: number;
  grade: Grade;
  isHttps: boolean;
  headers: { name: string; label: string; present: boolean }[];
  findings: SecurityFinding[];
}

interface PerformanceResult {
  score: number;
  grade: Grade;
  lcp: string | null;
}

interface AiResult {
  url: string;
  security: SecurityResult;
  performance: PerformanceResult | null;
  psError: string | null;
  email: string;
}

// ---- ユーティリティ -------------------------------------------------------

function getGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 50) return "B";
  return "C";
}

function gradeColor(grade: Grade) {
  if (grade === "A") return "#16a34a";
  if (grade === "B") return "#ca8a04";
  return "#dc2626";
}

// ---- セキュリティチェック ------------------------------------------------

async function checkSecurity(url: string): Promise<SecurityResult> {
  const isHttps = url.startsWith("https://");
  const findings: SecurityFinding[] = [];
  let origin: string;
  try {
    origin = new URL(url).origin;
  } catch {
    return { score: 0, grade: "C", isHttps, headers: [], findings };
  }

  if (!isHttps) {
    findings.push({
      level: "critical",
      message: "HTTPSが無効です。通信内容が暗号化されておらず、ユーザーの情報が盗聴されるリスクがあります",
    });
  }

  let headerRes: Response | null = null;
  try {
    headerRes = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
  } catch {}

  const found = SECURITY_HEADERS.filter((h) => headerRes?.headers.get(h));
  const missing = SECURITY_HEADERS.filter((h) => !headerRes?.headers.get(h));
  let score = Math.round((found.length / SECURITY_HEADERS.length) * 100);

  for (const h of missing) {
    findings.push({
      level: "warning",
      message: `${HEADER_LABEL[h]} が未設定です。${HEADER_RISK[h]}`,
    });
  }

  // .env ファイル公開チェック
  try {
    const envRes = await fetch(`${origin}/.env`, {
      signal: AbortSignal.timeout(5000),
    });
    if (envRes.ok) {
      const text = await envRes.text().catch(() => "");
      if (text.includes("=")) {
        findings.unshift({
          level: "critical",
          message: "【重大】.envファイルがインターネット上に公開されています。APIキーやDB接続情報が漏洩している可能性があります。即時対応が必要です",
        });
        score = 0;
      }
    }
  } catch {}

  // HTML ソース内の環境変数・機密情報チェック
  try {
    const htmlRes = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (htmlRes.ok) {
      const html = await htmlRes.text();

      const envLeakPatterns = [
        /NEXT_PUBLIC_[A-Z_]{4,}\s*[=:]\s*["'][^"']{6,}["']/,
        /(?:api[_-]?key|secret[_-]?key|access[_-]?token|private[_-]?key)\s*[=:]\s*["'][^"']{10,}["']/i,
        /(?:database_url|db_password|db_pass)\s*[=:]\s*["'][^"']{6,}["']/i,
      ];
      if (envLeakPatterns.some((p) => p.test(html))) {
        findings.unshift({
          level: "critical",
          message: "【重大】APIキーや環境変数がHTMLソースコードに含まれています。NEXT_PUBLIC_ やビルド設定を見直し、秘密情報が公開されていないか確認してください",
        });
        score = Math.min(score, 20);
      }

      // PHP / WordPress 検出 → SQLi リスク
      const isPhp =
        (headerRes?.headers.get("x-powered-by") ?? "").toLowerCase().includes("php") ||
        html.includes("/wp-content/") ||
        html.includes("wp-json");
      if (isPhp) {
        findings.push({
          level: "warning",
          message: "PHPまたはWordPressが検出されました。プラグインの脆弱性を経由したSQLインジェクションリスクがあります。不要なプラグインの削除と定期的なアップデートを推奨します",
        });
        findings.push({
          level: "info",
          message: "WordPress管理画面（/wp-admin）が外部からアクセス可能な場合、ブルートフォース攻撃の対象になります。IPアドレス制限または2要素認証の設定を推奨します",
        });
      }
    }
  } catch {}

  if (!isHttps) score = Math.min(score, 40);

  return {
    score,
    grade: getGrade(score),
    isHttps,
    headers: SECURITY_HEADERS.map((h) => ({
      name: h,
      label: HEADER_LABEL[h],
      present: !!headerRes?.headers.get(h),
    })),
    findings,
  };
}

// ---- LCP / パフォーマンス ------------------------------------------------

async function fetchPerformance(url: string): Promise<PerformanceResult> {
  const key = process.env.GOOGLE_PSI_KEY;
  const keyParam = key ? `&key=${encodeURIComponent(key)}` : "";
  const apiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=mobile&category=performance` +
    keyParam;

  let res = await fetch(apiUrl, { signal: AbortSignal.timeout(90000) }).catch(
    async (e) => {
      if (e?.name === "TimeoutError" || e?.name === "AbortError") {
        await new Promise((r) => setTimeout(r, 5000));
        return fetch(apiUrl, { signal: AbortSignal.timeout(90000) });
      }
      throw e;
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PageSpeed API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const cats = data.lighthouseResult?.categories;
  const audits = data.lighthouseResult?.audits ?? {};
  if (!cats) throw new Error("lighthouseResult.categories が空です");

  const score = Math.round((cats.performance?.score ?? 0) * 100);
  const lcp: string | null = audits["largest-contentful-paint"]?.displayValue ?? null;

  return { score, grade: getGrade(score), lcp };
}

// ---- メール --------------------------------------------------------------

function buildEmailHtml(
  url: string,
  security: SecurityResult,
  performance: PerformanceResult | null,
  includesFixes: boolean,
  customerEmail: string,
): string {
  const levelColor = (l: string) =>
    l === "critical" ? "#dc2626" : l === "warning" ? "#d97706" : "#2563eb";
  const levelLabel = (l: string) =>
    l === "critical" ? "重大" : l === "warning" ? "警告" : "情報";

  const findingsHtml = security.findings
    .map(
      (f) =>
        `<tr>
          <td style="padding:8px 12px;vertical-align:top;">
            <span style="display:inline-block;padding:2px 7px;border-radius:3px;font-size:10px;font-weight:700;background:${levelColor(f.level)}18;color:${levelColor(f.level)};">${levelLabel(f.level)}</span>
          </td>
          <td style="padding:8px 12px;font-size:12px;color:#374151;line-height:1.6;">${f.message}</td>
        </tr>`,
    )
    .join("");

  const headerRows = security.headers
    .map(
      (h) =>
        `<tr style="border-bottom:1px solid #f3f4f6;">
          <td style="padding:7px 12px;font-size:12px;color:#374151;font-family:monospace;">${h.label}</td>
          <td style="padding:7px 12px;font-size:12px;font-weight:600;color:${h.present ? "#16a34a" : "#dc2626"};">${h.present ? "✓ 設定済み" : "✕ 未設定"}</td>
          ${includesFixes && !h.present ? `<td style="padding:7px 12px;font-size:11px;color:#6b7280;">${HEADER_FIX[h.name]}</td>` : ""}
        </tr>`,
    )
    .join("");

  const perfHtml = performance
    ? `<div style="margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">表示速度（LCP）</p>
        <p style="margin:0;font-size:28px;font-weight:900;color:${gradeColor(performance.grade)};line-height:1;">${performance.grade} <span style="font-size:13px;font-weight:400;color:#6b7280;">${performance.score}点${performance.lcp ? ` / LCP ${performance.lcp}` : ""}</span></p>
      </div>`
    : "";

  const ctaHtml = includesFixes
    ? `<p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">顧客メールアドレス: ${customerEmail}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>AI開発の非機能診断レポート</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:620px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
  <div style="background:#0f172a;padding:24px 32px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">${includesFixes ? "[社内用] " : ""}AI開発の非機能診断くん</p>
    <h1 style="margin:4px 0 0;font-size:22px;font-weight:800;color:#fff;">セキュリティ診断レポート</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#64748b;">${url}</p>
  </div>
  <div style="padding:24px 32px 0;">
    <div style="display:flex;gap:16px;margin-bottom:20px;">
      <div style="flex:1;padding:16px;background:#f8fafc;border-radius:8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">セキュリティ</p>
        <p style="margin:0;font-size:36px;font-weight:900;color:${gradeColor(security.grade)};line-height:1;">${security.grade}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">${security.score}点</p>
      </div>
      ${performance ? `<div style="flex:1;padding:16px;background:#f8fafc;border-radius:8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">表示速度</p>
        <p style="margin:0;font-size:36px;font-weight:900;color:${gradeColor(performance.grade)};line-height:1;">${performance.grade}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">${performance.score}点${performance.lcp ? ` / LCP ${performance.lcp}` : ""}</p>
      </div>` : ""}
    </div>
    ${security.findings.length ? `
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">診断結果</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${findingsHtml}
    </table>` : `<p style="font-size:13px;color:#16a34a;margin:0 0 20px;">✓ 重大なセキュリティ問題は検出されませんでした</p>`}
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">セキュリティヘッダー</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      ${headerRows}
    </table>
  </div>
  <div style="padding:0 32px 32px;">
    ${ctaHtml}
  </div>
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9ca3af;">このレポートは自動生成されました</p>
  </div>
</div>
</body>
</html>`;
}

async function sendEmails(
  customerEmail: string,
  url: string,
  security: SecurityResult,
  performance: PerformanceResult | null,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const internalEmail = process.env.INTERNAL_EMAIL;
  console.log("[sendEmail] apiKey present:", !!apiKey, "from:", from, "to:", customerEmail);
  if (!apiKey) { console.error("[sendEmail] RESEND_API_KEY is not set"); return; }

  const resend = new Resend(apiKey);
  const subject = `【AI開発の非機能診断くん】${url}`;

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: customerEmail,
      subject,
      html: buildEmailHtml(url, security, performance, false, customerEmail),
    }),
    ...(internalEmail
      ? [
          resend.emails.send({
            from,
            to: internalEmail,
            subject: `[社内用] ${subject} (顧客: ${customerEmail})`,
            html: buildEmailHtml(url, security, performance, true, customerEmail),
          }),
        ]
      : []),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[sendEmail] email[${i}] rejected:`, r.reason);
    else console.log(`[sendEmail] email[${i}] sent:`, r.value);
  });
}

// ---- ハンドラー ----------------------------------------------------------

export default defineEventHandler(async (event) => {
  const { url, email } = await readBody(event);

  if (!url || !email) {
    throw createError({ statusCode: 400, message: "URL と メールアドレスは必須です" });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    throw createError({ statusCode: 400, message: "URL の形式が不正です" });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createError({ statusCode: 400, message: "http / https のみ対応しています" });
  }
  if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(parsed.hostname)) {
    throw createError({ statusCode: 400, message: "内部アドレスは指定できません" });
  }

  const targetUrl = parsed.origin + parsed.pathname;

  const [secResult, perfResult] = await Promise.allSettled([
    checkSecurity(targetUrl),
    fetchPerformance(targetUrl),
  ]);

  const security = secResult.status === "fulfilled"
    ? secResult.value
    : { score: 0, grade: "C" as Grade, isHttps: false, headers: [], findings: [] };

  const performance = perfResult.status === "fulfilled" ? perfResult.value : null;
  const psError = perfResult.status === "rejected" ? String(perfResult.reason) : null;

  await sendEmails(email, targetUrl, security, performance);

  return { url: targetUrl, security, performance, psError, email } satisfies AiResult;
});
