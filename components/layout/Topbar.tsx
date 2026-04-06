"use client";

export function Topbar() {
  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-3 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
          🌿
        </div>
        <span className="text-sm font-semibold text-gray-900">Canopy AI</span>
      </div>

      <div className="w-px h-5 bg-gray-200" />

      {/* Client badge */}
      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs text-gray-600 font-medium">Peak Paradise VRM</span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
        <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">
          🔔
        </button>
        <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">
          ⚙️
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          AB
        </div>
      </div>
    </div>
  );
}
