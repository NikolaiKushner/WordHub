import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Terms(_ctx) {
  return (
    <>
      <Head>
        <title>Terms of Service - Getlnk</title>
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
            Terms of Service
          </h1>
          <p class="text-sm text-gray-500 mb-8">
            Last updated: February 2026
          </p>

          <div class="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                1. Acceptance
              </h2>
              <p>
                By using Getlnk (“the service”), you agree to these Terms of
                Service. If you do not agree, do not use the service.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                2. Description of Service
              </h2>
              <p>
                Getlnk provides a link-in-bio platform: you can create a public
                profile, add links, and share one URL. The service may be
                offered as hosted software or as open-source software you can
                self-host.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                3. Your Account and Content
              </h2>
              <p>
                You are responsible for keeping your account credentials secure
                and for all content you publish (links, profile text, images).
                You must not use the service for illegal purposes, to infringe
                others’ rights, or to distribute harmful or misleading content.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                4. Acceptable Use
              </h2>
              <p>
                You agree not to abuse the service (e.g. spam, malware,
                phishing, or automated abuse). We may suspend or terminate
                accounts that violate these terms or that harm the service or
                other users.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                5. Intellectual Property
              </h2>
              <p>
                You keep ownership of your content. By publishing content on
                Getlnk, you grant us a license to host, display, and operate the
                service in connection with that content. The Getlnk software may
                be available under an open-source license; see the project
                repository for details.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                6. Disclaimers
              </h2>
              <p>
                The service is provided “as is”. We do not guarantee
                uninterrupted or error-free operation. We are not liable for how
                you or others use your profile or links.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                7. Limitation of Liability
              </h2>
              <p>
                To the extent permitted by law, we are not liable for indirect,
                incidental, or consequential damages arising from your use of
                the service. Our total liability is limited to the amount you
                paid us (if any) in the twelve months before the claim.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                8. Termination
              </h2>
              <p>
                You may stop using the service at any time. We may suspend or
                terminate your access if you breach these terms. You can request
                account and data deletion via Settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                9. Changes
              </h2>
              <p>
                We may update these Terms from time to time. The “Last updated”
                date will be revised. Continued use after changes constitutes
                acceptance. Material changes may be communicated via the service
                or email.
              </p>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-2">
                10. Contact
              </h2>
              <p>
                For questions about these Terms, contact us through the project
                repository or the contact method listed on the Getlnk website.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
});
