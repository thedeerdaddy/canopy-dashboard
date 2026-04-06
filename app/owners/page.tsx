"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";

const OWNERS = [
  { id: "owner-1", name: "James & Keiko T.", email: "james.keiko@gmail.com", property: "Lakefront Lodge on Blue Ridge",     initials: "JK", color: "blue" },
  { id: "owner-2", name: "Sandra Rivera",    email: "srivera@outlook.com",    property: "Mountain View Chalet – Summit",     initials: "SR", color: "purple" },
  { id: "owner-3", name: "Mike & Pam Chen",  email: "mpchen@gmail.com",       property: "Creekside Cabin – Pigeon Forge",    initials: "MP", color: "green" },
  { id: "owner-4", name: "David Wallace",    email: "dwallace@email.com",     property: "Ridge Runner Retreat",              initials: "DW", color: "amber" },
  { id: "owner-5", name: "Lisa Bouchard",    email: "lisa.bouchard@gmail.com",property: "Smoky Pines Lodge",                 initials: "LB", color: "coral" },
  { id: "owner-6", name: "Robert Nguyen",    email: "robert.nguyen@email.com",property: "Sunset Ridge Cabin",                initials: "RN", color: "blue" },
  { id: "owner-7", name: "Angela Henderson", email: "angela.h@gmail.com",     property: "The Hendersons' Haven",             initials: "AH", color: "purple" },
];

const colorMap: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green:  "bg-emerald-100 text-emerald-700",
  amber:  "bg-amber-100 text-amber-700",
  coral:  "bg-red-100 text-red-700",
};

export default function OwnersPage() {
  const [emails, setEmails]           = useState<Record<string, { subject: string; body: string }>>({});
  const [generating, setGenerating]   = useState<string | null>(null);
  const [sent, setSent]               = useState<Set<string>>(new Set());
  const [selected, setSelected]       = useState(OWNERS[0].id);
  const [batchLoading, setBatchLoading] = useState(false);

  async function generateOne(ownerId: string) {
    setGenerating(ownerId);
    const dataRes = await fetch("/api/data");
    const dataPackage = await dataRes.json();
    const voiceRes = await fetch("/api/voice");
    const voiceProfile = await voiceRes.json();

    const owner = OWNERS.find((o) => o.id === ownerId)!;
    const property = dataPackage.properties.find((p: any) => p.ownerId === ownerId) || dataPackage.properties[0];

    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stream: false,
        messages: [{
          role: "user",
          content: `Write a short personalized property performance email from Michelle at Peak Paradise to ${owner.name} about their property ${owner.property}. Occupancy: ${Math.round(property.occupancy * 100)}%, Revenue: $${property.revenue.toLocaleString()}, Rating: ${property.rating}. Top review: "${property.topReview.text}". Sign off as Michelle. 180-220 words. First line: SUBJECT: [subject line]. Then blank line, then body.`,
        }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const lines = text.split("\n");
    const subject = lines[0].replace("SUBJECT:", "").trim();
    const body = lines.slice(2).join("\n").trim();
    setEmails((prev) => ({ ...prev, [ownerId]: { subject, body } }));
    setGenerating(null);
  }

  async function generateAll() {
    setBatchLoading(true);
    for (const owner of OWNERS) {
      if (!sent.has(owner.id)) await generateOne(owner.id);
    }
    setBatchLoading(false);
  }

  async function approveAndSend(ownerId: string) {
    // TODO Phase 5: POST to /api/owners/[id]/send → Lindy → Gmail
    setSent((prev) => new Set(Array.from(prev).concat(ownerId)));
    const next = OWNERS.find((o) => !sent.has(o.id) && o.id !== ownerId && emails[o.id]);
    if (next) setSelected(next.id);
  }

  const selectedOwner = OWNERS.find((o) => o.id === selected)!;
  const selectedEmail = emails[selected];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Batch bar */}
          <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4">
            <div className="text-2xl">✨</div>
            <div>
              <div className="text-sm font-medium text-gray-900">Generate personalized insight emails for all {OWNERS.length} owners</div>
              <div className="text-xs text-gray-400">Claude writes a unique email per owner. Review one at a time, then Lindy sends via Gmail.</div>
            </div>
            <Button variant="primary" size="md" className="ml-auto" loading={batchLoading} onClick={generateAll}>
              ✨ Generate All Emails
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Owner list */}
            <div className="w-56 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Property Owners</span>
                <span className="text-xs text-gray-400">{sent.size}/{OWNERS.length} sent</span>
              </div>
              {OWNERS.map((owner) => {
                const isActive    = selected === owner.id;
                const isSent      = sent.has(owner.id);
                const isGenerating = generating === owner.id;
                const hasEmail    = !!emails[owner.id];

                return (
                  <button
                    key={owner.id}
                    onClick={() => setSelected(owner.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-l-2 transition-all ${
                      isActive ? "border-blue-500 bg-blue-50" : "border-transparent hover:bg-gray-50"
                    } ${isSent ? "opacity-50" : ""}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorMap[owner.color]}`}>
                      {owner.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{owner.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{owner.property.split("–")[0].trim()}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isSent ? "bg-emerald-500" :
                      isGenerating ? "bg-amber-400 animate-pulse" :
                      hasEmail ? "bg-blue-500" : "bg-gray-200"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Email editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white border-r border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{selectedOwner.name}</span>
                <div className="ml-auto flex gap-2">
                  {selectedEmail && !sent.has(selected) && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => generateOne(selected)}>↺ Rewrite</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        const next = OWNERS.find((o) => o.id !== selected && emails[o.id] && !sent.has(o.id));
                        if (next) setSelected(next.id);
                      }}>Skip →</Button>
                      <Button variant="green" size="sm" onClick={() => approveAndSend(selected)}>
                        🤖 Approve & Send via Lindy
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {generating === selected ? (
                <div className="flex-1 flex items-center justify-center gap-3 text-purple-600">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Writing email for {selectedOwner.name}...</span>
                </div>
              ) : selectedEmail ? (
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-10 text-gray-400">From</span>
                    <span>michelle@peakparadisevr.com</span>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-10 text-gray-400">To</span>
                    <span>{selectedOwner.email}</span>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-xs">
                    <span className="w-10 text-gray-400">Subject</span>
                    <span className="font-medium text-gray-800">{selectedEmail.subject}</span>
                  </div>
                  <div className="p-4">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap outline-none min-h-48 focus:ring-1 focus:ring-blue-200 rounded p-1"
                    >
                      {selectedEmail.body}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
                  <span className="text-4xl opacity-30">✉️</span>
                  <span className="text-sm text-gray-400">Click &quot;Generate All Emails&quot; to start</span>
                  <Button variant="ghost" size="sm" onClick={() => generateOne(selected)} loading={generating === selected}>
                    Generate just this one
                  </Button>
                </div>
              )}
            </div>

            {/* Stats panel */}
            <div className="w-64 bg-white overflow-y-auto flex-shrink-0 p-4">
              <div className="text-xs font-semibold text-gray-500 mb-3">{selectedOwner.property}</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { val: "94%",   label: "Occupancy" },
                  { val: "$389",  label: "Avg/night" },
                  { val: "$28.4k",label: "Revenue" },
                  { val: "4.95⭐",label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                    <div className="text-base font-semibold text-gray-900">{s.val}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs font-semibold text-gray-500 mb-2">Top Review</div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-600 italic leading-relaxed">
                &ldquo;Absolutely perfect. The lake views at sunrise were magical and the kayaks were such a bonus.&rdquo;
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Jennifer M. · Airbnb</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
