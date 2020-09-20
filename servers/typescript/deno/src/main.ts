import { serve } from "https://deno.land/std@0.69.0/http/server.ts";

const s = serve({ port: 8000 });
for await (const request of s) {
  request.respond({
    body: "",
    headers: request.headers,
  });
}
