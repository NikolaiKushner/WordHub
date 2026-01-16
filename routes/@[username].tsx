import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { supabase } from "../lib/supabase.ts";
import type {
  Link,
  ProfileTheme,
  PublicProfile,
} from "../lib/database.types.ts";

interface PublicLink {
  id: string;
  title: string;
  url: string;
  icon: string | null;
}

// Theme styles
const themeStyles: Record<
  ProfileTheme,
  { bg: string; card: string; text: string; link: string }
> = {
  default: {
    bg: "bg-gray-100",
    card: "bg-white",
    text: "text-gray-900",
    link: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200",
  },
  dark: {
    bg: "bg-gray-900",
    card: "bg-gray-800",
    text: "text-white",
    link: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
  },
  gradient: {
    bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    card: "bg-white/10 backdrop-blur-lg",
    text: "text-white",
    link:
      "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur",
  },
  minimal: {
    bg: "bg-white",
    card: "bg-transparent",
    text: "text-gray-900",
    link: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  },
  ocean: {
    bg: "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600",
    card: "bg-white/10 backdrop-blur-lg",
    text: "text-white",
    link:
      "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur",
  },
};

export default define.page(async function PublicProfilePage(ctx) {
  const username = ctx.params.username;

  // Fetch profile - uses anon key, RLS allows public access to published profiles
  const { data: profileData, error: profileError } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  const profile = profileData as PublicProfile | null;

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  if (!profile) {
    return (
      <>
        <Head>
          <title>Profile Not Found</title>
        </Head>
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-gray-600 mb-8">
              This profile doesn't exist or is not public.
            </p>
            <a
              href="/"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go Home
            </a>
          </div>
        </div>
      </>
    );
  }

  const { data: linksData } = await supabase
    .from("links")
    .select("id, title, url, icon")
    .eq("user_id", profile.user_id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  const links = (linksData || []) as PublicLink[];

  // Increment page views atomically (fire and forget)
  // deno-lint-ignore no-explicit-any
  (supabase.rpc as any)("increment_page_views", { profile_id: profile.id })
    .then(() => {});

  const theme = profile.theme as ProfileTheme;
  const styles = themeStyles[theme] || themeStyles.default;

  return (
    <>
      <Head>
        <title>{profile.display_name || `@${profile.username}`}</title>
        <meta
          name="description"
          content={profile.bio ||
            `Check out ${profile.display_name || profile.username}'s links`}
        />
        <meta
          property="og:title"
          content={profile.display_name || `@${profile.username}`}
        />
        <meta
          property="og:description"
          content={profile.bio ||
            `Check out ${profile.display_name || profile.username}'s links`}
        />
        {profile.avatar_url && (
          <meta property="og:image" content={profile.avatar_url} />
        )}
      </Head>
      <div class={`min-h-screen ${styles.bg} py-12 px-4`}>
        <div class="max-w-md mx-auto">
          {/* Profile Card */}
          <div class={`${styles.card} rounded-2xl p-8 text-center mb-8`}>
            {/* Avatar */}
            {profile.avatar_url
              ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  class="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/50"
                />
              )
              : (
                <div
                  class={`w-24 h-24 rounded-full mx-auto mb-4 ${
                    theme === "dark" || theme === "gradient" ||
                      theme === "ocean"
                      ? "bg-white/20"
                      : "bg-gray-200"
                  } flex items-center justify-center`}
                >
                  <span class={`text-3xl ${styles.text}`}>
                    {(profile.display_name || profile.username).charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )}

            {/* Name */}
            <h1 class={`text-2xl font-bold ${styles.text} mb-1`}>
              {profile.display_name || `@${profile.username}`}
            </h1>
            <p class={`${styles.text} opacity-70 mb-4`}>@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p class={`${styles.text} opacity-80 text-sm leading-relaxed`}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Links */}
          <div class="space-y-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={`/api/links/redirect/${link.id}?url=${
                  encodeURIComponent(link.url)
                }`}
                target="_blank"
                rel="noopener noreferrer"
                class={`block w-full py-4 px-6 rounded-xl text-center font-medium transition-all transform hover:scale-[1.02] ${styles.link}`}
              >
                {link.icon && <span class="mr-2">{link.icon}</span>}
                {link.title}
              </a>
            ))}
          </div>

          {/* Footer */}
          <div class="mt-12 text-center">
            <a
              href="/"
              class={`text-sm ${styles.text} opacity-50 hover:opacity-70`}
            >
              Create your own page →
            </a>
          </div>
        </div>
      </div>
    </>
  );
});
