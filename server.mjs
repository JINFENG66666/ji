import http from 'node:http';
import { readFile } from 'node:fs/promises';

const page = await readFile(new URL('./index.html', import.meta.url));
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  const json = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(page);
  }
  if (req.method === 'GET' && req.url === '/health') {
    return json(200, { ok: true, at: new Date().toISOString(), purpose: 'access-test' });
  }
  if (req.method === 'POST' && req.url === '/upload-test') {
    let size = 0;
    try {
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 4096) {
          return json(413, { ok: false, message: '仅允许 4KB 以内的测试文本' });
        }
      }
      return json(200, { ok: true, bytes: size, saved: false });
    } catch {
      if (!res.headersSent) return json(400, { ok: false });
      return res.end();
    }
  }
  json(404, { ok: false });
});
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0');
