"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard",    href: "/dashboard",               icon: "🏠", section: "Overview" },
  { label: "AI Content",   href: "/workflows/content",       icon: "✍️", section: "Tools",    badge: "3" },
  { label: "Reviews",      href: "/workflows/reviews",       icon: "⭐", section: "Tools",    badge: "2 new", badgeColor: "coral" },
  { label: "Social",       href: "/workflows/social",        icon: "📅", section: "Tools" },
  { label: "Leads CRM",    href: "/workflows/leads",         icon: "👥", section: "Tools" },
  { label: "Newsletter",   href: "/newsletter",              icon: "📬", section: "Comms" },
  { label: "Owner Emails", href: "/owners",                  icon: "👤", section: "Comms" },
  { label: "Automation",   href: "/newsletter/automation",   icon: "🤖", section: "Comms" },
  { label: "Workflows",    href: "/workflows",               icon: "⚡", section: "Tools" },
  { label: "Analytics",    href: "/settings/integrations",   icon: "📊", section: "Reports" },
  { label: "RegWatch",     href: "/settings/integrations",   icon: "🛡️", section: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();

  const sections = ["Overview", "Tools", "Comms", "Reports"];

  return (
    <div className="w-56 bg-white border-r border-gray-100 flex flex-col h-full">
      {sections.map((section) => {
        const items = navItems.filter((n) => n.section === section);
        return (
          <div key={section}>
            <div className="px-4 pt-5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {section}
            </div>
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-all border-l-2 ${
                    active
                      ? "bg-blue-50 text-blue-700 border-blue-500 font-medium"
                      : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor === "coral"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}

      {/* Package badge at bottom */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider mb-1">Package</div>
          <div className="text-xs font-medium text-gray-800">Growth Suite · 6 tools</div>
        </div>
      </div>
    </div>
  );
}
