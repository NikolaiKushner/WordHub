import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";
import { validatePassword } from "../lib/validators.ts";
import { Button, Input } from "../components/ui/index.ts";

interface ResetPasswordFormProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
  token: string;
  type: string;
}

export default function ResetPasswordForm(
  { supabaseUrl, supabaseAnonKey, token, type }: ResetPasswordFormProps,
) {
  const password = useSignal("");
  const confirmPassword = useSignal("");
  const error = useSignal("");
  const success = useSignal("");
  const loading = useSignal(false);
  const passwordStrength = useSignal<"weak" | "medium" | "strong">("weak");

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Check if we have a valid token from URL hash (Supabase redirects with hash)
  useEffect(() => {
    const handleHashParams = async () => {
      // Supabase redirects with tokens in the URL hash, not query params
      const hashParams = new URLSearchParams(
        globalThis.location.hash.substring(1),
      );
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const errorParam = hashParams.get("error");

      if (errorParam) {
        error.value =
          "Invalid or expired reset link. Please request a new one.";
        return;
      }

      if (accessToken && refreshToken) {
        // Exchange the tokens for a session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          error.value =
            "Invalid or expired reset link. Please request a new one.";
        }
      } else if (!token && !type && !globalThis.location.hash) {
        // Only show error if we don't have hash params and no token/type
        error.value =
          "Invalid reset link. Please check your email for the correct link.";
      }
    };

    handleHashParams();
  }, []);

  const handlePasswordChange = (value: string) => {
    password.value = value;
    const validation = validatePassword(value, 6);
    passwordStrength.value = validation.strength;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    error.value = "";
    success.value = "";

    // Validate password
    const passwordValidation = validatePassword(password.value, 6);
    if (!passwordValidation.isValid) {
      error.value = passwordValidation.errors[0] || "Invalid password";
      loading.value = false;
      return;
    }

    // Check password match
    if (password.value !== confirmPassword.value) {
      error.value = "Passwords do not match";
      loading.value = false;
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password.value,
      });

      if (updateError) throw updateError;

      success.value = "Password reset successfully! Redirecting to login...";

      // Set session cookies and redirect
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });

        if (response.ok) {
          setTimeout(() => {
            globalThis.location.href = "/dashboard";
          }, 2000);
        } else {
          setTimeout(() => {
            globalThis.location.href = "/login";
          }, 2000);
        }
      } else {
        setTimeout(() => {
          globalThis.location.href = "/login";
        }, 2000);
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

  const getStrengthColor = () => {
    switch (passwordStrength.value) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength.value) {
      case "strong":
        return "Strong";
      case "medium":
        return "Medium";
      default:
        return "Weak";
    }
  };

  return (
    <div class="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-semibold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2 text-sm">
          Enter your new password below.
        </p>
      </div>

      {error.value && (
        <div
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm"
          role="alert"
        >
          {error.value}
        </div>
      )}

      {success.value && (
        <div
          class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm"
          role="alert"
        >
          {success.value}
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <Input
            label="New Password"
            type="password"
            id="password"
            required
            minLength={6}
            value={password.value}
            onInput={(e) =>
              handlePasswordChange((e.target as HTMLInputElement).value)}
            placeholder="Enter new password (min. 6 characters)"
            fullWidth
            variant="filled"
            size="md"
          />
          {password.value && (
            <div class="mt-2">
              <div class="flex items-center gap-2 mb-1">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                    style={`width: ${
                      passwordStrength.value === "strong"
                        ? "100%"
                        : passwordStrength.value === "medium"
                        ? "66%"
                        : "33%"
                    }`}
                  />
                </div>
                <span class="text-xs text-gray-600 capitalize">
                  {getStrengthText()}
                </span>
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          required
          minLength={6}
          value={confirmPassword.value}
          onInput={(
            e,
          ) => (confirmPassword.value = (e.target as HTMLInputElement).value)}
          placeholder="Confirm new password"
          fullWidth
          variant="filled"
          size="md"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={loading.value}
          class="mt-6"
        >
          {loading.value ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <div class="mt-6 text-center">
        <a
          href="/login"
          class="text-sm text-gray-900 hover:text-gray-700 font-medium"
        >
          ← Back to Login
        </a>
      </div>
    </div>
  );
}
