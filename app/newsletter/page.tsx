"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";

export default function NewsletterPage() {
  const [workingOn, setWorkingOn]         = useState("");
  const [actionItem, setActionItem]       = useState("");
  const [shoutout, setShoutout]           = useState("");
  const [tone, setTone]                   = useState("warm-professional");
  const [subject, setSubject]             = useState("");
  const [body, setBody]                   = useState("");
  const [stage, setStage]                 = useState<"idle" | "drafting" | "humanizing" | "polishing" | "done">("idle");
  const [error, setError]                 = useState("");

  async function readStream(response: Response, onChunk: (text: string) => void): Promise<string> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              full += parsed.delta.text;
              onChunk(full);
            }
          } catch {}
        }
      }
    }
    return full;
  }

  function extractSubject(text: string) {
    const lines = text.split("\n");
    if (lines[0].startsWith("SUBJECT:")) {
      return {
        subject: lines[0].replace("SUBJECT:", "").trim(),
        body: lines.slice(2).join("\n").trim(),
      };
    }
    return { subject: "", body: text };
  }

  async function generate() {
    if (!workingOn || !actionItem) {
      setError("Please fill in both required fields before generating.");
      return;
    }
    setError("");
    setSubject("");
    setBody("");

    // Fetch data
    const dataRes = await fetch("/api/data");
    const dataPackage = await dataRes.json();

    const voiceRes = await fetch("/api/voice");
    const voiceProfile = await voiceRes.json();

    // Stage 1: Draft
    setStage("drafting");
    const draftRes = await fetch("/api/newsletter/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataPackage, inputs: { workingOn, actionItem, shoutout, tone } }),
    });
    const draft = await readStream(draftRes, (t) => {
      const { subject: s, body: b } = extractSubject(t);
      setSubject(s);
      setBody(b);
    });

    // Stage 2: Humanize
    setStage("humanizing");
    const humanizeRes = await fetch("/api/newsletter/humanize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft, voiceProfile }),
    });
    const humanized = await readStream(humanizeRes, (t) => {
      const { subject: s, body: b } = extractSubject(t);
      setSubject(s);
      setBody(b);
    });

    // Stage 3: Polish
    setStage("polishing");
    const polishRes = await fetch("/api/newsletter/polish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ humanized }),
    });
    const polished = await readStream(polishRes, (t) => {
      const { subject: s, body: b } = extractSubject(t);
      setSubject(s);
      setBody(b);
    });

    setStage("done");
  }

  const stageLabel = {
    idle: "",
    drafting: "Claude is writing the first draft...",
    humanizing: "Humanizing to Michelle's voice...",
    polishing: "Polishing for professionalism...",
    done: "Ready to send",
  }[stage];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex gap-0">

          {/* Left panel: inputs */}
          <div className="w-96 bg-white border-r border-gray-100 flex flex-col overflow-y-auto flex-shrink-0">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Newsletter Generator</h2>
              <p className="text-xs text-gray-400 mt-0.5">Peak Paradise · May 2026</p>
            </div>

            {/* Data sources */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Data Sources</div>
              {[
                { name: "Guesty", desc: "Portfolio performance", status: "live" },
                { name: "PriceLabs", desc: "Market data", status: "live" },
                { name: "Turno", desc: "Operations", status: "live" },
                { name: "Airbnb / VRBO / Booking.com", desc: "Reviews", status: "synced" },
              ].map((src) => (
                <div key={src.name} className="flex items-center gap-2 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${src.status === "live" ? "bg-emerald-500" : "bg-blue-500"}`} />
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-700">{src.name}</span>
                    <span className="text-xs text-gray-400 ml-1">· {src.desc}</span>
                  </div>
                  <span className={`text-[10px] font-medium ${src.status === "live" ? "text-emerald-600" : "text-blue-600"}`}>
                    {src.status === "live" ? "● live" : "✓ synced"}
                  </span>
                </div>
              ))}
            </div>

            {/* Michelle's inputs */}
            <div className="p-4 flex-1">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                ✍️ Michelle&apos;s Notes
                <span className="text-[10px] font-normal text-gray-400 normal-case tracking-normal">Fill in before generating</span>
              </div>

              <label className="block mb-3">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  What are you working on for owners? <span className="text-red-500">*</span>
                </span>
                <textarea
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-blue-400 text-gray-700 placeholder-gray-300"
                  placeholder="e.g. Launching new direct booking site, renegotiating Booking.com rates..."
                  value={workingOn}
                  onChange={(e) => setWorkingOn(e.target.value)}
                />
              </label>

              <label className="block mb-3">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Owner action item this month? <span className="text-red-500">*</span>
                </span>
                <textarea
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-blue-400 text-gray-700 placeholder-gray-300"
                  placeholder="e.g. Memorial Day is 6 weeks out — consider dropping minimum stay to 2 nights..."
                  value={actionItem}
                  onChange={(e) => setActionItem(e.target.value)}
                />
              </label>

              <label className="block mb-3">
                <span className="text-xs font-medium text-gray-600 mb-1 block">Shoutout (optional)</span>
                <textarea
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-blue-400 text-gray-700 placeholder-gray-300"
                  placeholder="e.g. Congrats to the Hendersons — 100 reviews with a 4.93 average!"
                  value={shoutout}
                  onChange={(e) => setShoutout(e.target.value)}
                />
              </label>

              <label className="block mb-4">
                <span className="text-xs font-medium text-gray-600 mb-1 block">Tone</span>
                <select
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-400 text-gray-700 bg-white"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="warm-professional">Warm & professional (default)</option>
                  <option value="data-forward">Data-forward — lead with numbers</option>
                  <option value="motivational">Motivational — celebrate the wins</option>
                </select>
              </label>

              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            </div>

            <div className="p-4 border-t border-gray-100">
              <Button
                variant="lindy"
                size="lg"
                loading={stage !== "idle" && stage !== "done"}
                onClick={generate}
              >
                ✨ Generate Owner Newsletter
              </Button>
              {stageLabel && (
                <p className="text-xs text-center text-gray-400 mt-2">{stageLabel}</p>
              )}
            </div>
          </div>

          {/* Right panel: email preview */}
          <div className="flex-1 overflow-y-auto p-6">
            {stage === "idle" ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-300">
                <div className="text-5xl mb-4 opacity-40">📬</div>
                <div className="text-sm font-medium text-gray-400">Your newsletter will appear here</div>
                <div className="text-xs text-gray-300 mt-1 max-w-xs">
                  Fill in Michelle&apos;s notes on the left and hit Generate. Claude combines all data sources into one polished newsletter.
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Subject line */}
                {subject && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide whitespace-nowrap">Subject</span>
                    <span className="text-sm text-gray-800 font-medium">{subject}</span>
                  </div>
                )}

                {/* Stage indicator */}
                {stage !== "done" && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-purple-600 font-medium">{stageLabel}</span>
                  </div>
                )}

                {/* Email preview */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Email header */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center">
                    <div className="text-3xl mb-2">🏔️</div>
                    <div className="text-white font-semibold text-lg tracking-wide">PEAK PARADISE</div>
                    <div className="text-slate-400 text-xs mt-1 uppercase tracking-widest">
                      Owner Newsletter · {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                    {[
                      { val: "78%",    label: "Portfolio Occ." },
                      { val: "$247",   label: "Avg/Night" },
                      { val: "4.87 ⭐", label: "Avg Rating" },
                    ].map((s) => (
                      <div key={s.label} className="p-4 text-center">
                        <div className="text-xl font-semibold text-gray-900">{s.val}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Body */}
                  <div className="p-8">
                    {body ? (
                      <div
                        className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap"
                      >
                        {body}
                        {stage !== "done" && (
                          <span className="inline-block w-0.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-purple-600">
                        <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Writing...</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 p-4 text-center text-xs text-gray-300">
                    Peak Paradise Vacation Rental Management · Michelle&apos;s Team
                  </div>
                </div>

                {/* Actions */}
                {stage === "done" && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)}
                    >
                      📋 Copy text
                    </Button>
                    <Button variant="ghost" size="md" onClick={generate}>
                      ↺ Regenerate
                    </Button>
                    <Button variant="lindy" size="md" className="ml-auto">
                      🤖 Hand off to Lindy →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
