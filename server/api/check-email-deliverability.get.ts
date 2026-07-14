import dns from "node:dns/promises";

interface SpfResult {
  found: boolean;
  record: string | null;
  strict: boolean;
  softFail: boolean;
}

interface DmarcResult {
  found: boolean;
  record: string | null;
  policy: "none" | "quarantine" | "reject" | null;
}

interface DkimResult {
  found: boolean;
  selector: string | null;
}

interface MxResult {
  found: boolean;
  records: string[];
}

type Grade = "A" | "B" | "C";

async function checkSpf(domain: string): Promise<SpfResult> {
  try {
    const records = await dns.resolveTxt(domain);
    const spf = records.flat().find(r => r.startsWith("v=spf1"));
    if (!spf) return { found: false, record: null, strict: false, softFail: false };
    return {
      found: true,
      record: spf,
      strict: spf.includes("-all"),
      softFail: spf.includes("~all"),
    };
  } catch {
    return { found: false, record: null, strict: false, softFail: false };
  }
}

async function checkDmarc(domain: string): Promise<DmarcResult> {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarc = records.flat().find(r => r.startsWith("v=DMARC1"));
    if (!dmarc) return { found: false, record: null, policy: null };
    const m = dmarc.match(/p=(none|quarantine|reject)/);
    const policy = (m?.[1] ?? "none") as DmarcResult["policy"];
    return { found: true, record: dmarc, policy };
  } catch {
    return { found: false, record: null, policy: null };
  }
}

const DKIM_SELECTORS = [
  "google", "default", "mail", "selector1", "selector2",
  "k1", "s1", "s2", "dkim", "email", "smtp", "mx",
];

async function checkDkim(domain: string): Promise<DkimResult> {
  const results = await Promise.allSettled(
    DKIM_SELECTORS.map(async sel => {
      const records = await dns.resolveTxt(`${sel}._domainkey.${domain}`);
      const hit = records.flat().find(r => r.includes("v=DKIM1") || r.includes("k=rsa") || r.includes("p="));
      if (hit) return sel;
      throw new Error("not found");
    })
  );
  const found = results.find(r => r.status === "fulfilled") as PromiseFulfilledResult<string> | undefined;
  if (found) return { found: true, selector: found.value };
  return { found: false, selector: null };
}

async function checkMx(domain: string): Promise<MxResult> {
  try {
    const mx = await dns.resolveMx(domain);
    return { found: mx.length > 0, records: mx.sort((a, b) => a.priority - b.priority).map(m => m.exchange) };
  } catch {
    return { found: false, records: [] };
  }
}

export default defineEventHandler(async (event) => {
  const { domain: rawDomain } = getQuery(event);
  if (!rawDomain || typeof rawDomain !== "string") {
    throw createError({ statusCode: 400, message: "domainは必須です" });
  }

  const domain = rawDomain.includes("@")
    ? rawDomain.split("@")[1].toLowerCase().trim()
    : rawDomain.replace(/^https?:\/\//, "").split("/")[0].toLowerCase().trim();

  if (!domain || !/^[a-z0-9][a-z0-9\-.]+\.[a-z]{2,}$/.test(domain)) {
    throw createError({ statusCode: 400, message: "有効なドメインを入力してください" });
  }

  const [spf, dmarc, dkim, mx] = await Promise.all([
    checkSpf(domain),
    checkDmarc(domain),
    checkDkim(domain),
    checkMx(domain),
  ]);

  const score =
    (spf.found ? (spf.strict ? 2 : 1) : 0) +
    (dmarc.found ? (dmarc.policy === "reject" ? 2 : dmarc.policy === "quarantine" ? 1 : 0) : 0) +
    (dkim.found ? 2 : 0);

  const grade: Grade = score >= 5 ? "A" : score >= 2 ? "B" : "C";

  return { domain, spf, dmarc, dkim, mx, grade };
});
