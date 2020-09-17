import { serve } from "https://deno.land/std@0.69.0/http/server.ts";

const s = serve({ port: 8000 });
for await (const request of s) {
  request.headers.append("Content-Type", "text/html; charset=utf-8");
  request.headers.append("Server", "deno/0.0.0");
  request.headers.append("Date", new Date().toString());
  request.headers.append("Connection", "close");
  request.respond({
    body: "",
    headers: request.headers,
  });
}
