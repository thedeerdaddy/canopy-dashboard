/**
 * lib/prompts.ts
 * All Claude prompt templates as typed functions.
 * Never hardcode prompts inline in components — import from here.
 */

// ── Types ──────────────────────────────────────────────────────

interface DataPackage {
  portfolio: {
    occupancy: number;
    avgNightlyRate: number;
    totalRevenue: number;
    avgRating: number;
    newBookings: number;
    cancellationRate: number;
    period: string;
  };
  properties: Property[];
  market: {
    avgOccupancy: number;
    avgNightlyRate: number;
    summerDemandDelta: number;
    memorialDayOccupancy: number;
    bookingWindows: Record<string, number>;
  };
  ops: {
    cleaningsCompleted: number;
    avgCleanerRating: number;
    issuesFlagged: number;
    sameDayTurns: number;
  };
  reviews: Review[];
  pulledAt: string;
}

interface Property {
  id: string;
  ownerId: string;
  name: string;
  occupancy: number;
  avgNightlyRate: number;
  revenue: number;
  rating: number;
  topReview: { text: string; author: string; platform: string; stars: number };
  ownerNote: string;
  badge: string | null;
}

interface Review {
  id: string;
  propertyId: string;
  text: string;
  author: string;
  platform: string;
  stars: number;
  date: string;
  replied: boolean;
}

interface VoiceProfile {
  scannedAt: string;
  emailsAnalyzed: number;
  sentenceLength: string;
  formality: number;
  signaturePhrase: string[];
  avoidWords: string[];
  openingStyle: string;
  signOff: string;
  dataStyle: string;
  sampleQuote: string;
}

interface MichelleInputs {
  workingOn: string;
  actionItem: string;
  shoutout?: string;
  tone: "warm-professional" | "data-forward" | "motivational";
}

interface Owner {
  id: string;
  name: string;
  email: string;
  propertyName: string;
}

// ── Prompt 1: Newsletter first draft ──────────────────────────

export function newsletterDraftPrompt(data: DataPackage, inputs: MichelleInputs): string {
  const toneDesc = {
    "warm-professional": "Warm and professional — like a trusted advisor writing to close friends who happen to be clients. Michelle comes through as a real person.",
    "data-forward": "Data-forward and analytical — lead with the numbers, then add warmth and context.",
    "motivational": "Upbeat and motivational — make owners feel great about their investment and excited about what's ahead. Celebrate the wins loudly.",
  }[inputs.tone];

  const outperformOcc = ((data.portfolio.occupancy - data.market.avgOccupancy) * 100).toFixed(0);
  const outperformRate = data.portfolio.avgNightlyRate - data.market.avgNightlyRate;

  return `You are writing a monthly owner newsletter for Peak Paradise Vacation Rental Management.
From Michelle, the operator, to her property owners.
Tone: ${toneDesc}

PORTFOLIO DATA (${data.portfolio.period}):
- Occupancy: ${(data.portfolio.occupancy * 100).toFixed(0)}% (market avg: ${(data.market.avgOccupancy * 100).toFixed(0)}% — we outperform by ${outperformOcc} points)
- Avg nightly rate: $${data.portfolio.avgNightlyRate} (market avg: $${data.market.avgNightlyRate} — we earn $${outperformRate} more per night)
- Total revenue: $${data.portfolio.totalRevenue.toLocaleString()}
- Avg rating: ${data.portfolio.avgRating}
- New bookings: ${data.portfolio.newBookings}
- Cancellation rate: ${(data.portfolio.cancellationRate * 100).toFixed(1)}%

TOP PROPERTIES:
${data.properties
  .slice(0, 3)
  .map(
    (p) =>
      `${p.name}: ${(p.occupancy * 100).toFixed(0)}% occ, $${p.avgNightlyRate}/night, $${p.revenue.toLocaleString()} revenue.
  Top review: "${p.topReview.text}" — ${p.topReview.author}, ${p.topReview.platform}, ${p.topReview.stars} stars`
  )
  .join("\n")}

MARKET DATA (PriceLabs — Great Smoky Mountains):
- Summer demand forecast: +${(data.market.summerDemandDelta * 100).toFixed(0)}% YoY
- Memorial Day projected market occupancy: ${(data.market.memorialDayOccupancy * 100).toFixed(0)}%
- Booking windows by platform: ${Object.entries(data.market.bookingWindows)
    .map(([p, d]) => `${p}: ${d} days`)
    .join(", ")}

OPERATIONS (Turno):
- ${data.ops.cleaningsCompleted} cleanings completed, avg cleaner rating ${data.ops.avgCleanerRating}
- ${data.ops.issuesFlagged} issues flagged, ${data.ops.sameDayTurns} same-day turns completed

MICHELLE'S NOTES:
What she's working on: ${inputs.workingOn}
Owner action item: ${inputs.actionItem}
${inputs.shoutout ? `Shoutout: ${inputs.shoutout}` : ""}

Write sections: warm personal opening, numbers this month (woven naturally — not bullet dumps), standout properties with reviews quoted naturally, market intel framed as owner advantage, what we're working on, owner action item, warm closing.
${inputs.shoutout ? "Include a shoutout section." : ""}

Rules:
- 350-420 words total
- No bullet points — natural paragraphs only
- Reference specific property names and review quotes
- Do not include section headers
- First line must be: SUBJECT: [your subject line here]
- Then a blank line, then the newsletter body`;
}

// ── Prompt 2: Humanize pass ────────────────────────────────────

export function humanizePrompt(draft: string, voice: VoiceProfile): string {
  return `You are editing a newsletter draft to match a specific person's writing voice exactly.
Do NOT change any facts, data, or overall structure. Only change voice and style.

VOICE PROFILE (extracted from ${voice.emailsAnalyzed} real sent emails):
- Sentence length: ${voice.sentenceLength} — avg 12 words per sentence
- Opening style: ${voice.openingStyle}
- Sign-off: always "${voice.signOff}"
- Data style: ${voice.dataStyle}
- Signature phrases to use naturally (do not force all of them): ${voice.signaturePhrase.join(", ")}
- Words and phrases to NEVER use: ${voice.avoidWords.join(", ")}
- Sample of her actual writing: "${voice.sampleQuote}"

DRAFT TO HUMANIZE:
${draft}

Rewrite in this person's exact voice. Keep all data and key points intact.
Output only the rewritten newsletter — no commentary, no explanation.`;
}

// ── Prompt 3: Polish pass ──────────────────────────────────────

export function polishPrompt(humanized: string): string {
  return `Do a final professional polish pass on this newsletter.

Rules:
- Fix grammar and clarity issues only
- Do NOT change sentence structure or word choice unnecessarily — the voice is intentional
- Verify number consistency (no rounding mismatches between sections)
- Remove any redundant phrases
- Ensure the call to action is crisp and specific
- Preserve the opening and sign-off exactly as written
- Do not add corporate language, formality, or filler

Output only the polished newsletter — no commentary.

Newsletter:
${humanized}`;
}

// ── Prompt 4: Per-owner email ──────────────────────────────────

export function ownerEmailPrompt(
  owner: Owner,
  property: Property,
  data: DataPackage,
  voice: VoiceProfile
): string {
  const outperformOcc = ((data.portfolio.occupancy - data.market.avgOccupancy) * 100).toFixed(0);

  return `Write a short, warm, personal property performance email from Michelle at
Peak Paradise Vacation Rental Management to one property owner.

Owner: ${owner.name} (${owner.email})
Property: ${property.name}
This month: ${(property.occupancy * 100).toFixed(0)}% occupancy, $${property.avgNightlyRate} avg/night, $${property.revenue.toLocaleString()} revenue, ${property.rating} avg rating
Context: ${property.ownerNote}
Top guest review: "${property.topReview.text}" — ${property.topReview.author}, ${property.topReview.platform}, ${property.topReview.stars} stars
Market context: portfolio outperforming market by ${outperformOcc} occupancy points. Summer demand up ${(data.market.summerDemandDelta * 100).toFixed(0)}% YoY.

Michelle's voice: ${voice.openingStyle}. Sign-off: "${voice.signOff}".
Phrases to use naturally (1-2 max): ${voice.signaturePhrase.slice(0, 3).join(", ")}
Never use: ${voice.avoidWords.join(", ")}

Write a personalized email that:
- Feels like a real person wrote it, not a template
- Leads with something specific to THEIR property
- Interprets their numbers with meaning, not just states them
- Includes their top guest review woven in naturally
- Gives one forward-looking insight specific to their situation
- Closes warmly with the correct sign-off
- Is 180-240 words total

First line: SUBJECT: [subject line]
Then blank line, then email body. No markdown headers.`;
}

// ── Prompt 5: Review-to-video script ──────────────────────────

export function reviewVideoScriptPrompt(
  reviewText: string,
  reviewAuthor: string,
  reviewPlatform: string,
  tone: "warm" | "professional" | "upbeat",
  businessName: string,
  ownerName: string
): string {
  const toneDesc = {
    warm: "Warm and personal — like a trusted friend who happens to know the business cold",
    professional: "Sharp and confident — credible, data-aware, authoritative without being stiff",
    upbeat: "High energy and casual — enthusiastic, punchy, designed for social media",
  }[tone];

  return `Write a 30-second video script for ${ownerName} at ${businessName}.
They will read this directly to camera. Must sound exactly like how a real person talks — not an ad.

Based on this real customer review:
"${reviewText}" — ${reviewAuthor}, ${reviewPlatform}

Tone: ${toneDesc}

Rules:
- Hook in the first 2 seconds that grabs attention immediately
- Reference the specific detail from the review (don't be generic)
- End with a soft, natural call to action — not salesy
- Under 120 words total
- Write ONLY the script — no stage directions, no labels, no preamble`;
}

// ── Prompt 6: Platform captions ───────────────────────────────

export function platformCaptionsPrompt(
  reviewText: string,
  scriptPreview: string,
  platforms: string[],
  businessName: string
): string {
  const platformInstructions: Record<string, string> = {
    instagram: "instagram: punchy, 2-3 sentences max, 3-5 relevant hashtags at the end",
    facebook: "facebook: slightly longer, conversational, warm, no hashtags",
    email: "email: return as a JSON object with keys 'subject' (subject line) and 'body' (2-sentence email intro)",
  };

  return `Write social media captions for: ${platforms.join(", ")}

Business: ${businessName}
The video is the owner talking about this customer review: "${reviewText}"
Opening of their script: "${scriptPreview.slice(0, 150)}..."

${platforms.map((p) => platformInstructions[p] || p).join("\n")}

Return ONLY valid JSON with keys matching the platform names requested.
No markdown backticks, no preamble, no explanation.
Example format: { "instagram": "caption here #hashtag", "facebook": "caption here", "email": { "subject": "...", "body": "..." } }`;
}

// ── Prompt 7: Michelle's private briefing ─────────────────────

export function michelleBriefingPrompt(data: DataPackage): string {
  const flagged = data.properties.filter((p) => p.occupancy < 0.7);
  const outperformBy = ((data.portfolio.occupancy - data.market.avgOccupancy) * 100).toFixed(0);

  return `Write a private 4-6 sentence briefing for Michelle (the property manager).
This is her internal summary before she reviews email drafts. She reads it in 30 seconds.
Be direct. Flag anything that needs attention. No fluff.

Data:
- Portfolio: ${(data.portfolio.occupancy * 100).toFixed(0)}% occupancy vs ${(data.market.avgOccupancy * 100).toFixed(0)}% market (+${outperformBy} pts)
- Revenue: $${data.portfolio.totalRevenue.toLocaleString()} (${data.portfolio.period})
- Top property: ${data.properties[0]?.name} at ${(data.properties[0]?.occupancy * 100).toFixed(0)}% occupancy and $${data.properties[0]?.revenue.toLocaleString()} revenue
- Avg rating: ${data.portfolio.avgRating}
- Ops: ${data.ops.cleaningsCompleted} cleanings, ${data.ops.issuesFlagged} issues flagged
${
  flagged.length > 0
    ? `- FLAGGED (below 70% threshold): ${flagged.map((p) => `${p.name} at ${(p.occupancy * 100).toFixed(0)}%`).join(", ")}`
    : "- No properties below 70% occupancy threshold"
}

This briefing is for Michelle's eyes only — not sent to owners.`;
}
