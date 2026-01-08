import { define } from "../../../utils.ts";
import { setAuthCookies } from "../../../lib/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { access_token, refresh_token } = body;

      if (!access_token || !refresh_token) {
        return new Response(
          JSON.stringify({ error: "Missing tokens" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      setAuthCookies(headers, access_token, refresh_token);

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers,
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
