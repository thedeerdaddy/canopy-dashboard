import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Mock voice profile — replaced by real Gmail scan via Lindy in Phase 5
  const voiceProfile = {
    scannedAt: new Date().toISOString(),
    emailsAnalyzed: 47,
    sentenceLength: "short",
    formality: 60,
    signaturePhrase: [
      "Here's what caught my eye",
      "Really good momentum",
      "Worth flagging",
      "One thing I want to make sure you see",
      "Solid month overall",
      "More soon",
    ],
    avoidWords: ["leverage", "synergy", "I hope this finds you well", "best regards", "utilize", "I am pleased to share"],
    openingStyle: "Direct observation or good news lead — never 'I hope this finds you well'",
    signOff: "Talk soon, Michelle",
    dataStyle: "Always interprets numbers with meaning — '94% occupancy — that's exceptional' not just '94% occupancy'",
    sampleQuote: "Quick update from me — numbers are looking really good this month. Had to share a couple things I noticed that I think you'll love.",
  };

  return NextResponse.json(voiceProfile);
}

export async function POST(req: NextRequest) {
  // TODO Phase 5: Trigger Lindy to scan Gmail and rebuild voice profile
  return NextResponse.json({ status: "scan triggered", message: "Voice profile will update in ~30 seconds" });
}
