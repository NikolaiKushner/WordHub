import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser } from "../lib/auth.ts";
import type { AuthUser } from "../lib/auth.ts";
import AnalyticsIsland from "../islands/AnalyticsIsland.tsx";

export default define.page(async function Analytics(ctx) {
  const authUser = await getAuthUser(ctx.req) as AuthUser | null;

  if (!authUser) {
    return new Response("", {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  const { user, profile } = authUser;

  return (
    <>
      <Head>
        <title>Analytics - Getlnk</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
                  Analytics
                </h1>
              </div>
              <div class="flex flex-wrap items-center gap-2 sm:gap-4">
                <span class="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">
                  {profile.full_name || user.email}
                </span>
                <form action="/api/auth/logout" method="POST" class="inline">
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium touch-manipulation"
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
          <AnalyticsIsland />
        </main>
      </div>
    </>
  );
});
