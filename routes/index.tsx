import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Home(ctx) {
  const isAuthenticated = !!ctx.state.authUser;

  return (
    <>
      <Head>
        <title>Getlnk — One link. Every you.</title>
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header class="bg-white/80 backdrop-blur-sm shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div class="flex items-center gap-2">
                <img
                  src="/logo.svg"
                  width="40"
                  height="40"
                  alt="Fresh logo"
                />
                <span class="text-lg sm:text-xl font-bold text-gray-900">
                  Getlnk
                </span>
              </div>
              <div class="flex flex-wrap gap-2 sm:gap-3">
                {isAuthenticated
                  ? (
                    <>
                      <a
                        href="/dashboard"
                        class=" inline-flex items-center justify-center px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium touch-manipulation"
                      >
                        Dashboard
                      </a>
                      <form
                        action="/api/auth/logout"
                        method="POST"
                        class="inline"
                      >
                        <button
                          type="submit"
                          class=" px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
                        >
                          Logout
                        </button>
                      </form>
                    </>
                  )
                  : (
                    <>
                      <a
                        href="/login"
                        class=" inline-flex items-center justify-center px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium touch-manipulation"
                      >
                        Login
                      </a>
                      <a
                        href="/register"
                        class=" inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation"
                      >
                        Sign Up
                      </a>
                    </>
                  )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Getlnk —{" "}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                One link. Every you.
              </span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              The open-source link-in-bio platform. Create a beautiful,
              shareable landing page with all your links in one place.
            </p>

            {isAuthenticated
              ? (
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href="/dashboard"
                    class=" inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold text-base sm:text-lg touch-manipulation"
                  >
                    Go to Dashboard
                  </a>
                </div>
              )
              : (
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href="/register"
                    class=" inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold text-base sm:text-lg touch-manipulation"
                  >
                    Get your Getlnk
                  </a>
                  <a
                    href="/login"
                    class=" inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 active:bg-indigo-100 transition-colors font-semibold text-base sm:text-lg touch-manipulation"
                  >
                    Sign In
                  </a>
                </div>
              )}
          </div>

          {/* Features */}
          <div class="mt-12 sm:mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="text-4xl mb-4">🔓</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Open Source
              </h3>
              <p class="text-gray-600">
                Own your data, customize everything. Host it yourself or use our
                hosted version. 100% open source.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="text-4xl mb-4">🎨</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Beautiful Themes
              </h3>
              <p class="text-gray-600">
                Choose from multiple stunning themes to match your brand.
                Customize colors, fonts, and layouts.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="text-4xl mb-4">📊</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Analytics Built-in
              </h3>
              <p class="text-gray-600">
                Track views and clicks to see which links perform best. Monitor
                your profile's reach with built-in analytics.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div class="mt-12 sm:mt-16 md:mt-24 text-center">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Powered by Modern Technologies
            </h2>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 items-center">
              <div class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow">
                <span class="font-semibold text-gray-700">Deno Fresh</span>
              </div>
              <div class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow">
                <span class="font-semibold text-gray-700">Supabase</span>
              </div>
              <div class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow">
                <span class="font-semibold text-gray-700">TypeScript</span>
              </div>
              <div class="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow">
                <span class="font-semibold text-gray-700">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer class="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12 sm:mt-16 md:mt-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center text-sm sm:text-base text-gray-600">
            <p>The open-source link-in-bio</p>
          </div>
        </footer>
      </div>
    </>
  );
});
