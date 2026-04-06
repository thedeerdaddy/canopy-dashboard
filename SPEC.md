# Canopy AI Dashboard — Full Product Specification

**Reference client:** Peak Paradise Vacation Rental Management  
**Operator:** Michelle (property manager, 7 properties, 14 owners)  
**Built by:** Canopy AI Solutions — canopyaisolutions.com  
**Version:** 1.0 — April 2026

---

## Starting prompt for Claude Code

> Read this entire file first, then build the Canopy AI Dashboard platform exactly as specified. Start with Phase 1 from Section 11. Use Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase. All Claude API calls must go through a server-side proxy route at `/api/claude` and must never expose the API key to the browser.

---

## Section 1 — Product Overview

### What this is

Canopy AI Dashboard is a white-label, AI-powered operations platform that Canopy AI Solutions sells to small and mid-size businesses. Each client gets a branded dashboard that combines their existing tools under one roof, eliminates tab-switching, and automates high-frequency communication tasks using Claude.

The reference implementation here is built for **Peak Paradise Vacation Rental Management**. Michelle manages 7 properties and 14 property owners across the Great Smoky Mountains market.

### Design philosophy

The product is built around one constraint: **a non-technical business owner must be able to complete any task without knowing which tool is doing the work underneath.** No visible API keys. No tab-switching. No tool-specific language. Every surface is goal-oriented.

- Users think in goals: "I want more reviews" not "I need to open Loom"
- AI steps are invisible infrastructure, not features users operate
- Every workflow ends with a clear output the user can act on immediately
- Michelle's only required monthly action: read a briefing, review a draft, click Approve

### The core product loop

1. Data sources pull automatically on a schedule (Lindy orchestrates)
2. Claude generates drafts using all available data
3. Two-pass refinement: humanize to owner voice → polish for professionalism
4. Owner reviews in a single approval inbox and hits send
5. Lindy dispatches via Gmail and logs everything

### Tech stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript throughout
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Database:** Supabase (Postgres + Auth)
- **Automation:** Lindy (orchestration + Gmail)
- **Key integrations:** Guesty, PriceLabs, Turno, Airbnb, VRBO, Booking.com, Gmail OAuth

---

## Section 2 — Project File Structure

Scaffold with: `npx create-next-app@latest canopy-dashboard --typescript --tailwind --app`

```
canopy-dashboard/
├── app/
│   ├── layout.tsx                    # Root layout, sidebar, topbar
│   ├── page.tsx                      # Redirect to /dashboard
│   ├── onboarding/
│   │   └── page.tsx                  # 6-step onboarding wizard
│   ├── dashboard/
│   │   └── page.tsx                  # Main client dashboard
│   ├── workflows/
│   │   ├── page.tsx                  # Workflow hub (goal-based)
│   │   └── [id]/page.tsx             # Individual workflow wizard
│   ├── newsletter/
│   │   ├── page.tsx                  # Newsletter generator + Lindy handoff
│   │   └── automation/page.tsx       # Monthly automation config
│   ├── owners/
│   │   └── page.tsx                  # Per-owner email queue
│   ├── voice/
│   │   └── page.tsx                  # Voice profile viewer/editor
│   ├── inbox/
│   │   └── page.tsx                  # Michelle approval inbox
│   └── settings/
│       └── integrations/page.tsx     # Integration connection status
├── api/
│   ├── claude/route.ts               # Server-side Claude proxy (NEVER expose key to browser)
│   ├── data/route.ts                 # Aggregated data pull endpoint
│   ├── guesty/route.ts               # Guesty API proxy
│   ├── pricelabs/route.ts            # PriceLabs API proxy
│   ├── turno/route.ts                # Turno API proxy
│   ├── reviews/route.ts              # Airbnb/VRBO/Booking.com reviews
│   ├── voice/route.ts                # Voice profile (Gmail scan via Lindy)
│   ├── lindy/webhook/route.ts        # Inbound Lindy webhook receiver
│   └── gmail/draft/route.ts          # Create Gmail draft via OAuth
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── NavItem.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── ContentWidget.tsx
│   │   ├── ReviewWidget.tsx
│   │   ├── SocialQueue.tsx
│   │   ├── LeadsCRM.tsx
│   │   └── ConnectedTools.tsx
│   ├── workflows/
│   │   ├── WorkflowHub.tsx
│   │   ├── GoalStrip.tsx
│   │   ├── WorkflowCard.tsx
│   │   └── WizardShell.tsx
│   ├── newsletter/
│   │   ├── DataPanel.tsx
│   │   ├── MichelleInputs.tsx
│   │   ├── EmailPreview.tsx
│   │   ├── LindyHandoff.tsx
│   │   └── PipelineStages.tsx
│   ├── voice/
│   │   ├── VoiceProfile.tsx
│   │   └── TraitBar.tsx
│   ├── inbox/
│   │   ├── InboxList.tsx
│   │   └── ApprovalCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── StreamingText.tsx
│       ├── ToggleSwitch.tsx
│       └── DataSource.tsx
├── lib/
│   ├── claude.ts                     # Claude API client + streaming helper
│   ├── prompts.ts                    # All prompt templates (see Section 5)
│   ├── guesty.ts                     # Guesty data fetcher
│   ├── pricelabs.ts                  # PriceLabs data fetcher
│   ├── turno.ts                      # Turno data fetcher
│   ├── reviews.ts                    # Multi-platform review aggregator
│   ├── voice.ts                      # Voice profile builder
│   ├── gmail.ts                      # Gmail OAuth + draft creation
│   ├── lindy.ts                      # Lindy webhook sender
│   └── data.ts                       # Assembled DataPackage type
├── types/
│   ├── client.ts                     # Client config type
│   ├── owner.ts                      # Property owner type
│   ├── property.ts                   # Property + stats type
│   └── voice.ts                      # VoiceProfile type
├── .env.local                        # All secrets (see Section 3)
├── SPEC.md                           # This file
├── vercel.json
└── package.json
```

---

## Section 3 — Environment Variables

All API keys live server-side only. The Claude API key is called exclusively from `/api/claude/route.ts`. Never expose any key to the browser.

```env
# .env.local

ANTHROPIC_API_KEY=               # console.anthropic.com
GUESTY_API_KEY=                  # app.guesty.com > Settings > API Keys
PRICELABS_API_KEY=               # pricelabs.co > Account Settings > API
TURNO_API_TOKEN=                 # turno.com > Settings > Integrations
AIRBNB_API_KEY=                  # Airbnb host API credentials
VRBO_PARTNER_ID=                 # VRBO partner ID for connectivity API
BOOKINGCOM_API_KEY=              # Booking.com extranet connectivity key
HOSPITABLE_API_TOKEN=            # Hospitable read-only API token
GMAIL_CLIENT_ID=                 # Google OAuth client ID
GMAIL_CLIENT_SECRET=             # Google OAuth client secret
GMAIL_REFRESH_TOKEN=             # Michelle's Gmail refresh token (set during onboarding)
LINDY_WEBHOOK_SECRET=            # Shared secret for validating inbound Lindy calls
LINDY_OUTBOUND_URL=              # Lindy workflow HTTP trigger URL
SUPABASE_URL=                    # Supabase project URL
SUPABASE_SERVICE_KEY=            # Supabase service role key (server-side only)
NEXT_PUBLIC_APP_URL=             # e.g. https://peak.canopyaisolutions.com
```

---

## Section 4 — API Routes

### `/api/claude` — Claude proxy

All Claude calls go through this server-side proxy. Supports streaming via Server-Sent Events.

```
POST /api/claude
Body: { prompt: string, system?: string, stream?: boolean }
Returns: streamed text or JSON
```

```typescript
// lib/claude.ts
export async function streamClaude(prompt: string, system?: string) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system, stream: true }),
  });
  return res.body; // ReadableStream
}
```

### `/api/data` — Data aggregation

Single endpoint that calls all platform APIs in parallel and returns a typed `DataPackage`. Called at the start of every newsletter generation and monthly automation run.

```
GET  /api/data              Returns full DataPackage
GET  /api/guesty            Occupancy, revenue, bookings, cancellations
GET  /api/pricelabs         Market rates, demand forecast, booking windows
GET  /api/turno             Cleaning counts, ratings, flags, same-day turns
GET  /api/reviews           Aggregated reviews. Query: ?limit=10&stars=5
```

```typescript
// types/data.ts
export interface DataPackage {
  portfolio: {
    occupancy: number;        // e.g. 0.78
    avgNightlyRate: number;   // e.g. 247
    totalRevenue: number;     // e.g. 142380
    avgRating: number;        // e.g. 4.87
    newBookings: number;
    cancellationRate: number;
    period: string;           // e.g. "April 2026"
  };
  properties: Property[];
  market: {
    avgOccupancy: number;
    avgNightlyRate: number;
    summerDemandDelta: number;
    memorialDayOccupancy: number;
    bookingWindows: Record<string, number>;  // platform -> days ahead
  };
  ops: {
    cleaningsCompleted: number;
    avgCleanerRating: number;
    issuesFlagged: number;
    sameDayTurns: number;
  };
  reviews: Review[];
  pulledAt: string;  // ISO timestamp
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  occupancy: number;
  avgNightlyRate: number;
  revenue: number;
  rating: number;
  topReview: { text: string; author: string; platform: string; stars: number };
  ownerNote: string;
  badge: 'top-revenue' | 'top-rating' | 'most-booked' | null;
}

export interface Review {
  id: string;
  propertyId: string;
  text: string;
  author: string;
  platform: 'airbnb' | 'vrbo' | 'booking.com' | 'google';
  stars: number;
  date: string;
  replied: boolean;
}
```

### `/api/voice` — Voice profile

```
GET  /api/voice             Returns current VoiceProfile
POST /api/voice/scan        Triggers Lindy to scan Gmail sent folder
POST /api/voice/sample      Adds writing sample. Body: { sample: string }
```

```typescript
// types/voice.ts
export interface VoiceProfile {
  scannedAt: string;
  emailsAnalyzed: number;
  sentenceLength: 'short' | 'medium' | 'long';
  formality: number;            // 0-100
  signaturePhrase: string[];    // ["Here's what caught my eye", ...]
  avoidWords: string[];         // ["leverage", "synergy", ...]
  openingStyle: string;
  signOff: string;
  dataStyle: string;
  sampleQuote: string;
}
```

### `/api/newsletter` — Newsletter pipeline

```
POST /api/newsletter/generate    Generate draft from DataPackage + inputs. Streams.
POST /api/newsletter/humanize    Pass 1: rewrite in VoiceProfile. Body: { draft, voiceProfile }. Streams.
POST /api/newsletter/polish      Pass 2: tighten for clarity. Body: { humanized }. Streams.
POST /api/newsletter/handoff     Send final to Lindy for Gmail draft creation.
```

### `/api/owners` — Per-owner emails

```
GET  /api/owners                   List all owners with their property stats
POST /api/owners/[id]/generate     Generate personalized email for one owner. Streams.
POST /api/owners/generate-all      Generate all owner emails in parallel (Promise.all).
POST /api/owners/[id]/send         Approve and send one email via Lindy.
```

### `/api/gmail` — Gmail integration

```
GET  /api/gmail/auth               Initiates Google OAuth flow
GET  /api/gmail/callback           OAuth callback, stores refresh token in Supabase
POST /api/gmail/draft              Creates Gmail draft. Body: { to, subject, body }
```

### `/api/lindy` — Lindy webhook

```
POST /api/lindy/webhook            Receives inbound Lindy calls (verify HMAC-SHA256 signature)
POST /api/lindy/trigger            Sends outbound trigger to Lindy. Body: { event, payload }
```

---

## Section 5 — Claude Prompts

All prompts live in `lib/prompts.ts` as exported template functions. Never hardcode prompts inline in components.

### 1. Newsletter first draft

```typescript
export function newsletterDraftPrompt(data: DataPackage, inputs: MichelleInputs): string {
  return `You are writing a monthly owner newsletter for Peak Paradise Vacation Rental Management.
From Michelle, the operator, to her 14 property owners.

PORTFOLIO DATA (Guesty - ${data.portfolio.period}):
- Occupancy: ${(data.portfolio.occupancy * 100).toFixed(0)}% (market avg: ${(data.market.avgOccupancy * 100).toFixed(0)}%)
- Avg nightly rate: $${data.portfolio.avgNightlyRate} (market avg: $${data.market.avgNightlyRate})
- Total revenue: $${data.portfolio.totalRevenue.toLocaleString()} 
- Avg rating: ${data.portfolio.avgRating}
- New bookings: ${data.portfolio.newBookings}
- Cancellation rate: ${(data.portfolio.cancellationRate * 100).toFixed(1)}%

TOP PROPERTIES:
${data.properties.slice(0, 3).map(p =>
  `${p.name}: ${(p.occupancy * 100).toFixed(0)}% occ, $${p.avgNightlyRate}/night, $${p.revenue.toLocaleString()} revenue.
  Top review: "${p.topReview.text}" — ${p.topReview.author}, ${p.topReview.platform}, ${p.topReview.stars} stars`
).join('\n')}

MARKET DATA (PriceLabs):
- Market avg occupancy: ${(data.market.avgOccupancy * 100).toFixed(0)}% (we are at ${(data.portfolio.occupancy * 100).toFixed(0)}%)
- Market avg nightly rate: $${data.market.avgNightlyRate} (we are at $${data.portfolio.avgNightlyRate})
- Summer demand forecast: +${(data.market.summerDemandDelta * 100).toFixed(0)}% YoY
- Memorial Day projected market occupancy: ${(data.market.memorialDayOccupancy * 100).toFixed(0)}%
- Booking windows: ${Object.entries(data.market.bookingWindows).map(([p, d]) => `${p}: ${d} days`).join(', ')}

OPERATIONS (Turno):
- ${data.ops.cleaningsCompleted} cleanings completed, avg cleaner rating ${data.ops.avgCleanerRating}
- ${data.ops.issuesFlagged} issues flagged, ${data.ops.sameDayTurns} same-day turns

MICHELLE'S NOTES:
Working on: ${inputs.workingOn}
Owner action item: ${inputs.actionItem}
${inputs.shoutout ? `Shoutout: ${inputs.shoutout}` : ''}

Write sections: opening, numbers this month, standout properties (with reviews quoted naturally),
market intel, what we're working on, owner action item.
${inputs.shoutout ? 'Shoutout section.' : ''}
Warm closing from Michelle.

Rules:
- 350-420 words total
- No bullet points — natural paragraphs only
- Reference specific property names and review quotes
- First line must be: SUBJECT: [your subject line]
- Then a blank line, then the newsletter body
- Do not include section headers`;
}
```

### 2. Humanize pass

```typescript
export function humanizePrompt(draft: string, voice: VoiceProfile): string {
  return `You are editing a newsletter draft to match a specific person's writing voice exactly.
Do NOT change any facts, data, or overall structure. Only change voice and style.

VOICE PROFILE (extracted from ${voice.emailsAnalyzed} real sent emails):
- Sentence length: ${voice.sentenceLength} — avg 12 words per sentence
- Opening style: ${voice.openingStyle}
- Sign-off: always "${voice.signOff}"
- Data style: ${voice.dataStyle}
- Signature phrases to use naturally (do not force all of them): ${voice.signaturePhrase.join(', ')}
- Words and phrases to NEVER use: ${voice.avoidWords.join(', ')}
- Sample of her actual writing: "${voice.sampleQuote}"

DRAFT TO HUMANIZE:
${draft}

Rewrite in this person's exact voice. Keep all the data and key points intact.
Output only the rewritten newsletter — no commentary, no explanation.`;
}
```

### 3. Polish pass

```typescript
export function polishPrompt(humanized: string): string {
  return `Do a final professional polish pass on this newsletter.

Rules:
- Fix grammar and clarity issues only
- Do NOT change sentence structure or word choice unnecessarily — the voice is intentional
- Verify number consistency (no rounding mismatches between sections)
- Remove any redundant phrases
- Ensure the call to action is crisp and specific
- Preserve the opening and sign-off exactly as written
- Do not add any corporate language, formality, or filler

Output only the polished newsletter — no commentary.

Newsletter:
${humanized}`;
}
```

### 4. Per-owner personalized email

```typescript
export function ownerEmailPrompt(owner: Owner, prop: Property, data: DataPackage, voice: VoiceProfile): string {
  return `Write a short, warm, personal property performance email from Michelle at
Peak Paradise Vacation Rental Management to one of her property owners.

Owner: ${owner.name} (${owner.email})
Property: ${prop.name}
This month: ${(prop.occupancy * 100).toFixed(0)}% occupancy, $${prop.avgNightlyRate} avg/night, $${prop.revenue.toLocaleString()} revenue, ${prop.rating} avg rating
Context: ${prop.ownerNote}
Top guest review: "${prop.topReview.text}" — ${prop.topReview.author}, ${prop.topReview.platform}, ${prop.topReview.stars} stars
Market context: portfolio outperforming market by ${((data.portfolio.occupancy - data.market.avgOccupancy) * 100).toFixed(0)} occupancy points. Summer demand up ${(data.market.summerDemandDelta * 100).toFixed(0)}% YoY.

Michelle's voice: ${voice.openingStyle}. Sign-off: "${voice.signOff}".
Phrases to use naturally (1-2 max): ${voice.signaturePhrase.slice(0, 3).join(', ')}
Never use: ${voice.avoidWords.join(', ')}

Write a personalized email that:
- Feels like a real person wrote it, not a template
- Leads with something specific to THEIR property (not generic)
- Interprets their numbers with meaning, not just states them
- Includes their top guest review woven in naturally
- Gives one forward-looking insight or action item specific to their situation
- Closes warmly
- Is 180-240 words total

First line: SUBJECT: [subject line]
Then blank line, then email body. No markdown headers.`;
}
```

### 5. Review-to-video script

```typescript
export function reviewVideoScriptPrompt(
  review: Review,
  tone: 'warm' | 'professional' | 'upbeat',
  businessName: string,
  ownerName: string
): string {
  const toneDesc = {
    warm: 'Warm and personal — like a trusted friend who happens to know the business cold',
    professional: 'Sharp and confident — credible, data-aware, authoritative without being stiff',
    upbeat: 'High energy and casual — enthusiastic, punchy, designed for social media',
  }[tone];

  return `Write a 30-second video script for ${ownerName} at ${businessName}.
They will read this directly to camera. It must sound exactly like how a real person talks — not an ad.

Based on this real customer review:
"${review.text}" — ${review.author}, ${review.platform}, ${review.stars} stars

Tone: ${toneDesc}

Rules:
- Hook in the first 2 seconds that grabs attention
- Reference the specific detail from the review (don't be generic)
- End with a soft, natural call to action — not salesy
- Under 120 words
- Write ONLY the script — no stage directions, no labels, no preamble`;
}
```

### 6. Michelle's private briefing

```typescript
export function michelleBriefingPrompt(data: DataPackage): string {
  const flagged = data.properties.filter(p => p.occupancy < 0.70);
  const outperformBy = ((data.portfolio.occupancy - data.market.avgOccupancy) * 100).toFixed(0);
  
  return `Write a private 4-6 sentence briefing for Michelle (the property manager).
This is her internal summary before she reviews email drafts. She reads it in 30 seconds.

Data:
- Portfolio: ${(data.portfolio.occupancy * 100).toFixed(0)}% occupancy vs ${(data.market.avgOccupancy * 100).toFixed(0)}% market (+${outperformBy} pts)
- Revenue: $${data.portfolio.totalRevenue.toLocaleString()} (${data.portfolio.period})
- Top property: ${data.properties[0]?.name} at ${(data.properties[0]?.occupancy * 100).toFixed(0)}% occupancy
- Avg rating: ${data.portfolio.avgRating}
${flagged.length > 0
  ? `- FLAGGED PROPERTIES (below 70% threshold): ${flagged.map(p => `${p.name} at ${(p.occupancy * 100).toFixed(0)}%`).join(', ')}`
  : '- No properties below 70% occupancy threshold'}

Be direct. Flag anything that needs attention. No fluff. This is for Michelle's eyes only.`;
}
```

### 7. Platform captions (workflow step 4)

```typescript
export function platformCaptionsPrompt(
  review: Review,
  script: string,
  platforms: Array<'instagram' | 'facebook' | 'email'>,
  businessName: string
): string {
  const platformInstructions = {
    instagram: 'Instagram: punchy, 2-3 sentences, 3-5 relevant hashtags at the end',
    facebook: 'Facebook: slightly longer, conversational, no hashtags',
    email: 'Email: return as JSON { subject: string, body: string } — subject line + 2-sentence intro',
  };

  return `Write social media captions for: ${platforms.join(', ')}

Business: ${businessName}
The video is the owner talking about this customer review: "${review.text}"
The script they read: "${script.slice(0, 200)}..."

${platforms.map(p => platformInstructions[p]).join('\n')}

Return ONLY valid JSON with keys matching the platform names requested.
No markdown, no backticks, no preamble.
Example: { "instagram": "caption here", "facebook": "caption here", "email": { "subject": "...", "body": "..." } }`;
}
```

---

## Section 6 — Screens and Components

### 6.1 Onboarding wizard (`/onboarding`)

6-step wizard completed once per client. State stored in Supabase so it can be resumed.

**Step 1 — Welcome and business profile**
- Fields: company name, owner name, email, phone, logo upload, industry selector
- On complete: create record in `clients` table

**Step 2 — Connect your apps**
- One card per integration: Guesty, PriceLabs, Airbnb, VRBO, Booking.com, Turno, Hospitable
- Each card: service name, logo, description, Connect button
- Connect triggers OAuth flow or shows API key input
- Cards animate to green with checkmark as connections verify (poll `/api/integrations/status`)
- Can skip individual integrations and return later

**Step 3 — Build voice profile**
- Trigger Lindy to scan Gmail sent folder via `POST /api/voice/scan`
- Animated counter shows emails being scanned
- On complete: display extracted VoiceProfile traits, signature phrases, avoid words, sample quote
- Michelle confirms: "Yes, this sounds like me" or "Let me add a sample"
- Optional: paste a writing sample into textarea to refine profile

**Step 4 — Configure automation**
- Schedule: day of month picker (1-28), time picker, timezone selector
- Toggles: generate newsletter, generate owner emails, generate briefing, flag underperforming
- Review window: 2h / 4h / 8h / 24h selector
- Notification method: Gmail + SMS / Gmail only / SMS only
- If not reviewed: Hold / Send reminder then hold

**Step 5 — Test run**
- "Run a test now so you can see exactly what you'll receive every month"
- Button triggers full pipeline with real data
- Streams newsletter draft live into an email preview
- Shows pipeline stage tracker animating through all steps

**Step 6 — You're live**
- Confirmation hero: checkmark animation
- Summary: what was configured, first real run date
- "What happens next" — plain language explanation of the monthly flow
- CTA: "Go to your dashboard"

---

### 6.2 Main dashboard (`/dashboard`)

Data pulled fresh on page load via `GET /api/data`.

**Layout:** 4 stat cards → 2-col grid (content + reviews) → 3-col row (social + leads + tools)

**StatCard component**
```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  delta: number;
  deltaLabel: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'coral';
  sparklineData: number[];  // 7 values for mini bar chart
  onClick?: () => void;
}
```

**ContentWidget** — AI Content Writer
- Recent drafts list with type badge (Blog / Email / Listing) and status badge (Published / Scheduled / Draft)
- Prompt bar at top — clicking opens relevant workflow
- Generate button routes to workflow hub

**ReviewWidget** — Review Monitor
- Last 5 reviews across all platforms, sorted by recency
- Each review: platform badge, stars, text excerpt, "Draft AI Reply" button
- Draft AI Reply: calls `/api/claude` with the review text, streams reply into a modal

**SocialQueue** — Social Scheduler
- Next 3 scheduled posts with platform badge and scheduled time
- Each post clickable to edit
- Add Post button

**LeadsCRM** — Leads
- Last 4 leads: avatar initials, name, source, stage badge (Hot / Warm / New), deal value
- View CRM button goes to a full leads table page

**ConnectedTools**
- Grid of tool tiles: Loom, Potion, Lindy with live status
- Each tile: icon, name, connection status dot
- Add More button (upsell)

---

### 6.3 Workflow hub (`/workflows`)

Goal-organized workflow library.

**Goal categories (4 horizontal strips):**
1. Get More Reviews and Credibility
2. Grow Online and Stay Visible  
3. Convert and Follow Up on Leads
4. Stay Compliant and Informed

**WorkflowCard component**
```typescript
interface WorkflowCardProps {
  id: string;
  icon: string;           // emoji
  name: string;
  stepCount: number;
  estimatedMinutes: number;
  tools: string[];        // ["Google", "Claude", "Loom"]
  isAIPowered: boolean;   // shows purple AI badge
  badge?: string;         // "Popular" | "Fast" | null
  color: string;          // accent color for hover border
}
```

**Workflow config array** — stored in `lib/workflows.ts`. Adding a new workflow requires only adding a config entry.

```typescript
export const workflows: WorkflowConfig[] = [
  {
    id: 'review-to-video',
    goalCategory: 'reviews',
    icon: '🎬',
    name: 'Turn reviews into a short video',
    stepCount: 4,
    estimatedMinutes: 10,
    tools: ['Google', 'Claude', 'Loom'],
    isAIPowered: true,
    badge: 'Popular',
    color: 'amber',
  },
  // ... more workflows
];
```

---

### 6.4 Workflow wizard (`/workflows/[id]`)

Step-by-step guided interface. One screen at a time. Reference implementation: **Review to Video**.

**WizardShell component** — handles step state, progress track, back/next navigation
- Progress track: numbered dots with labels, connecting lines, active/done/waiting states
- Step 2 (AI step) uses purple styling instead of blue

**Review to Video — step details:**

**Step 1 — Pick review**
- RadioGroup-style review selection list (3 reviews from Google/Airbnb/VRBO)
- Tone picker: 3-card grid (Warm 🤗 / Professional 💼 / Upbeat 🎉)
- Generate button disabled until both review and tone selected

**Step 2 — AI script (live Claude call)**
- Calls `streamClaude(reviewVideoScriptPrompt(review, tone, businessName, ownerName))`
- StreamingText component shows script appearing word by word
- Word count updates in real time
- On complete: show "What changed" log, regeneration chips, edit button
- Regeneration chips: "Make it shorter" / "Stronger CTA" / "More conversational" / "Lead with results"
- Edit button: toggles script from display div to `contenteditable` textarea

**Step 3 — Record**
- Instructional numbered steps for Loom
- Script preview block (first 120 chars) for reference while recording
- Tip callout about trimming in Loom

**Step 4 — Share**
- Platform picker: Instagram / Facebook / Email (multi-select)
- On any selection: calls `/api/claude` with `platformCaptionsPrompt()`, streams captions per platform
- Each platform caption appears in a card as it streams

**Success screen**
- Completion chips for each step
- 2 suggested next workflows

---

### 6.5 Newsletter generator (`/newsletter`)

Two-column layout. Left: data + inputs. Right: live email preview.

**DataPanel** — collapsible sections
- Portfolio Performance (Guesty): 6 stat rows with delta indicators
- Standout Properties: 3 property cards with stats grid and top review quote
- Market Data (PriceLabs): stat rows + horizontal bar chart for booking windows
- Operations (Turno): 4 stat rows

**MichelleInputs**
```typescript
interface MichelleInputs {
  workingOn: string;       // required
  actionItem: string;      // required
  shoutout?: string;       // optional
  tone: 'warm-professional' | 'data-forward' | 'motivational';
}
```

**Generation flow:**
1. Validate required fields
2. `POST /api/newsletter/generate` — streams into EmailPreview
3. On complete → `POST /api/newsletter/humanize` — streams updated version
4. On complete → `POST /api/newsletter/polish` — streams final version
5. Enable "Hand off to Lindy" button

**EmailPreview component**
- Styled email shell with dark header, stat bar (3 key numbers), body
- Extracts subject line from first line of Claude output (format: `SUBJECT: ...`)
- Shows subject line separately above the email frame
- Body renders with `<h2>` section headers and paragraph spacing

**LindyHandoff panel**
- 4-step workflow display (Claude done → Lindy creates draft → Michelle reviews → All sent)
- "Hand off to Lindy" button: `POST /api/lindy/trigger` with `{ event: 'newsletter.handoff', payload: { subject, body } }`
- Steps animate as Lindy responds via webhook
- On draft created: show "Open Gmail Draft" button

---

### 6.6 Monthly automation (`/newsletter/automation`)

Three tabs: Configure | Run History | Approval Inbox

**Configure tab**
- Schedule: day picker, time picker, timezone selector — live timeline preview updates as values change
- What gets generated: 4 toggle rows
- Data sources: status grid showing all 7 integrations with connected/pending badges
- Review window: selector + notification method + if-not-reviewed behavior
- Warning callout: "Nothing ever sends without Michelle's explicit approval"
- Activate button: `POST /api/lindy/trigger` with `{ event: 'activation', config }` — writes to Supabase `automation_config`
- Status pill in topbar goes green on activation

**Run History tab**
- List of past runs: month label, date/time, what was generated, review time, status badge
- Clicking a run shows audit log: each pipeline stage with timestamp, duration, and metadata

**Approval Inbox tab**
- List of pending drafts (newsletter + individual owner emails)
- Unread dot on each item
- Clicking an item shows:
  - Claude's private briefing at the top (purple callout box)
  - Full draft preview (editable)
  - Review window countdown timer
  - "Approve and Send All" button → `POST /api/lindy/trigger` with `{ event: 'approved', runId }`
  - "Request Changes" button → re-runs humanize pass with instruction

---

### 6.7 Per-owner emails (`/owners`)

Three-column layout: owner list | email editor | property stats

**Generate All Emails button**
- Calls `POST /api/owners/generate-all`
- Server runs `Promise.all(owners.map(o => generateOwnerEmail(o)))` 
- Owner list status dots animate amber as each generates

**Owner list**
- Avatar initials with color per owner
- Name and property name
- Status dot: gray (not generated) → amber (generating) → blue (ready to review) → green (sent)

**Email editor — Gmail compose style**
- From field (locked)
- To field
- Subject field (extracted from Claude output)
- Body: `contenteditable` div for direct editing
- Toolbar: word count, "Rewrite" button (re-calls Claude for this owner)
- "Approve and Send via Lindy" button → `POST /api/owners/[id]/send`
- "Skip →" button advances to next unsent owner
- Auto-advance after approving: loads next unsent owner automatically

**Property stats panel** (right column)
- 2x2 stat grid: occupancy, avg/night, revenue, rating
- Top review quote card
- Updates when different owner selected

---

### 6.8 Voice profile (`/voice`)

**Gmail scan section**
- Last scanned date + email count
- Re-scan button: `POST /api/voice/scan` → shows animated counter
- Connection status for Gmail

**Detected patterns (4 cards):**
1. Opening style
2. Sentence structure
3. Number presentation style
4. Sign-off style

**Signature phrases** — amber pill badges  
**Words to avoid** — coral pill badges with strikethrough

**Writing sample input**
- Textarea: "Paste an email you've sent that feels most like you"
- `POST /api/voice/sample` — adds to profile

---

### 6.9 Settings / Integrations (`/settings/integrations`)

One card per integration. Each card:
- Service name and logo
- Connection status badge (Connected / Pending / Error)
- Last sync timestamp
- Reconnect button (re-triggers OAuth or key input)
- Disconnect button

---

## Section 7 — Database Schema (Supabase)

```sql
-- One row per Canopy AI client
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_name text,
  owner_email text,
  industry text,
  logo_url text,
  primary_color text default '1E3A5F',
  package_tier text default 'growth',  -- 'starter' | 'growth' | 'pro'
  created_at timestamptz default now()
);

-- API keys and OAuth tokens per client per service
create table integrations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  service text not null,
  -- service values: 'guesty' | 'pricelabs' | 'turno' | 'airbnb' | 'vrbo' | 'bookingcom' | 'hospitable' | 'lindy' | 'gmail'
  status text default 'pending',       -- 'pending' | 'connected' | 'error'
  credentials jsonb,                    -- encrypted at rest in Supabase Vault
  last_synced_at timestamptz,
  error_message text,
  unique(client_id, service)
);

-- Voice profile — rebuilt on each Gmail scan
create table voice_profiles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  scanned_at timestamptz,
  emails_analyzed integer,
  profile jsonb,                        -- VoiceProfile object
  sample_additions text[],              -- manually pasted writing samples
  unique(client_id)
);

-- Automation schedule and config
create table automation_config (
  client_id uuid primary key references clients(id) on delete cascade,
  run_day integer default 1,            -- 1-28
  run_time text default '07:00',        -- HH:MM
  timezone text default 'America/New_York',
  generate_newsletter boolean default true,
  generate_owner_emails boolean default true,
  generate_briefing boolean default true,
  flag_underperforming boolean default true,
  underperforming_threshold numeric default 0.70,
  review_window_hours integer default 4,
  notify_gmail boolean default true,
  notify_sms boolean default true,
  notify_phone text,
  if_not_reviewed text default 'hold',  -- 'hold' | 'remind_then_hold'
  is_active boolean default false,
  lindy_workflow_id text
);

-- Log of every automation pipeline run
create table automation_runs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  status text default 'running',        -- 'running' | 'awaiting_approval' | 'sent' | 'error'
  is_test boolean default false,
  stages jsonb,                          -- [{ stage, startedAt, completedAt, durationMs, meta }]
  newsletter_draft text,
  newsletter_humanized text,
  newsletter_polished text,
  newsletter_subject text,
  owner_emails jsonb,                    -- [{ ownerId, ownerName, subject, body, status }]
  briefing text,
  approved_at timestamptz,
  approved_changes text,
  sent_at timestamptz,
  emails_sent integer
);

-- Cached API responses to avoid redundant calls
create table data_cache (
  client_id uuid references clients(id),
  source text,                          -- 'guesty' | 'pricelabs' | 'turno' | 'reviews'
  data jsonb,
  cached_at timestamptz default now(),
  expires_at timestamptz,
  primary key (client_id, source)
);

-- Property owners
create table owners (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  property_name text,
  property_id_guesty text,
  notes text,
  avatar_color text
);
```

**Caching strategy:**
- Guesty and PriceLabs: 6-hour TTL, refreshed at start of each automation run
- Reviews: 2-hour TTL
- Voice profile: no expiry — rebuilt only on manual re-scan trigger
- If any source fails during an automation run: use most recent cached data and log the error

---

## Section 8 — Lindy Integration

### What Lindy handles

Lindy is the automation orchestrator. The Next.js app handles all UI, data fetching, and Claude calls. Lindy handles: scheduling, Gmail draft creation, SMS/email notifications, and the approval wait state.

### Inbound webhook events (Lindy → app)

All inbound requests include `X-Lindy-Signature` header. Verify with HMAC-SHA256 using `LINDY_WEBHOOK_SECRET`.

```typescript
// Events received at POST /api/lindy/webhook
type LindyInboundEvent =
  | { event: 'run.started';   runId: string; clientId: string }
  | { event: 'run.completed'; runId: string; stages: Stage[] }
  | { event: 'run.error';     runId: string; error: string }
```

### Outbound events (app → Lindy)

```typescript
// Sent via POST to LINDY_OUTBOUND_URL
type LindyOutboundEvent =
  | { event: 'approved';            runId: string; clientId: string }
  | { event: 'changes.requested';   runId: string; instruction: string }
  | { event: 'activation';          clientId: string; config: AutomationConfig }
  | { event: 'newsletter.handoff';  clientId: string; subject: string; body: string }
  | { event: 'owner.send';          clientId: string; ownerId: string; subject: string; body: string; to: string }
```

### Lindy workflow template — 15 steps

The Lindy workflow is a JSON template clients import. Template name: **"Canopy AI Monthly Owner Email"**

1. **Trigger:** Cron (configured per client)
2. **HTTP GET:** `{APP_URL}/api/data?clientId={clientId}` → store as `dataPackage`
3. **HTTP GET:** `{APP_URL}/api/voice?clientId={clientId}` → store as `voiceProfile`
4. **HTTP POST:** `{APP_URL}/api/newsletter/generate` body: `{ dataPackage, inputs }` → store as `draft`
5. **HTTP POST:** `{APP_URL}/api/newsletter/humanize` body: `{ draft, voiceProfile }` → store as `humanized`
6. **HTTP POST:** `{APP_URL}/api/newsletter/polish` body: `{ humanized }` → store as `polished`
7. **HTTP POST:** `{APP_URL}/api/owners/generate-all` body: `{ dataPackage, voiceProfile }` → store as `ownerEmails[]`
8. **HTTP POST:** `{APP_URL}/api/newsletter/briefing` body: `{ dataPackage }` → store as `briefing`
9. **Gmail:** Create draft (newsletter) — to: owners list, subject: extracted, body: `polished`
10. **Gmail loop:** Create draft for each item in `ownerEmails[]`
11. **Gmail:** Create draft (briefing) — to: michelle only, subject: "Private briefing — {month}"
12. **HTTP POST:** `{APP_URL}/api/lindy/webhook` — `{ event: 'run.completed', runId, stages }`
13. **Notify:** Gmail + SMS to Michelle with deep link to approval inbox
14. **Webhook wait:** Pause until `POST {APP_URL}/api/lindy/webhook` with `{ event: 'approved', runId }`
15. **Gmail:** Send all approved drafts → **HTTP POST:** `{ event: 'run.sent', runId, emailsSent }`

---

## Section 9 — Deployment

### vercel.json

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "GUESTY_API_KEY": "@guesty-api-key",
    "PRICELABS_API_KEY": "@pricelabs-api-key",
    "TURNO_API_TOKEN": "@turno-api-token",
    "GMAIL_CLIENT_ID": "@gmail-client-id",
    "GMAIL_CLIENT_SECRET": "@gmail-client-secret",
    "GMAIL_REFRESH_TOKEN": "@gmail-refresh-token",
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_SERVICE_KEY": "@supabase-service-key",
    "LINDY_WEBHOOK_SECRET": "@lindy-webhook-secret",
    "LINDY_OUTBOUND_URL": "@lindy-outbound-url",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

### Domain pattern

Each client gets a subdomain: `peak.canopyaisolutions.com`  
Add CNAME record pointing to `cname.vercel-dns.com`

### Launch checklist

- [ ] All environment variables set in Vercel project settings
- [ ] Supabase tables created, RLS policies enabled
- [ ] Client record created in `clients` table
- [ ] All integrations connected via onboarding wizard
- [ ] Gmail OAuth completed and refresh token stored
- [ ] Lindy template imported and workflow activated
- [ ] Lindy outbound URL set to deployed `/api/lindy/webhook`
- [ ] Test run completed and draft reviewed
- [ ] Automation config saved and `is_active` set to true
- [ ] Michelle confirmed she received the test notification

---

## Section 10 — Multi-Client Architecture

Every new Canopy AI client is a **configuration record**, not a new codebase. Adding a client is an operational task, not an engineering task.

### To onboard a new client

1. Create a record in `clients` table in Supabase
2. Point a new subdomain at the Vercel deployment
3. Send client their onboarding link: `https://[subdomain].canopyaisolutions.com/onboarding`
4. Client completes 6-step onboarding wizard
5. Import Lindy template into client's Lindy account, set their subdomain as webhook URL
6. Done — their automation runs independently

### Client isolation

Every API call, data fetch, automation run, and voice profile is scoped by `clientId`. The `clientId` is stored in the session and verified server-side on every request. No client data is ever visible to another client.

### Per-client configuration points

- **Data sources:** swappable per industry (Guesty for VRM, Square for restaurants, Clio for law firms)
- **Workflow library:** each client sees only relevant workflows — controlled by `workflows[]` array in client config
- **Package tier:** Starter (3 tools) / Growth (6 tools) / Pro (unlimited) — controls sidebar visibility and enabled API sources
- **Branding:** client logo, primary color, and business name applied to dashboard shell from `clients` table

---

## Section 11 — Build Order for Claude Code

### Starting prompt

```
Read SPEC.md in full, then build the Canopy AI Dashboard platform exactly as specified.
Start with Phase 1 below. Use Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase.
All Claude API calls must go through a server-side proxy route at /api/claude
and must never expose the API key to the browser.
```

### Phase 1 — Foundation (Day 1)

1. Scaffold Next.js app with TypeScript and Tailwind (already done if you ran create-next-app)
2. Create Supabase project and run the full schema from Section 7
3. Build the layout shell: `Topbar.tsx`, `Sidebar.tsx`, `NavItem.tsx`, root `layout.tsx`
4. Create `/api/claude/route.ts` with full streaming support via Server-Sent Events
5. Set all environment variables in Vercel and `.env.local`

### Phase 2 — Newsletter pipeline (Day 1–2)

1. Build `/api/data/route.ts` with mock data returns (real API calls come later)
2. Build `/newsletter/page.tsx` with `DataPanel` and `MichelleInputs` components
3. Wire Generate button to `/api/newsletter/generate` with streaming into `EmailPreview`
4. Build `EmailPreview` component with subject line extraction and styled email shell
5. Add humanize pass (`/api/newsletter/humanize`) as sequential call after generation
6. Add polish pass (`/api/newsletter/polish`) as final sequential call
7. Build `LindyHandoff` panel with animated workflow step progression

### Phase 3 — Workflows (Day 2–3)

1. Build `WorkflowHub` with goal strips and horizontally scrolling `WorkflowCard` grid
2. Build `WizardShell` with progress track, step state management, and back navigation
3. Implement Review to Video workflow end-to-end with live Claude streaming
4. Add platform caption generation on step 4 platform selection

### Phase 4 — Owner emails and automation (Day 3–4)

1. Build `/owners/page.tsx` with three-column layout
2. Implement batch generation with `Promise.all` in `/api/owners/generate-all`
3. Build approval inbox with per-item approval flow and Lindy trigger
4. Build `/newsletter/automation/page.tsx` with Configure, Run History, and Approval Inbox tabs
5. Wire Lindy webhook receiver (`/api/lindy/webhook/route.ts`) and outbound trigger

### Phase 5 — Real API connections (Day 4–5)

1. Replace mock data in `/api/guesty` with real Guesty API calls
2. Add real PriceLabs, Turno, Airbnb, VRBO, Booking.com API calls
3. Implement Gmail OAuth flow (`/api/gmail/auth` and `/api/gmail/callback`)
4. Implement Gmail draft creation (`/api/gmail/draft`)
5. Build voice profile scan flow via Lindy Gmail action
6. End-to-end test: full monthly automation pipeline trigger to approval

### Phase 6 — Onboarding and polish (Day 5)

1. Build 6-step onboarding wizard at `/onboarding`
2. Add integration connection status and reconnect flows at `/settings/integrations`
3. Build main dashboard at `/dashboard` with all stat cards and tool widgets
4. Mobile responsiveness pass
5. Deploy to Vercel, connect subdomain, hand off to client

---

*Canopy AI Solutions — canopyaisolutions.com — Full Product Specification v1.0*
