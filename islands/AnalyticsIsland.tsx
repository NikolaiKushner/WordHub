import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface DailyStats {
  date: string;
  views: number;
  clicks: number;
}

interface TopLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  topLinks: TopLink[];
  dailyStats: DailyStats[];
}

export default function AnalyticsIsland() {
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<AnalyticsData | null>(null);
  const selectedPeriod = useSignal<"7" | "30" | "all">("30");

  const avgViewsPerDay = useComputed(() => {
    if (!data.value || !data.value.dailyStats.length) return 0;
    return Math.round(
      data.value.totalViews / data.value.dailyStats.length,
    );
  });

  const avgClicksPerDay = useComputed(() => {
    if (!data.value || !data.value.dailyStats.length) return 0;
    return Math.round(
      data.value.totalClicks / data.value.dailyStats.length,
    );
  });

  const topLinksTotalClicks = useComputed(() => {
    if (!data.value) return 0;
    return data.value.topLinks.reduce((sum, link) => sum + link.clicks, 0);
  });

  async function fetchAnalytics(period: "7" | "30" | "all") {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(
        `/api/analytics/stats?days=${period}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const result = await response.json();
      data.value = result.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  }

  useEffect(() => {
    fetchAnalytics(selectedPeriod.value);
  }, []);

  function handlePeriodChange(period: "7" | "30" | "all") {
    selectedPeriod.value = period;
    fetchAnalytics(period);
  }

  // Find min and max for scaling charts
  const maxDailyViews = data.value
    ? Math.max(...data.value.dailyStats.map((d) => d.views), 1)
    : 1;
  const maxDailyClicks = data.value
    ? Math.max(...data.value.dailyStats.map((d) => d.clicks), 1)
    : 1;

  return (
    <div class="space-y-6">
      {/* Period Selector */}
      <div class="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Date Range</h2>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePeriodChange("7")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation ${
              selectedPeriod.value === "7"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Last 7 days
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange("30")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation ${
              selectedPeriod.value === "30"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Last 30 days
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange("all")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation ${
              selectedPeriod.value === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All time
          </button>
        </div>
      </div>

      {/* Error State */}
      {error.value && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 font-medium">Error loading analytics</p>
          <p class="text-red-600 text-sm">{error.value}</p>
        </div>
      )}

      {/* Loading State */}
      {loading.value && (
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <div class="inline-block">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600">
            </div>
          </div>
          <p class="text-gray-600 mt-4">Loading analytics...</p>
        </div>
      )}

      {/* Main Stats Cards */}
      {!loading.value && data.value && (
        <>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Total Views Card */}
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <p class="text-white/70 text-sm font-medium">Total Views</p>
              <p class="text-4xl font-bold mt-2">{data.value.totalViews}</p>
              <p class="text-white/70 text-sm mt-3">
                {avgViewsPerDay.value} avg per day
              </p>
            </div>

            {/* Total Clicks Card */}
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <p class="text-white/70 text-sm font-medium">Total Clicks</p>
              <p class="text-4xl font-bold mt-2">{data.value.totalClicks}</p>
              <p class="text-white/70 text-sm mt-3">
                {avgClicksPerDay.value} avg per day
              </p>
            </div>
          </div>

          {/* Daily Stats Charts */}
          {data.value.dailyStats.length > 0 && (
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-6">
                Daily Activity
              </h2>

              {/* Views Chart */}
              <div class="mb-8">
                <h3 class="text-sm font-medium text-gray-700 mb-4">
                  Page Views
                </h3>
                <div class="flex items-end justify-between h-40 gap-1 bg-gray-50 p-4 rounded-lg">
                  {data.value.dailyStats.map((stat) => (
                    <div
                      key={stat.date}
                      class="flex-1 flex flex-col items-center group"
                    >
                      <div
                        class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{
                          height: `${
                            Math.max(
                              (stat.views / maxDailyViews) * 100,
                              2,
                            )
                          }%`,
                        }}
                        title={`${stat.date}: ${stat.views} views`}
                      >
                      </div>
                      <span class="text-xs text-gray-500 mt-2 text-center truncate w-full px-1">
                        {new Date(stat.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clicks Chart */}
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-4">
                  Link Clicks
                </h3>
                <div class="flex items-end justify-between h-40 gap-1 bg-gray-50 p-4 rounded-lg">
                  {data.value.dailyStats.map((stat) => (
                    <div
                      key={stat.date}
                      class="flex-1 flex flex-col items-center group"
                    >
                      <div
                        class="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                        style={{
                          height: `${
                            Math.max(
                              (stat.clicks / maxDailyClicks) * 100,
                              2,
                            )
                          }%`,
                        }}
                        title={`${stat.date}: ${stat.clicks} clicks`}
                      >
                      </div>
                      <span class="text-xs text-gray-500 mt-2 text-center truncate w-full px-1">
                        {new Date(stat.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Links Table */}
          {data.value.topLinks.length > 0 && (
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">
                  Top Links
                </h2>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Link
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        URL
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {data.value.topLinks.map((link) => (
                      <tr key={link.id} class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm font-medium text-gray-900">
                            {link.title}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span class="text-sm text-gray-600 truncate block max-w-xs">
                            {link.url}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm font-semibold text-gray-900">
                            {link.clicks}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-gray-600">
                            {topLinksTotalClicks.value > 0
                              ? Math.round(
                                (link.clicks / topLinksTotalClicks.value) *
                                  100,
                              )
                              : 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.value.dailyStats.length === 0 &&
            data.value.topLinks.length === 0 && (
            <div class="bg-white rounded-lg shadow p-12 text-center">
              <p class="text-gray-600">
                No analytics data yet. Start sharing your link to see
                statistics!
              </p>
            </div>
          )}

          {/* Quick Links */}
          <div class="flex flex-wrap gap-3">
            <a
              href="/dashboard"
              class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium touch-manipulation"
            >
              ← Back to Dashboard
            </a>
            <a
              href="/links"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium touch-manipulation"
            >
              Manage Links
            </a>
          </div>
        </>
      )}
    </div>
  );
}
