import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser } from "../lib/auth.ts";
import { createSupabaseClient } from "../lib/supabase.ts";
import LinksEditor from "../islands/LinksEditor.tsx";
import type { Link, PublicProfile } from "../lib/database.types.ts";

export default define.page(async function LinksPage(ctx) {
  const authUser = await getAuthUser(ctx.req);

  if (!authUser) {
    return new Response("", {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  const supabase = createSupabaseClient(authUser.session.accessToken);

  // Fetch user's public profile
  const { data: profile } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", authUser.user.id)
    .single();

  // Fetch user's links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", authUser.user.id)
    .order("position", { ascending: true });

  return (
    <>
      <Head>
        <title>My Links - Link in Bio</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <a
                  href="/dashboard"
                  class="text-indigo-600 hover:text-indigo-700"
                >
                  ← Back
                </a>
                <h1 class="text-2xl font-bold text-gray-900">My Links</h1>
              </div>
              {profile?.is_published && profile?.username && (
                <a
                  href={`/@${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                >
                  View Public Page →
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LinksEditor
            initialProfile={profile as PublicProfile | null}
            initialLinks={(links as Link[]) || []}
          />
        </main>
      </div>
    </>
  );
});
