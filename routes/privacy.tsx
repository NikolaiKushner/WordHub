import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Privacy(_ctx) {
  return (
    <>
      <Head>
        <title>Privacy Policy - Getlnk</title>
        <meta name="robots" content="index, follow" />
      </Head>
      <div class="min-h-screen bg-gray-50 flex flex-col">
        <header class="bg-white border-b border-gray-200">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a
              href="/"
              class="text-indigo-600 hover:text-indigo-700 text-sm font-medium touch-manipulation"
            >
              ← Back to Home
            </a>
          </div>
        </header>

        <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p class="text-sm text-gray-500 mb-8">
            Last updated: January 2026
          </p>

          <div class="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                1. Introduction
              </h2>
              <p>
                Getlnk (“we”, “our”, or “the service”) is an open-source
                link-in-bio platform. This Privacy Policy explains how we
                collect, use, and protect your information when you use our
                website and services.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                2. Information We Collect
              </h2>
              <p>
                We collect information you provide directly (e.g. email, name,
                username, profile content, links) and usage data (e.g. page
                views, link clicks). Authentication and data storage are handled
                by Supabase; their privacy practices apply to that processing.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                3. How We Use Your Information
              </h2>
              <p>
                We use your information to provide and improve the service, to
                display your public profile and links, to track basic analytics
                (views, clicks), and to communicate with you about your account
                (e.g. password reset).
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                4. Cookies and Storage
              </h2>
              <p>
                We use cookies or similar storage for authentication (e.g.
                session tokens) so you can stay logged in. We do not use
                third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                5. Data Sharing
              </h2>
              <p>
                We do not sell your personal data. Data is stored with Supabase
                (our infrastructure provider). We may disclose information if
                required by law or to protect our rights and safety.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                6. Your Rights
              </h2>
              <p>
                Depending on your location, you may have rights to access,
                correct, or delete your data. You can update or delete your
                profile and links in the app. For account deletion, use the
                option in Settings or contact us.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                7. Changes
              </h2>
              <p>
                We may update this Privacy Policy from time to time. The “Last
                updated” date at the top will be revised. Continued use of the
                service after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                8. Contact
              </h2>
              <p>
                For privacy-related questions, contact us through the project
                repository or the contact method listed on the Getlnk website.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
});
