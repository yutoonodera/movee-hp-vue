import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email: string }>(event);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: "有効なメールアドレスを入力してください" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "noreply@movee.jp";
  const internal = process.env.INTERNAL_EMAIL;

  if (!apiKey || !internal) {
    throw createError({ statusCode: 500, message: "メール設定が不完全です" });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: internal,
    subject: `【配信停止希望】${email}`,
    html: `
      <p>以下のアドレスから配信停止のリクエストがありました。</p>
      <p style="font-size:1.1em;font-weight:bold;">${email}</p>
      <p>配信リストから手動で削除してください。</p>
    `,
  });

  if (error) {
    console.error("[unsubscribe] Resend error:", error);
    throw createError({ statusCode: 502, message: "メールの送信に失敗しました: " + error.message });
  }

  return { success: true };
});
