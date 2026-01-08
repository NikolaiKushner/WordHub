import { define } from "../../../utils.ts";
import { createSupabaseClient } from "../../../lib/supabase.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { email } = body;

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const supabase = createSupabaseClient();

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(ctx.req.url).origin}/reset-password`,
      });

      if (error) {
        console.error("Error sending password reset email:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Always return success to prevent email enumeration
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error in forgot-password endpoint:", error);
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
