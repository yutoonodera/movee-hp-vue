export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  if (!path) throw createError({ statusCode: 400 });

  const url = `https://wp.movee.jp/wp-content/${path}`;

  const user = process.env.WP_BASIC_USER;
  const pass = process.env.WP_BASIC_PASS;
  const headers: Record<string, string> = {};
  if (user && pass) {
    headers["Authorization"] = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) throw createError({ statusCode: response.status });

  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  setResponseHeader(event, "content-type", contentType);
  setResponseHeader(event, "cache-control", "public, max-age=604800");

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
});
