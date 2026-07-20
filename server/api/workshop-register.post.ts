import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, company, workshopTitle, workshopSlug } = body as {
    name: string; email: string; company?: string;
    workshopTitle: string; workshopSlug: string;
  };

  if (!name?.trim()) throw createError({ statusCode: 400, message: "氏名は必須です" });
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: "有効なメールアドレスを入力してください" });
  }
  if (!workshopTitle?.trim()) throw createError({ statusCode: 400, message: "勉強会タイトルが不明です" });

  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.RESEND_FROM   ?? "noreply@movee.jp";
  const internal = process.env.INTERNAL_EMAIL;

  if (!apiKey) throw createError({ statusCode: 500, message: "メール設定が不完全です" });

  const resend = new Resend(apiKey);

  const confirmHtml = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>【申し込み完了】${workshopTitle}</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans','Noto Sans JP',sans-serif">
<div style="max-width:580px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)">
  <div style="background:#1D4ED8;padding:32px 40px">
    <p style="margin:0;color:rgba(255,255,255,.7);font-size:12px;font-family:monospace;letter-spacing:.08em;text-transform:uppercase">movee 勉強会</p>
    <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;line-height:1.4">申し込みを受け付けました</h1>
  </div>
  <div style="padding:32px 40px">
    <p style="margin:0 0 24px;color:#334155;font-size:15px;line-height:1.8">${name} 様<br>ご登録ありがとうございます。以下の勉強会へのお申し込みを受け付けました。</p>
    <div style="background:#F1F5F9;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="margin:0 0 4px;font-size:11px;color:#94A3B8;font-family:monospace;text-transform:uppercase;letter-spacing:.08em">勉強会</p>
      <p style="margin:0;font-size:16px;font-weight:700;color:#0F172A">${workshopTitle}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#334155">
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2E8F0;color:#64748B;width:100px">氏名</td><td style="padding:10px 0;border-bottom:1px solid #E2E8F0">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2E8F0;color:#64748B">メール</td><td style="padding:10px 0;border-bottom:1px solid #E2E8F0">${email}</td></tr>
      ${company ? `<tr><td style="padding:10px 0;color:#64748B">会社名</td><td style="padding:10px 0">${company}</td></tr>` : ""}
    </table>
    <p style="margin:28px 0 0;font-size:13px;color:#94A3B8;line-height:1.7">開催の詳細については、別途ご連絡いたします。ご不明な点はこのメールに返信いただくか、<a href="https://movee.jp" style="color:#1D4ED8">movee.jp</a> からお問い合わせください。</p>
  </div>
  <div style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #E2E8F0">
    <p style="margin:0;font-size:12px;color:#94A3B8">© movee — <a href="https://movee.jp" style="color:#94A3B8">movee.jp</a></p>
  </div>
</div>
</body></html>`;

  const internalHtml = `
<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;padding:32px;max-width:520px;margin:0 auto">
  <h2 style="margin:0 0 20px;font-size:18px">勉強会申し込みがありました</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600;width:120px">勉強会</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${workshopTitle}</td></tr>
    <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600">氏名</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${name}</td></tr>
    <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600">メール</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${email}</td></tr>
    <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600">会社名</td><td style="padding:8px 12px">${company ?? "（未記入）"}</td></tr>
  </table>
  <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">slug: ${workshopSlug}</p>
</body></html>`;

  await Promise.all([
    resend.emails.send({
      from, to: email,
      subject: `【申し込み完了】${workshopTitle}`,
      html: confirmHtml,
    }),
    ...(internal ? [resend.emails.send({
      from, to: internal,
      subject: `[勉強会申し込み] ${workshopTitle} — ${name}`,
      html: internalHtml,
    })] : []),
  ]);

  return { ok: true };
});
