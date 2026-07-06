import { Resend } from "resend";

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

// リスクの説明（顧客向け）
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

// 改修案（社内向け）
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

type Grade = "A" | "B" | "C";

interface BulletSet {
  issues: string[]; // リスク・問題点（顧客向け）
  fixes: string[]; // 改修案（社内向け）
}

// 社内向け：具体的な問題要素の情報
interface AuditDetail {
  auditTitle: string;
  items: string[]; // HTMLスニペット・URL など
}

// 注目する詳細監査（社内メール用）
const DETAIL_AUDITS: Record<string, string> = {
  "image-alt": "alt属性がない画像",
  "render-blocking-resources": "レンダリングをブロックしているリソース",
  "uses-optimized-images": "最適化されていない画像",
  "uses-webp-images": "WebP/AVIF未対応の画像",
  "uses-responsive-images": "サイズオーバーの画像",
  "color-contrast": "コントラスト比が不十分な要素",
  "link-name": "テキストのないリンク",
  "button-name": "ラベルのないボタン",
  "document-title": "title タグの問題",
  "meta-description": "meta description の問題",
  "unminified-javascript": "未圧縮の JavaScript",
  "unminified-css": "未圧縮の CSS",
  "unused-javascript": "未使用の JavaScript",
  "unused-css-rules": "未使用の CSS",
};

function getGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 50) return "B";
  return "C";
}

async function fetchPageSpeed(url: string) {
  const key = process.env.GOOGLE_PSI_KEY;
  const keyParam = key ? `&key=${encodeURIComponent(key)}` : "";
  const apiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=mobile` +
    `&category=performance&category=accessibility&category=best-practices&category=seo` +
    keyParam;
  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PageSpeed API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const cats = data.lighthouseResult?.categories;
  const audits: Record<string, any> = data.lighthouseResult?.audits ?? {};
  if (!cats)
    throw new Error("PageSpeed API: lighthouseResult.categories が空です");

  // 社内向け：具体的な問題要素を抽出
  const auditDetails: AuditDetail[] = [];
  for (const [auditId, auditLabel] of Object.entries(DETAIL_AUDITS)) {
    const audit = audits[auditId];
    if (
      !audit ||
      audit.score === null ||
      audit.score >= 1 ||
      audit.scoreDisplayMode === "notApplicable"
    )
      continue;

    const rawItems: any[] = audit.details?.items ?? [];
    let formatted: string[] = rawItems
      .slice(0, 8)
      .map((item: any) => {
        // 画像・リソース系: url フィールド
        if (item.url) {
          const kb = item.wastedBytes
            ? ` (節約可能: ${Math.round(item.wastedBytes / 1024)}KB)`
            : "";
          return item.url + kb;
        }
        // DOM要素系: node.snippet
        if (item.node?.snippet) return item.node.snippet.slice(0, 120);
        // その他
        return JSON.stringify(item).slice(0, 100);
      })
      .filter(Boolean);

    // items がなくても displayValue や description に詳細がある場合
    if (formatted.length === 0) {
      if (audit.displayValue) formatted.push(`現状: ${audit.displayValue}`);
      if (audit.description) {
        const desc = audit.description
          .replace(/\[.*?\]\(.*?\)/g, "")
          .slice(0, 150);
        formatted.push(desc);
      }
    }

    if (formatted.length > 0) {
      auditDetails.push({ auditTitle: auditLabel, items: formatted });
    }
  }

  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    auditDetails,
  };
}

async function checkSecurity(url: string) {
  const isHttps = url.startsWith("https://");
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const found = SECURITY_HEADERS.filter((h) => res.headers.get(h));
    const headerScore = Math.round(
      (found.length / SECURITY_HEADERS.length) * 100,
    );
    const score = isHttps ? headerScore : Math.min(headerScore, 40);
    return {
      score,
      isHttps,
      headers: SECURITY_HEADERS.map((h) => ({
        name: h,
        present: !!res.headers.get(h),
      })),
    };
  } catch {
    return {
      score: 0,
      isHttps,
      headers: SECURITY_HEADERS.map((h) => ({ name: h, present: false })),
      error: "URLに接続できませんでした",
    };
  }
}

function buildContent(
  performance: { score: number; grade: Grade } | null,
  accessibility: { score: number; grade: Grade } | null,
  security: {
    score: number;
    grade: Grade;
    isHttps: boolean;
    headers: { name: string; present: boolean }[];
  } | null,
): { perf: BulletSet; acc: BulletSet; sec: BulletSet } {
  // パフォーマンス
  const perf: BulletSet = { issues: [], fixes: [] };
  if (performance) {
    const { score, grade } = performance;
    perf.issues.push(`パフォーマンススコア: ${score}点（${grade}評価）`);
    if (grade === "A") {
      perf.issues.push("表示速度は良好で、現時点でのリスクは低い状態です");
    } else if (grade === "B") {
      perf.issues.push(
        "表示速度がやや遅く、ユーザーの離脱率が上昇するリスクがあります",
      );
      perf.issues.push(
        "Googleの検索順位評価（Core Web Vitals）に悪影響を与える可能性があります",
      );
      perf.fixes.push(
        "画像を WebP などの次世代フォーマットに変換し、ファイルサイズを削減してください",
      );
      perf.fixes.push(
        "不要な JavaScript・CSS の遅延読み込み（Lazy Load）やコード分割を実施してください",
      );
      perf.fixes.push(
        "ブラウザキャッシュの有効期限設定を見直し、再訪問時の読み込みを高速化してください",
      );
    } else {
      perf.issues.push(
        "表示速度が深刻に遅く、多くのユーザーがページを離脱するリスクがあります",
      );
      perf.issues.push(
        "Core Web Vitals の基準を満たしておらず、SEO・検索順位に直接影響します",
      );
      perf.issues.push(
        "モバイルユーザーへの影響が特に大きく、機会損失が発生している可能性があります",
      );
      perf.fixes.push(
        "サーバーレスポンスタイム（TTFB）を改善するため、ホスティング環境・CDNの見直しを検討してください",
      );
      perf.fixes.push(
        "レンダリングブロックリソース（同期的な JS・CSS）を排除し、Critical CSS の抽出を行ってください",
      );
      perf.fixes.push(
        "Core Web Vitals（LCP・CLS・INP）の各指標を個別に測定し、優先度をつけて対応してください",
      );
      perf.fixes.push(
        "画像の最適化・フォントの事前読み込み・サードパーティスクリプトの見直しを実施してください",
      );
    }
  }

  // アクセシビリティ
  const acc: BulletSet = { issues: [], fixes: [] };
  if (accessibility) {
    const { score, grade } = accessibility;
    acc.issues.push(`アクセシビリティスコア: ${score}点（${grade}評価）`);
    if (grade === "A") {
      acc.issues.push(
        "障害を持つユーザーへの対応は良好で、現時点でのリスクは低い状態です",
      );
    } else if (grade === "B") {
      acc.issues.push(
        "一部のユーザーが操作・閲覧しにくい状態にある可能性があります",
      );
      acc.issues.push(
        "スクリーンリーダーなどの支援技術との互換性に問題がある可能性があります",
      );
      acc.fixes.push(
        "画像要素に alt 属性を付与し、スクリーンリーダーで内容を読み上げられるようにしてください",
      );
      acc.fixes.push(
        "ボタン・リンクに適切なラベル（aria-label 等）を設定してください",
      );
      acc.fixes.push(
        "文字色と背景色のコントラスト比が 4.5:1 以上になるよう配色を見直してください",
      );
    } else {
      acc.issues.push(
        "アクセシビリティへの対応が不十分で、多くのユーザーが利用困難な状態です",
      );
      acc.issues.push("障害者差別解消法の観点からも、早急な対応が求められます");
      acc.issues.push(
        "キーボードのみでの操作が正常に機能していない可能性があります",
      );
      acc.fixes.push(
        "見出し構造（h1〜h6）を論理的な階層になるよう整理してください",
      );
      acc.fixes.push(
        "フォーム要素すべてに対応する label タグを設定してください",
      );
      acc.fixes.push(
        "フォーカス可能な要素には明確なフォーカスインジケーターを設けてください",
      );
      acc.fixes.push(
        "WCAG 2.1 AA 基準に基づいた専門的なアクセシビリティ監査の実施を推奨します",
      );
    }
  }

  // セキュリティ
  const sec: BulletSet = { issues: [], fixes: [] };
  if (security) {
    const { score, grade, isHttps, headers } = security;
    sec.issues.push(`セキュリティスコア: ${score}点（${grade}評価）`);

    if (!isHttps) {
      sec.issues.push(
        "HTTP通信のみで運用されており、通信内容が暗号化されていません。個人情報・認証情報の傍受リスクがあります",
      );
      sec.fixes.push(
        "SSL証明書を取得し、全ページを HTTPS にリダイレクトしてください（Let's Encrypt 等で無料取得可能）",
      );
    } else {
      sec.issues.push("HTTPS通信が有効で、通信経路の暗号化は確保されています");
    }

    const missing = headers.filter((h) => !h.present);
    const present = headers.filter((h) => h.present);

    if (present.length > 0) {
      sec.issues.push(
        `設定済みセキュリティヘッダー（${present.length}件）: ${present.map((h) => HEADER_LABEL[h.name]).join("、")}`,
      );
    }

    if (missing.length > 0) {
      sec.issues.push(
        `未設定のセキュリティヘッダーが ${missing.length}件 あり、以下のリスクがあります:`,
      );
      for (const h of missing) {
        sec.issues.push(`  ・${HEADER_LABEL[h.name]}: ${HEADER_RISK[h.name]}`);
        sec.fixes.push(`${HEADER_LABEL[h.name]}: ${HEADER_FIX[h.name]}`);
      }
    }
  }

  return { perf, acc, sec };
}

function gradeColor(grade: Grade) {
  if (grade === "A") return "#16a34a";
  if (grade === "B") return "#ca8a04";
  return "#dc2626";
}

function buildEmailHtml(
  url: string,
  performance: { score: number; grade: Grade } | null,
  accessibility: { score: number; grade: Grade } | null,
  security: {
    score: number;
    grade: Grade;
    isHttps: boolean;
    headers: { name: string; present: boolean }[];
  } | null,
  includesFixes: boolean,
  auditDetails: AuditDetail[] = [],
) {
  const { perf, acc, sec } = buildContent(performance, accessibility, security);

  const scoreCard = (
    label: string,
    item: { score: number; grade: Grade } | null,
  ) => {
    if (!item)
      return `<td style="width:33%;padding:12px;text-align:center;background:#f3f4f6;border-radius:8px;"><p style="margin:0;font-size:11px;color:#9ca3af;">${label}</p><p style="margin:4px 0 0;font-size:32px;font-weight:900;color:#d1d5db;">–</p></td>`;
    return `<td style="width:33%;padding:12px;text-align:center;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;"><p style="margin:0;font-size:11px;color:#6b7280;">${label}</p><p style="margin:4px 0 0;font-size:32px;font-weight:900;color:${gradeColor(item.grade)};">${item.grade}</p><p style="margin:2px 0 0;font-size:11px;color:#6b7280;">${item.score} / 100</p></td>`;
  };

  const section = (title: string, set: BulletSet) => {
    const allItems = includesFixes
      ? [
          ...set.issues,
          ...(set.fixes.length ? ["【改修案】", ...set.fixes] : []),
        ]
      : set.issues;
    if (!allItems.length) return "";

    const rows = allItems
      .map((t) => {
        const isFixHeader = t === "【改修案】";
        const isIndent = t.startsWith("  ・");
        const isFix = includesFixes && set.fixes.includes(t);
        const color = isFixHeader
          ? "#2563eb"
          : isFix
            ? "#1d4ed8"
            : isIndent
              ? "#6b7280"
              : "#374151";
        const text = isIndent ? t.replace("  ・", "") : t;
        return `<li style="margin:${isFixHeader ? "12px" : "4px"} 0 4px;font-size:13px;color:${color};font-weight:${isFixHeader ? "700" : "400"};list-style:${isFixHeader ? "none" : "disc"};padding-left:${isIndent ? "8px" : "0"}">${text}</li>`;
      })
      .join("");

    return `<div style="margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">${title}</p>
      <ul style="margin:0;padding-left:16px;">${rows}</ul>
    </div>`;
  };

  const ctaSection = !includesFixes
    ? `
    <div style="margin:24px 0 0;padding:20px;background:#eff6ff;border-radius:8px;border-left:4px solid #2563eb;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1e3a8a;">詳細な改修案のご提案について</p>
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">５万円（税抜）で具体的な改善策を記載したレポートをご提供可能です。ご興味がありましたら、このメールにご返信ください。</p>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>AI開発の非機能診断くん</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#2563eb;padding:24px 32px;">
      <p style="margin:0;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:0.1em;text-transform:uppercase;">${includesFixes ? "[社内用] " : ""}Non-Functional Analysis</p>
      <h1 style="margin:4px 0 0;font-size:22px;font-weight:800;color:#fff;">AI開発の非機能診断くん</h1>
      <p style="margin:6px 0 0;font-size:12px;color:#bfdbfe;">${url}</p>
    </div>
    <div style="padding:24px 32px 8px;">
      <table style="width:100%;border-spacing:8px;border-collapse:separate;">
        <tr>
          ${scoreCard("パフォーマンス", performance)}
          ${scoreCard("アクセシビリティ", accessibility)}
          ${scoreCard("セキュリティ", security)}
        </tr>
      </table>
    </div>
    <div style="padding:16px 32px 32px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">
        ${includesFixes ? "診断結果・リスク・改修案" : "診断結果・リスク"}
      </h2>
      ${section("パフォーマンス", perf)}
      ${section("アクセシビリティ", acc)}
      ${section("セキュリティ", sec)}
      ${
        includesFixes && auditDetails.length
          ? `
        <div style="margin-top:24px;border-top:2px solid #e5e7eb;padding-top:20px;">
          <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111827;">具体的な問題箇所</h2>
          ${auditDetails
            .map(
              (d) => `
            <div style="margin-bottom:16px;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#374151;">● ${d.auditTitle}</p>
              <ul style="margin:0;padding-left:16px;">
                ${d.items
                  .map(
                    (item) => `
                  <li style="margin:3px 0;font-size:11px;color:#6b7280;font-family:monospace;word-break:break-all;">${item}</li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
          `,
            )
            .join("")}
        </div>`
          : ""
      }
      ${ctaSection}
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
  performance: { score: number; grade: Grade } | null,
  accessibility: { score: number; grade: Grade } | null,
  security: {
    score: number;
    grade: Grade;
    isHttps: boolean;
    headers: { name: string; present: boolean }[];
  } | null,
  auditDetails: AuditDetail[],
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const internalEmail = process.env.INTERNAL_EMAIL;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const subject = `【AI開発の非機能診断くん】${url}`;

  const sends = [
    resend.emails.send({
      from,
      to: customerEmail,
      subject,
      html: buildEmailHtml(
        url,
        performance,
        accessibility,
        security,
        false,
        [],
      ),
    }),
  ];

  if (internalEmail) {
    sends.push(
      resend.emails.send({
        from,
        to: internalEmail,
        subject: `[社内用] ${subject} (顧客: ${customerEmail})`,
        html: buildEmailHtml(
          url,
          performance,
          accessibility,
          security,
          true,
          auditDetails,
        ),
      }),
    );
  }

  await Promise.allSettled(sends);
}

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
  const host = parsed.hostname;
  if (
    /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)
  ) {
    throw createError({
      statusCode: 400,
      message: "内部アドレスは指定できません",
    });
  }

  const targetUrl = parsed.toString();

  const [psResult, secResult] = await Promise.allSettled([
    fetchPageSpeed(targetUrl),
    checkSecurity(targetUrl),
  ]);

  const ps = psResult.status === "fulfilled" ? psResult.value : null;
  const sec = secResult.status === "fulfilled" ? secResult.value : null;

  const performance =
    ps?.performance != null
      ? { score: ps.performance, grade: getGrade(ps.performance) }
      : null;
  const accessibility =
    ps?.accessibility != null
      ? { score: ps.accessibility, grade: getGrade(ps.accessibility) }
      : null;
  const security =
    sec != null
      ? {
          score: sec.score,
          grade: getGrade(sec.score),
          isHttps: sec.isHttps,
          headers: sec.headers,
        }
      : null;
  const auditDetails = ps?.auditDetails ?? [];

  sendEmails(
    email,
    targetUrl,
    performance,
    accessibility,
    security,
    auditDetails,
  ).catch(console.error);

  return {
    url: targetUrl,
    email,
    performance,
    accessibility,
    security,
    error: psResult.status === "rejected" ? String(psResult.reason) : null,
  };
});
