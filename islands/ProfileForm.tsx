import { useSignal } from "@preact/signals";
import { Button, Input } from "../components/ui/index.ts";

interface ProfileFormProps {
  email: string;
  fullName: string | null;
  role: string;
  createdAt: string;
}

export default function ProfileForm(
  { email, fullName, role, createdAt }: ProfileFormProps,
) {
  const name = useSignal(fullName || "");
  const error = useSignal("");
  const success = useSignal("");
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    error.value = "";
    success.value = "";

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: name.value }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      success.value = "Profile updated successfully!";
      setTimeout(() => {
        success.value = "";
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "An unknown error occurred";
      }
    } finally {
      loading.value = false;
    }
  };

  return (
    <div class="bg-white rounded-lg shadow p-6">
      {error.value && (
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error.value}
        </div>
      )}

      {success.value && (
        <div
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {success.value}
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-6">
        <Input
          label="Email Address"
          type="email"
          id="email"
          value={email}
          disabled
          helperText="Email cannot be changed"
          fullWidth
        />

        <Input
          label="Full Name"
          type="text"
          id="fullName"
          value={name.value}
          onInput={(e) => (name.value = (e.target as HTMLInputElement).value)}
          placeholder="John Doe"
          fullWidth
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <div class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 capitalize">
            {role}
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Your role is managed by administrators
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Member Since
          </label>
          <div class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div class="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading.value}
          >
            {loading.value ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => globalThis.location.href = "/dashboard"}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
