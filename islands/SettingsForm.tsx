import { useSignal } from "@preact/signals";
import { validatePassword } from "../lib/validators.ts";
import { Button, Input } from "../components/ui/index.ts";

export default function SettingsForm() {
  // Password change section
  const newPassword = useSignal("");
  const confirmPassword = useSignal("");
  const passwordStrength = useSignal<"weak" | "medium" | "strong">("weak");
  const passwordError = useSignal("");
  const passwordSuccess = useSignal("");
  const passwordLoading = useSignal(false);

  // Account deletion
  const deleteConfirm = useSignal("");
  const deleteError = useSignal("");
  const deleteLoading = useSignal(false);
  const showDeleteConfirm = useSignal(false);

  const handlePasswordChange = (value: string) => {
    newPassword.value = value;
    const validation = validatePassword(value, 6);
    passwordStrength.value = validation.strength;
  };

  const handlePasswordSubmit = async (e: Event) => {
    e.preventDefault();
    passwordLoading.value = true;
    passwordError.value = "";
    passwordSuccess.value = "";

    // Validate new password
    const passwordValidation = validatePassword(newPassword.value, 6);
    if (!passwordValidation.isValid) {
      passwordError.value = passwordValidation.errors[0] || "Invalid password";
      passwordLoading.value = false;
      return;
    }

    // Check password match
    if (newPassword.value !== confirmPassword.value) {
      passwordError.value = "Passwords do not match";
      passwordLoading.value = false;
      return;
    }

    try {
      // Call server-side API endpoint that uses authenticated session from cookies
      const response = await fetch("/api/settings/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: newPassword.value,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password");
      }

      passwordSuccess.value = "Password changed successfully!";
      newPassword.value = "";
      confirmPassword.value = "";

      setTimeout(() => {
        passwordSuccess.value = "";
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        passwordError.value = err.message;
      } else {
        passwordError.value = "An unknown error occurred";
      }
    } finally {
      passwordLoading.value = false;
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirm.value !== "DELETE") {
      deleteError.value = "Please type DELETE to confirm";
      return;
    }

    deleteLoading.value = true;
    deleteError.value = "";

    try {
      const response = await fetch("/api/settings/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }

      // Redirect to home page after deletion
      globalThis.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        deleteError.value = err.message;
      } else {
        deleteError.value = "An unknown error occurred";
      }
      deleteLoading.value = false;
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
    <div class="space-y-6">
      {/* Password Change Section */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Change Password
        </h2>

        {passwordError.value && (
          <div
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm"
            role="alert"
          >
            {passwordError.value}
          </div>
        )}

        {passwordSuccess.value && (
          <div
            class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm"
            role="alert"
          >
            {passwordSuccess.value}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} class="space-y-4">
          <div>
            <Input
              label="New Password"
              type="password"
              id="newPassword"
              required
              minLength={6}
              value={newPassword.value}
              onInput={(e) =>
                handlePasswordChange((e.target as HTMLInputElement).value)}
              placeholder="Enter new password (min. 6 characters)"
              fullWidth
              variant="filled"
              size="md"
            />
            {newPassword.value && (
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
            label="Confirm New Password"
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
            loading={passwordLoading.value}
          >
            {passwordLoading.value ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>

      {/* Account Deletion Section */}
      <div class="bg-white rounded-lg shadow p-6 border-2 border-red-200">
        <h2 class="text-xl font-semibold text-red-900 mb-2">
          Danger Zone
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>

        {!showDeleteConfirm.value
          ? (
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => (showDeleteConfirm.value = true)}
            >
              Delete Account
            </Button>
          )
          : (
            <div class="space-y-4">
              {deleteError.value && (
                <div
                  class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  role="alert"
                >
                  {deleteError.value}
                </div>
              )}

              <div>
                <Input
                  label="Type DELETE to confirm"
                  type="text"
                  id="deleteConfirm"
                  value={deleteConfirm.value}
                  onInput={(
                    e,
                  ) => (deleteConfirm.value =
                    (e.target as HTMLInputElement).value)}
                  placeholder="DELETE"
                  fullWidth
                  variant="filled"
                  size="md"
                />
              </div>

              <div class="flex gap-3">
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  loading={deleteLoading.value}
                  onClick={handleAccountDeletion}
                >
                  {deleteLoading.value ? "Deleting..." : "Confirm Deletion"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    showDeleteConfirm.value = false;
                    deleteConfirm.value = "";
                    deleteError.value = "";
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
