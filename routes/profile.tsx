import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getAuthUser } from "../lib/auth.ts";
import ProfileForm from "../islands/ProfileForm.tsx";

export default define.page(async function Profile(ctx) {
  const authUser = await getAuthUser(ctx.req);

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
        <title>Profile - Fresh Project</title>
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
              <h1 class="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileForm
            email={user.email!}
            fullName={profile.full_name}
            role={profile.role}
            createdAt={profile.created_at}
          />
        </main>
      </div>
    </>
  );
});