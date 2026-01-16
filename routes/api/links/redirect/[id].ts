import { define } from "../../../../utils.ts";
import { supabase } from "../../../../lib/supabase.ts";

// GET /api/links/redirect/:id?url=... - Track click and redirect
export const handler = define.handlers({
  async GET(ctx) {
    try {
      const linkId = ctx.params.id;
      const url = new URL(ctx.req.url);
      const targetUrl = url.searchParams.get("url");

      if (!targetUrl) {
        return new Response("Missing URL parameter", { status: 400 });
      }

      // Track click atomically (fire and forget)
      // deno-lint-ignore no-explicit-any
      (supabase.rpc as any)("increment_link_clicks", { link_id: linkId })
        .then(() => {})
        .catch(() => {});

      // Redirect to the target URL
      return new Response(null, {
        status: 302,
        headers: {
          Location: targetUrl,
        },
      });
    } catch {
      // On any error, try to redirect anyway
      const url = new URL(ctx.req.url);
      const targetUrl = url.searchParams.get("url");
      if (targetUrl) {
        return new Response(null, {
          status: 302,
          headers: { Location: targetUrl },
        });
      }
      return new Response("Redirect failed", { status: 500 });
    }
  },
});
