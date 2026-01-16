import { define } from "../../../utils.ts";
import { createAdminSupabaseClient } from "../../../lib/supabase.ts";

// GET /api/public-profile/check-username?username=xxx
// Check if a username is available (public endpoint)
export const handler = define.handlers({
  async GET(ctx) {
    try {
      const url = new URL(ctx.req.url);
      const username = url.searchParams.get("username");

      if (!username) {
        return new Response(
          JSON.stringify({ error: "Username parameter is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Validate username format
      if (username.length < 3 || username.length > 30) {
        return new Response(
          JSON.stringify({
            available: false,
            error: "Username must be between 3 and 30 characters",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (!/^[a-z0-9_]+$/.test(username)) {
        return new Response(
          JSON.stringify({
            available: false,
            error:
              "Username can only contain lowercase letters, numbers, and underscores",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Check reserved usernames
      const reservedUsernames = [
        "admin",
        "api",
        "auth",
        "dashboard",
        "login",
        "logout",
        "register",
        "settings",
        "profile",
        "help",
        "support",
        "about",
        "terms",
        "privacy",
        "links",
        "app",
        "www",
        "mail",
        "email",
      ];

      if (reservedUsernames.includes(username)) {
        return new Response(
          JSON.stringify({
            available: false,
            error: "This username is reserved",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Use admin client to check username availability
      const supabase = createAdminSupabaseClient();

      const { data: existingProfile } = await supabase
        .from("public_profiles")
        .select("id")
        .eq("username", username)
        .single();

      return new Response(
        JSON.stringify({
          available: !existingProfile,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
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
