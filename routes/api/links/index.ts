import { define } from "../../../utils.ts";
import { getSession } from "../../../lib/auth.ts";
import { createSupabaseClient } from "../../../lib/supabase.ts";

// GET /api/links - Get all links for the current user
export const handler = define.handlers({
  async GET(ctx) {
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

      const supabase = createSupabaseClient(session.accessToken);

      const { data: links, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", session.user.id)
        .order("position", { ascending: true });

      if (error) {
        console.error("Error fetching links:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch links" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ links }),
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

  // POST /api/links - Create a new link
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
      const { title, url, icon } = body;

      // Validate required fields
      if (!title || !url) {
        return new Response(
          JSON.stringify({ error: "Title and URL are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid URL format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const supabase = createSupabaseClient(session.accessToken);

      // Get the highest position to add new link at the end
      const { data: existingLinks } = await supabase
        .from("links")
        .select("position")
        .eq("user_id", session.user.id)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = existingLinks && existingLinks.length > 0
        ? existingLinks[0].position + 1
        : 0;

      const { data: link, error } = await supabase
        .from("links")
        .insert({
          user_id: session.user.id,
          title,
          url,
          icon: icon || null,
          position: nextPosition,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating link:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create link" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ link }),
        {
          status: 201,
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
