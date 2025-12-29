import { define } from "../../../utils.ts";
import { clearAuthCookies, getSession } from "../../../lib/auth.ts";
import { createSupabaseClient } from "../../../lib/supabase.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const session = await getSession(ctx.req);

      if (session) {
        const supabase = createSupabaseClient(session.accessToken);
        await supabase.auth.signOut();
      }

      const headers = new Headers();
      clearAuthCookies(headers);
      headers.set("Location", "/login");

      return new Response(null, {
        status: 302,
        headers,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
