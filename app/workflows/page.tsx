import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

const workflows = [
  {
    category: "⭐ Get More Reviews & Credibility",
    items: [
      { id: "review-to-video", icon: "🎬", name: "Turn reviews into a short video", steps: 4, mins: 10, tools: ["Google", "Claude", "Loom"], ai: true, badge: "Popular" },
      { id: "review-request",  icon: "📩", name: "Ask happy clients for a Google review", steps: 3, mins: 5,  tools: ["Claude", "SMS"], ai: true },
      { id: "review-reply",    icon: "💬", name: "Reply to all unanswered reviews", steps: 3, mins: 8,  tools: ["Google", "Claude"], ai: true },
      { id: "review-share",    icon: "📣", name: "Share a 5-star review to social", steps: 3, mins: 5,  tools: ["Canva", "Scheduler"], ai: false },
    ],
  },
  {
    category: "📣 Grow Online & Stay Visible",
    items: [
      { id: "blog-post",      icon: "✍️", name: "Write a blog post about my market", steps: 3, mins: 7,  tools: ["Claude", "WordPress"], ai: true },
      { id: "blog-to-social", icon: "♻️", name: "Turn one blog into 5 social posts", steps: 2, mins: 4,  tools: ["Claude", "Scheduler"], ai: true, badge: "AI" },
      { id: "listing-video",  icon: "🏡", name: "Record a listing video walkthrough", steps: 4, mins: 15, tools: ["Loom", "Potion"], ai: false },
      { id: "social-week",    icon: "📅", name: "Schedule a full week of social posts", steps: 3, mins: 10, tools: ["Claude", "Scheduler"], ai: true },
    ],
  },
  {
    category: "👥 Convert & Follow Up on Leads",
    items: [
      { id: "lead-followup",  icon: "⚡", name: "Send a fast follow-up to a new lead", steps: 2, mins: 3,  tools: ["Claude", "SMS"], ai: true, badge: "Fast" },
      { id: "lead-nurture",   icon: "🤖", name: "Set up an auto lead nurture sequence", steps: 5, mins: 20, tools: ["Lindy", "Claude"], ai: true },
      { id: "lead-video",     icon: "🎥", name: "Send a personal video to a warm lead", steps: 3, mins: 8,  tools: ["Loom", "Potion"], ai: false },
      { id: "drip-email",     icon: "📧", name: "Write a drip email sequence", steps: 3, mins: 10, tools: ["Claude", "Lindy"], ai: true },
    ],
  },
  {
    category: "🛡️ Stay Compliant & Informed",
    items: [
      { id: "reg-check",    icon: "📋", name: "Check for new TX regulatory changes", steps: 2, mins: 3, tools: ["RegWatch"], ai: false },
      { id: "reg-summary",  icon: "📄", name: "Generate a compliance summary for agents", steps: 3, mins: 6, tools: ["RegWatch", "Claude"], ai: true },
    ],
  },
];

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Workflows</h1>
            <p className="text-sm text-gray-400 mt-0.5">What do you want to accomplish today?</p>
          </div>

          {workflows.map((group) => (
            <div key={group.category} className="mb-8">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {group.category}
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {group.items.map((wf) => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.id}`}
                      className="flex-shrink-0 w-44 bg-gray-50 border border-gray-200 rounded-xl p-3.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all relative group"
                    >
                      {wf.badge && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          {wf.badge}
                        </span>
                      )}
                      {wf.ai && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                          ✨ AI
                        </span>
                      )}
                      <div className="text-2xl mt-4 mb-2">{wf.icon}</div>
                      <div className="text-xs font-medium text-gray-800 leading-snug mb-1.5">{wf.name}</div>
                      <div className="text-[10px] text-gray-400 mb-2">{wf.steps} steps · ~{wf.mins} min</div>
                      <div className="flex flex-wrap gap-1">
                        {wf.tools.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
