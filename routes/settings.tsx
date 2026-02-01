import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser } from "../lib/auth.ts";
import SettingsForm from "../islands/SettingsForm.tsx";

export default define.page(async function Settings(ctx) {
  const authUser = await getAuthUser(ctx.req);

  if (!authUser) {
    return new Response("", {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  return (
    <>
      <Head>
        <title>Settings - Getlnk</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center gap-4">
              <a
                href="/dashboard"
                class="text-indigo-600 hover:text-indigo-700"
              >
                ← Back
              </a>
              <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SettingsForm />
          <p class="mt-8 text-sm text-gray-500">
            <a href="/privacy" class="text-indigo-600 hover:text-indigo-700">
              Privacy Policy
            </a>
            {" · "}
            <a href="/terms" class="text-indigo-600 hover:text-indigo-700">
              Terms of Service
            </a>
          </p>
        </main>
      </div>
    </>
  );
});
