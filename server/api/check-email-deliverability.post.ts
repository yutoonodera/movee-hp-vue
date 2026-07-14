import dns from "node:dns/promises";
import { Resend } from "resend";

interface SpfResult  { found: boolean; record: string | null; strict: boolean; softFail: boolean }
interface DmarcResult { found: boolean; record: string | null; policy: "none" | "quarantine" | "reject" | null }
interface DkimResult  { found: boolean; selector: string | null }
interface MxResult    { found: boolean; records: string[] }
type Grade = "A" | "B" | "C";

async function checkSpf(domain: string): Promise<SpfResult> {
  try {
    const records = await dns.resolveTxt(domain);
    const spf = records.flat().find(r => r.startsWith("v=spf1"));
    if (!spf) return { found: false, record: null, strict: false, softFail: false };
    return { found: true, record: spf, strict: spf.includes("-all"), softFail: spf.includes("~all") };
  } catch { return { found: false, record: null, strict: false, softFail: false }; }
}

async function checkDmarc(domain: string): Promise<DmarcResult> {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarc = records.flat().find(r => r.startsWith("v=DMARC1"));
    if (!dmarc) return { found: false, record: null, policy: null };
    const m = dmarc.match(/p=(none|quarantine|reject)/);
    return { found: true, record: dmarc, policy: (m?.[1] ?? "none") as DmarcResult["policy"] };
  } catch { return { found: false, record: null, policy: null }; }
}

const DKIM_SELECTORS = ["google","default","mail","selector1","selector2","k1","s1","s2","dkim","email","smtp","mx"];

async function checkDkim(domain: string): Promise<DkimResult> {
  const results = await Promise.allSettled(
    DKIM_SELECTORS.map(async sel => {
      const records = await dns.resolveTxt(`${sel}._domainkey.${domain}`);
      const hit = records.flat().find(r => r.includes("v=DKIM1") || r.includes("k=rsa") || r.includes("p="));
      if (hit) return sel;
      throw new Error();
    })
  );
  const found = results.find(r => r.status === "fulfilled") as PromiseFulfilledResult<string> | undefined;
  return found ? { found: true, selector: found.value } : { found: false, selector: null };
}

async function checkMx(domain: string): Promise<MxResult> {
  try {
    const mx = await dns.resolveMx(domain);
    return { found: mx.length > 0, records: mx.sort((a,b) => a.priority - b.priority).map(m => m.exchange) };
  } catch { return { found: false, records: [] }; }
}

function buildHtml(domain: string, spf: SpfResult, dmarc: DmarcResult, dkim: DkimResult, mx: MxResult, grade: Grade, toEmail: string, isInternal: boolean): string {
  const gc = grade === "A" ? "#16a34a" : grade === "B" ? "#ca8a04" : "#dc2626";
  const row = (label: string, ok: boolean, detail: string) =>
    `<tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:8px 12px;font-size:13px;font-weight:700;color:#374151">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:${ok ? "#16a34a" : "#dc2626"}">${ok ? "✓ OK" : "✗ 未設定"}</td>
      <td style="padding:8px 12px;font-size:11px;font-family:monospace;color:#6b7280;word-break:break-all">${detail}</td>
    </tr>`;
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,sans-serif">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
  <div style="background:#0f172a;padding:24px 32px">
    <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase">${isInternal ? "[社内用] " : ""}メール到達性チェッカー</p>
    <h1 style="margin:4px 0 0;font-size:20px;font-weight:800;color:#fff">診断レポート</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#64748b">${domain}</p>
  </div>
  <div style="padding:24px 32px">
    <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:8px;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em">総合評価</p>
      <p style="margin:0;font-size:52px;font-weight:900;color:${gc};line-height:1">${grade}</p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <tr style="background:#f8fafc">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">項目</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">状態</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">レコード</th>
      </tr>
      ${row("SPF",   spf.found,   spf.record   ?? "—")}
      ${row("DMARC", dmarc.found, dmarc.found ? `p=${dmarc.policy}` : "—")}
      ${row("DKIM",  dkim.found,  dkim.found   ? `selector: ${dkim.selector}` : "—")}
      ${row("MX",    mx.found,    mx.records.join(", ") || "—")}
    </table>
    ${isInternal ? `<p style="margin:16px 0 0;font-size:11px;color:#9ca3af">顧客メール: ${toEmail}</p>` : ""}
  </div>
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 32px;text-align:center">
    <p style="margin:0;font-size:11px;color:#9ca3af">メール到達性チェッカー by movee</p>
  </div>
</div></body></html>`;
}

export default defineEventHandler(async (event) => {
  const { domain: rawDomain, email } = await readBody(event);
  if (!rawDomain) throw createError({ statusCode: 400, message: "ドメインは必須です" });
  if (!email)     throw createError({ statusCode: 400, message: "メールアドレスは必須です" });

  const domain = (rawDomain as string).includes("@")
    ? (rawDomain as string).split("@")[1].toLowerCase().trim()
    : (rawDomain as string).replace(/^https?:\/\//, "").split("/")[0].toLowerCase().trim();

  if (!domain || !/^[a-z0-9][a-z0-9\-.]+\.[a-z]{2,}$/.test(domain)) {
    throw createError({ statusCode: 400, message: "有効なドメインを入力してください" });
  }

  const [spf, dmarc, dkim, mx] = await Promise.all([checkSpf(domain), checkDmarc(domain), checkDkim(domain), checkMx(domain)]);

  const score =
    (spf.found ? (spf.strict ? 2 : 1) : 0) +
    (dmarc.found ? (dmarc.policy === "reject" ? 2 : dmarc.policy === "quarantine" ? 1 : 0) : 0) +
    (dkim.found ? 2 : 0);
  const grade: Grade = score >= 5 ? "A" : score >= 2 ? "B" : "C";

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend  = new Resend(apiKey);
    const from    = process.env.RESEND_FROM ?? "onboarding@resend.dev";
    const internal = process.env.INTERNAL_EMAIL;
    const subject = `【メール到達性チェッカー】${domain}`;
    await Promise.allSettled([
      resend.emails.send({ from, to: email, subject, html: buildHtml(domain, spf, dmarc, dkim, mx, grade, email, false) }),
      ...(internal ? [resend.emails.send({ from, to: internal, subject: `[社内用] ${subject}`, html: buildHtml(domain, spf, dmarc, dkim, mx, grade, email, true) })] : []),
    ]);
  }

  return { domain, spf, dmarc, dkim, mx, grade, email };
});
