import { Resend } from "resend";

type Risk  = "critical" | "warning" | "safe";
type Grade = "A" | "B" | "C";

interface EndpointResult {
  path: string;
  method: string;
  status: number | null;
  exposed: boolean;
  risk: Risk;
}

interface GraphqlResult {
  endpoint: boolean;
  introspectionEnabled: boolean;
}

interface NuxtLeakResult {
  sourceMapsExposed: boolean;
  exposedUrl: string | null;
}

// ---- Swagger/OpenAPI 候補URL ------------------------------------------

function swaggerCandidates(origin: string, basePath: string): string[] {
  const bp = basePath.replace(/\/$/, "");
  return [
    `${origin}${bp}/openapi.json`,
    `${origin}${bp}/swagger.json`,
    `${origin}${bp}/api-docs`,
    `${origin}${bp}/v3/api-docs`,
    `${origin}${bp}/docs`,
    `${origin}${bp}/documentation`,
    `${origin}${bp}/swagger`,
    `${origin}/openapi.json`,
    `${origin}/swagger.json`,
    `${origin}/api-docs`,
    `${origin}/v3/api-docs`,
    `${origin}/swagger/v1/swagger.json`,
    `${origin}/docs/openapi.json`,
  ];
}

async function findSwagger(origin: string, basePath: string) {
  for (const url of swaggerCandidates(origin, basePath)) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json, */*", "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(5000),
        redirect: "follow",
      });
      if (!res.ok) continue;
      if (!(res.headers.get("content-type") ?? "").includes("json")) continue;
      const data = await res.json().catch(() => null);
      if (data && (data.openapi || data.swagger || data.paths)) return { url, spec: data };
    } catch {}
  }
  return null;
}

// ---- OpenAPI パス抽出 ---------------------------------------------------

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];

function extractPaths(spec: any): { path: string; method: string }[] {
  const result: { path: string; method: string }[] = [];
  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    for (const m of HTTP_METHODS) {
      if ((methods as any)[m]) result.push({ path, method: m.toUpperCase() });
    }
  }
  return result;
}

// ---- フォールバック 典型パス --------------------------------------------

const COMMON_PATHS = [
  "/users", "/user", "/accounts", "/account", "/members",
  "/admin", "/admins", "/administrator",
  "/config", "/configuration", "/settings",
  "/env", "/environment",
  "/debug", "/test",
  "/logs", "/log",
  "/keys", "/key",
  "/tokens", "/token",
  "/auth", "/login",
  "/health", "/status",
  "/export", "/import",
];

// ---- リスク判定 ---------------------------------------------------------

function getRisk(path: string, exposed: boolean): Risk {
  if (!exposed) return "safe";
  const p = path.toLowerCase();
  const critical = ["admin", "user", "account", "member", "config", "secret",
                    "key", "token", "password", "env", "debug", "log", "export"];
  return critical.some((k) => p.includes(k)) ? "critical" : "warning";
}

// ---- エンドポイントチェック ---------------------------------------------

async function checkEndpoint(origin: string, path: string): Promise<EndpointResult> {
  const url = `${origin}${path}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
    const exposed = res.status >= 200 && res.status < 300;
    return { path, method: "GET", status: res.status, exposed, risk: getRisk(path, exposed) };
  } catch {
    return { path, method: "GET", status: null, exposed: false, risk: "safe" };
  }
}

// ---- GraphQL イントロスペクション ---------------------------------------

async function checkGraphql(origin: string): Promise<GraphqlResult> {
  try {
    const res = await fetch(`${origin}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify({ query: "{ __schema { types { name } } }" }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { endpoint: false, introspectionEnabled: false };
    const data = await res.json().catch(() => null);
    const introspectionEnabled = !!(data?.data?.__schema);
    return { endpoint: true, introspectionEnabled };
  } catch {
    return { endpoint: false, introspectionEnabled: false };
  }
}

// ---- Nuxt ソースマップ漏洩チェック -------------------------------------

async function checkNuxtLeak(origin: string): Promise<NuxtLeakResult> {
  try {
    const html = await $fetch<string>(origin, {
      responseType: "text",
      signal: AbortSignal.timeout(8000),
    });
    const match = html.match(/\/_nuxt\/([\w\-.]+\.js)/);
    if (!match) return { sourceMapsExposed: false, exposedUrl: null };
    const mapUrl = `${origin}/_nuxt/${match[1]}.map`;
    const mapRes = await fetch(mapUrl, { signal: AbortSignal.timeout(5000) });
    if (mapRes.ok) return { sourceMapsExposed: true, exposedUrl: mapUrl };
  } catch {}
  return { sourceMapsExposed: false, exposedUrl: null };
}

// ---- メール送信 ---------------------------------------------------------

function buildEmail(
  url: string,
  basePath: string,
  endpoints: EndpointResult[],
  swagger: { found: boolean; specUrl: string | null; title: string | null },
  graphql: GraphqlResult,
  nuxt: NuxtLeakResult,
  grade: Grade,
  email: string,
  isInternal: boolean,
): string {
  const gradeColor = grade === "A" ? "#16a34a" : grade === "B" ? "#ca8a04" : "#dc2626";
  const exposed = endpoints.filter(e => e.exposed);
  const riskColor = (r: Risk) => r === "critical" ? "#dc2626" : "#d97706";

  const exposedRows = exposed.map(e =>
    `<tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:8px 12px;font-family:monospace;font-size:12px;color:#374151">${e.path}</td>
      <td style="padding:8px 12px;font-size:12px;font-weight:700;color:${riskColor(e.risk)}">${e.risk === "critical" ? "⚠ 要対応" : "△ 確認推奨"}</td>
      <td style="padding:8px 12px;font-size:12px;color:#6b7280">${e.status ?? "—"}</td>
    </tr>`
  ).join("");

  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="max-width:620px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
  <div style="background:#0f172a;padding:24px 32px">
    <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase">${isInternal ? "[社内用] " : ""}APIセキュリティ診断くん</p>
    <h1 style="margin:4px 0 0;font-size:20px;font-weight:800;color:#fff">診断レポート</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#64748b">${url} ${basePath}</p>
  </div>
  <div style="padding:24px 32px">
    <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:8px;margin-bottom:20px">
      <p style="margin:0 0 4px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em">総合評価</p>
      <p style="margin:0;font-size:48px;font-weight:900;color:${gradeColor};line-height:1">${grade}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#94a3b8">${exposed.length === 0 ? "問題は検出されませんでした" : `${exposed.length}件のエンドポイントが公開中`}</p>
    </div>
    ${swagger.found ? `<p style="padding:10px 14px;background:#fef3c7;border-radius:6px;font-size:13px;margin:0 0 16px">⚠ Swagger/OpenAPI仕様書が公開されています: ${swagger.specUrl}</p>` : ""}
    ${graphql.introspectionEnabled ? `<p style="padding:10px 14px;background:#fee2e2;border-radius:6px;font-size:13px;margin:0 0 16px">⚠ GraphQLイントロスペクションが有効です</p>` : ""}
    ${nuxt.sourceMapsExposed ? `<p style="padding:10px 14px;background:#fee2e2;border-radius:6px;font-size:13px;margin:0 0 16px">⚠ Nuxt.jsのソースマップが公開されています: ${nuxt.exposedUrl}</p>` : ""}
    ${exposed.length ? `
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em">公開中のエンドポイント</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f8fafc">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">パス</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">リスク</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280">ステータス</th>
      </tr>
      ${exposedRows}
    </table>` : ""}
    ${isInternal ? `<p style="margin:16px 0 0;font-size:11px;color:#9ca3af">顧客メールアドレス: ${email}</p>` : ""}
  </div>
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 32px;text-align:center">
    <p style="margin:0;font-size:11px;color:#9ca3af">このレポートは自動生成されました — APIセキュリティ診断くん by movee</p>
  </div>
</div></body></html>`;
}

async function sendEmail(
  email: string, url: string, basePath: string,
  endpoints: EndpointResult[],
  swagger: { found: boolean; specUrl: string | null; title: string | null },
  graphql: GraphqlResult,
  nuxt: NuxtLeakResult,
  grade: Grade,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const internalEmail = process.env.INTERNAL_EMAIL;
  if (!apiKey) return;

  const resend  = new Resend(apiKey);
  const subject = `【APIセキュリティ診断くん】${url}`;

  await Promise.allSettled([
    resend.emails.send({ from, to: email, subject,
      html: buildEmail(url, basePath, endpoints, swagger, graphql, nuxt, grade, email, false) }),
    ...(internalEmail ? [resend.emails.send({ from, to: internalEmail,
      subject: `[社内用] ${subject} (${email})`,
      html: buildEmail(url, basePath, endpoints, swagger, graphql, nuxt, grade, email, true) })] : []),
  ]);
}

// ---- ハンドラー ---------------------------------------------------------

export default defineEventHandler(async (event) => {
  const { url, basePath: rawBase, email } = await readBody(event);
  if (!url)   throw createError({ statusCode: 400, message: "URLは必須です" });
  if (!email) throw createError({ statusCode: 400, message: "メールアドレスは必須です" });

  const targetUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
  let parsed: URL;
  try { parsed = new URL(targetUrl); } catch {
    throw createError({ statusCode: 400, message: "有効なURLを入力してください" });
  }

  const origin   = parsed.origin;
  const basePath = ((rawBase as string) || "/api").replace(/\/$/, "") || "/api";

  // 全チェックを並列実行
  const [swaggerRes, graphqlRes, nuxtRes] = await Promise.allSettled([
    findSwagger(origin, basePath),
    checkGraphql(origin),
    checkNuxtLeak(origin),
  ]);

  const swagger = swaggerRes.status === "fulfilled" ? swaggerRes.value : null;
  const graphql = graphqlRes.status === "fulfilled" ? graphqlRes.value : { endpoint: false, introspectionEnabled: false };
  const nuxt    = nuxtRes.status === "fulfilled" ? nuxtRes.value : { sourceMapsExposed: false, exposedUrl: null };

  let toCheck: string[] = [];
  if (swagger) {
    const all = extractPaths(swagger.spec);
    toCheck = [
      ...all.filter(e => e.method === "GET" && /admin|user|account|config|key|secret|token|env|debug|log/i.test(e.path)),
      ...all.filter(e => e.method === "GET" && !/admin|user|account|config|key|secret|token|env|debug|log/i.test(e.path)),
    ].slice(0, 40).map(e => e.path);
  } else {
    toCheck = COMMON_PATHS.map(p => `${basePath}${p}`);
  }

  const settled = await Promise.allSettled(toCheck.map(p => checkEndpoint(origin, p)));
  const endpoints: EndpointResult[] = settled
    .filter(r => r.status === "fulfilled")
    .map(r => (r as PromiseFulfilledResult<EndpointResult>).value);

  const exposed     = endpoints.filter(e => e.exposed);
  const hasCritical = exposed.some(e => e.risk === "critical")
    || graphql.introspectionEnabled || nuxt.sourceMapsExposed
    || (swagger?.found ?? false);
  const grade: Grade = (exposed.length === 0 && !graphql.introspectionEnabled && !nuxt.sourceMapsExposed && !swagger?.found)
    ? "A" : hasCritical ? "C" : "B";

  const swaggerInfo = {
    found:          !!swagger,
    specUrl:        swagger?.url ?? null,
    title:          swagger?.spec.info?.title ?? null,
    version:        swagger?.spec.info?.version ?? null,
    totalEndpoints: swagger ? extractPaths(swagger.spec).length : 0,
  };

  await sendEmail(email, origin, basePath, endpoints, swaggerInfo, graphql, nuxt, grade);

  return { url: origin, basePath, swagger: swaggerInfo, graphql, nuxt, endpoints,
    summary: { checked: endpoints.length, exposed: exposed.length, grade }, email };
});
