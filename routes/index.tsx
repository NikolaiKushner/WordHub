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
        <header class="bg-white/80 backdrop-blur-sm shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-col flex-row justify-between items-center gap-3">
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

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Turn your audience into{" "}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                clicks, customers, and revenue.
              </span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Getlnk is your business-ready link-in-bio: capture more traffic,
              promote offers, and understand exactly what drives results — all
              from one simple, branded page.
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
                    Start for free
                  </a>
                  <a
                    href="/login"
                    class=" inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 active:bg-indigo-100 transition-colors font-semibold text-base sm:text-lg touch-manipulation"
                  >
                    Sign in to your hub
                  </a>
                </div>
              )}
          </div>

          {/* Business-focused benefits */}
          <div class="mt-12 sm:mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
              <div class="text-4xl mb-4">💼</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Built for business growth
              </h3>
              <p class="text-gray-600">
                Send traffic from Instagram, TikTok, YouTube, email, and more to
                a single high-converting page. Highlight launches, services, and
                campaigns without constantly changing your bio link.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
              <div class="text-4xl mb-4">📊</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                See what actually works
              </h3>
              <p class="text-gray-600">
                Track views and clicks in real time so you know which offers,
                platforms, and buttons convert best. Make decisions based on
                data, not guesses.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
              <div class="text-4xl mb-4">🎨</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                On-brand in minutes
              </h3>
              <p class="text-gray-600">
                Choose a clean layout, plug in your brand colors, and go live in
                a few clicks. No design or code required — but fully
                customizable if you want complete control.
              </p>
            </div>
          </div>

          {/* Social proof & positioning */}
          <div class="mt-12 sm:mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                One simple hub for all your important actions
              </h2>
              <p class="text-gray-600 mb-4">
                Creators, freelancers, solo founders, and small teams use Getlnk
                to centralize everything that matters: lead magnets, newsletter
                signup, store links, booking pages, and more.
              </p>
              <ul class="space-y-3 text-left text-gray-700">
                <li class="flex gap-2">
                  <span class="mt-1 text-indigo-600">✔</span>
                  <span>
                    Promote products, services, and content from every channel
                    you use.
                  </span>
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 text-indigo-600">✔</span>
                  <span>
                    Swap and reorder links instantly as your priorities change.
                  </span>
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 text-indigo-600">✔</span>
                  <span>
                    Understand which campaigns bring traffic — and which ones
                    you can drop.
                  </span>
                </li>
              </ul>
            </div>

            <div class="bg-indigo-600 text-white rounded-xl shadow-lg p-6 sm:p-7 flex flex-col justify-between gap-4">
              <div>
                <p class="text-sm uppercase tracking-wide opacity-80 mb-2">
                  Why Getlnk
                </p>
                <h3 class="text-xl font-semibold mb-3">
                  Open-source, privacy-friendly, and under your control.
                </h3>
                <p class="text-indigo-100 text-sm">
                  Host it yourself or use a hosted version. You own your data,
                  your audience, and your brand.
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <p class="font-semibold">Fast setup</p>
                  <p class="text-indigo-100">Launch in under 5 minutes.</p>
                </div>
                <div>
                  <p class="font-semibold">Made for scale</p>
                  <p class="text-indigo-100">
                    From first followers to full-time business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ-style reassurance */}
          <div class="mt-12 sm:mt-16 md:mt-24">
            <h2 class="text-2xl sm:3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Built for busy creators and teams
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div class="bg-white rounded-lg shadow-md p-5 sm:p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Do I need a website?
                </h3>
                <p class="text-gray-600 text-sm sm:text-base">
                  No. Getlnk can be your first “home on the internet” — a simple
                  page that connects people to everything you offer.
                </p>
              </div>
              <div class="bg-white rounded-lg shadow-md p-5 sm:p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Is it really free and open source?
                </h3>
                <p class="text-gray-600 text-sm sm:text-base">
                  Yes. The core of Getlnk is open source, so you can inspect the
                  code, run it yourself, and extend it as your business grows.
                </p>
              </div>
              <div class="bg-white rounded-lg shadow-md p-5 sm:p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Who is Getlnk for?
                </h3>
                <p class="text-gray-600 text-sm sm:text-base">
                  Ideal for creators, consultants, indie hackers, and small
                  businesses that want a clean, measurable way to turn attention
                  into action.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer class="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12 sm:mt-16 md:mt-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center text-sm sm:text-base text-gray-600">
            <p>The open-source link-in-bio</p>
          </div>
        </footer>
      </div>
    </>
  );
});
