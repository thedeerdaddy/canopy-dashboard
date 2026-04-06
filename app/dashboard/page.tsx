import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Good morning, Amber 👋</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Waco, TX
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                Export Report
              </button>
              <button className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                + Create Content
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "New Leads",        value: "24",     delta: "+18%", color: "emerald" },
              { label: "Avg Review Score", value: "4.7 ⭐",  delta: "+0.2", color: "amber" },
              { label: "Social Reach",     value: "3,841",  delta: "+31%", color: "blue" },
              { label: "AI Content",       value: "17",     delta: "+5",   color: "purple" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-emerald-600 font-medium">{delta} this week</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <a
              href="/newsletter"
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">📬</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Generate Newsletter</div>
              <div className="text-xs text-gray-400">Pull data from all sources and write May&apos;s owner newsletter</div>
              <div className="mt-3 text-xs text-blue-600 font-medium group-hover:text-blue-700">Open →</div>
            </a>
            <a
              href="/owners"
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">👤</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Owner Emails</div>
              <div className="text-xs text-gray-400">Generate personalized emails for all 7 property owners</div>
              <div className="mt-3 text-xs text-blue-600 font-medium group-hover:text-blue-700">Open →</div>
            </a>
            <a
              href="/workflows"
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">⚡</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Workflows</div>
              <div className="text-xs text-gray-400">Goal-based workflows to grow reviews, leads, and visibility</div>
              <div className="mt-3 text-xs text-blue-600 font-medium group-hover:text-blue-700">Browse →</div>
            </a>
          </div>

          {/* Automation status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex items-center gap-4">
            <div className="text-2xl">🤖</div>
            <div>
              <div className="text-sm font-medium text-gray-900">Monthly automation is active</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Next run: May 1, 2026 at 7:00 AM ET · Newsletter + 7 owner emails + voice matching
              </div>
            </div>
            <a
              href="/newsletter/automation"
              className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 bg-white hover:bg-blue-50 transition-colors"
            >
              Configure →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
