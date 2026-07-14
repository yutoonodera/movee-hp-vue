import { defineEventHandler, readBody, createError } from "h3";
import { Resend } from "resend";

const AI_BOTS = [
  { ua: "GPTBot",             desc: "OpenAI（ChatGPT学習）",             priority: true  },
  { ua: "ChatGPT-User",       desc: "ChatGPTブラウジング機能",             priority: true  },
  { ua: "ClaudeBot",          desc: "Anthropic Claude学習",               priority: true  },
  { ua: "CCBot",              desc: "Common Crawl（AI学習の主要データ源）",  priority: true  },
  { ua: "Google-Extended",    desc: "Google Gemini学習",                  priority: true  },
  { ua: "anthropic-ai",       desc: "Anthropic AI全般",                   priority: false },
  { ua: "PerplexityBot",      desc: "Perplexity AI",                      priority: false },
  { ua: "Bytespider",         desc: "ByteDance / TikTok AI",              priority: false },
  { ua: "cohere-ai",          desc: "Cohere AI",                          priority: false },
  { ua: "Meta-ExternalAgent", desc: "Meta AI（Llama）",                    priority: false },
];

const KEY_PATTERNS = [
  { name: "OpenAI APIキー",         regex: /sk-[A-Za-z0-9]{40,}/g           },
  { name: "OpenAI プロジェクトキー", regex: /sk-proj-[A-Za-z0-9_-]{40,}/g    },
  { name: "Anthropic APIキー",      regex: /sk-ant-[A-Za-z0-9_-]{50,}/g     },
  { name: "Google AI / Gemini",    regex: /AIzaSy[A-Za-z0-9_-]{33}/g        },
  { name: "Hugging Face Token",    regex: /hf_[A-Za-z0-9]{30,}/g            },
  { name: "xAI (Grok)",            regex: /xai-[A-Za-z0-9]{50,}/g           },
  { name: "Groq APIキー",           regex: /gsk_[A-Za-z0-9]{40,}/g          },
];

function parseBlockedBots(robotsTxt: string): Set<string> {
  const blocked = new Set<string>();
  const lines = robotsTxt.split(/\r?\n/);
  let currentAgents: string[] = [];
  let hasDisallowAll = false;
  let inDirectives = false;

  function flush() {
    if (hasDisallowAll) for (const a of currentAgents) blocked.add(a.toLowerCase());
    currentAgents = []; hasDisallowAll = false; inDirectives = false;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) { if (currentAgents.length) flush(); continue; }
    const lc = line.toLowerCase();
    if (lc.startsWith("user-agent:")) {
      if (inDirectives) flush();
      currentAgents.push(line.slice("user-agent:".length).trim());
    } else if (lc.startsWith("disallow:")) {
      inDirectives = true;
      if (line.slice("disallow:".length).trim() === "/") hasDisallowAll = true;
    } else if (lc.startsWith("allow:")) {
      inDirectives = true;
    }
  }
  flush();
  return blocked;
}

async function checkRobots(baseUrl: string) {
  const robotsUrl = new URL("/robots.txt", baseUrl).href;
  try {
    const res = await $fetch<string>(robotsUrl, { responseType: "text", timeout: 8000 } as any);
    const blocked = parseBlockedBots(res as unknown as string);
    const wildcardAll = blocked.has("*");
    const bots = AI_BOTS.map(b => ({
      ua:       b.ua,
      desc:     b.desc,
      priority: b.priority,
      blocked:  blocked.has(b.ua.toLowerCase()) || wildcardAll,
    }));
    const priorityBlocked = bots.filter(b => b.priority && b.blocked).length;
    const priorityTotal   = bots.filter(b => b.priority).length;
    return { found: true, bots, priorityBlocked, priorityTotal };
  } catch {
    const bots = AI_BOTS.map(b => ({ ua: b.ua, desc: b.desc, priority: b.priority, blocked: false }));
    return { found: false, bots, priorityBlocked: 0, priorityTotal: AI_BOTS.filter(b => b.priority).length };
  }
}

async function checkKeyLeaks(pageUrl: string) {
  const leaks: { name: string; snippet: string }[] = [];
  try {
    const html = await $fetch<string>(pageUrl, { responseType: "text", timeout: 8000 } as any) as unknown as string;
    const origin = new URL(pageUrl).origin;

    // collect script srcs (same-origin only, max 4)
    const srcMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)]
      .map(m => m[1])
      .filter(s => s.startsWith("/") || s.startsWith(origin))
      .slice(0, 4);

    const contents: string[] = [html];
    await Promise.allSettled(srcMatches.map(async src => {
      const absUrl = src.startsWith("/") ? origin + src : src;
      try {
        const js = await $fetch<string>(absUrl, { responseType: "text", timeout: 6000 } as any) as unknown as string;
        contents.push(js);
      } catch { /* skip */ }
    }));

    const combined = contents.join("\n");
    for (const { name, regex } of KEY_PATTERNS) {
      const matches = [...combined.matchAll(new RegExp(regex.source, "g"))];
      for (const m of matches) {
        const val = m[0];
        // mask middle characters
        const snippet = val.length > 12 ? val.slice(0, 6) + "••••••" + val.slice(-4) : val;
        leaks.push({ name, snippet });
      }
    }
  } catch { /* fetch failed */ }
  return leaks;
}

function calcGrade(priorityBlocked: number, priorityTotal: number, leakCount: number): "A" | "B" | "C" {
  if (leakCount > 0)                               return "C";
  if (priorityBlocked >= Math.ceil(priorityTotal * 0.8)) return "A";
  return "B";
}

export default defineEventHandler(async (event) => {
  const { url, email } = await readBody<{ url: string; email: string }>(event);
  if (!url || !email) throw createError({ statusCode: 400, message: "url と email は必須です" });

  let baseUrl: string;
  try { baseUrl = new URL(url).origin; } catch { throw createError({ statusCode: 400, message: "URLの形式が正しくありません" }); }

  const [robots, leaks] = await Promise.all([
    checkRobots(baseUrl),
    checkKeyLeaks(url),
  ]);

  const grade = calcGrade(robots.priorityBlocked, robots.priorityTotal, leaks.length);

  const config = useRuntimeConfig();
  if (config.resendApiKey) {
    const resend = new Resend(config.resendApiKey);
    const leakHtml = leaks.length
      ? `<ul>${leaks.map(l => `<li><b>${l.name}</b>: ${l.snippet}</li>`).join("")}</ul>`
      : "<p>漏洩は検出されませんでした。</p>";
    const botRows = robots.bots.map(b =>
      `<tr><td>${b.ua}</td><td>${b.desc}</td><td>${b.blocked ? "🚫 ブロック" : "✅ 許可"}</td></tr>`
    ).join("");
    await Promise.allSettled([
      resend.emails.send({
        from: config.resendFrom || "noreply@movee.jp",
        to:   email,
        subject: `AI安全診断レポート — ${url}`,
        html: `<h2>AI安全診断レポート</h2><p>URL: ${url}</p><h3>総合評価: ${grade}</h3>
          <h3>AIクローラーブロック状況（${robots.priorityBlocked}/${robots.priorityTotal}）</h3>
          <table border="1" cellpadding="4"><tr><th>Bot</th><th>説明</th><th>状態</th></tr>${botRows}</table>
          <h3>APIキー漏洩チェック</h3>${leakHtml}`,
      }),
      config.internalEmail && resend.emails.send({
        from:    config.resendFrom || "noreply@movee.jp",
        to:      config.internalEmail,
        subject: `[AI安全診断] ${url} — ${grade}`,
        html:    `<p>依頼者: ${email}</p><p>URL: ${url}</p><p>グレード: ${grade}</p><p>漏洩: ${leaks.length}件</p>`,
      }),
    ]);
  }

  return { url, grade, robots, leaks, email };
});
