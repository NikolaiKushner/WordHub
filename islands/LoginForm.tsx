import { useSignal } from "@preact/signals";
import { createClient } from "@supabase/supabase-js";
import { validateEmail } from "../lib/validators.ts";
import { Button, Checkbox, Input } from "../components/ui/index.ts";

interface LoginFormProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export default function LoginForm(
  { supabaseUrl, supabaseAnonKey }: LoginFormProps,
) {
  const email = useSignal("");
  const password = useSignal("");
  const error = useSignal("");
  const loading = useSignal(false);

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    error.value = "";

    // Validate email
    const emailValidation = validateEmail(email.value);
    if (!emailValidation.isValid) {
      error.value = emailValidation.error || "Invalid email";
      loading.value = false;
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth
        .signInWithPassword({
          email: email.value,
          password: password.value,
        });

      if (signInError) throw signInError;

      if (data.session) {
        // Send session to server to set cookies
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });

        if (response.ok) {
          globalThis.location.href = "/dashboard";
        } else {
          throw new Error("Failed to set session");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "An unknown error occurred";
      }
      loading.value = false;
    }
  };

  const handleGoogleLogin = async () => {
    error.value = "";

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: globalThis.location.origin + "/auth/callback",
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "An unknown error occurred";
      }
    }
  };

  return (
    <div class="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-semibold text-gray-900">Welcome back</h1>
      </div>

      {error.value && (
        <div
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm"
          role="alert"
        >
          {error.value}
        </div>
      )}

      <div class="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-900 py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-base"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <Input
            label="Email"
            type="email"
            id="email"
            required
            value={email.value}
            onInput={(
              e,
            ) => (email.value = (e.target as HTMLInputElement).value)}
            placeholder="name@email.com"
            fullWidth
            variant="filled"
            size="md"
          />
          <Input
            label="Password"
            type="password"
            id="password"
            required
            minLength={6}
            value={password.value}
            onInput={(
              e,
            ) => (password.value = (e.target as HTMLInputElement).value)}
            placeholder="Create a password (min. 6 characters)"
            fullWidth
            variant="filled"
            size="md"
          />

          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a
                href="/forgot-password"
                class="text-gray-900 hover:text-gray-700 font-medium"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading.value}
            class="mt-6"
          >
            {loading.value ? "Signing in..." : "Continue with email"}
          </Button>
        </form>
      </div>

      <p class="text-center text-sm text-gray-600 mt-8">
        Don't have an account?{" "}
        <a
          href="/register"
          class="text-gray-900 hover:text-gray-700 font-medium"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
