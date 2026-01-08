import { define } from "../../../utils.ts";
import { getSession } from "../../../lib/auth.ts";
import { createAdminSupabaseClient } from "../../../lib/supabase.ts";

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

      // Create admin client with service role key
      let adminSupabase;
      try {
        adminSupabase = createAdminSupabaseClient();
      } catch (error) {
        console.error("Error creating admin client:", error);
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        return new Response(
          JSON.stringify({
            error:
              errorMessage.includes("Missing") || errorMessage.includes("empty")
                ? "Server configuration error. Service role key is missing or invalid."
                : "Server configuration error. Please contact support.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Delete user account using admin client
      // Note: This will cascade delete the user profile due to ON DELETE CASCADE
      const { data, error } = await adminSupabase.auth.admin.deleteUser(
        session.user.id,
      );

      if (error) {
        console.error("Error deleting account:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));

        // Provide more specific error messages
        let errorMessage =
          "Failed to delete account. Please try again or contact support.";
        if (error.message) {
          if (
            error.message.includes("Invalid API key") ||
            error.message.includes("invalid")
          ) {
            errorMessage =
              "Server configuration error. Invalid service role key.";
          } else {
            errorMessage = error.message;
          }
        }

        return new Response(
          JSON.stringify({
            error: errorMessage,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Clear auth cookies
      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        "sb-access-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
      );
      headers.append(
        "Set-Cookie",
        "sb-refresh-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
      );
      headers.set("Content-Type", "application/json");

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers,
        },
      );
    } catch (error) {
      console.error("Error in delete-account endpoint:", error);
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
