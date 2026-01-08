import { define } from "../../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser, isSuperAdmin } from "../../lib/auth.ts";
import AdminSettingsForm from "../../islands/AdminSettingsForm.tsx";

export default define.page(async function AdminSettings(ctx) {
  const authUser = await getAuthUser(ctx.req);

  if (!authUser) {
    return new Response("", {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  const { profile } = authUser;

  if (!isSuperAdmin(profile)) {
    return new Response("Forbidden: Superadmin access required", {
      status: 403,
    });
  }

  return (
    <>
      <Head>
        <title>System Settings - Admin</title>
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
              <h1 class="text-2xl font-bold text-gray-900">System Settings</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminSettingsForm />
        </main>
      </div>
    </>
  );
});
