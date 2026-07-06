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
  "strict-transport-security":
    "通信が暗号化されず、中間者攻撃によるデータ傍受のリスクがあります",
  "content-security-policy":
    "悪意あるスクリプトの実行（XSS）を防ぐ設定がなく、情報漏えいリスクがあります",
  "x-frame-options":
    "クリックジャッキング攻撃により、ユーザーを騙した操作を誘導される可能性があります",
  "x-content-type-options":
    "ブラウザがファイルタイプを誤認識し、意図しないスクリプトが実行されるリスクがあります",
  "referrer-policy":
    "外部サイトへのリンク経由でURLやセッション情報が漏えいする可能性があります",
  "permissions-policy":
    "カメラ・マイク・位置情報などへの不正アクセスを制限できていない状態です",
};

const HEADER_FIX: Record<string, string> = {
  "strict-transport-security":
    "Strict-Transport-Security: max-age=31536000; includeSubDomains をレスポンスヘッダーに追加してください",
  "content-security-policy":
    "Content-Security-Policy ヘッダーでスクリプト・スタイルの許可元を明示的に制限してください",
  "x-frame-options":
    "X-Frame-Options: DENY または SAMEORIGIN をヘッダーに設定してください",
  "x-content-type-options":
    "X-Content-Type-Options: nosniff をレスポンスヘッダーに追加してください",
  "referrer-policy":
    "Referrer-Policy: strict-origin-when-cross-origin に設定することを推奨します",
  "permissions-policy":
    "Permissions-Policy ヘッダーで camera=(), microphone=(), geolocation=() など不要な機能を無効化してください",
};

const DETAIL_AUDITS: Record<string, { title: string; advice: string }> = {
  // ── 表示速度 ──────────────────────────────────────────────────────────
  "render-blocking-resources": {
    title: "ページ表示を遅らせているリソースがある",
    advice:
      "プラグインやテーマが出力するJSやCSSがレンダリングを妨げています。WordPressのままでは制御が難しく、Next.jsなどのフロントエンド分離構成に移行することで根本的に解消できます",
  },
  "uses-optimized-images": {
    title: "画像ファイルのサイズが最適化されていない",
    advice:
      "WebP/AVIF形式への変換と遅延読み込み（lazy loading）の導入で、画像による速度低下を抑えられます",
  },
  "uses-webp-images": {
    title: "古い画像形式（JPEG/PNG）を使っている",
    advice: "WebP/AVIFに変換するだけで同品質のまま容量を30〜50%削減できます",
  },
  "uses-responsive-images": {
    title: "表示サイズより大きい画像を配信している",
    advice:
      "srcset属性で画面サイズに応じた適切な解像度の画像を配信する設定を追加してください",
  },
  "unused-javascript": {
    title: "読み込んでいるJavaScriptの量が多い",
    advice:
      "テーマやプラグインが出力するJSが原因のため、WordPress環境では根本的な削減が困難です。フロントエンドをNext.jsなどに分離する構成に移行することで解消できます",
  },
  "unused-css-rules": {
    title: "読み込んでいるCSSの量が多い",
    advice:
      "テーマが一括配信するCSSが原因のため、WordPress環境では未使用CSSの除去に限界があります。Next.jsなどのフロントエンド分離構成に移行することで、必要なスタイルのみ配信できます",
  },
  "unminified-javascript": {
    title: "JavaScriptファイルが圧縮されていない",
    advice:
      "ビルドツール（Vite/webpack等）でminifyすることで、ファイルサイズを削減できます",
  },
  "unminified-css": {
    title: "CSSファイルが圧縮されていない",
    advice:
      "ビルドツールでminifyするか、CDNのCSSオプティマイザーを有効にしてください",
  },
  // ── 使いやすさ（アクセシビリティ） ────────────────────────────────────
  "image-alt": {
    title: "alt属性のない画像がある",
    advice:
      "スクリーンリーダーが読み上げられず、検索エンジンの評価にも影響します。すべての画像に内容を表すalt属性を設定してください",
  },
  "color-contrast": {
    title: "文字が読みにくい箇所がある（コントラスト不足）",
    advice:
      "文字色と背景色のコントラスト比を4.5:1以上に調整することを推奨します",
  },
  "link-name": {
    title: "何のリンクか分からないリンクがある",
    advice:
      "「こちら」「詳しくは」のようなリンクテキストはSEOにも悪影響です。行き先を具体的に示すテキストに変更してください",
  },
  "button-name": {
    title: "説明のないボタンがある",
    advice:
      "ボタンにテキストまたはaria-labelを設定することで、スクリーンリーダーでも操作できるようになります",
  },
  "document-title": {
    title: "ページタイトルに問題がある",
    advice:
      "各ページに固有のtitleタグを設定することで、SEOと検索結果への表示が改善します",
  },
  "meta-description": {
    title: "ページ説明文（meta description）が設定されていない",
    advice:
      "検索結果のスニペットとして表示されます。各ページに120〜160字程度の説明を追加してください",
  },
};

// ---- 型 ------------------------------------------------------------------

type Grade = "A" | "B" | "C";

interface ScoreItem {
  score: number;
  grade: Grade;
}
interface AuditDetail {
  auditTitle: string;
  items: string[];
}
interface SecurityFinding {
  level: "critical" | "warning" | "info";
  message: string;
}
interface SecurityResult {
  score: number;
  grade: Grade;
  isHttps: boolean;
  headers: { name: string; present: boolean }[];
  findings: SecurityFinding[];
}
interface PageResult {
  url: string;
  performance: ScoreItem | null;
  accessibility: ScoreItem | null;
  auditDetails: AuditDetail[];
  psError: string | null;
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

// ---- PageSpeed ----------------------------------------------------------

async function fetchPageSpeed(url: string): Promise<{
  performance: number;
  accessibility: number;
  auditDetails: AuditDetail[];
}> {
  const key = process.env.GOOGLE_PSI_KEY;
  const keyParam = key ? `&key=${encodeURIComponent(key)}` : "";
  const apiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=mobile` +
    `&category=performance&category=accessibility` +
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
  const audits: Record<string, any> = data.lighthouseResult?.audits ?? {};
  if (!cats) throw new Error("lighthouseResult.categories が空です");

  const auditDetails: AuditDetail[] = [];
  for (const [id, entry] of Object.entries(DETAIL_AUDITS)) {
    const audit = audits[id];
    if (
      !audit ||
      audit.score === null ||
      audit.score >= 1 ||
      audit.scoreDisplayMode === "notApplicable"
    )
      continue;
    const count: number = audit.details?.items?.length ?? 0;
    const savings = audit.displayValue ?? "";
    const items: string[] = [entry.advice];
    if (count > 0)
      items.push(`${count}箇所で確認${savings ? `（${savings}）` : ""}`);
    auditDetails.push({ auditTitle: entry.title, items });
  }

  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    auditDetails,
  };
}

// ---- セキュリティ --------------------------------------------------------

async function checkSecurity(url: string): Promise<SecurityResult> {
  const isHttps = url.startsWith("https://");
  const findings: SecurityFinding[] = [];

  try {
    const origin = new URL(url).origin;

    // ── ヘッダーチェック ──────────────────────────────────────
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const found = SECURITY_HEADERS.filter((h) => res.headers.get(h));
    let headerScore = Math.round(
      (found.length / SECURITY_HEADERS.length) * 100,
    );

    // ── .env ファイル公開チェック ─────────────────────────────
    try {
      const envRes = await fetch(`${origin}/.env`, {
        signal: AbortSignal.timeout(5000),
      });
      if (envRes.ok) {
        const text = await envRes.text().catch(() => "");
        if (text.includes("=")) {
          findings.push({
            level: "critical",
            message:
              "【重大】.envファイルがインターネット上に公開されています。APIキーやDB接続情報が漏洩している可能性があります。即時対応が必要です",
          });
          headerScore = 0;
        }
      }
    } catch {}

    // ── HTMLソース内の環境変数・機密情報チェック ───────────────
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
          findings.push({
            level: "critical",
            message:
              "【重大】APIキーや環境変数がHTMLソースコードに含まれている可能性があります。フロントエンドのビルド設定を確認し、秘密情報が公開されていないか確認してください",
          });
          headerScore = Math.min(headerScore, 20);
        }

        // WordPress検出 → SQLインジェクションリスク
        const isWP =
          html.includes("/wp-content/") ||
          html.includes("wp-json") ||
          (res.headers.get("x-powered-by") ?? "").toLowerCase().includes("php");
        if (isWP) {
          findings.push({
            level: "warning",
            message:
              "WordPressが検出されました。プラグインの脆弱性を経由したSQLインジェクションリスクが存在します。不要なプラグインの削除と定期的なアップデートを推奨します",
          });
          findings.push({
            level: "info",
            message:
              "WordPress管理画面（/wp-admin）が外部からアクセス可能な場合、ブルートフォース攻撃の対象になります。IPアドレス制限または2要素認証の設定を推奨します",
          });
        }
      }
    } catch {}

    const score = isHttps ? headerScore : Math.min(headerScore, 40);
    return {
      score,
      grade: getGrade(score),
      isHttps,
      headers: SECURITY_HEADERS.map((h) => ({
        name: h,
        present: !!res.headers.get(h),
      })),
      findings,
    };
  } catch {
    return {
      score: 0,
      grade: "C",
      isHttps,
      headers: SECURITY_HEADERS.map((h) => ({ name: h, present: false })),
      findings,
    };
  }
}

// ---- メール --------------------------------------------------------------

function scoreCardHtml(label: string, item: ScoreItem | null) {
  if (!item)
    return `<td style="padding:10px;text-align:center;background:#f3f4f6;border-radius:8px;"><p style="margin:0;font-size:10px;color:#9ca3af;">${label}</p><p style="margin:4px 0 0;font-size:24px;font-weight:900;color:#d1d5db;">–</p></td>`;
  return `<td style="padding:10px;text-align:center;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;"><p style="margin:0;font-size:10px;color:#6b7280;">${label}</p><p style="margin:4px 0 0;font-size:24px;font-weight:900;color:${gradeColor(item.grade)};">${item.grade}</p><p style="margin:2px 0 0;font-size:10px;color:#6b7280;">${item.score}点</p></td>`;
}

function buildEmailHtml(
  rootUrl: string,
  pages: PageResult[],
  security: SecurityResult | null,
  includesFixes: boolean,
  customerEmail: string,
) {
  // サマリーテーブル
  const tableRows = pages
    .map((p) => {
      const path = (() => {
        try {
          return new URL(p.url).pathname || "/";
        } catch {
          return p.url;
        }
      })();
      const cell = (item: ScoreItem | null) =>
        item
          ? `<td style="padding:8px 12px;text-align:center;font-weight:700;color:${gradeColor(item.grade)};">${item.grade}<span style="font-weight:400;color:#6b7280;font-size:11px;"> ${item.score}</span></td>`
          : `<td style="padding:8px 12px;text-align:center;color:#9ca3af;">–</td>`;
      return `<tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:8px 12px;font-size:12px;color:#374151;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${p.url}">${path}</td>
      ${cell(p.performance)}
      ${cell(p.accessibility)}
      <td style="padding:8px 12px;text-align:center;font-weight:700;color:${security ? gradeColor(security.grade) : "#9ca3af"};">${security ? security.grade : "–"}<span style="font-weight:400;color:#6b7280;font-size:11px;"> ${security?.score ?? ""}</span></td>
    </tr>`;
    })
    .join("");

  // セキュリティ詳細
  let secHtml = "";
  if (security) {
    const missing = security.headers.filter((h) => !h.present);
    const present = security.headers.filter((h) => h.present);
    const levelColor = (l: string) =>
      l === "critical" ? "#dc2626" : l === "warning" ? "#d97706" : "#2563eb";
    const findingsHtml = security.findings.length
      ? security.findings
          .map(
            (f) =>
              `<li style="font-size:13px;color:${levelColor(f.level)};margin-bottom:4px;">${f.message}</li>`,
          )
          .join("")
      : "";
    secHtml = `<div style="margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">セキュリティ（ドメイン共通）</p>
      <ul style="margin:0;padding-left:16px;">
        ${findingsHtml}
        <li style="font-size:13px;color:${security.isHttps ? "#16a34a" : "#dc2626"};">${security.isHttps ? "HTTPS通信が有効です" : "HTTPのみで運用されています（HTTPS化が必要）"}</li>
        ${present.length ? `<li style="font-size:13px;color:#374151;">設定済みヘッダー（${present.length}件）: ${present.map((h) => HEADER_LABEL[h.name]).join("、")}</li>` : ""}
        ${missing.map((h) => `<li style="font-size:13px;color:#dc2626;">未設定: ${HEADER_LABEL[h.name]} — ${HEADER_RISK[h.name]}</li>`).join("")}
        ${includesFixes ? missing.map((h) => `<li style="font-size:12px;color:#1d4ed8;padding-left:8px;">→ 改修: ${HEADER_FIX[h.name]}</li>`).join("") : ""}
      </ul>
    </div>`;
  }

  // 問題箇所詳細（顧客・社内共通）
  let detailsHtml = "";
  const pagesWithIssues = pages.filter((p) => p.auditDetails.length > 0);
  if (pagesWithIssues.length > 0) {
    detailsHtml = `<div style="margin-top:24px;border-top:2px solid #e5e7eb;padding-top:20px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111827;">主な改善ポイント</h2>
      ${pagesWithIssues
        .map((p) => {
          return `<div style="margin-bottom:20px;">
          ${p.auditDetails
            .map(
              (d) => `
            <p style="margin:6px 0 4px;font-size:13px;font-weight:600;color:#374151;">● ${d.auditTitle}</p>
            <ul style="margin:0;padding-left:16px;">
              ${d.items.map((item) => `<li style="margin:2px 0;font-size:12px;color:#6b7280;line-height:1.6;">${item}</li>`).join("")}
            </ul>`,
            )
            .join("")}
        </div>`;
        })
        .join("")}
    </div>`;
  }

  const flexpressBannerHtml = `
    <div style="margin:20px 0 0;background:#4338ca;border-radius:8px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <div>
        <p style="margin:0 0 2px;font-size:10px;color:#a5b4fc;">by movee</p>
        <p style="margin:0;font-size:14px;font-weight:800;color:#ffffff;line-height:1.3;">WordPressをNext.js化するパッケージ <span style="font-family:monospace;font-weight:900;">flexpress</span></p>
      </div>
      <a href="mailto:info@movee.jp" style="flex-shrink:0;display:inline-block;background:#d97706;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;padding:8px 16px;border-radius:4px;white-space:nowrap;">詳しく見る →</a>
    </div>`;

  const ctaHtml = !includesFixes
    ? `
    <div style="margin:24px 0 0;padding:20px;background:#eff6ff;border-radius:8px;border-left:4px solid #2563eb;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1e3a8a;">詳細な改修案のご提案について</p>
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">５万円（税抜）で具体的な改善策を記載したレポートをご提供可能です。ご興味がありましたら、このメールにご返信ください。</p>
    </div>
    ${flexpressBannerHtml}`
    : `<p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">顧客メールアドレス: ${customerEmail}</p>`;

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>Wordpressの非機能診断くん</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:620px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
  <div style="background:#2563eb;padding:24px 32px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:0.1em;text-transform:uppercase;">${includesFixes ? "[社内用] " : ""}Wordpressの非機能診断くん</p>
    <h1 style="margin:4px 0 0;font-size:22px;font-weight:800;color:#fff;">Wordpressの非機能診断くん</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#bfdbfe;">${rootUrl} （${pages.length}ページ）</p>
  </div>
  <div style="padding:24px 32px 0;">
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;">ページ</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#6b7280;font-weight:600;">パフォーマンス</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#6b7280;font-weight:600;">アクセシビリティ</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#6b7280;font-weight:600;">セキュリティ</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>
  <div style="padding:20px 32px 32px;">
    ${secHtml}
    ${detailsHtml}
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
  rootUrl: string,
  pages: PageResult[],
  security: SecurityResult | null,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const internalEmail = process.env.INTERNAL_EMAIL;
  console.log("[sendEmail] apiKey present:", !!apiKey, "from:", from, "to:", customerEmail);
  if (!apiKey) { console.error("[sendEmail] RESEND_API_KEY is not set"); return; }

  const resend = new Resend(apiKey);
  const subject = `【Wordpressの非機能診断くん】${rootUrl}`;

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: customerEmail,
      subject,
      html: buildEmailHtml(rootUrl, pages, security, false, customerEmail),
    }),
    ...(internalEmail
      ? [
          resend.emails.send({
            from,
            to: internalEmail,
            subject: `[社内用] ${subject} (顧客: ${customerEmail})`,
            html: buildEmailHtml(rootUrl, pages, security, true, customerEmail),
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
    throw createError({
      statusCode: 400,
      message: "URL と メールアドレスは必須です",
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    throw createError({ statusCode: 400, message: "URL の形式が不正です" });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createError({
      statusCode: 400,
      message: "http / https のみ対応しています",
    });
  }
  if (
    /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(
      parsed.hostname,
    )
  ) {
    throw createError({
      statusCode: 400,
      message: "内部アドレスは指定できません",
    });
  }

  const rootUrl = parsed.origin + parsed.pathname;

  // 1. 指定URLのみ
  const urls = [rootUrl];

  // 2. セキュリティはルートドメインで1回だけ
  const security = await checkSecurity(rootUrl).catch(() => null);

  // 3. 各ページを順番に PageSpeed 分析（レート制限対策で1秒間隔）
  const pages: PageResult[] = [];
  for (let i = 0; i < urls.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 2000));
    const pageUrl = urls[i];
    try {
      const ps = await fetchPageSpeed(pageUrl);
      pages.push({
        url: pageUrl,
        performance: { score: ps.performance, grade: getGrade(ps.performance) },
        accessibility: {
          score: ps.accessibility,
          grade: getGrade(ps.accessibility),
        },
        auditDetails: ps.auditDetails,
        psError: null,
      });
    } catch (e: any) {
      const msg = String(e);
      pages.push({
        url: pageUrl,
        performance: null,
        accessibility: null,
        auditDetails: [],
        psError: msg,
      });
    }
  }

  await sendEmails(email, rootUrl, pages, security);

  return { rootUrl, pages, security, email, crawledCount: urls.length };
});
