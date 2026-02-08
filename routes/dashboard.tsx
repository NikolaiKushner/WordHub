import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser, isSuperAdmin } from "../lib/auth.ts";
import type { AuthUser } from "../lib/auth.ts";
import { createSupabaseClient } from "../lib/supabase.ts";
import type {
  Link,
  ProfileTheme,
  PublicProfile,
} from "../lib/database.types.ts";
import OnboardingWizard from "../islands/OnboardingWizard.tsx";
import type { JSX } from "preact";

const SOCIAL_PLATFORMS: Record<
  string,
  { icon: JSX.Element; urlPattern: (value: string) => string }
> = {
  instagram: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    urlPattern: (v) => v.startsWith("http") ? v : `https://instagram.com/${v}`,
  },
  x: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    urlPattern: (v) => v.startsWith("http") ? v : `https://x.com/${v}`,
  },
  youtube: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    urlPattern: (v) => v.startsWith("http") ? v : `https://youtube.com/${v}`,
  },
  tiktok: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    urlPattern: (v) => v.startsWith("http") ? v : `https://tiktok.com/@${v}`,
  },
  linkedin: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    urlPattern: (v) =>
      v.startsWith("http") ? v : `https://linkedin.com/in/${v}`,
  },
  github: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    urlPattern: (v) => v.startsWith("http") ? v : `https://github.com/${v}`,
  },
  twitter: {
    icon: (
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    urlPattern: (v) => v.startsWith("http") ? v : `https://x.com/${v}`,
  },
};

const themeStyles: Record<
  ProfileTheme,
  { bg: string; card: string; text: string; link: string }
> = {
  default: {
    bg: "bg-gray-100",
    card: "bg-white",
    text: "text-gray-900",
    link: "bg-white text-gray-900 border border-gray-200",
  },
  dark: {
    bg: "bg-gray-900",
    card: "bg-gray-800",
    text: "text-white",
    link: "bg-gray-800 text-white border border-gray-700",
  },
  gradient: {
    bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    card: "bg-white/10",
    text: "text-white",
    link: "bg-white/20 text-white border border-white/30",
  },
  minimal: {
    bg: "bg-white",
    card: "bg-transparent",
    text: "text-gray-900",
    link: "bg-gray-100 text-gray-900",
  },
  ocean: {
    bg: "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600",
    card: "bg-white/10",
    text: "text-white",
    link: "bg-white/20 text-white border border-white/30",
  },
};

interface QuickViewLink {
  id: string;
  title: string;
  url: string;
  icon: string | null;
}

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
    .select("*")
    .eq("user_id", user.id)
    .single();

  const publicProfile = publicProfileData as PublicProfile | null;

  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, icon, clicks, is_active")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  const totalClicks = links?.reduce((sum, link: Link) =>
    sum + (link.clicks || 0), 0) || 0;

  const activeLinks = (links?.filter((l: Link) => l.is_active) ||
    []) as QuickViewLink[];

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
              <div class="flex flex-col lg:flex-row gap-6">
                {/* Left column: cards */}
                <div class="flex-1 space-y-6">
                  {/* Stats row */}
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                      <p class="text-sm text-gray-500">Page Views</p>
                      <p class="text-2xl font-bold text-gray-900">
                        {publicProfile?.page_views || 0}
                      </p>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                      <p class="text-sm text-gray-500">Total Clicks</p>
                      <p class="text-2xl font-bold text-gray-900">
                        {totalClicks}
                      </p>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                      <p class="text-sm text-gray-500">Active Links</p>
                      <p class="text-2xl font-bold text-gray-900">
                        {activeLinks.length}
                      </p>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h2 class="text-lg font-semibold text-gray-900">
                        Your Profile
                      </h2>
                      <div class="flex items-center gap-3">
                        <span
                          class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            publicProfile?.is_published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {publicProfile?.is_published ? "Published" : "Draft"}
                        </span>
                        <a
                          href="/profile"
                          class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 touch-manipulation"
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm text-gray-500">Email</p>
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Username</p>
                        <p class="text-sm font-medium text-gray-900">
                          {publicProfile?.username
                            ? `@${publicProfile.username}`
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Display Name</p>
                        <p class="text-sm font-medium text-gray-900">
                          {publicProfile?.display_name ||
                            profile.full_name || "Not set"}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Theme</p>
                        <p class="text-sm font-medium text-gray-900 capitalize">
                          {(publicProfile?.theme as string) || "default"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h2>
                    <div class="grid grid-cols-2 gap-3">
                      <a
                        href="/links"
                        class="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium touch-manipulation"
                      >
                        Manage Links
                      </a>
                      <a
                        href="/analytics"
                        class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium touch-manipulation"
                      >
                        View Analytics
                      </a>
                      <a
                        href="/profile"
                        class="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium touch-manipulation"
                      >
                        Edit Profile
                      </a>
                      <a
                        href="/settings"
                        class="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium touch-manipulation"
                      >
                        Settings
                      </a>
                    </div>
                  </div>

                  {/* Admin Panel */}
                  {isAdmin && (
                    <div class="bg-white rounded-lg shadow p-6">
                      <h2 class="text-lg font-semibold text-gray-900 mb-4">
                        Admin Actions
                      </h2>
                      <div class="grid grid-cols-2 gap-3">
                        <a
                          href="/admin/users"
                          class="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors touch-manipulation"
                        >
                          Manage Users
                        </a>
                        <a
                          href="/admin/settings"
                          class="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
                        >
                          System Settings
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column: Quick View phone mockup */}
                <div class="lg:w-80 xl:w-96">
                  <div class="bg-white rounded-lg shadow p-6 lg:sticky lg:top-8">
                    <div class="flex items-center justify-between mb-4">
                      <h2 class="text-lg font-semibold text-gray-900">
                        Quick View
                      </h2>
                      {publicProfile?.username &&
                        publicProfile?.is_published && (
                        <a
                          href={`/@${publicProfile.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-sm text-indigo-600 hover:text-indigo-700 touch-manipulation"
                        >
                          Open page
                        </a>
                      )}
                    </div>

                    {/* Phone frame */}
                    <div class="mx-auto w-64">
                      <div class="relative rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-800 shadow-xl">
                        {/* Notch */}
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-2xl z-10">
                        </div>

                        {/* Screen */}
                        <div
                          class={`rounded-[2rem] overflow-hidden ${
                            (() => {
                              const theme =
                                (publicProfile?.theme as ProfileTheme) ||
                                "default";
                              return themeStyles[theme]?.bg ||
                                themeStyles.default.bg;
                            })()
                          }`}
                          style="height: 480px;"
                        >
                          <div class="overflow-y-auto h-full pt-8 pb-4 px-4">
                            {publicProfile
                              ? (() => {
                                const theme =
                                  (publicProfile.theme as ProfileTheme) ||
                                  "default";
                                const styles = themeStyles[theme] ||
                                  themeStyles.default;
                                const socialLinks =
                                  (publicProfile.social_links as Record<
                                    string,
                                    string
                                  >) || {};
                                const hasSocials = Object.keys(socialLinks)
                                  .length > 0;

                                return (
                                  <div class="text-center">
                                    {/* Avatar */}
                                    {publicProfile.avatar_url
                                      ? (
                                        <img
                                          src={publicProfile.avatar_url}
                                          alt={publicProfile.display_name ||
                                            publicProfile.username}
                                          class="w-16 h-16 rounded-full mx-auto mb-2 object-cover ring-2 ring-white/50"
                                        />
                                      )
                                      : (
                                        <div
                                          class={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                            theme === "dark" ||
                                              theme === "gradient" ||
                                              theme === "ocean"
                                              ? "bg-white/20"
                                              : "bg-gray-200"
                                          }`}
                                        >
                                          <span
                                            class={`text-xl font-bold ${styles.text}`}
                                          >
                                            {(publicProfile.display_name ||
                                              publicProfile.username ||
                                              "?").charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                      )}

                                    {/* Name and username */}
                                    <h3
                                      class={`text-sm font-bold ${styles.text}`}
                                    >
                                      {publicProfile.display_name ||
                                        `@${publicProfile.username}`}
                                    </h3>
                                    <p
                                      class={`text-xs ${styles.text} opacity-70 mb-1`}
                                    >
                                      @{publicProfile.username}
                                    </p>

                                    {/* Bio */}
                                    {publicProfile.bio && (
                                      <p
                                        class={`text-xs ${styles.text} opacity-80 mb-3 line-clamp-2`}
                                      >
                                        {publicProfile.bio}
                                      </p>
                                    )}

                                    {/* Social icons */}
                                    {hasSocials && (
                                      <div class="flex justify-center gap-2 mb-3">
                                        {Object.entries(socialLinks).map(
                                          ([platform, value]) => {
                                            const config =
                                              SOCIAL_PLATFORMS[platform];
                                            if (!config || !value) return null;
                                            return (
                                              <span
                                                key={platform}
                                                class={`${styles.text} opacity-70`}
                                              >
                                                {config.icon}
                                              </span>
                                            );
                                          },
                                        )}
                                      </div>
                                    )}

                                    {/* Links */}
                                    <div class="space-y-2 mt-2">
                                      {activeLinks.slice(0, 6).map((link) => (
                                        <div
                                          key={link.id}
                                          class={`py-2.5 px-3 rounded-lg text-xs font-medium text-center ${styles.link}`}
                                        >
                                          {link.icon && (
                                            <span class="mr-1">
                                              {link.icon}
                                            </span>
                                          )}
                                          {link.title}
                                        </div>
                                      ))}
                                      {activeLinks.length > 6 && (
                                        <p
                                          class={`text-xs ${styles.text} opacity-50 pt-1`}
                                        >
                                          +{activeLinks.length - 6} more links
                                        </p>
                                      )}
                                      {activeLinks.length === 0 && (
                                        <p
                                          class={`text-xs ${styles.text} opacity-50 py-8`}
                                        >
                                          No links yet
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()
                              : (
                                <div class="flex items-center justify-center h-full">
                                  <div class="text-center text-gray-400">
                                    <p class="text-sm font-medium mb-2">
                                      No profile yet
                                    </p>
                                    <a
                                      href="/links"
                                      class="text-xs text-indigo-600 hover:text-indigo-700"
                                    >
                                      Create your page
                                    </a>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Home indicator */}
                        <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-400 rounded-full">
                        </div>
                      </div>
                    </div>

                    {/* Action buttons below phone */}
                    <div class="mt-4 space-y-2">
                      {publicProfile?.username && (
                        <a
                          href={`/@${publicProfile.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
                        >
                          <span class="text-xs text-gray-500 truncate flex-1">
                            getlnk.xyz/@{publicProfile.username}
                          </span>
                          <span class="text-xs text-indigo-600 font-medium whitespace-nowrap">
                            Visit
                          </span>
                        </a>
                      )}
                      {!publicProfile?.is_published && publicProfile && (
                        <p class="text-xs text-yellow-600 text-center">
                          Your page is not published yet.{" "}
                          <a
                            href="/profile"
                            class="underline hover:text-yellow-700"
                          >
                            Publish it
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
});
