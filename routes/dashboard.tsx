import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser, isSuperAdmin } from "../lib/auth.ts";
import type { AuthUser } from "../lib/auth.ts";
import { createSupabaseClient } from "../lib/supabase.ts";
import type { Link } from "../lib/database.types.ts";

export default define.page(async function Dashboard(ctx) {
  const authUser = await getAuthUser(ctx.req) as AuthUser | null;

  if (!authUser) {
    return new Response("", {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  const { user, profile, session } = authUser;
  const isAdmin = isSuperAdmin(profile);

  const supabase = createSupabaseClient(session.accessToken);
  const { data: publicProfile } = await supabase
    .from("public_profiles")
    .select("username, page_views, is_published")
    .eq("user_id", user.id)
    .single();

  const { data: links } = await supabase
    .from("links")
    .select("id, clicks")
    .eq("user_id", user.id);

  const totalClicks = links?.reduce((sum, link: Link) =>
    sum + (link.clicks || 0), 0) || 0;

  return (
    <>
      <Head>
        <title>Dashboard - Fresh Project</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">
                {profile.full_name || user.email}
              </span>
              {isAdmin && (
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Superadmin
                </span>
              )}
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">
                  Your Profile
                </h2>
                <a
                  href="/profile"
                  class="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Edit
                </a>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Full Name</p>
                  <p class="text-sm font-medium text-gray-900">
                    {profile.full_name || "Not set"}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Role</p>
                  <p class="text-sm font-medium text-gray-900 capitalize">
                    {profile.role}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Member Since</p>
                  <p class="text-sm font-medium text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Link in Bio Card */}
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold">My Links</h2>
                <a
                  href="/links"
                  class="text-sm text-white/80 hover:text-white"
                >
                  Manage →
                </a>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p class="text-sm text-white/70">Page Views</p>
                    <p class="text-2xl font-bold">
                      {publicProfile?.page_views || 0}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p class="text-sm text-white/70">Total Clicks</p>
                    <p class="text-2xl font-bold">{totalClicks}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p class="text-sm text-white/70">Status</p>
                    <p class="text-lg font-semibold">
                      {publicProfile?.is_published ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>
              </div>
              {publicProfile?.username && publicProfile?.is_published && (
                <a
                  href={`/@${publicProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-4 block w-full text-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-white/90 transition-colors font-medium"
                >
                  View Public Page
                </a>
              )}
              {!publicProfile && (
                <a
                  href="/links"
                  class="mt-4 block w-full text-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-white/90 transition-colors font-medium"
                >
                  Create Your Page
                </a>
              )}
            </div>

            {/* Admin Panel */}
            {isAdmin && (
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">
                  Admin Actions
                </h2>
                <div class="space-y-3">
                  <a
                    href="/admin/users"
                    class="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Manage Users
                  </a>
                  <a
                    href="/admin/settings"
                    class="block w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    System Settings
                  </a>
                </div>
              </div>
            )}

            {/* Quick Actions - shown for all users */}
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div class="space-y-3">
                <a
                  href="/links"
                  class="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Manage Links
                </a>
                <a
                  href="/profile"
                  class="block w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Edit Profile
                </a>
                <a
                  href="/settings"
                  class="block w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Settings
                </a>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div class="mt-8 bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Welcome back, {profile.full_name || user.email}! 👋
            </h2>
            <p class="text-gray-600">
              This is your personal dashboard. Here you can manage your account,
              view your activity, and access various features of the
              application.
            </p>
            {isAdmin && (
              <div class="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p class="text-purple-800 font-medium">
                  🛡️ You have superadmin privileges
                </p>
                <p class="text-purple-700 text-sm mt-1">
                  You can manage all users and system settings through the admin
                  panel.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
});
