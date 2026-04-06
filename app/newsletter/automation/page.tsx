import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AutomationPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Monthly Automation</h1>
          <p className="text-sm text-gray-400 mb-6">Configure your automated monthly pipeline</p>
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-sm">Automation configuration coming in Phase 4.</p>
            <p className="text-xs mt-1">See SPEC.md Section 6.6 for full spec.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
