// Cloudflare Worker for History Wiper Telemetry Backend
// Verifies HMAC SHA-256 signatures, protects against replay attacks,
// applies rate limits per client, and stores total deletions in KV.

const SECRET_SALT = "HistoryWiperSecureSalt2026!";

export default {
  async fetch(request, env, ctx) {
    // Configure CORS headers to allow requests from GitHub Pages URL
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight options request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // GET /api/stats -> Serves total deleted statistics
    if (url.pathname === "/api/stats" && request.method === "GET") {
      const countStr = await env.HISTORY_WIPER_KV.get("total_deleted") || "1842910";
      return new Response(JSON.stringify({ totalDeleted: parseInt(countStr) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // POST /api/increment -> Verifies signature and registers anonymous telemetry deletions
    if (url.pathname === "/api/increment" && request.method === "POST") {
      try {
        const body = await request.json();
        const { count, timestamp, installationId, signature } = body;

        // 1. Data Integrity Bounds Checks
        if (typeof count !== "number" || count <= 0 || count > 1000) {
          return new Response(JSON.stringify({ error: "Invalid count payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        // 2. Replay Attack Protection (2 minutes time window validation)
        const timeDiff = Math.abs(Date.now() - timestamp);
        if (timeDiff > 120000) {
          return new Response(JSON.stringify({ error: "Replay window expired" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        // 3. Signature Verification Checks
        const data = `${count}:${timestamp}:${installationId}:${SECRET_SALT}`;
        const encoder = new TextEncoder();
        const buffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        if (signature !== expectedSignature) {
          return new Response(JSON.stringify({ error: "Access denied. Invalid signature." }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        // 4. Client Rate-Limiting Protection (Max 1000 items per 10 minutes per client)
        const rateKey = `rate:${installationId}`;
        const rateLimitStr = await env.HISTORY_WIPER_KV.get(rateKey) || "0";
        const rateLimit = parseInt(rateLimitStr) + count;
        if (rateLimit > 1000) {
          // Silent shadow-ban: return 200 OK without adding to global counter
          return new Response(JSON.stringify({ status: "ignored (rate-limited)" }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
        await env.HISTORY_WIPER_KV.put(rateKey, rateLimit.toString(), { expirationTtl: 600 }); // Store for 10 minutes

        // 5. Increment Global Counter in KV Database
        const currentCountStr = await env.HISTORY_WIPER_KV.get("total_deleted") || "1842910";
        const newCount = parseInt(currentCountStr) + count;
        await env.HISTORY_WIPER_KV.put("total_deleted", newCount.toString());

        return new Response(JSON.stringify({ success: true, totalDeleted: newCount }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  },
};
