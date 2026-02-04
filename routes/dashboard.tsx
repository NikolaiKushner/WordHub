import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser, isSuperAdmin } from "../lib/auth.ts";
import type { AuthUser } from "../lib/auth.ts";
import { createSupabaseClient } from "../lib/supabase.ts";
import type { Link, PublicProfile } from "../lib/database.types.ts";
import OnboardingWizard from "../islands/OnboardingWizard.tsx";

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
  const { data: publicProfileData } = await supabase
    .from("public_profiles")
    .select("username, page_views, is_published")
    .eq("user_id", user.id)
    .single();

  const publicProfile = publicProfileData as
    | Pick<PublicProfile, "username" | "page_views" | "is_published">
    | null;

  const { data: links } = await supabase
    .from("links")
    .select("id, clicks")
    .eq("user_id", user.id);

  const totalClicks = links?.reduce((sum, link: Link) =>
    sum + (link.clicks || 0), 0) || 0;

  const profileWithOnboarding = profile as { onboarding_completed?: boolean };
  const showOnboarding = !profileWithOnboarding.onboarding_completed;

  return (
    <>
      <Head>
        <title>Dashboard - Getlnk</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div class="flex flex-wrap items-center gap-2 sm:gap-4">
                <span class="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">
                  {profile.full_name || user.email}
                </span>
                {isAdmin && (
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Superadmin
                  </span>
                )}
                <form action="/api/auth/logout" method="POST" class="inline">
                  <button
                    type="submit"
                    class=" px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium touch-manipulation"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {showOnboarding && (
            <div class="mb-8">
              <OnboardingWizard
                initialUsername={publicProfile?.username ?? null}
                hasLinks={(links?.length ?? 0) > 0}
              />
            </div>
          )}
          {!showOnboarding && (
            <>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Profile Card */}
                <div class="bg-white rounded-lg shadow p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-900">
                      Your Profile
                    </h2>
                    <a
                      href="/profile"
                      class=" inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 touch-manipulation"
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
                      class=" inline-flex items-center text-sm text-white/80 hover:text-white touch-manipulation"
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
                      class="mt-4 block w-full  flex items-center justify-center text-center px-4 py-3 bg-white text-indigo-600 rounded-lg hover:bg-white/90 active:bg-white/80 transition-colors font-medium touch-manipulation"
                    >
                      View Public Page
                    </a>
                  )}
                  {!publicProfile && (
                    <a
                      href="/links"
                      class="mt-4 block w-full  flex items-center justify-center text-center px-4 py-3 bg-white text-indigo-600 rounded-lg hover:bg-white/90 active:bg-white/80 transition-colors font-medium touch-manipulation"
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
                        class="block w-full  flex items-center justify-center text-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors touch-manipulation"
                      >
                        Manage Users
                      </a>
                      <a
                        href="/admin/settings"
                        class="block w-full  flex items-center justify-center text-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
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
                      class="block w-full  flex items-center justify-center text-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation"
                    >
                      Manage Links
                    </a>
                    <a
                      href="/analytics"
                      class="block w-full  flex items-center justify-center text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                    >
                      View Analytics
                    </a>
                    <a
                      href="/profile"
                      class="block w-full  flex items-center justify-center text-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
                    >
                      Edit Profile
                    </a>
                    <a
                      href="/settings"
                      class="block w-full  flex items-center justify-center text-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
                    >
                      Settings
                    </a>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div class="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Welcome back, {profile.full_name || user.email}! 👋
                </h2>
                <p class="text-sm sm:text-base text-gray-600">
                  This is your personal dashboard. Here you can manage your
                  account, view your activity, and access various features of
                  the application.
                </p>
                {isAdmin && (
                  <div class="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p class="text-purple-800 font-medium">
                      🛡️ You have superadmin privileges
                    </p>
                    <p class="text-purple-700 text-sm mt-1">
                      You can manage all users and system settings through the
                      admin panel.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
});
