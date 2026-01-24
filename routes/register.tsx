import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getSupabaseConfig } from "../lib/supabase.ts";
import RegisterForm from "../islands/RegisterForm.tsx";

export default define.page(function Register(_ctx) {
  const config = getSupabaseConfig();

  return (
    <>
      <Head>
        <title>Register - Getlnk</title>
      </Head>
      <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-12">
        <RegisterForm
          supabaseUrl={config.url}
          supabaseAnonKey={config.anonKey}
        />
      </div>
    </>
  );
});
