import { useSignal } from "@preact/signals";
import { Button, Select } from "../components/ui/index.ts";

interface UserProfile {
  id: string;
  email: string;
  role: "regular" | "superadmin";
  full_name: string | null;
  created_at: string;
}

interface UserManagementTableProps {
  users: UserProfile[];
}

export default function UserManagementTable(
  { users }: UserManagementTableProps,
) {
  const error = useSignal("");

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`,
      )
    ) {
      return;
    }

    error.value = "";

    try {
      const response = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        globalThis.location.reload();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update role");
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + error.value);
    }
  };

  return (
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">
          All Users ({users.length})
        </h2>
      </div>

      {error.value && (
        <div
          class="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          {error.value}
        </div>
      )}

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onRoleUpdate={handleRoleUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface UserRowProps {
  user: UserProfile;
  onRoleUpdate: (userId: string, newRole: string) => void;
}

function UserRow({ user, onRoleUpdate }: UserRowProps) {
  const selectedRole = useSignal(user.role);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onRoleUpdate(user.id, selectedRole.value);
  };

  return (
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="shrink-0 h-10 w-10">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-medium text-sm">
                {(user.full_name || user.email)[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">
              {user.full_name || "No name"}
            </div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">{user.email}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === "superadmin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <form onSubmit={handleSubmit} class="flex items-center gap-2">
          <Select
            value={selectedRole.value}
            onChange={(
              e,
            ) => (selectedRole.value = (e.target as HTMLSelectElement)
              .value as "regular" | "superadmin")}
            options={[
              { value: "regular", label: "Regular" },
              { value: "superadmin", label: "Superadmin" },
            ]}
            class="text-sm"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
          >
            Update
          </Button>
        </form>
      </td>
    </tr>
  );
}
