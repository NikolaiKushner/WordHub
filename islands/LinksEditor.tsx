import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Button, Input, Textarea } from "../components/ui/index.ts";
import type {
  Link,
  ProfileTheme,
  PublicProfile,
} from "../lib/database.types.ts";

interface LinksEditorProps {
  initialProfile: PublicProfile | null;
  initialLinks: Link[];
}

const THEMES: { value: ProfileTheme; label: string; preview: string }[] = [
  { value: "default", label: "Default", preview: "bg-white" },
  { value: "dark", label: "Dark", preview: "bg-gray-900" },
  {
    value: "gradient",
    label: "Gradient",
    preview: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  { value: "minimal", label: "Minimal", preview: "bg-gray-100" },
  {
    value: "ocean",
    label: "Ocean",
    preview: "bg-gradient-to-br from-cyan-500 to-blue-500",
  },
];

export default function LinksEditor(
  { initialProfile, initialLinks }: LinksEditorProps,
) {
  // Profile state
  const username = useSignal(initialProfile?.username || "");
  const displayName = useSignal(initialProfile?.display_name || "");
  const bio = useSignal(initialProfile?.bio || "");
  const theme = useSignal<ProfileTheme>(initialProfile?.theme || "default");
  const isPublished = useSignal(initialProfile?.is_published || false);
  const hasProfile = useSignal(!!initialProfile);

  // Links state
  const links = useSignal<Link[]>(initialLinks);
  const newLinkTitle = useSignal("");
  const newLinkUrl = useSignal("");

  // UI state
  const loading = useSignal(false);
  const error = useSignal("");
  const success = useSignal("");
  const usernameAvailable = useSignal<boolean | null>(null);
  const checkingUsername = useSignal(false);
  const editingLinkId = useSignal<string | null>(null);
  const editLinkTitle = useSignal("");
  const editLinkUrl = useSignal("");

  // Check username availability
  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) {
      usernameAvailable.value = null;
      return;
    }

    // Don't check if it's the current username
    if (initialProfile?.username === value) {
      usernameAvailable.value = true;
      return;
    }

    checkingUsername.value = true;
    try {
      const res = await fetch(
        `/api/public-profile/check-username?username=${
          encodeURIComponent(value)
        }`,
      );
      const data = await res.json();
      usernameAvailable.value = data.available;
      if (!data.available && data.error) {
        error.value = data.error;
      }
    } catch {
      usernameAvailable.value = null;
    } finally {
      checkingUsername.value = false;
    }
  };

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsername(username.value);
    }, 500);
    return () => clearTimeout(timer);
  }, [username.value]);

  // Save profile
  const saveProfile = async () => {
    loading.value = true;
    error.value = "";
    success.value = "";

    try {
      const res = await fetch("/api/public-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          display_name: displayName.value || null,
          bio: bio.value || null,
          theme: theme.value,
          is_published: isPublished.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      hasProfile.value = true;
      success.value = "Profile saved successfully!";
      setTimeout(() => success.value = "", 3000);
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Failed to save profile";
    } finally {
      loading.value = false;
    }
  };

  // Add new link
  const addLink = async () => {
    if (!newLinkTitle.value || !newLinkUrl.value) {
      error.value = "Please enter both title and URL";
      return;
    }

    loading.value = true;
    error.value = "";

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newLinkTitle.value,
          url: newLinkUrl.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add link");
      }

      links.value = [...links.value, data.link];
      newLinkTitle.value = "";
      newLinkUrl.value = "";
      success.value = "Link added!";
      setTimeout(() => success.value = "", 2000);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to add link";
    } finally {
      loading.value = false;
    }
  };

  // Update link
  const updateLink = async (id: string) => {
    loading.value = true;
    error.value = "";

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editLinkTitle.value,
          url: editLinkUrl.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update link");
      }

      links.value = links.value.map((l) => l.id === id ? data.link : l);
      editingLinkId.value = null;
      success.value = "Link updated!";
      setTimeout(() => success.value = "", 2000);
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Failed to update link";
    } finally {
      loading.value = false;
    }
  };

  // Delete link
  const deleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    loading.value = true;
    error.value = "";

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete link");
      }

      links.value = links.value.filter((l) => l.id !== id);
      success.value = "Link deleted!";
      setTimeout(() => success.value = "", 2000);
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Failed to delete link";
    } finally {
      loading.value = false;
    }
  };

  // Toggle link active state
  const toggleLinkActive = async (link: Link) => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !link.is_active }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update link");
      }

      links.value = links.value.map((l) => l.id === link.id ? data.link : l);
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Failed to update link";
    }
  };

  // Move link up/down
  const moveLink = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= links.value.length) return;

    // Save original state before modifying for proper revert on error
    const originalLinks = [...links.value];

    const newLinks = [...links.value];
    [newLinks[index], newLinks[newIndex]] = [
      newLinks[newIndex],
      newLinks[index],
    ];
    links.value = newLinks;

    // Save new order
    try {
      const res = await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkIds: newLinks.map((l) => l.id) }),
      });

      if (!res.ok) {
        throw new Error("Failed to save order");
      }
    } catch {
      // Revert to original state on error
      links.value = originalLinks;
      error.value = "Failed to reorder links";
      setTimeout(() => error.value = "", 3000);
    }
  };

  const startEditing = (link: Link) => {
    editingLinkId.value = link.id;
    editLinkTitle.value = link.title;
    editLinkUrl.value = link.url;
  };

  const publicUrl = username.value
    ? `${globalThis.location?.origin || ""}/@${username.value}`
    : "";

  return (
    <div class="space-y-8">
      {/* Error/Success Messages */}
      {error.value && (
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          {error.value}
        </div>
      )}
      {success.value && (
        <div
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
          role="alert"
        >
          {success.value}
        </div>
      )}

      {/* Profile Settings */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Profile Settings
        </h2>

        <div class="space-y-4">
          {/* Username */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                @
              </span>
              <input
                type="text"
                value={username.value}
                onInput={(e) =>
                  username.value = (e.target as HTMLInputElement).value
                    .toLowerCase().replace(/[^a-z0-9_]/g, "")}
                placeholder="yourname"
                class={`w-full pl-8 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  usernameAvailable.value === true
                    ? "border-green-500"
                    : usernameAvailable.value === false
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {checkingUsername.value && (
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ...
                </span>
              )}
              {!checkingUsername.value && usernameAvailable.value === true && (
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  ✓
                </span>
              )}
              {!checkingUsername.value && usernameAvailable.value === false && (
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  ✗
                </span>
              )}
            </div>
            {username.value && (
              <p class="text-xs text-gray-500 mt-1">
                Your page: <span class="font-mono">{publicUrl}</span>
              </p>
            )}
          </div>

          {/* Display Name */}
          <Input
            label="Display Name"
            type="text"
            value={displayName.value}
            onInput={(e) =>
              displayName.value = (e.target as HTMLInputElement).value}
            placeholder="John Doe"
            fullWidth
          />

          {/* Bio */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <Textarea
              value={bio.value}
              onInput={(e) =>
                bio.value = (e.target as HTMLTextAreaElement).value}
              placeholder="Tell visitors about yourself..."
              rows={3}
              fullWidth
            />
            <p class="text-xs text-gray-500 mt-1">
              {bio.value.length}/500 characters
            </p>
          </div>

          {/* Theme Selection */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div class="grid grid-cols-5 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => theme.value = t.value}
                  class={`p-2 rounded-lg border-2 transition-all ${
                    theme.value === t.value
                      ? "border-indigo-500 ring-2 ring-indigo-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div class={`w-full h-8 rounded ${t.preview}`} />
                  <p class="text-xs text-center mt-1">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Publish Toggle */}
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">Publish Profile</p>
              <p class="text-sm text-gray-500">
                Make your page visible to everyone
              </p>
            </div>
            <button
              type="button"
              onClick={() => isPublished.value = !isPublished.value}
              class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublished.value ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span
                class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished.value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <Button
            onClick={saveProfile}
            variant="primary"
            loading={loading.value}
            fullWidth
          >
            {loading.value ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>

      {/* Links Management */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>

        {/* Add New Link */}
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Add New Link</h3>
          <div class="space-y-3">
            <Input
              type="text"
              value={newLinkTitle.value}
              onInput={(e) =>
                newLinkTitle.value = (e.target as HTMLInputElement).value}
              placeholder="Link Title (e.g., My Website)"
              fullWidth
            />
            <Input
              type="url"
              value={newLinkUrl.value}
              onInput={(e) =>
                newLinkUrl.value = (e.target as HTMLInputElement).value}
              placeholder="https://example.com"
              fullWidth
            />
            <Button
              onClick={addLink}
              variant="secondary"
              loading={loading.value}
            >
              Add Link
            </Button>
          </div>
        </div>

        {/* Links List */}
        {links.value.length === 0
          ? (
            <p class="text-gray-500 text-center py-8">
              No links yet. Add your first link above!
            </p>
          )
          : (
            <div class="space-y-3">
              {links.value.map((link, index) => (
                <div
                  key={link.id}
                  class={`border rounded-lg p-4 ${
                    link.is_active ? "bg-white" : "bg-gray-50 opacity-60"
                  }`}
                >
                  {editingLinkId.value === link.id
                    ? (
                      <div class="space-y-3">
                        <Input
                          type="text"
                          value={editLinkTitle.value}
                          onInput={(e) =>
                            editLinkTitle.value =
                              (e.target as HTMLInputElement).value}
                          placeholder="Link Title"
                          fullWidth
                        />
                        <Input
                          type="url"
                          value={editLinkUrl.value}
                          onInput={(e) =>
                            editLinkUrl.value =
                              (e.target as HTMLInputElement).value}
                          placeholder="https://example.com"
                          fullWidth
                        />
                        <div class="flex gap-2">
                          <Button
                            onClick={() => updateLink(link.id)}
                            variant="primary"
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => editingLinkId.value = null}
                            variant="secondary"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )
                    : (
                      <div class="flex items-center gap-3">
                        {/* Reorder buttons */}
                        <div class="flex flex-col gap-1">
                          <button
                            onClick={() => moveLink(index, "up")}
                            disabled={index === 0}
                            class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveLink(index, "down")}
                            disabled={index === links.value.length - 1}
                            class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Link info */}
                        <div class="flex-1 min-w-0">
                          <p class="font-medium text-gray-900 truncate">
                            {link.title}
                          </p>
                          <p class="text-sm text-gray-500 truncate">
                            {link.url}
                          </p>
                          <p class="text-xs text-gray-400">
                            {link.clicks} clicks
                          </p>
                        </div>

                        {/* Actions */}
                        <div class="flex items-center gap-2">
                          <button
                            onClick={() => toggleLinkActive(link)}
                            class={`p-2 rounded ${
                              link.is_active
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                            title={link.is_active ? "Active" : "Inactive"}
                          >
                            {link.is_active ? "●" : "○"}
                          </button>
                          <button
                            onClick={() => startEditing(link)}
                            class="p-2 text-gray-400 hover:text-gray-600"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            class="p-2 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Preview Link */}
      {hasProfile.value && isPublished.value && username.value && (
        <div class="bg-indigo-50 rounded-lg p-4 text-center">
          <p class="text-indigo-700 mb-2">Your public page is live!</p>
          <a
            href={`/@${username.value}`}
            target="_blank"
            rel="noopener noreferrer"
            class="text-indigo-600 hover:text-indigo-800 font-medium underline"
          >
            {publicUrl}
          </a>
        </div>
      )}
    </div>
  );
}
