interface DashboardNavProps {
  activeTab: "links" | "analytics" | "settings";
  userName: string;
  isAdmin: boolean;
}

const tabs = [
  { id: "links", label: "Links", href: "/dashboard" },
  { id: "analytics", label: "Analytics", href: "/analytics" },
  { id: "settings", label: "Settings", href: "/settings" },
] as const;

export default function DashboardNav(
  { activeTab, userName, isAdmin }: DashboardNavProps,
) {
  return (
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Logo + Tabs */}
          <div class="flex items-center gap-6 sm:gap-8">
            <a
              href="/"
              class="text-lg font-bold text-indigo-600 hover:text-indigo-700 shrink-0"
            >
              Getlnk
            </a>
            <nav class="flex items-center gap-1">
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={tab.href}
                  class={`px-3 py-2 text-sm font-medium rounded-md transition-colors touch-manipulation ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: User info + Logout */}
          <div class="flex items-center gap-2 sm:gap-4">
            <span class="text-xs sm:text-sm text-gray-600 truncate max-w-[100px] sm:max-w-[200px] hidden sm:inline">
              {userName}
            </span>
            {isAdmin && (
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Admin
              </span>
            )}
            <form action="/api/auth/logout" method="POST" class="inline">
              <button
                type="submit"
                class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium touch-manipulation"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
