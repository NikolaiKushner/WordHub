import { define } from "../../../utils.ts";
import { getSession } from "../../../lib/auth.ts";
import { createSupabaseClient } from "../../../lib/supabase.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const session = await getSession(ctx.req);
      if (!session) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const body = await ctx.req.json();
      const { newPassword } = body;

      if (!newPassword) {
        return new Response(
          JSON.stringify({ error: "New password is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (newPassword.length < 6) {
        return new Response(
          JSON.stringify({ error: "Password must be at least 6 characters" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Create authenticated Supabase client using session token
      const supabase = createSupabaseClient(session.accessToken);

      // Update user password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Error changing password:", error);
        return new Response(
          JSON.stringify({
            error: error.message || "Failed to change password",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error in change-password endpoint:", error);
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
