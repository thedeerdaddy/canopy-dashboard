import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

const integrations = [
  { name: "Guesty",        desc: "Occupancy, revenue, bookings",      status: "connected", icon: "📊" },
  { name: "PriceLabs",     desc: "Market rates, demand forecasts",     status: "connected", icon: "📈" },
  { name: "Turno",         desc: "Cleaning completions, ratings",      status: "connected", icon: "🧹" },
  { name: "Airbnb",        desc: "Reviews, ratings, booking data",     status: "connected", icon: "🏠" },
  { name: "VRBO",          desc: "Reviews, ratings, booking data",     status: "connected", icon: "🏡" },
  { name: "Booking.com",   desc: "Reviews, ratings, booking data",     status: "connected", icon: "🌐" },
  { name: "Hospitable",    desc: "Guest messaging",                    status: "pending",   icon: "💬" },
  { name: "Lindy",         desc: "AI automation orchestration",        status: "connected", icon: "🤖" },
  { name: "Gmail",         desc: "Draft creation and send",            status: "connected", icon: "📬" },
];

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Integrations</h1>
          <p className="text-sm text-gray-400 mb-6">All connected data sources and tools</p>
          <div className="grid grid-cols-1 gap-3 max-w-2xl">
            {integrations.map((int) => (
              <div key={int.name} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4">
                <span className="text-2xl">{int.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{int.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{int.desc}</div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  int.status === "connected"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {int.status === "connected" ? "✓ Connected" : "⚙ Configuring"}
                </span>
                <button className="text-xs text-gray-400 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-blue-300 transition-colors">
                  {int.status === "connected" ? "Reconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
