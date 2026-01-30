import { useSignal } from "@preact/signals";
import { Button, Input } from "../components/ui/index.ts";
import type { ProfileTheme } from "../lib/database.types.ts";

const TOTAL_STEPS = 5;

const THEMES: { value: ProfileTheme; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "dark", label: "Dark" },
  { value: "gradient", label: "Gradient" },
  { value: "minimal", label: "Minimal" },
  { value: "ocean", label: "Ocean" },
];

interface OnboardingWizardProps {
  /** Optional: called when user completes or skips. Not serialized to client — island uses location.reload() by default. */
  onComplete?: () => void;
  /** Pre-filled username if user already has a public profile */
  initialUsername?: string | null;
  /** Whether user already has at least one link (reserved for future use) */
  hasLinks?: boolean;
}

export default function OnboardingWizard({
  onComplete,
  initialUsername = null,
  hasLinks: _hasLinks = false,
}: OnboardingWizardProps) {
  const step = useSignal(1);
  const username = useSignal(initialUsername || "");
  const linkTitle = useSignal("");
  const linkUrl = useSignal("");
  const theme = useSignal<ProfileTheme>("default");
  const loading = useSignal(false);
  const error = useSignal("");

  const setError = (msg: string) => {
    error.value = msg;
  };
  const clearError = () => {
    error.value = "";
  };

  const completeOnboarding = async () => {
    loading.value = true;
    clearError();
    try {
      const res = await fetch("/api/settings/onboarding-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete");
      }
      if (typeof onComplete === "function") {
        onComplete();
      } else {
        globalThis.location.reload();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      loading.value = false;
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleNextWelcome = () => {
    clearError();
    step.value = 2;
  };

  const handleUsernameNext = async () => {
    const raw = username.value.trim().toLowerCase();
    if (raw.length < 3 || raw.length > 30) {
      setError("Username must be between 3 and 30 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(raw)) {
      setError(
        "Username can only contain lowercase letters, numbers, and underscores",
      );
      return;
    }
    loading.value = true;
    clearError();
    try {
      const checkRes = await fetch(
        `/api/public-profile/check-username?username=${
          encodeURIComponent(raw)
        }`,
      );
      const checkData = await checkRes.json();
      if (checkData.available === false) {
        setError(checkData.error || "Username is not available");
        return;
      }
      const res = await fetch("/api/public-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: raw }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save username");
      }
      username.value = raw;
      step.value = 3;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      loading.value = false;
    }
  };

  const handleLinkNext = async () => {
    const title = linkTitle.value.trim();
    const url = linkUrl.value.trim();
    if (!title) {
      setError("Please enter a link title");
      return;
    }
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }
    loading.value = true;
    clearError();
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add link");
      }
      step.value = 4;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      loading.value = false;
    }
  };

  const handleThemeNext = async () => {
    loading.value = true;
    clearError();
    try {
      const res = await fetch("/api/public-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: theme.value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save theme");
      }
      step.value = 5;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      loading.value = false;
    }
  };

  const handlePublish = async () => {
    loading.value = true;
    clearError();
    try {
      const res = await fetch("/api/public-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to publish");
      }
      await completeOnboarding();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      loading.value = false;
    }
  };

  return (
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-lg mx-auto">
      {/* Progress */}
      <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>
            Step {step.value} of {TOTAL_STEPS}
          </span>
          <button
            type="button"
            onClick={handleSkip}
            disabled={loading.value}
            class="text-indigo-600 hover:text-indigo-700 font-medium touch-manipulation disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>
        <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(step.value / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div class="p-6 sm:p-8">
        {error.value && (
          <div
            class="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
            role="alert"
          >
            {error.value}
          </div>
        )}

        {/* Step 1: Welcome */}
        {step.value === 1 && (
          <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-900">
              Welcome! Let's set up your page
            </h2>
            <p class="text-gray-600">
              In a few steps you'll have a personal link-in-bio page you can
              share anywhere. You can always change this later.
            </p>
            <div class="flex gap-3">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleNextWelcome}
              >
                Get started
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose a username */}
        {step.value === 2 && (
          <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-900">
              Choose a username
            </h2>
            <p class="text-gray-600 text-sm">
              Your page will be at /@{username.value || "yourname"}
            </p>
            <Input
              label="Username"
              type="text"
              id="onboarding-username"
              value={username.value}
              onInput={(
                e,
              ) => (username.value = (e.target as HTMLInputElement).value
                .toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="yourname"
              fullWidth
              helperText="Lowercase letters, numbers, and underscores only. 3–30 characters."
            />
            <div class="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => (step.value = 1)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={loading.value}
                onClick={handleUsernameNext}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Add your first link */}
        {step.value === 3 && (
          <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-900">
              Add your first link
            </h2>
            <p class="text-gray-600 text-sm">
              Add a link to your website, social, or anything you want to share.
            </p>
            <Input
              label="Link title"
              type="text"
              id="onboarding-link-title"
              value={linkTitle.value}
              onInput={(
                e,
              ) => (linkTitle.value = (e.target as HTMLInputElement).value)}
              placeholder="My website"
              fullWidth
            />
            <Input
              label="URL"
              type="url"
              id="onboarding-link-url"
              value={linkUrl.value}
              onInput={(
                e,
              ) => (linkUrl.value = (e.target as HTMLInputElement).value)}
              placeholder="https://"
              fullWidth
            />
            <div class="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => (step.value = 2)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={loading.value}
                onClick={handleLinkNext}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Pick a theme */}
        {step.value === 4 && (
          <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-900">
              Pick a theme
            </h2>
            <p class="text-gray-600 text-sm">
              You can change this later in your profile.
            </p>
            <div class="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => (theme.value = t.value)}
                  class={`px-4 py-3 rounded-xl border-2 text-left font-medium transition-colors touch-manipulation ${
                    theme.value === t.value
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div class="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => (step.value = 3)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={loading.value}
                onClick={handleThemeNext}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Publish */}
        {step.value === 5 && (
          <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-900">
              Publish your page!
            </h2>
            <p class="text-gray-600 text-sm">
              Make your page live so anyone with the link can see it. You can
              unpublish anytime from your dashboard.
            </p>
            <div class="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => (step.value = 4)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={loading.value}
                onClick={handlePublish}
              >
                Publish & finish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
